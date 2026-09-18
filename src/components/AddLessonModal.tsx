import React, { useState } from 'react';
import { X, BookPlus } from 'lucide-react';
import { Lesson } from '../types';

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLesson: (lesson: Lesson) => void;
  currentLessonCount: number;
}

export const AddLessonModal: React.FC<AddLessonModalProps> = ({
  isOpen,
  onClose,
  onAddLesson,
  currentLessonCount,
}) => {
  const [title, setTitle] = useState(`Lesson ${currentLessonCount + 1}: Critical Inquiries`);
  const [subtitle, setSubtitle] = useState('Epistemic agency and shared cognitive artifacts');
  const [totalPages, setTotalPages] = useState(16);
  const [category, setCategory] = useState('Pedagogical Theory');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newLesson: Lesson = {
      id: `lesson_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Collaborative text analysis',
      totalPages: Number(totalPages) || 12,
      currentPage: 1,
      category: category.trim() || 'General Studies',
      isActive: false,
      activeStudentsCount: 0,
      totalConfusions: 0,
      pages: [
        {
          pageNumber: 1,
          chapterTitle: `Chapter 1: ${title.trim()}`,
          sectionTitle: '1.1 Foundations & Primary Arguments',
          paragraphs: [
            {
              id: `p_new_1`,
              pageNumber: 1,
              type: 'heading',
              text: `1.1 Introduction: ${title.trim()}`,
              confusionCount: 0,
              highlightCount: 0,
              confusionNotes: [],
            },
            {
              id: `p_new_2`,
              pageNumber: 1,
              type: 'body',
              text: `This newly scheduled reading module investigates how contemporary collaborative annotation interfaces transform student cognitive synthesis. Please utilize the amber highlighter to tag salient arguments and red asterisks (*) to pinpoint points of confusion.`,
              confusionCount: 0,
              highlightCount: 1,
              confusionNotes: [],
            },
            {
              id: `p_new_3`,
              pageNumber: 1,
              type: 'callout',
              text: `Core Seminar Question: In what ways does social annotation alter individual hermeneutic reflection versus group consensus building?`,
              confusionCount: 0,
              highlightCount: 2,
              confusionNotes: [],
            },
          ],
        },
      ],
    };

    onAddLesson(newLesson);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="add-lesson-modal"
        className="w-full max-w-md rounded-2xl bg-[#191512] border border-[#2D2620] p-6 shadow-2xl text-[#E8DFD5] relative"
      >
        <button
          id="close-add-lesson-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8C8073] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#251F1A]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#262019] border border-[#3E3226] flex items-center justify-center text-[#CCA572]">
            <BookPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#FAF6EE]">Add Reading Unit</h3>
            <p className="text-xs text-[#8C8073]">Upload or configure a new document module</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#8C8073] uppercase tracking-wider mb-1.5">
              Unit Title
            </label>
            <input
              id="new-lesson-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lesson 4: Epistemic Agency"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F0D] border border-[#2B231D] text-xs text-[#FAF6EE] focus:outline-none focus:border-[#CCA572] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8C8073] uppercase tracking-wider mb-1.5">
              Subtitle or Topic
            </label>
            <input
              id="new-lesson-subtitle-input"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Cognitive scaffolds in collective reading"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F0D] border border-[#2B231D] text-xs text-[#FAF6EE] focus:outline-none focus:border-[#CCA572] transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8C8073] uppercase tracking-wider mb-1.5">
                Total Pages
              </label>
              <input
                id="new-lesson-pages-input"
                type="number"
                min={1}
                max={100}
                value={totalPages}
                onChange={(e) => setTotalPages(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F0D] border border-[#2B231D] text-xs text-[#FAF6EE] focus:outline-none focus:border-[#CCA572] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8C8073] uppercase tracking-wider mb-1.5">
                Curriculum Track
              </label>
              <input
                id="new-lesson-category-input"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Theory"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F0D] border border-[#2B231D] text-xs text-[#FAF6EE] focus:outline-none focus:border-[#CCA572] transition"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#26201B] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#8C8073] hover:text-white hover:bg-[#251F1A] transition"
            >
              Cancel
            </button>
            <button
              id="confirm-create-lesson-btn"
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#CCA572] hover:bg-[#B89260] text-[#16120C] text-xs font-bold transition shadow-md"
            >
              Add Lesson Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
