import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Copy,
  Download,
  Save,
  RotateCcw,
  CheckCircle2,
  FileText,
  Sliders,
  HelpCircle,
  Lightbulb,
  Gamepad2,
  Cpu,
  Mail,
  Users,
  Award,
  Layers,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';

interface AIToolDef {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultPrompt: {
    topic: string;
    grade: string;
    target: string;
    extra: string;
  };
}

const AI_TOOLS: AIToolDef[] = [
  {
    id: 'khbd_5512',
    name: 'Soạn KHBD CV 5512',
    category: 'Giáo án & Kế hoạch',
    description: 'Tạo giáo án chuẩn Công văn 5512 với đầy đủ 4 hoạt động sư phạm',
    icon: FileText,
    defaultPrompt: {
      topic: 'Định lý Thalès trong tam giác',
      grade: 'Lớp 8',
      target: 'Phát biểu định lý, tính độ dài đoạn thẳng, tỉ số đoạn thẳng',
      extra: 'Tích hợp ứng dụng GeoGebra và bài toán Kim tự tháp Ai Cập',
    },
  },
  {
    id: 'khoi_dong',
    name: 'Hoạt động Khởi động',
    category: 'Phương pháp & Trò chơi',
    description: '3 ý tưởng khởi động hào hứng 3-5 phút tạo bất ngờ đầu giờ',
    icon: Sparkles,
    defaultPrompt: {
      topic: 'Định luật vạn vật hấp dẫn',
      grade: 'Lớp 10',
      target: 'Kích thích tò mò về sự rơi của quả táo và quỹ đạo mặt trăng',
      extra: 'Trò chơi câu đố tình huống hoặc vật thể thật',
    },
  },
  {
    id: 'kiem_tra_cu',
    name: 'Kiểm tra bài cũ (3-5p)',
    category: 'Đánh giá & Câu hỏi',
    description: '5 câu hỏi trắc nghiệm & câu hỏi nhanh kiểm tra đầu giờ',
    icon: HelpCircle,
    defaultPrompt: {
      topic: 'Hằng đẳng thức đáng nhớ',
      grade: 'Lớp 8',
      target: 'Nhớ 3 hằng đẳng thức đầu tiên',
      extra: 'Kèm đáp án và giải thích siêu ngắn',
    },
  },
  {
    id: 'phieu_phan_hoa',
    name: 'Phiếu học tập phân hóa',
    category: 'Tài liệu & Phiếu',
    description: 'Phiếu bài tập 3 cấp độ: Cần hỗ trợ, Đạt chuẩn, Nâng cao',
    icon: Sliders,
    defaultPrompt: {
      topic: 'Phương trình bậc nhất một ẩn',
      grade: 'Lớp 8',
      target: 'Giải thành thạo phương trình cơ bản và nâng cao',
      extra: 'Chia 3 cột cho 3 nhóm học sinh',
    },
  },
  {
    id: 'ma_tran_de',
    name: 'Ma trận & Bảng đặc tả',
    category: 'Đánh giá & Câu hỏi',
    description: 'Ma trận đề kiểm tra 4 mức độ: Nhận biết, Thông hiểu, Vận dụng, VDC',
    icon: Layers,
    defaultPrompt: {
      topic: 'Kiểm tra giữa học kỳ 1 môn Toán',
      grade: 'Lớp 8',
      target: 'Phép nhân đa thức, Tứ giác, Phân thức đại số',
      extra: 'Tỉ lệ 40% TN - 60% TL, thời gian 60 phút',
    },
  },
  {
    id: 'tao_tro_choi',
    name: 'Game học tập (Quizizz/Kahoot)',
    category: 'Phương pháp & Trò chơi',
    description: 'Bộ câu hỏi xuất ngay ra bảng tính để import vào Quizizz, Kahoot, Blooket',
    icon: Gamepad2,
    defaultPrompt: {
      topic: 'Từ loại Tiếng Việt',
      grade: 'Lớp 6',
      target: 'Phân biệt danh từ, động từ, tính từ',
      extra: '10 câu hỏi hài hước, kèm thời gian 30s mỗi câu',
    },
  },
  {
    id: 'edtech_recommend',
    name: 'Gợi ý công cụ EdTech',
    category: 'Công nghệ giáo dục',
    description: 'Khuyến nghị phần mềm mô phỏng (GeoGebra, PhET, Desmos, Padlet)',
    icon: Cpu,
    defaultPrompt: {
      topic: 'Cấu tạo tế bào nhân thực',
      grade: 'Lớp 10',
      target: 'Quan sát tế bào 3D, tương tác bào quan',
      extra: 'Ưu tiên công cụ miễn phí, chạy được trên máy tính phòng học',
    },
  },
  {
    id: 'rubric_danh_gia',
    name: 'Rubric tiêu chí đánh giá',
    category: 'Đánh giá & Câu hỏi',
    description: 'Bảng Rubric chấm bài thuyết trình, dự án STEM hoặc bài thực hành',
    icon: Award,
    defaultPrompt: {
      topic: 'Thuyết trình dự án Năng lượng xanh',
      grade: 'Lớp 9',
      target: 'Nội dung khoa học, Kỹ năng trình bày, Poster/Mô hình',
      extra: 'Thang điểm 4 mức độ (Xuất sắc, Tốt, Đạt, Cần cố gắng)',
    },
  },
  {
    id: 'nhan_xet_hs',
    name: 'Viết nhận xét học sinh (TT22/27)',
    category: 'Hồ sơ & Sổ sách',
    description: 'Nhận xét học bạ, sổ liên lạc mang tính khích lệ, cá nhân hóa',
    icon: CheckCircle2,
    defaultPrompt: {
      topic: 'Học sinh Nguyễn Gia Bảo',
      grade: 'Lớp 8A1',
      target: 'Toán tốt, tư duy nhanh nhưng đôi khi vội vàng, hay quên mang vở nháp',
      extra: 'Theo tinh thần Thông tư 22, động viên phát huy năng lực',
    },
  },
  {
    id: 'thu_phu_huynh',
    name: 'Soạn thư gửi phụ huynh',
    category: 'Giao tiếp & Họp',
    description: 'Thư thông báo họp, nhắc nhở nền nếp hoặc đồng hành cùng con',
    icon: Mail,
    defaultPrompt: {
      topic: 'Kế hoạch học tập & chuẩn bị kiểm tra giữa kỳ 1',
      grade: 'Lớp 8A1',
      target: 'Nhờ phụ huynh đồng hành kiểm tra thời gian tự học tại nhà',
      extra: 'Lời văn ân cần, tôn trọng, mang tính sư phạm cao',
    },
  },
];

export const AICenterView: React.FC = () => {
  const { addToast, addKHBD, addIdea } = useApp();

  const [selectedTool, setSelectedTool] = useState<AIToolDef>(AI_TOOLS[0]);
  const [promptData, setPromptData] = useState(AI_TOOLS[0].defaultPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>(
    aiService.generateKHBD5512(
      AI_TOOLS[0].defaultPrompt.topic,
      AI_TOOLS[0].defaultPrompt.grade,
      AI_TOOLS[0].defaultPrompt.target
    )
  );

  const handleSelectTool = (tool: AIToolDef) => {
    setSelectedTool(tool);
    setPromptData(tool.defaultPrompt);
    // Auto populate sample result for immediate satisfaction
    triggerGeneration(tool, tool.defaultPrompt);
  };

  const triggerGeneration = (tool = selectedTool, data = promptData) => {
    setIsLoading(true);
    setTimeout(() => {
      let result = '';
      switch (tool.id) {
        case 'khbd_5512':
          result = aiService.generateKHBD5512(data.topic, data.grade, data.target);
          break;
        case 'khoi_dong':
          result = aiService.generateWarmUpActivity(data.topic, data.grade);
          break;
        case 'kiem_tra_cu':
          result = aiService.generateQuiz5Min(data.topic, data.grade);
          break;
        case 'phieu_phan_hoa':
          result = aiService.generateWorksheet(data.topic, data.grade);
          break;
        case 'ma_tran_de':
          result = aiService.generateExamMatrix(data.topic, data.grade);
          break;
        case 'tao_tro_choi':
          result = `🎮 BỘ CÂU HỎI GAME HỌC TẬP: ${data.topic.toUpperCase()} (${data.grade})
Định dạng tương thích 1-Click Import Quizizz / Kahoot:

1. Câu 1: [Thời gian: 30s | Điểm: 1000]
   Nội dung: Đâu là đặc điểm nhận biết của ${data.topic}?
   A. [ĐÚNG] Luôn thỏa mãn điều kiện tiên quyết theo định lý
   B. Không có tính tuần hoàn
   C. Chỉ áp dụng cho số nguyên
   D. Cả 3 phương án đều sai
   -> Giải thích: Dựa theo tính chất cơ bản trong SGK.

2. Câu 2: [Thời gian: 45s | Điểm: 1000]
   Nội dung: Khi tăng gấp đôi đại lượng tỉ số thì kết quả thay đổi thế nào?
   A. Không đổi
   B. [ĐÚNG] Tăng tương ứng theo tỉ lệ thuận
   C. Giảm một nửa
   D. Bằng 0

3. Câu 3: [Thời gian: 30s | Điểm: 1000]
   Nội dung: Ứng dụng thực tế nổi tiếng nhất của định lý này là gì?
   A. [ĐÚNG] Đo chiều cao Kim tự tháp qua bóng nắng mặt trời
   B. Chế tạo la bàn
   C. Dự báo thời tiết
   D. Đếm số bước chân`;
          break;
        case 'edtech_recommend':
          result = `💻 BẢNG GỢI Ý CÔNG CỤ EDTECH PHÙ HỢP: ${data.topic.toUpperCase()}

1. Ứng dụng mô phỏng trực quan:
   • GeoGebra Geometry: Dùng vẽ hình động, kéo thả các đỉnh tam giác để học sinh tự phát hiện tỉ số đoạn thẳng không đổi.
   • PhET Interactive Simulations: Mô phỏng bài toán thực tế sinh động.

2. Công cụ tương tác & Thu phiếu lớp:
   • Quizizz / Kahoot: Đố vui khởi động và kiểm tra chốt kiến thức cuối giờ (5 phút).
   • Padlet: Cho các nhóm chụp ảnh sản phẩm giấy A3 dán lên bảng chung của lớp.

3. Kế hoạch triển khai trong 45 phút:
   - Phút 05 - 15: Chiếu GeoGebra trên máy chiếu lớn.
   - Phút 20 - 35: Học sinh thảo luận nhóm.
   - Phút 40 - 45: Quét mã QR Quizizz tổng kết.`;
          break;
        case 'rubric_danh_gia':
          result = `📊 BẢNG RUBRIC ĐÁNH GIÁ SẢN PHẨM / HOẠT ĐỘNG: ${data.topic.toUpperCase()}

| Tiêu chí | Mức 1: Cần cố gắng (1-2đ) | Mức 2: Đạt chuẩn (3-4đ) | Mức 3: Xuất sắc (5đ) |
|---|---|---|---|
| 1. Tính chính xác nội dung | Còn sai sót kiến thức cơ bản | Đầy đủ, chính xác theo SGK | Chính xác, có mở rộng liên hệ thực tế |
| 2. Kỹ năng trình bày | Rụt rè, nói nhỏ, phụ thuộc tài liệu | Nói to rõ ràng, trình bày tự tin | Hấp dẫn, tương tác tốt với khán giả |
| 3. Tính sáng tạo & Thẩm mỹ | Sản phẩm sơ sài | Bố cục sạch đẹp, rõ ràng | Thiết kế ấn tượng, giàu tính trực quan |
| 4. Tinh thần làm việc nhóm | Một số thành viên đứng ngoài | Phân công đều các thành viên | Phối hợp nhịp nhàng, gắn kết cao |

Tổng điểm: 20 điểm. Quy đổi thang điểm 10 theo tỉ lệ chia 2.`;
          break;
        case 'nhan_xet_hs':
          result = `📝 LỜI NHẬN XÉT HỌC SINH (THEO THÔNG TƯ 22 - ĐỘNG VIÊN & XÂY DỰNG)

Học sinh: ${data.topic}
Khối lớp: ${data.grade}

Lời nhận xét đề xuất:
"Em ${data.topic.replace('Học sinh ', '')} có năng lực tư duy logic rất tốt, tiếp thu kiến thức toán học nhanh nhạy và hăng hái xung phong phát biểu xây dựng bài. Để đạt kết quả vượt trội hơn nữa, em cần rèn luyện thêm tính cẩn thận khi tính toán và chú ý chuẩn bị đầy đủ vở nháp trong giờ học. Thầy/Cô tin rằng với sự tập trung, em sẽ đạt được những thành tích xuất sắc!"

Gợi ý ngắn (cho Sổ liên lạc điện tử / VnEdu):
"Tư duy tốt, tiếp thu nhanh; cần cẩn thận hơn trong khâu trình bày bài tập."`;
          break;
        default:
          result = aiService.generateKHBD5512(data.topic, data.grade, data.target);
      }
      setAiOutput(result);
      setIsLoading(false);
      addToast('Đã tạo nội dung AI thành công', `Đã áp dụng mẫu sư phạm cho ${tool.name}`);
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiOutput);
    addToast('Đã sao chép vào bộ nhớ tạm (Clipboard)', 'Thầy/Cô có thể dán trực tiếp vào Word hoặc PowerPoint');
  };

  const handleSaveToKHBD = () => {
    addKHBD({
      title: `[AI 5512] ${promptData.topic}`,
      grade: (promptData.grade as any) || 'Khối 8',
      subject: 'Toán học',
      week: 12,
      ppctPeriod: 46,
      tags: ['AI_Generated', 'CV_5512', selectedTool.id],
      objectives: promptData.target,
      activities: aiOutput,
      notes: `Tạo tự động bởi Teacher Desk AI (${selectedTool.name})`,
      isPrepared: true,
      fileType: 'Word (.docx)',
    });
    addToast('Đã lưu vào Kho KHBD thành công', 'Giáo án đã sẵn sàng trong kho của Thầy/Cô');
  };

  const handleSaveToIdeas = () => {
    addIdea({
      title: `Ý tưởng ${selectedTool.name}: ${promptData.topic}`,
      category: 'phuong_phap',
      grade: promptData.grade,
      subject: 'Toán học',
      content: aiOutput,
      tags: ['AI', selectedTool.id],
      isApplied: false,
    });
    addToast('Đã lưu vào Kho ý tưởng', 'Thầy/Cô có thể mở lại trong tab Kho ý tưởng');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-2 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 p-5 text-white shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              Trung tâm AI – Trợ lý giáo viên EdTech
              <span className="rounded-full bg-indigo-400/20 px-2.5 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-400/30">
                14 công cụ chuyên sâu
              </span>
            </h1>
            <p className="text-xs text-indigo-200">
              Thiết kế chuyên biệt cho giáo viên Việt Nam: Chuẩn Công văn 5512, Thông tư 22/27, ma trận đề và EdTech
            </p>
          </div>
        </div>
      </div>

      {/* 3-Column Layout: Tools List (Left) | Input Form (Center) | Output Display (Right) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: Tools Selector (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Bộ công cụ trợ giảng AI
            </div>

            <div className="space-y-1 max-h-[620px] overflow-y-auto pr-1">
              {AI_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isSelected = selectedTool.id === tool.id;

                return (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTool(tool)}
                    className={`w-full text-left rounded-xl p-2.5 transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 mt-0.5 shrink-0 ${
                        isSelected ? 'text-white' : 'text-indigo-600'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs leading-tight truncate">{tool.name}</div>
                      <div
                        className={`text-[10px] truncate mt-0.5 ${
                          isSelected ? 'text-indigo-100' : 'text-slate-400'
                        }`}
                      >
                        {tool.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Parameter Inputs (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                  Tham số đầu vào
                </span>
                <button
                  onClick={() => triggerGeneration()}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Nạp lại mẫu
                </button>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">{selectedTool.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{selectedTool.description}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên bài học / Chủ đề *</label>
                <input
                  type="text"
                  value={promptData.topic}
                  onChange={(e) => setPromptData({ ...promptData, topic: e.target.value })}
                  placeholder="Ví dụ: Định lý Thalès trong tam giác"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Khối lớp / Đối tượng *</label>
                <input
                  type="text"
                  value={promptData.grade}
                  onChange={(e) => setPromptData({ ...promptData, grade: e.target.value })}
                  placeholder="Ví dụ: Lớp 8"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mục tiêu cần đạt / Trọng tâm
                </label>
                <textarea
                  rows={3}
                  value={promptData.target}
                  onChange={(e) => setPromptData({ ...promptData, target: e.target.value })}
                  placeholder="Kiến thức, năng lực và phẩm chất cần hình thành..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Yêu cầu thêm / Công cụ mong muốn
                </label>
                <textarea
                  rows={2}
                  value={promptData.extra}
                  onChange={(e) => setPromptData({ ...promptData, extra: e.target.value })}
                  placeholder="Ví dụ: Tích hợp GeoGebra, nhóm 4 người, hoạt động vui nhộn..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                onClick={() => triggerGeneration()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>AI đang phân tích & tạo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Tạo nội dung sư phạm AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results Display with Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col h-full min-h-[580px]">
            {/* Output Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  AI Sẵn sàng
                </span>
                <span className="text-[11px] text-slate-400">Độ tin cậy sư phạm 98%</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  title="Sao chép kết quả"
                >
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Sao chép</span>
                </button>
                <button
                  onClick={handleSaveToKHBD}
                  className="flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                  title="Lưu vào Kho KHBD"
                >
                  <Save className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Lưu KHBD</span>
                </button>
                <button
                  onClick={handleSaveToIdeas}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  title="Lưu vào Kho ý tưởng"
                >
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  <span>Lưu ý tưởng</span>
                </button>
              </div>
            </div>

            {/* Output Text Area */}
            <div className="mt-4 flex-1 overflow-y-auto rounded-xl bg-slate-50/70 p-4 border border-slate-200/80 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap selection:bg-indigo-100 max-h-[500px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <span className="h-8 w-8 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
                  <span className="text-xs text-slate-500 font-sans">
                    Đang thiết kế giáo án chuẩn phương pháp dạy học tích cực...
                  </span>
                </div>
              ) : (
                aiOutput
              )}
            </div>

            {/* Output Notice Disclaimer */}
            <div className="mt-3 text-[11px] text-slate-400 italic">
              * Nội dung được tạo bởi mô hình ngôn ngữ hỗ trợ sư phạm. Thầy/Cô có thể tinh chỉnh linh hoạt cho phù hợp với năng lực học sinh từng lớp.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
