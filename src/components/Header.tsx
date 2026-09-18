import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Calendar,
  Sparkles,
  BookOpen,
  CheckSquare,
  FileSpreadsheet,
  Lightbulb,
  Clock,
  Menu,
  ChevronDown,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    tasks,
    records,
    teachingPlan,
    timetable,
    setIsSearchOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    setActiveTab,
    addTask,
    addKHBD,
    addIdea,
    addMaterial,
  } = useApp();

  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Today in Vietnamese
  const today = new Date();
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const formattedDate = `${dayNames[today.getDay()]}, ngày ${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

  // Urgent notifications count
  const overdueTasks = tasks.filter((t) => t.status === 'qua_han');
  const urgentTasks = tasks.filter((t) => t.status !== 'hoan_thanh' && t.priority === 'cao');
  const urgentRecords = records.filter((r) => r.status === 'sap_den_han' || r.status === 'qua_han');
  const delayedLessons = teachingPlan.filter((l) => l.status === 'cham_tien_do');

  const totalAlerts = overdueTasks.length + urgentTasks.length + urgentRecords.length + delayedLessons.length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile toggle + Search trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Thu gọn / Mở rộng menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-sm text-slate-500 hover:border-slate-300 hover:bg-white transition-all shadow-xs w-56 sm:w-80 group"
        >
          <Search className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span className="truncate">Tìm KHBD, học liệu, câu hỏi, ý tưởng...</span>
          <kbd className="ml-auto hidden rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600 font-mono sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Date + Quick Action + Notifications + Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Date pill */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg bg-indigo-50/70 border border-indigo-100/80 px-3 py-1.5 text-xs font-semibold text-indigo-900">
          <Calendar className="h-3.5 w-3.5 text-indigo-600" />
          <span>{formattedDate}</span>
        </div>

        {/* Quick Action Button */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Thao tác nhanh</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-80" />
          </button>

          {showQuickMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowQuickMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Tạo nhanh dữ liệu
                </div>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    setActiveTab('cong_viec');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <CheckSquare className="h-4 w-4 text-emerald-500" />
                  <span>+ Thêm công việc / việc cần làm</span>
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    setActiveTab('khbd');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  <span>+ Soạn KHBD / Giáo án mới</span>
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    setActiveTab('hoc_lieu');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <FileSpreadsheet className="h-4 w-4 text-amber-500" />
                  <span>+ Tải lên học liệu cá nhân</span>
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    setActiveTab('kho_y_tuong');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span>+ Lưu nhanh ý tưởng giảng dạy</span>
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    setActiveTab('ai_center');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg bg-indigo-50 px-2.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span>✨ Tạo bài giảng với EdTech AI</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Thông báo công việc & nhắc nhở"
          >
            <Bell className="h-5 w-5" />
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
                {totalAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">Nhắc việc & Cảnh báo</span>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                      {totalAlerts} việc
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 py-1">
                  {overdueTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => {
                        setActiveTab('cong_viec');
                        setShowNotifications(false);
                      }}
                      className="cursor-pointer p-2.5 hover:bg-rose-50/60 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> QUÁ HẠN ({task.deadline})
                        </span>
                        <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">
                          Ưu tiên cao
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-slate-800 line-clamp-1">{task.title}</p>
                    </div>
                  ))}

                  {delayedLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        setActiveTab('ke_hoach');
                        setShowNotifications(false);
                      }}
                      className="cursor-pointer p-2.5 hover:bg-amber-50/60 rounded-lg transition-colors"
                    >
                      <span className="text-xs font-bold text-amber-600">
                        CẢNH BÁO TIẾN ĐỘ CHƯƠNG TRÌNH
                      </span>
                      <p className="mt-1 text-xs font-medium text-slate-800">
                        Lớp {lesson.className} đang chậm tiến độ bài: {lesson.title}
                      </p>
                    </div>
                  ))}

                  {urgentRecords.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        setActiveTab('ho_so');
                        setShowNotifications(false);
                      }}
                      className="cursor-pointer p-2.5 hover:bg-indigo-50/60 rounded-lg transition-colors"
                    >
                      <span className="text-xs font-bold text-indigo-600">HỒ SƠ SẮP ĐẾN HẠN</span>
                      <p className="mt-1 text-xs font-medium text-slate-800 line-clamp-1">{rec.title}</p>
                    </div>
                  ))}

                  {totalAlerts === 0 && (
                    <div className="py-6 text-center text-xs text-slate-400">
                      Tuyệt vời! Không có công việc nào bị quá hạn hôm nay.
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-2 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('cong_viec');
                      setShowNotifications(false);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Xem tất cả công việc & deadline →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User avatar & name */}
        <div
          onClick={() => setActiveTab('cai_dat')}
          className="flex cursor-pointer items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-100 transition-colors"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 font-bold text-white shadow-xs text-xs">
            VA
          </div>
          <div className="hidden text-left md:block">
            <div className="text-xs font-bold text-slate-800 leading-tight">Thầy Văn An</div>
            <div className="text-[11px] text-slate-500">GV Toán - Khối 8, 9</div>
          </div>
        </div>
      </div>
    </header>
  );
};
