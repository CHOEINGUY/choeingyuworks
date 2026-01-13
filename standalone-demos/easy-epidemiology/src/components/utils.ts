export function getScrollbarWidth(): number {
  // 스크롤바가 있는 더미 엘리먼트 생성
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // 스크롤바 강제 생성
  document.body.appendChild(outer);

  // 내부 엘리먼트 생성
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // 스크롤바 너비 계산 (바깥쪽 너비 - 안쪽 너비)
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // 더미 엘리먼트 제거
  if (outer.parentNode) {
    outer.parentNode.removeChild(outer);
  }

  return scrollbarWidth;
}
