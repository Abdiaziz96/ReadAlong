import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  User, 
  Download, 
  Copy, 
  Check, 
  Radio, 
  Wifi, 
  WifiOff, 
  Sparkles,
  Layers,
  ArrowRightLeft,
  Menu,
  SlidersHorizontal,
  MessageSquare,
  X
} from 'lucide-react';
import { UserRole } from '../types';

interface TopBarProps {
  lessonTitle: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  userRole: UserRole;
  onToggleRole: () => void;
  roomCode: string;
  isOnline: boolean;
  onOpenPWAInstall: () => void;
  isPWAInstallable: boolean;
  isPWAInstalled: boolean;
  studentName?: string;
  teacherPage: number;
  isTeacherSynced: boolean;
  onSyncWithTeacher?: () => void;
  mobileActiveTab?: 'document' | 'sidebar' | 'panel';
  onSelectMobileTab?: (tab: 'document' | 'sidebar' | 'panel') => void;
  unreadQuestionCount?: number;
  activeConfusionCount?: number;
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  lessonTitle,
  currentPage,
  totalPages,
  onPageChange,
  userRole,
  onToggleRole,
  roomCode,
  isOnline,
  onOpenPWAInstall,
  isPWAInstallable,
  isPWAInstalled,
  studentName = 'Alex Rivera',
  teacherPage,
  isTeacherSynced,
  onSyncWithTeacher,
  mobileActiveTab = 'document',
  onSelectMobileTab,
  unreadQuestionCount = 0,
  activeConfusionCount = 0,
  onToggleSidebar,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header 
      id="app-top-bar"
      className="h-14 sm:h-16 border-b border-[#231E19] bg-[#12100E] px-3 sm:px-6 flex items-center justify-between z-30 sticky top-0 flex-shrink-0 text-[#E8DFD5]"
    >
      {/* Left: Brand Logo & Lesson Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 lg:flex-initial mr-2">
        {/* Mobile menu button for small screens */}
        {onSelectMobileTab && (
          <button
            id="mobile-open-sidebar-btn"
            onClick={() => onSelectMobileTab(mobileActiveTab === 'sidebar' ? 'document' : 'sidebar')}
            className={`p-2 rounded-xl border transition flex lg:hidden items-center justify-center min-w-[36px] min-h-[36px] ${
              mobileActiveTab === 'sidebar'
                ? 'bg-[#CCA572] text-[#16120C] border-[#CCA572]'
                : 'bg-[#1C1814] text-[#B8ADA1] border-[#2E2620]'
            }`}
            aria-label="Toggle Syllabus"
          >
            {mobileActiveTab === 'sidebar' ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        )}

        {/* ReadSync Brand Logo (Geometric Gold Delta Icon) */}
        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-2.5 flex-shrink-0 group text-left cursor-pointer"
          title="Toggle course lessons sidebar"
        >
          {/* Gold Origami / Compass Delta Glyph */}
          <div className="w-6 h-6 flex items-center justify-center text-[#CCA572] group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 22h20L12 2z" />
              <path d="M12 8v8" />
              <path d="M8 18l4-4 4 4" />
            </svg>
          </div>
          <span className="font-semibold text-xs tracking-[0.2em] uppercase text-[#CCA572] font-sans">
            READSYNC
          </span>
        </button>

        {/* Subtle Vertical Divider */}
        <div className="h-3.5 w-px bg-[#2E2620] mx-1 sm:mx-2 hidden sm:block" />

        {/* Current Lesson Title */}
        <button 
          onClick={onToggleSidebar}
          className="text-xs sm:text-sm font-medium text-[#D8CFC4] hover:text-white transition truncate hidden sm:flex items-center gap-1.5"
          title="Click to switch lessons"
        >
          <span className="truncate">{lessonTitle}</span>
        </button>
      </div>

      {/* Center: Room Code Pill Badge */}
      <div className="flex items-center justify-center">
        <button
          id="copy-room-code-btn"
          onClick={handleCopyRoomCode}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#1F1B17] hover:bg-[#2A241F] border border-[#332B24] text-xs text-[#D1C7BD] transition shadow-inner font-sans"
          title="Click to copy room code"
        >
          <span className="text-[#8C8073] font-normal">Room</span>
          <span className="font-semibold text-[#F2ECE4]">{roomCode}</span>
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400 ml-0.5" />
          ) : (
            <Copy className="w-3 h-3 text-[#7D7164] ml-0.5" />
          )}
        </button>
      </div>

      {/* Right: PWA Ready, Online Badge & View Switcher (Teacher / Student) */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* PWA Ready badge */}
        <button
          onClick={onOpenPWAInstall}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10241A] border border-[#19422C] text-emerald-400 text-xs font-medium hover:bg-[#142E21] transition"
          title={isPWAInstalled ? 'App installed and running offline-ready' : 'PWA is installed & offline ready'}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>PWA Ready</span>
        </button>

        {/* Online Status */}
        <div 
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#151E18] border border-[#20392A] text-emerald-400 text-xs font-medium"
          title={isOnline ? 'Real-time sync active' : 'Offline'}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span className="text-amber-300">Offline</span>
            </>
          )}
        </div>

        {/* View Switcher Toggle (Teacher vs Student) */}
        <div 
          id="view-switcher-container"
          className="flex items-center bg-[#1C1814] p-0.5 rounded-xl border border-[#2E2620]"
        >
          <button
            id="switch-to-teacher-btn"
            onClick={() => userRole !== 'teacher' && onToggleRole()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[30px] ${
              userRole === 'teacher'
                ? 'bg-[#CCA572] text-[#16120C] shadow-sm'
                : 'text-[#9E9287] hover:text-[#EDE5DC]'
            }`}
            title="Switch to Teacher View"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teacher</span>
          </button>

          <button
            id="switch-to-student-btn"
            onClick={() => userRole !== 'student' && onToggleRole()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[30px] ${
              userRole === 'student'
                ? 'bg-[#CCA572] text-[#16120C] font-semibold shadow-sm'
                : 'text-[#9E9287] hover:text-[#EDE5DC]'
            }`}
            title="Switch to Student View"
          >
            <User className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
        </div>

        {/* Mobile Right Drawer Button (Opens Teacher Session or Student Tools) */}
        {onSelectMobileTab && (
          <button
            id="mobile-open-panel-btn"
            onClick={() => onSelectMobileTab(mobileActiveTab === 'panel' ? 'document' : 'panel')}
            className={`p-2 rounded-xl border transition lg:hidden flex items-center justify-center relative min-w-[36px] min-h-[36px] ${
              mobileActiveTab === 'panel'
                ? 'bg-[#CCA572] text-[#16120C] border-[#CCA572]'
                : 'bg-[#1C1814] text-[#B8ADA1] border-[#2E2620]'
            }`}
            aria-label={userRole === 'teacher' ? 'Teacher Controls' : 'Student Tools & Q&A'}
          >
            {userRole === 'teacher' ? (
              <SlidersHorizontal className="w-4 h-4" />
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}

            {userRole === 'student' && unreadQuestionCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#CCA572] text-[8px] font-bold text-[#16120C] rounded-full flex items-center justify-center">
                {unreadQuestionCount}
              </span>
            )}
            {userRole === 'teacher' && activeConfusionCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                *
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
