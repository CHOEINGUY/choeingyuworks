export default {
  title: 'Case Series',
  guide: {
    button: 'Stats Guide',
    title: 'Case Series Statistics Guide',
    subtitle: 'Analysis of Case Group Characteristics & Exposure Rate',
    sections: {
      overview: {
        title: 'Overview',
        description: 'Case series studies analyze the characteristics of {cases} without a control group. By identifying the proportion of individuals exposed to specific risk factors (e.g., food) among confirmed cases, common exposure factors can be estimated.',
        cases: 'only cases (Case)'
      },
      exposureRate: {
        title: 'Key Metric: Exposure Rate',
        formula: {
          rate: 'Exposure Rate',
          exposed: 'Exposed Cases',
          total: 'Total Cases'
        },
        description: 'The proportion of individuals exposed to the factor among cases.',
        interpretation: {
          high: {
            label: 'Meaning of High Exposure Rate:',
            desc: 'If most patients consumed a specific food, it suggests that the food might be the source of infection.'
          },
          limit: {
            label: 'Interpretation Limits:',
            desc: 'Since there is no control group comparison, statistical association (Odds Ratio, P-value) cannot be calculated, and causality is difficult to confirm.'
          }
        }
      },
      ok: 'OK'
    }
  },
  controls: {
    fontSize: 'Font Size',
    fontSizeTooltip: 'Change font size to {size}',
    totalCount: 'Analysis of {count} participants',
    small: 'Small',
    medium: 'Medium',
    large: 'Large'
  },
  toolbar: {
    title: 'Analysis Results by Factor (Case Series)',
    copyTable: 'Copy Table'
  },
  table: {
    noData: 'No data to analyze or check Vuex store connection.',
    headers: {
      factor: 'Factor (Diet)',
      caseGroup: 'Case Group',
      exposed: 'Exposed',
      unexposed: 'Unexposed',
      total: 'Total',
      incidence: 'Incidence(%)'
    },
    legend: {
      title: 'Statistical Test Methods & Legend',
      na: 'N/A : Not calculable (cell value is 0)',
      incidenceRate: 'Incidence(%) : Proportion of exposed individuals in the case group'
    }
  }
};
