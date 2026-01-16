import { motion } from "framer-motion";
import {
    FormInput,
    QrCode,
    BarChart4,
    Bell,
    Check,
    ToggleRight
} from "lucide-react";
import { useTranslations } from "next-intl";

const TOOL_CONFIG = [
    {
        id: "builder",
        icon: FormInput,
        visual: (
            <div className="w-full h-full bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400">Question Type</span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Select</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500">Required?</span>
                    <ToggleRight className="w-5 h-5 text-blue-500" />
                </div>
                <div className="mt-auto w-full py-1.5 bg-blue-600 rounded text-center text-[10px] font-bold text-white shadow-sm">
                    + Add Field
                </div>
            </div>
        )
    },
    {
        id: "qr",
        icon: QrCode,
        visual: (
            <div className="w-full h-full bg-gray-900 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-32 h-1 bg-blue-500 absolute top-0 left-0 animate-[scan_2s_ease-in-out_infinite]" />
                <QrCode className="w-12 h-12 text-white/20 mb-3" />
                <div className="bg-green-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-green-500/50 flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] text-green-400 font-bold">Checked In</span>
                </div>
            </div>
        )
    },
    {
        id: "dashboard",
        icon: BarChart4,
        visual: (
            <div className="w-full h-full bg-white border border-gray-100 rounded-xl p-3 flex flex-col gap-2 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 pb-2 border-b border-gray-50">
                    <span>Status</span>
                    <span>Count</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">Active</span>
                    <span className="text-xs font-bold text-gray-800">142</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold">Pending</span>
                    <span className="text-xs font-bold text-gray-400">18</span>
                </div>
                <div className="mt-auto h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-blue-500 rounded-full" />
                </div>
            </div>
        )
    },
    {
        id: "notification",
        icon: Bell,
        visual: (
            <div className="w-full h-full bg-[#f0f2f5] rounded-xl p-3 flex flex-col gap-2 relative">
                <div className="bg-white p-2 rounded-tl-lg rounded-tr-lg rounded-br-lg shadow-sm text-[10px] text-gray-600 max-w-[90%]">
                    💸 입금이 확인되었습니다.
                </div>
                <div className="bg-white p-2 rounded-tl-lg rounded-tr-lg rounded-br-lg shadow-sm text-[10px] text-gray-600 max-w-[90%] ml-auto bg-blue-500 text-white">
                    💌 매칭 결과가 도착했습니다!
                </div>
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </div>
        )
    }
];

export function DetailedFeatures() {
    const t = useTranslations("PartySaaS.Tools");

    const tools = TOOL_CONFIG.map(config => ({
        ...config,
        title: t(`${config.id}.title`),
        description: t(`${config.id}.desc`)
    }));

    return (
        <section className="py-24 px-6 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col mb-16 items-center text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        {t('sectionTitle')}
                    </h2>
                    <p className="text-gray-600 text-lg break-keep leading-relaxed max-w-2xl">
                        {t('sectionDesc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tools.map((tool, idx) => (
                        <motion.div
                            key={tool.id}
                            className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center group hover:shadow-xl hover:border-blue-100 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            {/* Text Content */}
                            <div className="flex-1 text-left">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <tool.icon className="w-5 h-5 text-gray-500 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{tool.title}</h3>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed break-keep">
                                    {tool.description}
                                </p>
                            </div>

                            {/* Visual Content */}
                            <div className="w-full md:w-48 h-40 rounded-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                                {tool.visual}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
