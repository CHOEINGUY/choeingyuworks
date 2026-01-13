export default {
  title: 'Clinical Symptoms',
  frequencyTable: {
    title: 'Frequency by Clinical Symptom',
    copy: 'Copy Table',
    symptom: 'Symptom Name',
    count: 'Count (N)',
    percent: 'Percentage (%)'
  },
  controls: {
    direction: 'Bar Direction',
    directionVertical: 'Vertical',
    directionHorizontal: 'Horizontal',
    directionTooltip: 'Change bar direction to',
    directionSuffix: '',
    fontSize: 'Font Size',
    fontSizePrefix: 'Change font size to',
    fontSizeSuffix: '',
    chartWidth: 'Chart Width',
    chartWidthPrefix: 'Change chart width to',
    chartWidthSuffix: 'px',
    barWidth: 'Bar Width',
    barWidthPrefix: 'Change bar width to',
    barWidthSuffix: '%',
    highlight: 'Highlight',
    highlightOptions: {
      none: { label: 'None', tooltip: 'Display all bars in the same color' },
      max: { label: 'Max', tooltip: 'Highlight the bar with the maximum value' },
      min: { label: 'Min', tooltip: 'Highlight the bar with the minimum value' },
      both: { label: 'Max/Min', tooltip: 'Highlight both maximum and minimum values' }
    },
    sort: 'Sort',
    sortOptions: {
      none: { label: 'Original', tooltip: 'Display in original order' },
      asc: { label: 'Ascending', tooltip: 'Sort by percentage (Low to High)' },
      desc: { label: 'Descending', tooltip: 'Sort by percentage (High to Low)' }
    },
    fontSizeLabels: {
      xs: 'Very Small',
      sm: 'Small',
      md: 'Medium',
      lg: 'Large',
      xl: 'Very Large'
    },
    color: 'Bar Color',
    colorTooltip: 'Change bar color'
  },
  chart: {
    copy: 'Copy Chart',
    save: 'Save Chart',
    distributionTitle: 'Distribution of Clinical Symptoms',
    noDataTitle: 'Clinical symptoms data required',
    noDataSubtext: 'Please enter data in the symptom columns in the data input screen',
    dataInputPrompt: '📋 Enter symptom data → Auto-generate chart',
    errorFormat: 'Data format error',
    errorGenerate: 'Chart generation error',
    percentSeries: 'Percentage'
  }
};
