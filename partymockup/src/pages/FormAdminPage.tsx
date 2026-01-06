
import React from 'react';
import FormBuilder from '../components/admin/form/FormBuilder';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useFormAdminLogic } from '../hooks/useFormAdminLogic';
import FormAdminHeader from '../components/admin/form/FormAdminHeader';
import PageTitle from '../components/common/PageTitle';


/**
 * 폼 관리 임시 어드민 페이지
 * 기존 어드민과 분리된 독립 페이지
 */
const FormAdminPage: React.FC = () => {
    const { state, actions } = useFormAdminLogic();
    const {
        activeTab,
        loading,
        currentFormId,
        formSettings,
        questions,
        activeQuestionId,
        isResetConfirmOpen,
        saving
    } = state;
    const {
        setActiveTab,
        setCurrentFormId,
        setFormSettings,
        setQuestions,
        setActiveQuestionId,
        setIsResetConfirmOpen,
        handleReset,
        confirmReset,
        handleSave
    } = actions;

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="text-slate-500 font-medium">폼 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
            <PageTitle title="폼 관리자 | Dating App" />
            <FormAdminHeader

                currentFormId={currentFormId}
                onModeChange={setCurrentFormId}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onReset={handleReset}
                onSave={handleSave}
                saving={saving}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-0 relative">
                <div className="flex-1 h-full">
                    <FormBuilder
                        questions={questions}
                        setQuestions={setQuestions}
                        activeQuestionId={activeQuestionId}
                        setActiveQuestionId={setActiveQuestionId}
                        formSettings={formSettings}
                        setFormSettings={setFormSettings}
                        viewMode={activeTab === 'preview' ? 'preview' : 'editor'}
                        formId={currentFormId}
                    />
                </div>
            </main>

            <ConfirmDialog
                isOpen={isResetConfirmOpen}
                title="폼 초기화"
                message={`모든 커스텀 문항이 삭제되고 필수 정보(시스템)만 남습니다.\n정말 초기화하시겠습니까?`}
                confirmText="초기화"
                isDestructive={true}
                onConfirm={confirmReset}
                onCancel={() => setIsResetConfirmOpen(false)}
            />
        </div>
    );
};

export default FormAdminPage;
