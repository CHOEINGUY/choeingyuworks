// Resume Data Types
export interface Education {
    school: string;
    major: string;
    period: string;
}

export interface ExperienceProject {
    title: string;
    period?: string;
    details: string[];
}

export interface Experience {
    company: string;
    position: string;
    period: string;
    description: string[];
    projects?: ExperienceProject[];
}

export interface Project {
    name: string;
    period: string;
    description: string[];
}

export interface Skill {
    category: string;
    items: string[];
}

// Cohort Dashboard Types
export interface ExamEvent {
    type: "start" | "complete";
    station: string;
    currentPerson?: string;
    nextPerson?: string;
}

export interface SnsbcRoom {
    roomNum: number;
    current: string | null;
    next: string | null;
    time: string;
}

export interface StationData {
    current: string | null;
    next: string | null;
    time: string;
}

export interface BoardState {
    snsbcRooms: SnsbcRoom[];
    stations: {
        ecg: StationData;
        blood: StationData;
        physical: StationData;
    };
}

export interface PatientListItem {
    id: string;
    name: string;
    status: string;
    birth: string;
}

export interface Candidate {
    id: number;
    name: string;
    status: "Active" | "Waiting";
    prereq: boolean;
    time: string;
    reason: string;
}

// Insight Timeline Types
export interface ReflectionCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    content: string;
    color: string;
    bgColor: string;
}
