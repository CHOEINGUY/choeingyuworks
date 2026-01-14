"use client";

import { useTranslations } from "next-intl";

interface ResumeContactProps {
    commonData: {
        email: string;
        github: string;
        phone: string;
    };
}

export const ResumeContact = ({ commonData }: ResumeContactProps) => {
    const t = useTranslations("Resume");

    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">{t('contact')}</h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Email</h3>
                    <ul className="list-disc list-outside ml-4 marker:text-gray-400">
                        <li className="pl-1">
                            <a href={`mailto:${commonData.email}`} className="text-gray-600 hover:text-black transition-colors">
                                {commonData.email} <span className="text-xs">↗</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">GitHub</h3>
                    <ul className="list-disc list-outside ml-4 marker:text-gray-400">
                        <li className="pl-1">
                            <a href={commonData.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">
                                {commonData.github} <span className="text-xs">↗</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Phone</h3>
                    <ul className="list-disc list-outside ml-4 marker:text-gray-400">
                        <li className="pl-1 text-gray-600">
                            {commonData.phone}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};
