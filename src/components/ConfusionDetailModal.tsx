import React, { useState } from 'react';
import { X, CheckCircle, Send } from 'lucide-react';
import { DocumentParagraph, UserRole } from '../types';

interface ConfusionDetailModalProps {
  paragraph: DocumentParagraph | null;
  onClose: () => void;
  userRole: UserRole;
  currentStudentName: string;
  onAddConfusionNote?: (paragraphId: string, comment: string) => void;
  onResolveConfusion?: (paragraphId: string) => void;
}

export const ConfusionDetailModal: React.FC<ConfusionDetailModalProps> = ({
  paragraph,
  onClose,
  userRole,
  currentStudentName,
  onAddConfusionNote,
  onResolveConfusion,
}) => {
  const [commentText, setCommentText] = useState('');

  if (!paragraph) return null;

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !onAddConfusionNote) return;
    onAddConfusionNote(paragraph.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="confusion-detail-modal"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#191512] border border-[#3E2924] p-4 sm:p-6 shadow-2xl text-[#E8DFD5] relative"
      >
        <button
          id="close-confusion-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8C8073] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#251F1A]"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#331C18] border border-[#642B23] flex items-center justify-center text-[#E56A54]">
            <span className="text-xl font-black leading-none">*</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[#FAF6EE]">Confusion Pin Analysis</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#381B18] text-[#F39C8C] border border-[#642B23] rounded-full">
                {paragraph.confusionCount} Flagged
              </span>
            </div>
            <p className="text-xs text-[#8C8073]">Active friction on page {paragraph.pageNumber}</p>
          </div>
        </div>

        {/* Paragraph snippet */}
        <div className="bg-[#120F0D] border border-[#2B231D] rounded-xl p-3.5 mb-4 text-xs text-[#DDD3C7] leading-relaxed font-serif italic border-l-4 border-l-[#D45B45]">
          "{paragraph.text.length > 220 ? paragraph.text.slice(0, 220) + '...' : paragraph.text}"
        </div>

        {/* List of student notes */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#CCA572] uppercase tracking-wider">
              Student Inquiries & Notes
            </span>
            <span className="text-[11px] text-[#7D7164]">
              {paragraph.confusionNotes?.length || 0} Comments
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {!paragraph.confusionNotes || paragraph.confusionNotes.length === 0 ? (
              <div className="text-center py-4 bg-[#14110E] rounded-xl text-xs text-[#7D7164] border border-[#26201B]">
                Students placed confusion markers without textual notes.
              </div>
            ) : (
              paragraph.confusionNotes.map((note, idx) => (
                <div 
                  key={`${note.studentId}-${idx}`} 
                  className="p-3 rounded-xl bg-[#14110E] border border-[#2B231D] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[#8C8073]">
                    <span className="font-semibold text-[#E8DFD5]">{note.studentName}</span>
                    <span className="text-[10px]">{note.timestamp}</span>
                  </div>
                  <p className="text-[#C8BEB3] leading-relaxed">{note.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action input to add student note */}
        <form onSubmit={handlePostNote} className="pt-3 border-t border-[#2B231D] flex gap-2">
          <input
            id="confusion-comment-input"
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={`Add a clarifying note as ${currentStudentName}...`}
            className="flex-1 px-3 py-2 rounded-xl bg-[#120F0D] border border-[#2B231D] text-xs text-[#FAF6EE] placeholder-[#7D7164] focus:outline-none focus:border-[#CCA572]"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="px-3.5 py-2 rounded-xl bg-[#CCA572] hover:bg-[#B89260] disabled:opacity-40 text-[#16120C] text-xs font-bold transition flex items-center gap-1 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

        {/* Teacher Resolution action */}
        {userRole === 'teacher' && onResolveConfusion && (
          <div className="mt-4 pt-3 border-t border-[#2B231D] flex justify-end">
            <button
              onClick={() => {
                onResolveConfusion(paragraph.id);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark Clarified in Seminar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
