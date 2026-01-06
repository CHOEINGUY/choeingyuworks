import { useState, useMemo } from 'react';
import { PremiumMember } from '../types/premium';
import { getAge } from '../utils/ageUtils';

interface FilterState {
    minAge: string;
    maxAge: string;
    location: string;
    job: string;
    drinking: string;
    smoking: string;
}

export const usePremiumMemberFilter = (applicants: PremiumMember[], wbItems: PremiumMember[]) => {
    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [isSmartMatch, setIsSmartMatch] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        minAge: '',
        maxAge: '',
        location: '',
        job: '',
        drinking: '',
        smoking: ''
    });
    const [sortBy, setSortBy] = useState('newest');

    // Helper: Get Field Value
    const getFieldValue = (user: PremiumMember, key: string): any => {
        if ((user as any)[key]) return (user as any)[key];
        if (user.answers && user.answers[key]) return user.answers[key];
        return '';
    };

    // Derived State (Filtered List)
    const filteredMembers = useMemo(() => {
        // Start with approved members
        let result = applicants;

        const maleTarget = wbItems.find(i => i.gender === 'M'); // Target for Females
        const femaleTarget = wbItems.find(i => i.gender === 'F'); // Target for Males

        // 1. Search
        if (searchTerm) {
            const low = searchTerm.toLowerCase();
            result = result.filter(m =>
                (m.name && m.name.toLowerCase().includes(low)) ||
                (m.location && m.location.includes(low))
            );
        }

        // 2. Filters
        if (filters.minAge) result = result.filter(m => {
            const age = getAge(m);
            return typeof age === 'number' && age >= parseInt(filters.minAge);
        });
        if (filters.maxAge) result = result.filter(m => {
            const age = getAge(m);
            return typeof age === 'number' && age <= parseInt(filters.maxAge);
        });
        if (filters.location) result = result.filter(m => m.location && m.location.includes(filters.location));
        if (filters.job) result = result.filter(m => m.job && m.job.includes(filters.job));

        // Lifestyle Filters
        if (filters.drinking) {
            result = result.filter(m => {
                const val = getFieldValue(m, 'drinking');
                // Binary Logic: 'none' vs 'drinker' (everything else)
                const isNonDrinker = val === 'none' || val === '못함' || val === '비음주';

                if (filters.drinking === 'none') return isNonDrinker;
                if (filters.drinking === 'drinker') return !isNonDrinker;
                return true;
            });
        }
        if (filters.smoking) {
            result = result.filter(m => {
                const val = getFieldValue(m, 'smoking');
                // Robust Match: English code or Korean text
                if (filters.smoking === 'no') return val === 'no' || val === '비흡연';
                if (filters.smoking === 'yes') return val === 'yes' || val === '흡연';
                return true;
            });
        }

        // 3. Smart Match Logic (Strict Filter)
        if (isSmartMatch) {
            result = result.filter(m => {
                const isMale = m.gender === 'M';
                const target = isMale ? femaleTarget : maleTarget;

                // If no target opposite gender is selected, show everyone (or keep standard filters)
                if (!target) return true;

                // Example Smart Rules (Inverted Logic based on preferences of the TARGET)
                // e.g. If Target hates smoking, filter out smokers
                const targetHatesSmoking = getFieldValue(target, 'smoking_preference') === 'nosmoke';
                if (targetHatesSmoking) {
                    const mySmoking = getFieldValue(m, 'smoking');
                    if (mySmoking === 'yes') return false;
                }

                // Add more smart rules here
                return true;
            });
        }

        // 4. Sorting
        return result.sort((a, b) => {
            if (sortBy === 'newest') {
                return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
            }
            if (sortBy === 'ageAsc') {
                const ageA = getAge(a);
                const ageB = getAge(b);
                const valA = typeof ageA === 'number' ? ageA : 999;
                const valB = typeof ageB === 'number' ? ageB : 999;
                return valA - valB;
            }
            if (sortBy === 'ageDesc') {
                const ageA = getAge(a);
                const ageB = getAge(b);
                const valA = typeof ageA === 'number' ? ageA : -1;
                const valB = typeof ageB === 'number' ? ageB : -1;
                return valB - valA;
            }
            return 0;
        });

    }, [applicants, searchTerm, filters, sortBy, isSmartMatch, wbItems]);

    return {
        filteredMembers,
        searchTerm, setSearchTerm,
        isSmartMatch, setIsSmartMatch,
        isFilterOpen, setIsFilterOpen,
        filters, setFilters,
        sortBy, setSortBy
    };
};
