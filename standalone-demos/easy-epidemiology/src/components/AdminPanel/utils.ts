import i18n from '@/i18n';

export type AffiliationType = 'hospital' | 'clinic' | 'public_health' | 'university' | 'research' | 'government' | 'other';

export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export const getAffiliationTypeLabel = (type: AffiliationType | string | null | undefined): string => {
  const { t } = i18n.global;
  return t(`admin.toolbar.affiliationTypes.${type || 'other'}`);
};

export const getAffiliationTypeClass = (type: AffiliationType | string | null | undefined): string => {
  return `affiliation-${type || 'other'}`;
};

const statusClasses: Record<UserStatus, string> = {
  'pending': 'pending',
  'approved': 'approved',
  'rejected': 'rejected',
  'suspended': 'suspended'
};

export const getStatusClass = (status: UserStatus | string | null | undefined): string => {
  return statusClasses[status as UserStatus] || 'pending';
};

export const getStatusLabel = (status: UserStatus | string | null | undefined): string => {
  const { t } = i18n.global;
  return t(`admin.status.${status || 'pending'}`);
};

const statusIcons: Record<UserStatus, string> = {
  'pending': 'hourglass_empty',
  'approved': 'check_circle',
  'rejected': 'cancel',
  'suspended': 'block'
};

export const getStatusIcon = (status: UserStatus | string | null | undefined): string => {
  return statusIcons[status as UserStatus] || 'hourglass_empty';
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const { locale } = i18n.global;
  return date.toLocaleDateString((locale as any).value === 'ko' ? 'ko-KR' : 'en-US');
};
