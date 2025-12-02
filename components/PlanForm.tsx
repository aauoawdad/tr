import React, { useState } from 'react';
import { PlanFormData } from '../types';
import { Loader2, Sparkles, Target, Clock, User, Gauge } from 'lucide-react';

interface PlanFormProps {
  onSubmit: (data: PlanFormData) => void;
  isLoading: boolean;
}

const PlanForm: React.FC<PlanFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PlanFormData>({
    goal: '',
    duration: '',
    context: '',
    intensity: 'moderate',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.goal.trim() && formData.duration.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8" />
          开始制定计划
        </h2>
        <p className="opacity-90">告诉 AI 你的目标，为你量身打造执行方案。</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Goal Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Target className="w-4 h-4 text-indigo-500" />
            你的目标是什么？
          </label>
          <input
            type="text"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            placeholder="例如：三个月内学会 Python 数据分析"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-slate-800 placeholder:text-slate-400"
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duration Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Clock className="w-4 h-4 text-indigo-500" />
              计划持续时间
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="例如：12周、30天"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-slate-800"
              required
              disabled={isLoading}
            />
          </div>

          {/* Intensity Select */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Gauge className="w-4 h-4 text-indigo-500" />
              期望强度
            </label>
            <div className="relative">
              <select
                name="intensity"
                value={formData.intensity}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-slate-800 appearance-none bg-white"
                disabled={isLoading}
              >
                <option value="relaxed">轻松 (循序渐进)</option>
                <option value="moderate">适中 (平衡生活)</option>
                <option value="intense">高强度 (冲刺速成)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Context Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <User className="w-4 h-4 text-indigo-500" />
            当前背景/备注 (可选)
          </label>
          <textarea
            name="context"
            value={formData.context}
            onChange={handleChange}
            placeholder="例如：我有一定的编程基础，每天能抽出2小时..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-slate-800 resize-none"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
            isLoading 
              ? 'bg-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              正在思考并制定计划...
            </div>
          ) : (
            '生成计划'
          )}
        </button>
      </form>
    </div>
  );
};

export default PlanForm;