import { CORE_PRESETS as FORM_CORE, ADDON_PRESETS as FORM_ADDON, Preset } from './formPresets';
import { SYSTEM_FIELDS } from '../constants/systemFields';

// Profile Builder needs a slightly different set of presets than Form Builder.
// Specifically, 'Ticket/Payment' is not needed in the Profile view.

export const PROFILE_CORE_PRESETS: Preset[] = FORM_CORE.filter(preset => preset.id !== SYSTEM_FIELDS.TICKET_OPTION);

export const PROFILE_ADDON_PRESETS: Preset[] = FORM_ADDON.filter(preset => preset.id !== SYSTEM_FIELDS.REFUND_ACCOUNT);
