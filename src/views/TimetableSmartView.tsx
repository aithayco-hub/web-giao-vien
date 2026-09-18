import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  FileText,
  Paperclip,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TimetableSlot, SubjectName } from '../types';

export const TimetableSmartView: React.FC = () => {
  const {
    timetable,
    classes,
    khbdList,
    materials,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
    setActiveTab,
  } = useApp();

  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState('');

  // Identify next slot (Default to tt-2)
  const nextLessonId = 'tt-2';

  const days = [
    { day: 2, label: 'Thứ Hai', short: 'T2' },
    { day: 3, label: 'Thứ Ba', short: 'T3' },
    { day: 4, label: 'Thứ Tư', short: 'T4' },
    { day: 5, label: 'Thứ Năm', short: 'T5' },
    { day: 6, label: 'Thứ Sáu', short: 'T6' },
    { day: 7, label: 'Thứ Bảy', short: 'T7' },
  ];

  const morningPeriods = [1, 2, 3, 4, 5];
  const afternoonPeriods = [6, 7, 8];

  const timeMap: Record<number, string> = {
    1: '07:15 - 08:00',
    2: '08:05 - 08:50',
    3: '09:05 - 09:50',
    4: '09:55 - 10:40',
    5: '10:45 - 11:30',
    6: '13:30 - 14:15',
    7: '14:20 - 15:05',
    8: '15:15 - 16:00',
  };

  // Form State for Adding/Editing Slot
  const [slotForm, setSlotForm] = useState({
    dayOfWeek: 2,
    period: 1,
    session: 'sang' as 'sang' | 'chieu',
    className: '8A1',
    subject: 'Toán học' as SubjectName,
    room: 'P.203',
    lessonTitle: '',
    ppctPeriod: 1,
    notes: '',
  });

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotForm.lessonTitle.trim()) return;

    addTimetableSlot({
      ...slotForm,
      timeRange: timeMap[slotForm.period] || '07:15 - 08:00',
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarDays className="h-6 w-6 text-indigo-600" />
            Thời khóa biểu thông minh (Tuần 12)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Lịch giảng dạy chi tiết theo buổi Sáng - Chiều, tích hợp trực tiếp Kế hoạch bài dạy (KHBD) và học liệu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm tiết dạy</span>
          </button>
        </div>
      </div>

      {/* Legend & Next Lesson Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-indigo-900">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-200" />
            Tiết tiếp theo:
          </span>
          <span className="rounded-lg bg-white px-2.5 py-1 font-bold text-indigo-700 border border-indigo-200 shadow-2xs">
            Thứ Hai, Tiết 2 (08:05) • Lớp 8A1 • Định lý Thalès trong tam giác
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-blue-100 border border-blue-300" /> Buổi sáng
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-amber-100 border border-amber-300" /> Buổi chiều
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded ring-2 ring-indigo-500 bg-indigo-50" /> Tiết tiếp theo
          </span>
        </div>
      </div>

      {/* Timetable Weekly Grid */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-center font-bold uppercase tracking-wider text-[11px] text-slate-600">
                <th className="w-24 border-r border-slate-200 py-3.5 px-2">Buổi / Tiết</th>
                {days.map((d) => (
                  <th key={d.day} className="border-r border-slate-200 py-3.5 px-3 min-w-[150px]">
                    <div>{d.label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* MORNING SECTION */}
              <tr className="bg-blue-50/40 text-blue-900 font-extrabold text-[11px] uppercase tracking-wider">
                <td colSpan={7} className="px-4 py-1.5 text-left border-b border-blue-100">
                  ☀️ BUỔI SÁNG (Tiết 1 - Tiết 5)
                </td>
              </tr>

              {morningPeriods.map((period) => (
                <tr key={`sang-${period}`} className="divide-x divide-slate-200 hover:bg-slate-50/50">
                  <td className="bg-slate-50/80 p-2 text-center text-[11px]">
                    <div className="font-extrabold text-slate-800">Tiết {period}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{timeMap[period]}</div>
                  </td>

                  {days.map((d) => {
                    const slot = timetable.find((s) => s.dayOfWeek === d.day && s.period === period);
                    const isNext = slot?.id === nextLessonId;

                    if (!slot) {
                      return (
                        <td
                          key={`${d.day}-${period}`}
                          onClick={() => {
                            setSlotForm({
                              ...slotForm,
                              dayOfWeek: d.day,
                              period: period,
                              session: 'sang',
                            });
                            setIsAddModalOpen(true);
                          }}
                          className="p-2 text-center text-slate-300 hover:bg-indigo-50/30 cursor-pointer group"
                        >
                          <span className="opacity-0 group-hover:opacity-100 text-indigo-400 font-bold text-xs">
                            + Thêm
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 cursor-pointer transition-all ${
                          isNext
                            ? 'bg-gradient-to-br from-indigo-50 to-blue-50/80 border-2 border-indigo-500 ring-2 ring-indigo-200 shadow-sm'
                            : 'hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-black text-indigo-800">
                              Lớp {slot.className}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {slot.room}
                            </span>
                          </div>

                          <div className="font-bold text-slate-900 text-xs line-clamp-2 leading-tight">
                            {slot.lessonTitle}
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1">
                            <span className="font-semibold text-blue-600">PPCT #{slot.ppctPeriod}</span>
                            {isNext && (
                              <span className="rounded bg-indigo-600 px-1 text-white font-bold">
                                TIẾP THEO
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* AFTERNOON SECTION */}
              <tr className="bg-amber-50/40 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider">
                <td colSpan={7} className="px-4 py-1.5 text-left border-b border-amber-100">
                  🌤️ BUỔI CHIỀU (Tiết 6 - Tiết 8)
                </td>
              </tr>

              {afternoonPeriods.map((period) => (
                <tr key={`chieu-${period}`} className="divide-x divide-slate-200 hover:bg-slate-50/50">
                  <td className="bg-slate-50/80 p-2 text-center text-[11px]">
                    <div className="font-extrabold text-slate-800">Tiết {period}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{timeMap[period]}</div>
                  </td>

                  {days.map((d) => {
                    const slot = timetable.find((s) => s.dayOfWeek === d.day && s.period === period);
                    const isNext = slot?.id === nextLessonId;

                    if (!slot) {
                      return (
                        <td
                          key={`${d.day}-${period}`}
                          onClick={() => {
                            setSlotForm({
                              ...slotForm,
                              dayOfWeek: d.day,
                              period: period,
                              session: 'chieu',
                            });
                            setIsAddModalOpen(true);
                          }}
                          className="p-2 text-center text-slate-300 hover:bg-indigo-50/30 cursor-pointer group"
                        >
                          <span className="opacity-0 group-hover:opacity-100 text-indigo-400 font-bold text-xs">
                            + Thêm
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 cursor-pointer transition-all ${
                          isNext
                            ? 'bg-indigo-50 border-2 border-indigo-500 shadow-sm'
                            : 'hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-800">
                              {slot.className}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {slot.room}
                            </span>
                          </div>

                          <div className="font-bold text-slate-900 text-xs line-clamp-2 leading-tight">
                            {slot.lessonTitle}
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1">
                            <span className="font-semibold text-amber-600">PPCT #{slot.ppctPeriod}</span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal with Linked Resources: KHBD, PPT, PDF, Worksheet, Game, WebApp */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-extrabold text-indigo-700">
                    Lớp {selectedSlot.className}
                  </span>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    Thứ {selectedSlot.dayOfWeek === 8 ? 'CN' : selectedSlot.dayOfWeek} • Tiết {selectedSlot.period}
                  </span>
                  <span className="text-xs text-slate-500">({selectedSlot.timeRange})</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {selectedSlot.lessonTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3">
                <div>
                  <span className="text-slate-500">Môn học:</span> <strong>{selectedSlot.subject}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Phòng học:</span> <strong>{selectedSlot.room}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Tiết PPCT:</span> <strong>#{selectedSlot.ppctPeriod}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Buổi dạy:</span> <strong>{selectedSlot.session === 'sang' ? 'Sáng' : 'Chiều'}</strong>
                </div>
              </div>

              {/* Linked KHBD */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-indigo-600" /> Kế hoạch bài dạy (KHBD):
                  </span>
                  <button
                    onClick={() => {
                      setSelectedSlot(null);
                      setActiveTab('khbd');
                    }}
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Xem trong Kho KHBD →
                  </button>
                </div>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-indigo-950">{selectedSlot.lessonTitle}</div>
                    <div className="text-[11px] text-indigo-700 mt-0.5">
                      Chuẩn công văn 5512 • Đã chuẩn bị chuỗi 4 hoạt động
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                    Sẵn sàng
                  </span>
                </div>
              </div>

              {/* Attached Learning Materials (PPT, PDF, Worksheet, Game, WebApp) */}
              <div>
                <span className="font-bold text-slate-800 mb-1.5 block">
                  Học liệu & Đồ dùng dạy học đính kèm:
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded-lg bg-orange-100 p-1.5 text-orange-600 font-bold text-[10px]">
                        PPT
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">Slide bài giảng trình chiếu</div>
                        <div className="text-[10px] text-slate-500">28 trang • Tích hợp hiệu ứng hình động</div>
                      </div>
                    </div>
                    <button className="text-indigo-600 font-bold hover:underline">Mở slide</button>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded-lg bg-blue-100 p-1.5 text-blue-600 font-bold text-[10px]">
                        APP
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">Mô hình GeoGebra tương tác</div>
                        <div className="text-[10px] text-slate-500">Kéo thả tỉ số đoạn thẳng trực tiếp trên màn chiếu</div>
                      </div>
                    </div>
                    <button className="text-indigo-600 font-bold hover:underline">Khởi chạy</button>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded-lg bg-emerald-100 p-1.5 text-emerald-600 font-bold text-[10px]">
                        PDF
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">Phiếu học tập thảo luận nhóm A3</div>
                        <div className="text-[10px] text-slate-500">10 bản in cho 10 nhóm học sinh</div>
                      </div>
                    </div>
                    <button className="text-indigo-600 font-bold hover:underline">In phiếu</button>
                  </div>
                </div>
              </div>

              {/* Direct Attach Resource Action */}
              <div className="rounded-xl border border-dashed border-slate-300 p-3 bg-slate-50">
                <div className="font-bold text-slate-700 mb-1">Gắn thêm học liệu vào tiết học này:</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tên tài liệu hoặc link (Drive, YouTube, GeoGebra)..."
                    value={newMaterialName}
                    onChange={(e) => setNewMaterialName(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white"
                  />
                  <button
                    onClick={() => {
                      if (newMaterialName.trim()) {
                        alert(`Đã gắn tài liệu "${newMaterialName}" vào tiết học thành công!`);
                        setNewMaterialName('');
                      }
                    }}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
                  >
                    Gắn
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  if (confirm('Thầy/Cô có chắc chắn muốn xóa tiết dạy này?')) {
                    deleteTimetableSlot(selectedSlot.id);
                    setSelectedSlot(null);
                  }
                }}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5" /> Xóa tiết
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Thêm tiết dạy vào Thời khóa biểu
            </h3>

            <form onSubmit={handleSaveSlot} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thứ trong tuần</label>
                  <select
                    value={slotForm.dayOfWeek}
                    onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    <option value={2}>Thứ Hai</option>
                    <option value={3}>Thứ Ba</option>
                    <option value={4}>Thứ Tư</option>
                    <option value={5}>Thứ Năm</option>
                    <option value={6}>Thứ Sáu</option>
                    <option value={7}>Thứ Bảy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tiết số</label>
                  <select
                    value={slotForm.period}
                    onChange={(e) => {
                      const p = parseInt(e.target.value);
                      setSlotForm({
                        ...slotForm,
                        period: p,
                        session: p <= 5 ? 'sang' : 'chieu',
                      });
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                      <option key={p} value={p}>
                        Tiết {p} ({timeMap[p]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lớp</label>
                  <select
                    value={slotForm.className}
                    onChange={(e) => setSlotForm({ ...slotForm, className: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        Lớp {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phòng học</label>
                  <input
                    type="text"
                    value={slotForm.room}
                    onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên bài giảng / Kế hoạch dạy *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Định lý Thalès trong tam giác"
                  value={slotForm.lessonTitle}
                  onChange={(e) => setSlotForm({ ...slotForm, lessonTitle: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tiết PPCT</label>
                  <input
                    type="number"
                    value={slotForm.ppctPeriod}
                    onChange={(e) => setSlotForm({ ...slotForm, ppctPeriod: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Môn học</label>
                  <input
                    type="text"
                    disabled
                    value={slotForm.subject}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
                  />
                </div>
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
                  Thêm vào TKB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
