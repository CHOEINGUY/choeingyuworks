import { ref } from 'vue';

export interface ValidationState {
  errors: Map<string, { message: string; timestamp: number }>;
  version: number;
}

export function useValidationLogic() {
  const validationState = ref<ValidationState>({
    errors: new Map(), // key: "row_col" or unique ID, value: { message, timestamp }
    version: 0
  });

  function setValidationErrors(errors: Map<string, { message: string; timestamp: number }>) {
    validationState.value.errors = errors;
    validationState.value.version++;
  }
  
  function setValidationVersion(version: number) {
    validationState.value.version = version;
  }
  
  function clearValidationErrors() {
    validationState.value.errors = new Map();
    validationState.value.version++;
  }
  
  function addValidationErrorByUniqueKey({ errorKey, message }: { errorKey: string; message: string }) {
    const newMap = new Map(validationState.value.errors);
    newMap.set(errorKey, { message, timestamp: Date.now() });
    validationState.value.errors = newMap;
    validationState.value.version++;
  }
  
  function removeValidationErrorByUniqueKey({ errorKey }: { errorKey: string }) {
    if (!validationState.value.errors.has(errorKey)) return;
    const newMap = new Map(validationState.value.errors);
    newMap.delete(errorKey);
    validationState.value.errors = newMap;
    validationState.value.version++;
  }

  return {
    validationState,
    setValidationErrors,
    setValidationVersion,
    clearValidationErrors,
    addValidationErrorByUniqueKey,
    removeValidationErrorByUniqueKey,
    addValidationError({ rowIndex, colIndex, message }: { rowIndex: number; colIndex: number; message: string }) {
        const key = `${rowIndex}_${colIndex}`;
        addValidationErrorByUniqueKey({ errorKey: key, message });
    },
    removeValidationError({ rowIndex, colIndex }: { rowIndex: number; colIndex: number }) {
        const key = `${rowIndex}_${colIndex}`;
        removeValidationErrorByUniqueKey({ errorKey: key });
    }
  };
}
