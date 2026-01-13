export default {
  dashboard: {
    title: 'Admin Dashboard',
    subtitle: 'User Management & System Monitoring'
  },
  stats: {
    totalUsers: 'Total Users',
    pendingUsers: 'Pending Approvals',
    approvedUsers: 'Approved Users',
    adminUsers: 'System Admins'
  },
  tabs: {
    pending: 'Pending Approvals',
    allUsers: 'All Users',
    settings: 'System Settings'
  },
  emptyState: {
    title: 'No Pending Approvals',
    description: 'All new signup requests have been processed.'
  },
  loading: {
    title: 'Syncing data...',
    subtitle: 'Please wait a moment.'
  },
  userNotFound: {
    title: 'No Users Found',
    description: 'No users match the search criteria.'
  },
  role: {
    admin: 'System Admin',
    user: 'Standard User',
    support: 'Tech Support',
    pending: 'Pending'
  },
  status: {
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    suspended: 'Suspended'
  },
  actions: {
    approve: 'Approve',
    reject: 'Reject',
    delete: 'Delete',
    edit: 'Edit'
  },
  table: {
    name: 'Name',
    email: 'Email',
    role: 'Role',
    status: 'Status',
    actions: 'Actions',
    noName: 'No name',
    id: 'ID'
  },
  settings: {
    title: 'Site Settings Management',
    subtitle: 'Dynamically manage homepage information.',
    tabs: {
      basic: 'Basic Info',
      organization: 'Organization Info',
      features: 'Features & Systems',
      contact: 'Contact & Support'
    },
    organization: {
      title: 'Organization Info',
      institution: 'Institution Name',
      department: 'Department',
      center: 'Center Name',
      team: {
        title: 'Team Members',
        role: 'Role',
        name: 'Name',
        add: 'Add Team Member'
      }
    },
    features: {
      title: 'Feature Cards',
      systemTitle: 'System Features',
      icon: 'Icon',
      featureTitle: 'Title',
      description: 'Description',
      placeholderEmoji: 'Emoji',
      placeholderTitle: 'Feature Title',
      placeholderDesc: 'Enter detailed description',
      addFeature: 'Add New Feature Card',
      addSystem: 'Add System Feature'
    },
    actions: {
      reset: 'Restore to Defaults',
      save: 'Save All Settings'
    }
  },
  toolbar: {
    filter: {
      affiliationType: 'Affiliation Type',
      affiliation: 'Affiliation',
      today: 'Today',
      todayTooltip: 'View today\'s signups only'
    },
    search: {
      placeholder: 'Search by Name, Affiliation, Phone...',
      clear: 'Clear search'
    },
    bulkApprove: {
      label: 'Bulk Approve',
      tooltip: 'Approve {count} selected users',
      tooltipEmpty: 'Select users to approve'
    },

    affiliationTypes: {
      hospital: 'Hospital',
      clinic: 'Clinic',
      public_health: 'Public Health Center',
      university: 'University',
      research: 'Research Institute',
      government: 'Government Agency',
      other: 'Other'
    }
  },
  messages: {
    systemNotice: 'System Notice',
    systemWarning: 'System Warning',
    pendingRefreshed: 'Pending users list refreshed',
    allRefreshed: 'All users list refreshed',
    todayOnly: 'Showing today\'s signups only',
    showAll: 'Showing all users',
    approved: 'User approved successfully',
    confirmReject: 'Are you sure you want to reject this user?',
    rejected: 'User rejected successfully',
    confirmDelete: 'Are you sure you want to delete this user? This action cannot be undone.',
    deleted: 'User deleted successfully',
    roleChanged: 'User role updated successfully',
    confirmBulkApprove: 'Are you sure you want to approve {count} users?',
    bulkApproved: '{count} users approved successfully',
    confirmLogout: 'Are you sure you want to logout?',
    settingsSaved: 'Settings saved successfully',
    settingsSaveFailed: 'Failed to save settings: {error}',
    confirmReset: 'Are you sure you want to reset all settings to default?',
    settingsReset: 'Settings reset to default',
    settingsResetFailed: 'Failed to reset settings: {error}'
  }
};

