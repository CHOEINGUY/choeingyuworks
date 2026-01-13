import { ref, type Ref } from 'vue';
import * as echarts from 'echarts';
import { showToast } from '../../DataInputVirtualScroll/logic/toast';

export interface ClipboardOperationsParams {
  chartInstance: Ref<any | null>;
  chartWidth: Ref<number>;
}

export interface UseClipboardOperationsReturn {
  isTableCopied: Ref<boolean>;
  isChartCopied: Ref<boolean>;
  copyTableToClipboard: () => Promise<void>;
  copyChartToClipboard: () => Promise<void>;
  exportChart: () => Promise<void>;
}

/**
 * 클립보드/내보내기 기능 composable
 * @param {ClipboardOperationsParams} options - 옵션
 * @returns {UseClipboardOperationsReturn} 복사/내보내기 관련 상태와 함수들
 */
export function useClipboardOperations(options: ClipboardOperationsParams): UseClipboardOperationsReturn {
  const { chartInstance, chartWidth } = options;

  const isTableCopied = ref<boolean>(false);
  const isChartCopied = ref<boolean>(false);

  /**
   * 테이블을 클립보드에 복사
   */
  const copyTableToClipboard = async (): Promise<void> => {
    let tableEl: HTMLElement | null = null;
    
    try {
      const tableContainer = document.querySelector('.analysis-table-container');
      if (tableContainer) {
        tableEl = tableContainer.querySelector('.frequency-table');
      }
      if (!tableEl) {
        tableEl = document.querySelector('.frequency-table');
      }
      if (!tableEl) {
        console.warn('copyTableToClipboard: 테이블 요소를 찾을 수 없음');
        isTableCopied.value = false;
        return;
      }
      
      const tempTable = tableEl.cloneNode(true) as HTMLElement;
      
      const tableStyles: Partial<CSSStyleDeclaration> = {
        borderCollapse: 'collapse',
        border: '1px solid #888',
        fontSize: '14px',
        width: '100%'
      };
      Object.assign(tempTable.style, tableStyles);
      
      const cellStyles: Partial<CSSStyleDeclaration> = {
        border: '1px solid #888',
        padding: '8px 4px',
        textAlign: 'center'
      };
      
      const headerStyles: Partial<CSSStyleDeclaration> = {
        ...cellStyles,
        background: '#f2f2f2',
        fontWeight: 'bold'
      };
      
      tempTable.querySelectorAll('th').forEach((th: any) => {
        Object.assign(th.style, headerStyles);
      });
      
      tempTable.querySelectorAll('td').forEach((td: any) => {
        Object.assign(td.style, cellStyles);
      });
      
      tempTable.querySelectorAll('tbody tr').forEach((tr: any) => {
        const firstTd = tr.querySelector('td');
        if (firstTd) firstTd.style.textAlign = 'left';
      });
      
      const html = tempTable.outerHTML;
      const text = tableEl.innerText;
      
      if ((navigator as any).clipboard && window.ClipboardItem) {
        await (navigator as any).clipboard.write([
          new window.ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([text], { type: 'text/plain' })
          })
        ]);
      } else {
        await (navigator as any).clipboard.writeText(text);
      }
      
      isTableCopied.value = true;
      setTimeout(() => (isTableCopied.value = false), 1500);
      console.log('테이블 복사 완료');
    } catch (e) {
      console.error('테이블 복사 오류:', e);
      isTableCopied.value = false;
    }
  };

  /**
   * 차트를 클립보드에 복사
   */
  const copyChartToClipboard = async (): Promise<void> => {
    const instance = chartInstance.value;
    if (!instance || typeof instance.getDataURL !== 'function') {
      console.warn('copyChartToClipboard: 차트 인스턴스가 없거나 getDataURL 함수가 없음');
      isChartCopied.value = false;
      return;
    }
    if (!(navigator as any).clipboard || !(navigator as any).clipboard.write) {
      console.warn('copyChartToClipboard: 클립보드 API를 사용할 수 없음');
      isChartCopied.value = false;
      return;
    }
    if (typeof ClipboardItem === 'undefined') {
      console.warn('copyChartToClipboard: ClipboardItem을 사용할 수 없음');
      isChartCopied.value = false;
      return;
    }
    
    try {
      const tempContainer = document.createElement('div');
      tempContainer.style.width = `${chartWidth.value}px`;
      tempContainer.style.height = '600px';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      const tempChart = echarts.init(tempContainer);
      
      const currentOption = instance.getOption();
      // @ts-ignore: animation property might need explicit cast if not in type
      currentOption.animation = false;
      tempChart.setOption(currentOption, true);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = tempChart.getDataURL({ 
        type: 'png', 
        pixelRatio: 3, 
        backgroundColor: '#fff'
      });
      
      if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
        throw new Error('유효하지 않은 이미지 데이터 URL');
      }
      
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`이미지 로드 실패: ${response.statusText}`);
      }
      const blob = await response.blob();
      await (navigator as any).clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      
      tempChart.dispose();
      document.body.removeChild(tempContainer);
      
      isChartCopied.value = true;
      setTimeout(() => (isChartCopied.value = false), 1500);
      console.log('차트 복사 완료');
    } catch (error) {
      console.error('차트 복사 오류:', error);
      isChartCopied.value = false;
    }
  };

  /**
   * 차트를 파일로 저장
   */
  const exportChart = async (): Promise<void> => {
    const instance = chartInstance.value;
    if (!instance || typeof instance.getDataURL !== 'function') {
      showToast('차트 내보내기 불가', 'error');
      return;
    }
    const filename = `임상증상_분석_${new Date().toISOString().split('T')[0]}.png`;
    
    try {
      const tempContainer = document.createElement('div');
      tempContainer.style.width = `${chartWidth.value}px`;
      tempContainer.style.height = '600px';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      const tempChart = echarts.init(tempContainer);
      
      const currentOption = instance.getOption();
      // @ts-ignore
      currentOption.animation = false;
      tempChart.setOption(currentOption, true);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = tempChart.getDataURL({ 
        type: 'png', 
        pixelRatio: 3, 
        backgroundColor: '#fff'
      });
      
      if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
        throw new Error('유효하지 않은 이미지 데이터 URL');
      }
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      tempChart.dispose();
      document.body.removeChild(tempContainer);
      
      console.log('차트 저장 완료:', filename);
    } catch (error: any) {
      const message = `차트 내보내기 오류: ${error.message}`;
      console.error(message);
      showToast(message, 'error');
    }
  };

  return {
    isTableCopied,
    isChartCopied,
    copyTableToClipboard,
    copyChartToClipboard,
    exportChart
  };
}
