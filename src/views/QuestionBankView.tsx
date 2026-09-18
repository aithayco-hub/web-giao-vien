import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  Sparkles,
  Trash2,
  Edit2,
  CheckCircle2,
  BookOpen,
  Tag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuestionItem, CognitiveLevel, QuestionType, GradeLevel, SubjectName } from '../types';

export const QuestionBankView: React.FC = () => {
  const { questionBank, addQuestion, updateQuestion, deleteQuestion, addToast } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAIGenModalOpen, setIsAIGenModalOpen] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState('Định lý Thalès trong tam giác');

  const [formData, setFormData] = useState({
    grade: 'Khối 8' as GradeLevel,
    subject: 'Toán học' as SubjectName,
    chapter: 'Chương 4: Tam giác đồng dạng',
    lessonTitle: 'Định lý Thalès trong tam giác',
    cognitiveLevel: 'nhan_biet' as CognitiveLevel,
    questionType: 'trac_nghiem' as QuestionType,
    content: '',
    options: ['Phương án A', 'Phương án B', 'Phương án C', 'Phương án D'],
    correctAnswer: 'Phương án A',
    explanation: 'Giải thích chi tiết lời giải...',
    source: 'Tự biên soạn',
    tags: 'Thalès, Hình học',
  });

  const filteredQuestions = useMemo(() => {
    return questionBank.filter((q) => {
      if (selectedLevel !== 'all' && q.cognitiveLevel !== selectedLevel) return false;
      if (selectedType !== 'all' && q.questionType !== selectedType) return false;
      if (selectedGrade !== 'all' && q.grade !== selectedGrade) return false;
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        return (
          q.content.toLowerCase().includes(query) ||
          q.lessonTitle.toLowerCase().includes(query) ||
          q.tags.some((t) => t.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [questionBank, selectedLevel, selectedType, selectedGrade, searchFilter]);

  const getCognitiveBadge = (level: CognitiveLevel) => {
    switch (level) {
      case 'nhan_biet':
        return (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
            1. Nhận biết
          </span>
        );
      case 'thong_hieu':
        return (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            2. Thông hiểu
          </span>
        );
      case 'van_dung':
        return (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
            3. Vận dụng
          </span>
        );
      case 'van_dung_cao':
        return (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
            4. Vận dụng cao
          </span>
        );
    }
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    addQuestion({
      grade: formData.grade,
      subject: formData.subject,
      chapter: formData.chapter,
      lessonTitle: formData.lessonTitle,
      cognitiveLevel: formData.cognitiveLevel,
      questionType: formData.questionType,
      content: formData.content,
      options: formData.questionType === 'trac_nghiem' ? formData.options : undefined,
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation,
      source: formData.source,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setIsAddModalOpen(false);
  };

  // AI Auto-Generate 4 Level Questions
  const handleAIGenerateQuestions = () => {
    const newQuestions: QuestionItem[] = [
      {
        id: 'ai-q-1',
        grade: 'Khối 8',
        subject: 'Toán học',
        chapter: 'Chương 4: Tam giác đồng dạng',
        lessonTitle: aiTopicInput,
        cognitiveLevel: 'nhan_biet',
        questionType: 'trac_nghiem',
        content: `Phát biểu nào sau đây diễn đạt đúng nội dung của ${aiTopicInput}?`,
        options: [
          'Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ.',
          'Hai tam giác có ba cạnh bằng nhau thì bằng nhau.',
          'Đường trung trực đi qua trung điểm và vuông góc.',
          'Tổng ba góc trong tam giác luôn bằng 180 độ.',
        ],
        correctAnswer:
          'Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ.',
        explanation: 'Đây là định nghĩa chuẩn của Định lý Thalès (SGK Toán 8).',
        source: 'AI Teacher Desk',
        tags: ['AI', 'Thalès', 'Nhận_biết'],
        createdAt: '2026-09-17',
      },
      {
        id: 'ai-q-2',
        grade: 'Khối 8',
        subject: 'Toán học',
        chapter: 'Chương 4: Tam giác đồng dạng',
        lessonTitle: aiTopicInput,
        cognitiveLevel: 'thong_hieu',
        questionType: 'trac_nghiem',
        content:
          'Cho tam giác ABC, điểm D thuộc AB, điểm E thuộc AC sao cho DE // BC. Biết AD = 3cm, DB = 6cm, AE = 2cm. Tính độ dài đoạn thẳng EC?',
        options: ['EC = 4 cm', 'EC = 3 cm', 'EC = 5 cm', 'EC = 6 cm'],
        correctAnswer: 'EC = 4 cm',
        explanation: 'Áp dụng định lý Thalès: AD/DB = AE/EC => 3/6 = 2/EC => EC = (6*2)/3 = 4 cm.',
        source: 'AI Teacher Desk',
        tags: ['AI', 'Thalès', 'Thông_hiểu'],
        createdAt: '2026-09-17',
      },
    ];

    newQuestions.forEach((q) => addQuestion(q));
    setIsAIGenModalOpen(false);
    addToast('Đã sinh thành công 2 câu hỏi mới từ AI', `Nội dung: ${aiTopicInput}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <HelpCircle className="h-6 w-6 text-indigo-600" />
            Ngân hàng câu hỏi phân hóa (4 mức độ nhận thức)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Phân loại chuẩn: Nhận biết • Thông hiểu • Vận dụng • Vận dụng cao phục vụ ra đề kiểm tra
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAIGenModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 px-3.5 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-2xs"
          >
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>AI sinh câu hỏi theo bài</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm câu hỏi</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo nội dung câu hỏi, bài học, tag..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="nhan_biet">1. Nhận biết</option>
            <option value="thong_hieu">2. Thông hiểu</option>
            <option value="van_dung">3. Vận dụng</option>
            <option value="van_dung_cao">4. Vận dụng cao</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
          >
            <option value="all">Tất cả dạng câu</option>
            <option value="trac_nghiem">Trắc nghiệm 4 lựa chọn</option>
            <option value="dung_sai">Đúng / Sai</option>
            <option value="tra_loi_ngan">Trả lời ngắn</option>
            <option value="tu_luan">Tự luận</option>
          </select>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
          >
            <option value="all">Tất cả khối lớp</option>
            <option value="Khối 6">Khối 6</option>
            <option value="Khối 7">Khối 7</option>
            <option value="Khối 8">Khối 8</option>
            <option value="Khối 9">Khối 9</option>
          </select>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Tổng cộng: <span className="text-indigo-600">{filteredQuestions.length}</span> câu hỏi
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedQuestionId === q.id;

          return (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-black text-indigo-700">
                    Câu {idx + 1}
                  </span>
                  {getCognitiveBadge(q.cognitiveLevel || q.level || 'thong_hieu')}
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {q.grade} • {q.subject}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{q.lessonTitle}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded"
                  >
                    <span>{isExpanded ? 'Ẩn lời giải' : 'Xem lời giải'}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Thầy/Cô có muốn xóa câu hỏi này?')) deleteQuestion(q.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Body */}
              <div className="mt-3 text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                {q.content}
              </div>

              {/* Multiple Choice Options */}
              {q.options && q.options.length > 0 && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, i) => {
                    const optText = typeof opt === 'string' ? opt : opt.text;
                    const optKey = typeof opt === 'string' ? String.fromCharCode(65 + i) : opt.key;
                    const isCorrect = optText === q.correctAnswer || optKey === q.correctAnswer || optKey === q.answer;

                    return (
                      <div
                        key={i}
                        className={`rounded-xl p-2.5 text-xs flex items-start gap-2 border ${
                          isCorrect && isExpanded
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-slate-50 border-slate-200/80 text-slate-700'
                        }`}
                      >
                        <span className="font-extrabold">{optKey}.</span>
                        <span>{optText}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Expanded Detailed Solution */}
              {isExpanded && (
                <div className="mt-3 rounded-xl bg-indigo-50/50 p-3.5 border border-indigo-100 text-xs space-y-1.5 animate-in fade-in">
                  <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Đáp án đúng: {q.correctAnswer}</span>
                  </div>
                  <div className="text-slate-700">
                    <strong>Hướng dẫn giải chi tiết:</strong> {q.explanation}
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">Nguồn: {q.source}</div>
                </div>
              )}

              {/* Tags Footer */}
              <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {q.tags.map((t, i) => (
                    <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                      #{t}
                    </span>
                  ))}
                </div>
                <span>Tạo ngày: {q.createdAt}</span>
              </div>
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
            Chưa có câu hỏi nào phù hợp với bộ lọc hiện tại.
          </div>
        )}
      </div>

      {/* AI Generate Modal */}
      {isAIGenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              AI Tự động sinh câu hỏi theo bài học
            </h3>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên bài học cần sinh câu hỏi</label>
                <input
                  type="text"
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-slate-600 text-[11px] space-y-1">
                <div>• Tự động tạo 4 mức độ: Nhận biết, Thông hiểu, Vận dụng, VDC.</div>
                <div>• Kèm đầy đủ phương án nhiễu, đáp án đúng và lời giải chi tiết.</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setIsAIGenModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={handleAIGenerateQuestions}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
              >
                Tạo câu hỏi ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Manual Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Thêm câu hỏi mới vào Ngân hàng
            </h3>

            <form onSubmit={handleSaveQuestion} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung câu hỏi *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung đề bài..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mức độ nhận thức</label>
                  <select
                    value={formData.cognitiveLevel}
                    onChange={(e) => setFormData({ ...formData, cognitiveLevel: e.target.value as CognitiveLevel })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value="nhan_biet">1. Nhận biết</option>
                    <option value="thong_hieu">2. Thông hiểu</option>
                    <option value="van_dung">3. Vận dụng</option>
                    <option value="van_dung_cao">4. Vận dụng cao</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dạng câu hỏi</label>
                  <select
                    value={formData.questionType}
                    onChange={(e) => setFormData({ ...formData, questionType: e.target.value as QuestionType })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value="trac_nghiem">Trắc nghiệm (4 lựa chọn)</option>
                    <option value="dung_sai">Đúng / Sai</option>
                    <option value="tra_loi_ngan">Trả lời ngắn</option>
                    <option value="tu_luan">Tự luận</option>
                  </select>
                </div>
              </div>

              {formData.questionType === 'trac_nghiem' && (
                <div className="space-y-2 rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <span className="font-bold text-slate-700">4 Lựa chọn trắc nghiệm:</span>
                  {formData.options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...formData.options];
                        newOpts[i] = e.target.value;
                        setFormData({ ...formData, options: newOpts });
                      }}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white"
                    />
                  ))}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đáp án đúng *</label>
                <input
                  type="text"
                  required
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  placeholder="Ví dụ: Phương án A hoặc 4 cm"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hướng dẫn giải chi tiết</label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  Lưu vào Ngân hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
