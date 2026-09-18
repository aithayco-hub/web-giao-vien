import React, { useState, useMemo } from 'react';
import {
  BookOpenCheck,
  Plus,
  Search,
  Grid,
  List,
  Filter,
  FileText,
  Calendar,
  Tag,
  Paperclip,
  CheckCircle2,
  Trash2,
  Edit2,
  ExternalLink,
  Bot,
  Sparkles,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { KHBDItem, GradeLevel, SubjectName } from '../types';

export const KHBDView: React.FC = () => {
  const { khbdList, addKHBD, updateKHBD, deleteKHBD, setActiveTab, timetable } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Preview / View KHBD Modal
  const [previewKHBD, setPreviewKHBD] = useState<KHBDItem | null>(null);

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    grade: 'Khối 8' as GradeLevel,
    subject: 'Toán học' as SubjectName,
    week: 12,
    ppctPeriod: 45,
    tags: 'Hình học, CT 2018, Thalès',
    objectives: '1. Năng lực toán học: ...\n2. Phẩm chất: Tỉ mỉ, sáng tạo',
    activities: 'Hoạt động 1: Khởi động\nHoạt động 2: Hình thành kiến thức\nHoạt động 3: Luyện tập\nHoạt động 4: Vận dụng',
    notes: 'Soạn theo Công văn 5512/BGDĐT',
    isPrepared: true,
  });

  const filteredKHBD = useMemo(() => {
    return khbdList.filter((item) => {
      if (selectedGrade !== 'all' && item.grade !== selectedGrade) return false;
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.ppctPeriod.toString().includes(q)
        );
      }
      return true;
    });
  }, [khbdList, selectedGrade, selectedSubject, searchFilter]);

  const handleSaveKHBD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addKHBD({
      title: formData.title,
      grade: formData.grade,
      subject: formData.subject,
      week: formData.week,
      ppctPeriod: formData.ppctPeriod,
      tags: formData.tags.split(',').map((s) => s.trim()).filter(Boolean),
      objectives: formData.objectives,
      activities: formData.activities,
      notes: formData.notes,
      isPrepared: formData.isPrepared,
      fileType: 'Word (.docx)',
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpenCheck className="h-6 w-6 text-indigo-600" />
            Kho KHBD – Kế hoạch bài dạy & Giáo án
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Quản lý giáo án số theo Công văn 5512, tích hợp chuỗi 4 hoạt động và tài liệu giảng dạy
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ai_center')}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 px-3.5 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-2xs"
          >
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Soạn nhanh bằng AI</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm KHBD mới</span>
          </button>
        </div>
      </div>

      {/* Filter and View Toggle Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên giáo án, từ khóa tag..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
          >
            <option value="all">Tất cả các khối</option>
            <option value="Khối 6">Khối 6</option>
            <option value="Khối 7">Khối 7</option>
            <option value="Khối 8">Khối 8</option>
            <option value="Khối 9">Khối 9</option>
          </select>

          {/* Subject filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
          >
            <option value="all">Tất cả môn</option>
            <option value="Toán học">Toán học</option>
            <option value="KHTN">KHTN</option>
            <option value="Tin học">Tin học</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-lg p-1.5 text-xs font-semibold transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Dạng lưới"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-lg p-1.5 text-xs font-semibold transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Dạng danh sách"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KHBD Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredKHBD.map((khbd) => (
            <div
              key={khbd.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-black text-indigo-700">
                      {khbd.grade}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      Tuần {khbd.week} • Tiết #{khbd.ppctPeriod}
                    </span>
                  </div>
                  {khbd.isPrepared ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Đã duyệt
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-600">Đang soạn</span>
                  )}
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                  {khbd.title}
                </h3>

                <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                  {khbd.objectives || khbd.notes || 'Giáo án soạn theo phân phối chuẩn GDPT 2018.'}
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {khbd.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px]">Cập nhật: {khbd.updatedAt}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewKHBD(khbd)}
                    className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Xem</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Thầy/Cô có muốn xóa giáo án này?')) {
                        deleteKHBD(khbd.id);
                      }
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

          {filteredKHBD.length === 0 && (
            <div className="col-span-full py-16 text-center text-xs text-slate-400">
              Không tìm thấy kế hoạch bài dạy nào trong kho.
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Tên bài dạy</th>
                <th className="px-4 py-3">Khối</th>
                <th className="px-4 py-3">Môn</th>
                <th className="px-4 py-3">Tuần / Tiết</th>
                <th className="px-4 py-3">Từ khóa (Tags)</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKHBD.map((khbd) => (
                <tr key={khbd.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3.5 font-bold text-slate-900">{khbd.title}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-700">{khbd.grade}</td>
                  <td className="px-4 py-3.5 text-slate-600">{khbd.subject}</td>
                  <td className="px-4 py-3.5 text-indigo-700 font-bold">
                    T{khbd.week} • #{khbd.ppctPeriod}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">
                    <span className="line-clamp-1">{khbd.tags.join(', ')}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    {khbd.isPrepared ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        Đã sẵn sàng
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        Đang soạn
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewKHBD(khbd)}
                        className="rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Thầy/Cô có muốn xóa giáo án này?')) {
                            deleteKHBD(khbd.id);
                          }
                        }}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview KHBD Full Modal */}
      {previewKHBD && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
                    {previewKHBD.grade} • {previewKHBD.subject}
                  </span>
                  <span className="text-xs text-slate-500">
                    Tuần {previewKHBD.week} • Tiết PPCT #{previewKHBD.ppctPeriod}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-black text-slate-900">{previewKHBD.title}</h3>
              </div>
              <button
                onClick={() => setPreviewKHBD(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-700">
              {/* Objectives */}
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1.5">
                  I. MỤC TIÊU & YÊU CẦU CẦN ĐẠT (CV 5512)
                </div>
                <div className="whitespace-pre-line text-slate-700">
                  {previewKHBD.objectives ||
                    '1. Năng lực toán học: Nhận biết tỉ số đoạn thẳng, phát biểu định lý Thalès.\n2. Phẩm chất: Cẩn thận, tư duy suy luận logic.'}
                </div>
              </div>

              {/* Activities */}
              <div className="rounded-xl bg-indigo-50/40 p-3.5 border border-indigo-100">
                <div className="font-bold text-indigo-950 text-sm mb-1.5">
                  II. TIẾN TRÌNH HOẠT ĐỘNG DẠY HỌC
                </div>
                <div className="whitespace-pre-line text-indigo-900">
                  {previewKHBD.activities ||
                    '• Hoạt động 1: Khởi động - Tình huống bóng nắng Kim tự tháp\n• Hoạt động 2: Hình thành kiến thức - Khám phá định lý Thalès\n• Hoạt động 3: Luyện tập - Tính độ dài đoạn thẳng trên hình vẽ\n• Hoạt động 4: Vận dụng - Đo khoảng cách hai bờ sông'}
                </div>
              </div>

              {/* Attachments & Tags */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-500">Từ khóa:</span>
                  {previewKHBD.tags.map((t, idx) => (
                    <span key={idx} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      alert('Đã gửi liên kết KHBD vào Thời khóa biểu cho các tiết khối ' + previewKHBD.grade);
                    }}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
                  >
                    Gắn vào TKB tuần này
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-3">
              <button
                onClick={() => setPreviewKHBD(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add KHBD Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Thêm Kế hoạch bài dạy (KHBD) mới
            </h3>

            <form onSubmit={handleSaveKHBD} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên bài dạy *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Kế hoạch bài dạy: Định lý Thalès trong tam giác"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Môn học</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value as SubjectName })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value="Toán học">Toán học</option>
                    <option value="KHTN">KHTN</option>
                    <option value="Tin học">Tin học</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tuần</label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    value={formData.week}
                    onChange={(e) => setFormData({ ...formData, week: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tiết PPCT</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.ppctPeriod}
                    onChange={(e) => setFormData({ ...formData, ppctPeriod: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mục tiêu bài dạy (Yêu cầu cần đạt)</label>
                <textarea
                  rows={2}
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chuỗi các hoạt động (4 bước)</label>
                <textarea
                  rows={3}
                  value={formData.activities}
                  onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Từ khóa Tags (cách nhau dấu phẩy)</label>
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
                  Lưu vào Kho KHBD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
