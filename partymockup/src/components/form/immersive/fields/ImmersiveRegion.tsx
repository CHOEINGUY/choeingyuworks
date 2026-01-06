import React, { useState } from 'react';
import PremiumDropdown from './PremiumDropdown';
import { REGION_DATA } from '../../../../data/regionData';

interface ImmersiveRegionProps {
    field: {
        options?: { label: string; value: string; districts?: string[] }[];
    };
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    themeStyles: any;
}

const ImmersiveRegion: React.FC<ImmersiveRegionProps> = ({ field, value, onChange, onNext, themeStyles }) => {
    // value format: "City|District" - Actually it seems to be "City District" according to the logic below
    // But the initialization uses split('|') which implies "City|District" was expected or stored?
    // Let's stick to the existing logic:
    // Original: value.split('|')
    // Handler: `${cityLabel} ${district}` (space separated)

    // Wait, if it's space separated on change, why split by pipe on init?
    // This might be a legacy bug or data format mismatch.
    // I will support both space and pipe for safety here.
    const splitChar = value?.includes('|') ? '|' : ' ';
    const parts = value ? value.split(splitChar) : ['', ''];

    const [selectedCity, setSelectedCity] = useState(parts[0] || '');
    const [selectedDistrict, setSelectedDistrict] = useState(parts[1] || '');

    // Fallback to REGION_DATA if field.options is empty or undefined
    const cityOptions = (field.options && field.options.length > 0) ? field.options : REGION_DATA;


    const districtOptionsData = selectedCity
        ? cityOptions.find(o => o.value === selectedCity)?.districts || []
        : [];

    const districtOptions = districtOptionsData.map(d => ({ label: d, value: d }));

    const handleCitySelect = (cityValue: string) => {
        setSelectedCity(cityValue);
        setSelectedDistrict(''); // Reset district

        // Find label for the selected city value to save as Korean
        const selectedOption = cityOptions.find(o => o.value === cityValue);
        const cityLabel = selectedOption ? selectedOption.label : cityValue;

        onChange(`${cityLabel} `); // Partial update with space
    };

    const handleDistrictSelect = (district: string) => {
        setSelectedDistrict(district);

        const selectedOption = cityOptions.find(o => o.value === selectedCity);
        const cityLabel = selectedOption ? selectedOption.label : selectedCity;

        const finalValue = `${cityLabel} ${district}`;
        onChange(finalValue);

        // Auto advance after short delay
        setTimeout(() => {
            onNext();
        }, 400);
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div>
                <label className={`block text-sm font-semibold mb-2 ml-1 ${themeStyles.text_secondary}`}>시/도</label>
                <PremiumDropdown
                    label="시/도를 선택하세요"
                    value={selectedCity}
                    options={cityOptions}
                    onSelect={handleCitySelect}
                    themeStyles={themeStyles}
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ml-1 ${themeStyles.text_secondary}`}>시/군/구</label>
                <PremiumDropdown
                    label="시/군/구를 선택하세요"
                    value={selectedDistrict}
                    options={districtOptions}
                    onSelect={handleDistrictSelect}
                    disabled={!selectedCity}
                    themeStyles={themeStyles}
                />
            </div>
        </div>
    );
};

export default ImmersiveRegion;
