import {
  Undo2, Redo2, Filter, CheckCircle2, Clock,
  FileDown, FileText, Copy, RefreshCw, Trash2, Upload,
} from "lucide-react";

export function GridToolbar() {
  return (
    <div
      className="w-full bg-white flex items-center px-2 shrink-0 z-10 relative border-b border-[#d3d3d3] gap-2"
      style={{ minHeight: "40px" }}
    >
      {/* Cell Info */}
      <div className="flex items-center h-full mr-1 pr-1 border-r border-[#d3d3d3] py-1 flex-1 min-w-0">
        <span className="px-3 text-[14px] text-black">A1</span>
        <span className="px-1 text-[#5f6368] text-[12px]">▼</span>
        <div className="h-[60%] w-[1px] bg-gray-300 mx-2" />
        <span className="px-2 text-[15px] font-medium italic text-gray-500 font-serif">fx</span>
        <div className="flex items-center h-full px-2 text-[14px] text-gray-800 flex-1 outline-none" />
        <div className="flex items-center gap-1 ml-2">
          <button className="w-7 h-7 flex items-center justify-center rounded text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#1a73e8] disabled:opacity-50 transition-colors">
            <Undo2 size={18} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#1a73e8] disabled:opacity-50 transition-colors">
            <Redo2 size={18} />
          </button>
        </div>
      </div>

      {/* Action Groups */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="flex items-center gap-1.5 px-2 h-[32px] rounded hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#1a73e8] transition-colors">
          <Filter size={18} />
          <span className="text-[14px]">필터</span>
        </button>
        <div className="w-[1px] h-[32px] bg-[#e0e0e0]" />

        <div className="flex gap-0.5">
          <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="확진여부">
            <CheckCircle2 size={18} />
            <span className="text-[14px]">확진여부</span>
          </button>
          <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="노출시간">
            <Clock size={18} />
            <span className="text-[14px]">노출시간</span>
          </button>
        </div>
        <div className="w-[1px] h-[32px] bg-[#e0e0e0]" />

        <div className="flex gap-0.5">
          <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="엑셀 업로드">
            <Upload size={18} />
          </button>
          <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="서식 다운로드">
            <FileText size={18} />
            <span className="text-[14px] hidden xl:inline">서식</span>
          </button>
          <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="내보내기">
            <FileDown size={18} />
            <span className="text-[14px] hidden xl:inline">내보내기</span>
          </button>
        </div>
        <div className="w-[1px] h-[32px] bg-[#e0e0e0]" />

        <div className="flex gap-0.5">
          <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="전체 복사">
            <Copy size={18} />
            <span className="text-[14px] hidden xl:inline">복사</span>
          </button>
          <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="빈 열 삭제">
            <Trash2 size={18} />
            <span className="text-[14px] hidden xl:inline">삭제</span>
          </button>
          <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="초기화">
            <RefreshCw size={18} />
            <span className="text-[14px] hidden xl:inline">초기화</span>
          </button>
        </div>
      </div>
    </div>
  );
}
