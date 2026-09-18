import React, { useState, useMemo } from 'react';
import {
  FolderArchive,
  Plus,
  Search,
  Filter,
  Star,
  ExternalLink,
  Paperclip,
  Trash2,
  FileText,
  Video,
  Gamepad2,
  Cpu,
  Layers,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MaterialItem, MaterialType, GradeLevel, SubjectName } from '../types';

export const MaterialsView: React.FC = () => {
  const { materials, addMaterial, updateMaterial, deleteMaterial, addToast } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'powerpoint' as MaterialType,
    grade: 'Khối 8' as GradeLevel,
    subject: 'Toán học' as SubjectName,
    relatedLesson: 'Định lý Thalès trong tam giác',
    urlOrPath: 'https://example.com/slide',
    rating: 5,
    tags: 'Slide, Hoạt động nhóm',
    isFavorite: false,
    description: 'Học liệu phục vụ giảng dạy trực quan trên lớp',
  });

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      if (selectedType !== 'all' && m.type !== selectedType) return false;
      if (selectedGrade !== 'all' && m.grade !== selectedGrade) return false;
      if (onlyFavorites && !m.isFavorite) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const lesson = m.relatedLesson || m.lessonTitle || '';
        return (
          m.title.toLowerCase().includes(q) ||
          lesson.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [materials, selectedType, selectedGrade, onlyFavorites, searchFilter]);

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addMaterial({
      title: formData.title,
      type: formData.type,
      grade: formData.grade,
      subject: formData.subject,
      relatedLesson: formData.relatedLesson,
      urlOrPath: formData.urlOrPath,
      rating: formData.rating,
      tags: formData.tags.split(',').map((s) => s.trim()).filter(Boolean),
      isFavorite: formData.isFavorite,
      description: formData.description,
    });

    setIsAddModalOpen(false);
  };

  const getTypeIcon = (type: MaterialType) => {
    switch (type) {
      case 'powerpoint':
        return <span className="rounded bg-orange-100 p-1.5 text-orange-600 font-bold text-[10px]">PPT</span>;
      case 'pdf':
        return <span className="rounded bg-rose-100 p-1.5 text-rose-600 font-bold text-[10px]">PDF</span>;
      case 'video':
        return <Video className="h-4 w-4 text-red-500" />;
      case 'game':
        return <Gamepad2 className="h-4 w-4 text-purple-500" />;
      case 'app_edtech':
        return <Cpu className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  const getTypeName = (type: MaterialType) => {
    switch (type) {
      case 'powerpoint':
        return 'Bài giảng PowerPoint';
      case 'pdf':
        return 'Tài liệu PDF';
      case 'phieu_hoc_tap':
        return 'Phiếu học tập';
      case 'video':
        return 'Video bài giảng';
      case 'game':
        return 'Game tương tác (Quizizz/Kahoot)';
      case 'app_edtech':
        return 'Ứng dụng EdTech (GeoGebra/PhET)';
      default:
        return 'Học liệu khác';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FolderArchive className="h-6 w-6 text-indigo-600" />
            Kho học liệu & Đồ dùng số
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Lưu trữ tập trung Slide bài giảng, Phiếu học tập, Trò chơi tương tác (Quizizz, Kahoot) và mô hình EdTech
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm học liệu mới</span>
        </button>
      </div>

      {/* Filter and Category Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên học liệu, bài học, tag..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
          >
            <option value="all">Tất cả định dạng</option>
            <option value="powerpoint">PowerPoint</option>
            <option value="pdf">PDF / Tài liệu</option>
            <option value="phieu_hoc_tap">Phiếu học tập</option>
            <option value="game">Trò chơi (Quizizz, Kahoot, Wordwall)</option>
            <option value="app_edtech">Ứng dụng EdTech (GeoGebra, PhET)</option>
            <option value="video">Video giảng dạy</option>
          </select>

          {/* Grade */}
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

        {/* Favorite toggle */}
        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
            onlyFavorites
              ? 'border-rose-300 bg-rose-50 text-rose-600'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>Yêu thích</span>
        </button>
      </div>

      {/* Materials Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(mat.type)}
                  <span className="text-[11px] font-bold text-slate-500">{getTypeName(mat.type)}</span>
                </div>

                <button
                  onClick={() => updateMaterial(mat.id, { isFavorite: !mat.isFavorite })}
                  className="text-slate-300 hover:text-rose-500 transition-colors"
                  title="Đánh dấu yêu thích"
                >
                  <Heart
                    className={`h-4 w-4 ${mat.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                </button>
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {mat.title}
              </h3>

              <div className="mt-1 text-xs text-indigo-700 font-semibold">
                Bài: {mat.relatedLesson}
              </div>

              {mat.description && (
                <p className="mt-2 text-xs text-slate-500 line-clamp-2">{mat.description}</p>
              )}

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                  {mat.grade}
                </span>
                {mat.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
              {/* Rating stars */}
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < (mat.rating ?? 5) ? 'fill-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    addToast(`Đã gắn học liệu vào Tiết tiếp theo`, `Gắn thành công "${mat.title}"`);
                  }}
                  className="rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100"
                >
                  Gắn vào tiết
                </button>
                <a
                  href={mat.urlOrPath}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                  title="Mở học liệu"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={() => {
                    if (confirm('Thầy/Cô muốn xóa học liệu này?')) deleteMaterial(mat.id);
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                  title="Xóa"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Material Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Thêm học liệu mới vào Kho
            </h3>

            <form onSubmit={handleSaveMaterial} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên học liệu / Tài liệu *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Slide trình chiếu Định lý Thalès sinh động"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại học liệu</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as MaterialType })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value="powerpoint">PowerPoint (.pptx)</option>
                    <option value="pdf">Tài liệu PDF (.pdf)</option>
                    <option value="phieu_hoc_tap">Phiếu học tập</option>
                    <option value="game">Trò chơi (Quizizz / Kahoot / Blooket)</option>
                    <option value="app_edtech">Ứng dụng EdTech (GeoGebra / PhET)</option>
                    <option value="video">Video bài giảng</option>
                    <option value="link">Link trang web hay</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khối lớp</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value as GradeLevel })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value="Khối 6">Khối 6</option>
                    <option value="Khối 7">Khối 7</option>
                    <option value="Khối 8">Khối 8</option>
                    <option value="Khối 9">Khối 9</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bài học liên quan</label>
                <input
                  type="text"
                  value={formData.relatedLesson}
                  onChange={(e) => setFormData({ ...formData, relatedLesson: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn Link hoặc Tên file *</label>
                <input
                  type="text"
                  required
                  placeholder="https://geogebra.org/m/thales hoặc /drive/slide.pptx"
                  value={formData.urlOrPath}
                  onChange={(e) => setFormData({ ...formData, urlOrPath: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  Lưu học liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
