import { Lesson, StudentUser, QAQuestion, SessionState } from './types';

export const INITIAL_STUDENTS: StudentUser[] = [
  { id: 'std_1', name: 'Alex Rivera', avatarColor: '#6366F1', currentPage: 3, status: 'confused', joinedAt: '10:02 AM' },
  { id: 'std_2', name: 'Elena Chen', avatarColor: '#EC4899', currentPage: 3, status: 'reading', joinedAt: '10:04 AM' },
  { id: 'std_3', name: 'Jordan Vance', avatarColor: '#10B981', currentPage: 3, status: 'confused', joinedAt: '10:05 AM' },
  { id: 'std_4', name: 'Marcus Thorne', avatarColor: '#F59E0B', currentPage: 2, status: 'active', joinedAt: '10:07 AM' },
  { id: 'std_5', name: 'Priya Patel', avatarColor: '#8B5CF6', currentPage: 3, status: 'reading', joinedAt: '10:08 AM' },
  { id: 'std_6', name: 'Devon Miles', avatarColor: '#06B6D4', currentPage: 4, status: 'active', joinedAt: '10:10 AM' },
  { id: 'std_7', name: 'Sofia Rodriguez', avatarColor: '#14B8A6', currentPage: 3, status: 'confused', joinedAt: '10:12 AM' },
  { id: 'std_8', name: 'Liam O\'Connor', avatarColor: '#E11D48', currentPage: 3, status: 'reading', joinedAt: '10:15 AM' },
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson_1',
    title: 'Lesson 1: Foundations',
    subtitle: 'Distributed Cognition and Epistemic Tools',
    totalPages: 20,
    currentPage: 3,
    category: 'Cognitive Science',
    isActive: true,
    activeStudentsCount: 18,
    totalConfusions: 7,
    pages: [
      {
        pageNumber: 1,
        chapterTitle: 'Chapter 1: Epistemic Architecture',
        sectionTitle: '1.1 Introduction to External Memory Systems',
        paragraphs: [
          {
            id: 'p1_1',
            pageNumber: 1,
            type: 'heading',
            text: '1.1 The Externalization of Thought in Physical & Digital Media',
            confusionCount: 0,
            highlightCount: 2,
            confusionNotes: [],
          },
          {
            id: 'p1_2',
            pageNumber: 1,
            type: 'body',
            text: 'Human cognitive architecture has never functioned in biological isolation. From early tally bones and cuneiform tablets to contemporary hyperlinked graphs, human cognition relies on spatial offloading. The cognitive workspace extends across artifacts, environments, and social networks.',
            confusionCount: 1,
            highlightCount: 4,
            confusionNotes: [
              { studentId: 'std_2', studentName: 'Elena Chen', comment: 'Is spatial offloading different from working memory retention?', timestamp: '10:08 AM' }
            ],
          },
        ]
      },
      {
        pageNumber: 2,
        chapterTitle: 'Chapter 1: Epistemic Architecture',
        sectionTitle: '1.2 Biological Bounds and Sensory Augmentation',
        paragraphs: [
          {
            id: 'p2_1',
            pageNumber: 2,
            type: 'heading',
            text: '1.2 Boundaries of Mind: Clark & Chalmers Extended Mind Thesis',
            confusionCount: 1,
            highlightCount: 3,
            confusionNotes: [
              { studentId: 'std_4', studentName: 'Marcus Thorne', comment: 'What constitutes parity of external retrieval?', timestamp: '10:11 AM' }
            ],
          },
          {
            id: 'p2_2',
            pageNumber: 2,
            type: 'body',
            text: 'Under the Parity Principle, if a part of the world functions as a process which, were it done in the head, we would have no hesitation in recognizing as part of the cognitive process, then that part of the world is part of the cognitive system.',
            confusionCount: 2,
            highlightCount: 6,
            confusionNotes: [
              { studentId: 'std_3', studentName: 'Jordan Vance', comment: 'Does a search engine qualify under the parity principle or only structured notes?', timestamp: '10:14 AM' },
              { studentId: 'std_6', studentName: 'Devon Miles', comment: 'Could this mean any tool is cognitive?', timestamp: '10:15 AM' }
            ],
          },
        ]
      },
      {
        pageNumber: 3,
        chapterTitle: 'Chapter 1: Epistemic Architecture',
        sectionTitle: '1.3 Synchronous Collaborative Reading Dynamics',
        paragraphs: [
          {
            id: 'p3_1',
            pageNumber: 3,
            type: 'heading',
            secondaryText: 'When a group reads a dense technical treatise',
            text: '1.3 Scaffolding vs. Offloading in Real-Time Text Synthesis',
            sectionNumber: '§ 1.3',
            confusionCount: 0,
            highlightCount: 3,
            confusionNotes: [],
          },
          {
            id: 'p3_sub',
            pageNumber: 3,
            type: 'body',
            text: 'We partner with visions to navigate complexity and achieve transformative results.',
            confusionCount: 0,
            highlightCount: 0,
            confusionNotes: [],
          },
          {
            id: 'p3_2',
            pageNumber: 3,
            type: 'body',
            text: 'When multiple readers annotate a dense technical treatise simultaneously, their individual perceptual attention is altered by the visible presence of peer highlights and marginalia. This phenomenon, termed "collective epistemic salienting," shapes comprehension trajectories before personal critical evaluation begins.',
            confusionCount: 1,
            highlightCount: 3,
            confusionNotes: [
              {
                studentId: 'std_1',
                studentName: 'Alex Rivera',
                comment: 'Could "salienting" cause group-think or premature consensus during close readings?',
                timestamp: '10:18 AM'
              }
            ],
          },
          {
            id: 'p3_3',
            pageNumber: 3,
            type: 'quote',
            text: '"Cognitive scaffolding is not merely support that is dismantled once competence is achieved; in hypermedia reading environments, the scaffolding constitutes the dynamic medium of collaborative reasoning itself."',
            secondaryText: '— Pea, R. D. (1993). Practices of Distributed Intelligence and Designs for Education.',
            confusionCount: 0,
            highlightCount: 5,
            confusionNotes: [],
          },
          {
            id: 'p3_4',
            pageNumber: 3,
            type: 'body',
            text: 'Crucially, we must demarcate the boundary between cognitive scaffolding (which elevates analytical capacity) and cognitive offloading (which delegates critical synthesis entirely to external algorithmic indexing). When a student pins an asterisk to indicate conceptual friction, they externalize their cognitive breakdown rather than disguising it behind passive comprehension cues.',
            confusionCount: 4,
            highlightCount: 2,
            confusionNotes: [
              {
                studentId: 'std_1',
                studentName: 'Alex Rivera',
                comment: 'The boundary between elevation and delegation seems blurry in digital textbooks. How do we test which one is happening?',
                timestamp: '10:21 AM'
              },
              {
                studentId: 'std_3',
                studentName: 'Jordan Vance',
                comment: 'Is the red asterisk considered an offloading act or an active metacognitive signal?',
                timestamp: '10:22 AM'
              },
              {
                studentId: 'std_7',
                studentName: 'Sofia Rodriguez',
                comment: 'Does algorithmic summarization fall purely into the offloading category here?',
                timestamp: '10:24 AM'
              },
              {
                studentId: 'std_4',
                studentName: 'Marcus Thorne',
                comment: 'Need clarification on how passive comprehension cues differ from active indicators.',
                timestamp: '10:26 AM'
              }
            ],
          },
          {
            id: 'p3_5',
            pageNumber: 3,
            type: 'callout',
            text: 'Key Principle: Epistemic friction is not an error state to be optimized away; it is the pedagogical catalyst where active mental models confront textual ambiguity.',
            confusionCount: 2, // Confusion asterisk
            highlightCount: 7, // Highlighted
            confusionNotes: [
              {
                studentId: 'std_5',
                studentName: 'Priya Patel',
                comment: 'How does the instructor pace the lecture when friction is high on this specific principle?',
                timestamp: '10:27 AM'
              },
              {
                studentId: 'std_1',
                studentName: 'Alex Rivera',
                comment: 'Can excessive friction lead to cognitive fatigue before reaching resolution?',
                timestamp: '10:28 AM'
              }
            ],
          },
          {
            id: 'p3_6',
            pageNumber: 3,
            type: 'body',
            text: 'In synchronous classroom configurations, the instructor monitors an aggregated heatmap of confusion pins. By examining clusters of asterisks in real time, the teacher dynamically shifts from didactic exposition to socratic deconstruction, addressing epistemic impasses before students advance to subsequent pages.',
            confusionCount: 0,
            highlightCount: 4,
            confusionNotes: [],
          }
        ]
      },
      {
        pageNumber: 4,
        chapterTitle: 'Chapter 1: Epistemic Architecture',
        sectionTitle: '1.4 Empirical Metrics of Shared Attention',
        paragraphs: [
          {
            id: 'p4_1',
            pageNumber: 4,
            type: 'heading',
            text: '1.4 Quantitative Measures of Mutual Gaze & Reading Velocity',
            confusionCount: 1,
            highlightCount: 2,
            confusionNotes: [
              { studentId: 'std_8', studentName: 'Liam O\'Connor', comment: 'Does velocity correlate directly with retention?', timestamp: '10:30 AM' }
            ],
          },
          {
            id: 'p4_2',
            pageNumber: 4,
            type: 'body',
            text: 'Controlled laboratory trials demonstrate that synchronous gaze coordination increases comprehension by 23% compared to asynchronous independent reading, provided that peer annotations remain semantically coherent.',
            confusionCount: 0,
            highlightCount: 6,
            confusionNotes: [],
          }
        ]
      }
    ]
  },
  {
    id: 'lesson_2',
    title: 'Lesson 2: Values & Epistemic Trust',
    subtitle: 'Evaluating Provenance and Sourcing in Shared Media',
    totalPages: 18,
    currentPage: 1,
    category: 'Information Ethics',
    isActive: false,
    activeStudentsCount: 0,
    totalConfusions: 2,
    pages: [
      {
        pageNumber: 1,
        chapterTitle: 'Chapter 2: Epistemic Trust',
        sectionTitle: '2.1 Trust Dynamics in Networked Discourse',
        paragraphs: [
          {
            id: 'p2_1_1',
            pageNumber: 1,
            type: 'heading',
            text: '2.1 Trust Networks and Source Transparency',
            confusionCount: 2,
            highlightCount: 3,
            confusionNotes: [
              { studentId: 'std_2', studentName: 'Elena Chen', comment: 'How do students verify decentralized citations?', timestamp: 'Yesterday' }
            ],
          },
          {
            id: 'p2_1_2',
            pageNumber: 1,
            type: 'body',
            text: 'When reading materials are collaboratively marked, students frequently anchor their trust in peer consensus rather than primary citation rigor. Understanding this vulnerability is essential for critical digital literacy.',
            confusionCount: 0,
            highlightCount: 4,
            confusionNotes: [],
          }
        ]
      }
    ]
  },
  {
    id: 'lesson_3',
    title: 'Lesson 3: Cognitive Scaffolding',
    subtitle: 'Structural Frameworks for Dense Scientific Literatures',
    totalPages: 24,
    currentPage: 1,
    category: 'Pedagogy',
    isActive: false,
    activeStudentsCount: 0,
    totalConfusions: 0,
    pages: []
  },
  {
    id: 'lesson_4',
    title: 'Lesson 4: Peer Critique & Synthesis',
    subtitle: 'Dialogic Annotation Systems in Higher Education',
    totalPages: 16,
    currentPage: 1,
    category: 'Collaboration',
    isActive: false,
    activeStudentsCount: 0,
    totalConfusions: 1,
    pages: []
  }
];

export const INITIAL_QUESTIONS: QAQuestion[] = [
  {
    id: 'q_1',
    studentId: 'std_1',
    studentName: 'Alex Rivera',
    avatarColor: '#6366F1',
    pageNumber: 3,
    paragraphId: 'p3_4',
    text: 'How does an instructor distinguish between healthy epistemic friction and total conceptual disorientation?',
    upvotes: 8,
    upvotedBy: ['std_2', 'std_3', 'std_4', 'std_5', 'std_7'],
    timestamp: '10:22 AM',
    isAnswered: false,
  },
  {
    id: 'q_2',
    studentId: 'std_3',
    studentName: 'Jordan Vance',
    avatarColor: '#10B981',
    pageNumber: 3,
    paragraphId: 'p3_4',
    text: 'If we highlight everything that seems important, does that diminish the signaling value of red confusion asterisks?',
    upvotes: 6,
    upvotedBy: ['std_1', 'std_6', 'std_8'],
    timestamp: '10:25 AM',
    isAnswered: true,
    teacherResponse: 'Precisely! Highlights indicate salience; confusion asterisks explicitly request collective intervention.',
  },
  {
    id: 'q_3',
    studentId: 'std_7',
    studentName: 'Sofia Rodriguez',
    avatarColor: '#14B8A6',
    pageNumber: 3,
    paragraphId: 'p3_2',
    text: 'Can we hide peer highlights during the first read-through to form our own initial thoughts?',
    upvotes: 4,
    upvotedBy: ['std_4', 'std_5'],
    timestamp: '10:27 AM',
    isAnswered: false,
  }
];

export const INITIAL_SESSION_STATE: SessionState = {
  roomCode: '842-195',
  isLive: true,
  isPaused: false,
  startedAt: '10:00 AM',
  durationSeconds: 945, // ~15 mins elapsed
  forcePageSync: false,
  heatmapEnabled: true,
  activeLessonId: 'lesson_1',
  teacherPage: 3,
  broadcastMessage: 'Welcome everyone! Please read Section 1.3 carefully. Mark asterisks on any confusing terms.',
};
