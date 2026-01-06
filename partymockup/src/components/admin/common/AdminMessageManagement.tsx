import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { toast } from 'sonner';
import { MessageTemplate, DEFAULT_TEMPLATES } from '../../../data/messageTemplates';

import MessageBuilderHeader from '../message_builder/MessageBuilderHeader';
import TemplateSidebar from '../message_builder/TemplateSidebar';
import MessageEditorCanvas from '../message_builder/MessageEditorCanvas';
import MessagePropertiesPanel from '../message_builder/MessagePropertiesPanel';
import ConfirmDialog from '../../common/ConfirmDialog';

interface AdminMessageManagementProps {
    isDark: boolean;
}

const AdminMessageManagement: React.FC<AdminMessageManagementProps> = () => {
    // 1. Core State
    const [templates, setTemplates] = useState<MessageTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
    const [serviceType, setServiceType] = useState<string>('PARTY'); // Default to Party

    // 2. UI State
    // const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    // const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // 3. Data Fetching
    const fetchTemplates = async () => {
        // setIsLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'message_templates'));
            const remoteDocs: any[] = [];
            querySnapshot.forEach((doc) => {
                remoteDocs.push({ id: doc.id, ...doc.data() });
            });

            // Merge Logic: Default + Remote
            const mergedDefaults = DEFAULT_TEMPLATES.map(def => {
                const remote = remoteDocs.find(r => r.id === def.id);
                if (remote) {
                    return { ...def, ...remote, serviceType: remote.serviceType || def.serviceType };
                }
                return def;
            });

            const customTemplates = remoteDocs.filter(r => !DEFAULT_TEMPLATES.find(d => d.id === r.id));
            const finalTemplates = [...mergedDefaults, ...customTemplates];

            setTemplates(finalTemplates);

            // Auto-select first one of current service type if nothing selected or current selection invalid
            if (activeTemplates(finalTemplates, serviceType).length > 0 && !selectedTemplate) {
                // setSelectedTemplate(activeTemplates(finalTemplates, serviceType)[0]);
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
            setTemplates(DEFAULT_TEMPLATES);
        } finally {
            // setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    // Helper: Filter templates by service type for effective selection logic
    const activeTemplates = (list: MessageTemplate[], type: string) => {
        return list.filter(t => type === 'ALL' || t.serviceType === type);
    };

    // When serviceType changes, clear selection if it doesn't match
    useEffect(() => {
        if (selectedTemplate && serviceType !== 'ALL' && selectedTemplate.serviceType !== serviceType) {
            setSelectedTemplate(null);
        }
    }, [serviceType]);

    // 4. Actions
    const handleCreate = () => {
        const newTemplate: MessageTemplate = {
            id: `CUSTOM_${Date.now()}`, // Temporary ID
            title: '새로운 메세지',
            content: '',
            category: 'ETC',
            serviceType: serviceType === 'ALL' ? 'COMMON' : serviceType,
            lastUpdated: Date.now(),
            // @ts-ignore
            isNew: true
        };
        setTemplates([newTemplate, ...templates]);
        setSelectedTemplate(newTemplate);
    };

    const handleUpdate = (updates: Partial<MessageTemplate>) => {
        if (!selectedTemplate) return;
        const updated = { ...selectedTemplate, ...updates };
        setSelectedTemplate(updated);
        setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
    };

    const handleSave = async () => {
        if (!selectedTemplate) return;

        try {
            setIsSaving(true);
            const dataToSave = {
                ...selectedTemplate,
                lastUpdated: Date.now()
            };
            // Remove helper flags if any
            // @ts-ignore
            delete dataToSave.isNew;

            await setDoc(doc(db, 'message_templates', selectedTemplate.id), dataToSave);

            // Update local state to remove 'isNew' flag
            setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? dataToSave : t));
            setSelectedTemplate(dataToSave);

            toast.success('저장되었습니다.');
        } catch (error) {
            console.error("Save error:", error);
            toast.error('저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedTemplate) return;

        try {
            await deleteDoc(doc(db, 'message_templates', selectedTemplate.id));
            const remaining = templates.filter(t => t.id !== selectedTemplate.id);
            setTemplates(remaining);
            setSelectedTemplate(null);
            toast.success('삭제되었습니다.');
        } catch (error) {
            // Local delete if not saved yet
            const remaining = templates.filter(t => t.id !== selectedTemplate.id);
            setTemplates(remaining);
            setSelectedTemplate(null);
        }
        setIsDeleteDialogOpen(false);
    };

    const handleReset = async () => {
        try {
            setIsSaving(true);
            const batchPromises = DEFAULT_TEMPLATES.map(t =>
                setDoc(doc(db, 'message_templates', t.id), { ...t, lastUpdated: Date.now() })
            );
            await Promise.all(batchPromises);
            await fetchTemplates();
            toast.success('모든 기본 템플릿이 복구되었습니다.');
        } catch (err) {
            toast.error('초기화 실패');
        } finally {
            setIsSaving(false);
            setIsResetDialogOpen(false);
        }
    };

    const insertVariable = (variable: string) => {
        if (!selectedTemplate) return;
        // Append to end if we can't find cursor easily, or just append
        // Ideally we grab ref from Canvas, but for now append is safe
        const newContent = selectedTemplate.content + variable;
        handleUpdate({ content: newContent });
    };

    // 5. Render
    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
            <MessageBuilderHeader
                serviceType={serviceType}
                setServiceType={setServiceType}
                onSave={handleSave}
                onReset={() => setIsResetDialogOpen(true)}
                isSaving={isSaving}
            />

            <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left: Sidebar */}
                <TemplateSidebar
                    templates={templates}
                    selectedTemplate={selectedTemplate}
                    onSelect={setSelectedTemplate}
                    onCreate={handleCreate}
                    serviceType={serviceType}
                />

                {/* Center: Canvas */}
                <MessageEditorCanvas
                    template={selectedTemplate}
                    onChange={handleUpdate}
                />

                {/* Right: Properties */}
                <MessagePropertiesPanel
                    template={selectedTemplate}
                    onChange={handleUpdate}
                    onInsertVariable={insertVariable}
                    onDelete={() => setIsDeleteDialogOpen(true)}
                    serviceType={serviceType}
                />
            </div>


            <ConfirmDialog
                isOpen={isResetDialogOpen}
                title="기본 템플릿 초기화"
                message="모든 템플릿을 초기 기본값으로 되돌립니다.\n커스텀 변경사항이 사라질 수 있습니다. 진행하시겠습니까?"
                confirmText="초기화"
                isDestructive
                onConfirm={handleReset}
                onCancel={() => setIsResetDialogOpen(false)}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                title="템플릿 삭제"
                message={`'${selectedTemplate?.title}' 템플릿을 정말 삭제하시겠습니까?`}
                confirmText="삭제"
                isDestructive
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteDialogOpen(false)}
            />
        </div>
    );
};

export default AdminMessageManagement;
