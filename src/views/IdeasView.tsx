import React, { useState } from 'react';
import {
  Lightbulb,
  Plus,
  Sparkles,
  Search,
  CheckCircle2,
  Trash2,
  Tag,
  BookOpen,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IdeaItem, IdeaCategory } from '../types';

export const IdeasView: React.FC = () => {
  const { ideas, addIdea, updateIdea, deleteIdea, addToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'thuc_te' as IdeaCategory,
    grade: 'Khối 8',
    subject: 'Toán học',
    content: '',
    tags: 'Thực tế, Đo đạc, Sáng tạo',
    isApplied: false,
  });

  const filteredIdeas = ideas.filter((idea) => {
    if (selectedCategory !== 'all' && idea.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        idea.title.toLowerCase().includes(q) ||
        idea.content.toLowerCase().includes(q) ||
        idea.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getCategoryName = (cat: IdeaCategory) => {
    switch (cat) {
      case 'mo_dau':
        return 'Mở đầu bài học bất ngờ';
      case 'cau_chuyen':
        return 'Câu chuyện lịch sử khoa học';
      case 'thuc_te':
        return 'Ứng dụng thực tế đời sống';
      case 'thi_nghiem':
        return 'Thí nghiệm mini tại lớp';
      case 'mini_game':
        return 'Trò chơi mini 3 phút';
      case 'kich_thich_tu_duy':
        return 'Câu hỏi kích thích tư duy';
      case 'du_an_nho':
        return 'Dự án STEM nhỏ';
      default:
        return 'Ý tưởng phương pháp';
    }
  };

  const handleSaveIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addIdea({
      title: formData.title,
      category: formData.category,
      grade: formData.grade,
      subject: formData.subject,
      content: formData.content,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      isApplied: formData.isApplied,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Lightbulb className="h-6 w-6 text-amber-500" />
            Kho ý tưởng giảng dạy sáng tạo
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Lưu giữ tình huống mở đầu, câu chuyện lịch sử toán học, ứng dụng thực tiễn và thí nghiệm tương tác
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              addIdea({
                title: 'Ý tưởng khởi động: Đo chiều cao tòa nhà bằng bóng nắng',
                category: 'thuc_te',
                grade: 'Khối 8',
                subject: 'Toán học',
                content:
                  'Học sinh ra sân trường vào 9h sáng, dùng thước đo bóng của một cọc 1m và bóng của cây phượng cổ thụ, từ đó tính ra chiều cao cây phượng bằng định lý Thalès.',
                tags: ['AI_Gợi_ý', 'Thalès', 'Thực_hành'],
                isApplied: false,
              });
              addToast('AI đã gợi ý thêm 1 ý tưởng mới vào kho', 'Ý tưởng đo bóng cây bằng định lý Thalès');
            }}
            className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>AI Gợi ý ý tưởng mới</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm ý tưởng mới</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, từ khóa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none min-w-[220px]"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tất cả phân loại</option>
            <option value="mo_dau">Mở đầu bài học bất ngờ</option>
            <option value="cau_chuyen">Câu chuyện lịch sử khoa học</option>
            <option value="thuc_te">Ứng dụng thực tế đời sống</option>
            <option value="thi_nghiem">Thí nghiệm mini tại lớp</option>
            <option value="mini_game">Trò chơi mini 3 phút</option>
            <option value="kich_thich_tu_duy">Câu hỏi kích thích tư duy</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Tổng cộng: <span className="text-indigo-600">{filteredIdeas.length}</span> ý tưởng
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  {getCategoryName(idea.category)}
                </span>

                <button
                  onClick={() => updateIdea(idea.id, { isApplied: !idea.isApplied })}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                    idea.isApplied
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {idea.isApplied ? '✓ Đã áp dụng' : 'Chưa áp dụng'}
                </button>
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors">
                {idea.title}
              </h3>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {idea.content}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                  {idea.grade}
                </span>
                {idea.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">{idea.createdAt}</span>
              <button
                onClick={() => {
                  if (confirm('Thầy/Cô muốn xóa ý tưởng này?')) deleteIdea(idea.id);
                }}
                className="text-slate-400 hover:text-rose-600 p-1"
                title="Xóa"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Idea Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Ghi chép ý tưởng giảng dạy mới
            </h3>

            <form onSubmit={handleSaveIdea} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề ý tưởng *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Đo bóng cây bằng định lý Thalès"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phân loại</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as IdeaCategory })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value="mo_dau">Mở đầu bất ngờ</option>
                    <option value="cau_chuyen">Câu chuyện lịch sử</option>
                    <option value="thuc_te">Ứng dụng thực tế</option>
                    <option value="thi_nghiem">Thí nghiệm mini</option>
                    <option value="mini_game">Trò chơi mini 3p</option>
                    <option value="kich_thich_tu_duy">Câu hỏi kích thích tư duy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khối lớp</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung chi tiết ý tưởng *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Mô tả cách thức triển khai, tình huống đặt ra cho học sinh..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Từ khóa Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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
                  Lưu ý tưởng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
