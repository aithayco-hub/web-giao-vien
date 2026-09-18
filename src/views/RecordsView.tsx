import React, { useState } from 'react';
import {
  Files,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Edit2,
  Calendar,
  FileText,
  BookmarkCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeacherRecord, RecordStatus } from '../types';

export const RecordsView: React.FC = () => {
  const { records, addRecord, updateRecord, deleteRecord, addToast } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Kế hoạch cá nhân',
    deadline: '2026-09-30',
    status: 'chua_hoan_thanh' as RecordStatus,
    fileUrl: 'https://drive.google.com/folder',
    notes: 'Nộp cho Tổ trưởng chuyên môn ký duyệt',
  });

  const filteredRecords = records.filter((r) => {
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: RecordStatus) => {
    switch (status) {
      case 'da_duyet':
        return (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Đã duyệt
          </span>
        );
      case 'da_nop':
        return (
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Đã nộp (Chờ duyệt)
          </span>
        );
      case 'da_hoan_thanh':
        return (
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800">
            Đã hoàn thành
          </span>
        );
      case 'chua_hoan_thanh':
        return (
          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> Chưa hoàn thành
          </span>
        );
    }
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addRecord({
      title: formData.title,
      category: formData.category,
      deadline: formData.deadline,
      status: formData.status,
      fileUrl: formData.fileUrl,
      notes: formData.notes,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Files className="h-6 w-6 text-indigo-600" />
            Hồ sơ – Sổ sách chuyên môn giáo viên
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Theo dõi tiến độ hoàn thành và kiểm duyệt các danh mục hồ sơ quy định của Bộ Giáo dục và Đào tạo
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm hồ sơ sổ sách</span>
        </button>
      </div>

      {/* Warning Alert for Deadlines */}
      <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-xs sm:text-sm text-rose-900">
        <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
        <div>
          <strong>Cảnh báo hạn nộp:</strong> Hồ sơ <strong>"Sổ dự giờ & Rút kinh nghiệm chuyên môn"</strong> và <strong>"Kế hoạch bài dạy tuần 13"</strong> sắp đến hạn kiểm tra chuyên đề định kỳ của Tổ trưởng (Hạn 25/09/2026).
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Lọc trạng thái:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tất cả hồ sơ ({records.length})</option>
            <option value="chua_hoan_thanh">Chưa hoàn thành</option>
            <option value="da_hoan_thanh">Đã hoàn thành</option>
            <option value="da_nop">Đã nộp</option>
            <option value="da_duyet">Đã duyệt</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-[11px] text-slate-500">
            <tr>
              <th className="px-4 py-3.5">Danh mục hồ sơ</th>
              <th className="px-4 py-3.5">Phân loại</th>
              <th className="px-4 py-3.5">Hạn nộp</th>
              <th className="px-4 py-3.5">Trạng thái</th>
              <th className="px-4 py-3.5">Cập nhật lần cuối</th>
              <th className="px-4 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.map((rec) => (
              <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900 text-sm">{rec.title}</div>
                  {rec.notes && <div className="text-[11px] text-slate-500 mt-0.5">{rec.notes}</div>}
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-700">{rec.category}</td>
                <td className="px-4 py-3.5 font-bold text-slate-800">{rec.deadline}</td>
                <td className="px-4 py-3.5">{getStatusBadge(rec.status)}</td>
                <td className="px-4 py-3.5 text-slate-500">{rec.updatedAt}</td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {rec.fileUrl && (
                      <a
                        href={rec.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                        title="Mở thư mục hồ sơ"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => {
                        const nextStatus: RecordStatus =
                          rec.status === 'chua_hoan_thanh'
                            ? 'da_nop'
                            : rec.status === 'da_nop'
                            ? 'da_duyet'
                            : 'chua_hoan_thanh';
                        updateRecord(rec.id, { status: nextStatus });
                        addToast('Đã đổi trạng thái hồ sơ', `Trạng thái mới: ${nextStatus}`);
                      }}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      Đổi trạng thái
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Thầy/Cô có muốn xóa mục hồ sơ này?')) deleteRecord(rec.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600"
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Thêm hồ sơ sổ sách mới
            </h3>

            <form onSubmit={handleSaveRecord} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên danh mục hồ sơ *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Sổ theo dõi đánh giá học sinh môn Toán 8"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại sổ sách</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hạn nộp</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trạng thái hiện tại</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as RecordStatus })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                >
                  <option value="chua_hoan_thanh">Chưa hoàn thành</option>
                  <option value="da_hoan_thanh">Đã hoàn thành</option>
                  <option value="da_nop">Đã nộp</option>
                  <option value="da_duyet">Đã duyệt</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Drive lưu trữ</label>
                <input
                  type="text"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  Lưu hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
