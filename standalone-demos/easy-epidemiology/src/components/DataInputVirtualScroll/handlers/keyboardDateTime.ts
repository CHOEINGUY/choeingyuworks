
import { nextTick } from 'vue';
import { handleInlineEdit } from './virtualEditHandlers'; // Fixed import to virtualEditHandlers
import { calculatePickerPosition } from '../utils/uiUtils';
import type { GridHeader, GridRow } from '@/types/grid';
import type { GridContext } from '@/types/virtualGridContext';

/**
 * 날짜/시간 컬럼에서 타이핑을 시작하면 데이트피커를 활성화합니다.
 */
export async function handleDateTimeTypeToEdit(event: KeyboardEvent, context: GridContext, rowIndex: number, colIndex: number) {
    const { selectionSystem, allColumnsMeta, startEditing, getCellValue, rows, gridStore } = context;
    const { state } = selectionSystem;

    if (state.isEditing) return;

    const column = allColumnsMeta.find((c) => c.colIndex === colIndex);
    if (!column || !column.isEditable) return;

    console.log(`[DateTimeTypeToEdit] 날짜/시간 컬럼 타이핑 시작: ${rowIndex}, ${colIndex}, 입력: ${event.key}`);

    const row = rowIndex >= 0 ? rows.value[rowIndex] : null;
    startEditing(rowIndex, colIndex, getCellValue, row, gridStore as any, allColumnsMeta);
    
    await nextTick();

    const { parseDateTime } = await import('../utils/dateTimeUtils');
    const currentValue = context.getCellValue(row, column, rowIndex);
    const parsedDateTime = parseDateTime(currentValue as string);

    let cellRect: DOMRect;
    const cellSelector = rowIndex < 0 
        ? `[data-col="${colIndex}"]` 
        : `[data-row="${rowIndex}"][data-col="${colIndex}"]`;
    const cellElement = document.querySelector(cellSelector) as HTMLElement;

    if (cellElement) {
        cellRect = cellElement.getBoundingClientRect();
    } else {
        cellRect = (event.target as HTMLElement).getBoundingClientRect(); 
    }

    const pickerPosition = calculatePickerPosition(cellRect);

    if (cellElement) {
        setupDateTimeInputHandling(cellElement, event.key, null, context);
    }

    // 메인 컴포넌트의 상태 업데이트 (반응형 방식)
    if (context.dateTimePickerState) {
        context.dateTimePickerState.visible = true;
        context.dateTimePickerState.position = pickerPosition;
        // @ts-ignore
        context.dateTimePickerState.initialValue = parsedDateTime;
        
        context.dateTimePickerState.currentEdit = {
            rowIndex,
            colIndex,
            columnMeta: column
        };
        
        console.log('[DateTimePicker] Position set to:', pickerPosition);
    } else {
        console.warn('[DateTimePicker] dateTimePickerState not found in context');
        await handleInlineEdit(rowIndex, colIndex, event as unknown as MouseEvent, context);
    }
}

export function setupDateTimeInputHandling(cellElement: HTMLElement, initialKey: string, clickX: number | null = null, context: GridContext | null = null) {
    // @ts-ignore
    if (cellElement.__dtKeyHandler) {
        // @ts-ignore
        cellElement.removeEventListener('keydown', cellElement.__dtKeyHandler);
    }

    let digits = '';
    let originalDigitsCopied = false;

    const existingText = cellElement.textContent?.trim() || '';
    const existingMatch = existingText.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/);
    if (existingMatch) {
         digits = existingMatch.slice(1).join('');
         originalDigitsCopied = true; 
    }

    const DIGIT_RE = /\d/;

    const ensureSepStyle = () => {
        if (!document.getElementById('sep-style')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'sep-style';
            styleEl.textContent = '.sep.dim{color:#bbb;}.sep.on{color:#000;}';
            document.head.appendChild(styleEl);
        }
    };
    ensureSepStyle();

    const buildHTML = () => {
        const parts: string[] = [];
        const pushDigit = (idx: number) => {
            parts.push(idx < digits.length ? digits[idx] : '&nbsp;');
        };

        for (let i = 0; i < 4; i++) pushDigit(i); // YYYY
        parts.push(`<span class="sep ${digits.length >= 4 ? 'on' : 'dim'}">-</span>`);
        for (let i = 4; i < 6; i++) pushDigit(i); // MM
        parts.push(`<span class="sep ${digits.length >= 6 ? 'on' : 'dim'}">-</span>`);
        for (let i = 6; i < 8; i++) pushDigit(i); // DD
        parts.push(`<span class="sep ${digits.length >= 8 ? 'on' : 'dim'}">&nbsp;</span>`);
        for (let i = 8; i < 10; i++) pushDigit(i); // HH
        parts.push(`<span class="sep ${digits.length >= 10 ? 'on' : 'dim'}">:</span>`);
        for (let i = 10; i < 12; i++) pushDigit(i); // mm

        return parts.join('');
    };

    const setCaretByDigitPosition = (digitPosition: number) => {
        const maxPosition = Math.min(digitPosition, 12); 
        const getTextPosition = (pos: number) => {
            if (pos <= 4) return pos;              
            if (pos <= 6) return pos + 1;          
            if (pos <= 8) return pos + 2;            
            if (pos <= 10) return pos + 3;         
            return pos + 4;                        
        };

        const targetTextPosition = getTextPosition(maxPosition);
        let currentPosition = 0;
        const walker = document.createTreeWalker(cellElement, NodeFilter.SHOW_TEXT, null);
        let textNode: Node | null;

        while ((textNode = walker.nextNode())) {
            const nodeLength = textNode.textContent?.length || 0;
            if (currentPosition + nodeLength >= targetTextPosition) {
                const offsetInNode = targetTextPosition - currentPosition;
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(textNode, Math.min(offsetInNode, nodeLength));
                range.collapse(true);
                if (sel) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                return;
            }
            currentPosition += nodeLength;
        }

        const range = document.createRange();
        range.selectNodeContents(cellElement);
        range.collapse(false);
        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    const applyFormattedText = (useClick = false) => {
        cellElement.innerHTML = buildHTML();
        
        if (useClick && clickX !== null) {
            for (const node of Array.from(cellElement.childNodes)) {
                const el = node as HTMLElement;
                const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
                if (rect && clickX <= rect.left + rect.width / 2) {
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.setStartBefore(node);
                    range.collapse(true);
                    if (sel) {
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                    return;
                }
            }
        } else {
             setCaretByDigitPosition(digits.length);
        }

        cellElement.dispatchEvent(new Event('input', { bubbles: true }));

        if (context && context.dateTimePickerState) {
            updateDateTimePickerValue();
        }
    };

    const updateDateTimePickerValue = () => {
        if (!context || !context.dateTimePickerState) return;
        
        const formattedValue = formatDigitsToDateTime(digits);
        
        if (formattedValue) {
            import('../utils/dateTimeUtils').then(({ parseDateTime }) => {
                const parsedDateTime = parseDateTime(formattedValue);
                if (context.dateTimePickerState) {
                  // @ts-ignore
                  context.dateTimePickerState.initialValue = parsedDateTime;
                }
            });
        }
    };

    const formatDigitsToDateTime = (digitsStr: string): string => {
        if (digitsStr.length === 0) return '';
        
        const padded = digitsStr.padEnd(12, '0');
        
        const year = padded.slice(0, 4);
        const month = padded.slice(4, 6);
        const day = padded.slice(6, 8);
        const hour = padded.slice(8, 10);
        const minute = padded.slice(10, 12);
        
        const date = new Date(
            parseInt(year), 
            parseInt(month) - 1, 
            parseInt(day), 
            parseInt(hour), 
            parseInt(minute)
        );
        
        if (isNaN(date.getTime())) return '';
        
        return `${year}-${month}-${day} ${hour}:${minute}`;
    };

    const saveCurrentValue = async () => {
        if (!context || !context.dateTimePickerState || !context.dateTimePickerState.currentEdit) {
            console.warn('[DateTimeInput] No context or edit info for saving');
            return;
        }

        const { rowIndex, colIndex, columnMeta } = context.dateTimePickerState.currentEdit;
        
        try {
            const formattedValue = formatDigitsToDateTime(digits);
            
            if (formattedValue) {
                // Save using storageManager
                 const editData = {
                    cell: { rowIndex, colIndex, dataKey: columnMeta.dataKey || '', cellIndex: columnMeta.cellIndex },
                    originalValue: '',
                    value: formattedValue,
                    columnMeta,
                    editDuration: 0,
                    hasChanged: true 
                 };
                context.storageManager.executeSave(editData);
                context.storageManager.scheduleSave(editData);

                console.log(`[DateTimeInput] Auto-saved value: ${formattedValue} for cell: ${rowIndex}, ${colIndex}`);
                
                if (context.validationManager) {
                    context.validationManager.validateCell(rowIndex, colIndex, formattedValue, columnMeta.type, true);
                }

                context.gridStore.confirmEditing();
                context.selectionSystem.stopEditing(true);

                if (context.dateTimePickerState.visible) {
                    context.dateTimePickerState.visible = false;
                    context.dateTimePickerState.currentEdit = null;
                }
            } else {
                console.warn('[DateTimeInput] Invalid date format, cannot save');
            }
        } catch (error) {
            console.error('[DateTimeInput] Error saving value:', error);
        }
    };

    if (digits.length > 0) {
        applyFormattedText(true);
    } else if (existingText === '') {
        applyFormattedText(true);
    }

    if (DIGIT_RE.test(initialKey)) {
        digits += initialKey;
        applyFormattedText();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            if (originalDigitsCopied) {
                digits = '';
                originalDigitsCopied = false;
            } else {
                digits = digits.slice(0, -1);
            }
            applyFormattedText();
            return;
        }
        
        if (DIGIT_RE.test(e.key)) {
            e.preventDefault();
            if (originalDigitsCopied) {
                digits = e.key;
                originalDigitsCopied = false;
            } else if (digits.length < 12) {
                digits += e.key;
            }
            applyFormattedText();
            return;
        }
    };

    // @ts-ignore
    cellElement.__dtKeyHandler = handleKeyDown;
    // @ts-ignore
    cellElement.__dtSaveValue = saveCurrentValue; 

    cellElement.addEventListener('keydown', handleKeyDown);

    const handleMouse = (e: MouseEvent | Event) => {
        if (originalDigitsCopied) {
            originalDigitsCopied = false;
        }
        e.stopPropagation();
    };
    cellElement.addEventListener('mousedown', handleMouse);
    cellElement.addEventListener('click', handleMouse);
    // @ts-ignore
    cellElement.__dtStopProp = handleMouse;

    const cleanup = async () => {
        await saveCurrentValue();

        cellElement.removeEventListener('keydown', handleKeyDown);
        cellElement.removeEventListener('mousedown', handleMouse);
        cellElement.removeEventListener('click', handleMouse);
        cellElement.removeEventListener('blur', cleanup);
        // @ts-ignore
        delete cellElement.__dtKeyHandler;
        // @ts-ignore
        delete cellElement.__dtSaveValue;
        // @ts-ignore
        delete cellElement.__dtStopProp;
    };
    cellElement.addEventListener('blur', cleanup);

    if (!cellElement.getAttribute('contenteditable')) {
        cellElement.setAttribute('contenteditable', 'true');
    }
    cellElement.focus();
    
    if (digits.length > 0) {
        const sel = window.getSelection();
        if (sel) {
            const range = document.createRange();
            range.selectNodeContents(cellElement);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}
