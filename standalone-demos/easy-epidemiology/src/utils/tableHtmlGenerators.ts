import { CohortResult, CaseControlResult, CaseSeriesResult } from '@/types/analysis';

// ----------------------------------------------------------------------
// Constants & Styles
// ----------------------------------------------------------------------
const TABLE_STYLE = 'border-collapse: collapse; border: 1px solid #888; font-size: 8pt; font-family: "맑은 고딕", monospace; table-layout: fixed; width: 120%; box-sizing: border-box;';
const HEADER_STYLE = 'border: 1px solid #888; padding: 2px; text-align: center; background: #f2f2f2; font-weight: bold;';
const CELL_STYLE = 'border: 1px solid #888; padding: 4px 2px; text-align: center; white-space: nowrap; overflow: hidden; box-sizing: border-box;';
const HIGHLIGHT_STYLE = 'background-color: #fffbe6;';
const P_VALUE_STYLE = 'color: #e74c3c; font-weight: bold;';
const FOOTER_STYLE = 'font-size: 8pt; line-height: 1.4; font-family: "맑은 고딕", monospace;';

// ----------------------------------------------------------------------
// Cohort Generators
// ----------------------------------------------------------------------

export function generateCohortTsv(results: CohortResult[]): string {
  const tableData: string[][] = [];
  
  tableData.push([
    '요인(식단)',
    '섭취자(노출군)', '섭취자(노출군)', '섭취자(노출군)', 
    '비섭취자(비노출군)', '비섭취자(비노출군)', '비섭취자(비노출군)',
    '카이제곱', '상대위험비', '95% 신뢰구간', '95% 신뢰구간'
  ]);
  
  tableData.push([
    '',
    '대상자수', '환자수', '발병률(%)',
    '대상자수', '환자수', '발병률(%)',
    'P-value', 'Relative Risk', '하한', '상한'
  ]);
  
  results.forEach(result => {
    tableData.push([
      result.item ?? '',
      String(result.rowTotal_Exposed ?? ''),
      String(result.a_obs ?? ''),
      result.incidence_exposed_formatted || '',
      String(result.rowTotal_Unexposed ?? ''),
      String(result.c_obs ?? ''),
      result.incidence_unexposed_formatted || '',
      typeof result.pValue === 'number' ? 
        (result.pValue < 0.001 ? '<0.001' : result.pValue.toFixed(3)) + 
        (result.adj_chi === null ? '*' : '') : 
        'N/A',
      String(result.relativeRisk ?? ''),
      String(result.rr_ci_lower ?? ''),
      String(result.rr_ci_upper ?? '')
    ]);
  });
  
  return `${tableData.map(row => row.join('\t')).join('\n')}\n\n` +
    '통계 검정 방법 및 표시 기준:\n' +
    '* : Fisher\'s Exact Test (기대빈도 < 5인 셀이 있을 때)\n' +
    '- : Yates\' Corrected Chi-square Test (모든 셀 기대빈도 ≥ 5)\n' +
    'N/A : 계산 불가(셀 값이 0인 경우)';
}


export function generateCohortHtml(results: CohortResult[]): string {
  const rows = results.map(result => {
    const isSig = typeof result.pValue === 'number' && result.pValue < 0.05;
    const bgStyle = isSig ? HIGHLIGHT_STYLE : '';
    const pStyle = isSig ? P_VALUE_STYLE : '';
    const pValueText = typeof result.pValue === 'number'
      ? (result.pValue < 0.001 ? '<0.001' : result.pValue.toFixed(3)) + (result.adj_chi === null ? '*' : '') 
      : 'N/A';

    return `
      <tr>
        <td style="${CELL_STYLE} text-align: left; width: 13%; min-width: 13%; max-width: 13%; padding-left: 4px; ${bgStyle}"><span style="font-size: 8pt;">${result.item ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 7%; min-width: 7%; max-width: 7%; ${bgStyle}"><span style="font-size: 8pt;">${result.rowTotal_Exposed ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 7%; min-width: 7%; max-width: 7%; ${bgStyle}"><span style="font-size: 8pt;">${result.a_obs ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 7%; min-width: 7%; max-width: 7%; ${bgStyle}"><span style="font-size: 8pt;">${result.incidence_exposed_formatted ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 7%; min-width: 7%; max-width: 7%; ${bgStyle}"><span style="font-size: 8pt;">${result.rowTotal_Unexposed ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 7%; min-width: 7%; max-width: 7%; ${bgStyle}"><span style="font-size: 8pt;">${result.c_obs ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 7%; min-width: 7%; max-width: 7%; ${bgStyle}"><span style="font-size: 8pt;">${result.incidence_unexposed_formatted ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 10%; min-width: 10%; max-width: 10%; ${bgStyle}"><span style="font-size: 8pt; ${pStyle}">${pValueText}</span></td>
        <td style="${CELL_STYLE} width: 10%; min-width: 10%; max-width: 10%; ${bgStyle}"><span style="font-size: 8pt;">${result.relativeRisk ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 6%; min-width: 6%; max-width: 6%; ${bgStyle}"><span style="font-size: 8pt;">${result.rr_ci_lower ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 6%; min-width: 6%; max-width: 6%; ${bgStyle}"><span style="font-size: 8pt;">${result.rr_ci_upper ?? ''}</span></td>
      </tr>
    `;
  }).join('');

  return `
    <table style="${TABLE_STYLE}">
      <tr>
        <th rowspan="2" style="${HEADER_STYLE} width: 13%; min-width: 13%; max-width: 13%;"><span style="font-size: 8pt;">요인(식단)</span></th>
        <th colspan="3" style="${HEADER_STYLE} width: 20%; min-width: 20%; max-width: 20%;"><span style="font-size: 8pt;">섭취자(노출군)</span></th>
        <th colspan="3" style="${HEADER_STYLE} width: 20%; min-width: 20%; max-width: 20%;"><span style="font-size: 8pt;">비섭취자(비노출군)</span></th>
        <th rowspan="2" style="${HEADER_STYLE} width: 10%; min-width: 10%; max-width: 10%;"><span style="font-size: 8pt;">카이제곱 P-value</span></th>
        <th rowspan="2" style="${HEADER_STYLE} width: 10%; min-width: 10%; max-width: 10%;"><span style="font-size: 8pt;">상대위험비 Relative Risk</span></th>
        <th colspan="2" style="${HEADER_STYLE} width: 12%; min-width: 12%; max-width: 12%;"><span style="font-size: 8pt;">95% 신뢰구간</span></th>
      </tr>
      <tr>
        <th style="${HEADER_STYLE} width: 7%; min-width: 7%; max-width: 7%;"><span style="font-size: 8pt;">대상자수</span></th>
        <th style="${HEADER_STYLE} width: 7%; min-width: 7%; max-width: 7%;"><span style="font-size: 8pt;">환자수</span></th>
        <th style="${HEADER_STYLE} width: 7%; min-width: 7%; max-width: 7%;"><span style="font-size: 8pt;">발병률(%)</span></th>
        <th style="${HEADER_STYLE} width: 7%; min-width: 7%; max-width: 7%;"><span style="font-size: 8pt;">대상자수</span></th>
        <th style="${HEADER_STYLE} width: 7%; min-width: 7%; max-width: 7%;"><span style="font-size: 8pt;">환자수</span></th>
        <th style="${HEADER_STYLE} width: 7%; min-width: 7%; max-width: 7%;"><span style="font-size: 8pt;">발병률(%)</span></th>
        <th style="${HEADER_STYLE} width: 6%; min-width: 6%; max-width: 6%;"><span style="font-size: 8pt;">하한</span></th>
        <th style="${HEADER_STYLE} width: 6%; min-width: 6%; max-width: 6%;"><span style="font-size: 8pt;">상한</span></th>
      </tr>
      ${rows}
    </table>
    <div style="${FOOTER_STYLE}">
      <div><strong>통계 검정 방법 및 표시 기준</strong></div>
      <div>* : Fisher's Exact Test (기대빈도 &lt; 5인 셀이 있을 때)</div>
      <div>- : Yates' Corrected Chi-square Test (모든 셀 기대빈도 ≥ 5)</div>
      <div>N/A : 계산 불가(셀 값이 0인 경우)</div>
    </div>
  `;
}



// ----------------------------------------------------------------------
// Case Control Generators
// ----------------------------------------------------------------------

export function generateCaseControlTsv(results: CaseControlResult[]): string {
  const tableData: string[][] = [];
  
  tableData.push([
    '요인(식단)',
    '환자군', '환자군', '환자군', 
    '대조군', '대조군', '대조군',
    '카이제곱', '오즈비', '95% 신뢰구간', '95% 신뢰구간'
  ]);
  
  tableData.push([
    '',
    '섭취자', '비섭취자', '합계',
    '섭취자', '비섭취자', '합계',
    'P-value', '(Odds Ratio)', '하한', '상한'
  ]);
  
  results.forEach(result => {
    tableData.push([
      result.item ?? '',
      String(result.b_obs ?? ''),
      String(result.c_obs ?? ''),
      String(result.rowTotal_Case ?? ''),
      String(result.e_obs ?? ''),
      String(result.f_obs ?? ''),
      String(result.rowTotal_Control ?? ''),
      typeof result.pValue === 'number' ? 
        (result.pValue < 0.001 ? '<0.001' : result.pValue.toFixed(3)) + 
        (result.adj_chi === null ? '*' : '') : 
        'N/A',
      String(result.oddsRatio ?? ''),
      String(result.ci_lower ?? ''),
      String(result.ci_upper ?? '')
    ]);
  });
  
  return `${tableData.map(row => row.join('\t')).join('\n')}\n\n` +
    '통계 검정 방법 및 표시 기준:\n' +
    '* : Fisher\'s Exact Test (기대빈도 < 5인 셀이 있을 때)\n' +
    '- : Yates\' Corrected Chi-square Test (모든 셀 기대빈도 ≥ 5)\n' +
    'N/A : 계산 불가(셀 값이 0인 경우)';
}


export function generateCaseControlHtml(results: CaseControlResult[]): string {
  const rows = results.map(result => {
    const isSig = typeof result.pValue === 'number' && result.pValue < 0.05;
    const bgStyle = isSig ? HIGHLIGHT_STYLE : '';
    const pStyle = isSig ? P_VALUE_STYLE : '';
    const pValueText = typeof result.pValue === 'number'
      ? (result.pValue < 0.001 ? '<0.001' : result.pValue.toFixed(3)) + (result.adj_chi === null ? '*' : '') 
      : 'N/A';

    return `
      <tr>
        <td style="${CELL_STYLE} text-align: left; width: 13%; min-width: 13%; max-width: 13%; padding-left: 4px; ${bgStyle}"><span style="font-size: 8pt;">${result.item ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 7%; min-width: 7%; max-width: 7%; ${bgStyle}"><span style="font-size: 8pt;">${result.b_obs ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 7%; min-width: 7%; max-width: 7%; ${bgStyle}"><span style="font-size: 8pt;">${result.c_obs ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 7%; min-width: 7%; max-width: 7%; ${bgStyle}"><span style="font-size: 8pt;">${result.rowTotal_Case ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 7%; min-width: 7%; max-width: 7%; ${bgStyle}"><span style="font-size: 8pt;">${result.e_obs ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 7%; min-width: 7%; max-width: 7%; ${bgStyle}"><span style="font-size: 8pt;">${result.f_obs ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 7%; min-width: 7%; max-width: 7%; ${bgStyle}"><span style="font-size: 8pt;">${result.rowTotal_Control ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 10%; min-width: 10%; max-width: 10%; ${bgStyle}"><span style="font-size: 8pt; ${pStyle}">${pValueText}</span></td>
        <td style="${CELL_STYLE} width: 10%; min-width: 10%; max-width: 10%; ${bgStyle}"><span style="font-size: 8pt;">${result.oddsRatio ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 6%; min-width: 6%; max-width: 6%; ${bgStyle}"><span style="font-size: 8pt;">${result.ci_lower ?? ''}</span></td>
        <td style="${CELL_STYLE} width: 6%; min-width: 6%; max-width: 6%; ${bgStyle}"><span style="font-size: 8pt;">${result.ci_upper ?? ''}</span></td>
      </tr>
    `;
  }).join('');

  return `
    <table style="${TABLE_STYLE}">
      <tr>
        <th rowspan="2" style="${HEADER_STYLE} width: 13%; min-width: 13%; max-width: 13%;"><span style="font-size: 8pt;">요인(식단)</span></th>
        <th colspan="3" style="${HEADER_STYLE} width: 20%; min-width: 20%; max-width: 20%;"><span style="font-size: 8pt;">환자군</span></th>
        <th colspan="3" style="${HEADER_STYLE} width: 20%; min-width: 20%; max-width: 20%;"><span style="font-size: 8pt;">대조군</span></th>
        <th rowspan="2" style="${HEADER_STYLE} width: 10%; min-width: 10%; max-width: 10%;"><span style="font-size: 8pt;">카이제곱 P-value</span></th>
        <th rowspan="2" style="${HEADER_STYLE} width: 10%; min-width: 10%; max-width: 10%;"><span style="font-size: 8pt;">오즈비 (Odds Ratio)</span></th>
        <th colspan="2" style="${HEADER_STYLE} width: 12%; min-width: 12%; max-width: 12%;"><span style="font-size: 8pt;">95% 신뢰구간</span></th>
      </tr>
      <tr>
        <th style="${HEADER_STYLE} width: 7%; min-width: 7%; max-width: 7%;"><span style="font-size: 8pt;">섭취자</span></th>
        <th style="${HEADER_STYLE} width: 7%; min-width: 7%; max-width: 7%;"><span style="font-size: 8pt;">비섭취자</span></th>
        <th style="${HEADER_STYLE} width: 7%; min-width: 7%; max-width: 7%;"><span style="font-size: 8pt;">합계</span></th>
        <th style="${HEADER_STYLE} width: 7%; min-width: 7%; max-width: 7%;"><span style="font-size: 8pt;">섭취자</span></th>
        <th style="${HEADER_STYLE} width: 7%; min-width: 7%; max-width: 7%;"><span style="font-size: 8pt;">비섭취자</span></th>
        <th style="${HEADER_STYLE} width: 7%; min-width: 7%; max-width: 7%;"><span style="font-size: 8pt;">합계</span></th>
        <th style="${HEADER_STYLE} width: 6%; min-width: 6%; max-width: 6%;"><span style="font-size: 8pt;">하한</span></th>
        <th style="${HEADER_STYLE} width: 6%; min-width: 6%; max-width: 6%;"><span style="font-size: 8pt;">상한</span></th>
      </tr>
      ${rows}
    </table>
    <div style="${FOOTER_STYLE}">
      <div><strong>통계 검정 방법 및 표시 기준</strong></div>
      <div>* : Fisher's Exact Test (기대빈도 &lt; 5인 셀이 있을 때)</div>
      <div>- : Yates' Corrected Chi-square Test (모든 셀 기대빈도 ≥ 5)</div>
      <div>N/A : 계산 불가(셀 값이 0인 경우)</div>
    </div>
  `;
}

// ----------------------------------------------------------------------
// Case Series Generators (Added)
// ----------------------------------------------------------------------

export function generateCaseSeriesTsv(results: CaseSeriesResult[]): string {
  const tableData: string[][] = [];
  tableData.push(['요인(식단)', '섭취자', '비섭취자', '합계', '발병률(%)']);
  
  results.forEach(result => {
    tableData.push([
      result.item,
      String(result.exposedCases),
      String(result.unexposedCases),
      String(result.totalCases),
      result.incidence_formatted
    ]);
  });
  
  return tableData.map(row => row.join('\t')).join('\n');
}


export function generateCaseSeriesHtml(results: CaseSeriesResult[]): string {
  const rows = results.map(result => `
    <tr>
      <td style="${CELL_STYLE} text-align: left; width: 40%; min-width: 40%; max-width: 40%; padding-left: 4px;"><span style="font-size: 8pt;">${result.item}</span></td>
      <td style="${CELL_STYLE} width: 15%; min-width: 15%; max-width: 15%;"><span style="font-size: 8pt;">${result.exposedCases}</span></td>
      <td style="${CELL_STYLE} width: 15%; min-width: 15%; max-width: 15%;"><span style="font-size: 8pt;">${result.unexposedCases}</span></td>
      <td style="${CELL_STYLE} width: 15%; min-width: 15%; max-width: 15%;"><span style="font-size: 8pt;">${result.totalCases}</span></td>
      <td style="${CELL_STYLE} width: 15%; min-width: 15%; max-width: 15%;"><span style="font-size: 8pt;">${result.incidence_formatted}</span></td>
    </tr>
  `).join('');

  return `
    <table style="${TABLE_STYLE}">
      <tr>
        <th style="${HEADER_STYLE} width: 40%; min-width: 40%; max-width: 40%;"><span style="font-size: 8pt;">요인(식단)</span></th>
        <th style="${HEADER_STYLE} width: 15%; min-width: 15%; max-width: 15%;"><span style="font-size: 8pt;">섭취자</span></th>
        <th style="${HEADER_STYLE} width: 15%; min-width: 15%; max-width: 15%;"><span style="font-size: 8pt;">비섭취자</span></th>
        <th style="${HEADER_STYLE} width: 15%; min-width: 15%; max-width: 15%;"><span style="font-size: 8pt;">합계</span></th>
        <th style="${HEADER_STYLE} width: 15%; min-width: 15%; max-width: 15%;"><span style="font-size: 8pt;">발병률(%)</span></th>
      </tr>
      ${rows}
    </table>
  `;
}
