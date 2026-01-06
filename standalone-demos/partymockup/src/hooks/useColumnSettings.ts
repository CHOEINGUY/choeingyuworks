import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Hook to manage and persist column settings (visibility and order) to Firestore.
 */
export const useColumnSettings = (
    settingKey: string,
    defaultVisibleColumns: Set<string>,
    collectionName: string = 'settings',
    docId: string = 'admin_preferences'
) => {
    // State structure matches the existing implementation
    const [settings, setSettings] = useState<{
        visible: Set<string>;
        order: string[];
    }>({
        visible: defaultVisibleColumns,
        order: []
    });

    // Helper to save to Firestore
    const saveToFirestore = async (newSettings: { visible: Set<string>; order: string[] }) => {
        console.log(`[useColumnSettings] Attempting to save ${settingKey}...`, newSettings);
        try {
            const docRef = doc(db, collectionName, docId);
            await setDoc(docRef, {
                [settingKey]: {
                    visible: Array.from(newSettings.visible),
                    order: newSettings.order
                }
            }, { merge: true });
            console.log(`[useColumnSettings] Successfully saved ${settingKey}`);
        } catch (e) {
            console.error(`[useColumnSettings] Failed to save column settings (${settingKey}) to Firebase`, e);
        }
    };

    // Load settings from Firebase on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const docRef = doc(db, collectionName, docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const saved = data[settingKey];
                    if (saved) {
                        setSettings({
                            visible: saved.visible ? new Set(saved.visible) : defaultVisibleColumns,
                            order: saved.order || []
                        });
                    }
                }
            } catch (e) {
                console.error(`Failed to load column settings (${settingKey}) from Firebase`, e);
            }
        };
        loadSettings();
    }, [settingKey, collectionName, docId]); // Depend on key/doc to allow reuse

    // Public setter for Visible Columns
    const setVisibleColumns = (newSet: Set<string>) => {
        setSettings(prev => {
            const newState = { ...prev, visible: newSet };
            saveToFirestore(newState);
            return newState;
        });
    };

    // Public setter for Column Order
    const setColumnOrder = (newOrder: string[]) => {
        setSettings(prev => {
            const newState = { ...prev, order: newOrder };
            saveToFirestore(newState);
            return newState;
        });
    };

    return {
        visibleColumnIds: settings.visible,
        columnOrder: settings.order,
        setVisibleColumns,
        setColumnOrder
    };
};
