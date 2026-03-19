import { Metadata } from "next";
import { ResumeV2 } from "@/features/resume/components/ResumeV2";
import { VOITHRU_RESUME_DATA } from "@/features/resume/data/voithruResumeData";

export const metadata: Metadata = {
    title: "이력서",
    description: "최인규 이력서 - Voithru 지원",
};

export default function VoithruResumePage() {
    return <ResumeV2 data={VOITHRU_RESUME_DATA} targetCompany="voithru" />;
}
