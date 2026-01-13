export default {
  hero: {
    title: 'Easy-Epidemiology Web v2.0',
    subtitle: 'Professional Epidemiology Platform',
    description: 'Integrated web-based analysis solution for outbreak investigation and epidemiological analysis',
    startBtn: 'Start Now',
    manualBtn: 'View User Manual'
  },
  features: {
    mainTitle: 'Powerful Analysis Tools',
    subTitle: 'Professional solution for all stages of epidemiological investigation',
    f1: { title: 'Data Input & Validation', desc: 'Web Worker based async processing and virtual scroll for lag-free large dataset handling with real-time validation' },
    f2: { title: 'Characteristic Analysis', desc: 'Auto-calculation of frequency and Attack Rate (AR), intuitive category handling via label mapping, and dynamic visualization' },
    f3: { title: 'Symptom Analysis', desc: 'High-performance interactive charts with ECharts, precise pattern analysis via multi-sort algorithms and real-time filtering' },
    f4: { title: 'Epi Curve & Incubation', desc: 'Auto-calculation of incubation stats (min/max/avg/median) and epidemic curve visualization for exposure estimation' },
    f5: { title: 'Case-Control Study', desc: 'Fisher\'s Exact Test (<5), Yates Correction, and precise 95% CI calculation via Log-scale transformation for OR' },
    f6: { title: 'Cohort Study', desc: 'Relative Risk (RR) and Incidence Rate calculation, robust statistical analysis with Haldane correction (0.5) for zero cells' }
  },
  system: {
    title: 'System Features',
    status: {
      label: 'System Status',
      operational: 'Operational',
      version: 'Version',
      lastUpdate: 'Last Update',
      lastUpdateDate: 'January 11, 2026',
      platform: 'Platform',
      platformValue: 'Web Based (Cross Platform)'
    },
    features: [
      'Virtual Scroll & Web Worker for Large Data',
      'Real-time Data Validation (Debounced)',
      'Precise Statistics using jStat Library',
      'Cross-tab: Auto-select Fisher/Yates',
      'Interval Est: Log-scale 95% CI',
      'Auto Report Generation & Preview',
      'High-performance ECharts Visualization',
      'Responsive Web Design (PC/Tablet)'
    ],
    org: 'Operating Organization',
    edu: 'Education Links',
    deptName: 'Chonnam National University Medical School',
    centerName: 'Department of Preventive Medicine',
    subCenterName: 'Research Center for Infectious Disease Epidemiology',
    members: {
      role1: 'Statistical Verification & Advice',
      name1: 'Jeong-Ho Yang',
      role2: 'System Development & Design',
      name2: 'In-Gyu Choi'
    },
    education: {
      items: {
        edu1: { title: '2025 Gwangju-Jeonnam Response Training', subtitle: 'FETP-F (Field Epidemiology Training Program)' },
        edu2: { title: 'KDCA Standard Epidemiology Curriculum', subtitle: 'Practice Tool' }
      }
    }
  },
  contact: {
    title: 'Operating Organization',
    center: 'Research Center for Infectious Disease Epidemiology and Field Response',
    operate: 'Operated By',
    dept: 'Dept.',
    techSupport: 'Technical Support',
    emailSupport: 'Email Inquiry',
    names: {
      yang: 'Jeong-Ho Yang',
      choi: 'In-Gyu Choe'
    },
    roles: {
      chief: 'Chief',
      researcher: 'Researcher'
    }
  },
  target: {
    title: 'Target Users',
    users: {
      gov: 'KDCA / City-Provincial Health Authorities',
      local: 'District Response Teams / Health Centers',
      expert: 'Epidemic Intelligence Officers / FETP Trainees',
      research: 'University Research / Field Epidemiologists'
    }
  },
  quickGuide: {
    title: 'Analysis Process',
    subtitle: 'One-stop workflow from data input to report generation',
    steps: {
      s1: { title: 'Data Input', desc: 'Enter demographics and clinical symptom data' },
      s2: { title: 'Characteristic Analysis', desc: 'Analyze and visualize distribution by characteristics' },
      s3: { title: 'Pattern Analysis', desc: 'Generate epidemic curves and identify onset patterns' },
      s4: { title: 'Statistical Analysis', desc: 'Conduct Case-Control / Cohort study analysis' },
      s5: { title: 'Result Utilization', desc: 'Export results and generate automated reports' }
    }
  }
};
