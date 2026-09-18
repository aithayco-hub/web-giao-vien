import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ClassInfo,
  TeachingPlanLesson,
  TimetableSlot,
  KHBDItem,
  LearningMaterial,
  QuestionItem,
  TeacherRecord,
  TaskItem,
  MeetingItem,
  TeachingIdea,
  AIStudioItem,
  ExamSheet,
  ActiveTab,
  TeacherProfile,
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_TEACHING_PLAN,
  INITIAL_TIMETABLE,
  INITIAL_KHBD,
  INITIAL_MATERIALS,
  INITIAL_QUESTIONS,
  INITIAL_TASKS,
  INITIAL_MEETINGS,
  INITIAL_RECORDS,
  INITIAL_IDEAS,
  INITIAL_AI_STUDIO,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & View
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Data Collections
  classes: ClassInfo[];
  teachingPlan: TeachingPlanLesson[];
  timetable: TimetableSlot[];
  khbdList: KHBDItem[];
  materials: LearningMaterial[];
  questions: QuestionItem[];
  questionBank: QuestionItem[];
  examSheets: ExamSheet[];
  records: TeacherRecord[];
  tasks: TaskItem[];
  meetings: MeetingItem[];
  ideas: TeachingIdea[];
  aiStudioList: AIStudioItem[];
  teacherProfile: TeacherProfile;

  // Toast
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Actions: Teaching Plan
  addTeachingPlanLesson: (lesson: Omit<TeachingPlanLesson, 'id'>) => void;
  updateTeachingPlanLesson: (id: string, updates: Partial<TeachingPlanLesson>) => void;
  deleteTeachingPlanLesson: (id: string) => void;

  // Actions: Timetable
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  updateTimetableSlot: (id: string, updates: Partial<TimetableSlot>) => void;
  deleteTimetableSlot: (id: string) => void;

  // Actions: KHBD
  addKHBD: (khbd: Omit<KHBDItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateKHBD: (id: string, updates: Partial<KHBDItem>) => void;
  deleteKHBD: (id: string) => void;

  // Actions: Materials
  addMaterial: (material: Omit<LearningMaterial, 'id' | 'createdAt'>) => string;
  updateMaterial: (id: string, updates: Partial<LearningMaterial>) => void;
  deleteMaterial: (id: string) => void;

  // Actions: Questions
  addQuestion: (question: Omit<QuestionItem, 'id'>) => string;
  updateQuestion: (id: string, updates: Partial<QuestionItem>) => void;
  deleteQuestion: (id: string) => void;
  duplicateQuestion: (id: string) => void;

  // Actions: Exam Sheet
  addExamSheet: (sheet: Omit<ExamSheet, 'id' | 'createdAt'>) => string;
  deleteExamSheet: (id: string) => void;

  // Actions: Tasks
  addTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => string;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;
  toggleTaskChecklist: (taskId: string, checklistId: string) => void;

  // Actions: Meetings
  addMeeting: (meeting: Omit<MeetingItem, 'id'>) => void;
  updateMeeting: (id: string, updates: Partial<MeetingItem>) => void;
  deleteMeeting: (id: string) => void;
  convertMeetingActionToTask: (meetingId: string, actionId: string) => void;

  // Actions: Ideas
  addIdea: (idea: Omit<TeachingIdea, 'id' | 'createdAt'>) => string;
  updateIdea: (id: string, updates: Partial<TeachingIdea>) => void;
  deleteIdea: (id: string) => void;

  // Actions: Records
  addRecord: (record: Omit<TeacherRecord, 'id'>) => void;
  updateRecord: (id: string, updates: Partial<TeacherRecord>) => void;
  deleteRecord: (id: string) => void;

  // Actions: AI Studio
  addAIStudioItem: (item: Omit<AIStudioItem, 'id' | 'createdAt'>) => string;

  // Management
  updateProfile: (updates: Partial<TeacherProfile>) => void;
  resetAllData: () => void;
  resetToSampleData: () => void;
  exportJSON: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CLASSES: 'teacherdesk_classes_v1',
  TEACHING_PLAN: 'teacherdesk_plan_v1',
  TIMETABLE: 'teacherdesk_timetable_v1',
  KHBD: 'teacherdesk_khbd_v1',
  MATERIALS: 'teacherdesk_materials_v1',
  QUESTIONS: 'teacherdesk_questions_v1',
  EXAM_SHEETS: 'teacherdesk_exams_v1',
  RECORDS: 'teacherdesk_records_v1',
  TASKS: 'teacherdesk_tasks_v1',
  MEETINGS: 'teacherdesk_meetings_v1',
  IDEAS: 'teacherdesk_ideas_v1',
  AI_STUDIO: 'teacherdesk_aistudio_v1',
  PROFILE: 'teacherdesk_profile_v1',
};

const DEFAULT_PROFILE: TeacherProfile = {
  name: 'Thầy Nguyễn Văn An',
  school: 'Trường THCS Lê Quý Đôn',
  subjects: ['Toán học', 'KHTN'],
  grades: ['Khối 8', 'Khối 9'],
  classes: ['8A1', '8A2', '9A1'],
  homeroomClass: '8A1',
  academicYear: '2026 - 2027',
  semester: 'Học kỳ 1',
};

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error loading from localStorage for key ${key}`, err);
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // States
  const [classes] = useState<ClassInfo[]>(() => safeLoad(STORAGE_KEYS.CLASSES, INITIAL_CLASSES));
  const [teachingPlan, setTeachingPlan] = useState<TeachingPlanLesson[]>(() =>
    safeLoad(STORAGE_KEYS.TEACHING_PLAN, INITIAL_TEACHING_PLAN)
  );
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() =>
    safeLoad(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE)
  );
  const [khbdList, setKhbdList] = useState<KHBDItem[]>(() =>
    safeLoad(STORAGE_KEYS.KHBD, INITIAL_KHBD)
  );
  const [materials, setMaterials] = useState<LearningMaterial[]>(() =>
    safeLoad(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS)
  );
  const [questions, setQuestions] = useState<QuestionItem[]>(() =>
    safeLoad(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS)
  );
  const [examSheets, setExamSheets] = useState<ExamSheet[]>(() =>
    safeLoad(STORAGE_KEYS.EXAM_SHEETS, [])
  );
  const [records, setRecords] = useState<TeacherRecord[]>(() =>
    safeLoad(STORAGE_KEYS.RECORDS, INITIAL_RECORDS)
  );
  const [tasks, setTasks] = useState<TaskItem[]>(() =>
    safeLoad(STORAGE_KEYS.TASKS, INITIAL_TASKS)
  );
  const [meetings, setMeetings] = useState<MeetingItem[]>(() =>
    safeLoad(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS)
  );
  const [ideas, setIdeas] = useState<TeachingIdea[]>(() =>
    safeLoad(STORAGE_KEYS.IDEAS, INITIAL_IDEAS)
  );
  const [aiStudioList, setAiStudioList] = useState<AIStudioItem[]>(() =>
    safeLoad(STORAGE_KEYS.AI_STUDIO, INITIAL_AI_STUDIO)
  );
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() =>
    safeLoad(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE)
  );

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(teacherProfile));
    } catch (e) {
      console.warn(e);
    }
  }, [teacherProfile]);

  const updateProfile = (updates: Partial<TeacherProfile>) => {
    setTeacherProfile((prev) => ({ ...prev, ...updates }));
    addToast('Đã cập nhật thông tin hồ sơ giáo viên');
  };

  const resetAllData = () => {
    resetToSampleData();
    setTeacherProfile(DEFAULT_PROFILE);
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHING_PLAN, JSON.stringify(teachingPlan));
    } catch (e) {
      console.warn(e);
    }
  }, [teachingPlan]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
    } catch (e) {
      console.warn(e);
    }
  }, [timetable]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.KHBD, JSON.stringify(khbdList));
    } catch (e) {
      console.warn(e);
    }
  }, [khbdList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
    } catch (e) {
      console.warn(e);
    }
  }, [materials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.warn(e);
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXAM_SHEETS, JSON.stringify(examSheets));
    } catch (e) {
      console.warn(e);
    }
  }, [examSheets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (e) {
      console.warn(e);
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
    } catch (e) {
      console.warn(e);
    }
  }, [meetings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
    } catch (e) {
      console.warn(e);
    }
  }, [ideas]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AI_STUDIO, JSON.stringify(aiStudioList));
    } catch (e) {
      console.warn(e);
    }
  }, [aiStudioList]);

  // Actions
  const addTeachingPlanLesson = (lesson: Omit<TeachingPlanLesson, 'id'>) => {
    const newLesson: TeachingPlanLesson = { ...lesson, id: 'tp-' + Date.now() };
    setTeachingPlan((prev) => [newLesson, ...prev]);
    addToast('Đã thêm bài học vào Kế hoạch giảng dạy', `${newLesson.title} (${newLesson.className})`);
  };

  const updateTeachingPlanLesson = (id: string, updates: Partial<TeachingPlanLesson>) => {
    setTeachingPlan((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addToast('Đã cập nhật kế hoạch bài học');
  };

  const deleteTeachingPlanLesson = (id: string) => {
    setTeachingPlan((prev) => prev.filter((item) => item.id !== id));
    addToast('Đã xóa bài học khỏi phân phối chương trình', undefined, 'info');
  };

  const addTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = { ...slot, id: 'tt-' + Date.now() };
    setTimetable((prev) => [...prev, newSlot]);
    addToast('Đã thêm tiết dạy vào thời khóa biểu', `Thứ ${newSlot.dayOfWeek === 8 ? 'CN' : newSlot.dayOfWeek} - Tiết ${newSlot.period}`);
  };

  const updateTimetableSlot = (id: string, updates: Partial<TimetableSlot>) => {
    setTimetable((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addToast('Đã cập nhật thông tin tiết học');
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable((prev) => prev.filter((item) => item.id !== id));
    addToast('Đã xóa tiết dạy khỏi thời khóa biểu', undefined, 'info');
  };

  const addKHBD = (khbd: Omit<KHBDItem, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const today = new Date().toISOString().split('T')[0];
    const id = 'khbd-' + Date.now();
    const newKHBD: KHBDItem = {
      ...khbd,
      id,
      createdAt: today,
      updatedAt: today,
    };
    setKhbdList((prev) => [newKHBD, ...prev]);
    addToast('Đã thêm giáo án mới vào Kho KHBD', newKHBD.title);
    return id;
  };

  const updateKHBD = (id: string, updates: Partial<KHBDItem>) => {
    const today = new Date().toISOString().split('T')[0];
    setKhbdList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: today } : item))
    );
    addToast('Đã cập nhật Kế hoạch bài dạy');
  };

  const deleteKHBD = (id: string) => {
    setKhbdList((prev) => prev.filter((item) => item.id !== id));
    addToast('Đã xóa KHBD', undefined, 'info');
  };

  const addMaterial = (material: Omit<LearningMaterial, 'id' | 'createdAt'>): string => {
    const today = new Date().toISOString().split('T')[0];
    const id = 'mat-' + Date.now();
    const newMaterial: LearningMaterial = {
      ...material,
      id,
      createdAt: today,
    };
    setMaterials((prev) => [newMaterial, ...prev]);
    addToast('Đã lưu tài liệu vào Kho học liệu', newMaterial.title);
    return id;
  };

  const updateMaterial = (id: string, updates: Partial<LearningMaterial>) => {
    setMaterials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addToast('Đã cập nhật học liệu');
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((item) => item.id !== id));
    addToast('Đã xóa học liệu', undefined, 'info');
  };

  const addQuestion = (question: Omit<QuestionItem, 'id'>): string => {
    const id = 'q-' + Date.now();
    const newQ: QuestionItem = { ...question, id };
    setQuestions((prev) => [newQ, ...prev]);
    addToast('Đã thêm câu hỏi vào ngân hàng', `Mức độ: ${question.level}`);
    return id;
  };

  const updateQuestion = (id: string, updates: Partial<QuestionItem>) => {
    setQuestions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addToast('Đã cập nhật câu hỏi');
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((item) => item.id !== id));
    addToast('Đã xóa câu hỏi khỏi ngân hàng', undefined, 'info');
  };

  const duplicateQuestion = (id: string) => {
    const found = questions.find((q) => q.id === id);
    if (!found) return;
    const duplicated: QuestionItem = {
      ...found,
      id: 'q-' + Date.now(),
      content: found.content + ' (Bản sao)',
    };
    setQuestions((prev) => [duplicated, ...prev]);
    addToast('Đã nhân bản câu hỏi thành công');
  };

  const addExamSheet = (sheet: Omit<ExamSheet, 'id' | 'createdAt'>): string => {
    const today = new Date().toISOString().split('T')[0];
    const id = 'exam-' + Date.now();
    const newSheet: ExamSheet = { ...sheet, id, createdAt: today };
    setExamSheets((prev) => [newSheet, ...prev]);
    addToast('Đã tạo đề kiểm tra & phiếu học tập thành công', `${newSheet.title} (${newSheet.variants.length} mã đề)`);
    return id;
  };

  const deleteExamSheet = (id: string) => {
    setExamSheets((prev) => prev.filter((item) => item.id !== id));
    addToast('Đã xóa đề kiểm tra', undefined, 'info');
  };

  const addTask = (task: Omit<TaskItem, 'id' | 'createdAt'>): string => {
    const today = new Date().toISOString().split('T')[0];
    const id = 'task-' + Date.now();
    const newTask: TaskItem = { ...task, id, createdAt: today };
    setTasks((prev) => [newTask, ...prev]);
    addToast('Đã tạo công việc mới', newTask.title);
    return id;
  };

  const updateTask = (id: string, updates: Partial<TaskItem>) => {
    setTasks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
    addToast('Đã xóa công việc', undefined, 'info');
  };

  const toggleTaskChecklist = (taskId: string, checklistId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const newChecklist = task.checklist.map((item) =>
          item.id === checklistId ? { ...item, done: !item.done } : item
        );
        const allDone = newChecklist.length > 0 && newChecklist.every((item) => item.done);
        return {
          ...task,
          checklist: newChecklist,
          status: allDone ? 'hoan_thanh' : task.status === 'hoan_thanh' ? 'dang_lam' : task.status,
        };
      })
    );
  };

  const addMeeting = (meeting: Omit<MeetingItem, 'id'>) => {
    const newMeeting: MeetingItem = { ...meeting, id: 'meet-' + Date.now() };
    setMeetings((prev) => [newMeeting, ...prev]);
    addToast('Đã thêm cuộc họp mới', newMeeting.title);
  };

  const updateMeeting = (id: string, updates: Partial<MeetingItem>) => {
    setMeetings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addToast('Đã cập nhật biên bản cuộc họp');
  };

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((item) => item.id !== id));
    addToast('Đã xóa cuộc họp', undefined, 'info');
  };

  // 1-Click Convert Meeting Action Item to Task!
  const convertMeetingActionToTask = (meetingId: string, actionId: string) => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) return;
    const action = meeting.myActionItems.find((a) => (typeof a === 'string' ? a === actionId : a.id === actionId));
    if (!action) return;

    const actionText = typeof action === 'string' ? action : action.text;
    const actionDeadline = (typeof action !== 'string' && action.deadline) ? action.deadline : new Date().toISOString().split('T')[0];

    // Create task
    const createdTaskId = addTask({
      title: actionText,
      description: `Đầu việc phát sinh từ cuộc họp: "${meeting.title}" (${meeting.dateTime})`,
      category: 'hop',
      priority: 'cao',
      deadline: actionDeadline,
      status: 'chua_lam',
      checklist: [{ id: 'cl-1', text: actionText, done: false }],
      linkedMaterials: [],
      sourceMeetingId: meeting.id,
    });

    // Mark action as converted in meeting
    setMeetings((prev) =>
      prev.map((m) =>
        m.id === meetingId
          ? {
              ...m,
              myActionItems: m.myActionItems.map((a) => {
                if (typeof a === 'string') {
                  return a === actionId ? { id: 'act-' + Date.now(), text: a, convertedToTaskId: createdTaskId } : a;
                }
                return a.id === actionId ? { ...a, convertedToTaskId: createdTaskId } : a;
              }),
            }
          : m
      )
    );

    addToast('Đã chuyển đầu việc thành Task', `Xem trong tab "Công việc & Deadline"`);
  };

  const addIdea = (idea: Omit<TeachingIdea, 'id' | 'createdAt'>): string => {
    const today = new Date().toISOString().split('T')[0];
    const id = 'idea-' + Date.now();
    const newIdea: TeachingIdea = { ...idea, id, createdAt: today };
    setIdeas((prev) => [newIdea, ...prev]);
    addToast('Đã lưu ý tưởng giảng dạy', newIdea.title);
    return id;
  };

  const updateIdea = (id: string, updates: Partial<TeachingIdea>) => {
    setIdeas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addToast('Đã cập nhật ý tưởng');
  };

  const deleteIdea = (id: string) => {
    setIdeas((prev) => prev.filter((item) => item.id !== id));
    addToast('Đã xóa ý tưởng', undefined, 'info');
  };

  const addRecord = (record: Omit<TeacherRecord, 'id'>) => {
    const newRecord: TeacherRecord = { ...record, id: 'rec-' + Date.now() };
    setRecords((prev) => [newRecord, ...prev]);
    addToast('Đã thêm hồ sơ chuyên môn', newRecord.title);
  };

  const updateRecord = (id: string, updates: Partial<TeacherRecord>) => {
    setRecords((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addToast('Đã cập nhật hồ sơ sổ sách');
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
    addToast('Đã xóa hồ sơ', undefined, 'info');
  };

  const addAIStudioItem = (item: Omit<AIStudioItem, 'id' | 'createdAt'>): string => {
    const today = new Date().toISOString().split('T')[0];
    const id = 'studio-' + Date.now();
    const newItem: AIStudioItem = { ...item, id, createdAt: today };
    setAiStudioList((prev) => [newItem, ...prev]);
    addToast('Đã lưu bộ học liệu AI vào Studio', newItem.title);
    return id;
  };

  const resetToSampleData = () => {
    setTeachingPlan(INITIAL_TEACHING_PLAN);
    setTimetable(INITIAL_TIMETABLE);
    setKhbdList(INITIAL_KHBD);
    setMaterials(INITIAL_MATERIALS);
    setQuestions(INITIAL_QUESTIONS);
    setExamSheets([]);
    setRecords(INITIAL_RECORDS);
    setTasks(INITIAL_TASKS);
    setMeetings(INITIAL_MEETINGS);
    setIdeas(INITIAL_IDEAS);
    setAiStudioList(INITIAL_AI_STUDIO);
    addToast('Đã khôi phục dữ liệu mẫu hoàn chỉnh', undefined, 'info');
  };

  const exportJSON = () => {
    const data = {
      classes,
      teachingPlan,
      timetable,
      khbdList,
      materials,
      questions,
      examSheets,
      records,
      tasks,
      meetings,
      ideas,
      aiStudioList,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teacher-desk-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Đã xuất file sao lưu dữ liệu JSON thành công');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        classes,
        teachingPlan,
        timetable,
        khbdList,
        materials,
        questions,
        questionBank: questions,
        examSheets,
        records,
        tasks,
        meetings,
        ideas,
        aiStudioList,
        teacherProfile,
        updateProfile,
        resetAllData,
        toasts,
        addToast,
        removeToast,
        addTeachingPlanLesson,
        updateTeachingPlanLesson,
        deleteTeachingPlanLesson,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        addKHBD,
        updateKHBD,
        deleteKHBD,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        duplicateQuestion,
        addExamSheet,
        deleteExamSheet,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskChecklist,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        convertMeetingActionToTask,
        addIdea,
        updateIdea,
        deleteIdea,
        addRecord,
        updateRecord,
        deleteRecord,
        addAIStudioItem,
        resetToSampleData,
        exportJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
