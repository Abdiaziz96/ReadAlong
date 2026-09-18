import React, { useState } from 'react';
import { 
  Highlighter, 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  LogIn, 
  Sparkles, 
  BookMarked,
  LogOut,
  X
} from 'lucide-react';
import { QAQuestion, StudentUser } from '../types';

interface StudentPanelProps {
  currentStudent: StudentUser | null;
  onSignIn: (name: string) => void;
  onSignOut: () => void;
  activeTool: 'highlight' | 'confusion' | 'read';
  onSelectTool: (tool: 'highlight' | 'confusion' | 'read') => void;
  questions: QAQuestion[];
  onUpvoteQuestion: (questionId: string) => void;
  onAskQuestion: (text: string) => void;
  currentPageNumber: number;
  myHighlightsCount: number;
  myConfusionsCount: number;
  broadcastMessage?: string;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const StudentPanel: React.FC<StudentPanelProps> = ({
  currentStudent,
  onSignIn,
  onSignOut,
  activeTool,
  onSelectTool,
  questions,
  onUpvoteQuestion,
  onAskQuestion,
  currentPageNumber,
  myHighlightsCount,
  myConfusionsCount,
  broadcastMessage,
  isMobileDrawer = false,
  onCloseMobile,
}) => {
  const [customName, setCustomName] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [qaFilter, setQaFilter] = useState<'all' | 'page'>('page');

  // Quick preset student profiles for rapid testing
  const PRESET_STUDENTS = [
    { name: 'Alex Rivera', role: 'Cognitive Science' },
    { name: 'Elena Chen', role: 'Philosophy' },
    { name: 'Jordan Vance', role: 'HCI Researcher' },
    { name: 'Sofia Rodriguez', role: 'Learning Sciences' },
  ];

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onSignIn(customName.trim());
    setCustomName('');
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    onAskQuestion(newQuestionText.trim());
    setNewQuestionText('');
  };

  const filteredQuestions = questions.filter((q) => {
    if (qaFilter === 'page') return q.pageNumber === currentPageNumber;
    return true;
  });

  return (
    <div 
      id="student-right-panel"
      className={`${
        isMobileDrawer
          ? 'w-full h-full'
          : 'h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-80 lg:w-[350px] border-l border-[#26201B]'
      } bg-[#161311] flex flex-col flex-shrink-0 text-[#E8DFD5] relative justify-between select-none`}
    >
      {/* 1. Student Sign-In Overlay State if not signed in */}
      {!currentStudent ? (
        <div 
          id="student-signin-overlay"
          className="absolute inset-0 z-40 bg-[#0F0D0B]/90 backdrop-blur-md p-6 flex flex-col justify-center"
        >
          <div className="bg-[#191512] border border-[#2D2620] rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-[#292019] border border-[#3D3025] flex items-center justify-center text-[#CCA572] mb-4 mx-auto">
              <LogIn className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-center text-[#F7F2EC] mb-1">Student Seminar Sign-In</h3>
            <p className="text-xs text-center text-[#8C8073] mb-5">
              Join the live interactive reading session to highlight paragraphs and mark confusion points.
            </p>

            {/* Presets */}
            <div className="mb-4">
              <span className="text-[11px] font-semibold text-[#8C8073] block mb-2">Quick Join as:</span>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_STUDENTS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => onSignIn(preset.name)}
                    className="p-2 text-left rounded-xl bg-[#1F1B17] hover:bg-[#2A241F] hover:border-[#CCA572]/50 border border-[#2E2620] text-xs transition group"
                  >
                    <div className="font-semibold text-[#EDE5DC] group-hover:text-[#CCA572]">{preset.name}</div>
                    <div className="text-[10px] text-[#7D7164]">{preset.role}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Name Input */}
            <form onSubmit={handleSignInSubmit} className="space-y-3">
              <div>
                <input
                  id="student-name-input"
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Or enter your full name..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14110F] border border-[#2E2620] text-xs text-[#EDE5DC] placeholder-[#7D7164] focus:outline-none focus:border-[#CCA572] transition"
                />
              </div>
              <button
                type="submit"
                id="join-session-btn"
                disabled={!customName.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#CCA572] hover:bg-[#B89260] disabled:opacity-40 text-[#16120C] text-xs font-bold shadow-md transition"
              >
                Join Reading Session
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {/* Upper Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* User Profile Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#26201B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white font-bold text-xs shadow-md">
              {currentStudent ? currentStudent.name.charAt(0) : 'A'}
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#F7F2EC] leading-tight">
                {currentStudent ? currentStudent.name : 'Student Reader'}
              </h3>
              <p className="text-[10px] text-emerald-400 font-medium">Session Connected</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {currentStudent && (
              <button
                onClick={onSignOut}
                className="text-[11px] text-[#8C8073] hover:text-[#EDE5DC] p-1.5 rounded-lg hover:bg-[#1F1B17] transition flex items-center gap-1"
                title="Switch user"
              >
                <LogOut className="w-3 h-3" />
                <span>Switch</span>
              </button>
            )}

            {isMobileDrawer && onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-[#8C8073] hover:text-[#EDE5DC]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Broadcast notice if any */}
        {broadcastMessage && (
          <div className="bg-[#241E18] border border-[#3E3226] rounded-xl p-3 text-xs text-[#E8DFD5] flex items-start gap-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#CCA572] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#CCA572] block mb-0.5">Teacher Notice:</span>
              <p className="text-[#C8BEB3] leading-snug">{broadcastMessage}</p>
            </div>
          </div>
        )}

        {/* Section: Reading Mode & Active Tools */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D47E53]">
              ACTIVE READING TOOL
            </span>
            <span className="text-[10px] text-[#8C8073]">Click to arm tool</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Highlight Tool */}
            <button
              id="tool-highlight-btn"
              onClick={() => onSelectTool('highlight')}
              className={`p-2 rounded-xl border text-xs flex flex-col items-center gap-1 transition ${
                activeTool === 'highlight'
                  ? 'bg-[#2E2419] border-[#CCA572] text-[#E8C58C] shadow-sm'
                  : 'bg-[#1C1815] border-[#2B231D] text-[#9E9182] hover:text-[#EDE5DC]'
              }`}
            >
              <Highlighter className="w-3.5 h-3.5 text-[#CCA572]" />
              <span className="font-semibold text-[11px]">Highlight</span>
            </button>

            {/* Confusion Pin Tool */}
            <button
              id="tool-confusion-btn"
              onClick={() => onSelectTool('confusion')}
              className={`p-2 rounded-xl border text-xs flex flex-col items-center gap-1 transition ${
                activeTool === 'confusion'
                  ? 'bg-[#2E1815] border-[#D45B45] text-[#F39C8C] shadow-sm'
                  : 'bg-[#1C1815] border-[#2B231D] text-[#9E9182] hover:text-[#EDE5DC]'
              }`}
            >
              <span className="text-sm font-black text-[#D45B45] leading-none">*</span>
              <span className="font-semibold text-[11px]">Confused</span>
            </button>

            {/* Read Tool */}
            <button
              id="tool-read-btn"
              onClick={() => onSelectTool('read')}
              className={`p-2 rounded-xl border text-xs flex flex-col items-center gap-1 transition ${
                activeTool === 'read'
                  ? 'bg-[#25211D] border-[#7D7164] text-white shadow-sm'
                  : 'bg-[#1C1815] border-[#2B231D] text-[#9E9182] hover:text-[#EDE5DC]'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5 text-[#A89D91]" />
              <span className="font-semibold text-[11px]">Read</span>
            </button>
          </div>
        </div>

        {/* Section: Seminar Q&A Stream */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#CCA572]" />
              <span className="text-xs font-semibold text-[#EDE5DC]">Q&A Stream</span>
            </div>

            <div className="flex items-center bg-[#1C1815] p-0.5 rounded-lg border border-[#2D2620] text-[10px]">
              <button
                onClick={() => setQaFilter('page')}
                className={`px-2 py-0.5 rounded-md font-medium transition ${
                  qaFilter === 'page' ? 'bg-[#CCA572] text-[#16120C]' : 'text-[#8C8073] hover:text-[#EDE5DC]'
                }`}
              >
                Page {currentPageNumber}
              </button>
              <button
                onClick={() => setQaFilter('all')}
                className={`px-2 py-0.5 rounded-md font-medium transition ${
                  qaFilter === 'all' ? 'bg-[#CCA572] text-[#16120C]' : 'text-[#8C8073] hover:text-[#EDE5DC]'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#7D7164]">
                No questions asked on Page {currentPageNumber} yet.
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isUpvotedByMe = currentStudent && q.upvotedBy.includes(currentStudent.id);
                return (
                  <div
                    key={q.id}
                    className="p-2.5 rounded-xl bg-[#1C1815] border border-[#2A231D] text-xs text-[#EDE5DC] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#CCA572] text-[11px]">{q.studentName}</span>
                        <span className="text-[10px] text-[#7D7164] font-mono">P.{q.pageNumber}</span>
                      </div>

                      <button
                        onClick={() => onUpvoteQuestion(q.id)}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium border transition ${
                          isUpvotedByMe
                            ? 'bg-[#CCA572]/20 border-[#CCA572] text-[#CCA572]'
                            : 'bg-[#241F1A] border-[#302821] text-[#9E9182] hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-2.5 h-2.5" />
                        <span>{q.upvotes}</span>
                      </button>
                    </div>

                    <p className="text-[#C8BEB3] text-[11.5px] leading-relaxed">{q.text}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Input: Ask a question on Page X */}
      <div className="p-3 border-t border-[#26201B] bg-[#161311] flex-shrink-0">
        <form onSubmit={handlePostQuestion} className="relative flex items-center">
          <input
            id="student-bottom-question-input"
            type="text"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            placeholder={`Ask a question on Page ${currentPageNumber}...`}
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#1C1815] border border-[#2E2620] text-xs text-[#EDE5DC] placeholder-[#7D7164] focus:outline-none focus:border-[#CCA572]"
          />
          <button
            type="submit"
            disabled={!newQuestionText.trim()}
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
