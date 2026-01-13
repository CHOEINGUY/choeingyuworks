/**
 * UI related utility functions for DataInputVirtualScroll
 */

/**
 * 가상 스크롤 환경에서 데이트피커 위치 계산
 * @param cellRect - 셀의 getBoundingClientRect() 결과
 * @returns - {top, left} 위치 객체
 */
export function calculatePickerPosition(cellRect: DOMRect): { top: number; left: number } {
    // 데이트피커 예상 크기
    const pickerWidth = 450;
    const pickerHeight = 400;
    const margin = 10; // 화면 경계와의 여백

    // 화면 크기 정보
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 기본 위치: 셀 하단 중앙
    let top = cellRect.bottom + 4; // 4px 여백
    let left = cellRect.left + (cellRect.width / 2) - (pickerWidth / 2); // 셀 중앙 정렬

    // 좌측 경계 체크
    if (left < margin) {
        left = margin;
    }

    // 우측 경계 체크
    if (left + pickerWidth > viewportWidth - margin) {
        left = viewportWidth - pickerWidth - margin;
    }

    // 여전히 화면을 벗어나면 셀 좌측에 맞춤
    if (left < margin) {
        left = cellRect.left;
        // 셀 좌측도 화면을 벗어나면 최소 여백 유지
        if (left < margin) {
            left = margin;
        }
    }

    // 하단 경계 체크 - 공간이 부족하면 셀 상단에 표시
    if (top + pickerHeight > viewportHeight - margin) {
        top = cellRect.top - pickerHeight - 4; // 셀 상단에 표시
        // 상단에도 공간이 부족하면 화면 내부로 조정
        if (top < margin) {
            // 화면 내부에서 최적 위치 찾기
            const availableTopSpace = cellRect.top - margin;
            const availableBottomSpace = viewportHeight - cellRect.bottom - margin;
            if (availableTopSpace > availableBottomSpace) {
                // 상단 공간이 더 크면 상단에 최대한 표시
                top = Math.max(margin, cellRect.top - pickerHeight);
            }
            else {
                // 하단 공간이 더 크거나 같으면 하단에 표시
                top = cellRect.bottom + 4;
                // 필요하면 높이 제한 (여기서는 위치만 조정)
                if (top + pickerHeight > viewportHeight - margin) {
                    top = viewportHeight - pickerHeight - margin;
                }
            }
        }
    }

    // 스크롤 컨테이너 고려 (추가 보정)
    const scrollContainer = document.querySelector('.grid-container');
    if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        // 컨테이너 영역 내부로 제한
        if (top < containerRect.top + margin) {
            top = containerRect.top + margin;
        }
        if (left < containerRect.left + margin) {
            left = containerRect.left + margin;
        }
        if (left + pickerWidth > containerRect.right - margin) {
            left = containerRect.right - pickerWidth - margin;
        }
    }

    console.log(`[PickerPosition] Cell: ${cellRect.left}, ${cellRect.top}, ${cellRect.width}x${cellRect.height}`);
    console.log(`[PickerPosition] Calculated: ${left}, ${top}`);

    return { top, left };
}