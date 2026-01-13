/// <reference lib="webworker" />

import { validateCell } from '../../store/utils/validation';
import { GridRow, GridHeader } from '@/types/grid';

// Define the shape of the error object we return
interface CellError {
  row: number;
  col: number; // This maps to meta.colIndex in the loop
  message?: string;
}

// Define the input message payload
interface ValidationWorkerPayload {
  rows: GridRow[];
  columnMetas: GridHeader[];
}

// Define the output message payloads
type ValidationWorkerResponse =
  | { type: 'done'; invalidCells: CellError[] }
  | { type: 'error'; error: string };

// Initial safety check for the environment
if (typeof self === 'undefined') {
  console.error('[ValidationWorker] self is undefined. This script must run in a Worker environment.');
}

// Worker error handler
(self as any).onerror = (error: Event | string) => {
  const message = typeof error === 'string' ? error : (error as ErrorEvent).message || 'Worker error';
  postMessage({ type: 'error', error: message });
};

// Main message handler
(self as any).onmessage = (e: MessageEvent<ValidationWorkerPayload>) => {
  try {
    const { rows, columnMetas } = e.data || {};

    if (!Array.isArray(rows) || !Array.isArray(columnMetas)) {
      postMessage({ type: 'error', error: 'Invalid payload: rows or columnMetas is not an array' });
      return;
    }

    const invalidCells: CellError[] = [];

    rows.forEach((row, rowIndex) => {
      columnMetas.forEach((meta) => {
        // Skip non-editable columns
        if (!meta.isEditable) return;

        let value: any = '';

        // Extract value based on meta definition
        if (meta.cellIndex !== null && meta.cellIndex !== undefined && meta.dataKey) {
           // If it's an array-based column (e.g. basicInfo['0-3'])
           // However, dataKey is usually the property name on the row object.
           // In GridHeader, dataKey is e.g. "basicInfo" or "symptomOnset".
           // But if cellIndex is present, it implies the row property is an array.
           // Let's coerce safely.
           const rowVal = row[meta.dataKey];
           if (Array.isArray(rowVal)) {
              value = rowVal[meta.cellIndex] ?? '';
           } else {
             // Fallback if structure doesn't match expected array
             value = '';
           }
        } else if (meta.dataKey) {
           // Standard property access
           value = row[meta.dataKey] ?? '';
        }

        const res = validateCell(value, meta.type);
        if (!res.valid) {
          // meta.colIndex is used for the grid coordinate
          invalidCells.push({ 
            row: rowIndex, 
            col: meta.colIndex ?? -1, // Fallback if undefined, though it should be defined
            message: res.message 
          });
        }
      });
    });

    // Send back the results
    postMessage({ type: 'done', invalidCells });

  } catch (error: any) {
    postMessage({ type: 'error', error: error.message || 'Validation error' });
  }
};

// Helper for type-safe posting
function postMessage(message: ValidationWorkerResponse) {
  (self as any).postMessage(message);
}
