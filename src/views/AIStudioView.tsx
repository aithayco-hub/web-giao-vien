import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Copy,
  Printer,
  FileDown,
  Layers,
  Video,
  Presentation,
  CheckCircle2,
  Users,
  Grid,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface StudioTemplate {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const TEMPLATES: StudioTemplate[] = [
  {
    id: 'slide_10',
    title: 'Kịch bản Slide PowerPoint 10 trang',
    desc: 'Cấu trúc bài giảng chuẩn 10 slide: Khởi động, Khái niệm, Minh họa hình ảnh, Ví dụ, Bài tập, Tổng kết',
    icon: Presentation,
    tag: 'Slide thuyết trình',
  },
  {
    id: 'video_script',
    title: 'Kịch bản Video bài giảng 3-5 phút',
    desc: 'Lời thoại (voice-over) kèm hành động hình ảnh màn hình dành cho bài giảng điện tử E-learning',
    icon: Video,
    tag: 'E-learning',
  },
  {
    id: 'worksheet_a4',
    title: 'Phiếu học tập A4 in sẵn',
    desc: 'Bố cục chuẩn khổ giấy A4 gồm 3 phần: Tóm tắt lý thuyết, Bài tập cơ bản, Câu hỏi vận dụng thực tế',
    icon: Layers,
    tag: 'In ấn lớp học',
  },
  {
    id: 'station_learning',
    title: 'Trò chơi Trạm học tập (Station Learning)',
    desc: 'Kế hoạch tổ chức 4 trạm luân chuyển nhóm: Trạm Khám phá, Trạm Thực hành, Trạm Công nghệ, Trạm Tranh biện',
    icon: Grid,
    tag: 'Phương pháp tích cực',
  },
  {
    id: 'group_criteria',
    title: 'Bảng phân công nhóm & Tiêu chí đánh giá',
    desc: 'Mẫu phân công vai trò: Nhóm trưởng, Thư ký, Báo cáo viên, Quản lý thời gian kèm thang điểm',
    icon: Users,
    tag: 'Hoạt động nhóm',
  },
];

export const AIStudioView: React.FC = () => {
  const { addToast } = useApp();

  const [selectedTemplate, setSelectedTemplate] = useState<StudioTemplate>(TEMPLATES[0]);
  const [topic, setTopic] = useState('Định lý Thalès trong tam giác');
  const [grade, setGrade] = useState('Lớp 8');
  const [isGenerating, setIsGenerating] = useState(false);

  // Content Outputs
  const [generatedContent, setGeneratedContent] = useState<string>(`📊 KỊCH BẢN SLIDE BÀI GIẢNG 10 TRANG: ${topic.toUpperCase()}

[Slide 1: Trang bìa]
- Tiêu đề chính: ĐỊNH LÝ THALÈS TRONG TAM GIÁC
- Môn: Hình học 8 • Bộ sách Kết nối tri thức với cuộc sống
- Giáo viên thực hiện: Nguyễn Văn An

[Slide 2: Khởi động - Bí ẩn Kim Tự Tháp]
- Hình ảnh: Nhà toán học Thalès đứng bên Kim tự tháp Giza dưới ánh nắng mặt trời
- Câu hỏi đặt vấn đề: "Làm thế nào để đo chiều cao một công trình khổng lồ mà không cần trèo lên đỉnh?"
- Dẫn dắt vào bài học mới.

[Slide 3: Khám phá 1 - Tỉ số hai đoạn thẳng]
- Định nghĩa tỉ số của hai đoạn thẳng AB và CD
- Lưu ý sư phạm: Hai đoạn thẳng phải cùng đơn vị đo độ dài
- Ví dụ nhanh: AB = 3cm, CD = 50mm => AB/CD = 3/5.

[Slide 4: Khám phá 2 - Đoạn thẳng tỉ lệ]
- Hình vẽ trực quan trên lưới ô vuông
- Phát biểu điều kiện tỉ lệ thức giữa 4 đoạn thẳng.

[Slide 5: Trọng tâm - Định lý Thalès (Thuận)]
- Khung ghi nhớ nổi bật:
  "Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ."
- Giả thiết: Tam giác ABC, d // BC cắt AB tại D, AC tại E
- Kết luận: AD/AB = AE/AC; AD/DB = AE/EC; DB/AB = EC/AC.

[Slide 6: Minh họa hình học động GeoGebra]
- Chèn liên kết mô hình GeoGebra
- Yêu cầu học sinh quan sát sự thay đổi độ dài khi kéo rê điểm D nhưng tỉ số luôn bất biến.

[Slide 7: Bài tập vận dụng 1 (Tính độ dài)]
- Đề bài: Cho tam giác ABC, MN // BC. Biết AM = 4, MB = 2, AN = 6. Tính NC?
- Lời giải mẫu 3 bước chuẩn trình bày.

[Slide 8: Thảo luận nhóm - Thực tế đời sống]
- Hoạt động nhóm 4 em: Thiết kế phương án đo chiều cao cột cờ trường học
- Thời gian thảo luận: 5 phút.

[Slide 9: Tổng kết bài học qua sơ đồ tư duy]
- Bản đồ nhánh: Tỉ số đoạn thẳng -> Định lý Thalès -> Ứng dụng đo đạc.

[Slide 10: Hướng dẫn tự học & Dặn dò]
- Làm bài tập 4.1, 4.2 trong SGK
- Chuẩn bị thước đo góc cho bài học sau.`);

  const handleGenerate = (tpl = selectedTemplate) => {
    setIsGenerating(true);
    setTimeout(() => {
      let content = '';
      if (tpl.id === 'slide_10') {
        content = `📊 KỊCH BẢN SLIDE BÀI GIẢNG 10 TRANG: ${topic.toUpperCase()} (${grade})

[Slide 1: Trang bìa]
- Tiêu đề: ${topic}
- Giáo viên giảng dạy: Nguyễn Văn An

[Slide 2: Khởi động]
- Tình huống thực tế bất ngờ kết nối trải nghiệm học sinh.

[Slide 3 & 4: Khám phá kiến thức cốt lõi]
- Khái niệm nền tảng và minh họa trực quan sinh động.

[Slide 5: Định lý / Quy tắc trọng tâm]
- Đóng khung kiến thức ghi nhớ cốt lõi theo SGK chuẩn.

[Slide 6: Mô hình EdTech tương tác]
- Hình vẽ động hoặc thí nghiệm mô phỏng.

[Slide 7: Bài tập mẫu]
- Phân tích đề bài và lời giải từng bước.

[Slide 8: Hoạt động thảo luận nhóm]
- Thử thách thực tế cho các bàn.

[Slide 9: Sơ đồ tư duy tổng kết]
- Chốt lại 3 từ khóa quan trọng nhất.

[Slide 10: Dặn dò nhiệm vụ về nhà]
- Bài tập rèn luyện và mở rộng.`;
      } else if (tpl.id === 'video_script') {
        content = `🎬 KỊCH BẢN VIDEO BÀI GIẢNG 3-5 PHÚT (E-LEARNING): ${topic.toUpperCase()}

[00:00 - 00:30] Mở đầu (Hook):
- Hình ảnh: Giáo viên xuất hiện thân thiện hoặc hoạt họa mở đầu.
- Voice-over: "Chào các em! Hôm nay chúng ta sẽ cùng khám phá một trong những định lý đẹp đẽ nhất trong toán học: ${topic}..."

[00:30 - 02:00] Trình bày kiến thức trọng tâm:
- Màn hình: Hoạt họa tam giác và đường thẳng song song chuyển động.
- Voice-over: "Hãy tưởng tượng đường thẳng cắt ngang hai cạnh của tam giác..."

[02:00 - 03:30] Ví dụ áp dụng thực tế:
- Màn hình: Bài toán tính chiều cao Kim tự tháp hoặc cột cờ.
- Voice-over: "Bây giờ, hãy cùng áp dụng công thức để giải quyết bài toán sau..."

[03:30 - 04:30] Tóm tắt & Kêu gọi hành động:
- Voice-over: "Hãy ghi nhớ tỉ số này nhé! Hẹn gặp lại các em trong bài học tiếp theo!"`;
      } else if (tpl.id === 'station_learning') {
        content = `🎯 KẾ HOẠCH DẠY HỌC THEO TRẠM (STATION LEARNING): ${topic.toUpperCase()}

• Thời gian: 40 phút (Mỗi trạm 8 phút + 2 phút di chuyển)
• Sắp xếp: 4 trạm xung quanh lớp học

TRẠM 1: TRẠM KHÁM PHÁ (Trạm Lý thuyết)
- Nhiệm vụ: Đọc SGK trang 45 và hoàn thành bảng điền từ khóa về định lý.
- Đồ dùng: Bảng phụ A2, bút dạ màu.

TRẠM 2: TRẠM CÔNG NGHỆ (Trạm EdTech)
- Nhiệm vụ: Mở máy tính bảng/máy tính bàn có sẵn mô hình GeoGebra, kéo các điểm và ghi lại 3 cặp tỉ số đo được.
- Đồ dùng: 2 máy tính tính bảng có sẵn GeoGebra.

TRẠM 3: TRẠM THỰC HÀNH (Trạm Bài tập)
- Nhiệm vụ: Cùng nhau giải 2 bài toán tính độ dài đoạn thẳng.
- Đồ dùng: Phiếu bài tập in sẵn.

TRẠM 4: TRẠM TRANH BIỆN (Trạm Mở rộng)
- Nhiệm vụ: Trả lời câu hỏi "Nếu hai đường thẳng không song song thì định lý còn đúng không? Vẽ hình phản ví dụ".`;
      } else {
        content = `📋 PHIẾU HỌC TẬP KHỔ A4 IN SẴN: ${topic.toUpperCase()}
Môn: Toán học • Lớp: ${grade}
Họ và tên học sinh: .................................................... Lớp: ..........

I. TÓM TẮT KIẾN THỨC CỐT LÕI:
[Ô ghi nhớ định lý và công thức tỉ số tương ứng]

II. BÀI TẬP VẬN DỤNG CƠ BẢN:
Bài 1: Tính x trong các hình vẽ sau...
Bài 2: Cho tam giác ABC...

III. THỬ THÁCH SÁNG TẠO:
Hãy tự đặt một bài toán thực tế xung quanh trường học mà em có thể giải được bằng kiến thức hôm nay.`;
      }

      setGeneratedContent(content);
      setIsGenerating(false);
      addToast('Studio AI đã tạo xong tài liệu', `Kịch bản cho ${tpl.title}`);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-md">
            <Wand2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              Studio học liệu AI
              <span className="rounded-full bg-blue-400/20 px-2.5 py-0.5 text-xs font-bold text-blue-300 border border-blue-400/30">
                Sản xuất tài liệu 1-Click
              </span>
            </h1>
            <p className="text-xs text-blue-200">
              Tạo nhanh kịch bản slide 10 trang, kịch bản video E-learning, phiếu A4 in sẵn và trò chơi Trạm học tập
            </p>
          </div>
        </div>
      </div>

      {/* Templates Selector Carousel / Grid */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {TEMPLATES.map((tpl) => {
          const Icon = tpl.icon;
          const isSelected = selectedTemplate.id === tpl.id;

          return (
            <div
              key={tpl.id}
              onClick={() => {
                setSelectedTemplate(tpl);
                handleGenerate(tpl);
              }}
              className={`cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/60 shadow-md ring-2 ring-indigo-200'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {tpl.tag}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">{tpl.title}</h3>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">{tpl.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                <span>Chọn mẫu này</span> →
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex-1 min-w-[240px]">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Chủ đề / Tên bài học
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ví dụ: Định lý Thalès trong tam giác"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 font-semibold focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="w-40">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Khối lớp
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="Lớp 6">Lớp 6</option>
            <option value="Lớp 7">Lớp 7</option>
            <option value="Lớp 8">Lớp 8</option>
            <option value="Lớp 9">Lớp 9</option>
          </select>
        </div>

        <div className="pt-5">
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? 'Đang tạo...' : 'Tạo kịch bản với AI'}</span>
          </button>
        </div>
      </div>

      {/* Output Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
              {selectedTemplate.title}
            </span>
            <div className="text-xs text-slate-500 mt-1">
              Chủ đề: <strong>{topic}</strong> • Đối tượng: <strong>{grade}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedContent);
                addToast('Đã sao chép kịch bản vào bộ nhớ tạm', 'Thầy/Cô có thể dán vào Word/PowerPoint');
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Sao chép</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>In bản thảo</span>
            </button>

            <button
              onClick={() => {
                addToast('Đã xuất file kịch bản', 'File Studio_Export.docx đã sẵn sàng');
              }}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>Xuất Word (.docx)</span>
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-5 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap border border-slate-200/80 max-h-[600px] overflow-y-auto">
          {generatedContent}
        </div>
      </div>
    </div>
  );
};
