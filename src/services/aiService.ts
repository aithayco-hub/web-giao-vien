export type AITaskType =
  | 'objectives'
  | 'activities'
  | 'questions'
  | 'exercises'
  | 'rubric'
  | 'worksheet'
  | 'image_prompt'
  | 'video_prompt'
  | 'game_ideas'
  | 'webapp_prompt';

export interface AIRequestParams {
  grade: string;
  subject: string;
  lessonName: string;
  mainContent?: string;
  customPrompt?: string;
  taskType: AITaskType;
}

export interface AIResponse {
  content: string;
  isRealAI: boolean;
  modelName: string;
  notice: string;
}

export const aiService = {
  generateKHBD5512: (topic: string, grade: string, target?: string) => {
    return `### KẾ HOẠCH BÀI DẠY (KHBD) THEO CÔNG VĂN 5512/BGDĐT
**Tên bài dạy:** ${topic}
**Khối lớp:** ${grade} | **Thời lượng dự kiến:** 2 tiết
**Yêu cầu cần đạt:** ${target || 'Nắm vững khái niệm, tính chất và áp dụng giải bài toán thực tế'}

---
#### I. MỤC TIÊU BÀI HỌC
1. Về năng lực:
- Năng lực toán học: Nắm vững định nghĩa, chứng minh và các hệ quả liên quan đến ${topic}.
- Năng lực tư duy và lập luận: Biết phân tích giả thiết, kết luận và mô hình hóa hình học.
- Năng lực tự chủ và tự học: Chủ động đọc SGK, hoàn thành nhiệm vụ cá nhân.
2. Về phẩm chất:
- Chăm chỉ, tích cực tham gia thảo luận nhóm và báo cáo kết quả.

---
#### II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
1. Giáo viên: Giáo án, TV thông minh, slide trình chiếu, phần mềm mô phỏng GeoGebra, phiếu học tập số 1 & 2.
2. Học sinh: SGK, thước kẻ có chia độ, máy tính cầm tay, bảng phụ nhóm.

---
#### III. TIẾN TRÌNH DẠY HỌC
**HOẠT ĐỘNG 1: KHỞI ĐỘNG (5 phút)**
- Mục tiêu: Tạo tâm thế học tập, kích thích sự tò mò về bài ${topic}.
- Nội dung: GV trình chiếu hình ảnh Kim tự tháp Ai Cập và đặt bài toán đo chiều cao.
- Sản phẩm: Dự đoán phương pháp đo của các nhóm học sinh.
- Tổ chức thực hiện: GV chuyển giao -> HS trao đổi cặp đôi -> Đại diện trả lời -> GV đặt vấn đề vào bài.

**HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC (20 phút)**
- Hoạt động khám phá: Vẽ đường thẳng song song và đo tỉ số các đoạn thẳng.
- Phát biểu định lý: GV chuẩn hóa định lý chính thức theo chuẩn chương trình.

**HOẠT ĐỘNG 3: LUYỆN TẬP (15 phút)**
- Bài tập áp dụng tính độ dài đoạn thẳng x, y trong hình vẽ.
- Học sinh làm bài cá nhân và chấm chéo.

**HOẠT ĐỘNG 4: VẬN DỤNG & MỞ RỘNG (5 phút)**
- Bài toán thực tế đo bóng nắng cây bàng trong sân trường.`;
  },

  generateWarmUpActivity: (topic: string, grade: string) => {
    return `🎯 HOẠT ĐỘNG KHỞI ĐỘNG HẤP DẪN: ${topic.toUpperCase()} (${grade})
Thời lượng: 5 - 7 phút | Hình thức: Trò chơi tương tác "Giải cứu mật mã tri thức"

1. Tình huống mở đầu (Kịch bản giáo viên):
"Chào các em! Hôm nay chúng ta nhận được bức thư khẩn từ nhà toán học cổ đại. Để mở được rương báu chứa chìa khóa bài học hôm nay, lớp mình cần vượt qua 3 câu hỏi trắc nghiệm tốc độ."

2. Chuỗi 3 câu hỏi khởi động:
- Câu 1 (Hình ảnh): Nhìn vào 2 hình tam giác đồng dạng, các em thấy tỉ lệ các cạnh có gì đặc biệt?
- Câu 2 (Tư duy nhanh): Nếu một người cao 1.6m có bóng nắng dài 0.8m, thì một cây cột cờ có bóng nắng dài 4m sẽ cao bao nhiêu mét? (Đáp án: 8m)
- Câu 3 (Gợi mở): Định lý nào trong hình học giúp ta giải quyết bài toán trên trong tích tắc?

3. Lời dẫn chuyển tiếp của GV:
"Chính xác! Đó chính là bài học vô cùng kỳ diệu hôm nay: ${topic}."`;
  },

  generateQuiz5Min: (topic: string, grade: string) => {
    return `⏱️ ĐỀ KIỂM TRA 5 PHÚT ĐẦU GIỜ / CHỐT BÀI: ${topic.toUpperCase()} (${grade})
Hình thức: 4 câu trắc nghiệm khách quan (Mỗi câu 2.5 điểm)

Câu 1 (Nhận biết): Điều kiện cần và đủ để áp dụng định lý trong bài ${topic} là gì?
A. Phải có đường thẳng song song cắt hai cạnh của tam giác (ĐÚNG)
B. Tam giác phải là tam giác vuông
C. Tam giác phải là tam giác đều
D. Không cần điều kiện nào

Câu 2 (Thông hiểu): Cho tam giác ABC có MN // BC (M thuộc AB, N thuộc AC). Biết AM = 3cm, MB = 6cm, AN = 2cm. Độ dài NC là:
A. 3 cm
B. 4 cm (ĐÚNG - vì AM/MB = AN/NC => 3/6 = 2/NC => NC = 4)
C. 5 cm
D. 6 cm

Câu 3 (Vận dụng): Tỉ số giữa hai đoạn thẳng MN và BC bằng tỉ số nào dưới đây?
A. AM / MB
B. AM / AB (ĐÚNG)
C. MB / AB
D. AN / NC

Câu 4 (Vận dụng thực tế): Ứng dụng quan trọng nhất của bài học này trong thực tế là:
A. Đo khoảng cách không thể tới trực tiếp (bờ sông, chiều cao toà nhà) (ĐÚNG)
B. Tính khối lượng trái đất
C. Đếm số hạt cát
D. Dự đoán hướng gió`;
  },

  generateWorksheet: (topic: string, grade: string) => {
    return `📄 PHIẾU HỌC TẬP PHÂN HÓA 3 MỨC ĐỘ: ${topic.toUpperCase()}
Môn: Toán học | Lớp: ${grade}
Họ và tên: ............................................ Lớp: ............. Nhóm: .............

---
PHẦN A: MỨC ĐỘ CƠ BẢN (Dành cho mọi học sinh - 5 điểm)
Bài 1: Điền vào chỗ trống định lý đã học trong SGK về ${topic}.
Bài 2: Cho hình vẽ đính kèm, hãy viết tỉ số đồng dạng giữa các cạnh tương ứng.

PHẦN B: MỨC ĐỘ KHÁ (Rèn kỹ năng biến đổi - 3 điểm)
Bài 3: Cho tam giác có chu vi 24cm, tính các cạnh khi biết tỉ lệ 2:3:4.
Bài 4: Chứng minh hệ thức giữa các đoạn thẳng chắn trên hai cạnh tam giác.

PHẦN C: MỨC ĐỘ NÂNG CAO (Thử thách học sinh giỏi - 2 điểm)
Bài 5: Bài toán tối ưu hóa vị trí đặt trạm biến áp sao cho tổng chiều dài dây cáp là ngắn nhất dựa vào phép biến hình và định lý tỉ số.`;
  },

  generateExamMatrix: (topic: string, grade: string) => {
    return `📊 MA TRẬN & BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ
Chủ đề trọng tâm: ${topic} (${grade})

| Mạch nội dung | Nhận biết (40%) | Thông hiểu (30%) | Vận dụng (20%) | Vận dụng cao (10%) | Tổng điểm |
|---|:---:|:---:|:---:|:---:|:---:|
| 1. Khái niệm & Định lý chuẩn | 4 câu TN (1.0đ) | 2 câu TN (0.5đ) | 0 câu | 0 câu | 1.5 điểm |
| 2. Kỹ năng tính toán cơ bản | 4 câu TN (1.0đ) | 4 câu TN (1.0đ) | 1 câu TL (1.0đ) | 0 câu | 3.0 điểm |
| 3. Chứng minh hình học | 2 câu TN (0.5đ) | 2 câu TN (0.5đ) | 1 câu TL (1.5đ) | 0 câu | 2.5 điểm |
| 4. Bài toán thực tế / Nâng cao | 0 câu | 1 câu TN (0.25đ) | 1 câu TL (1.0đ) | 1 câu TL (0.75đ) | 2.0 điểm |
| **TỔNG CỘNG** | **2.5 điểm** | **2.25 điểm** | **3.5 điểm** | **0.75 điểm** | **10.0 điểm** |`;
  },
};

export async function generateEdTechAI(params: AIRequestParams): Promise<AIResponse> {
  // First, check if backend /api/ai is available
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        return {
          content: data.content,
          isRealAI: true,
          modelName: data.model || 'Gemini 2.5/3.0',
          notice: 'Nội dung do AI hỗ trợ tạo. Giáo viên cần kiểm tra kiến thức chuyên môn trước khi sử dụng.',
        };
      }
    }
  } catch (err) {
    // Network or endpoint not ready - fall through to mock pedagogical engine
  }

  // Pedagogical simulated generation with realistic educational rigor
  // Simulate delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 800));

  const content = generateSimulatedPedagogicalContent(params);

  return {
    content,
    isRealAI: false,
    modelName: 'Mô phỏng EdTech Assistant (Chế độ Demo ngoại tuyến)',
    notice: 'Nội dung do AI hỗ trợ tạo (Chế độ mô phỏng EdTech). Giáo viên cần kiểm tra kiến thức chuyên môn trước khi sử dụng.',
  };
}

function generateSimulatedPedagogicalContent(p: AIRequestParams): string {
  const lesson = p.lessonName || 'Bài học chuyên đề';
  const grade = p.grade || 'Khối 8';
  const subject = p.subject || 'Toán học';

  switch (p.taskType) {
    case 'objectives':
      return `### YÊU CẦU CẦN ĐẠT & MỤC TIÊU BÀI HỌC (Chuẩn Công văn 5512/BGDĐT)
**Tên bài:** ${lesson} | **Môn:** ${subject} | **${grade}**

#### 1. Về năng lực:
* **Năng lực đặc thù (${subject}):**
  - Nhận biết và phát biểu được các khái niệm, định lý trọng tâm của bài: *${lesson}*.
  - Vận dụng linh hoạt các tính chất để giải quyết các bài toán cơ bản và nâng cao.
  - Sử dụng ngôn ngữ toán học/khoa học chính xác trong giao tiếp và trình bày lập luận.
* **Năng lực chung:**
  - *Tự chủ và tự học:* Tự giác hoàn thành phiếu học tập cá nhân, chủ động tra cứu tài liệu.
  - *Giao tiếp và hợp tác:* Phân công nhiệm vụ nhóm hợp lý, lắng nghe và phản biện tích cực.
  - *Giải quyết vấn đề và sáng tạo:* Đề xuất phương án đo đạc hoặc mô hình hóa thực tế.

#### 2. Về phẩm chất:
* *Chăm chỉ:* Tích cực tham gia các hoạt động xây dựng bài học.
* *Trung thực:* Khách quan trong việc báo cáo số liệu và kết quả học tập cá nhân/nhóm.
* *Trách nhiệm:* Hoàn thành đúng hạn nhiệm vụ được giao trong nhóm học tập.`;

    case 'activities':
      return `### CHUỖI CÁC HOẠT ĐỘNG DẠY HỌC (4 BƯỚC CÔNG VĂN 5512)
**Bài học:** ${lesson} (${subject} - ${grade})

#### HOẠT ĐỘNG 1: KHỞI ĐỘNG (5 - 7 phút)
- **Mục tiêu:** Tạo tâm thế hào hứng, khơi gợi mâu thuẫn nhận thức từ tình huống thực tiễn.
- **Nội dung:** Cho học sinh quan sát hình ảnh/video thực tế liên quan đến *${lesson}* và đặt câu hỏi gợi mở.
- **Sản phẩm:** Câu trả lời dự đoán ban đầu của các nhóm học sinh trên bảng phụ hoặc Padlet.
- **Tổ chức thực hiện:** GV giao nhiệm vụ -> HS thảo luận cặp đôi -> 2 đại diện trả lời -> GV dẫn dắt vào bài mới.

#### HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (18 - 20 phút)
- **Mục tiêu:** Khám phá định lý/quy tắc và hình thành kiến thức cốt lõi.
- **Nội dung:** Thao tác trên Phiếu học tập số 1 (đo đạc, so sánh tỉ số hoặc phân tích mô hình).
- **Sản phẩm:** Bảng tổng kết kiến thức rút ra và phát biểu định lý/tính chất chính xác.
- **Tổ chức thực hiện:** Chuyển giao nhiệm vụ nhóm 4 HS -> Các nhóm thực hành -> Báo cáo trạm chéo -> GV chuẩn hóa kiến thức.

#### HOẠT ĐỘNG 3: LUYỆN TẬP (12 - 15 phút)
- **Mục tiêu:** Củng cố trực tiếp kiến thức vừa học qua bài tập phân hóa.
- **Nội dung:** Giải bài tập mức Nhận biết & Thông hiểu.
- **Sản phẩm:** Lời giải chuẩn trong vở ghi của học sinh và bảng nhóm.
- **Tổ chức thực hiện:** Học sinh làm việc cá nhân -> Kiểm tra chéo đôi bạn cùng tiến.

#### HOẠT ĐỘNG 4: VẬN DỤNG & MỞ RỘNG (3 - 5 phút)
- **Mục tiêu:** Kết nối kiến thức bài học với ứng dụng thực tế đời sống hoặc dự án nhỏ.
- **Nội dung:** Giao nhiệm vụ tìm hiểu ứng dụng *${lesson}* tại gia đình hoặc môi trường xung quanh.`;

    case 'questions':
      return `### BỘ CÂU HỎI THEO 4 MỨC ĐỘ NHẬN THỨC
**Bài học:** ${lesson} (${subject} - ${grade})

**1. Mức độ: Nhận biết (Trắc nghiệm)**
*Câu 1:* Phát biểu nào sau đây là định nghĩa/tính chất chính xác nhất về ${lesson}?
- A. [Lựa chọn đúng theo sách giáo khoa]
- B. [Lựa chọn gây nhiễu về dấu hoặc điều kiện]
- C. [Lựa chọn thiếu điều kiện áp dụng]
- D. [Lựa chọn phủ định hoàn toàn]
*Đáp án đúng:* A
*Giải thích:* Căn cứ vào định nghĩa chuẩn trong chương trình.

**2. Mức độ: Thông hiểu (Trắc nghiệm)**
*Câu 2:* Cho dữ liệu thực tế đơn giản áp dụng ${lesson}. Giá trị cần tìm là:
- A. 12
- B. 16 (Đáp án đúng)
- C. 24
- D. 8
*Giải thích:* Thay trực tiếp số liệu vào công thức tỉ lệ để rút ra kết quả 16.

**3. Mức độ: Vận dụng (Tự luận / Trả lời ngắn)**
*Câu 3:* Một bài toán liên môn kết hợp giữa ${subject} và tình huống đo đạc thực tế (chiều cao công trình hoặc tính toán chi phí). Hãy thiết lập phương trình/tỉ số và tính kết quả chính xác.

**4. Mức độ: Vận dụng cao (Tự luận sáng tạo)**
*Câu 4:* Cho bài toán chứa tham số hoặc hình học mở rộng, yêu cầu học sinh chứng minh bất đẳng thức hoặc tìm vị trí điểm tối ưu dựa trên kiến thức ${lesson}.`;

    case 'rubric':
      return `### RUBRIC ĐÁNH GIÁ NĂNG LỰC HỌC SINH
**Chuyên đề:** ${lesson} (${subject} - ${grade})

| Tiêu chí | Mức 1: Chưa đạt (0-4đ) | Mức 2: Đạt (5-6.5đ) | Mức 3: Khá (7-8.5đ) | Mức 4: Tốt (9-10đ) |
| :--- | :--- | :--- | :--- | :--- |
| **Nắm vững kiến thức cốt lõi** | Chưa phát biểu đúng định lý/công thức. | Nhớ công thức nhưng còn nhầm lẫn điều kiện. | Phát biểu chính xác, giải thích được ý nghĩa. | Vận dụng thành thạo, liên hệ sâu sắc. |
| **Kỹ năng giải bài tập** | Không lập được hệ thức/phương trình. | Áp dụng được vào bài mẫu đơn giản. | Tự giải bài thông hiểu và vận dụng tốt. | Trình bày chặt chẽ, tìm ra nhiều cách giải hay. |
| **Hợp tác nhóm** | Thụ động, không tham gia thảo luận. | Có tham gia nhưng chưa đóng góp ý kiến. | Đóng góp tích cực nhiệm vụ được phân công. | Chủ động điều phối, hỗ trợ bạn cùng tiến bộ. |
| **Thuyết trình & Phản biện** | Nói ngắt quãng, chưa rõ ý. | Trình bày đủ ý nhưng nhìn slide/giấy nhiều. | Tự tin, diễn đạt mạch lạc, dùng đúng thuật ngữ. | Lôi cuốn, bảo vệ luận điểm thuyết phục trước lớp. |`;

    case 'worksheet':
      return `### PHIẾU HỌC TẬP: KHÁM PHÁ KIẾN THỨC
**Môn:** ${subject} ${grade} | **Bài:** ${lesson}
*Họ và tên học sinh:* .................................................... *Lớp:* ......... *Nhóm:* .........

---
#### PHẦN I: THỬ THÁCH KHỞI ĐỘNG (Khởi động nơ-ron)
Quan sát hình vẽ / dữ liệu sau và điền vào chỗ trống:
1. Em nhận xét gì về tỉ số giữa đoạn thẳng A và B? ....................................................
2. Nếu kéo dài gấp đôi thì mối liên hệ có thay đổi không? ....................................................

#### PHẦN II: KHÁM PHÁ TRỌNG TÂM
- Hoàn thành bảng so sánh số liệu thực nghiệm:
  | Lần đo | Giá trị X | Giá trị Y | Tỉ số X/Y |
  | :---: | :---: | :---: | :---: |
  | 1 | 4 cm | 6 cm | ... |
  | 2 | 6 cm | 9 cm | ... |
- **Kết luận:** Khi hai đường thẳng song song thì các đoạn chắn ....................................................

#### PHẦN III: VẬN DỤNG THỰC TẾ
Một cây cầu vượt bắc qua đường cần thiết kế trụ đỡ nghiêng. Hãy tính độ dài thanh chống phụ dựa vào các số đo trên sơ đồ: ....................................................

*Đánh giá của bạn cùng bàn:* [ ] Tốt  [ ] Khá  [ ] Cần cố gắng`;

    case 'image_prompt':
      return `Prompt tạo ảnh Midjourney / DALL-E / Imagen 3:
"A highly detailed, beautiful 3D educational illustration explaining '${lesson}' in ${subject}. Realistic school laboratory or architectural setting, warm cinematic lighting, mathematical equations and clean glowing geometric lines gently hovering in the air. High-definition 4K, isometric view, friendly educational art style, highly engaging for Vietnamese middle/high school students, zero text errors."`;

    case 'video_prompt':
      return `Kịch bản Video hoạt hình ngắn 60 giây (TikTok/YouTube Shorts):
- [00:00 - 00:08] HOOK: "Đố bạn biết làm sao đo được chiều cao của Tháp Eiffel mà không cần trèo lên đỉnh? Bí mật nằm ở bài học hôm nay: ${lesson}!"
- [00:08 - 00:25] NGUYÊN LÝ: Đồ họa 2D xuất hiện tia nắng và hình chiếu bóng của gậy gỗ và công trình. Công thức xuất hiện sinh động dạng pop-up.
- [00:25 - 00:45] VÍ DỤ NHANH: Giải một bài toán mẹo cực dễ nhớ trong 20 giây với mẹo tính nhẩm.
- [00:45 - 00:60] KẾT LUẬN & KÊU GỌI: Thách thức học sinh tính chiều cao cây bàng sân trường và để lại bình luận đáp án!`;

    case 'game_ideas':
      return `### Ý TƯỞNG TRÒ CHƠI HỌC TẬP TƯƠNG TÁC
**Tên trò chơi:** "ĐẤU TRƯỜNG TRI THỨC: GIẢI MÃ ${lesson.toUpperCase()}"
* **Hình thức:** Blooket (chế độ Gold Quest) hoặc Quizizz trực tiếp trên lớp.
* **Thời lượng:** 10 - 15 phút vào đầu hoặc cuối tiết dạy.
* **Luật chơi:**
  - Lớp chia làm 4 bang phái / 4 trạm thám hiểm.
  - Mỗi câu hỏi trả lời đúng về ${lesson} sẽ được nhận chìa khóa và lượt mở rương bí mật.
  - Có các thẻ bài đặc quyền: 'Nhân đôi điểm', 'Đổi vị trí câu hỏi', 'Cứu trợ từ giáo viên'.
* **Phần thưởng:** Điểm cộng thi đua tuần và sticker danh dự môn ${subject}.`;

    case 'webapp_prompt':
      return `Prompt tạo Web App tương tác (React / HTML Canvas):
"Xây dựng một web app đơn trang HTML5 Canvas + Tailwind CSS mô phỏng trực quan chuyên đề '${lesson}'. Cho phép học sinh kéo thả các thanh trượt (slider) để thay đổi tham số biến thiên, đồ thị hoặc hình học tự động co giãn theo thời gian thực. Có ô nhập dự đoán nghiệm và nút 'Kiểm tra kết quả' hiển thị hiệu ứng pháo hoa chúc mừng nếu làm đúng."`;

    default:
      return `Đã tạo nội dung sư phạm cho bài học: ${lesson} (${subject} - ${grade}). Nội dung chuẩn bị cho tiết dạy thành công.`;
  }
}
