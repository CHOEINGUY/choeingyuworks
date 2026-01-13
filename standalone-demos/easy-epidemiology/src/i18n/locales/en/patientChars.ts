export default {
  title: 'Patient Characteristics',
  guide: {
    title: 'Select a Variable to Analyze',
    description: 'Click one of the variable selection buttons above to view its distribution chart.',
    step1: 'Click a variable button to analyze',
    step2: 'A distribution chart will generate automatically',
    step3: 'Adjust chart settings to customize the view'
  },
  summary: {
    totalParticipants: 'Total Participants',
    totalPatients: 'Total Patients',
    attackRate: 'Attack Rate',
    confirmedRate: 'Confirmed Rate',
    unitPerson: '',
    attackRateTooltip: 'Attack Rate = (Number of people with 1 in Patient column ÷ Total Participants) × 100',
    confirmedRateTooltip: 'Confirmed Rate = (Number of people with 1 in Confirmed column ÷ Total Participants) × 100'
  },
  frequencyTable: {
    copyTable: 'Copy Table',
    category: 'Category',
    participantsCount: 'Participants',
    participantsRatio: 'Participants %',
    patientsCount: 'Patients',
    patientsRatio: 'Patients %',
    none: '(None)'
  },
  labelMapping: {
    title: 'Label Mapping',
    placeholder: 'New Label',
    noCategories: 'No categories to map.'
  },
  chartControl: {
    target: 'Chart Target:',
    total: 'Total Participants',
    totalTooltip: 'Switch chart target to total participants',
    patient: 'Patients',
    patientTooltip: 'Switch chart target to patients',
    dataType: 'Data Type:',
    dataCount: 'Count',
    dataCountTooltip: 'Display data as count (people)',
    dataPercent: 'Percentage (%)',
    dataPercentTooltip: 'Display data as percentage (%)',
    fontSize: 'Font Size:',
    sizeVerySmall: 'Very Small',
    sizeSmall: 'Small',
    sizeNormal: 'Normal',
    sizeLarge: 'Large',
    sizeVeryLarge: 'Very Large',
    sizeTooltipPrefix: 'Change font size to',
    sizeTooltipSuffix: '',
    chartWidth: 'Chart Width:',
    widthTooltipPrefix: 'Change chart width to',
    barWidth: 'Bar Width:',
    barWidthTooltipPrefix: 'Change bar width to',
    highlight: 'Highlight:',
    highlightNone: 'None',
    highlightNoneTooltip: 'Display all bars in same color',
    highlightMax: 'Max Value',
    highlightMaxTooltip: 'Highlight bar with maximum value',
    highlightMin: 'Min Value',
    highlightMinTooltip: 'Highlight bar with minimum value',
    highlightBoth: 'Max/Min',
    highlightBothTooltip: 'Highlight bars with max and min values',
    totalDistributionTitle: 'Distribution of Total Participants by {header}',
    patientDistributionTitle: 'Distribution of Patients by {header}',
    barColor: 'Bar Color:',
    barColorTooltip: 'Change bar color'
  },
  chart: {
    type: 'Chart Type',
    bar: 'Bar',
    pie: 'Pie',
    line: 'Line',
    copy: 'Copy Chart',
    save: 'Save Chart'
  }
};
