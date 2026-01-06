import React from 'react';
import ProfileFieldRenderer from './ProfileFieldRenderer';

interface ProfileSectionProps {
    section: {
        id: string;
        title: string;
        description?: string;
        fields: any[];
    };
    themeStyles: any;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ section, themeStyles }) => {
    // Special layout for Immersive sections (like Nickname)
    if (section.id === 'section_nickname') {
        return (
            <div className="w-full">
                <div className="space-y-6">
                    {section.fields.map((field) => (
                        <ProfileFieldRenderer key={field.id} field={field} variant="immersive" themeStyles={themeStyles} />
                    ))}
                </div>
            </div>
        );
    }

    // Default Card Layout
    return (
        <div className={`p-6 shadow-sm border ${themeStyles.border_base} ${themeStyles.card_bg} ${themeStyles.radius_card}`}>
            <div className="space-y-6">
                {section.fields.map((field) => (
                    <ProfileFieldRenderer key={field.id} field={field} themeStyles={themeStyles} />
                ))}
            </div>
        </div>
    );
};

export default ProfileSection;
