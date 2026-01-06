// (1) 웹 애플리케이션의 진입점 - 초기 페이지 로드 시 호출
function doGet() {
    var template = HtmlService.createTemplateFromFile('index');
    return template.evaluate()
        .setTitle('남원코호트 진행 현황 - New Version')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent();
}

// (2) 새로운 레이아웃용 데이터 가져오기 함수
function getFilteredTableData() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("2025 대상자 명단");
    if (!sheet) return [];

    var allData = sheet.getDataRange().getDisplayValues();

    // 필요한 모든 열의 인덱스를 정의 (신체계측 시작/종료 제외)
    var neededIndexes = [0, 1, 20, 22, 25, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43];
    // ID, 이름, 예약날짜, 도착시간, 상태, 심전도, 심전도시작, 심전도종료, 신체기능, 신체기능시작, 신체기능종료, 
    // SNSB-C, SNSB-C시작, SNSB-C종료, 수행자, 채혈, 채혈시작, 채혈종료, 채뇨, 신체계측

    var filteredData = allData.map(function (row) {
        return neededIndexes.map(function (idx) {
            return row[idx] !== undefined ? row[idx] : "";
        });
    });

    var header = filteredData[0];
    var rows = filteredData.slice(1);

    // 오늘 날짜 필터링
    var today = new Date();
    var todayStr = (today.getMonth() + 1) + "월 " + today.getDate() + "일";
    rows = rows.filter(function (row) {
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

    // 상태 필터: 출석인 사람만 표시
    rows = rows.filter(function (row) {
        return row[4] === "출석";
    });

    // 도착시간 오름차순 정렬
    rows.sort(function (a, b) {
        var aTime = new Date(a[3]);
        var bTime = new Date(b[3]);
        if (isNaN(aTime)) return 1;
        if (isNaN(bTime)) return -1;
        return aTime - bTime;
    });

    // 출력 열 정의 (새로운 레이아웃에 맞게)
    var outputIndexes = [1, 0, 5, 8, 11, 6, 9, 12, 14, 15, 16, 17, 18, 19];
    var outputHeader = [
        "이름", "ID", "심전도", "신체기능", "SNSB-C",
        "심전도 시작", "신체기능 시작", "SNSB-C 시작", "수행자",
        "채혈", "채혈 시작", "채혈 종료", "채뇨", "신체계측"
    ];

    var outputRows = rows.map(function (row) {
        return outputIndexes.map(function (idx, i) {
            if (i === 1) {  // ID 열
                var id = row[idx] || "";
                var match = id.match(/^A1CN(\d{5})$/);
                return match ? match[1] : id;
            } else if (i === 0) {  // 이름 열
                var name = row[idx] || "";
                // 상태 확인 (모든 검사 포함)
                var ecgStatus = row[5];  // 심전도 상태
                var physicalStatus = row[8];  // 신체기능 상태
                var snsbcStatus = row[11];  // SNSB-C 상태
                var bloodStatus = row[15];  // 채혈 상태

                var statusClass = 'red';  // 기본값: 검사중이지 않음

                // 모든 검사가 완료된 경우
                if (ecgStatus === '완료' && physicalStatus === '완료' &&
                    snsbcStatus === '완료' && bloodStatus === '완료') {
                    statusClass = 'black';
                }
                // 하나라도 검사중인 경우
                else if (ecgStatus === '검사중' || physicalStatus === '검사중' ||
                    snsbcStatus === '검사중' || bloodStatus === '검사중') {
                    statusClass = 'green';
                }

                return `<span class="status-dot ${statusClass}"></span> ${name}`;
            } else {
                return row[idx];
            }
        });
    });

    // 신체계측 데이터 디버깅
    Logger.log('신체계측 데이터 확인 - 첫 번째 행:', rows[0] ? rows[0][19] : '데이터 없음');
    Logger.log('신체계측 데이터 확인 - 두 번째 행:', rows[1] ? rows[1][19] : '데이터 없음');

    // 다음 검사자 찾기 로직 (모든 검사 포함)
    var nextUp = {
        ecg: '-',
        physical: '-',
        snsbc: [],
        blood: '-'
    };

    var foundEcg = false;
    var foundPhysical = false;
    var foundSnsbc = 0; // 카운터로 변경
    var foundBlood = false;

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var overallStatus = row[4]; // '상태' (출석, 완료)

        if (overallStatus === '출석') {
            var name = row[1]; // '이름'
            var ecgStatus = row[5]; // '심전도'
            var physicalStatus = row[8]; // '신체기능'
            var snsbcStatus = row[11]; // 'SNSB-C'
            var bloodStatus = row[15]; // '채혈'
            var measurementStatus = row[19]; // '신체계측'

            // 어떤 검사든 하나라도 검사중인 사람은 모든 다음 대상자에서 제외 (신체계측 포함)
            var hasAnyTestInProgress = (ecgStatus === '검사중' || physicalStatus === '검사중' ||
                snsbcStatus === '검사중' || bloodStatus === '검사중' ||
                measurementStatus === '검사중');

            // 검사중인 사람이 아닌 경우에만 다음 대상자로 고려
            if (!hasAnyTestInProgress) {
                // 심전도 다음 대상자: 채혈과 신체계측을 완료한 사람만
                if (
                    !foundEcg &&
                    ecgStatus !== '완료' && ecgStatus !== '검사중' && ecgStatus !== '진행중' &&
                    bloodStatus === '완료' &&
                    measurementStatus === '완료'
                ) {
                    nextUp.ecg = name;
                    foundEcg = true;
                }
                // 신체기능 다음 대상자
                if (!foundPhysical && physicalStatus !== '완료' && physicalStatus !== '검사중' && physicalStatus !== '진행중') {
                    nextUp.physical = name;
                    foundPhysical = true;
                }
                // SNSB-C 다음 대상자 (2명까지)
                if (foundSnsbc < 2 && snsbcStatus !== '완료' && snsbcStatus !== '검사중' && snsbcStatus !== '진행중') {
                    nextUp.snsbc.push(name);
                    foundSnsbc++;
                }
                // 채혈 다음 대상자
                if (!foundBlood && bloodStatus !== '완료' && bloodStatus !== '검사중' && bloodStatus !== '진행중') {
                    nextUp.blood = name;
                    foundBlood = true;
                }
            }
        }

        if (foundEcg && foundPhysical && foundSnsbc >= 2 && foundBlood) break;
    }

    return {
        tableData: [outputHeader].concat(outputRows),
        nextUp: nextUp
    };
}

// (3) 웹훅으로 데이터 변경을 수신하고 캐시에 저장하는 함수
var cache = CacheService.getScriptCache();

function doPost(e) {
    try {
        var payload = JSON.parse(e.postData.contents);
        Logger.log('Received Webhook Payload: ' + JSON.stringify(payload));

        // 받은 최신 데이터를 캐시에 저장 (10분 = 600초 유효)
        cache.put('latestSheetData', JSON.stringify(payload.updatedContent), 600);

        return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Webhook received and cached' }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        Logger.log('Error in doPost: ' + error.message);
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// (4) 웹페이지에서 호출하여 캐시된 최신 데이터를 가져가는 함수
function getLatestDataFromCache() {
    var neededIndexes = [0, 1, 20, 22, 25, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42];
    var data = cache.get('latestSheetData');
    var today = new Date();
    var todayStr = (today.getMonth() + 1) + "월 " + today.getDate() + "일";

    if (data) {
        var allData = JSON.parse(data);
        var filteredData = allData.map(function (row) {
            return neededIndexes.map(function (idx) {
                return row[idx] !== undefined ? row[idx] : "";
            });
        });
        return filteredData.filter(function (row, i) {
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
        // 캐시에 데이터가 없으면 현재 시트의 전체 데이터를 반환
        return getSNSBCData();
    }
}

// (5) AppSheet를 통해 Google Sheet 데이터가 변경될 때 실행되는 함수
function onSheetChange(e) {
    var targetSheetName = "2025 대상자 명단";
    var activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (activeSheet.getName() !== targetSheetName) {
        Logger.log('Change not on target sheet: ' + activeSheet.getName());
        return;
    }

    Logger.log('Sheet ' + targetSheetName + ' changed! Type: ' + e.changeType);

    // Firebase로 데이터 전송
    syncToFirebase();
}

// === Firebase Integration ===
function syncToFirebase() {
    var FIREBASE_URL = "https://namwon-cohort-default-rtdb.asia-southeast1.firebasedatabase.app/";
    var FIREBASE_SECRET = "kQa9xCykaKejXalGgf7xEgDcstDOBNuY6sklhwhI"; // TODO: Move to Script Properties

    // 1. 데이터 가져오기 (기존 로직 재사용)
    var data = getFilteredTableData();

    // 2. Firebase에 PUT 요청
    var url = FIREBASE_URL + "cohortData.json?auth=" + FIREBASE_SECRET;

    var options = {
        method: "put",
        contentType: "application/json",
        payload: JSON.stringify(data)
    };

    try {
        UrlFetchApp.fetch(url, options);
        Logger.log("Firebase sync successful");
    } catch (e) {
        Logger.log("Firebase sync failed: " + e.message);
    }
}

// (6) 기존 SNSBC 데이터 가져오기 함수 (호환성 유지)
function getSNSBCData() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("2025 대상자 명단");
    if (!sheet) {
        Logger.log("'2025 대상자 명단' 시트를 찾을 수 없습니다.");
        return [];
    }

    var allData = sheet.getDataRange().getDisplayValues();
    var neededIndexes = [0, 1, 20, 22, 25, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42];

    var filteredData = allData.map(function (row) {
        return neededIndexes.map(function (idx) {
            return row[idx] !== undefined ? row[idx] : "";
        });
    });

    // 오늘 날짜와 일치하는 예약날짜만 필터링
    var today = new Date();
    var todayStr = (today.getMonth() + 1) + "월 " + today.getDate() + "일";
    return filteredData.filter(function (row, i) {
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
}

// (7) 두 번째 화면용 데이터 가져오기 함수
function getFilteredTableData2() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("2025 대상자 명단");
    if (!sheet) return [];

    var allData = sheet.getDataRange().getDisplayValues();

    // 필요한 모든 열의 인덱스를 정의 (전체 데이터 포함)
    var neededIndexes = [0, 1, 20, 22, 25, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43];
    // ID, 이름, 예약날짜, 도착시간, 상태, 심전도, 심전도시작, 심전도종료, 신체기능, 신체기능시작, 신체기능종료, 
    // SNSB-C, SNSB-C시작, SNSB-C종료, 수행자, 채혈, 채혈시작, 채혈종료, 채뇨, 신체계측

    var filteredData = allData.map(function (row) {
        return neededIndexes.map(function (idx) {
            return row[idx] !== undefined ? row[idx] : "";
        });
    });

    var header = filteredData[0];
    var rows = filteredData.slice(1);

    // 오늘 날짜 필터링
    var today = new Date();
    var todayStr = (today.getMonth() + 1) + "월 " + today.getDate() + "일";
    rows = rows.filter(function (row) {
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

    // 상태 필터: 출석인 사람만 표시
    rows = rows.filter(function (row) {
        return row[4] === "출석";
    });

    // 도착시간 오름차순 정렬
    rows.sort(function (a, b) {
        var aTime = new Date(a[3]);
        var bTime = new Date(b[3]);
        if (isNaN(aTime)) return 1;
        if (isNaN(bTime)) return -1;
        return aTime - bTime;
    });

    // 출력 열 정의 (필요한 열만)
    var outputIndexes = [1, 0, 5, 8, 11, 15, 19];
    var outputHeader = [
        "이름", "ID", "심전도", "신체기능", "SNSB-C", "채혈", "신체계측"
    ];

    var outputRows = rows.map(function (row) {
        return outputIndexes.map(function (idx, i) {
            if (i === 1) {  // ID 열
                var id = row[idx] || "";
                var match = id.match(/^A1CN(\d{5})$/);
                return match ? match[1] : id;
            } else if (i === 0) {  // 이름 열
                var name = row[idx] || "";
                // 상태 확인 (모든 검사 포함)
                var ecgStatus = row[5];  // 심전도 상태
                var physicalStatus = row[8];  // 신체기능 상태
                var snsbcStatus = row[11];  // SNSB-C 상태
                var bloodStatus = row[15];  // 채혈 상태

                var statusClass = 'red';  // 기본값: 검사중이지 않음

                // 모든 검사가 완료된 경우
                if (ecgStatus === '완료' && physicalStatus === '완료' &&
                    snsbcStatus === '완료' && bloodStatus === '완료') {
                    statusClass = 'black';
                }
                // 하나라도 검사중인 경우
                else if (ecgStatus === '검사중' || physicalStatus === '검사중' ||
                    snsbcStatus === '검사중' || bloodStatus === '검사중') {
                    statusClass = 'green';
                }

                return `<span class="status-dot ${statusClass}"></span> ${name}`;
            } else {
                return row[idx];
            }
        });
    });

    return {
        tableData: [outputHeader].concat(outputRows),
        nextUp: {} // 두 번째 화면에서는 nextUp 정보가 필요 없음
    };
}

// (8) Google Cloud TTS 함수 (수정됨)
function getTTSAudioNew(text) {
    try {
        var API_KEY = 'AIzaSyBwky76XHNzSHfQstUl0KD5ufiihyW8VhY';
        var url = 'https://texttospeech.googleapis.com/v1/text:synthesize?key=' + API_KEY;

        // SSML 태그 제거하고 일반 텍스트로 변환
        var cleanText = text.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '');

        var requestBody = {
            input: { text: cleanText },  // ssml 대신 text 사용
            voice: {
                languageCode: 'ko-KR',
                name: 'ko-KR-Wavenet-A',
                ssmlGender: 'FEMALE'
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 0.85,
                pitch: -3.0,
                volumeGainDb: 1.0
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
            Logger.log('TTS API 에러: ' + code + ' - 응답: ' + response.getContentText());
            return null;
        }

    } catch (error) {
        Logger.log('TTS 에러: ' + error.toString());
        return null;
    }
}
