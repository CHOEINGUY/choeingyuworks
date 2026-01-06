import React, { useState } from 'react';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { MessageTemplate, CATEGORIES } from '../../../data/messageTemplates';

interface TemplateSidebarProps {
    templates: MessageTemplate[];
    selectedTemplate: MessageTemplate | null;
    onSelect: (template: MessageTemplate) => void;
    onCreate: () => void;
    serviceType: string;
}

const TemplateSidebar: React.FC<TemplateSidebarProps> = ({
    templates,
    selectedTemplate,
    onSelect,
    onCreate,
    serviceType
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter templates
    const filtered = templates.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
        // Service filter is already applied by parent, but double check if needed, 
        // or just rely on parent passing filtered list. 
        // Plan said "Selecting a service instantly filters the Left Panel", 
        // so we assume `templates` passed here are already filtered or we filter here.
        // Let's filter here to be safe if parent passes all.
        const matchesService = serviceType === 'ALL' || t.serviceType === serviceType;

        return matchesSearch && matchesService;
    });

    const getCategoryColor = (catId: string) => {
        const cat = CATEGORIES.find(c => c.id === catId);
        return cat ? cat.color : 'gray';
    };

    return (
        <div className="flex flex-col w-80 border-r border-slate-200 bg-white h-full">
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="템플릿 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 placeholder-slate-400 font-medium transition-all"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
                {filtered.map(template => {
                    const isSelected = selectedTemplate?.id === template.id;
                    const catColor = getCategoryColor(template.category);

                    return (
                        <div
                            key={template.id}
                            onClick={() => onSelect(template)}
                            className={`
                                group relative p-4 rounded-xl cursor-pointer border transition-all duration-200
                                ${isSelected
                                    ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 shadow-sm'
                                    : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50 hover:shadow-sm'
                                }
                            `}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`
                                    px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                                    ${isSelected
                                        ? 'bg-white text-indigo-600 border border-indigo-100'
                                        : `bg-${catColor}-50 text-${catColor}-600 border border-${catColor}-100`
                                    }
                                `}>
                                    {CATEGORIES.find(c => c.id === template.category)?.label || template.category}
                                </span>
                                {/* New Badge */}
                                {(template as any).isNew && (
                                    <span className="text-[10px] font-bold text-pink-500 animate-pulse">NEW</span>
                                )}
                            </div>
                            <h4 className={`font-bold text-sm mb-1 ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                {template.title}
                            </h4>
                            <p className={`text-xs truncate ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`}>
                                {template.content}
                            </p>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                        <MessageSquare size={32} className="mb-2 opacity-50" />
                        <span className="text-xs">검색 결과가 없습니다.</span>
                    </div>
                )}
            </div>

            {/* Bottom Action */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button
                    onClick={onCreate}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 hover:bg-white transition-all flex items-center justify-center gap-2 text-sm"
                >
                    <Plus size={16} />
                    <span>새 템플릿 만들기</span>
                </button>
            </div>
        </div>
    );
};

export default TemplateSidebar;
