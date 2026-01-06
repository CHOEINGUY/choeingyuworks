import { useState, useCallback } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useForms = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    // 폼 저장 (생성 또는 업데이트)
    const saveForm = useCallback(async (formId: string, formData: any) => {
        setLoading(true);
        setError(null);
        try {
            const formRef = doc(db, 'forms', formId);
            const dataToSave = {
                ...formData,
                updatedAt: new Date().toISOString()
            };

            await setDoc(formRef, dataToSave, { merge: true });
            return true;
        } catch (err) {
            console.error("Error saving form:", err);
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // 폼 불러오기
    const getForm = useCallback(async (formId: string) => {
        setLoading(true);
        setError(null);
        try {
            const formRef = doc(db, 'forms', formId);
            const docSnap = await getDoc(formRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return null;
            }
        } catch (err) {
            console.error("Error getting form:", err);
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        saveForm,
        getForm,
        loading,
        error
    };
};
