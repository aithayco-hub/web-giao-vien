import React, { useState } from 'react';
import {
  Settings,
  User,
  School,
  BookOpen,
  Calendar,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { teacherProfile, updateProfile, resetAllData, addToast } = useApp();

  const [formData, setFormData] = useState({
    name: teacherProfile.name,
    school: teacherProfile.school,
    subjects: teacherProfile.subjects.join(', '),
    grades: teacherProfile.grades.join(', '),
    classes: teacherProfile.classes.join(', '),
    homeroomClass: teacherProfile.homeroomClass,
    academicYear: teacherProfile.academicYear,
    semester: teacherProfile.semester,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      school: formData.school,
      subjects: formData.subjects.split(',').map((s) => s.trim()).filter(Boolean),
      grades: formData.grades.split(',').map((s) => s.trim()).filter(Boolean),
      classes: formData.classes.split(',').map((s) => s.trim()).filter(Boolean),
      homeroomClass: formData.homeroomClass,
      academicYear: formData.academicYear,
      semester: formData.semester,
    });
    addToast('Đã lưu thông tin hồ sơ giáo viên', 'Dữ liệu được lưu trữ an toàn trong trình duyệt');
  };

  const handleExportData = () => {
    const backup = {
      profile: teacherProfile,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TeacherDesk_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast('Đã xuất file sao lưu thành công', 'File TeacherDesk_Backup.json đã được tải về máy');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile) {
            updateProfile(parsed.profile);
            setFormData({
              name: parsed.profile.name,
              school: parsed.profile.school,
              subjects: parsed.profile.subjects.join(', '),
              grades: parsed.profile.grades.join(', '),
              classes: parsed.profile.classes.join(', '),
              homeroomClass: parsed.profile.homeroomClass,
              academicYear: parsed.profile.academicYear,
              semester: parsed.profile.semester,
            });
            addToast('Khôi phục dữ liệu thành công', 'Đã cập nhật hồ sơ từ file sao lưu');
          }
        } catch (err) {
          alert('File sao lưu không hợp lệ!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-indigo-600" />
          Cài đặt & Cá nhân hóa trợ lý
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Cấu hình thông tin trường, môn học, lớp phụ trách và quản lý sao lưu dữ liệu cá nhân
        </p>
      </div>

      {/* Profile Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-600" />
          Thông tin giảng dạy của giáo viên
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Họ và tên giáo viên *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Đơn vị công tác (Trường) *</label>
              <input
                type="text"
                required
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Môn học giảng dạy</label>
              <input
                type="text"
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                placeholder="Toán học, KHTN..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Lớp chủ nhiệm (nếu có)</label>
              <input
                type="text"
                value={formData.homeroomClass}
                onChange={(e) => setFormData({ ...formData, homeroomClass: e.target.value })}
                placeholder="Ví dụ: 8A1 (hoặc để trống)"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Các lớp phụ trách bộ môn</label>
              <input
                type="text"
                value={formData.classes}
                onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
                placeholder="8A1, 8A2, 9A1..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Năm học & Học kỳ</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value as any })}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                >
                  <option value="Học kỳ 1">Học kỳ 1</option>
                  <option value="Học kỳ 2">Học kỳ 2</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
            >
              <Save className="h-4 w-4" />
              <span>Lưu thông tin</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backup and Restore Data */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-600" />
          An toàn & Sao lưu dữ liệu (Offline First)
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          Tất cả dữ liệu kế hoạch dạy học, thời khóa biểu, giáo án KHBD và công việc đều được lưu trữ trực tiếp trên trình duyệt của Thầy/Cô (LocalStorage). Dữ liệu hoàn toàn bảo mật và không gửi lên máy chủ bên ngoài.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 pt-2">
          <button
            onClick={handleExportData}
            className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
          >
            <Download className="h-5 w-5 text-indigo-600 mb-2" />
            <span className="text-xs font-bold text-slate-800">Xuất file sao lưu (JSON)</span>
            <span className="text-[10px] text-slate-500 mt-1">Tải về máy để lưu trữ hoặc chuyển sang máy tính khác</span>
          </button>

          <label className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer">
            <Upload className="h-5 w-5 text-emerald-600 mb-2" />
            <span className="text-xs font-bold text-slate-800">Khôi phục từ file (JSON)</span>
            <span className="text-[10px] text-slate-500 mt-1">Chọn file sao lưu đã lưu trước đó</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm('Thầy/Cô có chắc chắn muốn khôi phục lại dữ liệu mẫu mặc định ban đầu không?')) {
                resetAllData();
              }
            }}
            className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-center hover:bg-rose-100/70 transition-all cursor-pointer"
          >
            <RotateCcw className="h-5 w-5 text-rose-600 mb-2" />
            <span className="text-xs font-bold text-rose-800">Đặt lại dữ liệu mẫu</span>
            <span className="text-[10px] text-rose-600 mt-1">Khôi phục toàn bộ bài mẫu môn Toán THCS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
