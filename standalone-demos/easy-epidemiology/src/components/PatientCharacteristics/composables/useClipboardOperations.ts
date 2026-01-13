import { ref } from 'vue';
import * as echarts from 'echarts';
import { showToast } from '../../DataInputVirtualScroll/logic/toast';

// Workaround for ClipboardItem type if not available in current TS lib environment
declare class ClipboardItem {
  constructor(data: { [mimeType: string]: Blob });
}

export function useClipboardOperations() {
  const isTableCopied = ref<boolean>(false);
  const isChartCopied = ref<boolean>(false);

  // Copy table to clipboard
  const copyTableToClipboard = async (): Promise<void> => {
    const tableEl = document.querySelector('.table-container .frequency-table') ||
                   document.querySelector('.frequency-table');
    
    if (!tableEl) {
      isTableCopied.value = false;
      return;
    }
    
    try {
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
      
      tempTable.querySelectorAll('th').forEach((th) => {
        Object.assign((th as HTMLElement).style, headerStyles);
      });
      
      tempTable.querySelectorAll('td').forEach((td) => {
        Object.assign((td as HTMLElement).style, cellStyles);
      });
      
      tempTable.querySelectorAll('tbody tr').forEach((tr) => {
        const firstTd = tr.querySelector('td');
        if (firstTd) firstTd.style.textAlign = 'left';
      });
      
      const html = tempTable.outerHTML;
      const text = (tableEl as HTMLElement).innerText;
      
      if ((navigator as any).clipboard && (window as any).ClipboardItem) {
        await (navigator as any).clipboard.write([
          new (window as any).ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([text], { type: 'text/plain' })
          })
        ]);
      } else {
        await (navigator as any).clipboard.writeText(text);
      }
      
      isTableCopied.value = true;
      setTimeout(() => (isTableCopied.value = false), 1500);
    } catch (e) {
      console.error('테이블 복사 오류:', e);
      isTableCopied.value = false;
    }
  };

  // Copy chart to clipboard
  const copyChartToClipboard = async (chartInstance: any, chartWidth: number): Promise<void> => {
    const instance = chartInstance;
    if (!instance || typeof instance.getDataURL !== 'function') {
      isChartCopied.value = false;
      return;
    }
    if (!(navigator as any).clipboard || !(navigator as any).clipboard.write) {
      isChartCopied.value = false;
      return;
    }
    if (typeof (window as any).ClipboardItem === 'undefined') {
      isChartCopied.value = false;
      return;
    }
    
    try {
      const tempContainer = document.createElement('div');
      tempContainer.style.width = `${chartWidth}px`;
      tempContainer.style.height = '500px';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      const tempChart = echarts.init(tempContainer);
      
      const currentOption = instance.getOption();
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
      await (navigator as any).clipboard.write([
        new (window as any).ClipboardItem({ [blob.type]: blob })
      ]);
      
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

  // Export chart (download)
  const exportChart = async (
    chartInstance: any, 
    chartWidth: number, 
    header: string, 
    selectedChartType: 'total' | 'patient'
  ): Promise<void> => {
    const instance = chartInstance;
    if (!instance || typeof instance.getDataURL !== 'function') {
      showToast('차트 내보내기 불가', 'error');
      return;
    }
    const chartKind = selectedChartType === 'total' ? '전체' : '환자';
    const filename = `${header}_${chartKind}_분포_고화질.png`;
    
    try {
      const tempContainer = document.createElement('div');
      tempContainer.style.width = `${chartWidth}px`;
      tempContainer.style.height = '500px';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      const tempChart = echarts.init(tempContainer);
      
      const currentOption = instance.getOption();
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
