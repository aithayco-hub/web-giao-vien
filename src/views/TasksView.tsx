import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  List,
  Columns,
  Tag,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TaskItem, TaskCategory, TaskPriority, TaskStatus } from '../types';

export const TasksView: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskChecklist, addToast } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'day_hoc' as TaskCategory,
    priority: 'trung_binh' as TaskPriority,
    deadline: new Date().toISOString().split('T')[0],
    status: 'can_lam' as TaskStatus,
    checklistInput: 'Đọc tài liệu\nSoạn nội dung\nRà soát lần cuối',
    notes: '',
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return t.title.toLowerCase().includes(q) || (t.notes && t.notes.toLowerCase().includes(q));
      }
      return true;
    });
  }, [tasks, selectedCategory, selectedPriority, searchQuery]);

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const checklistItems = formData.checklistInput
      .split('\n')
      .map((item, idx) => ({
        id: `chk-${Date.now()}-${idx}`,
        text: item.trim(),
        completed: false,
      }))
      .filter((i) => i.text.length > 0);

    addTask({
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      deadline: formData.deadline,
      status: formData.status,
      checklist: checklistItems,
      notes: formData.notes,
    });

    setIsAddModalOpen(false);
  };

  const getCategoryLabel = (cat: TaskCategory) => {
    switch (cat) {
      case 'day_hoc':
        return 'Dạy học';
      case 'chu_nhiem':
        return 'Chủ nhiệm';
      case 'chuyen_mon':
        return 'Chuyên môn';
      case 'viec_truong':
        return 'Việc trường';
      default:
        return 'Khác';
    }
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'cao':
        return <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">Ưu tiên cao</span>;
      case 'trung_binh':
        return <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Trung bình</span>;
      default:
        return <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">Thấp</span>;
    }
  };

  // Kanban Columns
  const kanbanColumns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'can_lam', label: 'Cần làm', color: 'border-slate-300' },
    { id: 'dang_lam', label: 'Đang làm', color: 'border-indigo-400' },
    { id: 'hoan_thanh', label: 'Đã xong', color: 'border-emerald-400' },
    { id: 'qua_han', label: 'Quá hạn', color: 'border-rose-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CheckSquare className="h-6 w-6 text-indigo-600" />
            Công việc & Quản lý Deadline giáo viên
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Theo dõi phân loại: Dạy học, Chủ nhiệm, Chuyên môn, Việc trường theo bảng Kanban hoặc danh sách
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm công việc mới</span>
        </button>
      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <input
            type="text"
            placeholder="Tìm theo tên công việc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none min-w-[200px]"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="day_hoc">Dạy học</option>
            <option value="chu_nhiem">Chủ nhiệm</option>
            <option value="chuyen_mon">Chuyên môn</option>
            <option value="viec_truong">Việc trường</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tất cả ưu tiên</option>
            <option value="cao">Ưu tiên cao</option>
            <option value="trung_binh">Trung bình</option>
            <option value="thap">Thấp</option>
          </select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              viewMode === 'kanban' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              viewMode === 'list' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Danh sách</span>
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 min-h-[500px]"
              >
                {/* Col Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3 px-1">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    {col.label}
                  </span>
                  <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                          {getCategoryLabel(t.category)}
                        </span>
                        {getPriorityBadge(t.priority)}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{t.title}</h4>

                      {/* Checklist */}
                      {t.checklist.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-slate-100">
                          {t.checklist.map((chk) => (
                            <label
                              key={chk.id}
                              className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={chk.completed}
                                onChange={() => toggleTaskChecklist(t.id, chk.id)}
                                className="h-3.5 w-3.5 rounded text-indigo-600"
                              />
                              <span className={chk.completed ? 'line-through text-slate-400' : ''}>
                                {chk.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Footer Info & Move buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-slate-600">
                          <Calendar className="h-3 w-3" /> {t.deadline}
                        </span>

                        <div className="flex items-center gap-1">
                          {col.id !== 'hoan_thanh' && (
                            <button
                              onClick={() => updateTask(t.id, { status: 'hoan_thanh' })}
                              className="text-emerald-600 hover:text-emerald-800 font-bold"
                              title="Đánh dấu đã xong"
                            >
                              ✓ Xong
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm('Thầy/Cô muốn xóa việc này?')) deleteTask(t.id);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-0.5"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400 italic">
                      Trống
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-[11px] text-slate-500">
              <tr>
                <th className="px-4 py-3">Công việc</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Ưu tiên</th>
                <th className="px-4 py-3">Hạn chót</th>
                <th className="px-4 py-3">Checklist tiến độ</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-900">{t.title}</td>
                  <td className="px-4 py-3 font-semibold text-slate-600">{getCategoryLabel(t.category)}</td>
                  <td className="px-4 py-3">{getPriorityBadge(t.priority)}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{t.deadline}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-semibold text-slate-600">
                      {t.checklist.filter((c) => c.completed).length} / {t.checklist.length} việc
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        t.status === 'hoan_thanh'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'qua_han'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {t.status === 'can_lam'
                        ? 'Cần làm'
                        : t.status === 'dang_lam'
                        ? 'Đang làm'
                        : t.status === 'hoan_thanh'
                        ? 'Hoàn thành'
                        : 'Quá hạn'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="Xóa"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Thêm công việc & Nhiệm vụ mới
            </h3>

            <form onSubmit={handleSaveTask} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên công việc *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Hoàn thành chấm bài kiểm tra 1 tiết 8A1"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phân loại</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value="day_hoc">Dạy học</option>
                    <option value="chu_nhiem">Chủ nhiệm</option>
                    <option value="chuyen_mon">Chuyên môn</option>
                    <option value="viec_truong">Việc trường</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mức độ ưu tiên</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value="cao">Ưu tiên cao</option>
                    <option value="trung_binh">Trung bình</option>
                    <option value="thap">Thấp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hạn chót (Deadline)</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value="can_lam">Cần làm</option>
                    <option value="dang_lam">Đang làm</option>
                    <option value="hoan_thanh">Đã hoàn thành</option>
                    <option value="qua_han">Quá hạn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Checklist việc nhỏ (mỗi dòng một việc)
                </label>
                <textarea
                  rows={3}
                  value={formData.checklistInput}
                  onChange={(e) => setFormData({ ...formData, checklistInput: e.target.value })}
                  placeholder="Việc 1&#10;Việc 2&#10;Việc 3"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
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
                  Lưu công việc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
