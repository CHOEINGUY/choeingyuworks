
import type { GridHeader, GridRow } from '@/types/grid';
import type { GridContext } from '@/types/virtualGridContext';

/**
 * 가상 스크롤용 키보드 네비게이션 핸들러
 */

/**
 * 셀이 네비게이션 가능한지 확인합니다.
 */
export function isCellNavigable(rowIndex: number, colIndex: number, allColumnsMeta: GridHeader[]): boolean {
    const column = allColumnsMeta.find(c => c.colIndex === colIndex);
    if (!column) return false;

    // 헤더 셀인 경우
    if (rowIndex < 0) {
        // headerRow === 2이고 편집 가능한 셀만 네비게이션 허용
        return column.headerRow === 2 && (column.isEditable || false);
    }

    // 바디 셀은 모두 네비게이션 가능 (기존 로직 유지)
    return true;
}

/**
 * 다음 네비게이션 가능한 셀을 찾습니다.
 */
export function findNextNavigableCell(
    currentRow: number, 
    currentCol: number, 
    direction: 'up' | 'down' | 'left' | 'right', 
    allColumnsMeta: GridHeader[], 
    totalRows: number, 
    totalCols: number
): { rowIndex: number; colIndex: number } {
    switch (direction) {
        case 'left':
            // 헤더에서 왼쪽으로 이동
            if (currentRow < 0) {
                for (let col = currentCol - 1; col >= 0; col--) {
                    if (isCellNavigable(currentRow, col, allColumnsMeta)) {
                        return { rowIndex: currentRow, colIndex: col };
                    }
                }
                // 더 이상 네비게이션 가능한 헤더 셀이 없으면 현재 위치 유지
                return { rowIndex: currentRow, colIndex: currentCol };
            } else {
                // 바디에서는 기존 로직 (환자여부(1) 열까지만)
                return { rowIndex: currentRow, colIndex: Math.max(1, currentCol - 1) };
            }

        case 'right':
            // 헤더에서 오른쪽으로 이동
            if (currentRow < 0) {
                for (let col = currentCol + 1; col < totalCols; col++) {
                    if (isCellNavigable(currentRow, col, allColumnsMeta)) {
                        return { rowIndex: currentRow, colIndex: col };
                    }
                }
                // 더 이상 네비게이션 가능한 헤더 셀이 없으면 바디로 이동
                return { rowIndex: 0, colIndex: 0 };
            } else {
                // 바디에서는 기존 로직
                return { rowIndex: currentRow, colIndex: Math.min(totalCols - 1, currentCol + 1) };
            }

        case 'up':
            if (currentRow > 0) {
                return { rowIndex: currentRow - 1, colIndex: currentCol };
            } else if (currentRow === 0) {
                // 바디에서 헤더로 이동 시, 네비게이션 가능한 헤더 셀 찾기
                if (isCellNavigable(-1, currentCol, allColumnsMeta)) {
                    return { rowIndex: -1, colIndex: currentCol };
                } else {
                    // 현재 열이 네비게이션 불가능하면 가장 가까운 네비게이션 가능한 헤더 셀 찾기
                    for (let col = currentCol; col >= 0; col--) {
                        if (isCellNavigable(-1, col, allColumnsMeta)) {
                            return { rowIndex: -1, colIndex: col };
                        }
                    }
                    for (let col = currentCol + 1; col < totalCols; col++) {
                        if (isCellNavigable(-1, col, allColumnsMeta)) {
                            return { rowIndex: -1, colIndex: col };
                        }
                    }
                    // 네비게이션 가능한 헤더 셀이 없으면 현재 위치 유지
                    return { rowIndex: currentRow, colIndex: currentCol };
                }
            }
            return { rowIndex: currentRow, colIndex: currentCol };

        case 'down':
            if (currentRow === -1) {
                return { rowIndex: 0, colIndex: currentCol };
            } else if (currentRow < totalRows - 1) {
                return { rowIndex: currentRow + 1, colIndex: currentCol };
            }
            return { rowIndex: currentRow, colIndex: currentCol };
    }
}

/**
 * Fast navigation (Ctrl+Arrow) - find next cell with data or boundary
 */
export function findNextCellForFastNavigation(
    currentRow: number, 
    currentCol: number, 
    direction: 'up' | 'down' | 'left' | 'right', 
    rows: GridRow[], 
    allColumnsMeta: GridHeader[]
): { rowIndex: number; colIndex: number } {
    const totalRows = rows.length;
    const totalCols = allColumnsMeta.length;

    switch (direction) {
        case 'up':
            // Jump to first row
            return { rowIndex: 0, colIndex: currentCol };
        case 'down':
            // Jump to last row
            return { rowIndex: totalRows - 1, colIndex: currentCol };
        case 'left':
            // Jump to first editable column (usually column 1)
            return { rowIndex: currentRow, colIndex: Math.max(1, 0) };
        case 'right':
            // Jump to last column
            return { rowIndex: currentRow, colIndex: totalCols - 1 };
        default:
            return { rowIndex: currentRow, colIndex: currentCol };
    }
}

/**
 * Handle navigation key down events (Arrow keys, Tab, Enter)
 */
export async function handleNavigationKeyDown(event: KeyboardEvent, context: GridContext): Promise<boolean> {
    const { selectionSystem, rows, allColumnsMeta, ensureCellIsVisible, focusGrid } = context;
    const { state } = selectionSystem;
    const { key, shiftKey } = event;
    const { rowIndex: currentRow, colIndex: currentCol } = state.selectedCell;

    if (currentRow === null || currentCol === null) return false;

    const totalRows = rows.value.length;
    const totalCols = allColumnsMeta.length;

    let direction: 'up' | 'down' | 'left' | 'right' | null = null;
    if (key === 'ArrowUp') direction = 'up';
    if (key === 'ArrowDown') direction = 'down';
    if (key === 'ArrowLeft') direction = 'left';
    if (key === 'ArrowRight') direction = 'right';

    if (direction) {
        event.preventDefault();
        const nextCell = findNextNavigableCell(currentRow, currentCol, direction, allColumnsMeta, totalRows, totalCols);
        
        if (shiftKey) {
            selectionSystem.extendSelection(nextCell.rowIndex, nextCell.colIndex);
        } else {
            selectionSystem.selectCell(nextCell.rowIndex, nextCell.colIndex);
        }

        if (ensureCellIsVisible) {
            await ensureCellIsVisible(nextCell.rowIndex, nextCell.colIndex);
        }
        return true;
    }

    // Tab key handling
    if (key === 'Tab') {
        event.preventDefault();
        const tabDirection = shiftKey ? 'left' : 'right';
        const nextCell = findNextNavigableCell(currentRow, currentCol, tabDirection, allColumnsMeta, totalRows, totalCols);
        
        selectionSystem.selectCell(nextCell.rowIndex, nextCell.colIndex);
        if (ensureCellIsVisible) {
            await ensureCellIsVisible(nextCell.rowIndex, nextCell.colIndex);
        }
        return true;
    }

    // Enter key in navigation mode
    if (key === 'Enter') {
        event.preventDefault();
        const nextCell = findNextNavigableCell(currentRow, currentCol, 'down', allColumnsMeta, totalRows, totalCols);
        
        selectionSystem.selectCell(nextCell.rowIndex, nextCell.colIndex);
        if (ensureCellIsVisible) {
            await ensureCellIsVisible(nextCell.rowIndex, nextCell.colIndex);
        }
        return true;
    }

    return false;
}
