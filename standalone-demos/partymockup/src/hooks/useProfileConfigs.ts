import { useState, useCallback } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useProfileConfigs = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    // 프로필 설정 저장 (생성 또는 업데이트)
    const saveProfileConfig = useCallback(async (configId: string = 'default', configData: any) => {
        setLoading(true);
        setError(null);
        try {
            const configRef = doc(db, 'profile_configs', configId);
            const dataToSave = {
                ...configData,
                updatedAt: new Date().toISOString()
            };

            await setDoc(configRef, dataToSave, { merge: true });
            return true;
        } catch (err) {
            console.error("Error saving profile config:", err);
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // 프로필 설정 불러오기
    const getProfileConfig = useCallback(async (configId: string = 'default') => {
        setLoading(true);
        setError(null);
        try {
            const configRef = doc(db, 'profile_configs', configId);
            const docSnap = await getDoc(configRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return null;
            }
        } catch (err) {
            console.error("Error getting profile config:", err);
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        saveProfileConfig,
        getProfileConfig,
        loading,
        error
    };
};
