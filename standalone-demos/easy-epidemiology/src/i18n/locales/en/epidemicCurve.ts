export default {
  title: 'Epidemic Curve & Incubation Analysis',
  symptomAnalysis: 'Symptom Onset Analysis',
  incubationAnalysis: 'Incubation Period Analysis',
  suspectedFood: {
    title: 'Suspected Infection Source',
    placeholder: 'Select suspected source or enter manually',
    multiSelectTitle: 'Select Sources (Multiple Select)',
    status: {
      pending: 'Analysis Pending',
      analyzing: 'Analyzing...',
      completed: 'Analysis Complete',
      caseControlSuccess: 'Case-Control Analysis Successful',
      cohortSuccess: 'Cohort Analysis Successful',
      error: 'Analysis Error'
    },
    tooltip: {
      success: 'Analysis completed successfully.',
      pending: 'Analysis pending.',
      noData: 'No data available.',
      error: 'An error occurred during analysis.',
      checking: 'Checking analysis status...'
    }
  },
  contextMenu: {
    copy: 'Copy Table'
  },
  symptomTable: {
    title: 'Patients by Symptom Onset Time',
    time: 'Onset Time',
    count: 'count',
    guide: {
      title: 'Symptom Onset Time Required',
      desc: 'Essential information for generating epidemic curve.',
      step1: 'Enter symptom onset time',
      step2: 'Minimum 2 patients required',
      step3: 'Format: YYYY-MM-DD HH:MM'
    },
    summary: {
      title: 'Outbreak Summary',
      first: 'First Onset:',
      last: 'Last Onset:'
    }
  },
  controls: {
    intervalLabel: 'Interval:',
    intervalTooltip: 'Change symptom onset time interval',
    confirmedLine: 'Confirmed Line:',
    show: 'Show',
    hide: 'Hide',
    confirmedTooltip: 'Show/Hide Confirmed Case Line',
    fontSize: 'Font Size',
    fontSizeTooltip: 'Change global font size of the chart',
    chartWidth: 'Chart Width',
    chartWidthTooltip: 'Adjust total width of the chart',
    chartDisplay: 'Display Mode',
    color: 'Bar Color',
    colorTooltip: 'Change bar color',
    countUnit: 'cases'
  },
  displayMode: {
    hour: 'Hour',
    hourTooltip: 'Simple hour display',
    datetime: 'Date+Time',
    datetimeTooltip: 'Precise date and time display',
    incubationHour: 'Hour',
    incubationHourTooltip: 'Display in hours',
    incubationHHMM: 'HH:MM',
    incubationHHMMTooltip: 'Display in detailed time'
  },
  exposure: {
    title: 'Exposure Time Setting',
    placeholder: 'Set exposure time (YYYY-MM-DD HH:MM)',
    tooltip: 'Set baseline exposure time.'
  },
  incubationTable: {
    title: 'Patients by Incubation Period',
    interval: 'Est. Incubation Period',
    count: 'count',
    guide: {
      title: 'Exposure Time Required',
      desc: 'Baseline for incubation period analysis.',
      step1: 'Click input field above',
      step2: 'Set baseline exposure time',
      step3: 'Click "Execute Analysis" button',
      noExposureTitle: 'Set Exposure Time',
      noExposureDesc: 'Please set the exposure time to analyze the incubation period.'
    },
    summary: {
      title: 'Incubation Summary',
      min: 'Min:',
      max: 'Max:',
      avg: 'Avg:',
      median: 'Median:'
    }
  },
  incubationControls: {
    intervalLabel: 'Class Interval (Hours):',
    intervalTooltip: 'Change incubation calculation interval'
  },
  warning: {
    title: 'Set Onset Time After Exposure Time',
    desc: 'Incubation is calculated as time elapsed "after exposure". Currently all are before exposure.',
    step1: 'Current Exposure: {time}',
    step2: 'Click top input to reset correct baseline time',
    step3: 'Or correct symptom onset times in Data Input screen'
  },
  charts: {
    epidemicCurve: 'Epidemic Curve',
    incubationPeriod: 'Incubation Period Distribution'
  }
};
