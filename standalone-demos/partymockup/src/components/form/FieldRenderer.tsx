import React from 'react';
import { FIELD_TYPES } from '../../constants/fieldTypes';
import { FormField } from '../../types/form';
import { ThemeStyles } from '../../constants/formThemes'; // Assuming ThemeStyles is exported from here or types

// Field Components - These still need to be converted, so we suppress TS errors for now or assume they work if allowJs is on
// For strict TS, we would declare them or convert them first.
// I will assume they are JS files and allowJs handles it, or I cast to any if needed.
import ShortTextField from './fields/ShortTextField';
import LongTextField from './fields/LongTextField';
import PhoneField from './fields/PhoneField';
import BirthDateField from './fields/BirthDateField';
import NumberField from './fields/NumberField';
import SingleChoiceField from './fields/SingleChoiceField';
import MultipleChoiceField from './fields/MultipleChoiceField';
import DropdownField from './fields/DropdownField';
import ImageUploadField from './fields/ImageUploadField';
import RegionField from './fields/RegionField';

interface FieldRendererProps {
    field: FormField;
    value: any;
    onChange: (value: any) => void;
    theme: any; // ThemeStyles; // Using any for now as Theme structure is complex
    error?: string;
    onAutoAdvance?: () => void;
    listStyleMode?: string;
}

/**
 * 필드 타입에 따라 적절한 컴포넌트를 렌더링
 */
const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange, theme, error, onAutoAdvance, listStyleMode }) => {
    const props = { field, value, onChange, theme, error, listStyleMode };

    switch (field.type) {
        case FIELD_TYPES.SHORT_TEXT:
            return <ShortTextField {...props} />;

        case FIELD_TYPES.LONG_TEXT:
            return <LongTextField {...props} />;

        case FIELD_TYPES.PHONE:
            return <PhoneField {...props} />;

        case FIELD_TYPES.BIRTH_DATE:
            return <BirthDateField {...props} />;

        case FIELD_TYPES.NUMBER:
            return <NumberField {...props} />;

        case FIELD_TYPES.SINGLE_CHOICE:
            return <SingleChoiceField {...props} onAutoAdvance={onAutoAdvance} />;

        case FIELD_TYPES.MULTIPLE_CHOICE:
            return <MultipleChoiceField {...props} />;

        case FIELD_TYPES.DROPDOWN:
            return <DropdownField {...props} />;

        case FIELD_TYPES.REGION:
            return <RegionField {...props} />;

        case FIELD_TYPES.IMAGE_UPLOAD:
            return <ImageUploadField {...props} />;

        default:
            return (
                <div className="text-center p-8" style={{ color: theme.colors?.text }}>
                    <p>지원하지 않는 필드 타입: {field.type}</p>
                </div>
            );
    }
};

export default FieldRenderer;
