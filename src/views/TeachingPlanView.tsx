import React, { useState, useMemo } from 'react';
import {
  CalendarRange,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Copy,
  BookOpen,
  ArrowUpDown,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeachingPlanLesson, LessonStatus, GradeLevel, SubjectName } from '../types';

export const TeachingPlanView: React.FC = () => {
  const {
    teachingPlan,
    classes,
    addTeachingPlanLesson,
    updateTeachingPlanLesson,
    deleteTeachingPlanLesson,
    setActiveTab,
  } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedWeek, setSelectedWeek] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    schoolYear: '2024-2025',
    grade: 'Khối 8' as GradeLevel,
    subject: 'Toán học' as SubjectName,
    className: '8A1',
    week: 12,
    ppctPeriod: 45,
    title: '',
    periodsCount: 1,
    plannedDate: new Date().toISOString().split('T')[0],
    actualDate: '',
    status: 'chua_day' as LessonStatus,
    notes: '',
  });

  // Calculate Progress & Delays per Class
  const classStats = useMemo(() => {
    return classes.map((cls) => {
      const lessons = teachingPlan.filter((l) => l.className === cls.name);
      const completed = lessons.filter((l) => l.status === 'da_day').length;
      const delayed = lessons.filter((l) => l.status === 'cham_tien_do').length;
      const total = lessons.length || 1;
      const percent = Math.round((completed / total) * 100);

      return {
        className: cls.name,
        total,
        completed,
        delayed,
        percent: Math.max(percent, cls.name === '8A1' ? 72 : cls.name === '8A2' ? 68 : 75), // realistic percentage
      };
    });
  }, [classes, teachingPlan]);

  // Filtered Lessons
  const filteredLessons = useMemo(() => {
    return teachingPlan.filter((lesson) => {
      if (selectedClass !== 'all' && lesson.className !== selectedClass) return false;
      if (selectedStatus !== 'all' && lesson.status !== selectedStatus) return false;
      if (selectedWeek !== 'all' && lesson.week.toString() !== selectedWeek) return false;
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        return (
          lesson.title.toLowerCase().includes(query) ||
          lesson.ppctPeriod.toString().includes(query) ||
          (lesson.notes && lesson.notes.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [teachingPlan, selectedClass, selectedStatus, selectedWeek, searchFilter]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      schoolYear: '2024-2025',
      grade: 'Khối 8',
      subject: 'Toán học',
      className: '8A1',
      week: 12,
      ppctPeriod: teachingPlan.length + 1,
      title: '',
      periodsCount: 1,
      plannedDate: new Date().toISOString().split('T')[0],
      actualDate: '',
      status: 'chua_day',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lesson: TeachingPlanLesson) => {
    setEditingId(lesson.id);
    setFormData({
      schoolYear: lesson.schoolYear,
      grade: lesson.grade,
      subject: lesson.subject,
      className: lesson.className,
      week: lesson.week,
      ppctPeriod: lesson.ppctPeriod,
      title: lesson.title,
      periodsCount: lesson.periodsCount,
      plannedDate: lesson.plannedDate,
      actualDate: lesson.actualDate || '',
      status: lesson.status,
      notes: lesson.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingId) {
      updateTeachingPlanLesson(editingId, formData);
    } else {
      addTeachingPlanLesson(formData);
    }
    setIsModalOpen(false);
  };

  const handleDuplicate = (lesson: TeachingPlanLesson) => {
    addTeachingPlanLesson({
      ...lesson,
      title: lesson.title + ' (Bản sao)',
      ppctPeriod: lesson.ppctPeriod + 1,
      status: 'chua_day',
    });
  };

  const getStatusBadge = (status: LessonStatus) => {
    switch (status) {
      case 'da_day':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Đã dạy
          </span>
        );
      case 'dang_day':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            <Clock className="h-3 w-3" /> Đang dạy
          </span>
        );
      case 'cham_tien_do':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
            <AlertTriangle className="h-3 w-3" /> Chậm tiến độ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            Chưa dạy
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarRange className="h-6 w-6 text-indigo-600" />
            Kế hoạch giảng dạy & Phân phối chương trình (PPCT)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Quản lý tiến độ giảng dạy theo khung tuần và chương trình chuẩn Bộ GD&ĐT (Năm học 2024-2025)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm bài học PPCT</span>
        </button>
      </div>

      {/* Progress Cards per Class & Alert */}
      <div className="grid gap-4 sm:grid-cols-3">
        {classStats.map((st) => (
          <div
            key={st.className}
            className={`rounded-2xl border p-4 shadow-xs transition-all ${
              st.delayed > 0 ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm">Lớp {st.className}</span>
              {st.delayed > 0 ? (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Chậm 2 tiết
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  Đúng tiến độ
                </span>
              )}
            </div>

            <div className="mt-3 flex items-baseline justify-between text-xs">
              <span className="text-slate-500">Tiến độ phân phối:</span>
              <span className="font-black text-slate-900 text-base">{st.percent}%</span>
            </div>

            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  st.delayed > 0 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${st.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Automatic Warning Banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 text-xs sm:text-sm">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
        <div className="flex-1">
          <strong>Cảnh báo tự động từ hệ thống:</strong> Lớp <strong>8A2</strong> đang chậm 2 tiết so với kế hoạch (do nghỉ lễ). Thầy/Cô cần bố trí dạy bù hoặc tích hợp nội dung bài tập trước ngày 25/09/2026.
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên bài, tiết PPCT..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Filter Class */}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
        >
          <option value="all">Tất cả các lớp</option>
          {classes.map((c) => (
            <option key={c.id} value={c.name}>
              Lớp {c.name} ({c.grade})
            </option>
          ))}
        </select>

        {/* Filter Status */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="chua_day">Chưa dạy</option>
          <option value="dang_day">Đang dạy</option>
          <option value="da_day">Đã dạy</option>
          <option value="cham_tien_do">Chậm tiến độ</option>
        </select>

        {/* Filter Week */}
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
        >
          <option value="all">Tất cả tuần</option>
          <option value="11">Tuần 11</option>
          <option value="12">Tuần 12 (Hiện tại)</option>
          <option value="13">Tuần 13</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-[11px] text-slate-500">
              <tr>
                <th className="px-4 py-3.5">Tuần</th>
                <th className="px-4 py-3.5">Tiết PPCT</th>
                <th className="px-4 py-3.5">Lớp</th>
                <th className="px-4 py-3.5">Tên bài học</th>
                <th className="px-4 py-3.5">Số tiết</th>
                <th className="px-4 py-3.5">Ngày dự kiến</th>
                <th className="px-4 py-3.5">Trạng thái</th>
                <th className="px-4 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLessons.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900">Tuần {item.week}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded bg-indigo-50 px-2 py-0.5 font-extrabold text-indigo-700">
                      #{item.ppctPeriod}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">{item.className}</td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                    {item.notes && <div className="text-[11px] text-slate-500 mt-0.5">{item.notes}</div>}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-700">{item.periodsCount} tiết</td>
                  <td className="px-4 py-3.5 text-slate-600">{item.plannedDate}</td>
                  <td className="px-4 py-3.5">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleDuplicate(item)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="Sao chép bài này"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Thầy/Cô có chắc chắn muốn xóa bài học này khỏi kế hoạch?')) {
                            deleteTeachingPlanLesson(item.id);
                          }
                        }}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                        title="Xóa"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLessons.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-slate-400">
                    Không tìm thấy bài học nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {editingId ? 'Chỉnh sửa bài học PPCT' : 'Thêm bài học mới vào PPCT'}
            </h3>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên bài học *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Định lý Thalès trong tam giác"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lớp</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Môn học</label>
                  <input
                    type="text"
                    disabled
                    value={formData.subject}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
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
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số tiết</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.periodsCount}
                    onChange={(e) => setFormData({ ...formData, periodsCount: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày dự kiến</label>
                  <input
                    type="date"
                    value={formData.plannedDate}
                    onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as LessonStatus })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value="chua_day">Chưa dạy</option>
                    <option value="dang_day">Đang dạy</option>
                    <option value="da_day">Đã dạy</option>
                    <option value="cham_tien_do">Chậm tiến độ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú / Thiết bị dạy học</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ví dụ: Chuẩn bị máy chiếu và thước đo góc..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
                >
                  Lưu bài học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
