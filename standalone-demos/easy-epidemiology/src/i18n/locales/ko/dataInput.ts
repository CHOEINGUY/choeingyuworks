export default {
  functionBar: {
    valueLabel: 'Value',
    currentCellValue: '현재 셀 값',
    undo: '실행 취소',
    redo: '다시 실행',
    filter: '필터',
    filterApplied: '적용됨',
    filterTooltip: '필터 적용됨 ({filtered}/{total} 행 표시)',
    confirmedCase: '확진자 여부',
    toggleConfirmedTooltip: '확진자 여부 열을 표시하거나 숨깁니다',
    exposure: '노출일시',
    toggleExposureTooltip: '개별 노출시간 열을 표시하거나 숨깁니다',
    excelUploadTooltip: 'Excel 파일에서 데이터를 가져와 현재 시트를 대체합니다',
    downloadTemplate: '양식 다운로드',
    basicTemplate: '기본 양식',
    individualTemplate: '개별 노출시간 양식',
    exportData: '데이터 내보내기',
    exportTooltip: '현재 입력된 모든 데이터를 Excel 파일로 다운로드합니다',
    copyAll: '전체 복사',
    copyTooltip: '모든 데이터를 클립보드에 복사합니다',
    deleteEmptyCols: '빈 열 삭제',
    deleteEmptyTooltip: '데이터가 없는 빈 열들을 모두 삭제합니다',
    resetSheet: '전체 초기화',
    resetTooltip: '모든 데이터와 설정을 초기화하여 빈 시트로 되돌립니다'
  },
  contextMenu: {
    copy: '복사',
    paste: '붙여넣기',
    clearCellData: '셀 데이터 삭제',
    clearCellDataCount: '셀 데이터 삭제 ({count}개)',
    addRowAbove: '위에 행 삽입',
    addRowAboveCount: '위에 행 삽입 ({count}개)',
    addRowBelow: '아래에 행 삽입',
    addRowBelowCount: '아래에 행 삽입 ({count}개)',
    clearRowsData: '행 데이터 지우기',
    clearRowsDataCount: '행 데이터 지우기 ({count}개)',
    deleteRows: '행 삭제',
    deleteRowsCount: '행 삭제 ({count}개)',
    addColLeft: '왼쪽에 열 삽입',
    addColLeftCount: '왼쪽에 열 삽입 ({count}개)',
    addColRight: '오른쪽에 열 삽입',
    addColRightCount: '오른쪽에 열 삽입 ({count}개)',
    clearColsData: '열 데이터 삭제',
    clearColsDataCount: '열 데이터 삭제 ({count}개)',
    deleteCols: '열 삭제',
    deleteColsCount: '열 삭제 ({count}개)',
    deleteEmptyRows: '빈 행 삭제',
    clearAllFilters: '모든 필터 해제',
    emptyCell: '빈 셀'
  },
  datetime: {
    selectDateTime: '날짜 및 시간 선택',
    selectDate: '날짜를 선택하세요',
    selectTime: '시간 선택',
    hour: '시',
    minute: '분',
    manualInput: '직접 입력',
    alertSelectDate: '날짜를 선택해주세요.',
    yearSuffix: '년',
    monthSuffix: '월',
    daySuffix: '일',
    weekdays: {
      sun: '일',
      mon: '월',
      tue: '화',
      wed: '수',
      thu: '목',
      fri: '금',
      sat: '토'
    }
  },
  overlay: {
    dropExcel: '여기에 Excel 파일을 놓으세요'
  },
  validation: {
    validating: '데이터 검증 중...',
    errorCount: '오류: {count}개'
  },
  excel: {
    importData: '데이터 가져오기',
    processing: '처리 중... {progress}%'
  },
  toast: {
    success: '시스템 성공',
    error: '시스템 오류',
    warning: '시스템 경고',
    info: '시스템 알림',
    confirmTitle: '확인 필요',
    confirmContext: '작업을 계속하시겠습니까?',
    excel: {
      uploadSuccess: '엑셀 파일이 성공적으로 업로드되었습니다.',
      exportSuccess: '엑셀 다운로드가 완료되었습니다.',
      templateSuccess: '템플릿 다운로드가 완료되었습니다.',
      templateError: '템플릿 다운로드 실패',
      copyConfirm: '전체 데이터를 클립보드에 복사하시겠습니까? (데이터 양에 따라 시간이 걸릴 수 있습니다)',
      copySuccess: '전체 데이터가 클립보드에 복사되었습니다.',
      copyError: '데이터 복사 실패'
    },
    grid: {
      rowsDeleted: '빈 행이 삭제되었습니다.',
      rowsAdded: '{count}개 행이 추가되었습니다.',
      colsDeleted: '비어있는 열이 삭제되었습니다.',
      sheetReset: '시트가 초기화되었습니다.',
      exposureValidationComplete: '개별 노출시간 열 {count}개 셀의 유효성검사를 완료했습니다.',
      confirmedValidationComplete: '확진자 여부 열 {count}개 셀의 유효성검사를 완료했습니다.'
    },
    pasteSummary: '붙여넣기 완료: {total}개 셀 중 {error}개 오류 발견 ({rate}%)'
  },
  tooltips: {
    addColumn: '열을 추가합니다',
    deleteColumn: '열을 삭제합니다',
    minColumn: '최소 1개 열이 필요합니다'
  },
  headers: {
    serial: '연번',
    isPatient: '환자여부 <br />(환자 O - 1, 정상 - 0)',
    confirmed: '확진여부 <br />(확진 O - 1, X - 0)',
    basic: '기본정보',
    clinical: '임상증상 (증상 O - 1, 증상 X - 0)',
    exposure: '의심원 노출시간',
    onset: '증상발현시간',
    diet: '식단 (섭취 O - 1, 섭취 X - 0)'
  },
  headerTooltips: {
    isPatient: '환자여부: 1 (환자), 0 (정상)',
    confirmed: '확진여부: 1 (확진), 0 (비확진)',
    clinical: '임상증상: 1 (증상 있음), 0 (증상 없음)',
    diet: '식단 섭취력: 1 (섭취), 0 (미섭취)'
  },
  bottomActions: {
    atBottom: '하단에',
    addRows: '개의 행 추가',
    deleteEmpty: '빈 행 삭제',
    filterTooltip: '필터 적용 중에는 행을 추가할 수 없습니다'
  }
};
