export default {
  title: 'Case-Control Study',
  guide: {
    button: 'Stats Guide',
    title: 'Statistical Analysis Guide',
    subtitle: 'Understanding Key Metrics in Case-Control Studies',
    sections: {
      contingencyTable: {
        title: '2x2 Contingency Table',
        description: 'Case-control studies compare the presence of disease between a group exposed to a specific factor and an unexposed group. Data is organized in a 2x2 table.',
        headers: {
          category: 'Category',
          case: 'Case',
          control: 'Control',
          total: 'Total'
        },
        rows: {
          exposed: { label: 'Exposed (Yes)', sub: 'Risk Factor O' },
          unexposed: { label: 'Unexposed (No)', sub: 'Risk Factor X' },
          total: 'Total'
        },
        cells: {
          a: 'Case + Exposed',
          b: 'Control + Exposed',
          c: 'Case + Unexposed',
          d: 'Control + Unexposed'
        }
      },
      or: {
        title: 'Odds Ratio (OR)',
        formula: {
          label: 'Formula',
          content: 'OR = ( a × d ) / ( b × c )'
        },
        def: {
          title: 'Definition',
          desc: 'A measure indicating how many times higher the odds of exposure to a risk factor are in the case group compared to the control group.'
        },
        interpretation: {
          title: 'Interpretation',
          risk: { label: 'OR > 1', desc: 'Risk Factor for disease' },
          protective: { label: 'OR < 1', desc: 'Protective Factor for disease' },
          null: { label: 'OR = 1', desc: 'No association' }
        }
      },
      pvalue: {
        title: 'P-value',
        description: 'The probability that the calculated Odds Ratio (OR) was observed by chance. Typically, a value less than {highlight} is considered statistically significant.',
        method: {
          title: 'Test Method Selection Criteria',
          chiSquare: { label: 'Chi-square Test', desc: 'Used when observed frequencies are sufficient' },
          fisher: { label: 'Fisher\'s Exact Test', desc: 'Used when a cell frequency is less than 5' },
          yates: { label: 'Yates\' Continuity Correction', desc: 'Applied when correction option is enabled' }
        }
      },
      ci: {
        title: '95% Confidence Interval (95% CI)',
        description: 'The range in which the true value of the Odds Ratio is expected to lie. Whether the interval {includes} is key to statistical significance.',
        includesOne: 'includes 1',
        significant: {
          label: 'Statistically Significant',
          desc: 'Interval does not include 1'
        },
        notSignificant: {
          label: 'Not Statistically Significant',
          desc: 'Interval includes 1'
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
    title: 'Analysis Results by Factor',
    filterActive: '(OR ≥ {threshold}.0 Filter Applied)',
    orFilter: 'OR ≥',
    yatesActive: 'Yates Correction On',
    yatesInactive: 'Yates Correction Off',
    copyTable: 'Copy Table'
  },
  table: {
    noDataFilter: 'No data with Odds Ratio ≥ {threshold}.0.',
    noData: 'No data to analyze or check Vuex store connection.',
    headers: {
      factor: 'Factor (Diet)',
      caseGroup: 'Case Group',
      controlGroup: 'Control Group',
      pvalue: 'Chi-square\nP-value',
      oddsRatio: 'Odds Ratio\n(OR)',
      ci: '95% CI',
      exposed: 'Exposed',
      unexposed: 'Unexposed',
      total: 'Total',
      lower: 'Lower',
      upper: 'Upper'
    },
    legend: {
      title: 'Statistical Test Methods & Legend',
      fisher: '* : Fisher\'s Exact Test (when expected frequency < 5)',
      chiSquare: '- : Chi-square Test (all expected frequencies ≥ 5)',
      yatesChiSquare: '- : Yates\' Corrected Chi-square Test (all expected frequencies ≥ 5)',
      na: 'N/A : Not calculable (cell value is 0)',
      correctionNote: 'Odds ratio calculated by adding 0.5 to all cells in rows with 0 cells (Haldane-Anscombe correction)',
      correctionApplied: '† : 0.5 correction applied'
    },
    tooltips: {
      fisher: 'Fisher\'s Exact Test (Exp. Freq < 5)',
      yates: 'Yates\' Corrected Chi-square (Exp. Freq ≥ 5)',
      chiSquare: 'Standard Chi-square (Exp. Freq ≥ 5)'
    }
  }
};
