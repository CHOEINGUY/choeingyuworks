import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Infinity as InfinityIcon } from "lucide-react";
import { CURRENT_BRAND } from "@/config/brand";

export function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
                {/* Logo Placeholder */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex items-center gap-2">
                        <InfinityIcon className="w-6 h-6 md:w-8 md:h-8 text-[#333] stroke-[3px]" />
                        <div className="flex items-center">
                            <span className="font-bold text-xl md:text-2xl tracking-tighter text-[#333]">{CURRENT_BRAND.mainText}</span>
                            <span className="font-bold text-xl md:text-2xl tracking-tighter text-[#333]">
                                &nbsp;{CURRENT_BRAND.subText}
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Right Action */}
                <Button className="rounded-full bg-black text-white px-6 hidden md:inline-flex hover:bg-gray-800">
                    View Portfolio
                </Button>
            </div>
        </header>
    );
}
