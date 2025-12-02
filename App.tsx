import React, { useState, useEffect } from 'react';
import { generatePlan } from './services/geminiService';
import PlanForm from './components/PlanForm';
import PlanView from './components/PlanView';
import { Plan, PlanFormData, GeneratedPlanResponse, Phase } from './types';
import { Layout } from 'lucide-react';

const STORAGE_KEY = 'zhice_user_plan_v1';

const App: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load plan from local storage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem(STORAGE_KEY);
    if (savedPlan) {
      try {
        setCurrentPlan(JSON.parse(savedPlan));
      } catch (e) {
        console.error("Failed to parse saved plan", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save plan to local storage whenever it changes
  useEffect(() => {
    if (currentPlan) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPlan));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentPlan]);

  const handleCreatePlan = async (formData: PlanFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const aiResponse: GeneratedPlanResponse = await generatePlan(formData);
      
      // Transform AI response to App State format
      const newPlan: Plan = {
        id: crypto.randomUUID(),
        goal: formData.goal,
        createdAt: Date.now(),
        overview: aiResponse.overview,
        phases: aiResponse.phases.map((p, i) => ({
          id: `phase-${i}`,
          title: p.title,
          duration: p.duration,
          description: p.description,
          tasks: p.tasks.map((t, j) => ({
            id: `task-${i}-${j}`,
            title: t.title,
            description: t.description,
            tips: t.tips,
            isCompleted: false
          }))
        })),
        totalTasks: aiResponse.phases.reduce((acc, p) => acc + p.tasks.length, 0),
        completedTasks: 0
      };

      setCurrentPlan(newPlan);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "生成计划时遇到了一些问题，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePlan = (updatedPlan: Plan) => {
    setCurrentPlan(updatedPlan);
  };

  const handleReset = () => {
    setCurrentPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Layout className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">智策</span>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full hidden sm:inline-block">AI Plan Generator</span>
          </div>
          <div className="text-sm text-slate-500">
             {currentPlan ? '进行中' : '新计划'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {error && (
           <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2" role="alert">
             <span className="font-bold">Error:</span> {error}
           </div>
        )}

        {!currentPlan ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
             <div className="text-center mb-8 max-w-lg">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">把目标转化为行动</h1>
                <p className="text-lg text-slate-600">
                  无论你想学习新技能、健身还是完成项目，智策都能利用 Gemini AI 为你生成科学的阶段性计划。
                </p>
             </div>
             <PlanForm onSubmit={handleCreatePlan} isLoading={isLoading} />
             
             {/* Local usage hint */}
             <p className="mt-8 text-xs text-slate-400 text-center max-w-sm">
               数据仅保存在您的本地浏览器中。请确保已在环境变量中配置 <code className="bg-slate-100 px-1 rounded">API_KEY</code> 以使用 Gemini 服务。
             </p>
          </div>
        ) : (
          <PlanView 
            plan={currentPlan} 
            onUpdatePlan={handleUpdatePlan} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
};

export default App;