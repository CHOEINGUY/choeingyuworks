// (1) 웹 애플리케이션의 진입점 - 초기 페이지 로드 시 호출
function doGet() {
  var template = HtmlService.createTemplateFromFile('Index');
  // 초기 로딩 시 데이터는 웹페이지의 JavaScript에서 google.script.run으로 호출하도록 변경
  // template.data = JSON.stringify(data); // 이제 필요 없음
  return template.evaluate()
    .setTitle('남원코호트 진행 현황')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// (2) 'SNSBC' 시트의 현재 전체 데이터를 가져오는 함수 (웹페이지에서 호출)
function getSNSBCData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("2025 대상자 명단"); // 데이터가 있는 시트 이름
  if (!sheet) {
    Logger.log("'SNSBC' 시트를 찾을 수 없습니다.");
    return [];
  }
  var allData = sheet.getDataRange().getDisplayValues();
  // neededIndexes 각 인덱스별 시트 열 헤더:
  // 0: ID
  // 1: 이름
  // 20: 예약날짜
  // 22: 도착 시간
  // 25: 상태
  // 28: 심전도
  // 30: 심전도 시작
  // 31: 심전도 종료
  // 32: 신체기능
  // 33: 신체기능 시작
  // 34: 신체기능 종료
  // 35: SNSB-C
  // 36: SNSB-C 시작
  // 37: SNSB-C 종료
  // 38: 수행자
  // 39: 채혈
  // 40: 채뇨
  // 41: 신체계측
  var neededIndexes = [0, 1, 20, 22, 25, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38];
  var filteredData = allData.map(function(row) {
    return neededIndexes.map(function(idx) {
      return row[idx] !== undefined ? row[idx] : "";
    });
  });
  // 오늘 날짜와 일치하는 예약날짜만 필터링 (헤더는 항상 포함)
  var today = new Date();
  var todayStr = (today.getMonth() + 1) + "월 " + today.getDate() + "일";
  return filteredData.filter(function(row, i) {
    if (i === 0) return true; // 헤더는 항상 포함
    var dateCell = row[2]; // 예약날짜
    // '6월 5일' 형식 또는 Date 객체 문자열이 올 수 있음
    if (dateCell === todayStr) return true;
    // Date 객체 문자열인 경우에도 오늘 날짜면 포함
    var parsed = new Date(dateCell);
    if (!isNaN(parsed.getTime())) {
      if (parsed.getFullYear() === today.getFullYear() &&
          parsed.getMonth() === today.getMonth() &&
          parsed.getDate() === today.getDate()) {
        return true;
      }
    }
    return false;
  });
}

function getFilteredTableData2() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("2025 대상자 명단");
  if (!sheet) return [];
  var allData = sheet.getDataRange().getDisplayValues();

  // 필요한 모든 열의 인덱스를 정의 (다른 검사 상태 포함)
  var neededIndexes = [0, 1, 20, 22, 25, 28, 32, 35, 39, 40, 41]; 
  // ID, 이름, 예약날짜, 도착시간, 상태, 심전도, 신체기능, SNSB-C, 채혈, 채뇨, 신체계측

  var filteredData = allData.map(function(row) {
    return neededIndexes.map(function(idx) {
      return row[idx] !== undefined ? row[idx] : "";
    });
  });

  var header = filteredData[0];
  var rows = filteredData.slice(1);

  // 오늘 날짜 필터링
  var today = new Date();
  var todayStr = (today.getMonth() + 1) + "월 " + today.getDate() + "일";
  rows = rows.filter(function(row) {
    var dateCell = row[2]; // 예약날짜
    if (dateCell === todayStr) return true;
    var parsed = new Date(dateCell);
    return !isNaN(parsed.getTime()) && 
           parsed.getFullYear() === today.getFullYear() &&
           parsed.getMonth() === today.getMonth() &&
           parsed.getDate() === today.getDate();
  });

  // 상태가 "출석"인 사람만 필터링
  rows = rows.filter(function(row) {
    return row[4] === "출석";
  });

  // 도착시간 오름차순 정렬
  rows.sort(function(a, b) {
    var aTime = new Date(a[3]);
    var bTime = new Date(b[3]);
    if (isNaN(aTime)) return 1;
    if (isNaN(bTime)) return -1;
    return aTime - bTime;
  });

  // 다음 검사자 찾기 로직 (개선됨)
  var nextUp = { blood: '-', measurement: '-' };
  var foundBlood = false;
  var foundMeasurement = false;

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var name = row[1];
    var ecgStatus = row[5];
    var physicalStatus = row[6];
    var snsbcStatus = row[7];
    var bloodStatus = row[8];
    var measurementStatus = row[10];

    // 어떤 검사든 "검사중"이면 다음 대상자에서 제외 (채혈 포함)
    var isOtherTestInProgress = (ecgStatus === '검사중' || physicalStatus === '검사중' || snsbcStatus === '검사중' || bloodStatus === '검사중');

    if (!isOtherTestInProgress) {
      // 다음 채혈 대상자
      if (!foundBlood && bloodStatus !== '완료' && bloodStatus !== '검사중') {
        nextUp.blood = name;
        foundBlood = true;
      }
      // 다음 신체계측 대상자
      if (!foundMeasurement && measurementStatus !== '완료' && measurementStatus !== '검사중') {
        nextUp.measurement = name;
        foundMeasurement = true;
      }
    }
    if (foundBlood && foundMeasurement) break;
  }

  // 클라이언트에 보낼 최종 데이터 구성
  var outputIndexes = [1, 0, 8, 9, 10]; // 이름, ID, 채혈, 채뇨, 신체계측
  var outputHeader = ["이름", "ID", "채혈", "채뇨", "신체계측"];
  var outputRows = rows.map(function(row) {
    return outputIndexes.map(function(idx, i) {
      if (i === 0) { // 이름 열
        var name = row[idx] || "";
        var bloodStatus = row[8];
        var urineStatus = row[9];
        var measurementStatus = row[10];
        var statusClass = 'red';
        if (bloodStatus === '완료' && urineStatus === '완료' && measurementStatus === '완료') {
          statusClass = 'black';
        } else if (bloodStatus === '검사중' || urineStatus === '검사중' || measurementStatus === '검사중') {
          statusClass = 'green';
        }
        return `<span class="status-dot ${statusClass}"></span> ${name}`;
      } else if (i === 1) { // ID 열
        var id = row[idx] || "";
        var match = id.match(/^A1CN(\d{5})$/);
        return match ? match[1] : id;
      } else {
        return row[idx];
      }
    });
  });

  return {
    tableData: [outputHeader].concat(outputRows),
    nextUp: nextUp
  };
}

// (3) 웹훅으로 데이터 변경을 수신하고 캐시에 저장하는 함수
var cache = CacheService.getScriptCache(); // 스크립트 캐시 서비스

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    Logger.log('Received Webhook Payload: ' + JSON.stringify(payload));

    // 받은 최신 데이터를 캐시에 저장 (예: 10분 = 600초 유효)
    cache.put('latestSheetData', JSON.stringify(payload.updatedContent), 600);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Webhook received and cached' }))
           .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in doPost: ' + error.message);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
           .setMimeType(ContentService.MimeType.JSON);
  }
}

// (4) 웹페이지에서 호출하여 캐시된 최신 데이터를 가져가는 함수 (롱 폴링용)
function getLatestDataFromCache() {
  var neededIndexes = [0, 1, 20, 22, 25, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38];
  var data = cache.get('latestSheetData');
  var today = new Date();
  var todayStr = (today.getMonth() + 1) + "월 " + today.getDate() + "일";
  if (data) {
    var allData = JSON.parse(data);
    var filteredData = allData.map(function(row) {
      return neededIndexes.map(function(idx) {
        return row[idx] !== undefined ? row[idx] : "";
      });
    });
    return filteredData.filter(function(row, i) {
      if (i === 0) return true; // 헤더는 항상 포함
      var dateCell = row[2]; // 예약날짜
      if (dateCell === todayStr) return true;
      var parsed = new Date(dateCell);
      if (!isNaN(parsed.getTime())) {
        if (parsed.getFullYear() === today.getFullYear() &&
            parsed.getMonth() === today.getMonth() &&
            parsed.getDate() === today.getDate()) {
          return true;
        }
      }
      return false;
    });
  } else {
    // 캐시에 데이터가 없으면 현재 시트의 전체 데이터를 반환 (초기 로딩 시나 웹훅 누락 대비)
    return getSNSBCData();
  }
}

// (5) AppSheet를 통해 Google Sheet 데이터가 변경될 때 실행되는 함수
function onSheetChange(e) {
  var targetSheetName = "SNSBC"; // 감지할 시트 이름
  var activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // 변경이 발생한 시트가 대상 시트가 아니거나, 변경 유형이 관심 있는 유형이 아니라면 종료
  if (activeSheet.getName() !== targetSheetName) {
    Logger.log('Change not on target sheet: ' + activeSheet.getName());
    return;
  }

  // webhook 관련 코드 제거됨. 필요시 여기에 원하는 동작 추가 가능.
  Logger.log('Sheet ' + targetSheetName + ' changed! Type: ' + e.changeType);
  // 현재는 아무 동작도 하지 않음.
}

function getFilteredTableData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("2025 대상자 명단");
  if (!sheet) return [];
  var allData = sheet.getDataRange().getDisplayValues();
  var neededIndexes = [0, 1, 20, 22, 25, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];
  var filteredData = allData.map(function(row) {
    return neededIndexes.map(function(idx) {
      return row[idx] !== undefined ? row[idx] : "";
    });
  });
  var header = filteredData[0];
  var rows = filteredData.slice(1);
  // 오늘 날짜 문자열 생성
  var today = new Date();
  var todayStr = (today.getMonth() + 1) + "월 " + today.getDate() + "일";
  // 예약날짜가 오늘인 것만 남김
  rows = rows.filter(function(row) {
    var dateCell = row[2]; // 예약날짜
    if (dateCell === todayStr) return true;
    var parsed = new Date(dateCell);
    if (!isNaN(parsed.getTime())) {
      if (parsed.getFullYear() === today.getFullYear() &&
          parsed.getMonth() === today.getMonth() &&
          parsed.getDate() === today.getDate()) {
        return true;
      }
    }
    return false;
  });
  // 상태 필터: 출석인 사람만 표시 (완료된 사람은 제외)
  rows = rows.filter(function(row) {
    return row[4] === "출석";
  });
  // 도착시간 오름차순 정렬 (빈 값은 뒤로)
  rows.sort(function(a, b) {
    var aTime = new Date(a[3]);
    var bTime = new Date(b[3]);
    if (isNaN(aTime)) return 1;
    if (isNaN(bTime)) return -1;
    return aTime - bTime;
  });
  // 출력 열 및 경과시간 계산에 필요한 열까지 추출
  var outputIndexes = [1, 0, 5, 8, 11, 6, 9, 12, 14, 15, 16];
  var outputHeader = [
    "이름", "ID", "심전도", "신체기능", "SNSB-C",
    "심전도 시작", "신체기능 시작", "SNSB-C 시작", "수행자",
    "채혈", "채뇨", "신체계측"
  ];
  var outputRows = rows.map(function(row) {
    return outputIndexes.map(function(idx, i) {
      if (i === 1) {  // ID 열 (두 번째 열)
        var id = row[idx] || "";
        var match = id.match(/^A1CN(\d{5})$/);
        return match ? match[1] : id;
      } else if (i === 0) {  // 이름 열 (첫 번째 열)
        var name = row[idx] || "";
        // 상태 확인
        var ecgStatus = row[5];  // 심전도 상태
        var physicalStatus = row[8];  // 신체기능 상태
        var snsbcStatus = row[11];  // SNSB-C 상태
        var bloodStatus = row[15];  // 채혈 상태
        
        var statusClass = 'red';  // 기본값: 검사중이지 않음
        
        // 모든 검사가 완료된 경우
        if (ecgStatus === '완료' && physicalStatus === '완료' && snsbcStatus === '완료' && bloodStatus === '완료') {
          statusClass = 'black';
        }
        // 하나라도 검사중인 경우
        else if (ecgStatus === '검사중' || physicalStatus === '검사중' || snsbcStatus === '검사중' || bloodStatus === '검사중') {
          statusClass = 'green';
        }
        
        return `<span class="status-dot ${statusClass}"></span> ${name}`;
      } else {
        return row[idx];
      }
    });
  });

  // 다음 검사자 찾기 로직
  var nextUp = {
    ecg: '-',
    physical: '-',
    snsbc: '-'
  };

  var foundEcg = false;
  var foundPhysical = false;
  var foundSnsbc = false;

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var overallStatus = row[4]; // '상태' (출석, 완료)
    
    if (overallStatus === '출석') {
        var name = row[1]; // '이름'
        var ecgStatus = row[5]; // '심전도'
        var physicalStatus = row[8]; // '신체기능'
        var snsbcStatus = row[11]; // 'SNSB-C'
        var bloodStatus = row[15]; // '채혈'

        // 어떤 검사든 하나라도 검사중인 사람은 모든 다음 대상자에서 제외 (채혈 포함)
        var hasAnyTestInProgress = (ecgStatus === '검사중' || physicalStatus === '검사중' || snsbcStatus === '검사중' || bloodStatus === '검사중');

        // 검사중인 사람이 아닌 경우에만 다음 대상자로 고려
        if (!hasAnyTestInProgress) {
          // 심전도 다음 대상자: 심전도가 완료도 검사중도 아닌 사람
          if (!foundEcg && ecgStatus !== '완료' && ecgStatus !== '검사중' && ecgStatus !== '진행중') {
              nextUp.ecg = name;
              foundEcg = true;
          }
          // 신체기능 다음 대상자: 신체기능이 완료도 검사중도 아닌 사람  
          if (!foundPhysical && physicalStatus !== '완료' && physicalStatus !== '검사중' && physicalStatus !== '진행중') {
              nextUp.physical = name;
              foundPhysical = true;
          }
          // SNSB-C 다음 대상자: SNSB-C가 완료도 검사중도 아닌 사람
          if (!foundSnsbc && snsbcStatus !== '완료' && snsbcStatus !== '검사중' && snsbcStatus !== '진행중') {
              nextUp.snsbc = name;
              foundSnsbc = true;
          }
        }
    }
    
    if (foundEcg && foundPhysical && foundSnsbc) break;
  }

  return {
    tableData: [outputHeader].concat(outputRows),
    nextUp: nextUp
  };
}

// --- Google Cloud TTS with API Key ---

/**
 * Google Cloud Text-to-Speech API를 호출하여 오디오 데이터를 가져옵니다.
 * @param {string} text 변환할 텍스트
 * @returns {string|null} Base64 오디오 데이터 또는 null
 */
function getTTSAudioNew(text) {
  try {
    var API_KEY = 'AIzaSyBwky76XHNzSHfQstUl0KD5ufiihyW8VhY';
    var url = 'https://texttospeech.googleapis.com/v1/text:synthesize?key=' + API_KEY;
    
    var requestBody = {
      input: { ssml: text },  // SSML 사용
      voice: {
        languageCode: 'ko-KR',
        name: 'ko-KR-Wavenet-A',  // 확실한 여성 목소리
        ssmlGender: 'FEMALE'
      },
      audioConfig: { 
        audioEncoding: 'MP3',
        speakingRate: 0.85,  // 10% 더 느리게 (또박또박)
        pitch: -3.0,         // 음높이 낮춰서 중음 만들기
        volumeGainDb: 1.0    // 볼륨 약간 높임
      }
    };
    
    var options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(requestBody),
      muteHttpExceptions: true
    };
    
    var response = UrlFetchApp.fetch(url, options);
    var code = response.getResponseCode();
    
    if (code === 200) {
      var data = JSON.parse(response.getContentText());
      return data.audioContent;
    } else {
      Logger.log('TTS API 에러: ' + code);
      return null;
    }
    
  } catch (error) {
    Logger.log('TTS 에러: ' + error.toString());
    return null;
  }
}









function updateProgressBoxes(data) {
  // 헤더 인덱스 파악
  const header = data[0];
  const idx = {
    이름: header.indexOf('이름'),
    심전도: header.indexOf('심전도'),
    심전도시작: header.indexOf('심전도 시작'),
    신체기능: header.indexOf('신체기능'),
    신체기능시작: header.indexOf('신체기능 시작'),
    SNSBC: header.indexOf('SNSB-C'),
    SNSBC시작: header.indexOf('SNSB-C 시작'),
    수행자: header.indexOf('수행자')
  };
  // 분류용
  const snsbcEmailMap = {
    'chldlsrb07@gmail.com': 'progress-snsbc-1-list',
    'wjdgh7946@gmail.com': 'progress-snsbc-2-list',
    'a93430506@gmail.com': 'progress-snsbc-3-list'
  };
  // 초기화
  const progress = {
    'progress-ecg-list': [],
    'progress-physical-list': [],
    'progress-snsbc-1-list': [],
    'progress-snsbc-2-list': [],
    'progress-snsbc-3-list': []
  };
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // 이름에서 상태 점 제거
    const name = row[idx.이름].replace(/<span class="status-dot [^"]*"><\/span> /, '');
    
    // 심전도 검사중
    if (row[idx.심전도] === '검사중' && row[idx.심전도시작]) {
      progress['progress-ecg-list'].push({
        name: name,
        start: row[idx.심전도시작]
      });
    }
    // 신체기능 검사중
    if (row[idx.신체기능] === '검사중' && row[idx.신체기능시작]) {
      progress['progress-physical-list'].push({
        name: name,
        start: row[idx.신체기능시작]
      });
    }
    // SNSB-C 검사중
    if (row[idx.SNSBC] === '검사중' && row[idx.SNSBC시작] && row[idx.수행자]) {
      const boxId = snsbcEmailMap[row[idx.수행자]];
      if (boxId) {
        progress[boxId].push({
          name: name,
          start: row[idx.SNSBC시작]
        });
      }
    }
  }
  lastProgressData = progress;
  renderProgressBoxes();
}