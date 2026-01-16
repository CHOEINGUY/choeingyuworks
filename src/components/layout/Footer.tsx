import { useTranslations } from "next-intl";
import { CURRENT_BRAND } from "@/config/brand";

export function Footer() {
    const t = useTranslations("Footer");

    return (
        <footer className="bg-white border-t border-gray-100 py-12 mt-auto print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                {/* Brand & Copyright */}
                <div className="space-y-1">
                    <h3 className="font-bold text-lg text-gray-900 tracking-tight">{CURRENT_BRAND.logoText}</h3>
                    <p className="text-sm text-gray-500">© 2026 {CURRENT_BRAND.footer.copyrightName}. All rights reserved.</p>
                </div>

                {/* Contact & Business Info */}
                <div className="flex flex-col md:items-end space-y-1 text-sm text-gray-600">
                    <a href="mailto:chldlsrb07@gmail.com" className="hover:text-black transition-colors">
                        chldlsrb07@gmail.com
                    </a>
                    <p>{t("address")}</p>
                    {CURRENT_BRAND.footer.showBusinessInfo && (
                        <p className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded inline-block mt-1">
                            {t("businessNo")}
                        </p>
                    )}
                </div>
            </div>
        </footer>
    );
}
