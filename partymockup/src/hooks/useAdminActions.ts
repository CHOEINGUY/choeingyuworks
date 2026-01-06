import {
    approveApplicant,
    rejectApplicant,
    deleteApplicant,
    moveApplicantSession as apiMoveApplicant,
    moveUserSession as apiMoveUser,
    cancelUserParticipation as apiCancelParticipation,
    deleteFeedback as apiDeleteFeedback,
    getCheckInUser,
    confirmCheckIn,
    cancelCheckIn,
    swapUserTableNumbers,
    addSession,
    updateSession,
    deleteSession as apiDeleteSession,
    updateProfile as apiUpdateProfile,

    approvePremiumApplicant,
    rejectPremiumApplicant,
    deletePremiumApplicant
} from '../services/adminService';

export const useAdminActions = () => {

    // --- Applicant Actions ---

    const handleApproveApplicant = async (id: string) => {
        try {
            return await approveApplicant(id);
        } catch (error) {
            // Error logged in service
            return false;
        }
    };

    const handleRejectApplicant = async (id: string) => {
        try {
            return await rejectApplicant(id);
        } catch (error) {
            return false;
        }
    };

    const handleDeleteApplicant = async (id: string) => {
        try {
            return await deleteApplicant(id);
        } catch (error) {
            return false;
        }
    };

    const moveApplicantSession = async (applicantId: string, targetSessionId: string) => {
        try {
            return await apiMoveApplicant(applicantId, targetSessionId);
        } catch (error) {
            // Component should handle alert
            throw error;
        }
    };

    // --- User Actions ---

    const moveUserSession = async (userId: string, targetSessionId: string) => {
        try {
            await apiMoveUser(userId, targetSessionId);
            return true;
        } catch (error) {
            return false;
        }
    };

    const cancelUserParticipation = async (userId: string) => {
        // Confirmation is now handled by the Component
        try {
            await apiCancelParticipation(userId);
            return true;
        } catch (error) {
            console.error("Cancel failed", error);
            // Optionally throw error so component can alert
            return false;
        }
    };

    // --- Feedback Actions ---

    const deleteFeedback = async (id: string) => {
        // Confirmation is now handled by the Component
        try {
            await apiDeleteFeedback(id);
            return true;
        } catch (error) {
            return false;
        }
    };

    // --- Session Actions ---

    const deleteSession = async (sessionId: string) => {
        // Confirmation is now handled by the Component
        try {
            await apiDeleteSession(sessionId);
            return true;
        } catch (error) {
            return false;
        }
    };

    // --- Check-In Actions ---

    const handleGetCheckInUser = async (userId: string) => {
        try {
            // Alert logic moved to Component
            return await getCheckInUser(userId);
        } catch (error) {
            return null;
        }
    };

    const handleConfirmCheckIn = async (userId: string, userSessionId?: string, userGender?: string) => {
        try {
            return await confirmCheckIn(userId, userSessionId, userGender);
        } catch (error: any) {
            // Service errors should be handled by Component
            console.error(error);
            return false;
        }
    };

    return {
        approveApplicant: handleApproveApplicant,
        rejectApplicant: handleRejectApplicant,
        deleteApplicant: handleDeleteApplicant,
        moveApplicantSession,
        moveUserSession,
        cancelUserParticipation,
        deleteFeedback,
        getCheckInUser: handleGetCheckInUser,
        confirmCheckIn: handleConfirmCheckIn,
        cancelCheckIn,
        swapUserTableNumbers,
        // Profile Aliases
        updateApplicant: (id: string, updates: any) => apiUpdateProfile('users', id, updates),
        updateUser: (id: string, updates: any) => apiUpdateProfile('users', id, updates),
        updateProfile: (collectionName: string, id: string, updates: any) => apiUpdateProfile(collectionName, id, updates),

        // Premium
        approvePremiumApplicant,
        rejectPremiumApplicant,
        deletePremiumApplicant,
        updatePremiumApplicant: (id: string, updates: any) => apiUpdateProfile('premium_pool', id, updates),

        addSession,
        updateSession,
        deleteSession,

    };
};

