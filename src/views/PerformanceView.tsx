import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PerformanceView: React.FC = () => {
  const { timetable, teachingPlan, khbdList, tasks, records, meetings } = useApp();

  // Metrics
  const totalWeeklyPeriods = timetable.length;
  const completedKHBD = khbdList.filter((k) => k.isPrepared).length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'hoan_thanh').length;
  const taskCompletionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 100;

  // Workload Distribution
  const workloadByClass = [
    { name: 'Toán 8A1', periods: 4, percent: 31, color: 'bg-indigo-600' },
    { name: 'Toán 8A2', periods: 4, percent: 31, color: 'bg-blue-600' },
    { name: 'Toán 9A1', periods: 4, percent: 31, color: 'bg-emerald-600' },
    { name: 'SHCN & Khác', periods: 1, percent: 7, color: 'bg-amber-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            Hiệu suất cá nhân & Báo cáo giảng dạy
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Tổng kết khối lượng giảng dạy tuần, tỉ lệ hoàn thành nhiệm vụ và chỉ số sẵn sàng sư phạm
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-emerald-600" />
            Chỉ số hoàn thành xuất sắc (94/100)
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider">Định mức tiết dạy</span>
            <Clock className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">{totalWeeklyPeriods} <span className="text-sm font-semibold text-slate-500">tiết / tuần</span></div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold">Đúng định mức chuẩn (19 tiết tối đa)</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider">Sẵn sàng KHBD 5512</span>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-600">100%</div>
          <div className="mt-1 text-xs text-slate-500">Tất cả bài học tuần 12 đã duyệt</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider">Tỉ lệ hoàn thành Deadline</span>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-3 text-3xl font-black text-blue-600">{taskCompletionRate}%</div>
          <div className="mt-1 text-xs text-blue-700 font-semibold">{completedTasks} / {totalTasks} nhiệm vụ hoàn thành</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider">Hồ sơ chuyên môn</span>
            <Award className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-3 text-3xl font-black text-amber-600">3 / 4</div>
          <div className="mt-1 text-xs text-amber-700 font-semibold">1 hồ sơ chờ kiểm tra</div>
        </div>
      </div>

      {/* 2 Columns: Workload Distribution + Pedagogical Suggestions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Workload */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Phân bổ khối lượng tiết dạy theo lớp
          </h3>

          <div className="space-y-4 pt-2">
            {workloadByClass.map((cls, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{cls.name}</span>
                  <span className="font-semibold text-slate-600">{cls.periods} tiết ({cls.percent}%)</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${cls.color}`}
                    style={{ width: `${cls.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-200">
            <strong>Nhận xét:</strong> Phân bổ tiết dạy đồng đều giữa các lớp Khối 8 và Khối 9, không bị dồn tiết quá 4 tiết trong một buổi sáng.
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Gợi ý tối ưu hóa hiệu suất từ Teacher Desk
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div className="rounded-xl bg-indigo-50/50 p-3 border border-indigo-100 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-indigo-950">Tái sử dụng học liệu cho 8A1 và 8A2:</strong>
                <p className="text-slate-600 mt-0.5">
                  Hai lớp có cùng bài dạy "Định lý Thalès", Thầy/Cô chỉ cần soạn 1 slide PowerPoint và nhân bản phiếu học tập để tiết kiệm 45 phút soạn bài.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-amber-50/50 p-3 border border-amber-100 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-amber-950">Bù 2 tiết cho lớp 8A2 trước ngày 25/09:</strong>
                <p className="text-slate-600 mt-0.5">
                  Lớp 8A2 đang chậm 2 tiết. Nên kết hợp lồng ghép câu hỏi luyện tập vào tiết đầu giờ Thứ Ba để bắt kịp tiến độ chung của khối.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50/50 p-3 border border-emerald-100 flex items-start gap-2.5">
              <Award className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-emerald-950">Ứng dụng EdTech được đánh giá cao:</strong>
                <p className="text-slate-600 mt-0.5">
                  Việc kết hợp mô hình GeoGebra và bài tập Quizizz đã giúp tăng tỉ lệ học sinh hào hứng học tập lên 92%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
