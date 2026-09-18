import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  FolderArchive,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  Users,
  FileText,
  PlayCircle,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TimetableSlot, TeachingPlanLesson, TaskItem } from '../types';

export const DashboardView: React.FC = () => {
  const {
    timetable,
    teachingPlan,
    khbdList,
    materials,
    tasks,
    meetings,
    records,
    classes,
    setActiveTab,
    toggleTaskChecklist,
    updateTask,
  } = useApp();

  // Next Lesson Identification (Smart identification)
  // For demo realism: identify the next upcoming lesson in timetable (default to tt-2: 8A1 Tiết 2)
  const nextLessonSlot = timetable.find((s) => s.id === 'tt-2') || timetable[0];
  const nextKHBD = khbdList.find((k) => k.id === nextLessonSlot?.khbdId);
  const nextMaterials = materials.filter((m) => nextLessonSlot?.materialsIds?.includes(m.id));

  // Timeline for Today's schedule (e.g. Day 2 - Thứ Hai)
  const todaySlots = timetable.filter((s) => s.dayOfWeek === 2).sort((a, b) => a.period - b.period);

  // KPI Calculations
  const totalWeeklyLessons = timetable.length; // e.g. 13
  const todayLessonsCount = todaySlots.length; // e.g. 3
  const preparedKHBDCount = khbdList.filter((k) => k.isPrepared).length;
  const missingMaterialsCount = teachingPlan.filter((p) => !p.materialsIds || p.materialsIds.length === 0).length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'hoan_thanh').length;
  const urgentDeadlinesCount = tasks.filter(
    (t) => t.status === 'qua_han' || (t.status !== 'hoan_thanh' && t.priority === 'cao')
  ).length;

  // Program Progress
  const classProgress = [
    { className: 'Toán 8A1', percent: 72, delayedPeriods: 0, status: 'Đúng kế hoạch' },
    { className: 'Toán 8A2', percent: 68, delayedPeriods: 2, status: 'Chậm 2 tiết' },
    { className: 'Toán 9A1', percent: 75, delayedPeriods: 0, status: 'Đúng kế hoạch' },
  ];
  const avgProgress = Math.round(
    classProgress.reduce((acc, curr) => acc + curr.percent, 0) / classProgress.length
  );

  // Filter Tasks by urgency
  const overdueTasks = tasks.filter((t) => t.status === 'qua_han');
  const todayTasks = tasks.filter((t) => t.deadline === '2026-09-18' && t.status !== 'hoan_thanh');
  const upcomingTasks = tasks.filter(
    (t) => t.status !== 'hoan_thanh' && t.status !== 'qua_han' && t.deadline !== '2026-09-18'
  );

  // Selected lesson detail modal in Dashboard
  const [selectedSlotModal, setSelectedSlotModal] = useState<TimetableSlot | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Bar */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight">Chào buổi sáng, Thầy/Cô 👋</span>
            <span className="rounded-full bg-indigo-500/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/40">
              Học kỳ 1 • Tuần 12
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Hôm nay Thầy/Cô có <strong className="text-white font-semibold">{todayLessonsCount} tiết dạy</strong>,{' '}
            <strong className="text-amber-300 font-semibold">{pendingTasksCount} công việc cần làm</strong> và{' '}
            <strong className="text-rose-300 font-semibold">{urgentDeadlinesCount} việc sắp đến hạn</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
          <button
            onClick={() => setActiveTab('ai_center')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-indigo-600 hover:to-blue-700 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Mở EdTech AI</span>
          </button>
          <button
            onClick={() => setActiveTab('bao_giang')}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all border border-white/15 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>Báo giảng tuần</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <div
          onClick={() => setActiveTab('thoi_khoa_bieu')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tiết tuần</span>
            <Clock className="h-4 w-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{totalWeeklyLessons}</span>
            <span className="text-xs text-slate-500">tiết</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">Theo TKB tuần 12</div>
        </div>

        <div
          onClick={() => setActiveTab('thoi_khoa_bieu')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tiết hôm nay</span>
            <Calendar className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{todayLessonsCount}</span>
            <span className="text-xs text-slate-500">tiết</span>
          </div>
          <div className="mt-1 text-[11px] text-blue-600 font-medium">Buổi sáng (P.203, P.204)</div>
        </div>

        <div
          onClick={() => setActiveTab('khbd')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">KHBD đã soạn</span>
            <BookOpen className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-emerald-600">{preparedKHBDCount}</span>
            <span className="text-xs text-slate-500">/ 5 bài</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">100% tuần này</div>
        </div>

        <div
          onClick={() => setActiveTab('hoc_lieu')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tài liệu cần</span>
            <FolderArchive className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-amber-600">{missingMaterialsCount}</span>
            <span className="text-xs text-slate-500">chưa gắn</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-600 font-medium">Cần bổ sung slide</div>
        </div>

        <div
          onClick={() => setActiveTab('cong_viec')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Việc chưa xong</span>
            <CheckSquare className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-purple-600">{pendingTasksCount}</span>
            <span className="text-xs text-slate-500">nhiệm vụ</span>
          </div>
          <div className="mt-1 text-[11px] text-purple-600 font-medium">3 việc ưu tiên</div>
        </div>

        <div
          onClick={() => setActiveTab('cong_viec')}
          className="cursor-pointer rounded-xl border border-rose-200 bg-rose-50/40 p-3.5 shadow-xs hover:border-rose-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Deadline</span>
            <AlertTriangle className="h-4 w-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-rose-600">{urgentDeadlinesCount}</span>
            <span className="text-xs text-rose-600">việc gấp</span>
          </div>
          <div className="mt-1 text-[11px] text-rose-700 font-bold">1 việc quá hạn!</div>
        </div>

        <div
          onClick={() => setActiveTab('ke_hoach')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tiến độ CT</span>
            <TrendingUp className="h-4 w-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-indigo-600">{avgProgress}%</span>
            <span className="text-xs text-slate-500">trung bình</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-600 font-medium">8A2 chậm 2 tiết</div>
        </div>
      </div>

      {/* HIGHLIGHT CARD: TIẾT TIẾP THEO (Very Prominent) */}
      {nextLessonSlot && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-500 bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/70 p-5 sm:p-6 shadow-lg shadow-indigo-500/5">
          {/* Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
              </span>
              <span className="text-xs font-extrabold tracking-wider text-indigo-900 uppercase">
                TIẾT TIẾP THEO TRONG NGÀY
              </span>
              <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
                Tiết {nextLessonSlot.period} ({nextLessonSlot.timeRange})
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">Phòng học:</span>
              <span className="rounded bg-white px-2 py-0.5 font-bold text-indigo-700 border border-slate-200 shadow-2xs">
                {nextLessonSlot.room}
              </span>
            </div>
          </div>

          {/* Lesson Main Content */}
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-indigo-600/10 px-2.5 py-1 text-xs font-extrabold text-indigo-700">
                  Lớp {nextLessonSlot.className}
                </span>
                <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
                  {nextLessonSlot.subject}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Tiết PPCT: #{nextLessonSlot.ppctPeriod}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {nextLessonSlot.lessonTitle}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                {nextLessonSlot.notes ||
                  'Nắm vững tỉ số hai đoạn thẳng, định lý Thalès thuận. Chuẩn bị hoạt động khởi động với bóng nắng Kim Tự Tháp và mô hình GeoGebra tương tác.'}
              </p>
            </div>

            {/* Status & Attached Resources */}
            <div className="flex flex-col justify-between rounded-xl bg-white/80 p-3.5 border border-indigo-100 shadow-2xs space-y-2">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Trạng thái chuẩn bị
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-700">KHBD đã hoàn thành</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Tài liệu đính kèm: <strong>{nextMaterials.length || 2} học liệu</strong> (PowerPoint, GeoGebra)
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedSlotModal(nextLessonSlot)}
                  className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-center text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  Xem bài dạy
                </button>
                <button
                  onClick={() => setActiveTab('khbd')}
                  className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
                >
                  Mở KHBD
                </button>
                <button
                  onClick={() => setActiveTab('hoc_lieu')}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Mở học liệu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Timeline Today + Program Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* TIMELINE HÔM NAY */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Tiết dạy hôm nay (Thứ Hai)</h3>
              </div>
              <button
                onClick={() => setActiveTab('thoi_khoa_bieu')}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <span>Xem TKB cả tuần</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {todaySlots.map((slot, idx) => {
                const isNext = slot.id === nextLessonSlot?.id;
                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlotModal(slot)}
                    className={`flex cursor-pointer items-start gap-3.5 py-3.5 px-3 rounded-xl transition-all ${
                      isNext
                        ? 'bg-indigo-50/70 border border-indigo-200 shadow-2xs'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Time pill */}
                    <div className="flex flex-col items-center shrink-0 w-20 text-center">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                        Tiết {slot.period}
                      </span>
                      <span className="mt-1 text-[11px] font-semibold text-slate-500">
                        {slot.timeRange.split(' - ')[0]}
                      </span>
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{slot.className}</span>
                        <span className="rounded bg-indigo-50 px-2 py-0.2 text-[11px] font-semibold text-indigo-700">
                          {slot.subject}
                        </span>
                        <span className="text-xs text-slate-500">Phòng {slot.room}</span>
                        {isNext && (
                          <span className="ml-auto rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            TIẾP THEO
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs font-medium text-slate-700 truncate">
                        {slot.lessonTitle}
                      </p>
                    </div>

                    <div className="shrink-0 text-slate-400">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TIẾN ĐỘ CHƯƠNG TRÌNH */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Tiến độ chương trình giảng dạy</h3>
              </div>
              <button
                onClick={() => setActiveTab('ke_hoach')}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <span>Chi tiết PPCT</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {classProgress.map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{item.className}</span>
                      {item.delayedPeriods > 0 ? (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 font-bold text-rose-700 text-[10px] flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Chậm {item.delayedPeriods} tiết
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700 text-[10px]">
                          Đúng kế hoạch
                        </span>
                      )}
                    </div>
                    <span className="font-extrabold text-slate-900">{item.percent}%</span>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.delayedPeriods > 0 ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-xs text-amber-900">
                <strong>Gợi ý từ Teacher Desk:</strong> Lớp 8A2 đang chậm 2 tiết do nghỉ lễ. Thầy/Cô có thể sắp xếp dạy bù vào tiết 4 Thứ Tư tuần này hoặc lồng ghép ôn tập nhanh trong buổi sinh hoạt.
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Việc cần làm (Urgent To-Do) + Lịch họp & Hồ sơ */}
        <div className="space-y-6">
          {/* VIỆC CẦN LÀM (Overdue / Today / Upcoming) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Việc cần làm & Deadline</h3>
              </div>
              <button
                onClick={() => setActiveTab('cong_viec')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Tất cả ({tasks.length})
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {/* Overdue */}
              {overdueTasks.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Quá hạn ({overdueTasks.length})
                  </div>
                  {overdueTasks.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-xl border border-rose-200 bg-rose-50/50 p-2.5 mb-2 hover:bg-rose-50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={t.status === 'hoan_thanh'}
                          onChange={() =>
                            updateTask(t.id, {
                              status: t.status === 'hoan_thanh' ? 'dang_lam' : 'hoan_thanh',
                            })
                          }
                          className="mt-0.5 h-4 w-4 rounded text-indigo-600 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 line-clamp-1">{t.title}</div>
                          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-rose-700 font-semibold">
                            <span>Hạn: {t.deadline}</span>
                            <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[10px]">Cần xử lý ngay</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upcoming */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Sắp đến hạn ({upcomingTasks.length})
                </div>
                {upcomingTasks.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 mb-2 hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={t.status === 'hoan_thanh'}
                        onChange={() =>
                          updateTask(t.id, {
                            status: t.status === 'hoan_thanh' ? 'dang_lam' : 'hoan_thanh',
                          })
                        }
                        className="mt-0.5 h-4 w-4 rounded text-indigo-600 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-800 line-clamp-1">{t.title}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                          <span>Hạn: {t.deadline}</span>
                          <span
                            className={`px-1.5 py-0.2 text-[10px] rounded font-bold ${
                              t.priority === 'cao'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {t.priority === 'cao' ? 'Ưu tiên cao' : 'Bình thường'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LỊCH HỌP & HỒ SƠ SẮP TỚI */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Lịch họp & Chuyên môn</h3>
              </div>
              <button
                onClick={() => setActiveTab('hop_chuyen_mon')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Xem tất cả
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {meetings.slice(0, 2).map((m) => (
                <div
                  key={m.id}
                  onClick={() => setActiveTab('hop_chuyen_mon')}
                  className="cursor-pointer rounded-xl border border-slate-100 bg-indigo-50/30 p-3 hover:bg-indigo-50/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                      {m.type === 'hop_to' ? 'Họp tổ bộ môn' : 'Hội đồng sư phạm'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">{m.dateTime}</span>
                  </div>
                  <div className="mt-1.5 text-xs font-bold text-slate-900 line-clamp-1">{m.title}</div>
                  <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
                    <span>Phòng: {m.location}</span> • <span>{m.myActionItems.length} đầu việc của tôi</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Details Modal */}
      {selectedSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                  Lớp {selectedSlotModal.className} • Tiết {selectedSlotModal.period}
                </span>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {selectedSlotModal.lessonTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlotModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3">
                <div>
                  <span className="font-semibold text-slate-500">Môn học:</span>{' '}
                  <strong className="text-slate-800">{selectedSlotModal.subject}</strong>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Phòng học:</span>{' '}
                  <strong className="text-slate-800">{selectedSlotModal.room}</strong>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Thời gian:</span>{' '}
                  <strong className="text-slate-800">{selectedSlotModal.timeRange}</strong>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Tiết PPCT:</span>{' '}
                  <strong className="text-slate-800">#{selectedSlotModal.ppctPeriod}</strong>
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-800 text-xs mb-1">Ghi chú & Dặn dò:</div>
                <p className="rounded-lg border border-slate-200 p-2.5 text-slate-700">
                  {selectedSlotModal.notes || 'Chưa có ghi chú đặc biệt.'}
                </p>
              </div>

              <div>
                <div className="font-bold text-slate-800 text-xs mb-1">Học liệu đã liên kết:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs text-indigo-700 font-medium flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> Slide bài giảng Thalès (PowerPoint)
                  </span>
                  <span className="rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs text-blue-700 font-medium flex items-center gap-1">
                    <ExternalLink className="h-3.5 w-3.5" /> Mô hình tương tác GeoGebra
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  setSelectedSlotModal(null);
                  setActiveTab('khbd');
                }}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Mở KHBD đầy đủ
              </button>
              <button
                onClick={() => setSelectedSlotModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
