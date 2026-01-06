import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import FieldContainer from './FieldContainer';
import { FormField } from '../../../types/form';
import { ThemeStyles } from '../../../constants/formThemes';

interface RegionFieldProps {
    field: FormField;
    value?: string;
    onChange: (value: string) => void;
    theme: ThemeStyles;
    error?: { message: string };
}

interface FancySelectProps {
    options: any[];
    placeholder: string;
    selectedValue: string;
    onSelect: (val: string) => void;
    disabled: boolean;
}

/**
 * 시/도 선택 후 시군구를 선택하는 2단 드롭다운 (광역시는 구 선택, 도는 시까지만)
 */
const RegionField: React.FC<RegionFieldProps> = ({ field, value = '', onChange, theme, error }) => {
    const [selectedCity, selectedDistrict] = value.split('|');
    const cityOptions = field.options || [];
    const currentCity = cityOptions.find((opt: any) => opt.value === selectedCity);
    const districtOptions = currentCity?.districts || [];

    // 광역시 목록 (구 선택 필요)
    const metropolitanCities = ['seoul', 'busan', 'daegu', 'incheon', 'gwangju', 'daejeon', 'ulsan'];

    // 선택한 지역이 광역시인지 확인
    const isMetropolitanCity = metropolitanCities.includes(selectedCity);

    // 광역시인 경우에만 시군구 선택 필요
    const needsDistrictSelection = selectedCity && isMetropolitanCity;


    const FancySelect: React.FC<FancySelectProps> = ({ options, placeholder, selectedValue, onSelect, disabled }) => {
        const [open, setOpen] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);
        const selectedOption = options.find((opt) => opt.value === selectedValue);


        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                    setOpen(false);
                }
            };
            const handleEsc = (e: KeyboardEvent) => {
                if (e.key === 'Escape') setOpen(false);
            };
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEsc);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('keydown', handleEsc);
            };
        }, []);

        const toggle = () => {
            if (disabled) return;
            setOpen((prev) => !prev);
        };

        const handleSelect = (val: string) => {
            onSelect(val);
            setOpen(false);
        };

        const menuMaxHeight = 256; // px
        const menuOffset = 8;

        return (
            <div
                ref={containerRef}
                className={`relative rounded-xl border border-gray-200/70 bg-white/70 backdrop-blur-sm shadow-sm transition ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'}`}
                style={{
                    boxShadow: `0 10px 30px ${theme.colors.primary}10`,
                    zIndex: open ? 9999 : 1
                }}
            >
                <button
                    type="button"
                    onClick={toggle}
                    disabled={disabled}
                    className="w-full text-left px-3 py-3 text-lg font-semibold flex items-center justify-between gap-3 outline-none"
                    style={{
                        color: theme.colors.text
                    }}
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown size={18} className={`transition ${open ? 'rotate-180' : ''} ${disabled ? 'text-gray-300' : 'text-gray-500'}`} />
                </button>

                {open && (
                    <div
                        className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                        style={{
                            boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
                            maxHeight: menuMaxHeight,
                            zIndex: 9999
                        }}
                    >
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {options.length > 0 ? options.map((opt) => {
                                const active = opt.value === selectedValue;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(opt.value)}
                                        className={`w-full px-4 py-3 text-left flex items-center justify-between gap-3 transition ${active ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-gray-900 font-bold' : 'hover:bg-gray-50'
                                            }`}
                                        style={{
                                            color: active ? '#111827' : theme.colors.text || '#374151'
                                        }}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                        {active && (
                                            <Check size={16} className="text-pink-500" />
                                        )}
                                    </button>
                                );
                            }) : (
                                <div className="px-4 py-3 text-sm text-gray-400">선택지가 없습니다.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const handleCitySelect = (cityValue: string) => {
        const isMetro = metropolitanCities.includes(cityValue);
        if (!isMetro) {
            // 도 단위 지역은 시까지만 선택하고 완료
            onChange(cityValue);
        } else {
            // 광역시는 시군구 선택 대기
            onChange(`${cityValue}|`);
        }
    };

    const handleDistrictSelect = (districtValue: string) => {
        if (!selectedCity) return;
        onChange(`${selectedCity}|${districtValue}`);
    };

    return (
        <FieldContainer field={field} theme={theme} error={error} bodyClassName="flex-1 flex flex-col">
            {/* Dropdowns */}
            <div className="space-y-4 relative" style={{ zIndex: 1 }}>
                <div className="max-w-xl mx-auto">
                    <FancySelect
                        options={cityOptions}
                        placeholder="시/도 선택"
                        selectedValue={selectedCity || ''}
                        onSelect={handleCitySelect}
                        disabled={false}
                    />
                </div>

                {needsDistrictSelection && (
                    <div className="max-w-xl mx-auto">
                        <FancySelect
                            options={districtOptions.map((d: string) => ({ value: d, label: d }))}
                            placeholder="시군구 선택"
                            selectedValue={selectedDistrict || ''}
                            onSelect={handleDistrictSelect}
                            disabled={!selectedCity}
                        />
                    </div>
                )}

            </div>
        </FieldContainer>
    );
};

export default RegionField;
