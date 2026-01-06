import React from 'react';
import SelectionForm from '../SelectionForm';
import WaitingScreen from '../WaitingScreen';
import { User } from '../../types';

interface SessionSelectionViewProps {
    isSelectionDone: boolean;
    onSubmitSelection: (selectedIds: string[]) => Promise<void>;
    onSelectionChange: (isReady: boolean) => void;
    feedbackData: Record<string, any>;
    myGender?: 'M' | 'F' | string;
    usersData: Record<string, User> | null;
    userId: string;
}

const SessionSelectionView: React.FC<SessionSelectionViewProps> = ({
    isSelectionDone,
    onSubmitSelection,
    onSelectionChange,
    feedbackData,
    myGender,
    usersData,
    userId
}) => {
    if (isSelectionDone) {
        return <WaitingScreen gender={myGender || ''} />;
    }

    return (
        <div key="selection" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SelectionForm
                onSubmit={(ids) => { onSubmitSelection(ids).catch(console.error); }}
                onSelectionChange={onSelectionChange}
                feedbackData={feedbackData}
                gender={myGender}
                usersData={(usersData || undefined) as Record<string, User> | undefined}
                currentUserId={userId}
            />
        </div>
    );
};

export default SessionSelectionView;
