import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2,
  BookOpen
} from 'lucide-react';
import { DocumentParagraph, LessonPage, UserRole } from '../types';

interface DocumentCanvasProps {
  page: LessonPage | undefined;
  currentPageNumber: number;
  totalPages: number;
  userRole: UserRole;
  heatmapEnabled: boolean;
  studentModeActiveTool: 'highlight' | 'confusion' | 'read';
  onParagraphAction: (paragraphId: string, action: 'highlight' | 'confusion' | 'question') => void;
  onSelectConfusion: (paragraph: DocumentParagraph) => void;
  currentStudentId: string;
  currentStudentName: string;
  onPageChange?: (newPage: number) => void;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  page,
  currentPageNumber,
  totalPages,
  userRole,
  heatmapEnabled,
  studentModeActiveTool,
  onParagraphAction,
  onSelectConfusion,
  currentStudentId,
  currentStudentName,
  onPageChange,
}) => {
  const [hoveredParagraphId, setHoveredParagraphId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0C0A09]">
        <div className="text-center text-[#9E9287] max-w-sm">
          <BookOpen className="w-12 h-12 text-[#4A4037] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#E8DFD5]">Page Content Unavailable</h3>
          <p className="text-xs text-[#7A6F64] mt-1">Navigate to Page 1, 2, or 3 for interactive collaborative text.</p>
        </div>
      </div>
    );
  }

  return (
    <main 
      id="center-document-canvas" 
      className={`flex-1 w-full min-w-0 overflow-y-auto bg-[#0C0A09] p-3 sm:p-6 lg:p-8 pb-28 sm:pb-12 flex flex-col items-center selection:bg-[#CCA572]/30 selection:text-[#1F1A16] relative transition-all ${
        isFullscreen ? 'max-w-none' : ''
      }`}
    >
      {/* 1. Floating Header Bar directly above the Paper */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-4 sm:mb-6 px-1 flex-shrink-0">
        {/* Empty left placeholder to balance the right icons */}
        <div className="w-16 hidden sm:block" />

        {/* Center: Page Navigation Pill `< Page 3 / 20 >` */}
        <div className="flex items-center gap-3 bg-[#1F1B17] border border-[#332B23] rounded-full px-4 py-1.5 shadow-md text-xs text-[#D8CDC1] mx-auto sm:mx-0">
          <button
            id="canvas-prev-page-btn"
            onClick={() => onPageChange && onPageChange(Math.max(1, currentPageNumber - 1))}
            disabled={currentPageNumber <= 1}
            className="text-[#9E9182] hover:text-white disabled:opacity-30 transition p-0.5"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 font-sans font-medium">
            <span className="text-[#8C8073]">Page</span>
            <span className="font-bold text-[#F7F2EC]">{currentPageNumber}</span>
            <span className="text-[#5C5248]">/</span>
            <span className="text-[#8C8073]">{totalPages}</span>
          </div>

          <button
            id="canvas-next-page-btn"
            onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPageNumber + 1))}
            disabled={currentPageNumber >= totalPages}
            className="text-[#9E9182] hover:text-white disabled:opacity-30 transition p-0.5"
            aria-label="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Maximize toggle & Purple Avatar Circle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-7 h-7 rounded-lg bg-[#1F1B17] hover:bg-[#2A241F] border border-[#332B23] flex items-center justify-center text-[#9E9182] hover:text-white transition shadow-sm"
            title={isFullscreen ? 'Exit full width' : 'Full width reading'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <div 
            className="w-7 h-7 rounded-full bg-[#6366F1] flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0"
            title={currentStudentName}
          >
            {currentStudentName.charAt(0)}
          </div>
        </div>
      </div>

      {/* 2. Main Document Paper Card: Warm Parchment Aesthetic (#FAF6EE) */}
      <div 
        id="document-page-card"
        className={`w-full ${
          isFullscreen ? 'max-w-4xl' : 'max-w-3xl'
        } bg-[#FAF6EE] border border-[#E7DFC9] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-6 sm:p-12 lg:p-14 text-[#1C1814] relative flex flex-col min-h-[640px] transition-all`}
      >
        {/* Section Eyebrow */}
        <div className="mb-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A67938] font-sans block">
            CORE READING ANALYSIS
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1814] tracking-tight font-serif mb-8 leading-snug">
          {page.sectionTitle}
        </h2>

        {/* Document Paragraphs Flow */}
        <div className="space-y-6 text-[#1C1814]">
          {page.paragraphs.map((p, idx) => {
            const hasHighlights = p.highlightCount > 0;
            const hasConfusions = p.confusionCount > 0;

            // Heatmap visual bloom styling
            let radialBloomStyle: React.CSSProperties = {};
            if (heatmapEnabled) {
              if (idx === 0) {
                // Amber/gold heat bloom as seen in the target design
                radialBloomStyle = {
                  backgroundImage:
                    'radial-gradient(circle at 35% 45%, rgba(224, 152, 48, 0.38) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(217, 140, 35, 0.32) 0%, transparent 55%)',
                };
              } else if (idx === 2 || p.confusionCount > 0) {
                // Coral/terracotta heat bloom
                radialBloomStyle = {
                  backgroundImage:
                    'radial-gradient(ellipse at 50% 50%, rgba(225, 90, 70, 0.28) 0%, transparent 70%)',
                };
              }
            }

            return (
              <div 
                key={p.id} 
                className="relative flex items-start gap-2.5 sm:gap-3.5 group"
              >
                {/* Left Margin Indicator Dot */}
                <div className="pt-2 sm:pt-2.5 flex-shrink-0 w-2.5">
                  {(hasHighlights || hasConfusions) && (
                    <span 
                      className={`block w-2 h-2 rounded-full ${
                        hasConfusions ? 'bg-[#D45B45]' : 'bg-[#C8924A]'
                      }`}
                    />
                  )}
                </div>

                {/* Paragraph Interactive Container */}
                <div
                  id={`doc-paragraph-${p.id}`}
                  onClick={() => {
                    if (userRole === 'student') {
                      if (studentModeActiveTool === 'highlight') {
                        onParagraphAction(p.id, 'highlight');
                      } else if (studentModeActiveTool === 'confusion') {
                        onParagraphAction(p.id, 'confusion');
                      } else {
                        setHoveredParagraphId(hoveredParagraphId === p.id ? null : p.id);
                      }
                    } else {
                      setHoveredParagraphId(hoveredParagraphId === p.id ? null : p.id);
                    }
                  }}
                  onMouseEnter={() => setHoveredParagraphId(p.id)}
                  onMouseLeave={() => setHoveredParagraphId(null)}
                  style={radialBloomStyle}
                  className={`flex-1 rounded-xl p-2.5 sm:p-3.5 transition-all duration-200 cursor-pointer sm:cursor-default ${
                    // Border accents matching the screenshot
                    idx === 0
                      ? 'border-l-4 border-[#C8924A] bg-[#C8924A]/[0.04]'
                      : idx === 2 || hasConfusions
                      ? 'border-l-4 border-[#D45B45] bg-[#D45B45]/[0.04]'
                      : 'border-l-4 border-transparent hover:bg-black/[0.02]'
                  }`}
                >
                  {/* Secondary lead-in or subtitle if present */}
                  {p.secondaryText && (
                    <p className="text-xs sm:text-sm font-sans font-medium text-[#7D7063] mb-1.5 leading-normal">
                      {p.secondaryText}
                    </p>
                  )}

                  {/* Paragraph heading vs body text */}
                  {p.type === 'heading' ? (
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1814] mb-2 leading-snug">
                      {p.text}
                    </h3>
                  ) : (
                    <p className="font-serif text-[#1C1814] text-[14px] sm:text-[15.5px] leading-[1.75]">
                      {p.text}
                    </p>
                  )}

                  {/* Badges / Micro-interactions row */}
                  {(hasHighlights || hasConfusions) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {/* Highlights bronze pill */}
                      {hasHighlights && (
                        <span 
                          className="bg-[#382E20] text-[#E8C58C] text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-xs"
                          title={`${p.highlightCount} students highlighted this section`}
                        >
                          <span className="font-semibold text-xs leading-none">&</span>
                          <span>{p.highlightCount} {p.highlightCount === 1 ? 'Highlight' : 'Highlights'}</span>
                        </span>
                      )}

                      {/* Confused red/coral pill */}
                      {hasConfusions && (
                        <button
                          id={`confusion-pin-${p.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectConfusion(p);
                          }}
                          className="bg-[#FBEBE8] text-[#8C3426] border border-[#EAC4BC] text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer hover:bg-[#F7DDD7] transition shadow-xs"
                          title="Click to inspect students flagging confusion on this text"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D45B45]" />
                          <span>{p.confusionCount} Confused</span>
                          <span className="text-[10px] text-[#A64535] underline ml-0.5 font-normal">Inspect</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Notification Pill Bar under Paper */}
      <div 
        id="document-canvas-bottom-strip"
        className="w-full max-w-xl mx-auto mt-6 px-5 py-2.5 rounded-xl bg-[#161311] border border-[#2B231D] text-xs text-[#9E9182] text-center shadow-lg font-sans flex items-center justify-center"
      >
        <span>No questions asked on Page {currentPageNumber} yet. Be the first to start the discussion below!</span>
      </div>
    </main>
  );
};
