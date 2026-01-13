/**
 * Drag & Drop logic for DataInputVirtualScroll
 * Reused from DataInputRefactor with minimal dependencies.
 */
import { ref, type Ref } from 'vue';

const isDragOver: Ref<boolean> = ref(false);
let dragCounter = 0;

function handleDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    dragCounter++;
    if (event.dataTransfer?.items) {
        const hasFiles = Array.from(event.dataTransfer.items).some((i) => i.kind === 'file');
        if (hasFiles)
            isDragOver.value = true;
    }
}

function handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer)
        event.dataTransfer.dropEffect = 'copy';
}

function handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    dragCounter--;
    if (dragCounter === 0)
        isDragOver.value = false;
}

function isExcelFile(file: File): boolean {
    const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    const exts = ['.xlsx', '.xls'];
    const dotIndex = file.name.lastIndexOf('.');
    const ext = dotIndex !== -1 ? file.name.toLowerCase().slice(dotIndex) : '';
    return allowedTypes.includes(file.type) || exts.includes(ext);
}

function handleDrop(event: DragEvent, onFileDropped: (file: File) => void): void {
    event.preventDefault();
    event.stopPropagation();
    isDragOver.value = false;
    dragCounter = 0;
    if (event.dataTransfer?.files?.length) {
        const file = event.dataTransfer.files[0];
        if (isExcelFile(file)) {
            onFileDropped(file);
        }
        else {
            // eslint-disable-next-line no-console
            console.warn('엑셀 파일만 업로드 가능합니다.');
        }
    }
}

export function useDragDrop() {
    function setupDragDropListeners(onFileDropped: (file: File) => void): () => void {
        const enter = (e: DragEvent) => handleDragEnter(e);
        const over = (e: DragEvent) => handleDragOver(e);
        const leave = (e: DragEvent) => handleDragLeave(e);
        const drop = (e: DragEvent) => handleDrop(e, onFileDropped);
        document.addEventListener('dragenter', enter as EventListener);
        document.addEventListener('dragover', over as EventListener);
        document.addEventListener('dragleave', leave as EventListener);
        document.addEventListener('drop', drop as EventListener);
        return () => {
            document.removeEventListener('dragenter', enter as EventListener);
            document.removeEventListener('dragover', over as EventListener);
            document.removeEventListener('dragleave', leave as EventListener);
            document.removeEventListener('drop', drop as EventListener);
        };
    }
    return { isDragOver, setupDragDropListeners };
}
