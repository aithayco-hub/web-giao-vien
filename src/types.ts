export type GradeLevel = 'Khối 6' | 'Khối 7' | 'Khối 8' | 'Khối 9' | 'Khối 10' | 'Khối 11' | 'Khối 12';

export type SubjectName = 'Toán học' | 'KHTN' | 'Ngữ văn' | 'Tiếng Anh' | 'Lịch sử & Địa lý' | 'Tin học' | 'GDCD' | 'Công nghệ';

export type LessonStatus = 'chua_day' | 'dang_day' | 'da_day' | 'cham_tien_do';

export interface ClassInfo {
  id: string;
  name: string; // e.g. 8A1, 8A2, 9A1
  grade: GradeLevel;
  subject: SubjectName;
  room: string;
  totalStudents: number;
}

export interface TeachingPlanLesson {
  id: string;
  schoolYear: string;
  grade: GradeLevel;
  subject: SubjectName;
  className: string;
  week: number;
  ppctPeriod: number; // Tiết PPCT
  title: string;
  periodsCount: number;
  plannedDate: string; // YYYY-MM-DD
  actualDate?: string; // YYYY-MM-DD
  status: LessonStatus;
  notes?: string;
  khbdId?: string;
  materialsIds?: string[];
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: number; // 2: Thứ 2, 3: Thứ 3, ..., 7: Thứ 7
  period: number; // 1 to 5 (Sáng), 6 to 10 (Chiều)
  session: 'sang' | 'chieu';
  timeRange: string; // e.g. "07:15 - 08:00"
  className: string;
  subject: SubjectName;
  room: string;
  lessonTitle: string;
  ppctPeriod: number;
  khbdId?: string;
  materialsIds?: string[];
  notes?: string;
}

export interface KHBDItem {
  id: string;
  title: string;
  grade: GradeLevel;
  subject: SubjectName;
  week: number;
  ppctPeriod: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  fileUrl?: string;
  fileType?: string;
  fileSizeBytes?: number;
  objectives?: string; // Mục tiêu bài dạy
  activities?: string; // Chuỗi hoạt động
  notes?: string;
  isPrepared: boolean;
  linkedMaterialsCount?: number;
}

export type MaterialType =
  | 'powerpoint'
  | 'pdf'
  | 'word'
  | 'image'
  | 'video'
  | 'worksheet'
  | 'phieu_hoc_tap'
  | 'infographic'
  | 'flashcard'
  | 'game'
  | 'webapp'
  | 'app_edtech'
  | 'link'
  | 'other';

export interface LearningMaterial {
  id: string;
  title: string;
  type: MaterialType;
  subject: SubjectName;
  grade: GradeLevel;
  lessonTitle?: string;
  relatedLesson?: string;
  tags: string[];
  createdAt: string;
  notes?: string;
  description?: string;
  urlOrFile?: string;
  urlOrPath?: string;
  size?: string;
  rating?: number;
  isFavorite?: boolean;
}

export type MaterialItem = LearningMaterial;

export type QuestionType =
  | 'mcq'
  | 'true_false'
  | 'short_answer'
  | 'essay'
  | 'trac_nghiem'
  | 'dung_sai'
  | 'tra_loi_ngan'
  | 'tu_luan';

export type QuestionLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';
export type CognitiveLevel = QuestionLevel;

export interface QuestionOptionObj {
  key: 'A' | 'B' | 'C' | 'D' | string;
  text: string;
}

export type QuestionOption = QuestionOptionObj | string;

export interface QuestionItem {
  id: string;
  subject: SubjectName;
  grade: GradeLevel;
  topic?: string;
  chapter?: string;
  lessonTitle: string;
  type?: QuestionType;
  questionType?: QuestionType;
  level?: QuestionLevel;
  cognitiveLevel?: QuestionLevel;
  content: string;
  options?: QuestionOption[];
  answer?: string;
  correctAnswer?: string;
  explanation: string;
  source?: string;
  tags: string[];
  createdAt?: string;
}

export interface ExamSheet {
  id: string;
  title: string;
  subject: SubjectName;
  grade: GradeLevel;
  durationMinutes: number;
  totalQuestions: number;
  matrixDistribution: {
    nhan_biet: number;
    thong_hieu: number;
    van_dung: number;
    van_dung_cao: number;
  };
  questionIds: string[];
  variants: {
    code: string;
    questionOrder: string[];
  }[];
  createdAt: string;
  rubricGuide?: string;
}

export type RecordStatus =
  | 'hoan_thanh'
  | 'can_bo_sung'
  | 'sap_den_han'
  | 'qua_han'
  | 'chua_hoan_thanh'
  | 'da_hoan_thanh'
  | 'da_nop'
  | 'da_duyet';

export type RecordCategory =
  | 'ke_hoach_nam'
  | 'ke_hoach_ca_nhan'
  | 'ho_so_chuyen_mon'
  | 'bien_ban'
  | 'bao_cao'
  | 'minh_chung'
  | 'khac'
  | string;

export interface TeacherRecord {
  id: string;
  title: string;
  category: RecordCategory;
  status: RecordStatus;
  deadline: string;
  notes?: string;
  updatedAt?: string;
  fileUrl?: string;
  fileAttachments?: { name: string; size: string; type: string }[];
}

export type TaskCategory =
  | 'khbd'
  | 'bao_cao'
  | 'hop'
  | 'ra_de'
  | 'cham_bai'
  | 'nhap_diem'
  | 'chuyen_de'
  | 'day_hoc'
  | 'chu_nhiem'
  | 'chuyen_mon'
  | 'viec_truong'
  | 'khac';

export type TaskPriority = 'cao' | 'trung_binh' | 'thap';
export type TaskStatus = 'chua_lam' | 'dang_lam' | 'hoan_thanh' | 'qua_han' | 'can_lam';

export interface ChecklistItem {
  id: string;
  text: string;
  done?: boolean;
  completed?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  notes?: string;
  category: TaskCategory;
  priority: TaskPriority;
  deadline: string; // YYYY-MM-DD
  status: TaskStatus;
  checklist: ChecklistItem[];
  linkedMaterials?: string[];
  sourceMeetingId?: string;
  createdAt: string;
}

export type MeetingType =
  | 'hop_to'
  | 'hop_hoi_dong'
  | 'hoi_dong'
  | 'phu_huynh'
  | 'sinh_hoat_chuyen_mon'
  | 'tap_huan'
  | 'khac';

export interface MeetingActionItemObj {
  id: string;
  text: string;
  deadline?: string;
  convertedToTaskId?: string;
}

export type MeetingActionItem = MeetingActionItemObj | string;

export interface MeetingItem {
  id: string;
  title: string;
  type: MeetingType;
  dateTime: string; // YYYY-MM-DD HH:mm
  location: string;
  attendees?: string;
  chairperson?: string;
  content?: string;
  summary?: string;
  minutes?: string;
  conclusion?: string;
  myActionItems: MeetingActionItem[];
}

export type IdeaCategory =
  | 'khoi_dong'
  | 'tro_choi'
  | 'video'
  | 'cau_hoi_hay'
  | 'phuong_phap'
  | 'thi_nghiem'
  | 'hoat_dong_nhom'
  | 'ung_dung_ai'
  | 'mo_dau'
  | 'cau_chuyen'
  | 'thuc_te'
  | 'mini_game'
  | 'kich_thich_tu_duy'
  | 'du_an_nho';

export interface TeachingIdea {
  id: string;
  title: string;
  category: IdeaCategory;
  content: string;
  subject?: SubjectName | string;
  grade?: GradeLevel | string;
  relatedLesson?: string;
  tags: string[];
  link?: string;
  imageUrl?: string;
  isApplied?: boolean;
  createdAt?: string;
}

export type IdeaItem = TeachingIdea;

export interface TeacherProfile {
  name: string;
  school: string;
  subjects: string[];
  grades: string[];
  classes: string[];
  homeroomClass: string;
  academicYear: string;
  semester: string;
}

export interface AIStudioItem {
  id: string;
  title: string;
  subject: SubjectName;
  grade: GradeLevel;
  lessonName: string;
  mainContent: string;
  createdAt: string;
  outputs: {
    type: 'image_prompt' | 'infographic_prompt' | 'flashcard' | 'worksheet' | 'video_prompt' | 'game_idea' | 'game_prompt' | 'webapp_prompt';
    title: string;
    content: string;
  }[];
}

export type ActiveTab =
  | 'dashboard'
  | 'ke_hoach'
  | 'thoi_khoa_bieu'
  | 'bao_giang'
  | 'khbd'
  | 'hoc_lieu'
  | 'ai_center'
  | 'ngan_hang_cau_hoi'
  | 'tao_de'
  | 'ho_so'
  | 'cong_viec'
  | 'hop_chuyen_mon'
  | 'kho_y_tuong'
  | 'studio_ai'
  | 'hieu_suat'
  | 'cai_dat';
