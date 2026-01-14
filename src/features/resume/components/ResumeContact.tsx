"use client";

interface ResumeContactProps {
    commonData: {
        email: string;
        github: string;
        phone: string;
    };
}

export const ResumeContact = ({ commonData }: ResumeContactProps) => {
    return (
        <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">Contact</h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Email</h3>
                    <a href={`mailto:${commonData.email}`} className="text-gray-600 hover:text-black transition-colors flex items-center gap-1">
                        • {commonData.email} <span className="text-xs">↗</span>
                    </a>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">GitHub</h3>
                    <a href={commonData.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors flex items-center gap-1">
                        • {commonData.github} <span className="text-xs">↗</span>
                    </a>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">
                        • {commonData.phone}
                    </p>
                </div>
            </div>
        </section>
    );
};
