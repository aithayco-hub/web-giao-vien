import React, { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  Printer,
  FileDown,
  Copy,
  Save,
  Calendar,
  CheckCircle2,
  Edit3,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TimetableSlot } from '../types';

export const TeachingReportView: React.FC = () => {
  const { timetable, teachingPlan, addToast } = useApp();

  const [currentWeek, setCurrentWeek] = useState<number>(12);
  const [editedNotes, setEditedNotes] = useState<Record<string, string>>({});
  const [showExportModal, setShowExportModal] = useState<'word' | 'pdf' | null>(null);

  // Map dates for Week 12: Thứ Hai 14/09/2026 to Thứ Bảy 19/09/2026
  const weekDates: Record<number, string> = {
    2: '14/09/2026',
    3: '15/09/2026',
    4: '16/09/2026',
    5: '17/09/2026',
    6: '18/09/2026',
    7: '19/09/2026',
  };

  const dayNames: Record<number, string> = {
    2: 'Thứ Hai',
    3: 'Thứ Ba',
    4: 'Thứ Tư',
    5: 'Thứ Năm',
    6: 'Thứ Sáu',
    7: 'Thứ Bảy',
  };

  // Generate rows sorted by dayOfWeek then period
  const reportRows = useMemo(() => {
    return [...timetable].sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
      return a.period - b.period;
    });
  }, [timetable]);

  const handleCopyLastWeek = () => {
    addToast('Đã sao chép khung kế hoạch báo giảng tuần 11', 'Tự động kế thừa PPCT tuần trước');
  };

  const handleSaveReport = () => {
    addToast('Đã lưu sổ báo giảng tuần ' + currentWeek + ' vào cơ sở dữ liệu', 'Trạng thái: Đã cập nhật');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ClipboardCheck className="h-6 w-6 text-indigo-600" />
            Báo giảng điện tử (Lịch báo giảng tuần)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Tự động tổng hợp từ Thời khóa biểu và Kế hoạch dạy học theo chuẩn sổ báo giảng chuyên môn
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyLastWeek}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Copy className="h-3.5 w-3.5 text-slate-500" />
            <span>Sao chép tuần trước</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-2xs"
          >
            <Printer className="h-3.5 w-3.5 text-indigo-600" />
            <span>In báo giảng</span>
          </button>

          <button
            onClick={() => setShowExportModal('word')}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Xuất Word (.docx)</span>
          </button>

          <button
            onClick={() => setShowExportModal('pdf')}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Xuất PDF</span>
          </button>

          <button
            onClick={handleSaveReport}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Lưu báo giảng</span>
          </button>
        </div>
      </div>

      {/* Week Selector & Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs print:border-none print:shadow-none print:p-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-indigo-600" />
            Chọn tuần báo giảng:
          </span>
          <select
            value={currentWeek}
            onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-white focus:outline-none"
          >
            <option value={10}>Tuần 10 (01/09 - 06/09)</option>
            <option value={11}>Tuần 11 (07/09 - 12/09)</option>
            <option value={12}>Tuần 12 (14/09 - 19/09 - Hiện tại)</option>
            <option value={13}>Tuần 13 (21/09 - 26/09)</option>
          </select>
        </div>

        <div className="text-xs text-slate-600">
          Giáo viên: <strong>Nguyễn Văn An</strong> • Tổ: <strong>Toán - Tin học</strong> • Năm học: <strong>2024-2025</strong>
        </div>
      </div>

      {/* Official Teaching Report Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs print:border print:rounded-none">
        {/* Print Only Header */}
        <div className="hidden print:block p-6 text-center border-b border-slate-300">
          <div className="text-xs uppercase font-bold text-slate-600">TRƯỜNG THCS LÊ QUÝ ĐÔN • TỔ TOÁN - TIN</div>
          <h2 className="mt-2 text-xl font-black uppercase text-slate-900">
            LỊCH BÁO GIẢNG TUẦN {currentWeek}
          </h2>
          <div className="text-xs mt-1 text-slate-600">
            Từ ngày {weekDates[2]} đến ngày {weekDates[7]} • Giáo viên: Nguyễn Văn An
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-[11px] text-slate-600 text-center">
              <tr>
                <th className="border-r border-slate-200 px-3 py-3 w-28">Thứ</th>
                <th className="border-r border-slate-200 px-3 py-3 w-24">Ngày</th>
                <th className="border-r border-slate-200 px-2 py-3 w-16">Tiết</th>
                <th className="border-r border-slate-200 px-3 py-3 w-20">Lớp</th>
                <th className="border-r border-slate-200 px-3 py-3 w-28">Môn</th>
                <th className="border-r border-slate-200 px-4 py-3 text-left">Tên bài dạy</th>
                <th className="border-r border-slate-200 px-2 py-3 w-20">Tiết PPCT</th>
                <th className="px-4 py-3 text-left w-64">Ghi chú / Thiết bị dạy học</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reportRows.map((row, idx) => {
                const isFirstOfDay = idx === 0 || reportRows[idx - 1].dayOfWeek !== row.dayOfWeek;
                const noteVal = editedNotes[row.id] ?? (row.notes || (row.period === 1 && row.dayOfWeek === 2 ? 'Chào cờ đầu tuần' : 'Máy chiếu, GeoGebra, thước đo góc'));

                return (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="border-r border-slate-200 px-3 py-3 font-bold text-center text-slate-900">
                      {isFirstOfDay ? (
                        <span className="rounded bg-indigo-50 px-2 py-1 text-indigo-800 font-extrabold text-[11px]">
                          {dayNames[row.dayOfWeek]}
                        </span>
                      ) : (
                        <span className="text-slate-400">”</span>
                      )}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-3 text-center text-slate-600 font-medium">
                      {isFirstOfDay ? weekDates[row.dayOfWeek] : ''}
                    </td>
                    <td className="border-r border-slate-200 px-2 py-3 text-center font-bold text-slate-800">
                      Tiết {row.period}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-3 text-center font-black text-slate-900">
                      {row.className}
                    </td>
                    <td className="border-r border-slate-200 px-3 py-3 text-center text-slate-700">
                      {row.subject}
                    </td>
                    <td className="border-r border-slate-200 px-4 py-3 font-semibold text-slate-900">
                      {row.lessonTitle}
                    </td>
                    <td className="border-r border-slate-200 px-2 py-3 text-center font-extrabold text-blue-600">
                      #{row.ppctPeriod || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <input
                        type="text"
                        value={noteVal}
                        onChange={(e) =>
                          setEditedNotes({ ...editedNotes, [row.id]: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none py-0.5 text-xs text-slate-700 print:border-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Print Signatures Footer */}
        <div className="hidden print:grid grid-cols-2 p-8 pt-12 text-center text-xs text-slate-700">
          <div>
            <div className="font-bold uppercase">DUYỆT CỦA TỔ TRƯỞNG CHUYÊN MÔN</div>
            <div className="mt-16 font-semibold">(Ký và ghi rõ họ tên)</div>
          </div>
          <div>
            <div className="italic">Ngày 14 tháng 09 năm 2026</div>
            <div className="font-bold uppercase mt-1">GIÁO VIÊN BÁO GIẢNG</div>
            <div className="mt-16 font-bold">Nguyễn Văn An</div>
          </div>
        </div>
      </div>

      {/* Export Modal Simulation */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileDown className="h-5 w-5 text-indigo-600" />
                Xuất Báo Giảng {showExportModal === 'word' ? 'Word (.docx)' : 'PDF'}
              </h3>
              <button
                onClick={() => setShowExportModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                <div className="font-bold text-slate-800 text-sm">
                  Bao_Giang_Tuan_{currentWeek}_NguyenVanAn.{showExportModal === 'word' ? 'docx' : 'pdf'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Định dạng chuẩn mẫu sổ báo giảng điện tử Bộ GD&ĐT • Dung lượng ~ 124 KB
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-emerald-800 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Kiến trúc xuất tài liệu đã sẵn sàng tải về trực tiếp trên trình duyệt.</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setShowExportModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  addToast(
                    `Đã xuất file ${showExportModal.toUpperCase()} thành công`,
                    `File Bao_Giang_Tuan_${currentWeek}.${showExportModal === 'word' ? 'docx' : 'pdf'} đã sẵn sàng`
                  );
                  setShowExportModal(null);
                }}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Tải xuống máy ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
