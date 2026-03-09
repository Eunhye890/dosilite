/** 해당 월의 달력 그리드(6주 × 7일) 생성 */
export function getMonthDays(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay(); // 0=일요일

  const weeks: (Date | null)[][] = [];
  let current = new Date(year, month, 1 - startDow);

  for (let w = 0; w < 6; w++) {
    const week: (Date | null)[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

/** Date → 'YYYY-MM-DD' */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 해당 월의 시작일/종료일 반환 */
export function getMonthRange(year: number, month: number) {
  const start = formatDate(new Date(year, month, 1));
  const end = formatDate(new Date(year, month + 1, 0));
  return { start, end };
}

/** 한국어 요일 */
export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 'M월 D일 요일' 포맷 */
export function formatDateKorean(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dow = WEEKDAYS[date.getDay()];
  return `${month}월 ${day}일 ${dow}요일`;
}

/** 시간 표시용 — 'HH:MM:SS'도 'HH:MM'으로 자름 */
export function formatTimeRange(start: string, end: string): string {
  return `${start.slice(0, 5)}~${end.slice(0, 5)}`;
}

/** 두 날짜가 같은 날인지 비교 */
export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

/** 오늘인지 확인 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}
