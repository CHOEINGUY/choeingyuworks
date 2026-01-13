import { ref, computed, nextTick, type Ref } from 'vue';
import { findEmailSuggestion } from './inputHandlers';

export function useEmailAutocomplete(inputRef: Ref<HTMLInputElement | null>) {
  const userInput = ref('');
  const suggestion = ref('');
  
  const displayValue = computed(() => userInput.value + suggestion.value);
  
  // This helper will manage the selection range to highlight the suggestion part
  function updateSelection() {
    // Only update if there is a suggestion and we have a ref
    if (suggestion.value && inputRef.value) {
      // Use nextTick to ensure the DOM has updated with the new value
      nextTick(() => {
        // Double check ref availability after tick
        if (!inputRef.value) return;
        
        const startPos = userInput.value.length;
        const endPos = displayValue.value.length;
        
        // Setting selection range highlights the suggestion
        inputRef.value.setSelectionRange(startPos, endPos);
      });
    }
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    
    // Basic detection of cursor position or if user is deleting
    // If user is deleting (backspace), we often want to clear suggestion to avoid annoyance
    // But input event doesn't give key info easily. 
    // We rely on the logic that if exact match fails or length decreases, we might want to reset.
    
    const atIndex = value.lastIndexOf('@');
    
    if (atIndex === -1) {
      // No @ symbol, just update input
      userInput.value = value;
      suggestion.value = '';
    } else {
      const domainPart = value.slice(atIndex + 1);
      
      // If domain part is empty (just typed @), or matches a domain
      if (domainPart) {
        const found = findEmailSuggestion(domainPart);

        if (found) {
          // If we found a suggestion
          userInput.value = value.slice(0, atIndex + 1) + domainPart;
          suggestion.value = found.substring(domainPart.length);
        } else {
           userInput.value = value;
           suggestion.value = '';
        }
      } else {
        userInput.value = value;
        suggestion.value = '';
      }
      
      // Update parent model
      
      nextTick(() => {
        if (suggestion.value && inputRef.value) {
          // Force update the input value because Vue might not detect a change if displayValue is same
          if (inputRef.value.value !== displayValue.value) {
            inputRef.value.value = displayValue.value;
          }
          inputRef.value.setSelectionRange(userInput.value.length, displayValue.value.length);
        }
      });
    }
    
    updateSelection();
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (!suggestion.value) return;
    
    // If user accepts suggestion with Tab, Enter, or Right Arrow
    if (e.key === 'Tab' || e.key === 'Enter' || e.key === 'ArrowRight') {
      const target = e.target as HTMLInputElement;
      // Only accept if cursor is at the end of user input (beginning of selection)
      if (target.selectionStart === userInput.value.length) {
        e.preventDefault();
        // Commit the suggestion
        userInput.value = displayValue.value;
        suggestion.value = '';
        
        // Move cursor to end
        nextTick(() => {
          if (inputRef.value) {
            inputRef.value.setSelectionRange(userInput.value.length, userInput.value.length);
          }
        });
        
        // Provide hook for tab if needed? 
        // For now, let caller handle focus jumps if they want, 
        // but often preventing default tab means we consume the event.
        // If it was Tab, we might still want to move focus? 
        // Let's return true if we consumed it.
      }
    }
    
    // If user hits Backspace while suggestion is active
    if (e.key === 'Backspace') {
      // If we blindly backspace, it might delete the suggestion selection 
      // which is native behavior, but we want to clean up state
      e.preventDefault();
      userInput.value = userInput.value.slice(0, -1);
      suggestion.value = '';
      // Cursor will fall back naturally or we set it?
      nextTick(() => {
        if(inputRef.value) {
            inputRef.value.value = userInput.value;
            inputRef.value.setSelectionRange(userInput.value.length, userInput.value.length);
        }
      })
    }
  }

  // Allow resetting
  function reset() {
    userInput.value = '';
    suggestion.value = '';
  }
  
  // Set explicit value (e.g. from parent)
  function setValue(val: string) {
    userInput.value = val;
    suggestion.value = '';
  }

  return {
    userInput,
    suggestion,
    displayValue,
    handleInput,
    handleKeydown,
    reset,
    setValue
  };
}
