export default {
  modal: {
    title: 'Analysis Required',
    message: 'Please run statistical analysis in the respective tab before writing the report.',
    confirm: 'OK'
  },
  editor: {
    title: 'Report Items',
    completed: 'Done',
    studyDesign: {
      label: 'Study Design',
      required: 'Selection Required',
      selected: 'Selected',
      caseControl: 'Case-Control',
      cohort: 'Restrospective Cohort'
    },
    items: {
      caseAttackRate: 'Case Attack Rate',
      patientAttackRate: 'Patient Attack Rate',
      exposureDate: 'Est. Exposure Date',
      firstCaseDate: 'First Case Date',
      meanIncubation: 'Mean Incubation',
      suspectedSource: 'Suspected Source',
      foodAnalysis: 'Food Intake Analysis',
      epiCurve: 'Epi Curve Chart',
      incubationChart: 'Incubation Chart',
      symptomsTable: 'Main Symptoms Table'
    },
    status: {
      entered: 'Entered',
      pending: 'Pending',
      designRequired: 'Design Required'
    },
    tooltips: {
      foodLimit: 'Food items count is {count}, exceeding 34.\nTable 4 will not include data.',
      designRequired: 'Please select a study design first.'
    }
  },
  preview: {
    title: 'Preview',
    sections: {
      overview: 'Ⅰ. Overview',
      team: 'Ⅱ. Investigation Team',
      results: 'Ⅳ. Results',
      incubation: 'Ⅴ. Incubation Period'
    },
    download: 'Download Report',
    designRequired: 'Select Study Design',
    tooltips: {
      designRequired: 'Please select a study design first.',
      foodLimit: 'Food items count is {count}, exceeding 34. Table 4 will not include data.',
      foodCount: 'Includes {count} food items.'
    },
    toast: {
      start: 'Starting report download...',
      success: 'Report file created.',
      error: 'Error creating report file.'
    }
  },
  generation: {
    dates: {
      year: '/',
      month: '/',
      day: '',
      hour: ':',
      minute: '',
      at: ' ',
      from: 'from ',
      to: ' to ',
      period: 'Period',
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    placeholders: {
      unknown: 'Unknown',
      none: 'None',
      analyzing: 'Analyzing...',
      notApplicable: 'N/A'
    },
    sections: {
      epiCurveTitle: '[Figure 1] Epidemic Curve',
      incubationTitle: '[Figure 2] Incubation Period Distribution',
      symptomsTitle: '[Table 3] Main Symptoms Status',
      foodAnalysisTitle: '[Table 4] Results of Univariate Analysis by Factor'
    },
    descriptions: {
      studyDesignPrefix: 'This investigation was designed and conducted as a ',
      studyDesignSuffix: '.',
      statisticalMethod: 'Statistical analysis was performed using Chi-square test and Fisher\'s exact test.',
      statisticalMethodYates: 'through Chi-square test with Yates\' correction,',
      statisticalMethodYatesFisher: 'through Chi-square test with Yates\' correction and Fisher\'s exact test,',
      statisticalBase: 'Statistical analysis was conducted using the epidemiological survey data specialized analysis program (Easy-Epidemiology Web) provided by the Department of Preventive Medicine at Chonnam National University Medical School and the Gwangju and Jeonnam Infectious Disease Control and Support Centers.',
      incubationFormat: 'The results showed a minimum of {min}, maximum of {max}, average of {avg}, and median of {median}.',
      foodIntakeResult: 'As a result of case association analysis according to food intake, {parts} showed a statistically significant association.',
      statAnalysisResult: 'The {metric} and 95% confidence intervals were calculated, and the statistical significance of the association between exposure factors and disease was confirmed {methodText}.',
      haldaneCorrection: 'In cases where the frequency of specific cells in the cross-table was 0, the Haldane-Anscombe correction was applied when calculating the {metric} and confidence intervals.',
      incubationExposureSingle: 'As a result of the epidemiological investigation, the source of infection was estimated to be {suspected}, and the exposure time was estimated to be {expTxt}. Based on this time, the average incubation period until the onset of symptoms was {meanH} hours, and {incubationStats} were shown.',
      incubationExposureRange: 'As a result of the epidemiological investigation, the source of infection was estimated to be {suspected}, and the exposure time was identified within the range from {startTxt} to {endTxt}. The average incubation period for cases exposed within this period until symptom onset was {meanH} hours, and {incubationStats} were shown.',
      attackRateResult: 'Among the {total} participants included in the investigation, the number of cases was {patientCount}, resulting in a case attack rate of {caseAttackRate}. Of these, the number of confirmed cases detected through clinical testing was {confirmedCount}, resulting in a confirmed patient attack rate of {confirmedAttackRate}.',
      firstCaseSummary: 'The first case meeting the case definition developed {symptomList} symptoms around {firstCaseDateTime}. Since then, there have been a total of {patientCount} cases until {lastCaseDateTime}.'
    },
    tables: {
      caseControl: {
        headers: ['Factor(Food)', 'Cases', 'Controls', 'Exposed', 'Unexposed', 'Total', 'Chi-square', 'Odds Ratio', '95% CI', 'Lower', 'Upper']
      },
      cohort: {
        headers: ['Factor(Food)', 'Exposed', 'Unexposed', 'Total', 'Cases', 'Attack Rate(%)', 'Chi-square', 'Relative Risk', '95% CI', 'Lower', 'Upper']
      }
    },
    charts: {
      epiCurvePlaceholder: 'Click the "Save Report" button in the EpidemicCurve tab to save the chart image and check it here.',
      incubationPlaceholder: 'Click the "Save Report" button for the incubation chart in the EpidemicCurve tab to save the chart image and check it here.'
    },
    filename: 'Epidemiological_Investigation_Report'
  },
  template: {
    title: 'Waterborne and Foodborne Disease Outbreak<br/>Epidemiological Investigation Report',
    sections: {
      intro: 'I. Overview',
      team: 'II. Investigation Team and Roles',
      design: '3. Study Design and Subject Selection',
      sample: '3. Collected Specimen Types and Test Items',
      caseDef: '4. Case Definition',
      action: '5. Field control measures',
      stat: '6. Statistical Analysis Methods',
      results: 'IV. Results',
      firstCase: '1. Date of Onset of First Case',
      attackRate: '2. Attack Rate',
      commonExposure: '3. Common Exposure Source Investigation',
      epiCurve: '4. Epidemic Curve',
      symptoms: '5. Main Symptoms',
      foodAnalysis: '6. Food Intake Analysis',
      env: '7. Environment Investigation Results (Cooking, Food Supply)',
      water: '8. Water Investigation Results',
      incubation: 'V. Incubation Period and Exposure Timing'
    },
    labels: {
      reportDate: 'Report Date',
      exposureDate: 'Est. Exposure Date',
      investDate: 'Field Investigation Date',
      firstCaseDate: 'First Case Date',
      region: 'Region',
      incubation: 'Mean Incubation Period',
      place: 'Location/Institution',
      pathogen: 'Suspected Pathogen',
      design: 'Study Design',
      source: 'Suspected Source',
      attackRate: 'Case Attack Rate',
      endDate: 'Outbreak End Date',
      patientAttackRate: 'Patient Attack Rate',
      labDate: 'Final Lab Result Date',
      omitted: 'Omitted',
      designLabel: 'Study Design',
      symptomTitle: '[Table 3] Number of cases and percentage by major symptom',
      symptomHeader: 'Symptoms',
      caseHeader: 'Cases (N=%patientCount%)',
      countHeader: 'Cases (n)',
      percentHeader: '%',
      epiCurveCaption: '[Figure 1] Epidemic curve by symptom onset time',
      incubationCaption: '[Figure 2] Distribution of incubation period based on estimated exposure time'
    }
  }
};
