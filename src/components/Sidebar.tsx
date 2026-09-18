import React from 'react';
import {
  LayoutDashboard,
  CalendarRange,
  CalendarDays,
  ClipboardCheck,
  BookOpenCheck,
  FolderArchive,
  Bot,
  HelpCircle,
  FileSpreadsheet,
  Files,
  CheckSquare,
  Users,
  Lightbulb,
  Wand2,
  Settings,
  GraduationCap,
  Sparkles,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    tasks,
    teachingPlan,
  } = useApp();

  // Pending tasks count
  const pendingTasksCount = tasks.filter((t) => t.status !== 'hoan_thanh').length;
  // Delayed lessons count
  const delayedCount = teachingPlan.filter((l) => l.status === 'cham_tien_do').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'ke_hoach', label: 'Kế hoạch giảng dạy', icon: CalendarRange, badge: delayedCount > 0 ? `${delayedCount} chậm` : undefined },
    { id: 'thoi_khoa_bieu', label: 'Thời khóa biểu', icon: CalendarDays },
    { id: 'bao_giang', label: 'Báo giảng điện tử', icon: ClipboardCheck },
    { id: 'khbd', label: 'Kho KHBD – Giáo án', icon: BookOpenCheck },
    { id: 'hoc_lieu', label: 'Kho học liệu', icon: FolderArchive },
    { id: 'ai_center', label: 'Trung tâm AI', icon: Bot, highlight: true, badge: 'AI' },
    { id: 'ngan_hang_cau_hoi', label: 'Ngân hàng câu hỏi', icon: HelpCircle },
    { id: 'tao_de', label: 'Tạo đề & Phiếu học tập', icon: FileSpreadsheet },
    { id: 'ho_so', label: 'Hồ sơ – Sổ sách', icon: Files },
    { id: 'cong_viec', label: 'Công việc & Deadline', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: 'hop_chuyen_mon', label: 'Họp & Chuyên môn', icon: Users },
    { id: 'kho_y_tuong', label: 'Kho ý tưởng', icon: Lightbulb },
    { id: 'studio_ai', label: 'Studio học liệu AI', icon: Wand2, highlight: true },
    { id: 'hieu_suat', label: 'Hiệu suất cá nhân', icon: BarChart3 },
    { id: 'cai_dat', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out md:static ${
        sidebarCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex cursor-pointer items-center gap-3 overflow-hidden"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-white font-mono">
                TEACHER DESK
              </span>
              <span className="text-[10px] font-semibold text-indigo-400 tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" /> Trợ lý giáo viên
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          title={sidebarCollapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        <div className={`px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider ${sidebarCollapsed ? 'hidden' : 'block'}`}>
          Menu chức năng
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : item.highlight
                  ? 'text-indigo-300 hover:bg-indigo-950/40 hover:text-indigo-200'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'
                }`}
              />

              {!sidebarCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!sidebarCollapsed && item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.highlight
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Collapsed dot indicator */}
              {sidebarCollapsed && item.badge && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Profile / Quick Status */}
      <div className="border-t border-slate-800 p-3 bg-slate-950/60">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between rounded-xl bg-slate-800/60 p-2.5">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-700/80 flex items-center justify-center font-bold text-xs text-white">
                TH
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">Học kỳ 1 • 2024-2025</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Đang dạy tuần 12
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-2 w-2 rounded-full bg-emerald-400" title="Tuần 12" />
          </div>
        )}
      </div>
    </aside>
  );
};
