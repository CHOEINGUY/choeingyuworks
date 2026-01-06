import { useState, useCallback } from 'react';
import { DEFAULT_PROFILE_CONFIG } from '../data/defaultProfileConfig';
import { v4 as uuidv4 } from 'uuid';

export const useProfileBuilderState = (initialConfig: any = DEFAULT_PROFILE_CONFIG) => {
    const [config, setConfig] = useState(initialConfig);
    const [selectedItem, setSelectedItem] = useState<{ type: 'section' | 'field'; id: string; sectionId?: string } | null>(null);

    // --- Section Actions ---
    const addSection = useCallback((sectionData: any = {}) => {
        const newSection = {
            id: sectionData.id || `section_${uuidv4()}`,
            title: sectionData.title || '새로운 섹션',
            description: sectionData.description || '섹션 설명을 입력하세요',
            fields: sectionData.fields || [],
            isSystem: sectionData.isSystem || false
        };

        setConfig((prev: any) => {
            const currentSections = [...prev.sections];
            if (typeof sectionData.atIndex === 'number') {
                currentSections.splice(sectionData.atIndex, 0, newSection);
            } else {
                currentSections.push(newSection);
            }
            return {
                ...prev,
                sections: currentSections
            };
        });
        setSelectedItem({ type: 'section', id: newSection.id });
    }, []);

    const updateSection = useCallback((sectionId: string, updates: any) => {
        setConfig((prev: any) => ({
            ...prev,
            sections: prev.sections.map((sec: any) =>
                sec.id === sectionId ? { ...sec, ...updates } : sec
            )
        }));
    }, []);

    const deleteSection = useCallback((sectionId: string) => {
        // Confirmation is handled in the UI
        setConfig((prev: any) => ({
            ...prev,
            sections: prev.sections.filter((sec: any) => sec.id !== sectionId)
        }));
        setSelectedItem(null);
    }, []);

    const reorderSections = useCallback((activeId: string, overId: string) => {
        setConfig((prev: any) => {
            const oldIndex = prev.sections.findIndex((s: any) => s.id === activeId);
            const newIndex = prev.sections.findIndex((s: any) => s.id === overId);

            if (oldIndex < 0 || newIndex < 0) return prev;

            const newSections = [...prev.sections];
            const [moved] = newSections.splice(oldIndex, 1);
            newSections.splice(newIndex, 0, moved);

            return { ...prev, sections: newSections };
        });
    }, []);

    // --- Field Actions ---
    const addField = useCallback((sectionId: string, fieldTemplate: any) => {
        const newField = {
            ...fieldTemplate,
            id: fieldTemplate.id === 'new' ? `field_${uuidv4()}` : fieldTemplate.id, // Generate ID if template is generic
            sectionId: sectionId // Link to parent section if needed
        };

        setConfig((prev: any) => ({
            ...prev,
            sections: prev.sections.map((sec: any) => {
                if (sec.id === sectionId) {
                    return { ...sec, fields: [...sec.fields, newField] };
                }
                return sec;
            })
        }));
        setSelectedItem({ type: 'field', id: newField.id, sectionId });
    }, []);

    const updateField = useCallback((sectionId: string, fieldId: string, updates: any) => {
        setConfig((prev: any) => ({
            ...prev,
            sections: prev.sections.map((sec: any) => {
                if (sec.id === sectionId) {
                    return {
                        ...sec,
                        fields: sec.fields.map((f: any) => f.id === fieldId ? { ...f, ...updates } : f)
                    };
                }
                return sec;
            })
        }));
    }, []);

    const deleteField = useCallback((sectionId: string, fieldId: string) => {
        setConfig((prev: any) => ({
            ...prev,
            sections: prev.sections.map((sec: any) => {
                if (sec.id === sectionId) {
                    return {
                        ...sec,
                        fields: sec.fields.filter((f: any) => f.id !== fieldId)
                    };
                }
                return sec;
            })
        }));
        setSelectedItem(null);
    }, []);

    const reorderFields = useCallback((sectionId: string, activeId: string, overId: string) => {
        setConfig((prev: any) => {
            const sectionIndex = prev.sections.findIndex((s: any) => s.id === sectionId);
            if (sectionIndex < 0) return prev;

            const section = prev.sections[sectionIndex];
            const oldIndex = section.fields.findIndex((f: any) => f.id === activeId);
            const newIndex = section.fields.findIndex((f: any) => f.id === overId);

            if (oldIndex < 0 || newIndex < 0) return prev;

            const newFields = [...section.fields];
            const [moved] = newFields.splice(oldIndex, 1);
            newFields.splice(newIndex, 0, moved);

            const newSections = [...prev.sections];
            newSections[sectionIndex] = { ...section, fields: newFields };

            return { ...prev, sections: newSections };
        });
    }, []);

    // [NEW] Move field between sections
    const moveFieldToSection = useCallback((sourceSectionId: string, targetSectionId: string, fieldId: string, overId?: string) => {
        setConfig((prev: any) => {
            const sourceIndex = prev.sections.findIndex((s: any) => s.id === sourceSectionId);
            const targetIndex = prev.sections.findIndex((s: any) => s.id === targetSectionId);

            if (sourceIndex < 0 || targetIndex < 0) return prev;

            const sourceSection = prev.sections[sourceIndex];
            const targetSection = prev.sections[targetIndex];

            // 1. Remove from source
            const fieldIndex = sourceSection.fields.findIndex((f: any) => f.id === fieldId);
            if (fieldIndex < 0) return prev;

            const fieldToMove = { ...sourceSection.fields[fieldIndex], sectionId: targetSectionId }; // Update sectionId
            const newSourceFields = [...sourceSection.fields];
            newSourceFields.splice(fieldIndex, 1);

            // 2. Insert into target
            const newTargetFields = [...targetSection.fields];
            if (overId) {
                const overIndex = newTargetFields.findIndex((f: any) => f.id === overId);
                if (overIndex >= 0) {
                    newTargetFields.splice(overIndex, 0, fieldToMove);
                } else {
                    newTargetFields.push(fieldToMove);
                }
            } else {
                newTargetFields.push(fieldToMove);
            }

            const newSections = [...prev.sections];
            newSections[sourceIndex] = { ...sourceSection, fields: newSourceFields };
            newSections[targetIndex] = { ...targetSection, fields: newTargetFields };

            return { ...prev, sections: newSections };
        });
    }, []);

    const updateConfig = useCallback((updates: any) => {
        setConfig((prev: any) => ({ ...prev, ...updates }));
    }, []);

    return {
        config,
        selectedItem,
        setSelectedItem,
        actions: {
            addSection,
            updateSection,
            deleteSection,
            reorderSections,
            addField,
            updateField,
            deleteField,
            reorderFields,
            moveFieldToSection,
            updateConfig
        }
    };
};
