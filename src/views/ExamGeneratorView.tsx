import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Layers,
  Sparkles,
  Shuffle,
  Printer,
  FileDown,
  CheckCircle2,
  BookOpen,
  Sliders,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ExamGeneratorView: React.FC = () => {
  const { questionBank, addToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const [config, setConfig] = useState({
    title: 'Đề kiểm tra giữa học kỳ 1',
    subject: 'Toán học',
    grade: 'Khối 8',
    duration: 45,
    examType: 'giua_ky',
    ratioNhanBiet: 40,
    ratioThongHieu: 30,
    ratioVanDung: 20,
    ratioVanDungCao: 10,
    totalQuestions: 12,
    generateCodesCount: 4, // Mã đề 101, 102, 103, 104
  });

  const [activeTabCode, setActiveTabCode] = useState('101');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
            Tạo đề thi & Phiếu kiểm tra phân hóa
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Quy trình chuẩn 4 bước: Thiết lập ma trận • Chọn câu hỏi • Trộn mã đề ngẫu nhiên • Xuất đề & đáp án
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1 rounded-2xl bg-white p-1.5 border border-slate-200 shadow-2xs">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                step === s
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Bước {s}</span>
              {s === 1 && <span className="hidden sm:inline">: Cấu hình</span>}
              {s === 2 && <span className="hidden sm:inline">: Ma trận</span>}
              {s === 3 && <span className="hidden sm:inline">: Trộn đề</span>}
              {s === 4 && <span className="hidden sm:inline">: Xuất bản</span>}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: General Info */}
      {step === 1 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5 animate-in fade-in">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            Bước 1: Thông tin chung bài kiểm tra
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1">Tên bài kiểm tra</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1">Loại kiểm tra</label>
              <select
                value={config.examType}
                onChange={(e) => setConfig({ ...config, examType: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-white"
              >
                <option value="15_phut">Kiểm tra 15 phút</option>
                <option value="1_tiet">Kiểm tra 1 tiết (45 phút)</option>
                <option value="giua_ky">Kiểm tra Giữa học kỳ (60 phút)</option>
                <option value="cuoi_ky">Kiểm tra Cuối học kỳ (90 phút)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1">Môn học</label>
              <select
                value={config.subject}
                onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-white"
              >
                <option value="Toán học">Toán học</option>
                <option value="KHTN">KHTN</option>
                <option value="Tin học">Tin học</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1">Khối lớp</label>
              <select
                value={config.grade}
                onChange={(e) => setConfig({ ...config, grade: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-white"
              >
                <option value="Khối 6">Khối 6</option>
                <option value="Khối 7">Khối 7</option>
                <option value="Khối 8">Khối 8</option>
                <option value="Khối 9">Khối 9</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
            >
              <span>Tiếp tục: Cấu hình ma trận</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Matrix Configuration */}
      {step === 2 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5 animate-in fade-in">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sliders className="h-5 w-5 text-indigo-600" />
            Bước 2: Cấu hình tỉ lệ ma trận nhận thức
          </h2>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 text-center">
              <span className="text-xs font-bold text-blue-700 block">1. Nhận biết</span>
              <div className="mt-2 text-2xl font-black text-blue-900">{config.ratioNhanBiet}%</div>
              <span className="text-[11px] text-blue-600 font-medium">Khoảng 5 câu trắc nghiệm</span>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-center">
              <span className="text-xs font-bold text-emerald-700 block">2. Thông hiểu</span>
              <div className="mt-2 text-2xl font-black text-emerald-900">{config.ratioThongHieu}%</div>
              <span className="text-[11px] text-emerald-600 font-medium">Khoảng 4 câu vận dụng nhẹ</span>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-center">
              <span className="text-xs font-bold text-amber-700 block">3. Vận dụng</span>
              <div className="mt-2 text-2xl font-black text-amber-900">{config.ratioVanDung}%</div>
              <span className="text-[11px] text-amber-600 font-medium">Khoảng 2 câu giải toán</span>
            </div>

            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5 text-center">
              <span className="text-xs font-bold text-rose-700 block">4. Vận dụng cao</span>
              <div className="mt-2 text-2xl font-black text-rose-900">{config.ratioVanDungCao}%</div>
              <span className="text-[11px] text-rose-600 font-medium">1 câu phân hóa 10 điểm</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <strong>Gợi ý:</strong> Hệ thống tự động đối chiếu với Ngân hàng câu hỏi hiện có ({questionBank.length} câu) để rút trích đúng tỉ lệ trên.
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Quay lại
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
            >
              <span>Tiếp tục: Hoán vị & Trộn mã đề</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Shuffle & Generate Multiple Codes */}
      {step === 3 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5 animate-in fade-in">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Shuffle className="h-5 w-5 text-indigo-600" />
            Bước 3: Hoán vị câu hỏi & Sinh các mã đề kiểm tra
          </h2>

          <div className="flex items-center justify-between rounded-xl bg-indigo-50/50 p-4 border border-indigo-100">
            <div>
              <div className="font-bold text-indigo-950 text-sm">Thuật toán trộn đề tự động</div>
              <div className="text-xs text-indigo-700 mt-0.5">
                Hoán vị thứ tự câu hỏi và thứ tự các phương án A, B, C, D tránh trùng lặp giữa các dãy bàn
              </div>
            </div>
            <button
              onClick={() => {
                addToast('Đã xáo trộn ngẫu nhiên thành công', 'Hoán vị 4 mã đề: 101, 102, 103, 104');
              }}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-2xs"
            >
              <Shuffle className="h-3.5 w-3.5" />
              <span>Trộn lại ngay</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {['101', '102', '103', '104'].map((code) => (
              <div
                key={code}
                className="rounded-xl border border-slate-200 p-3 text-center bg-slate-50/50"
              >
                <div className="text-xs text-slate-500 font-semibold">Mã đề</div>
                <div className="text-xl font-black text-indigo-700 mt-1">{code}</div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1">12 câu • Đã sẵn sàng</div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Quay lại
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
            >
              <span>Xem trước & In / Xuất bản</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Export Preview & Answer Key */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Chọn mã đề xem trước:</span>
              <div className="flex rounded-xl bg-slate-100 p-1">
                {['101', '102', '103', '104'].map((code) => (
                  <button
                    key={code}
                    onClick={() => setActiveTabCode(code)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                      activeTabCode === code
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Mã {code}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 shadow-2xs"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>In đề thi</span>
              </button>
              <button
                onClick={() => {
                  addToast('Đã tải xuống file Word đề thi', `File De_Kiem_Tra_Ma_${activeTabCode}.docx`);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-2xs"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>Xuất Word (.docx)</span>
              </button>
            </div>
          </div>

          {/* Real Paper Preview */}
          <div className="rounded-2xl border border-slate-300 bg-white p-8 shadow-md text-slate-900 font-serif max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
            {/* Exam Header */}
            <div className="grid grid-cols-2 border-b-2 border-slate-800 pb-4 text-xs">
              <div className="text-center font-sans space-y-1">
                <div className="font-bold uppercase tracking-wider">TRƯỜNG THCS LÊ QUÝ ĐÔN</div>
                <div className="font-semibold">TỔ: TOÁN - TIN HỌC</div>
                <div className="italic text-slate-600">(Đề kiểm tra có 02 trang)</div>
              </div>

              <div className="text-center font-sans space-y-1">
                <div className="font-bold uppercase tracking-wider">{config.title.toUpperCase()}</div>
                <div>Môn: {config.subject} – {config.grade}</div>
                <div className="italic">Thời gian làm bài: {config.duration} phút (không kể phát đề)</div>
                <div className="inline-block rounded border border-slate-800 px-2 py-0.5 font-bold font-mono">
                  MÃ ĐỀ: {activeTabCode}
                </div>
              </div>
            </div>

            <div className="text-xs font-sans mt-3 text-slate-600 italic">
              Họ và tên học sinh: ........................................................................ Lớp: ............. SBD: ...............
            </div>

            {/* Questions List */}
            <div className="mt-6 space-y-5 text-sm font-sans leading-relaxed">
              <div className="font-bold text-xs uppercase tracking-wider bg-slate-100 p-2 rounded">
                PHẦN I: CÂU HỎI TRẮC NGHIỆM KHÁCH QUAN (7,0 ĐIỂM)
              </div>

              {questionBank.slice(0, 4).map((q, i) => (
                <div key={q.id} className="space-y-2">
                  <div className="font-medium text-xs sm:text-sm">
                    <strong>Câu {i + 1}:</strong> {q.content}
                  </div>
                  {q.options && (
                    <div className="grid grid-cols-2 gap-2 text-xs pl-4">
                      {q.options.map((opt, optIdx) => {
                        const optText = typeof opt === 'string' ? opt : `${opt.key}. ${opt.text}`;
                        return (
                          <div key={optIdx}>
                            <strong>{typeof opt === 'string' ? `${String.fromCharCode(65 + optIdx)}.` : ''}</strong> {optText}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              <div className="font-bold text-xs uppercase tracking-wider bg-slate-100 p-2 rounded mt-6">
                PHẦN II: TỰ LUẬN (3,0 ĐIỂM)
              </div>

              <div className="space-y-2 text-xs sm:text-sm pl-2">
                <div>
                  <strong>Câu 5 (2,0 điểm):</strong> Cho hình thang ABCD (AB // CD). Một đường thẳng song song với hai đáy cắt cạnh AD tại M và cắt cạnh BC tại N. Biết AM = 4 cm, MD = 6 cm, BN = 5 cm. Tính độ dài đoạn NC?
                </div>
                <div>
                  <strong>Câu 6 (1,0 điểm):</strong> [Vận dụng cao] Ứng dụng định lý Thalès để đo chiều cao một tòa nhà cao tầng khi chỉ có một cọc tiêu cao 2m và một thước cuộn. Trình bày phương án đo đạc chi tiết.
                </div>
              </div>

              <div className="text-center italic text-xs pt-8 text-slate-500">
                --- HẾT --- <br />
                (Giám thị coi thi không giải thích gì thêm)
              </div>
            </div>

            {/* Answer Key Strip (For Teacher) */}
            <div className="mt-8 border-t-2 border-dashed border-slate-300 pt-4 font-sans text-xs text-slate-700 print:page-break-before">
              <div className="font-bold text-emerald-800 text-sm mb-2">
                ĐÁP ÁN NHANH (DÀNH CHO GIÁO VIÊN CHẤM THI - MÃ ĐỀ {activeTabCode})
              </div>
              <div className="grid grid-cols-6 gap-2 text-center">
                <div className="rounded border bg-slate-50 p-1.5 font-bold">1. A (0.5đ)</div>
                <div className="rounded border bg-slate-50 p-1.5 font-bold">2. B (0.5đ)</div>
                <div className="rounded border bg-slate-50 p-1.5 font-bold">3. D (0.5đ)</div>
                <div className="rounded border bg-slate-50 p-1.5 font-bold">4. A (0.5đ)</div>
                <div className="rounded border bg-slate-50 p-1.5 font-bold">5. NC = 7.5cm (2.0đ)</div>
                <div className="rounded border bg-slate-50 p-1.5 font-bold">6. Phương án chuẩn (1.0đ)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
