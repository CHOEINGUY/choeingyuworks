import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CheckinPayload {
    checked_in: boolean;
    redirect_url: string;
}

export function useRealtimeCheckin(
    userId: string | undefined,
    onCheckin: (redirectUrl: string) => void
) {
    useEffect(() => {
        if (!userId) return;

        // Determine table based on URL
        const path = window.location.pathname;
        const tableName = path.includes('/d') ? 'guests_daegu' : 'guests_busan';

        const channel = supabase
            .channel(`checkin-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: tableName,
                    filter: `id=eq.${userId}`,
                },
                (payload) => {
                    const newData = payload.new as CheckinPayload;
                    if (newData.checked_in && newData.redirect_url) {
                        // Notify parent instead of executing logic directly
                        onCheckin(newData.redirect_url);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, onCheckin]);
}
