import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Flame, 
  Copy, 
  Check, 
  ArrowRightLeft, 
  Send, 
  X,
} from 'lucide-react';
import { SessionState, StudentUser } from '../types';

interface TeacherPanelProps {
  sessionState: SessionState;
  onTogglePlayPause: () => void;
  onToggleHeatmap: () => void;
  onToggleForceSync: () => void;
  onForceSyncToCurrentPage: () => void;
  onBroadcastMessage: (msg: string) => void;
  students: StudentUser[];
  currentPageConfusionCount: number;
  currentPageNumber: number;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({
  sessionState,
  onTogglePlayPause,
  onToggleHeatmap,
  onToggleForceSync,
  onForceSyncToCurrentPage,
  onBroadcastMessage,
  students,
  currentPageConfusionCount,
  currentPageNumber,
  isMobileDrawer = false,
  onCloseMobile,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [questionInput, setQuestionInput] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://readsync.app/room/${sessionState.roomCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    onBroadcastMessage(questionInput.trim());
    setQuestionInput('');
  };

  return (
    <div 
      id="teacher-right-panel"
      className={`${
        isMobileDrawer
          ? 'w-full h-full'
          : 'h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-80 lg:w-[350px] border-l border-[#26201B]'
      } bg-[#161311] flex flex-col flex-shrink-0 text-[#E8DFD5] relative justify-between select-none`}
    >
      {/* Scrollable upper content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mobile close button if opened as drawer */}
        {isMobileDrawer && onCloseMobile && (
          <div className="flex justify-between items-center pb-2 border-b border-[#26201B]">
            <span className="text-xs font-bold text-[#D47E53] uppercase tracking-wider">Teacher Controls</span>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[#9E9287] hover:text-white hover:bg-[#231E1B]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. User Profile Header & Invite URL Box */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-3">
            {/* Purple circle avatar */}
            <div className="w-10 h-10 rounded-full bg-[#6366F1] flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[#F7F2EC] leading-tight truncate">
                Alex Rivera
              </h3>
              <p className="text-xs text-[#8E8377] leading-tight mt-0.5">
                connected to room
              </p>
            </div>
          </div>

          {/* Invite URL row */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#1C1815] border border-[#2D2620] text-xs text-[#9E9287]">
            <span className="truncate pr-2 font-mono text-[11px] text-[#A6998C]">
              Invite URL: readsync.app/r/{sessionState.roomCode}
            </span>
            <button
              onClick={handleCopyLink}
              className="p-1 text-[#9E9287] hover:text-[#EDE5DC] transition flex-shrink-0 rounded"
              title="Copy invite URL"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 2. Section: Teacher Control Center */}
        <div className="pt-2">
          {/* Section header dot */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#D47E53]">
              TEACHER CONTROL CENTER
            </h4>
          </div>

          {/* Primary Action Button: Active Session */}
          <button
            id="teacher-active-session-btn"
            onClick={onTogglePlayPause}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md ${
              sessionState.isPaused
                ? 'bg-[#29221C] text-[#E5D7C7] border border-[#3E332A] hover:bg-[#342B24]'
                : 'bg-[#A24E26] hover:bg-[#8F3E1B] text-white shadow-[#A24E26]/20'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${sessionState.isPaused ? 'bg-amber-400' : 'bg-white'}`} />
            <span>{sessionState.isPaused ? 'Resume Session' : 'Active Session'}</span>
          </button>

          {/* Two-button secondary controls */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              id="teacher-pause-session-btn"
              onClick={onTogglePlayPause}
              className="py-2 px-3 rounded-xl bg-[#231E1B] hover:bg-[#2C2622] border border-[#342C25] text-[#D8CDC1] text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              {sessionState.isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Session</span>
                </>
              )}
            </button>

            <button
              id="teacher-force-sync-btn"
              onClick={onForceSyncToCurrentPage}
              className="py-2 px-3 rounded-xl bg-[#231E1B] hover:bg-[#2C2622] border border-[#342C25] text-[#D8CDC1] text-xs font-medium flex items-center justify-center gap-1.5 transition"
              title={`Sync all students to Page ${currentPageNumber}`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Force Page Sync</span>
            </button>
          </div>

          {/* Heatmap Active Row */}
          <div className="flex items-center justify-between mt-3 px-3 py-2.5 rounded-xl bg-[#1C1815] border border-[#2D2620]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#301E17] text-[#E0653B] flex items-center justify-center">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-[#EDE5DC]">
                Heatmap Active
              </span>
            </div>

            {/* Toggle switch */}
            <button
              id="teacher-heatmap-toggle"
              onClick={onToggleHeatmap}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                sessionState.heatmapEnabled ? 'bg-[#A24E26]' : 'bg-[#38312B]'
              }`}
              title="Toggle friction heatmap overlay"
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white transition-transform shadow ${
                  sessionState.heatmapEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 3. Section: Connected Students */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#C8BEB3]">
              Connected Students ({students.length})
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              All Online
            </span>
          </div>

          {/* Student items list */}
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {students.map((student, idx) => (
              <div
                key={`${student.id}-${idx}`}
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-[#1E1916] transition text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  >
                    {student.name.charAt(0)}
                  </div>
                  <span className="font-medium text-[#EDE4DA]">
                    {student.name}
                  </span>
                </div>

                {/* Page badge with status dot */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#A89C8F] bg-[#1E1916] border border-[#2D2620] px-2 py-0.5 rounded-md">
                  <span>P.{student.currentPage}</span>
                  <span 
                    className={`w-1.5 h-1.5 rounded-full ${
                      idx === 0 ? 'bg-[#D45B45]' : idx % 2 === 0 ? 'bg-amber-400' : 'bg-[#CCA572]'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Input Bar: Ask a question on Page X */}
      <div className="p-3 border-t border-[#26201B] bg-[#161311] flex-shrink-0">
        <form onSubmit={handleSendQuestion} className="relative flex items-center">
          <input
            id="teacher-bottom-question-input"
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder={`Ask a question on Page ${currentPageNumber}...`}
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#1C1815] border border-[#2E2620] text-xs text-[#EDE5DC] placeholder-[#7D7164] focus:outline-none focus:border-[#CCA572]"
          />
          <button
            type="submit"
            disabled={!questionInput.trim()}
            className="absolute right-2.5 p-1 text-[#A69B8E] hover:text-[#CCA572] disabled:opacity-30 transition"
            title="Post question"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
