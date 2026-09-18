import React, { useState } from 'react';
import {
  Users,
  Plus,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Trash2,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MeetingItem, MeetingType } from '../types';

export const MeetingsView: React.FC = () => {
  const { meetings, addMeeting, updateMeeting, deleteMeeting, addTask, addToast } = useApp();

  const [selectedMeeting, setSelectedMeeting] = useState<MeetingItem | null>(meetings[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'hop_to' as MeetingType,
    dateTime: '2026-09-22 14:00',
    location: 'Văn phòng tổ Toán - Tin',
    chairperson: 'Thầy Trần Văn Bình (Tổ trưởng)',
    summary: '',
    myActionItems: ['Chuẩn bị báo cáo chuyên đề', 'Tổng hợp kết quả khảo sát'],
  });

  const getTypeName = (type: MeetingType) => {
    switch (type) {
      case 'hop_to':
        return 'Họp tổ chuyên môn';
      case 'hoi_dong':
        return 'Hội đồng sư phạm';
      case 'phu_huynh':
        return 'Họp phụ huynh học sinh';
      default:
        return 'Cuộc họp chuyên môn';
    }
  };

  const handleCreateTaskFromActionItem = (itemText: string) => {
    addTask({
      title: itemText,
      category: 'chuyen_mon',
      priority: 'cao',
      deadline: '2026-09-25',
      status: 'can_lam',
      checklist: [{ id: 'chk-1', text: 'Thực hiện theo chỉ đạo cuộc họp', completed: false }],
      notes: `Giao từ cuộc họp: ${selectedMeeting?.title}`,
    });
    addToast('Đã chuyển việc sang module Công việc & Deadline', `Đã thêm: "${itemText}"`);
  };

  const handleAISummarizeNotes = () => {
    if (!selectedMeeting) return;
    setIsSummarizing(true);
    setTimeout(() => {
      const aiSummary = `📌 TÓM TẮT TRỌNG TÂM CUỘC HỌP (AI SƯ PHẠM):
1. Về chuyên môn: Tổ thống nhất đẩy nhanh tiến độ dạy bù tuần tới. Toàn tổ áp dụng phần mềm GeoGebra cho chương Hình học.
2. Về nề nếp: Rà soát học bạ và ghi chép sổ đầu bài đầy đủ.
3. Kế hoạch tuần 13: Thầy An chuẩn bị tiết dạy mẫu chuyên đề cụm.`;

      updateMeeting(selectedMeeting.id, {
        summary: selectedMeeting.summary + '\n\n' + aiSummary,
      });
      setIsSummarizing(false);
      addToast('AI đã tóm tắt nội dung cuộc họp thành công', 'Trích xuất 3 kết luận chính và việc cần làm');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="h-6 w-6 text-indigo-600" />
            Họp & Hoạt động chuyên môn
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Ghi chép biên bản sinh hoạt tổ, Hội đồng sư phạm và chuyển trực tiếp việc được giao vào danh sách Deadline
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm cuộc họp mới</span>
        </button>
      </div>

      {/* 2 Column Layout: List Left, Details Right */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Col: Meetings List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Danh sách cuộc họp ({meetings.length})
          </div>

          <div className="space-y-3">
            {meetings.map((m) => {
              const isSelected = selectedMeeting?.id === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMeeting(m)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                      {getTypeName(m.type)}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {m.dateTime}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-slate-900 line-clamp-2">{m.title}</h3>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{m.location}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                      {m.myActionItems.length} việc của tôi
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Meeting Details, Action items & AI Summary (7 cols) */}
        {selectedMeeting && (
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                      {getTypeName(selectedMeeting.type)}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {selectedMeeting.dateTime}
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg font-black text-slate-900">{selectedMeeting.title}</h2>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Thầy/Cô muốn xóa cuộc họp này?')) {
                      deleteMeeting(selectedMeeting.id);
                      setSelectedMeeting(meetings[0] || null);
                    }
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Meta information */}
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold">Địa điểm:</span>{' '}
                  <strong className="text-slate-800">{selectedMeeting.location}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Chủ trì:</span>{' '}
                  <strong className="text-slate-800">{selectedMeeting.chairperson}</strong>
                </div>
              </div>

              {/* Summary with AI Summarize button */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-indigo-600" /> Nội dung biên bản & kết luận:
                  </span>
                  <button
                    onClick={handleAISummarizeNotes}
                    disabled={isSummarizing}
                    className="flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isSummarizing ? 'AI đang tóm tắt...' : 'AI Tóm tắt trọng tâm'}</span>
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200 p-3.5 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/50">
                  {selectedMeeting.summary}
                </div>
              </div>

              {/* Action items for me -> 1-Click transfer to Tasks Module */}
              <div className="border-t border-slate-100 pt-4">
                <span className="font-bold text-slate-900 text-xs mb-2 block">
                  Đầu việc được giao cho tôi (Action Items):
                </span>

                <div className="space-y-2">
                  {selectedMeeting.myActionItems.map((item, idx) => {
                    const actionText = typeof item === 'string' ? item : item.text;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-slate-200 p-3 bg-white hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                          <span className="text-xs font-semibold text-slate-800">{actionText}</span>
                        </div>

                        <button
                          onClick={() => handleCreateTaskFromActionItem(actionText)}
                          className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                          title="Tạo việc đưa thẳng vào Kanban công việc"
                        >
                          <span>Tạo việc sang Deadline</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Meeting Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Thêm cuộc họp chuyên môn mới
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMeeting({
                  title: formData.title,
                  type: formData.type,
                  dateTime: formData.dateTime,
                  location: formData.location,
                  chairperson: formData.chairperson,
                  summary: formData.summary || 'Biên bản ghi chép cuộc họp...',
                  myActionItems: formData.myActionItems,
                });
                setIsAddModalOpen(false);
              }}
              className="mt-4 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề cuộc họp *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Sinh hoạt chuyên môn Tổ Toán - Tuần 13"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại cuộc họp</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as MeetingType })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value="hop_to">Họp tổ chuyên môn</option>
                    <option value="hoi_dong">Hội đồng sư phạm</option>
                    <option value="phu_huynh">Họp phụ huynh</option>
                    <option value="khac">Cuộc họp khác</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thời gian</label>
                  <input
                    type="text"
                    value={formData.dateTime}
                    onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa điểm</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Người chủ trì</label>
                <input
                  type="text"
                  value={formData.chairperson}
                  onChange={(e) => setFormData({ ...formData, chairperson: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung ghi chép</label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
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
                  Lưu cuộc họp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
