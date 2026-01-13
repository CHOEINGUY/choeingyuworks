export default {
  title: 'User Manual',
  subtitle: 'Easy-Epidemiology Web v2.0',
  footer: '© 2026 Easy-Epidemiology Web. All rights reserved.',
  menu: {
    intro: '1. Introduction',
    dataInput: '2. Data Input',
    patient: '3. Patient Characteristics',
    symptoms: '4. Clinical Symptoms',
    epidemic: '5. Epidemic Curve',
    caseControl: '6. Case-Control Study',
    cohort: '7. Cohort Study',
    report: '8. Report Writer',
    caseSeries: '9. Case Series',
    team: '10. Development Team'
  },
  intro: {
    title: '1. Introduction',
    desc1: '{bold1} is a {bold2} that supports data input, analysis, visualization, and report generation for epidemiological investigations without installation.',
    toolType: 'web-based tool',
    security: {
      title: 'Security & Privacy',
      desc: 'This program {bold} to any server. All sensitive information entered (such as patient lists) is stored temporarily only within your PC (browser), so you can use it safely.',
      notTransmit: 'does NOT transmit data'
    },
    desc2: 'This program is designed to easily manage complex epidemiological data and derive meaningful results through various statistical analyses. Key features include:',
    features: [
      'Intuitive table-based data input and management',
      'Auto analysis/visualization of patient characteristics/symptoms',
      'Dynamic chart generation including Epidemic Curves',
      'Support for Case-Control (OR) and Cohort (RR) studies'
    ]
  },
  dataInput: {
    headers: {
      serial: 'Serial',
      isPatient: 'Is Patient <br />(Patient-1, Normal-0)',
      confirmed: 'Confirmed <br />(Yes-1, No-0)',
      basic: 'Basic Info',
      clinical: 'Clinical Symptoms (Yes-1, No-0)',
      exposure: 'Individual Exposure Time',
      onset: 'Symptom Onset',
      diet: 'Diet History (Ate-1, No-0)'
    },
    bottomActions: {
      atBottom: 'At Bottom',
      addRows: 'Add Rows',
      deleteEmpty: 'Delete Empty Rows',
      filterTooltip: 'Cannot add rows while filter is active'
    },
    title: '2. Data Input Tab Guide',
    desc: 'This tab is the core space for entering and managing epidemiological data. It is in a table format very similar to {bold}, so you can easily paste or modify data just like using Excel.',
    sec1: {
      title: '2.1. Understanding the Screen Layout',
      desc: 'The main areas of the "Data Input" tab are:',
      items: [
        '{bold}: A space to freely input and modify data like Excel.',
        '{bold}: Performs functions such as importing Excel files, exporting data, and resetting.',
        '{bold}: Where the title (variable name) of each column is displayed.'
      ],
      bolds: ['① Data Input Table (Grid)', '② Top Function Bar', '③ Header']
    },
    sec2: {
      title: '2.2. Context Menu (Right Click)',
      desc: 'Right-clicking a cell brings up the edit menu for cell/row/column.',
      items: [
        '{bold}: Insert or delete rows or columns at the desired position.',
        '{bold}: Clear the contents of selected cells, rows, or columns.'
      ],
      bolds: ['Add/Delete Row/Column', 'Delete Data']
    },
    sec3: {
      title: '2.3. Data Filtering',
      desc: 'Right-click the header to filter and view only the desired data.',
      boxTitle: 'How to use Filter',
      steps: [
        '{bold} on the header cell.',
        '{bold} (or uncheck) the desired values in the appearing menu.',
        '{bold} (or uncheck) the desired values in the appearing menu.',
        'When the filter is applied, only data matching the condition will be displayed.'
      ],
      stepBolds: ['Right-click', 'check'],
      tip: '{bold}: To clear all applied filters, select {bold2} at the bottom of the context menu.',
      tipBolds: ['Tip', '\'Clear All Filters\'']
    },
    sec4: {
      title: '2.4. Import & Export Excel Files ',
      'import': {
        title: 'Import Excel File',
        desc: 'If you have an existing basic epidemiological investigation form (Excel file), click the {bold} button to register it at once.',
        items: [
          '{bold}: Must be {bold2} (e.g., Name, Gender, Age).',
          '{bold}: Actual data should be entered.',
          '{bold}: Actual data should be entered.',
          'When a file is selected, the program automatically matches columns and loads the data.'
        ],
        descBold: 'Import Excel File',
        itemBolds: ['Row 1', 'variable names', 'From Row 2']
      },
      'export': {
        title: 'Export Data',
        desc: 'You can save your work as an Excel file via the {bold} button to back it up to your PC or share it with others.',
        descBold: 'Export Data'
      }
    },
    sec5: {
      title: '2.5. Useful Shortcuts',
      desc: 'You can work quickly using only the keyboard without a mouse.',
      items: [
        { key: 'Enter', desc: 'Save input / Move to cell below' },
        { key: 'Tab', desc: 'Move to right cell' },
        { key: 'Shift + Tab', desc: 'Move to left cell' },
        { key: 'Arrow Keys', desc: 'Move cell' },
        { key: 'Delete', desc: 'Delete selected cell content' },
        { key: 'F2', desc: 'Enter cell edit mode' }
      ],
      windows: 'Common Windows shortcuts are also supported.',
      shortcuts: {
        copy: 'Copy',
        paste: 'Paste',
        undo: 'Undo',
        redo: 'Redo'
      }
    },
    sec6: {
      title: '2.6. Data Validation (Error Notification)',
      desc: 'If the date format (YYYY-MM-DD) is wrong or text is entered where a number should be, {bold}.{br}If you {bold2} that appears at the bottom of the screen, {bold3} to the cell with the error. Find and fix error data quickly.',
      bolds: ['the cell border turns red', 'click the error notification (Toast)', 'screen automatically scrolls']
    },
    sec7: {
      title: '2.7. Auto Save',
      cardTitle: 'Don\'t Worry!',
      cardDesc: 'Everything you type is automatically saved in your browser in real time.'
    }
  },
  patient: {
    title: '3. Patient Characteristics Tab',
    desc: 'Automatically summarizes and visualizes the demographic characteristics of patients.',
    sec1: { title: '3.1. Overview', desc: 'You can check total subjects, number of cases, attack rates, etc. at a glance.' },
    sec2: { title: '3.2. Statistical Table Analysis', desc: 'If you {bold} desired variables (Gender, Age Group, etc.) from the left menu, a statistical table for that variable is generated immediately on the right.', descBold: 'check' },
    sec3: { title: '3.3. Chart Analysis', desc: 'A bar chart for the selected variable is automatically drawn. Clicking the {bold} button at the top right of the chart downloads it as a PNG file for immediate use in reports.', descBold: '[Save Image]' },
    sec4: {
      title: '3.4. Tips & Cautions',
      warningTitle: 'Interpretation Caution',
      warningDesc: 'Please distinguish between patient proportion and attack rate. Patient proportion is the share of cases within that group, while attack rate may differ from the rate relative to the total population.'
    }
  },
  symptoms: {
    title: '4. Clinical Symptoms Tab',
    desc: 'Analyzes the complaint rate of major symptoms to identify the most frequent clinical features.',
    sec1: { title: '4.1. Overview', desc: 'Automatically calculates frequency and proportion for all registered symptoms.' },
    sec2: {
      title: '4.2. Tables & Charts',
      items: [
        '{bold}: Provides the number of cases and percentage (%) for each symptom.',
        '{bold}: Visualized as a bar chart, with horizontal/vertical mode switching.'
      ],
      bolds: ['Statistical Table', 'Chart']
    },
    sec3: {
      title: '4.3. Analysis Tip',
      boxTitle: 'Analysis Tip',
      desc: "Use 'Descending' sort to easily identify the most common symptoms and highlight key symptoms for reports."
    }
  },
  team: {
    title: '10. Development Team',
    desc: 'This program was developed by {bold}.',
    centerName: 'Research Center for Infectious Disease Epidemiology and Field Response, Chonnam National University Medical School',
    devTeam: 'Development Team',
    devs: {
      lead: { role: 'Lead Developer', name: 'Yang Jeong-ho (Chonnam Nat\'l Univ.)' },
      tech: { role: 'Technical Developer', name: 'Choe In-gyu (Chonnam Nat\'l Univ.)' }
    },
    inquiry: 'Inquiries',
    thanks: {
      title: 'Thank You',
      desc: 'We hope Easy-Epidemiology Web enables more efficient and accurate epidemiological investigations.'
    }
  },
  epidemic: {
    title: '5. Epidemic Curve & Incubation Analysis',
    desc: 'Plots the Epidemic Curve (Epi Curve) of patient occurrence over time to estimate exposure time or analyze incubation periods.',
    sec1: { title: '5.1. Select Presumed Source', desc: 'You can select statistically significant risk factors identified in previous steps (Case Control/Cohort) to reflect in chart titles.' },
    sec2: {
      title: '5.2. Epidemic Curve Chart',
      desc: 'Adjust intervals (3h, 6h, 12h, 24h) using buttons to identify epidemic patterns.',
      items: [
        '{title}: A single large, sharp peak may indicate exposure to a common source over a short period.',
        '{title}: If case occurrence persists for a long time or shows a flat shape, it suggests continuous exposure to the source.'
      ],
      itemTitles: ['Single Source', 'Continuous Source']
    },
    sec3: {
      title: '5.3. Incubation Period Analysis',
      desc: 'To calculate the incubation period, a reference point is needed. Please enter date and time in the {bold} field at the top.{br}It automatically calculates the difference between the input time and each patient\'s onset date to derive {bold2}.',
      bolds: ['[Estimated Exposure Date]', 'min, max, mean, median incubation period']
    }
  },
  caseControl: {
    title: '6. Case-Control Study',
    desc: 'Identify risk factors by comparing exposure history of cases and controls. Useful when the pathogen is unclear, such as in food poisoning investigations.',
    sec1: {
      title: '6.1. Key Indicators',
      items: [
        '{bold}: Ratio of the probability that a case was exposed to the probability that a control was exposed. (e.g., OR=3 implies the risk is about 3 times higher for those exposed)',
        '{bold}: Statistically significant if it does not include 1',
        '{bold}: Considered significant if less than 0.05'
      ],
      bolds: ['Odds Ratio (OR)', '95% Confidence Interval (CI)', 'P-value']
    },
    sec2: {
      title: '6.2. Statistical Test Methods',
      desc: '{bold} or {bold2} is automatically applied depending on expected frequencies.',
      bolds: ['Chi-square test', 'Fisher\'s Exact Test']
    },
    sec3: {
      title: 'Interpretation Tip',
      desc: 'Generally, the food with {bold} and {bold2} is estimated as the probable cause.{br}Click {bold3} in the table header to sort ascendingly to easily find statistically significant items.',
      bolds: ['P-value < 0.05', 'highest OR', '[P-value]']
    }
  },
  cohort: {
    title: '7. Cohort Study',
    desc: 'Calculates the {bold} by directly comparing incidence rates between exposed (ate) and unexposed (gathering) groups.',
    descBold: 'Relative Risk (RR)',
    sec1: {
      title: '7.1. When to use?',
      desc: 'Used when the {bold} is clearly known, such as school meals or retreats.',
      descBold: 'list of total subjects and intake status'
    },
    sec2: {
      title: '7.2. Result Interpretation',
      items: [
        '{bold}: High risk of disease when consumed (e.g., RR=2.5 means 2.5 times higher incidence)',
        '{bold}: No association',
        '{bold}: Preventive effect (or inverse correlation)'
      ],
      bolds: ['RR > 1', 'RR = 1', 'RR < 1']
    }
  },
  report: {
    title: '8. Report Writer',
    desc: 'Synthesizes all results analyzed in previous tabs to automatically generate a {bold}.{br}The generated file is a draft, so you must open it in {bold2} to review and refine the content.',
    descBolds: ['draft epidemiological investigation report in HWPX format', 'Hangul (HWP) program'],
    sec1: {
      title: '8.1. Generation Steps (Required)',
      items: [
        'Check contents of all analysis tabs (Symptoms, Case-Control, etc.)',
        '{bold} (Most Important)',
        'Review preview screen in Report tab',
        'Click {bold2} button at top right'
      ],
      bolds: ["Click 'Save Report' button in 'Epidemic Curve' tab", '[Download]']
    },
    sec2: {
      title: 'Chart not showing!',
      desc: 'Epidemic curves and incubation charts are captured as images. Therefore, you must finalize the design in {bold} and click the {bold2} button to include them in the report.',
      bolds: ['5. Epidemic Curve Tab', '[Save Report]']
    }
  },
  caseSeries: {
    title: '9. Case Series',
    desc: 'In-depth analysis and summary of characteristics for a Case Series meeting specific conditions.{br}This tab is used when a {bold} is needed rather than aggregate statistics. You can select specific columns matching the investigation purpose to output as a list.',
    descBold: 'detailed list of individual cases',
    expert: {
      title: 'Usage Examples',
      items: [
        '{bold}: Reporting only list of patients with \'Diarrhea\' symptom',
        '{bold}: Creating a list of contacts/details for patients with \'Y\' in hospitalization',
        '{bold}: Filtering uncollected specimens to secure a list'
      ],
      bolds: ['Specific Symptom List', 'Severe Patient Management', 'Specimen Collection Targets']
    }
  }
};
