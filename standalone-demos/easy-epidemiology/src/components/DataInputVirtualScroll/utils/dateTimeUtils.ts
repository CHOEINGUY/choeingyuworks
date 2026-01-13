/**
 * 날짜/시간 관련 유틸리티 함수들
 * yyyy-mm-dd hh:mm 형식을 기준으로 파싱 및 포맷팅
 */

export interface DateTimeObject {
  year: number;
  month: number;
  day: number;
  hour: string | number;
  minute: string | number;
}

/**
 * yyyy-mm-dd hh:mm 형식의 문자열을 파싱하여 객체로 반환
 * @param {string} value - 파싱할 날짜/시간 문자열
 * @returns {object|null} - 파싱된 날짜/시간 객체 또는 null
 */
export function parseDateTime(value: string | null | undefined): DateTimeObject | null {
  if (!value || typeof value !== 'string') {
    return null;
  }
  
  const cleanValue = value.trim();
  
  // 1. Try standard YYYY-MM-DD HH:mm (Strict)
  const standardRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})[\sT]+(\d{1,2}):(\d{1,2})$/;
  let match = cleanValue.match(standardRegex);
  
  if (match) {
    return createDateTimeObject(match[1], match[2], match[3], match[4], match[5]);
  }

  // 2. Try YYYY-MM-DD HH:mm:ss (Ignore seconds)
  const withSecondsRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})[\sT]+(\d{1,2}):(\d{1,2}):\d{1,2}$/;
  match = cleanValue.match(withSecondsRegex);
  if (match) {
    return createDateTimeObject(match[1], match[2], match[3], match[4], match[5]);
  }

  // 3. Try YYYY-MM-DD (Default time to 00:00)
  const dateOnlyRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
  match = cleanValue.match(dateOnlyRegex);
  if (match) {
    return createDateTimeObject(match[1], match[2], match[3], '00', '00');
  }

  // 4. Try Slash format YYYY/MM/DD ...
  // YYYY/MM/DD HH:mm
  const slashStandardRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})[\sT]+(\d{1,2}):(\d{1,2})$/;
  match = cleanValue.match(slashStandardRegex);
  if (match) {
    return createDateTimeObject(match[1], match[2], match[3], match[4], match[5]);
  }

  // YYYY/MM/DD (Default time to 00:00)
  const slashDateOnlyRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
  match = cleanValue.match(slashDateOnlyRegex);
  if (match) {
    return createDateTimeObject(match[1], match[2], match[3], '00', '00');
  }

  // 5. Try Dot format YYYY.MM.DD ...
  // YYYY.MM.DD HH:mm
  const dotStandardRegex = /^(\d{4})\.(\d{1,2})\.(\d{1,2})[\sT]+(\d{1,2}):(\d{1,2})$/;
  match = cleanValue.match(dotStandardRegex);
  if (match) {
    return createDateTimeObject(match[1], match[2], match[3], match[4], match[5]);
  }

  // YYYY.MM.DD (Default time to 00:00)
  const dotDateOnlyRegex = /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/;
  match = cleanValue.match(dotDateOnlyRegex);
  if (match) {
    return createDateTimeObject(match[1], match[2], match[3], '00', '00');
  }

  return null;
}

function createDateTimeObject(y: string, m: string, d: string, h: string, min: string): DateTimeObject | null {
  const year = parseInt(y);
  const month = parseInt(m);
  const day = parseInt(d);
  
  // Validate
  if (!isValidDate(year, month, day)) return null;
  if (!isValidTime(h, min)) return null;

  return {
    year,
    month,
    day,
    hour: h,
    minute: min
  };
}

/**
 * 날짜/시간 객체를 yyyy-mm-dd hh:mm 형식 문자열로 포맷
 * @param {object} dateTime - 포맷할 날짜/시간 객체
 * @returns {string} - 포맷된 날짜/시간 문자열
 */
export function formatDateTime(dateTime: DateTimeObject): string {
  if (!dateTime || typeof dateTime !== 'object') {
    return '';
  }
  
  const { year, month, day, hour, minute } = dateTime;
  
  // 필수 필드 체크
  if (!year || !month || !day || hour === undefined || minute === undefined) {
    return '';
  }
  
  // 날짜 유효성 검증
  if (!isValidDate(year, month, day)) {
    return '';
  }
  
  // 시간 유효성 검증
  if (!isValidTime(hour, minute)) {
    return '';
  }
  
  // 포맷팅
  const formattedMonth = String(month).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');
  const formattedHour = String(hour).padStart(2, '0');
  const formattedMinute = String(minute).padStart(2, '0');
  
  return `${year}-${formattedMonth}-${formattedDay} ${formattedHour}:${formattedMinute}`;
}

/**
 * 날짜 유효성 검증
 * @param {number} year - 년도
 * @param {number} month - 월 (1-12)
 * @param {number} day - 일 (1-31)
 * @returns {boolean} - 유효한 날짜인지 여부
 */
export function isValidDate(year: number, month: number, day: number): boolean {
  // 범위 체크
  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  // JavaScript Date 객체로 실제 날짜 유효성 검증
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
}

/**
 * 시간 유효성 검증
 * @param {string|number} hour - 시간 (0-23)
 * @param {string|number} minute - 분 (0-59)
 * @returns {boolean} - 유효한 시간인지 여부
 */
export function isValidTime(hour: string | number, minute: string | number): boolean {
  const hourNum = typeof hour === 'string' ? parseInt(hour) : hour;
  const minuteNum = typeof minute === 'string' ? parseInt(minute) : minute;
  
  return hourNum >= 0 && hourNum <= 23 && 
         minuteNum >= 0 && minuteNum <= 59;
}

/**
 * 현재 날짜/시간을 yyyy-mm-dd hh:mm 형식으로 반환
 * @returns {string} - 현재 날짜/시간 문자열
 */
export function getCurrentDateTime(): string {
  const now = new Date();
  return formatDateTime({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: String(now.getHours()).padStart(2, '0'),
    minute: String(now.getMinutes()).padStart(2, '0')
  });
}

/**
 * 현재 날짜/시간 객체를 반환
 * @returns {object} - 현재 날짜/시간 객체
 */
export function getCurrentDateTimeObject(): DateTimeObject {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: String(now.getHours()).padStart(2, '0'),
    minute: String(now.getMinutes()).padStart(2, '0')
  };
}

/**
 * 문자열이 유효한 날짜/시간 형식인지 검증
 * @param {string} value - 검증할 문자열
 * @returns {boolean} - 유효한 형식인지 여부
 */
export function isValidDateTimeString(value: string): boolean {
  const parsed = parseDateTime(value);
  return parsed !== null;
}

/**
 * 날짜/시간 문자열을 정규화 (공백 정리 등)
 * @param {string} value - 정규화할 문자열
 * @returns {string} - 정규화된 문자열
 */
export function normalizeDateTimeString(value: string): string {
  if (!value || typeof value !== 'string') {
    return '';
  }
  
  // 공백 정리
  let normalized = value.trim();
  
  // 여러 공백을 하나로 변환
  normalized = normalized.replace(/\s+/g, ' ');
  
  // 파싱 후 다시 포맷 (유효한 경우)
  const parsed = parseDateTime(normalized);
  if (parsed) {
    return formatDateTime(parsed);
  }
  
  return normalized;
}

/**
 * 두 날짜/시간이 같은지 비교
 * @param {string|object} dateTime1 - 첫 번째 날짜/시간
 * @param {string|object} dateTime2 - 두 번째 날짜/시간
 * @returns {boolean} - 같은지 여부
 */
export function isEqualDateTime(
  dateTime1: string | DateTimeObject | null | undefined, 
  dateTime2: string | DateTimeObject | null | undefined
): boolean {
  let obj1: DateTimeObject | null, obj2: DateTimeObject | null;
  
  // 문자열인 경우 파싱
  if (typeof dateTime1 === 'string') {
    obj1 = parseDateTime(dateTime1);
  } else {
    obj1 = dateTime1 || null;
  }
  
  if (typeof dateTime2 === 'string') {
    obj2 = parseDateTime(dateTime2);
  } else {
    obj2 = dateTime2 || null;
  }
  
  // 둘 다 null이거나 undefined인 경우
  if (!obj1 && !obj2) return true;
  if (!obj1 || !obj2) return false;
  
  return obj1!.year === obj2!.year &&
         obj1!.month === obj2!.month &&
         obj1!.day === obj2!.day &&
         obj1!.hour === obj2!.hour &&
         obj1!.minute === obj2!.minute;
}

/**
 * 날짜/시간 범위 검증 (시작일 <= 종료일)
 * @param {string|object} startDateTime - 시작 날짜/시간
 * @param {string|object} endDateTime - 종료 날짜/시간
 * @returns {boolean} - 유효한 범위인지 여부
 */
export function isValidDateTimeRange(
  startDateTime: string | DateTimeObject, 
  endDateTime: string | DateTimeObject
): boolean {
  let start: DateTimeObject | null, end: DateTimeObject | null;
  
  // 문자열인 경우 파싱
  if (typeof startDateTime === 'string') {
    start = parseDateTime(startDateTime);
  } else {
    start = startDateTime;
  }
  
  if (typeof endDateTime === 'string') {
    end = parseDateTime(endDateTime);
  } else {
    end = endDateTime;
  }
  
  if (!start || !end) return false;
  
  // Date 객체로 변환하여 비교
  const startHour = typeof start.hour === 'string' ? parseInt(start.hour) : start.hour;
  const startMinute = typeof start.minute === 'string' ? parseInt(start.minute) : start.minute;
  const endHour = typeof end.hour === 'string' ? parseInt(end.hour) : end.hour;
  const endMinute = typeof end.minute === 'string' ? parseInt(end.minute) : end.minute;

  const startDate = new Date(start.year, start.month - 1, start.day, startHour, startMinute);
  const endDate = new Date(end.year, end.month - 1, end.day, endHour, endMinute);
  
  return startDate <= endDate;
}

/**
 * 사용자 입력 문자열을 날짜/시간 형식으로 변환 시도
 * 다양한 입력 형식을 지원
 * @param {string} input - 사용자 입력 문자열
 * @returns {string|null} - 변환된 날짜/시간 문자열 또는 null
 */
export function tryParseUserInput(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }
  
  const cleanInput = input.trim();
  
  // 이미 올바른 형식인 경우
  if (isValidDateTimeString(cleanInput)) {
    return cleanInput;
  }
  
  // 다양한 형식 시도
  const patterns = [
    // yyyy-mm-dd hh:mm:ss (초 무시)
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):\d{2}$/,
    // yyyy/mm/dd hh:mm
    /^(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})$/,
    // yyyy.mm.dd hh:mm
    /^(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})$/,
    // yyyy-mm-dd (시간 없음, 00:00으로 설정)
    /^(\d{4})-(\d{2})-(\d{2})$/
  ];
  
  for (const pattern of patterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      const year = parseInt(match[1]);
      const month = parseInt(match[2]);
      const day = parseInt(match[3]);
      const hour = match[4] ? match[4] : '00';
      const minute = match[5] ? match[5] : '00';
      
      if (isValidDate(year, month, day) && isValidTime(hour, minute)) {
        return formatDateTime({ year, month, day, hour, minute });
      }
    }
  }
  
  return null;
}
