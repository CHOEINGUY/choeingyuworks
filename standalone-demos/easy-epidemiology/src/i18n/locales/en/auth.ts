export default {
  title: 'Login',
  registerTitle: 'Register',
  logoutConfirmTitle: 'Logout',
  logoutConfirmMessage: 'Are you sure you want to logout? {br}All ongoing work will be saved securely.',
  savedTitle: 'Saved Successfully!',
  savedMessage: 'All data has been saved securely.{br}Redirecting to login screen...',
  goToLoginNow: 'Go Now',
  btnLogin: 'Login',
  btnRegister: 'Register',
  hero: {
    subtitle: 'Professional Data Analysis Solution{br}for Rapid and Accurate Epidemiology',
    feature1: 'Intuitive Data Input',
    feature2: 'Automated Epidemic Curve',
    feature3: 'OR/RR Statistical Analysis',
    guestAccess: 'Explore as Guest'
  },
  login: {
    demoNoticeTitle: 'Portfolio Demo Page',
    demoNoticeDesc: 'Click the {strong} below to connect automatically without entering info.',
    demoBtn: 'Login Button',
    identifierLabel: 'Email or Phone Number',
    passwordLabel: 'Password',
    autoLoginBtn: 'Auto Login for Demo',
    emailPlaceholder: 'Email',
    phonePlaceholder: 'Phone Number',
    errors: {
      identifierRequired: 'Please enter email or phone number.',
      invalidEmail: 'Invalid email format.',
      invalidPhone: 'Invalid phone number format.',
      passwordRequired: 'Please enter password.',
      loginFailed: 'An error occurred during login.',
      invalidCredentials: 'Invalid email/phone or password.',
      userNotFound: 'User not found.',
      accountNotApproved: 'Please wait for admin approval.',
      networkError: 'Please check your network connection.',
      logoutError: 'An error occurred during logout.'
    }
  },
  register: {
    steps: {
      basicInfo: 'Basic Info',
      password: 'Password Setup',
      affiliation: 'Affiliation Info'
    },
    step1: {
      joinDate: 'Join Date'
    },
    labels: {
      name: 'Name',
      email: 'Email Address',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      affiliationType: 'Affiliation Type',
      affiliation: 'Affiliation Name',
      passwordVisibility: 'Show/Hide Password'
    },
    placeholders: {
      name: 'Enter your full name',
      email: 'Enter your email address',
      phone: 'Enter your phone number',
      password: 'Enter a secure password (8+ chars)',
      confirmPassword: 'Enter password again',
      affiliationType: 'Select affiliation type',
      affiliation: 'Enter your organization name'
    },
    info: {
      loginNotice: 'You can login with email or phone number.'
    },
    buttons: {
      next: 'Next Step',
      prev: 'Previous Step',
      checking: 'Checking...',
      completing: 'Registering...',
      complete: 'Complete Registration'
    },
    errors: {
      nameRequired: 'Please enter your name.',
      nameTooShort: 'Name must be at least 2 characters.',
      emailRequired: 'Please enter your email address.',
      invalidEmail: 'Invalid email format.',
      phoneRequired: 'Please enter your phone number.',
      invalidPhone: 'Invalid phone number format.',
      passwordRequired: 'Please enter a password.',
      passwordTooShort: 'Password must be at least 6 characters.',
      confirmPasswordRequired: 'Please confirm your password.',
      passwordMismatch: 'Passwords do not match.',
      affiliationTypeRequired: 'Please select affiliation type.',
      affiliationRequired: 'Please enter your affiliation.',
      emailExists: 'Email already exists.',
      emailCheckError: 'Error checking email.',
      phoneExists: 'Phone number already exists.',
      phoneCheckError: 'Error checking phone number.',
      checkError: 'An error occurred during check.'
    },
    affiliationTypes: {
      hospital: 'Hospital',
      clinic: 'Clinic',
      public_health: 'Public Health Center',
      university: 'University',
      research: 'Research Institution',
      government: 'Government Agency',
      other: 'Other'
    }
  }
};
