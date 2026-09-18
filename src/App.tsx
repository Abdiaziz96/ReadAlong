import React, { useState, useEffect } from 'react';
import { 
  INITIAL_LESSONS, 
  INITIAL_STUDENTS, 
  INITIAL_QUESTIONS, 
  INITIAL_SESSION_STATE 
} from './mockData';
import { 
  UserRole, 
  Lesson, 
  StudentUser, 
  DocumentParagraph, 
  QAQuestion, 
  SessionState 
} from './types';
import { TopBar } from './components/TopBar';
import { LeftSidebar } from './components/LeftSidebar';
import { DocumentCanvas } from './components/DocumentCanvas';
import { TeacherPanel } from './components/TeacherPanel';
import { StudentPanel } from './components/StudentPanel';
import { ConfusionDetailModal } from './components/ConfusionDetailModal';
import { AddLessonModal } from './components/AddLessonModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { 
  CheckCircle2, 
  Info, 
  Sparkles, 
  BookOpen, 
  Layers, 
  SlidersHorizontal, 
  MessageSquare, 
  Highlighter 
} from 'lucide-react';

export default function App() {
  // 1. Role State: Teacher vs Student
  const [userRole, setUserRole] = useState<UserRole>('teacher');

  // Mobile navigation drawer / view state ('document' = main reader, 'sidebar' = syllabus, 'panel' = host controls or student Q&A)
  const [mobileActiveTab, setMobileActiveTab] = useState<'document' | 'sidebar' | 'panel'>('document');

  // 2. Curriculum & Lessons State
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [activeLessonId, setActiveLessonId] = useState<string>('lesson_1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Active Lesson lookup
  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  // 3. Document Navigation State (Starts at Page 3 / 20 as specified)
  const [currentPage, setCurrentPage] = useState<number>(3);
  const [teacherPage, setTeacherPage] = useState<number>(3);

  // 4. Session & Real-Time Sync State
  const [sessionState, setSessionState] = useState<SessionState>(INITIAL_SESSION_STATE);
  const [students, setStudents] = useState<StudentUser[]>(INITIAL_STUDENTS);

  // Current active student in student view (starts with Alex Rivera, can be signed out/switched)
  const [currentStudent, setCurrentStudent] = useState<StudentUser | null>(INITIAL_STUDENTS[0]);

  // Student active tool ('highlight' | 'confusion' | 'read')
  const [studentActiveTool, setStudentActiveTool] = useState<'highlight' | 'confusion' | 'read'>('highlight');

  // 5. Q&A Questions State
  const [questions, setQuestions] = useState<QAQuestion[]>(INITIAL_QUESTIONS);

  // 6. Modals & Dialogs State
  const [selectedConfusionParagraph, setSelectedConfusionParagraph] = useState<DocumentParagraph | null>(null);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState<boolean>(false);
  const [isPWAInstallOpen, setIsPWAInstallOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 7. PWA Hooks
  const { isInstallable, isInstalled, isIOS, install: installPWA } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Helper toast notification trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Timer simulation for live reading session
  useEffect(() => {
    if (sessionState.isPaused || !sessionState.isLive) return;
    const interval = setInterval(() => {
      setSessionState((prev) => ({
        ...prev,
        durationSeconds: prev.durationSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionState.isPaused, sessionState.isLive]);

  // Active page object within the active lesson
  const activePageData = activeLesson?.pages?.find((p) => p.pageNumber === currentPage);

  // Confusion count on current page
  const currentPageConfusionCount = activePageData?.paragraphs.reduce(
    (acc, curr) => acc + curr.confusionCount,
    0
  ) || 0;

  // Student's personal annotation counts on current page
  const myHighlightsCount = activePageData?.paragraphs.filter((p) => p.highlightCount > 0).length || 0;
  const myConfusionsCount = activePageData?.paragraphs.filter((p) => p.confusionCount > 0).length || 0;

  // Handler: Change Page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (userRole === 'teacher') {
      setTeacherPage(newPage);
      // If forced sync is active, update all students to this page
      if (sessionState.forcePageSync) {
        setStudents((prev) =>
          prev.map((s) => ({ ...s, currentPage: newPage }))
        );
        showToast(`Broadcasting Page ${newPage} to all students (Locked Sync)`);
      }
    } else if (currentStudent) {
      // Update this student's page in roster
      setStudents((prev) =>
        prev.map((s) => (s.id === currentStudent.id ? { ...s, currentPage: newPage } : s))
      );
    }
  };

  // Handler: Sync Student to Teacher's current page
  const handleSyncWithTeacher = () => {
    setCurrentPage(teacherPage);
    if (currentStudent) {
      setStudents((prev) =>
        prev.map((s) => (s.id === currentStudent.id ? { ...s, currentPage: teacherPage } : s))
      );
    }
    showToast(`Synced to Teacher's view: Page ${teacherPage}`);
  };

  // Handler: Toggle Role (Teacher vs Student)
  const handleToggleRole = () => {
    const nextRole: UserRole = userRole === 'teacher' ? 'student' : 'teacher';
    setUserRole(nextRole);
    showToast(`Switched to ${nextRole === 'teacher' ? 'Teacher (Host)' : 'Student'} mode`);
  };

  // Handler: Select Lesson from Sidebar
  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setLessons((prev) =>
      prev.map((l) => ({
        ...l,
        isActive: l.id === lessonId,
      }))
    );
    // Reset page to 1 or active page of that lesson
    const targetLesson = lessons.find((l) => l.id === lessonId);
    if (targetLesson) {
      const pageToSet = targetLesson.id === 'lesson_1' ? 3 : 1;
      setCurrentPage(pageToSet);
      if (userRole === 'teacher') {
        setTeacherPage(pageToSet);
      }
    }
  };

  // Handler: Add New Lesson to Curriculum
  const handleAddLesson = (newLesson: Lesson) => {
    setLessons((prev) => [...prev, newLesson]);
    showToast(`Created Unit: "${newLesson.title}"`);
  };

  // Handler: Interactive Paragraph Action from Document Canvas
  const handleParagraphAction = (paragraphId: string, action: 'highlight' | 'confusion' | 'question') => {
    if (action === 'highlight') {
      // Toggle amber highlight on the selected paragraph
      setLessons((prevLessons) =>
        prevLessons.map((lesson) => {
          if (lesson.id !== activeLessonId) return lesson;
          return {
            ...lesson,
            pages: lesson.pages.map((page) => {
              if (page.pageNumber !== currentPage) return page;
              return {
                ...page,
                paragraphs: page.paragraphs.map((p) => {
                  if (p.id !== paragraphId) return p;
                  const isHighlighted = p.highlightCount > 0;
                  return {
                    ...p,
                    highlightCount: isHighlighted ? 0 : 1,
                  };
                }),
              };
            }),
          };
        })
      );
      showToast('Toggled Amber Highlight on passage');
    } else if (action === 'confusion') {
      // Find the paragraph
      const targetP = activePageData?.paragraphs.find((p) => p.id === paragraphId);
      if (targetP) {
        // Increment confusion and add note from current student
        const studentName = currentStudent?.name || 'Alex Rivera';
        const studentId = currentStudent?.id || 'std_1';

        setLessons((prevLessons) =>
          prevLessons.map((lesson) => {
            if (lesson.id !== activeLessonId) return lesson;
            return {
              ...lesson,
              totalConfusions: lesson.totalConfusions + 1,
              pages: lesson.pages.map((page) => {
                if (page.pageNumber !== currentPage) return page;
                return {
                  ...page,
                  paragraphs: page.paragraphs.map((p) => {
                    if (p.id !== paragraphId) return p;
                    return {
                      ...p,
                      confusionCount: p.confusionCount + 1,
                      confusionNotes: [
                        ...p.confusionNotes,
                        {
                          studentId,
                          studentName,
                          comment: `Flagged conceptual friction regarding: "${p.text.slice(0, 45)}..."`,
                          timestamp: 'Just now',
                        },
                      ],
                    };
                  }),
                };
              }),
            };
          })
        );
        // Open detail modal to let student elaborate
        setSelectedConfusionParagraph(targetP);
        showToast('Pinned red confusion asterisk (*)');
      }
    } else if (action === 'question') {
      // Switch to Student mode if not already and trigger prompt
      if (userRole === 'teacher') {
        setUserRole('student');
      }
      showToast('Ready to ask a question on this block in the Q&A panel!');
    }
  };

  // Handler: Add detailed note to a confusion asterisk
  const handleAddConfusionNote = (paragraphId: string, comment: string) => {
    const studentName = currentStudent?.name || 'Alex Rivera';
    const studentId = currentStudent?.id || 'std_1';

    setLessons((prevLessons) =>
      prevLessons.map((lesson) => {
        if (lesson.id !== activeLessonId) return lesson;
        return {
          ...lesson,
          pages: lesson.pages.map((page) => {
            if (page.pageNumber !== currentPage) return page;
            return {
              ...page,
              paragraphs: page.paragraphs.map((p) => {
                if (p.id !== paragraphId) return p;
                return {
                  ...p,
                  confusionNotes: [
                    ...p.confusionNotes,
                    {
                      studentId,
                      studentName,
                      comment,
                      timestamp: 'Just now',
                    },
                  ],
                };
              }),
            };
          }),
        };
      })
    );
    showToast('Added clarification note to confusion asterisk');
  };

  // Handler: Resolve confusion on a paragraph (Teacher action)
  const handleResolveConfusion = (paragraphId: string) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) => {
        if (lesson.id !== activeLessonId) return lesson;
        return {
          ...lesson,
          pages: lesson.pages.map((page) => {
            if (page.pageNumber !== currentPage) return page;
            return {
              ...page,
              paragraphs: page.paragraphs.map((p) => {
                if (p.id !== paragraphId) return p;
                return {
                  ...p,
                  confusionCount: 0,
                  confusionNotes: [],
                };
              }),
            };
          }),
        };
      })
    );
    showToast('Resolved all confusion pins on this text block');
  };

  // Teacher Session Controls
  const handleTogglePlayPause = () => {
    setSessionState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
    showToast(sessionState.isPaused ? 'Session Resumed' : 'Session Paused');
  };

  const handleToggleHeatmap = () => {
    setSessionState((prev) => {
      const nextState = !prev.heatmapEnabled;
      showToast(nextState ? 'Confusion Heatmap Enabled' : 'Confusion Heatmap Hidden');
      return {
        ...prev,
        heatmapEnabled: nextState,
      };
    });
  };

  const handleToggleForceSync = () => {
    setSessionState((prev) => {
      const nextSync = !prev.forcePageSync;
      showToast(nextSync ? 'Lock Students to Teacher Page: ON' : 'Lock Students: OFF');
      return {
        ...prev,
        forcePageSync: nextSync,
      };
    });
  };

  const handleForceSyncToCurrentPage = () => {
    setStudents((prev) =>
      prev.map((s) => ({ ...s, currentPage }))
    );
    showToast(`Force synced all 8 students to Page ${currentPage}`);
  };

  const handleBroadcastMessage = (msg: string) => {
    setSessionState((prev) => ({
      ...prev,
      broadcastMessage: msg,
    }));
    showToast('Broadcast sent to all connected students');
  };

  // Student Sign-in & Sign-out
  const handleStudentSignIn = (name: string) => {
    const newStudent: StudentUser = {
      id: `std_${Date.now()}`,
      name,
      avatarColor: '#6366F1',
      currentPage,
      status: 'active',
      joinedAt: 'Just now',
    };
    setCurrentStudent(newStudent);
    setStudents((prev) => [newStudent, ...prev.filter((s) => s.id !== newStudent.id)]);
    showToast(`Welcome, ${name}! Connected to Room ${sessionState.roomCode}`);
  };

  const handleStudentSignOut = () => {
    setCurrentStudent(null);
    showToast('Signed out of student session');
  };

  // Q&A Handlers
  const handleUpvoteQuestion = (questionId: string) => {
    if (!currentStudent) {
      showToast('Please sign in to upvote questions');
      return;
    }
    const studentId = currentStudent.id;
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const alreadyUpvoted = q.upvotedBy.includes(studentId);
        const updatedUpvotedBy = alreadyUpvoted
          ? q.upvotedBy.filter((id) => id !== studentId)
          : [...q.upvotedBy, studentId];
        return {
          ...q,
          upvotes: alreadyUpvoted ? q.upvotes - 1 : q.upvotes + 1,
          upvotedBy: updatedUpvotedBy,
        };
      })
    );
  };

  const handleAskQuestion = (text: string) => {
    if (!currentStudent) {
      showToast('Please sign in to ask a question');
      return;
    }
    const newQ: QAQuestion = {
      id: `q_${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      avatarColor: currentStudent.avatarColor,
      pageNumber: currentPage,
      text,
      upvotes: 1,
      upvotedBy: [currentStudent.id],
      timestamp: 'Just now',
      isAnswered: false,
    };
    setQuestions((prev) => [newQ, ...prev]);
    showToast('Question posted to Seminar Q&A stream');
  };

  const unreadQuestionCount = questions.filter((q) => q.pageNumber === currentPage).length;
  const activeConfusionCount = activePageData?.paragraphs.reduce((acc, p) => acc + p.confusionCount, 0) || 0;

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#E8DFD5] flex flex-col antialiased selection:bg-[#CCA572]/30 selection:text-[#FAF6EE]">
      {/* 1. Top Bar */}
      <TopBar
        lessonTitle={activeLesson.title}
        currentPage={currentPage}
        totalPages={activeLesson.totalPages}
        onPageChange={handlePageChange}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        roomCode={sessionState.roomCode}
        isOnline={isOnline}
        onOpenPWAInstall={() => setIsPWAInstallOpen(true)}
        isPWAInstallable={isInstallable}
        isPWAInstalled={isInstalled}
        studentName={currentStudent?.name}
        teacherPage={teacherPage}
        isTeacherSynced={currentPage === teacherPage}
        onSyncWithTeacher={handleSyncWithTeacher}
        mobileActiveTab={mobileActiveTab}
        onSelectMobileTab={setMobileActiveTab}
        unreadQuestionCount={unreadQuestionCount}
        activeConfusionCount={activeConfusionCount}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* 2. Main Studio Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar on Desktop (hidden on mobile) */}
        <div className="hidden lg:flex flex-shrink-0">
          <LeftSidebar
            lessons={lessons}
            activeLessonId={activeLessonId}
            onSelectLesson={handleSelectLesson}
            onOpenAddLesson={() => setIsAddLessonOpen(true)}
            userRole={userRole}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          />
        </div>

        {/* Center Area: Mock Multi-Page Document Canvas (always visible & responsive) */}
        <DocumentCanvas
          page={activePageData}
          currentPageNumber={currentPage}
          totalPages={activeLesson.totalPages}
          userRole={userRole}
          heatmapEnabled={sessionState.heatmapEnabled}
          studentModeActiveTool={studentActiveTool}
          onParagraphAction={handleParagraphAction}
          onSelectConfusion={(p) => setSelectedConfusionParagraph(p)}
          currentStudentId={currentStudent?.id || 'std_1'}
          currentStudentName={currentStudent?.name || 'Alex Rivera'}
          onPageChange={handlePageChange}
        />

        {/* Right Panel on Desktop (hidden on mobile) */}
        <div className="hidden lg:flex flex-shrink-0">
          {userRole === 'teacher' ? (
            <TeacherPanel
              sessionState={sessionState}
              onTogglePlayPause={handleTogglePlayPause}
              onToggleHeatmap={handleToggleHeatmap}
              onToggleForceSync={handleToggleForceSync}
              onForceSyncToCurrentPage={handleForceSyncToCurrentPage}
              onBroadcastMessage={handleBroadcastMessage}
              students={students}
              currentPageConfusionCount={currentPageConfusionCount}
              currentPageNumber={currentPage}
            />
          ) : (
            <StudentPanel
              currentStudent={currentStudent}
              onSignIn={handleStudentSignIn}
              onSignOut={handleStudentSignOut}
              activeTool={studentActiveTool}
              onSelectTool={setStudentActiveTool}
              questions={questions}
              onUpvoteQuestion={handleUpvoteQuestion}
              onAskQuestion={handleAskQuestion}
              currentPageNumber={currentPage}
              myHighlightsCount={myHighlightsCount}
              myConfusionsCount={myConfusionsCount}
              broadcastMessage={sessionState.broadcastMessage}
            />
          )}
        </div>
      </div>

      {/* Mobile Drawer: Syllabus / LeftSidebar */}
      {mobileActiveTab === 'sidebar' && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileActiveTab('document')}
          />
          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs h-full z-10 animate-fade-in shadow-2xl">
            <LeftSidebar
              lessons={lessons}
              activeLessonId={activeLessonId}
              onSelectLesson={(lessonId) => {
                handleSelectLesson(lessonId);
                setMobileActiveTab('document');
              }}
              onOpenAddLesson={() => setIsAddLessonOpen(true)}
              userRole={userRole}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              isMobileDrawer={true}
              onCloseMobile={() => setMobileActiveTab('document')}
            />
          </div>
        </div>
      )}

      {/* Mobile Drawer: Teacher / Student Right Panel */}
      {mobileActiveTab === 'panel' && (
        <div className="fixed inset-0 z-40 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileActiveTab('document')}
          />
          {/* Drawer content */}
          <div className="relative w-full sm:w-4/5 sm:max-w-md h-full z-10 animate-fade-in shadow-2xl bg-slate-900">
            {userRole === 'teacher' ? (
              <TeacherPanel
                sessionState={sessionState}
                onTogglePlayPause={handleTogglePlayPause}
                onToggleHeatmap={handleToggleHeatmap}
                onToggleForceSync={handleToggleForceSync}
                onForceSyncToCurrentPage={handleForceSyncToCurrentPage}
                onBroadcastMessage={handleBroadcastMessage}
                students={students}
                currentPageConfusionCount={currentPageConfusionCount}
                currentPageNumber={currentPage}
                isMobileDrawer={true}
                onCloseMobile={() => setMobileActiveTab('document')}
              />
            ) : (
              <StudentPanel
                currentStudent={currentStudent}
                onSignIn={handleStudentSignIn}
                onSignOut={handleStudentSignOut}
                activeTool={studentActiveTool}
                onSelectTool={setStudentActiveTool}
                questions={questions}
                onUpvoteQuestion={handleUpvoteQuestion}
                onAskQuestion={handleAskQuestion}
                currentPageNumber={currentPage}
                myHighlightsCount={myHighlightsCount}
                myConfusionsCount={myConfusionsCount}
                broadcastMessage={sessionState.broadcastMessage}
                isMobileDrawer={true}
                onCloseMobile={() => setMobileActiveTab('document')}
              />
            )}
          </div>
        </div>
      )}

      {/* Floating Student Annotation Bar on Mobile */}
      {userRole === 'student' && mobileActiveTab === 'document' && (
        <div 
          id="mobile-floating-tool-bar"
          className="lg:hidden fixed bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#161311]/95 border border-[#2B231D] shadow-2xl backdrop-blur-lg"
        >
          <button
            onClick={() => {
              setStudentActiveTool('highlight');
              showToast('Highlight tool active: Tap any paragraph');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              studentActiveTool === 'highlight'
                ? 'bg-[#CCA572] text-[#16120C] shadow-md'
                : 'text-[#9E9182] hover:text-[#EDE5DC] hover:bg-[#251F1A]'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>Highlight</span>
          </button>

          <button
            onClick={() => {
              setStudentActiveTool('confusion');
              showToast('Confusion pin tool active: Tap any paragraph');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              studentActiveTool === 'confusion'
                ? 'bg-[#D45B45] text-white shadow-md'
                : 'text-[#9E9182] hover:text-[#EDE5DC] hover:bg-[#251F1A]'
            }`}
          >
            <span className="text-sm font-black leading-none text-white">*</span>
            <span>Confused</span>
          </button>

          <button
            onClick={() => setStudentActiveTool('read')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              studentActiveTool === 'read'
                ? 'bg-[#3A322A] text-white shadow-md'
                : 'text-[#7D7164] hover:text-[#EDE5DC] hover:bg-[#251F1A]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read</span>
          </button>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav" 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-[#14110F]/95 border-t border-[#26201B] backdrop-blur-md px-3 flex items-center justify-around shadow-2xl"
      >
        {/* Tab 1: Syllabus */}
        <button
          id="mobile-nav-syllabus"
          onClick={() => setMobileActiveTab(mobileActiveTab === 'sidebar' ? 'document' : 'sidebar')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            mobileActiveTab === 'sidebar'
              ? 'text-[#CCA572] font-semibold'
              : 'text-[#8C8073] hover:text-[#EDE5DC]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Syllabus</span>
        </button>

        {/* Tab 2: Document (Page Reading) */}
        <button
          id="mobile-nav-reading"
          onClick={() => setMobileActiveTab('document')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            mobileActiveTab === 'document'
              ? 'text-[#CCA572] font-semibold'
              : 'text-[#8C8073] hover:text-[#EDE5DC]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Page {currentPage}</span>
        </button>

        {/* Tab 3: Panel (Teacher Controls / Student Q&A & Tools) */}
        <button
          id="mobile-nav-panel"
          onClick={() => setMobileActiveTab(mobileActiveTab === 'panel' ? 'document' : 'panel')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl relative transition ${
            mobileActiveTab === 'panel'
              ? 'text-[#CCA572] font-semibold'
              : 'text-[#8C8073] hover:text-[#EDE5DC]'
          }`}
        >
          {userRole === 'teacher' ? (
            <SlidersHorizontal className="w-4 h-4" />
          ) : (
            <MessageSquare className="w-4 h-4" />
          )}
          <span className="text-[10px] mt-0.5">
            {userRole === 'teacher' ? 'Controls' : 'Tools & Q&A'}
          </span>

          {/* Badge */}
          {userRole === 'student' && unreadQuestionCount > 0 && (
            <span className="absolute top-1 right-6 w-3.5 h-3.5 bg-[#CCA572] text-[8px] font-bold text-[#16120C] rounded-full flex items-center justify-center">
              {unreadQuestionCount}
            </span>
          )}
          {userRole === 'teacher' && activeConfusionCount > 0 && (
            <span className="absolute top-1 right-6 w-3.5 h-3.5 bg-[#D45B45] text-[9px] font-black text-white rounded-full flex items-center justify-center animate-pulse">
              *
            </span>
          )}
        </button>
      </nav>

      {/* 3. Confusion Detail Popover Modal */}
      {selectedConfusionParagraph && (
        <ConfusionDetailModal
          paragraph={selectedConfusionParagraph}
          onClose={() => setSelectedConfusionParagraph(null)}
          userRole={userRole}
          currentStudentName={currentStudent?.name || 'Alex Rivera'}
          onAddConfusionNote={handleAddConfusionNote}
          onResolveConfusion={handleResolveConfusion}
        />
      )}

      {/* 4. Add Lesson Modal */}
      <AddLessonModal
        isOpen={isAddLessonOpen}
        onClose={() => setIsAddLessonOpen(false)}
        onAddLesson={handleAddLesson}
        currentLessonCount={lessons.length}
      />

      {/* 5. PWA Install Guidance Modal */}
      <PWAInstallModal
        isOpen={isPWAInstallOpen}
        onClose={() => setIsPWAInstallOpen(false)}
        isIOS={isIOS}
        onInstallNative={isInstallable ? installPWA : undefined}
      />

      {/* 6. PWA Offline Indicator */}
      <OfflineIndicator isOnline={isOnline} />

      {/* 7. Toast Notification Pill */}
      {toastMessage && (
        <div 
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#1C1814]/95 border border-[#CCA572]/40 text-xs font-semibold text-[#EDE5DC] shadow-2xl backdrop-blur-md animate-fade-in"
        >
          <Sparkles className="w-4 h-4 text-[#CCA572]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
