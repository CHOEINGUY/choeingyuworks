export default {
  title: 'Cohort Study',
  guide: {
    button: 'Stats Guide',
    title: 'Cohort Study Statistics Guide',
    subtitle: 'Understanding Relative Risk (RR) and Incidence Analysis',
    sections: {
      contingencyTable: {
        title: '2x2 Contingency Table',
        description: 'Cohort studies directly compare incidence rates based on exposure to risk factors. Incidence is calculated for each group.',
        headers: {
          category: 'Category',
          case: 'Case',
          nonCase: 'Non-Case',
          total: 'Total'
        },
        rows: {
          exposed: { label: 'Exposed', sub: 'Exposed' },
          unexposed: { label: 'Unexposed', sub: 'Unexposed' },
          total: 'Total'
        },
        cells: {
          a: 'Exposed + Case',
          b: 'Exposed + Non-Case',
          c: 'Unexposed + Case',
          d: 'Unexposed + Non-Case'
        }
      },
      rr: {
        title: 'Relative Risk (RR)',
        formula: {
          incidence: 'Incidence',
          rr: 'RR Formula'
        },
        def: {
          title: 'Definition',
          desc: 'A measure indicating how many times higher the incidence rate is in the exposed group compared to the unexposed group.'
        },
        interpretation: {
          title: 'Interpretation',
          risk: { label: 'RR > 1', desc: 'Increased risk when exposed (Risk Factor)' },
          paramount: { label: 'RR < 1', desc: 'Decreased risk when exposed (Protective Factor)' },
          null: { label: 'RR = 1', desc: 'No difference in risk' }
        }
      },
      pvalue: {
        title: 'P-value',
        description: 'The probability that the calculated Relative Risk (RR) was observed by chance. Typically, a value less than {highlight} is considered statistically significant.',
        method: {
          title: 'Test Method Selection Criteria',
          chiSquare: { label: 'Chi-square Test', desc: 'Tests for difference in incidence between two groups' },
          fisher: { label: 'Fisher\'s Exact Test', desc: 'Used when frequency is less than 5' }
        }
      },
      ci: {
        title: '95% Confidence Interval (95% CI)',
        description: 'The 95% range in which the true value of the Relative Risk is expected to lie. Whether the interval {includes} is crucial.',
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
    title: 'Analysis Results by Factor (Cohort)',
    yatesActive: 'Yates Correction On',
    yatesInactive: 'Yates Correction Off',
    copyTable: 'Copy Table'
  },
  table: {
    noData: 'No data to analyze or check Vuex store connection.',
    headers: {
      factor: 'Factor (Diet)',
      exposedGroup: 'Exposed',
      unexposedGroup: 'Unexposed',
      pvalue: 'Chi-square\nP-value',
      rr: 'Relative Risk\n(RR)',
      ci: '95% CI',
      subjects: 'Total',
      cases: 'Cases',
      incidence: 'Incidence(%)',
      lower: 'Lower',
      upper: 'Upper'
    },
    legend: {
      title: 'Statistical Test Methods & Legend',
      fisher: '* : Fisher\'s Exact Test (when expected frequency < 5)',
      chiSquare: '- : Chi-square Test (all expected frequencies ≥ 5)',
      yatesChiSquare: '- : Yates\' Corrected Chi-square Test (all expected frequencies ≥ 5)',
      na: 'N/A : Not calculable (cell value is 0)',
      correctionNote: 'Relative Risk calculated by adding 0.5 to all cells in rows with 0 cells (Haldane-Anscombe correction)',
      correctionApplied: '† : 0.5 correction applied'
    },
    tooltips: {
      fisher: 'Fisher\'s Exact Test (Exp. Freq < 5)',
      yates: 'Yates\' Corrected Chi-square (Exp. Freq ≥ 5)',
      chiSquare: 'Standard Chi-square (Exp. Freq ≥ 5)'
    }
  }
};
