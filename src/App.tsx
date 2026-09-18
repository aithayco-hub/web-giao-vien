import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

// Views
import { DashboardView } from './views/DashboardView';
import { TeachingPlanView } from './views/TeachingPlanView';
import { TimetableSmartView } from './views/TimetableSmartView';
import { TeachingReportView } from './views/TeachingReportView';
import { KHBDView } from './views/KHBDView';
import { MaterialsView } from './views/MaterialsView';
import { AICenterView } from './views/AICenterView';
import { QuestionBankView } from './views/QuestionBankView';
import { ExamGeneratorView } from './views/ExamGeneratorView';
import { RecordsView } from './views/RecordsView';
import { TasksView } from './views/TasksView';
import { MeetingsView } from './views/MeetingsView';
import { IdeasView } from './views/IdeasView';
import { AIStudioView } from './views/AIStudioView';
import { PerformanceView } from './views/PerformanceView';
import { SettingsView } from './views/SettingsView';

import {
  Sparkles,
  Plus,
  X,
  FileText,
  Calendar,
  CheckSquare,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, toasts, removeToast } = useApp();
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'ke_hoach':
        return <TeachingPlanView />;
      case 'thoi_khoa_bieu':
        return <TimetableSmartView />;
      case 'bao_giang':
        return <TeachingReportView />;
      case 'khbd':
        return <KHBDView />;
      case 'hoc_lieu':
        return <MaterialsView />;
      case 'ai_center':
        return <AICenterView />;
      case 'ngan_hang_cau_hoi':
        return <QuestionBankView />;
      case 'tao_de':
        return <ExamGeneratorView />;
      case 'ho_so':
        return <RecordsView />;
      case 'cong_viec':
        return <TasksView />;
      case 'hop_chuyen_mon':
        return <MeetingsView />;
      case 'kho_y_tuong':
        return <IdeasView />;
      case 'studio_ai':
        return <AIStudioView />;
      case 'hieu_suat':
        return <PerformanceView />;
      case 'cai_dat':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Sticky Top Header */}
        <Header />

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 ${
              toast.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-700'
                : toast.type === 'warning'
                ? 'bg-amber-900/95 text-white border-amber-700'
                : 'bg-slate-900/95 text-white border-slate-700'
            }`}
          >
            <div className="space-y-1 pr-2">
              <div className="text-xs font-bold">{toast.title}</div>
              {toast.description && <div className="text-[11px] text-slate-300">{toast.description}</div>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-lg p-1 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Floating Speed Dial - Quick Actions for Teachers */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        {isQuickActionOpen && (
          <div className="mb-3 flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-3">
            <button
              onClick={() => {
                setActiveTab('ai_center');
                setIsQuickActionOpen(false);
              }}
              className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-lg border border-slate-200 hover:bg-slate-50 transition-all group"
            >
              <span>AI Trợ lý Sư phạm</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Sparkles className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('khbd');
                setIsQuickActionOpen(false);
              }}
              className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-lg border border-slate-200 hover:bg-slate-50 transition-all group"
            >
              <span>Soạn KHBD / Giáo án 5512</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('cong_viec');
                setIsQuickActionOpen(false);
              }}
              className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-lg border border-slate-200 hover:bg-slate-50 transition-all group"
            >
              <span>Thêm việc cần làm</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <CheckSquare className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('kho_y_tuong');
                setIsQuickActionOpen(false);
              }}
              className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-lg border border-slate-200 hover:bg-slate-50 transition-all group"
            >
              <span>Ghi nhanh ý tưởng</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Lightbulb className="h-4 w-4" />
              </div>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
          className={`flex h-13 w-13 items-center justify-center rounded-2xl shadow-xl transition-all ${
            isQuickActionOpen
              ? 'bg-slate-800 text-white rotate-45'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 shadow-indigo-600/30'
          }`}
          title="Thao tác nhanh cho giáo viên"
        >
          <Plus className="h-6 w-6 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
