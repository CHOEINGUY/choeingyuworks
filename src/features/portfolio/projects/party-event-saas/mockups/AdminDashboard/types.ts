// Shared types for AdminDashboardMockup components

export interface MockGuest {
    id: string;
    name: string;
    age: number;
    phone: string;
    gender: 'M' | 'F';
    status: 'pending' | 'approved';
    inviteSent: boolean;
    paymentStatus: 'pending' | 'confirmed' | 'none';
    isNew?: boolean;
}

export interface DemoState {
    guests: MockGuest[];
    selectedGuest: MockGuest | null;
    selectedCheckIds: string[];
    showToast: boolean;
    toastMessage: string;
    loadingDockAction: boolean;
    msgSelectModalOpen: boolean;
}
