import React from 'react';
import { Ticket, Users } from 'lucide-react';
import { FormSettings } from '../../../types/formConfig';

interface PricePanelProps {
    formSettings: FormSettings;
    setFormSettings: (settings: FormSettings) => void;
}

const PricePanel: React.FC<PricePanelProps> = ({ formSettings, setFormSettings }) => {
    return (
        <div className="h-full bg-white">
            <div className="p-5 sticky top-0 bg-white z-10 border-b border-slate-200">
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    이 폼의 참가비 정책을 설정합니다.<br />
                    성별에 따라 고정된 가격을 받을지,<br />
                    다양한 티켓 옵션을 제공할지 선택하세요.
                </p>
            </div>

            <div className="p-5 space-y-8">
                {/* Pricing Strategy Selector */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        참가비 설정 모드
                    </label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                            onClick={() => setFormSettings({ ...formSettings, pricingMode: 'fixed' })}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2
                                ${formSettings.pricingMode === 'fixed'
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                                    : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            <Users size={24} />
                            <span className="text-sm font-bold">성별 고정 가격</span>
                        </button>

                        <button
                            onClick={() => setFormSettings({ ...formSettings, pricingMode: 'option' })}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2
                                ${(!formSettings.pricingMode || formSettings.pricingMode === 'option')
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                                    : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            <Ticket size={24} />
                            <span className="text-sm font-bold">티켓별 가격</span>
                        </button>
                    </div>

                    {/* Conditional Input for Fixed Price */}
                    {formSettings.pricingMode === 'fixed' && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">남성 참가비</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formSettings.globalPrices?.male || 0}
                                        onChange={(e) => setFormSettings({
                                            ...formSettings,
                                            globalPrices: { ...formSettings.globalPrices, male: parseInt(e.target.value) || 0 }
                                        })}
                                        className="w-full p-2.5 pl-3 pr-8 border border-slate-200 rounded-lg text-sm font-mono text-right outline-none focus:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">원</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">여성 참가비</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formSettings.globalPrices?.female || 0}
                                        onChange={(e) => setFormSettings({
                                            ...formSettings,
                                            globalPrices: { ...formSettings.globalPrices, female: parseInt(e.target.value) || 0 }
                                        })}
                                        className="w-full p-2.5 pl-3 pr-8 border border-slate-200 rounded-lg text-sm font-mono text-right outline-none focus:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">원</span>
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                                * 신청서에서 티켓 선택 문항이 <strong>자동으로 숨겨지며</strong>, 성별에 따라 위 가격이 적용됩니다.
                            </p>
                        </div>
                    )}

                    {(!formSettings.pricingMode || formSettings.pricingMode === 'option') && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                            <p className="text-xs text-slate-500">
                                관리자 화면의 <strong>'참석 일정'</strong> 문항에서<br />
                                티켓 옵션을 직접 추가하고 가격을 설정합니다.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PricePanel;
