import React, { useRef, useEffect } from "react";
import { GridToolbar } from "./GridToolbar";
import { GridRow } from "./GridRow";

interface Props {
  isActive?: boolean;
}

const GRID_COLS = (
  <colgroup>
    <col style={{ width: "50px" }} />
    <col style={{ width: "80px" }} />
    <col style={{ width: "80px" }} />
    <col style={{ width: "60px" }} />
    <col style={{ width: "60px" }} />
    <col style={{ width: "70px" }} />
    <col style={{ width: "70px" }} />
    <col style={{ width: "70px" }} />
    <col style={{ width: "140px" }} />
    <col style={{ width: "60px" }} />
    <col style={{ width: "60px" }} />
    <col style={{ width: "60px" }} />
    <col style={{ width: "60px" }} />
    <col style={{ width: "60px" }} />
    <col style={{ width: "60px" }} />
    <col style={{ width: "60px" }} />
    <col style={{ width: "60px" }} />
    <col style={{ width: "60px" }} />
    <col style={{ width: "auto" }} />
  </colgroup>
);

export function AuthenticGridContent({ isActive }: Props) {
  const gridBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = gridBodyRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number = 0;
    const targetScrollTop = 150;
    const scrollSpeed = 0.5;

    const animateScroll = () => {
      if (!isActive) return;
      const currentScrollTop = scrollContainer.scrollTop;
      if (currentScrollTop < targetScrollTop) {
        const nextScrollTop = Math.min(currentScrollTop + scrollSpeed, targetScrollTop);
        scrollContainer.scrollTop = nextScrollTop;
        if (nextScrollTop < targetScrollTop) {
          animationFrameId = requestAnimationFrame(animateScroll);
        }
      }
    };

    if (isActive) {
      if (scrollContainer.scrollTop === 0) {
        const timer = setTimeout(() => {
          animationFrameId = requestAnimationFrame(animateScroll);
        }, 800);
        return () => clearTimeout(timer);
      } else {
        animationFrameId = requestAnimationFrame(animateScroll);
      }
    } else {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    }

    return () => { if (animationFrameId) cancelAnimationFrame(animationFrameId); };
  }, [isActive]);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative font-sans">
      <GridToolbar />

      {/* Grid Header */}
      <div className="flex-none relative z-10 bg-slate-50 border-b border-gray-300 shadow-sm overflow-hidden select-none">
        <table className="w-full border-collapse table-fixed">
          {GRID_COLS}
          <thead>
            <tr className="h-[35px]">
              <th rowSpan={2} className="border border-slate-300 bg-slate-100 text-center text-[12px] font-semibold text-slate-700">연번</th>
              <th rowSpan={2} className="border border-slate-300 bg-slate-50 text-center text-[11px] font-medium text-slate-600 leading-tight px-1">환자여부<br />(1/0)</th>
              <th rowSpan={2} className="border border-slate-300 bg-slate-50 text-center text-[11px] font-medium text-slate-600 leading-tight px-1">확진여부<br />(1/0)</th>
              <th colSpan={2} className="border border-slate-300 bg-slate-100 text-center text-[12px] font-medium text-slate-600">기본정보</th>
              <th colSpan={3} className="border border-slate-300 bg-red-50 text-center text-[12px] font-bold text-red-600 leading-tight">임상증상</th>
              <th rowSpan={2} className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">증상발현시간</th>
              <th colSpan={9} className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600 relative group leading-tight">
                식단(1/0)
                <div className="absolute top-1/2 left-1.5 -translate-y-1/2 flex gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button className="w-[16px] h-[16px] flex items-center justify-center bg-white border border-slate-300 rounded text-[10px] hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400">+</button>
                </div>
              </th>
              <th rowSpan={2} className="border border-slate-300 bg-slate-50" />
            </tr>
            <tr className="h-[35px]">
              <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">grade</th>
              <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">class</th>
              <th className="border border-slate-300 bg-red-50/50 text-center text-[12px] font-medium text-red-600">diarrhea</th>
              <th className="border border-slate-300 bg-red-50/50 text-center text-[12px] font-medium text-red-600">vomit</th>
              <th className="border border-slate-300 bg-red-50/50 text-center text-[12px] font-medium text-red-600">fever</th>
              {["rice","soup","pork","kimchi","radish","bean_sprout","spinach","milk","yogurt"].map(col => (
                <th key={col} className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">{col}</th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Grid Body */}
      <div ref={gridBodyRef} className="flex-1 bg-slate-50 relative overflow-hidden overflow-y-auto no-scrollbar">
        <table className="w-full border-collapse table-fixed bg-white">
          {GRID_COLS}
          <tbody>
            {Array.from({ length: 40 }).map((_, i) => (
              <GridRow key={i} index={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
