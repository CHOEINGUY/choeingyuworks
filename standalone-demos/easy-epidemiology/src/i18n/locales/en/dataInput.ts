export default {
  functionBar: {
    valueLabel: 'Value',
    currentCellValue: 'Current Cell Value',
    undo: 'Undo',
    redo: 'Redo',
    filter: 'Filter',
    filterApplied: 'Applied',
    filterTooltip: 'Filter Applied ({filtered}/{total} rows shown)',
    confirmedCase: 'Confirmed',
    toggleConfirmedTooltip: 'Toggle visibility of Confirmed Case column',
    exposure: 'Exposure Time',
    toggleExposureTooltip: 'Toggle visibility of Individual Exposure Time column',
    excelUploadTooltip: 'Import data from Excel file (replaces current sheet)',
    downloadTemplate: 'Template',
    basicTemplate: 'Basic Template',
    individualTemplate: 'Individual Exposure Template',
    exportData: 'Export',
    exportTooltip: 'Download all current data as Excel file',
    copyAll: 'Copy All',
    copyTooltip: 'Copy all data to clipboard',
    deleteEmptyCols: 'Del Empty Cols',
    deleteEmptyTooltip: 'Delete all columns with no data',
    resetSheet: 'Reset',
    resetTooltip: 'Reset all data and settings to empty sheet'
  },
  contextMenu: {
    copy: 'Copy',
    paste: 'Paste',
    clearCellData: 'Clear Cell Data',
    clearCellDataCount: 'Clear Cell Data ({count})',
    addRowAbove: 'Insert Row Above',
    addRowAboveCount: 'Insert Row Above ({count})',
    addRowBelow: 'Insert Row Below',
    addRowBelowCount: 'Insert Row Below ({count})',
    clearRowsData: 'Clear Row Data',
    clearRowsDataCount: 'Clear Row Data ({count})',
    deleteRows: 'Delete Row',
    deleteRowsCount: 'Delete Row ({count})',
    addColLeft: 'Insert Column Left',
    addColLeftCount: 'Insert Column Left ({count})',
    addColRight: 'Insert Column Right',
    addColRightCount: 'Insert Column Right ({count})',
    clearColsData: 'Clear Column Data',
    clearColsDataCount: 'Clear Column Data ({count})',
    deleteCols: 'Delete Column',
    deleteColsCount: 'Delete Column ({count})',
    deleteEmptyRows: 'Delete Empty Rows',
    clearAllFilters: 'Clear All Filters',
    emptyCell: 'Empty Cell'
  },
  datetime: {
    selectDateTime: 'Select Date & Time',
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    hour: 'Hour',
    minute: 'Min',
    manualInput: 'Manual Input',
    alertSelectDate: 'Please select a date.',
    yearSuffix: '',
    monthSuffix: '',
    daySuffix: '',
    weekdays: {
      sun: 'Sun',
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat'
    }
  },
  overlay: {
    dropExcel: 'Drop Excel file here'
  },
  validation: {
    validating: 'Validating Data...',
    errorCount: 'Errors: {count}'
  },
  excel: {
    importData: 'Import Data',
    processing: 'Processing... {progress}%'
  },
  toast: {
    success: 'System Success',
    error: 'System Error',
    warning: 'System Warning',
    info: 'System Info',
    confirmTitle: 'Confirmation Required',
    confirmContext: 'Do you want to continue?',
    excel: {
      uploadSuccess: 'Excel file uploaded successfully.',
      exportSuccess: 'Excel download completed.',
      templateSuccess: 'Template download completed.',
      templateError: 'Template download failed.',
      copyConfirm: 'Do you want to copy all data to clipboard? (May take time for large datasets)',
      copySuccess: 'All data copied to clipboard.',
      copyError: 'Data copy failed.'
    },
    grid: {
      rowsDeleted: 'Empty rows deleted.',
      rowsAdded: '{count} rows added.',
      colsDeleted: 'Empty columns deleted.',
      sheetReset: 'Sheet reset successfully.',
      exposureValidationComplete: 'Validation complete for {count} cells in Exposure Time column.',
      confirmedValidationComplete: 'Validation complete for {count} cells in Confirmed Case column.'
    },
    pasteSummary: 'Paste complete: {error} errors found in {total} cells ({rate}%)'
  },
  tooltips: {
    addColumn: 'Add Column',
    deleteColumn: 'Delete Column',
    minColumn: 'At least 1 column required'
  },
  headers: {
    serial: 'No.',
    isPatient: 'Patient <br />(1-Yes, 0-No)',
    confirmed: 'Confirmed <br />(1-Yes, 0-No)',
    basic: 'Basic Info',
    clinical: 'Symptoms <br />(1-Yes, 0-No)',
    exposure: 'Exposure Time',
    onset: 'Symptom Onset',
    diet: 'Diet <br />(1-Yes, 0-No)'
  },
  headerTooltips: {
    isPatient: 'Patient Status: 1 (Patient), 0 (Normal)',
    confirmed: 'Confirmed Status: 1 (Yes), 0 (No)',
    clinical: 'Symptom Presence: 1 (Yes), 0 (No)',
    diet: 'Diet History: 1 (Ate), 0 (Did not eat)'
  },
  bottomActions: {
    atBottom: 'At Bottom',
    addRows: 'Add Rows',
    deleteEmpty: 'Delete Empty Rows',
    filterTooltip: 'Cannot add rows while filter is active'
  }
};
