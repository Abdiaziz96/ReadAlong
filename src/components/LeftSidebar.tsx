import React from 'react';
import { 
  BookOpen, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Layers, 
  Users
} from 'lucide-react';
import { Lesson, UserRole } from '../types';

interface LeftSidebarProps {
  lessons: Lesson[];
  activeLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  onOpenAddLesson: () => void;
  userRole: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  lessons,
  activeLessonId,
  onSelectLesson,
  onOpenAddLesson,
  userRole,
  isCollapsed,
  onToggleCollapse,
  isMobileDrawer = false,
  onCloseMobile,
}) => {
  return (
    <aside
      id="left-sidebar"
      className={`${
        isMobileDrawer
          ? 'w-full h-full border-r-0'
          : 'h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] border-r border-[#26201B]'
      } bg-[#12100E] transition-all duration-300 flex flex-col flex-shrink-0 z-20 ${
        isCollapsed && !isMobileDrawer ? 'w-16' : 'w-72 sm:w-80 lg:w-72'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#26201B] flex items-center justify-between">
        {(!isCollapsed || isMobileDrawer) && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#CCA572] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#CCA572]" />
              Course Syllabus
            </div>
            <p className="text-[11px] text-[#8C8073] mt-0.5">Interactive Reading Units</p>
          </div>
        )}

        {/* Close button for mobile drawer */}
        {isMobileDrawer && onCloseMobile ? (
          <button
            id="close-mobile-sidebar-btn"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-[#9E9182] hover:text-white hover:bg-[#1E1915] transition ml-auto min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close syllabus drawer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          /* Collapse toggle for desktop */
          <button
            id="toggle-sidebar-btn"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-[#9E9182] hover:text-[#E8DFD5] hover:bg-[#1E1915] transition mx-auto hidden lg:block"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Lesson List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {lessons.map((lesson) => {
          const isActive = lesson.id === activeLessonId;
          return (
            <div
              key={lesson.id}
              id={`lesson-card-${lesson.id}`}
              onClick={() => {
                onSelectLesson(lesson.id);
                if (isMobileDrawer && onCloseMobile) onCloseMobile();
              }}
              className={`group relative rounded-xl p-3 cursor-pointer transition-all border ${
                isActive
                  ? 'bg-[#1C1814] border-[#CCA572] shadow-sm text-[#F7F2EC]'
                  : 'bg-[#16120F] hover:bg-[#1C1814] border-[#26201B] text-[#C8BEB3]'
              }`}
            >
              {isCollapsed && !isMobileDrawer ? (
                <div className="flex flex-col items-center py-1 gap-1" title={`${lesson.title} (${isActive ? 'Active' : 'Idle'})`}>
                  <BookOpen className={`w-5 h-5 ${isActive ? 'text-[#CCA572]' : 'text-[#7D7164]'}`} />
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#CCA572]" />}
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`text-xs font-semibold leading-snug line-clamp-1 group-hover:text-[#CCA572] transition ${
                      isActive ? 'text-[#CCA572]' : 'text-[#EDE5DC]'
                    }`}>
                      {lesson.title}
                    </span>
                    {isActive ? (
                      <span 
                        id={`active-badge-${lesson.id}`}
                        className="flex-shrink-0 px-2 py-0.5 text-[10px] font-bold bg-[#CCA572] text-[#16120C] rounded-md"
                      >
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#7D7164]">{lesson.totalPages}p</span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#8E8276] line-clamp-1 mb-2 font-normal">
                    {lesson.subtitle}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-[#807569] pt-1.5 border-t border-[#26201B]">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[#70655A]" />
                      {lesson.totalPages} pages
                    </span>

                    {lesson.totalConfusions > 0 && (
                      <span className="flex items-center gap-1 text-[#D45B45] font-medium">
                        <span className="font-bold">*</span>
                        {lesson.totalConfusions} confusion pins
                      </span>
                    )}

                    {isActive && lesson.activeStudentsCount > 0 && (
                      <span className="flex items-center gap-1 text-emerald-400 ml-auto font-medium">
                        <Users className="w-3 h-3" />
                        {lesson.activeStudentsCount}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Lesson Button at Bottom */}
      <div className={`p-3 border-t border-[#26201B] bg-[#12100E] ${isMobileDrawer ? 'pb-24 sm:pb-4' : ''}`}>
        <button
          id="add-lesson-btn"
          onClick={() => {
            onOpenAddLesson();
            if (isMobileDrawer && onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1C1814] hover:bg-[#25201B] border border-[#2E2620] hover:border-[#CCA572] text-xs font-semibold text-[#D8CFC4] hover:text-white transition-all min-h-[40px] ${
            isCollapsed && !isMobileDrawer ? 'p-2' : ''
          }`}
          title="Add new reading unit"
        >
          <Plus className="w-4 h-4 text-[#CCA572]" />
          {(!isCollapsed || isMobileDrawer) && <span>+ Add Lesson</span>}
        </button>
      </div>
    </aside>
  );
};
