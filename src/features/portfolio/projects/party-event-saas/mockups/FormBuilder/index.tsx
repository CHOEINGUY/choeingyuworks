import React from 'react';
import { motion } from "framer-motion";
import { MockHeader } from './MockHeader';
import { MockToolbar } from './MockToolbar';
import { EditorView } from './EditorView';
import { PreviewView } from './PreviewView';

export function FormBuilderMockup() {
    const [loopKey, setLoopKey] = React.useState(0);
    const [viewMode, setViewMode] = React.useState<'editor' | 'preview'>('editor');
    const [subTab, setSubTab] = React.useState<'style' | 'color'>('style');
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [themeKey, setThemeKey] = React.useState(0);

    // Unified Demo Sequence: Editor (8s) -> Preview (7.5s) -> Loop
    React.useEffect(() => {
        let isMounted = true;
        
        const runDemoLoop = async () => {
            while (isMounted) {
                // --- Editor Phase (8 seconds) ---
                setViewMode('editor');
                setLoopKey(prev => prev + 1);
                await new Promise(r => setTimeout(r, 8000));
                
                if (!isMounted) break;
                
                // --- Preview Phase (7.5 seconds total) ---
                setViewMode('preview');
                
                // 1. Style Tab Appearance (2.5s)
                setSubTab('style');
                setIsDarkMode(false);
                setThemeKey(prev => prev + 1);
                await new Promise(r => setTimeout(r, 2500));
                
                if (!isMounted) break;
                
                // 2. Switch to Color Tab & Dark Mode (2.5s)
                setSubTab('color');
                setIsDarkMode(true);
                setThemeKey(prev => prev + 1);
                await new Promise(r => setTimeout(r, 2500));
                
                if (!isMounted) break;
                
                // 3. Switch back to Light Mode (2.5s)
                setIsDarkMode(false);
                setThemeKey(prev => prev + 1);
                await new Promise(r => setTimeout(r, 2500));
                
                if (!isMounted) break;
                
                // End of loop - back to editor
            }
        };

        runDemoLoop();
        
        return () => { isMounted = false; };
    }, []);

    return (
        <motion.div
            className="w-full relative p-2 md:p-3 rounded-[1.5rem] bg-[#FFF5F8] border border-white/50 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            {/* Browser Window Wrapper for Scaling */}
            <div className="relative w-full h-[350px] md:h-auto md:aspect-auto">
                {/* Browser Window (Scaled on Mobile) */}
                <div className="absolute inset-0 w-[160%] h-[160%] origin-top-left scale-[0.625] md:static md:w-full md:h-auto md:scale-100 md:transform-none md:aspect-[16/10] bg-white rounded-lg shadow-xl border border-slate-200/50 flex flex-col overflow-hidden relative z-10 font-sans">

                {/* Browser Chrome (Header) */}
                <div className="h-10 bg-gray-50/50 border-b border-slate-100 flex items-center px-4 justify-center relative shrink-0">

                    <div className="bg-white px-6 py-1 rounded-full border border-slate-100 text-[10px] text-slate-400 font-medium tracking-tight flex items-center gap-1.5 shadow-sm">
                        <span className="opacity-50 select-none">https://</span>
                        admin.partysaas.com/form/design
                    </div>
                </div>

                {/* App Header */}
                <MockHeader viewMode={viewMode} onViewModeChange={setViewMode} />

                {/* Main Layout */}
                {viewMode === 'editor' ? (
                    <div className="flex flex-1 overflow-hidden relative">
                        <EditorView loopKey={loopKey} />
                        <MockToolbar />
                    </div>
                ) : (
                    <PreviewView 
                        themeKey={themeKey} 
                        isDarkMode={isDarkMode} 
                        subTab={subTab}
                        onSubTabChange={setSubTab}
                    />
                )}
             </div>
            </div>
        </motion.div>
    );
}
