import { ref, computed, Ref, ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useEpidemicStore } from '../../../stores/epidemicStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { getReportTemplate } from '../../../templates/reportTemplate';
import { createComponentLogger } from '../../../utils/logger';
import { 
  loadTemplateSection0, 
  replacePlaceholders,
  createHwpxFromTemplate,
  downloadHwpxFile
} from '../../../utils/hwpxProcessor';
import { ReportData, StudyDesign, AnalysisResultItem, SymptomStat, StatAnalysisText } from '../../../types/report';
import { showToast } from '../../DataInputVirtualScroll/logic/toast';

const logger = createComponentLogger('ReportWriter');

export function useReportData(): ReportData {
  const epidemicStore = useEpidemicStore();
  const settingsStore = useSettingsStore();
  const { t, locale } = useI18n();
  
  // --- Local State ---
  const studyDesign: Ref<StudyDesign> = ref(null);
  
  // --- Modals State ---
  const showAnalysisModal: Ref<boolean> = ref(false);
  const analysisModalMessage: Ref<string> = ref('');
  const pendingStudyDesign: Ref<string> = ref('');

  // --- Helper Functions ---
  function getLocaleDays(): string[] {
    return (t('reportWriter.generation.dates.days', { returnObjects: true }) as any) as string[];
  }

  function formatLocaleDate(dateObj: Date | null): string | null {
    if (!dateObj || isNaN(dateObj.getTime())) return null;
    const days = getLocaleDays();
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth()+1).padStart(2,'0');
    const dd = String(dateObj.getDate()).padStart(2,'0');
    const day = days[dateObj.getDay()];
    const hh = String(dateObj.getHours()).padStart(2,'0');
    
    if (locale.value === 'ko') {
      return `${yyyy}${t('reportWriter.generation.dates.year')} ${mm}${t('reportWriter.generation.dates.month')} ${dd}${t('reportWriter.generation.dates.day')} (${day}${t('reportWriter.generation.dates.period')}) ${hh}${t('reportWriter.generation.dates.hour')}`;
    } else {
      return `${yyyy}${t('reportWriter.generation.dates.year')}${mm}${t('reportWriter.generation.dates.month')}${dd}${t('reportWriter.generation.dates.day')} (${day}) ${hh}${t('reportWriter.generation.dates.hour')}`;
    }
  }

  function formatLocaleDateTime(dateObj: Date | null): string | null {
    if (!dateObj || isNaN(dateObj.getTime())) return null;
    const days = getLocaleDays();
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth()+1).padStart(2,'0');
    const dd = String(dateObj.getDate()).padStart(2,'0');
    const day = days[dateObj.getDay()];
    const hh = String(dateObj.getHours()).padStart(2,'0');
    const mi = String(dateObj.getMinutes()).padStart(2,'0');
    
    if (locale.value === 'ko') {
      return `${yyyy}${t('reportWriter.generation.dates.year')} ${mm}${t('reportWriter.generation.dates.month')} ${dd}${t('reportWriter.generation.dates.day')} (${day}${t('reportWriter.generation.dates.period')}) ${hh}${t('reportWriter.generation.dates.hour')} ${mi}${t('reportWriter.generation.dates.minute')}`;
    } else {
      return `${yyyy}${t('reportWriter.generation.dates.year')}${mm}${t('reportWriter.generation.dates.month')}${dd}${t('reportWriter.generation.dates.day')} (${day}) ${hh}${t('reportWriter.generation.dates.hour')}${mi}${t('reportWriter.generation.dates.minute')}`;
    }
  }

  // --- Basic Data getters ---
  const rows = computed(() => epidemicStore.rows || []);
  const totalParticipants: ComputedRef<number> = computed(() => rows.value.length);
  const patientRows = computed(() => rows.value.filter((r: any) => r && String(r.isPatient) === '1'));
  const patientCount: ComputedRef<number> = computed(() => patientRows.value.length);
  const confirmedRows = computed(() => rows.value.filter((r: any) => r && String(r.isConfirmedCase) === '1'));
  const confirmedCount: ComputedRef<number | null> = computed(() => {
    if (!settingsStore.isConfirmedCaseColumnVisible) return null;
    return confirmedRows.value.length;
  });

  const caseAttackRate: ComputedRef<string | null> = computed(() => epidemicStore.getCaseAttackRate);
  const patientAttackRate: ComputedRef<string | null> = computed(() => epidemicStore.getPatientAttackRate);
  const confirmedAttackRate: ComputedRef<string | null> = computed(() => {
    if (!settingsStore.isConfirmedCaseColumnVisible || totalParticipants.value === 0) return null;
    if (confirmedCount.value === null) return null;
    return ((confirmedCount.value / totalParticipants.value) * 100).toFixed(1);
  });

  const exposureDate: ComputedRef<string | null> = computed(() => {
    // @ts-ignore
    const raw = settingsStore.exposureDate || settingsStore.getExposureDate; 
    if (!raw) return null;
    if (typeof raw === 'string' && raw.includes('~')) {
      const [start, end] = raw.split('~').map(s => new Date(s.trim()));
      return `${formatLocaleDate(start)} ~ ${formatLocaleDate(end)}`;
    }
    const dt = new Date(raw);
    return formatLocaleDate(dt);
  });

  const firstCaseDate: ComputedRef<string | null> = computed(() => {
    const dt = epidemicStore.getFirstCaseDate;
    if (!dt) return null;
    return formatLocaleDate(new Date(dt));
  });

  const meanIncubation: ComputedRef<string | null> = computed(() => {
    const pRows = rows.value.filter((r: any) => r && String(r.isPatient) === '1');
    const isIndividual = settingsStore.isIndividualExposureColumnVisible;
    
    let durations: number[] = [];
    
    if (isIndividual) {
      durations = pRows.map((row: any) => {
        if (!row.symptomOnset || !row.individualExposureTime) return null;
        const onset = new Date(row.symptomOnset);
        const exposure = new Date(row.individualExposureTime);
        if (isNaN(onset.getTime()) || isNaN(exposure.getTime()) || onset < exposure) return null;
        return onset.getTime() - exposure.getTime();
      }).filter((duration: number | null): duration is number => duration !== null);
    } else {
      const exposureDateTime = settingsStore.exposureDateTime; 
      if (!exposureDateTime) return null;
      
      const exposureDate = new Date(exposureDateTime);
      if (isNaN(exposureDate.getTime())) return null;
      
      durations = pRows.map((row: any) => {
        if (!row.symptomOnset) return null;
        const onset = new Date(row.symptomOnset);
        if (isNaN(onset.getTime()) || onset < exposureDate) return null;
        return onset.getTime() - exposureDate.getTime();
      }).filter((duration: number | null): duration is number => duration !== null);
    }
    
    if (durations.length === 0) return null;
    
    const sum = durations.reduce((acc, val) => acc + val, 0);
    const avgDuration = sum / durations.length;
    return (avgDuration / 3600000).toFixed(1);
  });

  const suspectedSource = computed(() => {
    const selectedFoods = settingsStore.selectedSuspectedFoods;
    console.log('[useReportData] getSelectedSuspectedFoods:', selectedFoods);
    if (selectedFoods && selectedFoods.trim()) {
      return selectedFoods;
    }
    return settingsStore.suspectedSource;
  });

  // --- Analysis Status ---
  const analysisResultsAll = computed(() => settingsStore.analysisResults || {});
  
  const analysisStatus = computed(() => {
    const results = analysisResultsAll.value;
    if (!results || (!results.caseControl && !results.cohort)) {
      return 'no-analysis';
    }
    
    const caseControlResults: AnalysisResultItem[] = results.caseControl || [];
    const hasCaseControlData = caseControlResults.some(r => {
      return (r.pValue !== null && r.pValue !== undefined) || 
             (r.item && r.item !== 'N/A') ||
             (r.oddsRatio && r.oddsRatio !== 'N/A');
    });
    
    const cohortResults: AnalysisResultItem[] = results.cohort || [];
    const hasCohortData = cohortResults.some(r => {
      return (r.pValue !== null && r.pValue !== undefined) || 
             (r.item && r.item !== 'N/A') ||
             (r.relativeRisk && r.relativeRisk !== 'N/A');
    });
    
    if (hasCaseControlData && hasCohortData) {
      return 'both-available';
    } else if (hasCaseControlData) {
      return 'case-control-only';
    } else if (hasCohortData) {
      return 'cohort-only';
    } else {
      return 'no-valid-data';
    }
  });

  // --- Methods ---
  function handleStudyDesignChange(newDesign: StudyDesign) {
    if (studyDesign.value === newDesign) return;
    
    const results = analysisResultsAll.value;
    const designResults: AnalysisResultItem[] = newDesign === 'case-control' ? (results?.caseControl || []) : (results?.cohort || []);
    
    const hasValidData = designResults.some(r => {
      return (r.pValue !== null && r.pValue !== undefined) || 
             (r.item && r.item !== 'N/A') ||
             (newDesign === 'case-control' ? 
               (r.oddsRatio && r.oddsRatio !== 'N/A') : 
               (r.relativeRisk && r.relativeRisk !== 'N/A'));
    });
    
    if (!hasValidData) {
      const designText = newDesign === 'case-control' 
        ? t('reportWriter.editor.studyDesign.caseControl') 
        : t('reportWriter.editor.studyDesign.cohort');
      analysisModalMessage.value = `${designText} ${t('reportWriter.modal.message')}`;
      pendingStudyDesign.value = newDesign || '';
      showAnalysisModal.value = true;
      return;
    }
    
    studyDesign.value = newDesign;
  }

  function closeAnalysisModal() {
    showAnalysisModal.value = false;
    analysisModalMessage.value = '';
    pendingStudyDesign.value = '';
  }

  // --- Render Helpers AND Data Access ---

  function getDesignResults(): AnalysisResultItem[] {
    return studyDesign.value === 'case-control' ? (analysisResultsAll.value.caseControl || []) : (analysisResultsAll.value.cohort || []);
  }

  const suspectedFoodsStr = computed(() => settingsStore.selectedSuspectedFoods || '');
  function parseSuspectedFoods(): string[] {
    return suspectedFoodsStr.value.split(',').map((f: string) => f.trim()).filter((f: string) => f);
  }

  const foodItemCount = computed(() => getDesignResults().length);
  const hasTooManyFoodItems = computed(() => foodItemCount.value > 34);

  function generateFoodIntakeText(): string {
    const results = getDesignResults();
    if (!results || !results.length) return '';
    
    const filtered = results.filter(r => r.pValue !== null && r.pValue !== undefined && r.pValue < 0.05);
    if (!filtered.length) return '';
    
    const metric = studyDesign.value==='case-control' ? 'OR' : 'RR';
    const parts = filtered.map(r => {
      const pVal = (typeof r.pValue === 'number') ? r.pValue : parseFloat(String(r.pValue));
      const pValueText = pVal < 0.001 ? '<0.001' : pVal.toFixed(3);
      const metricValue = studyDesign.value === 'case-control' ? (r.oddsRatio || 'N/A') : (r.relativeRisk || 'N/A');
      const lowerCI = studyDesign.value === 'case-control' ? (r.ci_lower || 'N/A') : (r.rr_ci_lower || 'N/A');
      const upperCI = studyDesign.value === 'case-control' ? (r.ci_upper || 'N/A') : (r.rr_ci_upper || 'N/A');
      return `${r.item || 'N/A'} (p = ${pValueText}, ${metric} = ${metricValue} (${lowerCI} - ${upperCI}))`;
    });
    
    if (locale.value === 'ko') {
      return t('reportWriter.generation.descriptions.foodIntakeResult', { parts: parts.join(', ') });
    } else {
      return t('reportWriter.generation.descriptions.foodIntakeResult', { parts: parts.join(', ') });
    }
  }

  const foodIntakeAnalysis = computed(() => {
    if (!studyDesign.value) {
      return `<div class="placeholder-table"><strong>${t('reportWriter.editor.items.foodAnalysis')}</strong><br/><small>${t('reportWriter.editor.tooltips.designRequired')}</small></div>`;
    }
    
    const results = analysisResultsAll.value;
    if (!results) {
      const designText = studyDesign.value === 'case-control' 
        ? t('reportWriter.editor.studyDesign.caseControl') 
        : t('reportWriter.editor.studyDesign.cohort');
      return `<div class="placeholder-table"><strong>${t('reportWriter.editor.items.foodAnalysis')}</strong><br/><small>${designText} ${t('reportWriter.modal.message')}</small></div>`;
    }
    
    const designResults = getDesignResults();
    if(!designResults.length) {
      const designText = studyDesign.value === 'case-control' 
        ? t('reportWriter.editor.studyDesign.caseControl') 
        : t('reportWriter.editor.studyDesign.cohort');
      return `<div class="placeholder-table"><strong>${t('reportWriter.editor.items.foodAnalysis')}</strong><br/><small>${designText} ${t('reportWriter.modal.message')}</small></div>`;
    }

    const hasValidData = designResults.some(r => {
      return (r.pValue !== null && r.pValue !== undefined) || 
             (r.item && r.item !== 'N/A') ||
             (studyDesign.value === 'case-control' ? 
               (r.oddsRatio && r.oddsRatio !== 'N/A') : 
               (r.relativeRisk && r.relativeRisk !== 'N/A'));
    });
  
    if (!hasValidData) {
      const designText = studyDesign.value === 'case-control' 
        ? t('reportWriter.editor.studyDesign.caseControl') 
        : t('reportWriter.editor.studyDesign.cohort');
      return `<div class="placeholder-table"><strong>${t('reportWriter.editor.items.foodAnalysis')}</strong><br/><small>${designText} ${t('reportWriter.modal.message')}</small></div>`;
    }
  
    return generateFoodIntakeText();
  });

  // --- Statistics Text Building ---
  const analysisOptions = computed(() => settingsStore.analysisOptions || { statMethod: 'chi-square', haldaneCorrection: false });
  const yatesSettings = computed(() => settingsStore.yatesCorrectionSettings || { caseControl: false, cohort: false });

  function getStatMethodText(method: string) {
    if (locale.value === 'ko') {
      switch (method) {
      case 'chi-square': return t('reportWriter.generation.descriptions.statisticalMethod').split(' 및 ')[0]; // Simplified
      case 'chi-fisher': return t('reportWriter.generation.descriptions.statisticalMethod');
      case 'yates': return t('reportWriter.generation.descriptions.statisticalMethodYates');
      case 'yates-fisher': return t('reportWriter.generation.descriptions.statisticalMethodYatesFisher');
      default: return '';
      }
    } else {
      switch (method) {
      case 'chi-square': return 'through Chi-square test,';
      case 'chi-fisher': return 'through Chi-square test and Fisher\'s exact test,';
      case 'yates': return 'through Chi-square test with Yates\' correction,';
      case 'yates-fisher': return 'through Chi-square test with Yates\' correction and Fisher\'s exact test,';
      default: return '';
      }
    }
  }

  function buildStatAnalysisText(): StatAnalysisText {
    const base = t('reportWriter.generation.descriptions.statisticalBase');
    
    if (!studyDesign.value) {
      return { base, method: t('reportWriter.editor.status.designRequired') };
    }
    const currentYatesSetting = studyDesign.value === 'case-control' ? yatesSettings.value.caseControl : yatesSettings.value.cohort;
    const statMethod = currentYatesSetting ? 'yates' : 'chi-square';
    
    const methodText = getStatMethodText(statMethod);
    const metric = studyDesign.value === 'case-control' ? 'OR' : 'RR';
    const metricFull = studyDesign.value === 'case-control' ? (locale.value === 'ko' ? '교차비(OR)' : 'Odds Ratio (OR)') : (locale.value === 'ko' ? '상대위험도(RR)' : 'Relative Risk (RR)');
    
    const secondSentence = t('reportWriter.generation.descriptions.statAnalysisResult', {
      metric: metric,
      methodText: methodText
    });
    
    let corrSentence = '';
    if (analysisOptions.value.haldaneCorrection) {
      const metricLabel = studyDesign.value === 'case-control' ? (locale.value === 'ko' ? '오즈비' : 'Odds Ratio') : (locale.value === 'ko' ? '상대위험도' : 'Relative Risk');
      corrSentence = ' ' + t('reportWriter.generation.descriptions.haldaneCorrection', { metric: metricLabel });
    }
    return { base, method: `${secondSentence}${corrSentence}` };
  }

  // --- Chart & Incubation logic ---
  const epidemicChartSettings = computed(() => settingsStore.epidemicCurveSettings);
  const hasEpidemicChart = computed(() => epidemicChartSettings.value?.reportChartDataUrl);
  const hasIncubationChart = computed(() => epidemicChartSettings.value?.reportIncubationChartDataUrl);
  
  const hasMainSymptomsTable = computed(() => {
    const pRows = rows.value.filter((r: any) => r && String(r.isPatient) === '1');
    const clinicalHeaders = epidemicStore.headers?.clinical || [];
    if (!pRows.length || !clinicalHeaders.length) return false;
    
    const symptomStats = clinicalHeaders.map((symptom: any, index: number) => {
      const count = pRows.filter((row: any) => row.clinicalSymptoms && row.clinicalSymptoms[index] === '1').length;
      return count;
    }).filter((count: number) => count > 0);
    
    return symptomStats.length > 0;
  });

  const getChartImagePath = () => (epidemicChartSettings.value && epidemicChartSettings.value.reportChartDataUrl) ? epidemicChartSettings.value.reportChartDataUrl : null;
  const getIncubationChartImagePath = () => (epidemicChartSettings.value && epidemicChartSettings.value.reportIncubationChartDataUrl) ? epidemicChartSettings.value.reportIncubationChartDataUrl : null;

  function generateIncubationExposureText(): string {
    const selectedList = parseSuspectedFoods();
    const suspected = selectedList.length ? selectedList.join(', ') : (suspectedSource.value || '--');
    const isIndividual = settingsStore.isIndividualExposureColumnVisible;
    const patientRowsArr = patientRows.value;
    const fmt = (num: any) => (num === null || num === undefined || isNaN(num) ? '--' : Number(num).toFixed(1));
    const durations: number[] = [];
    
    const exposureSingleStr = settingsStore.exposureDateTime;
    let exposureSingleDate: Date | null = null;
    if (!isIndividual && exposureSingleStr && !exposureSingleStr.includes('~')) {
      const normalized = exposureSingleStr.includes('T') ? exposureSingleStr : exposureSingleStr.replace(' ', 'T');
      const d = new Date(normalized);
      if (!isNaN(d.getTime())) exposureSingleDate = d;
    }
    let exposureRangeStart: Date | null = null;
    let exposureRangeEnd: Date | null = null;
    patientRowsArr.forEach((row: any) => {
      if (!row || !row.symptomOnset) return;
      const onset = new Date(row.symptomOnset.includes('T') ? row.symptomOnset : row.symptomOnset.replace(' ', 'T'));
      if (isNaN(onset.getTime())) return;
      let expDate: Date | null = null;
      if (isIndividual) {
        if (!row.individualExposureTime) return;
        expDate = new Date(row.individualExposureTime.includes('T') ? row.individualExposureTime : row.individualExposureTime.replace(' ', 'T'));
      } else {
        expDate = exposureSingleDate;
      }
      if (!expDate || isNaN(expDate.getTime()) || onset < expDate) return;
      const diffHours = (onset.getTime() - expDate.getTime()) / 3600000;
      durations.push(diffHours);
      if (isIndividual) {
        if (!exposureRangeStart || expDate < exposureRangeStart) exposureRangeStart = expDate;
        if (!exposureRangeEnd || expDate > exposureRangeEnd) exposureRangeEnd = expDate;
      }
    });

    if (!durations.length) return `<div class="placeholder-table">${t('reportWriter.generation.placeholders.none')}</div>`;

    durations.sort((a,b) => a-b);
    const minH = durations[0];
    const maxH = durations[durations.length-1];
    const meanH = durations.reduce((a,b) => a+b,0)/durations.length;
    const medianH = durations.length%2===1 ? durations[(durations.length-1)/2] : (durations[durations.length/2 -1]+durations[durations.length/2])/2;

    const incubationStats = t('reportWriter.generation.descriptions.incubationFormat', {
      min: `${fmt(minH)}h`,
      max: `${fmt(maxH)}h`,
      avg: `${fmt(meanH)}h`,
      median: `${fmt(medianH)}h`
    });

    if (locale.value === 'ko') {
      if (!isIndividual) {
        const expTxt = exposureSingleDate ? formatLocaleDateTime(exposureSingleDate) : '--';
        return t('reportWriter.generation.descriptions.incubationExposureSingle', {
          suspected, expTxt, meanH: fmt(meanH), incubationStats: incubationStats.replace(/h/g, '시간')
        });
      } else {
        const startTxt = exposureRangeStart ? formatLocaleDateTime(exposureRangeStart) : '--';
        const endTxt = exposureRangeEnd ? formatLocaleDateTime(exposureRangeEnd) : '--';
        return t('reportWriter.generation.descriptions.incubationExposureRange', {
          suspected, startTxt, endTxt, meanH: fmt(meanH), incubationStats: incubationStats.replace(/h/g, '시간')
        });
      }
    } else {
      if (!isIndividual) {
        const expTxt = exposureSingleDate ? formatLocaleDateTime(exposureSingleDate) : '--';
        return t('reportWriter.generation.descriptions.incubationExposureSingle', {
          suspected, expTxt, meanH: fmt(meanH), incubationStats
        });
      } else {
        const startTxt = exposureRangeStart ? formatLocaleDateTime(exposureRangeStart) : '--';
        const endTxt = exposureRangeEnd ? formatLocaleDateTime(exposureRangeEnd) : '--';
        return t('reportWriter.generation.descriptions.incubationExposureRange', {
          suspected, startTxt, endTxt, meanH: fmt(meanH), incubationStats
        });
      }
    }
  }

  const incubationExposureText = computed(() => generateIncubationExposureText());

  // --- Rendered HTML ---
  const firstCaseDateTime: ComputedRef<string | null> = computed(() => {
    const onsets = rows.value.map((r: any) => r?.symptomOnset).filter(Boolean).map((ts: string) => new Date(ts));
    if (!onsets.length) return null;
    const earliest = new Date(Math.min(...onsets.map((d: Date) => d.getTime())));
    return formatLocaleDateTime(earliest);
  });
  
  const lastCaseDateTime: ComputedRef<string | null> = computed(() => {
    const onsets = rows.value.map((r: any) => r?.symptomOnset).filter(Boolean).map((ts: string) => new Date(ts));
    if (!onsets.length) return null;
    const latest = new Date(Math.max(...onsets.map((d: Date) => d.getTime())));
    return formatLocaleDateTime(latest);
  });

  const symptomList: ComputedRef<string | null> = computed(() => {
    if (!rows.value.length) return null;
    const onsetsWithIndex = rows.value.map((row: any, idx: number) => ({ idx, onset: row?.symptomOnset }));
    const valid = onsetsWithIndex.filter((o: any) => o.onset);
    if (!valid.length) return null;
    const earliestIdx = valid.reduce((prev: any, curr: any) => new Date(prev.onset) < new Date(curr.onset) ? prev : curr).idx;
    const earliestRow = rows.value[earliestIdx];
    if (!earliestRow?.clinicalSymptoms) return null;
    const clinicalHeaders = epidemicStore.headers?.clinical || [];
    const diagnosisLabel = t('common.symptom') || (locale.value === 'ko' ? '증상' : 'Symptom');
    const firstCase = rows.value.find((r: any) => r.symptomOnset && new Date(r.symptomOnset).getTime() === Math.min(...rows.value.map((rr:any)=>rr.symptomOnset?new Date(rr.symptomOnset).getTime():Infinity)));
    const diagnosis = firstCase?.clinical_diagnosis?.split(',').map((val: any, idx: number) => String(val) === '1' ? (clinicalHeaders[idx] || `${diagnosisLabel}${idx+1}`) : null).filter(Boolean).join(', ');
    return diagnosis || null;
  });

  const getSymptomStats = (): SymptomStat[] | null => {
    if (!rows.value.length || !patientCount.value) return null;
    const pRows = rows.value.filter((r: any) => r && String(r.isPatient) === '1');
    const clinicalHeaders = epidemicStore.headers?.clinical || [];
    if (!clinicalHeaders.length) return null;
    const symptomStats = clinicalHeaders.map((symptom: string, index: number) => {
      const count = pRows.filter((row: any) => row.clinicalSymptoms && row.clinicalSymptoms[index] === '1').length;
      const percentage = patientCount.value > 0 ? ((count / patientCount.value) * 100).toFixed(1) : '0.0';
      return { symptom, count, percentage };
    }).filter((stat: SymptomStat) => stat.count > 0).sort((a: SymptomStat, b: SymptomStat) => b.count - a.count);
    return symptomStats.length > 0 ? symptomStats : null;
  };

  function generateMainSymptomsTable(): string {
    const symptomStats = getSymptomStats();
    if (!symptomStats) return `<div class="placeholder-table">${t('reportWriter.preview.tooltips.none')}</div>`;
    return symptomStats.map(stat => 
      `<tr>
        <td>${stat.symptom}</td>
        <td style="text-align: center;">${stat.count}</td>
        <td style="text-align: center;">${stat.percentage}%</td>
      </tr>`
    ).join('');
  };

  // --- HWPX Generation Logic ---

  function generateCaseControlTableData(): Record<string, string> {
    const results = getDesignResults();
    const tableData: Record<string, string> = {};
    const MAX_ROWS = 34;
    // 만약 34개 초과면 모든 플레이스홀더를 빈 문자열로 채움
    if (results.length > MAX_ROWS) {
      for (let i = 1; i <= MAX_ROWS; i++) {
        tableData[`%F${i}`] = ''; tableData[`%C${i}`] = ''; tableData[`%CN${i}`] = ''; tableData[`%CT${i}`] = '';
        tableData[`%O${i}`] = ''; tableData[`%ON${i}`] = ''; tableData[`%OT${i}`] = ''; tableData[`%P${i}`] = '';
        tableData[`%OR${i}`] = ''; tableData[`%L${i}`] = ''; tableData[`%U${i}`] = '';
      }
      return tableData;
    }
    for (let i = 1; i <= MAX_ROWS; i++) {
      const result = results[i - 1];
      if (result) {
        tableData[`%F${i}`] = result.item || '';
        tableData[`%C${i}`] = String(result.b_obs || '0');
        tableData[`%CN${i}`] = String(result.c_obs || '0');
        tableData[`%CT${i}`] = String(result.rowTotal_Case || '0');
        tableData[`%O${i}`] = String(result.e_obs || '0');
        tableData[`%ON${i}`] = String(result.f_obs || '0');
        tableData[`%OT${i}`] = String(result.rowTotal_Control || '0');
        
        let pValText = 'N/A';
        if (result.pValue !== null && result.pValue !== undefined) {
             const v = typeof result.pValue === 'number' ? result.pValue : parseFloat(String(result.pValue));
             pValText = v < 0.01 ? '<0.001' : v.toFixed(3);
        }
        tableData[`%P${i}`] = pValText;
        
        tableData[`%OR${i}`] = String(result.oddsRatio || 'N/A');
        tableData[`%L${i}`] = String(result.ci_lower || 'N/A');
        tableData[`%U${i}`] = String(result.ci_upper || 'N/A');
      } else {
        tableData[`%F${i}`] = ''; tableData[`%C${i}`] = ''; tableData[`%CN${i}`] = ''; tableData[`%CT${i}`] = '';
        tableData[`%O${i}`] = ''; tableData[`%ON${i}`] = ''; tableData[`%OT${i}`] = ''; tableData[`%P${i}`] = '';
        tableData[`%OR${i}`] = ''; tableData[`%L${i}`] = ''; tableData[`%U${i}`] = '';
      }
    }
    return tableData;
  }

  function generateCohortTableData(): Record<string, string> {
    const results = getDesignResults();
    const tableData: Record<string, string> = {};
    const MAX_ROWS = 34;
    if (results.length > MAX_ROWS) {
      for (let i = 1; i <= MAX_ROWS; i++) {
        tableData[`%F${i}`] = ''; tableData[`%E${i}`] = ''; tableData[`%EP${i}`] = ''; tableData[`%ER${i}`] = '';
        tableData[`%U${i}`] = ''; tableData[`%UP${i}`] = ''; tableData[`%UR${i}`] = ''; tableData[`%P${i}`] = '';
        tableData[`%RR${i}`] = ''; tableData[`%L${i}`] = ''; tableData[`%U${i}`] = '';
      }
      return tableData;
    }
    for (let i = 1; i <= MAX_ROWS; i++) {
      const result = results[i - 1];
      if (result) {
        tableData[`%F${i}`] = result.item || '';
        tableData[`%E${i}`] = String(result.rowTotal_Exposed || '0');
        tableData[`%EP${i}`] = String(result.a_obs || '0');
        tableData[`%ER${i}`] = String(result.incidence_exposed_formatted || '0.0');
        tableData[`%U${i}`] = String(result.rowTotal_Unexposed || '0');
        tableData[`%UP${i}`] = String(result.c_obs || '0');
        tableData[`%UR${i}`] = String(result.incidence_unexposed_formatted || '0.0');
        
        let pValText = 'N/A';
        if (result.pValue !== null && result.pValue !== undefined) {
             const v = typeof result.pValue === 'number' ? result.pValue : parseFloat(String(result.pValue));
             pValText = v < 0.001 ? '<0.001' : v.toFixed(3);
        }
        tableData[`%P${i}`] = pValText;
        
        tableData[`%RR${i}`] = String(result.relativeRisk || 'N/A');
        tableData[`%L${i}`] = String(result.rr_ci_lower || 'N/A');
        tableData[`%U${i}`] = String(result.rr_ci_upper || 'N/A');
      } else {
        tableData[`%F${i}`] = ''; tableData[`%E${i}`] = ''; tableData[`%EP${i}`] = ''; tableData[`%ER${i}`] = '';
        tableData[`%U${i}`] = ''; tableData[`%UP${i}`] = ''; tableData[`%UR${i}`] = ''; tableData[`%P${i}`] = '';
        tableData[`%RR${i}`] = ''; tableData[`%L${i}`] = ''; tableData[`%U${i}`] = '';
      }
    }
    return tableData;
  }

  async function downloadHwpxReport() {
    try {
      logger.info('Starting HWPX creation...');
      const section0Text = await loadTemplateSection0(studyDesign.value ?? undefined);
      const statAnalysisText = buildStatAnalysisText();
      const designText = studyDesign.value === 'case-control' 
        ? t('reportWriter.editor.studyDesign.caseControl') 
        : t('reportWriter.editor.studyDesign.cohort');
      const foodIntakeText = foodIntakeAnalysis.value || generateFoodIntakeText() || t('reportWriter.editor.items.foodAnalysis');
      const incubationText = generateIncubationExposureText() || t('reportWriter.generation.placeholders.unknown');
      const symptomStats = getSymptomStats();
      const unknown = t('reportWriter.generation.placeholders.unknown');
      
      const replacements: Record<string, string> = {
        '%사례발병률%': caseAttackRate.value ? `${caseAttackRate.value}%` : unknown,
        '%추정감염원%': suspectedSource.value || unknown,
        '%평균잠복기%': meanIncubation.value ? `${meanIncubation.value}${locale.value === 'ko' ? '시간' : 'h'}` : unknown,
        '%환자발병률%': patientAttackRate.value ? `${patientAttackRate.value}%` : unknown,
        '%%%추정위험노출일시%%%': exposureDate.value || unknown,
        '%%%최초사례발생일시%%%': firstCaseDate.value || unknown,
        '%조사디자인%': designText,
        '% % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % %식품섭취력분석% % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % %': foodIntakeText,
        '% % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % %잠복기및추정위험노출시기% % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % %': incubationText,
        '% % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % %최초환자발생일시% % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % %': t('reportWriter.generation.descriptions.firstCaseSummary', {
          firstCaseDateTime: firstCaseDateTime.value || unknown,
          symptomList: symptomList.value || unknown,
          lastCaseDateTime: lastCaseDateTime.value || unknown,
          patientCount: patientCount.value || unknown
        }),
        '% % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % %통계분석에사용한분석기법% % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % %': statAnalysisText.method,
        '%TOTAL_COUNT%': String(patientCount.value || '0')
      };
      // 발병률결과 키 추가
      replacements['% % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % %발병률결과% % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % % %'] = t('reportWriter.generation.descriptions.attackRateResult', {
        total: totalParticipants.value || unknown,
        patientCount: patientCount.value || unknown,
        caseAttackRate: caseAttackRate.value ? `${caseAttackRate.value}%` : unknown,
        confirmedCount: confirmedCount.value || unknown,
        confirmedAttackRate: confirmedAttackRate.value ? `${confirmedAttackRate.value}%` : unknown
      });

      if (studyDesign.value === 'case-control') {
        Object.assign(replacements, generateCaseControlTableData());
      } else if (studyDesign.value === 'cohort') {
        Object.assign(replacements, generateCohortTableData());
      }
      
      if (symptomStats) {
        for (let i = 0; i < Math.min(symptomStats.length, 10); i++) {
          const stat = symptomStats[i];
          replacements[`%SYMPTOM_${i + 1}%`] = stat.symptom;
          replacements[`%COUNT_${i + 1}%`] = stat.count.toString();
          replacements[`%PERCENT_${i + 1}%`] = `${stat.percentage}%`;
        }
      }
      for (let i = (symptomStats ? symptomStats.length : 0) + 1; i <= 10; i++) {
        replacements[`%SYMPTOM_${i}%`] = ''; replacements[`%COUNT_${i}%`] = ''; replacements[`%PERCENT_${i}%`] = '';
      }
      
      const modifiedXmlText = replacePlaceholders(section0Text, replacements);
      const settings = settingsStore.epidemicCurveSettings;
      const chartImages: any = {};
      
      if (settings.reportIncubationChartDataUrl) {
        chartImages.incubationChart = {
          dataUrl: settings.reportIncubationChartDataUrl,
          width: settings.incubationChartWidth || 1100
        };
      }
      if (settings.reportChartDataUrl) {
        chartImages.epidemicChart = {
          dataUrl: settings.reportChartDataUrl,
          width: settings.chartWidth || 1100
        };
      }
      
      const hwpxBlob = await createHwpxFromTemplate(modifiedXmlText, chartImages, studyDesign.value ?? undefined);
      const reportTitle = t('reportWriter.generation.filename');
      const filename = `${reportTitle}_${new Date().toISOString().slice(0, 10)}.hwpx`;
      downloadHwpxFile(hwpxBlob, filename);
      logger.info('HWPX file creation complete!');
    } catch (error: any) {
      logger.error('HWPX creation error:', error);
      showToast(`${t('reportWriter.preview.toast.error')}: ${error.message}`, 'error');
    }
  }

  function generateFoodIntakeTable(): string {
    const results = getDesignResults();
    if (!results || results.length === 0) {
      const designText = studyDesign.value === 'case-control' 
        ? t('reportWriter.editor.studyDesign.caseControl') 
        : t('reportWriter.editor.studyDesign.cohort');
      return `<div class="placeholder-table"><strong>${t('reportWriter.editor.items.foodAnalysis')}</strong><br/><small>${designText} ${t('reportWriter.modal.message')}</small></div>`;
    }
    const hasValidData = results.some(r => {
      return (r.pValue !== null && r.pValue !== undefined) || (r.item && r.item !== 'N/A') ||
           (studyDesign.value === 'case-control' ? (r.oddsRatio && r.oddsRatio !== 'N/A') : (r.relativeRisk && r.relativeRisk !== 'N/A'));
    });
    if (!hasValidData) {
      const designText = studyDesign.value === 'case-control' 
        ? t('reportWriter.editor.studyDesign.caseControl') 
        : t('reportWriter.editor.studyDesign.cohort');
      return `<div class="placeholder-table"><strong>${t('reportWriter.editor.items.foodAnalysis')}</strong><br/><small>${designText} ${t('reportWriter.modal.message')}</small></div>`;
    }

    const filtered = results;
    const isCase = studyDesign.value === 'case-control';
    let tableHtml = '';
    if(isCase){
      const headers = (t('reportWriter.generation.tables.caseControl.headers', { returnObjects: true }) as any) as string[];

      tableHtml += `<table class="summary-table">
        <tr>
          <th rowspan="2">${headers[0]}</th>
          <th colspan="3">${headers[1]}</th>
          <th colspan="3">${headers[2]}</th>
          <th rowspan="2">${headers[6]}<br/>P-value</th>
          <th rowspan="2">${headers[7]}<br/>(OR)</th>
          <th colspan="2">${headers[8]}</th>
        </tr>
        <tr>
          <th>${headers[3]}</th>
          <th>${headers[4]}</th>
          <th>${headers[5]}</th>
          <th>${headers[3]}</th>
          <th>${headers[4]}</th>
          <th>${headers[5]}</th>
          <th>${headers[9]}</th>
          <th>${headers[10]}</th>
        </tr>`;

      filtered.forEach(r => {
        let pValueText = 'N/A';
        if (r.pValue !== null && r.pValue !== undefined) {
          const v = typeof r.pValue === 'number' ? r.pValue : parseFloat(String(r.pValue));
          pValueText = v < 0.001 ? '&lt;0.001' : v.toFixed(3);
        }
        tableHtml += `<tr><td>${r.item || 'N/A'}</td><td class="cell-count">${r.b_obs || 0}</td><td class="cell-count">${r.c_obs || 0}</td><td class="cell-total">${r.rowTotal_Case || 0}</td><td class="cell-count">${r.e_obs || 0}</td><td class="cell-count">${r.f_obs || 0}</td><td class="cell-total">${r.rowTotal_Control || 0}</td><td class="cell-stat">${pValueText}</td><td class="cell-stat">${r.oddsRatio || 'N/A'}</td><td class="cell-stat">${r.ci_lower || 'N/A'}</td><td class="cell-stat">${r.ci_upper || 'N/A'}</td></tr>`;
      });
      tableHtml += '</table>';
    } else {
      const headers = (t('reportWriter.generation.tables.cohort.headers', { returnObjects: true }) as any) as string[];

      tableHtml += `<table class="summary-table">
        <tr>
          <th rowspan="2">${headers[0]}</th>
          <th colspan="3">${headers[1]}</th>
          <th colspan="3">${headers[2]}</th>
          <th rowspan="2">${headers[6]}<br/>P-value</th>
          <th rowspan="2">${headers[7]}<br/>(RR)</th>
          <th colspan="2">${headers[8]}</th>
        </tr>
        <tr>
          <th>${headers[3]}</th>
          <th>${headers[4]}</th>
          <th>${headers[5]}</th>
          <th>${headers[3]}</th>
          <th>${headers[4]}</th>
          <th>${headers[5]}</th>
          <th>${headers[9]}</th>
          <th>${headers[10]}</th>
        </tr>`;

      filtered.forEach(r => {
        let pValueText = 'N/A';
        if (r.pValue !== null && r.pValue !== undefined) {
          const v = typeof r.pValue === 'number' ? r.pValue : parseFloat(String(r.pValue));
          pValueText = v < 0.001 ? '&lt;0.001' : v.toFixed(3);
        }
        tableHtml += `<tr><td>${r.item || 'N/A'}</td><td class="cell-total">${r.rowTotal_Exposed || 0}</td><td class="cell-count">${r.a_obs || 0}</td><td class="cell-stat">${r.incidence_exposed_formatted || 'N/A'}</td><td class="cell-total">${r.rowTotal_Unexposed || 0}</td><td class="cell-count">${r.c_obs || 0}</td><td class="cell-stat">${r.incidence_unexposed_formatted || 'N/A'}</td><td class="cell-stat">${pValueText}</td><td class="cell-stat">${r.relativeRisk || 'N/A'}</td><td class="cell-stat">${r.rr_ci_lower || 'N/A'}</td><td class="cell-stat">${r.rr_ci_upper || 'N/A'}</td></tr>`;
      });
      tableHtml += '</table>';
    }
    return tableHtml;
  }

  const renderedHtml = computed(() => {
    let html = getReportTemplate(t);
    const designText = studyDesign.value === 'case-control' 
      ? t('reportWriter.editor.studyDesign.caseControl') 
      : t('reportWriter.editor.studyDesign.cohort');
    const statAnalysisObj = buildStatAnalysisText();
    const unknown = t('reportWriter.generation.placeholders.unknown');
    
    const wrapPlaceholder = (value: any) => {
      if (value === '--' || value === unknown) return value;
      return `<span class="placeholder-value">${value}</span>`;
    };
    
    const chartImagePath = getChartImagePath();
    const chartImageHtml = chartImagePath 
      ? `<img src="${chartImagePath}" alt="${t('reportWriter.editor.items.epiCurve')}" style="max-width: 100%; height: auto; margin: 20px 0; border: 1px solid #ddd;" />`
      : `<div class="placeholder-chart"><strong>${t('reportWriter.editor.items.epiCurve')}</strong><br/><small>${t('reportWriter.generation.charts.epiCurvePlaceholder')}</small></div>`;
       
    const incubationChartImagePath = getIncubationChartImagePath();
    const incubationChartImageHtml = incubationChartImagePath 
      ? `<img src="${incubationChartImagePath}" alt="${t('reportWriter.editor.items.incubationChart')}" style="max-width: 100%; height: auto; margin: 20px 0; border: 1px solid #ddd;" />`
      : `<div class="placeholder-chart"><strong>${t('reportWriter.editor.items.incubationChart')}</strong><br/><small>${t('reportWriter.generation.charts.incubationPlaceholder')}</small></div>`;
    
    const foodIntakeAnalysisHtml = `${generateFoodIntakeTable()}<p>${generateFoodIntakeText()}</p>`;

    const replacements: Record<string, string> = {
      caseAttackRate: wrapPlaceholder(caseAttackRate.value ? `${caseAttackRate.value}%` : unknown),
      patientAttackRate: wrapPlaceholder(patientAttackRate.value ? `${patientAttackRate.value}%` : unknown),
      exposureDate: wrapPlaceholder(exposureDate.value || unknown),
      firstCaseDate: wrapPlaceholder(firstCaseDate.value || unknown),
      meanIncubation: wrapPlaceholder(meanIncubation.value ? `${meanIncubation.value}${locale.value === 'ko' ? '시간' : 'h'}` : unknown),
      suspectedSource: wrapPlaceholder(suspectedSource.value || (parseSuspectedFoods().join(', ') || unknown)),
      studyDesign: wrapPlaceholder(designText),
      statAnalysis: `${statAnalysisObj.base} <span class="placeholder-value">${statAnalysisObj.method}</span>`,
      firstCaseDateTime: wrapPlaceholder(firstCaseDateTime.value || unknown),
      lastCaseDateTime: wrapPlaceholder(lastCaseDateTime.value || unknown),
      patientCount: wrapPlaceholder(patientCount.value || unknown),
      totalParticipants: wrapPlaceholder(totalParticipants.value || unknown),
      confirmedCount: wrapPlaceholder(confirmedCount.value || unknown),
      confirmedAttackRate: wrapPlaceholder(confirmedAttackRate.value ? `${confirmedAttackRate.value}%` : unknown),
      symptomList: wrapPlaceholder(symptomList.value || unknown),
      caseAttackRateNumeric: wrapPlaceholder(caseAttackRate.value || unknown),
      epidemicChart: chartImageHtml,
      incubationChart: incubationChartImageHtml,
      mainSymptomsTable: generateMainSymptomsTable(),
      foodIntakeAnalysis: foodIntakeAnalysis.value,
      foodIntakeAnalysisHtml,
      incubationExposureText: wrapPlaceholder(incubationExposureText.value),
      foodIntakeTable: generateFoodIntakeTable(),
      firstCaseSummary: t('reportWriter.generation.descriptions.firstCaseSummary', {
        firstCaseDateTime: firstCaseDateTime.value || unknown,
        symptomList: symptomList.value || unknown,
        lastCaseDateTime: lastCaseDateTime.value || unknown,
        patientCount: patientCount.value || unknown
      }),
      attackRateResult: t('reportWriter.generation.descriptions.attackRateResult', {
        total: totalParticipants.value || unknown,
        patientCount: patientCount.value || unknown,
        caseAttackRate: caseAttackRate.value ? `${caseAttackRate.value}%` : unknown,
        confirmedCount: confirmedCount.value || unknown,
        confirmedAttackRate: confirmedAttackRate.value ? `${confirmedAttackRate.value}%` : unknown
      })
    };
    Object.entries(replacements).forEach(([key, val]) => {
      html = html.replace(new RegExp(`%${key}%`, 'g'), String(val ?? ''));
    });
    
    [
      'reportDate', 'fieldInvestDate', 'region', 'place', 'suspectedPathogen', 'epiCurveDate', 'finalLabDate'
    ].forEach((key) => {
      html = html.replace(new RegExp(`%${key}%`, 'g'), '');
    });
    return html;
  });

  return {
    studyDesign,
    showAnalysisModal,
    analysisModalMessage,
    pendingStudyDesign,
    analysisStatus,
    caseAttackRate,
    patientAttackRate,
    exposureDate,
    firstCaseDate,
    meanIncubation,
    suspectedSource,
    foodIntakeAnalysis,
    hasEpidemicChart,
    hasIncubationChart,
    hasMainSymptomsTable,
    foodItemCount,
    hasTooManyFoodItems,
    renderedHtml,
    
    // Actions / Methods
    handleStudyDesignChange,
    closeAnalysisModal,
    downloadHwpxReport,
    
    // Data exports for HWPX generation if needed later
    getDesignResults,
    getSymptomStats,
    parseSuspectedFoods,
    generateFoodIntakeText,
    generateIncubationExposureText,
    buildStatAnalysisText,
    generateMainSymptomsTable,
    generateCaseControlTableData,
    generateCohortTableData,
    
    // Raw Values for export
    confirmedCount,
    confirmedAttackRate,
    firstCaseDateTime,
    lastCaseDateTime,
    symptomList,
    patientCount,
    totalParticipants
  };
}
