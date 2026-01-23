import { ResumeV2 } from "@/features/resume/components/ResumeV2";
import { JAEIL_RESUME_DATA } from "@/features/resume/data/jaeilResumeData";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "이력서 (Jaeil Solution Tech)",
    description: "Jaeil Solution Tech 맞춤형 이력서입니다.",
};

export default function SolutecResumePage() {
    return <ResumeV2 data={JAEIL_RESUME_DATA} />;
}
