export type UserRole = 'teacher' | 'student';

export interface StudentUser {
  id: string;
  name: string;
  avatarColor: string;
  currentPage: number;
  status: 'reading' | 'confused' | 'active';
  joinedAt: string;
}

export interface Annotation {
  id: string;
  paragraphId: string;
  pageNumber: number;
  type: 'highlight' | 'confusion';
  studentId: string;
  studentName: string;
  note?: string;
  timestamp: string;
}

export interface DocumentParagraph {
  id: string;
  pageNumber: number;
  type: 'heading' | 'subheading' | 'body' | 'quote' | 'callout';
  text: string;
  secondaryText?: string;
  sectionNumber?: string;
  confusionCount: number;
  highlightCount: number;
  confusionNotes: {
    studentId: string;
    studentName: string;
    comment: string;
    timestamp: string;
  }[];
}

export interface LessonPage {
  pageNumber: number;
  chapterTitle: string;
  sectionTitle: string;
  paragraphs: DocumentParagraph[];
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  totalPages: number;
  currentPage: number;
  category: string;
  isActive: boolean;
  pages: LessonPage[];
  activeStudentsCount: number;
  totalConfusions: number;
}

export interface QAQuestion {
  id: string;
  studentId: string;
  studentName: string;
  avatarColor: string;
  pageNumber: number;
  paragraphId?: string;
  text: string;
  upvotes: number;
  upvotedBy: string[]; // student ids
  timestamp: string;
  isAnswered: boolean;
  teacherResponse?: string;
}

export interface SessionState {
  roomCode: string;
  isLive: boolean;
  isPaused: boolean;
  startedAt: string;
  durationSeconds: number;
  forcePageSync: boolean;
  heatmapEnabled: boolean;
  activeLessonId: string;
  teacherPage: number;
  broadcastMessage?: string;
}
