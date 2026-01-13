export const getReportTemplate = (t: (key: string) => string): string => {
  return `<div class="report-wrapper">
  <style>
  .placeholder-value {
    background-color: #e3f2fd;
    padding: 1px 3px;
    border-radius: 3px;
    font-weight: 500;
  }
  .placeholder-chart {
    background-color: #e3f2fd;
    padding: 20px;
    border-radius: 8px;
    border: 2px dashed #90caf9;
    text-align: center;
    margin: 20px 0;
  }
  .placeholder-table {
    background-color: #e3f2fd;
    padding: 15px;
    border-radius: 6px;
    border: 2px dashed #90caf9;
    text-align: center;
    margin: 15px 0;
  }
  .report-preview {
    background: #f8f9fa;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px 0;
  }
  .report-wrapper {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(60,64,67,0.06);
    border: 1px solid #e0e0e0;
    padding: 40px 32px 32px 32px;
    margin-top: 0;
    max-width: 900px;
    width: 100%;
  }
  .report-title {
    margin-top: 40px;
    margin-bottom: 32px;
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
  }
  </style>
  <h1 class="report-title">${t('reportWriter.template.title')}</h1>

  <h2 id="section-overview" class="section-heading">${t('reportWriter.template.sections.intro')}</h2>
  <table class="summary-table">
    <tr>
      <th class="label">${t('reportWriter.template.labels.reportDate')}</th><td>%reportDate%</td>
      <th class="label">${t('reportWriter.template.labels.exposureDate')}</th><td>%exposureDate%</td>
    </tr>
    <tr>
      <th class="label">${t('reportWriter.template.labels.investDate')}</th><td>%fieldInvestDate%</td>
      <th class="label">${t('reportWriter.template.labels.firstCaseDate')}</th><td>%firstCaseDate%</td>
    </tr>
    <tr>
      <th class="label">${t('reportWriter.template.labels.region')}</th><td>%region%</td>
      <th class="label">${t('reportWriter.template.labels.incubation')}</th><td>%meanIncubation%</td>
    </tr>
    <tr>
      <th class="label">${t('reportWriter.template.labels.place')}</th><td>%place%</td>
      <th class="label">${t('reportWriter.template.labels.pathogen')}</th><td>%suspectedPathogen%</td>
    </tr>
    <tr>
      <th class="label">${t('reportWriter.template.labels.design')}</th><td>%studyDesign%</td>
      <th class="label">${t('reportWriter.template.labels.source')}</th><td>%suspectedSource%</td>
    </tr>
    <tr>
      <th class="label">${t('reportWriter.template.labels.attackRate')}</th><td>%caseAttackRate%</td>
      <th class="label">${t('reportWriter.template.labels.endDate')}</th><td>%epiCurveDate%</td>
    </tr>
    <tr>
      <th class="label">${t('reportWriter.template.labels.patientAttackRate')}</th><td>%patientAttackRate%</td>
      <th class="label">${t('reportWriter.template.labels.labDate')}</th><td>%finalLabDate%</td>
    </tr>
  </table>

  <h2 id="section-team" class="section-heading">${t('reportWriter.template.sections.team')}</h2>
  <table class="summary-table">
    <tr>
      <td colspan="4" style="height:120px; text-align:center;">${t('reportWriter.template.labels.omitted')}</td>
    </tr>
  </table>

  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.design')}</h3>
  <p style="margin-left:18px;">${t('reportWriter.template.labels.designLabel')} : %studyDesign%</p>

  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.sample')}</h3>

  <p style="height:120px;">${t('reportWriter.template.labels.omitted')}</p>

  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.caseDef')}</h3>
  <p style="height:70px;">${t('reportWriter.template.labels.omitted')}</p>

  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.action')}</h3>
  <p style="height:70px;">${t('reportWriter.template.labels.omitted')}</p>

  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.stat')}</h3>
  <p>%statAnalysis%</p>

  <!-- IV. 결과 -->
  <h2 id="section-results" class="section-heading" style="page-break-before:always;">${t('reportWriter.template.sections.results')}</h2>

  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.firstCase')}</h3>
  <p>%firstCaseSummary%</p>
  
  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.attackRate')}</h3>
  <p>%attackRateResult%</p>

  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.commonExposure')}</h3>
  <p style="height:80px;">${t('reportWriter.template.labels.omitted')}</p>

  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.epiCurve')}</h3>
  %epidemicChart%
  <p style="text-align:center; margin-top:10px; font-size:12px;">${t('reportWriter.template.labels.epiCurveCaption')}</p>

  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.symptoms')}</h3>
  <h3 style="margin-top:28px;">${t('reportWriter.template.labels.symptomTitle')}</h3>
  <table class="summary-table">
    <tr>
      <th rowspan="2">${t('reportWriter.template.labels.symptomHeader')}</th>
      <th colspan="2">${t('reportWriter.template.labels.caseHeader')}</th>
    </tr>
    <tr>
      <th>${t('reportWriter.template.labels.countHeader')}</th>
      <th>${t('reportWriter.template.labels.percentHeader')}</th>
    </tr>
    %mainSymptomsTable%
  </table>

  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.foodAnalysis')}</h3>
  %foodIntakeAnalysisHtml%

  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.env')}</h3>
  <p style="height:70px;">${t('reportWriter.template.labels.omitted')}</p>

  <h3 style="margin-top:24px;">${t('reportWriter.template.sections.water')}</h3>
  <p style="height:70px;">${t('reportWriter.template.labels.omitted')}</p>

  <h2 id="section-incubation" class="section-heading">${t('reportWriter.template.sections.incubation')}</h2>
  <div style="margin-bottom: 12px;">%incubationExposureText%</div>
  %incubationChart%
  <p style="text-align:center; margin-top:10px; font-size:12px;">${t('reportWriter.template.labels.incubationCaption')}</p>

</div>`;
};
