
export interface PartyItem {
    time: string;
    desc: string;
}

export interface Schedule {
    start: number;
    rotation: string;
    arrivalTip: string;
    party1: PartyItem[];
    party2: PartyItem[];
}

interface ScheduleMap {
    [key: number]: Schedule;
}

export function formatEventDateTime(dtStr: string | null): string {
    if (!dtStr) return "";

    // 1) 숫자만 추출하여 기본 형식 우선 처리
    const digits = dtStr.replace(/\D/g, "");
    let year = "", month = "", day = "", hour = null, minute = null;

    if (digits.length >= 12) {
        year = digits.slice(0, 4);
        month = digits.slice(4, 6);
        day = digits.slice(6, 8);
        hour = digits.slice(8, 10);
        minute = digits.slice(10, 12);
    } else if (digits.length === 8) {
        const nowYear = new Date().getFullYear();
        year = String(nowYear);
        month = digits.slice(0, 2);
        day = digits.slice(2, 4);
        hour = digits.slice(4, 6);
        minute = digits.slice(6, 8);
    } else {
        const normalized = dtStr.includes("T") ? dtStr : dtStr.replace(" ", "T");
        const parsed = new Date(normalized);
        if (!isNaN(parsed.getTime())) {
            return prettyFormat(parsed, true);
        }
        return "";
    }

    const yNum = Number(year);
    const mNum = Number(month) - 1;
    const dNum = Number(day);
    const hNum = hour != null ? Number(hour) : 0;
    const minNum = minute != null ? Number(minute) : 0;
    const date = new Date(yNum, mNum, dNum, hNum, minNum, 0, 0);
    if (isNaN(date.getTime())) return "";
    return prettyFormat(date, hour != null);
}

function prettyFormat(dateObj: Date, hasTime: boolean): string {
    const weekdayShort = ['일', '월', '화', '수', '목', '금', '토'];
    const m = dateObj.getMonth() + 1;
    const d = dateObj.getDate();
    const w = weekdayShort[dateObj.getDay()];
    const hh24 = dateObj.getHours();

    let timeStr = "";
    if (hasTime) {
        let hh12 = hh24 % 12;
        hh12 = hh12 ? hh12 : 12;
        const ampm = hh24 >= 12 ? "저녁 " : "오전 ";
        timeStr = ` ${ampm}${hh12}시`;
    }

    return `${m}월 ${d}일 (${w})${timeStr}`;
}

export function getScheduleData(startHourParam: string | null, eventDatetime: string | null): Schedule | null {
    // 1) Time Inference
    let startHour = startHourParam ? parseInt(startHourParam, 10) : NaN;

    if (isNaN(startHour)) {
        const digits = (eventDatetime || '').replace(/\D/g, '');
        if (digits.length >= 12) {
            startHour = parseInt(digits.slice(8, 10), 10);
        } else if (digits.length === 8) {
            startHour = parseInt(digits.slice(4, 6), 10);
        } else {
            const normalized = (eventDatetime || '').includes('T') ? (eventDatetime || '') : (eventDatetime || '').replace(' ', 'T');
            const parsed = new Date(normalized);
            if (!isNaN(parsed.getTime())) startHour = parsed.getHours();
        }
    }

    // Default if not 19 or 20
    if (startHour !== 19 && startHour !== 20) return null;

    const scheduleData: ScheduleMap = {
        19: {
            start: 19,
            rotation: '19:00, 20:00, 21:00, 22:00 — 진행에 따라 변동될 수 있어요. 해당 시간엔 자리에서 기다려 주세요.',
            arrivalTip: '지각은 손해! 18:50 전 도착을 권장해요. 늦으면 첫 만남을 놓칠 수 있어요.',
            party1: [
                { time: '18:40~19:00', desc: '입장 대기 및 명단 체크' },
                { time: '19:00~19:10', desc: '1·2차 룰 소개/안내' },
                { time: '19:10~19:30', desc: '같은 테이블끼리 인사하며 한 잔' },
                { time: '19:30~19:50', desc: '노래 맞추기 등 아이스브레이킹' },
                { time: '19:50~20:10', desc: '서로를 알아가는 시간' },
                { time: '20:10~20:30', desc: '영화 맞추기 등 한 번 더 친해지기' },
                { time: '20:30~20:40', desc: '대화 타임' },
                { time: '20:40~21:00', desc: '칭찬 게임으로 설렘 업' },
                { time: '21:00~21:30', desc: '방해하지 않을게요, 대화에 몰입!' }
            ],
            party2: [
                { time: '22:00~22:05', desc: '2차 파티 룰 안내' },
                { time: '22:05~23:45', desc: '대화하며 서로의 마음 확인' },
                { time: '22:45~23:15', desc: '마음 확인하는 시간' },
                { time: '23:15~24:00', desc: '자율적으로 자리 이동하며 표현하기' }
            ]
        },
        20: {
            start: 20,
            rotation: '20:00, 21:00, 22:00, 23:00 — 진행에 따라 변동될 수 있어요. 해당 시간엔 자리에서 기다려 주세요.',
            arrivalTip: '지각은 손해! 19:50 전 도착을 권장해요. 늦으면 첫 만남을 놓칠 수 있어요.',
            party1: [],
            party2: []
        }
    };

    const shiftTime = (timeStr: string) => {
        const [start, end] = timeStr.split('~');
        const shift = (t: string) => {
            const [h, m] = t.split(':').map(Number);
            return `${String((h + 1) % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };
        return `${shift(start)}~${shift(end)}`;
    };

    scheduleData[20].party1 = scheduleData[19].party1.map(item => ({
        time: shiftTime(item.time),
        desc: item.desc
    }));
    scheduleData[20].party2 = scheduleData[19].party2.map(item => ({
        time: shiftTime(item.time),
        desc: item.desc
    }));

    return scheduleData[startHour];
}
