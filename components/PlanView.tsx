import React, { useState, useMemo } from 'react';
import { Plan, Phase, Task } from '../types';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, RefreshCcw, Trash2, Award, Info } from 'lucide-react';

interface PlanViewProps {
  plan: Plan;
  onUpdatePlan: (plan: Plan) => void;
  onReset: () => void;
}

const PlanView: React.FC<PlanViewProps> = ({ plan, onUpdatePlan, onReset }) => {
  // Toggle task completion
  const toggleTask = (phaseIndex: number, taskIndex: number) => {
    const newPhases = [...plan.phases];
    const task = newPhases[phaseIndex].tasks[taskIndex];
    task.isCompleted = !task.isCompleted;

    // Recalculate totals
    let completedCount = 0;
    let totalCount = 0;
    newPhases.forEach(p => {
      p.tasks.forEach(t => {
        totalCount++;
        if (t.isCompleted) completedCount++;
      });
    });

    onUpdatePlan({
      ...plan,
      phases: newPhases,
      completedTasks: completedCount,
      totalTasks: totalCount
    });
  };

  const progressPercentage = useMemo(() => {
    if (plan.totalTasks === 0) return 0;
    return Math.round((plan.completedTasks / plan.totalTasks) * 100);
  }, [plan.totalTasks, plan.completedTasks]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
      
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{plan.goal}</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
               创建于: {new Date(plan.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if(confirm('确定要删除当前计划并重新开始吗？')) onReset();
              }}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span className="text-slate-600">总体进度</span>
            <span className="text-indigo-600">{progressPercentage}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* AI Overview */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-indigo-900 text-sm leading-relaxed">
           <div className="flex items-center gap-2 font-semibold mb-1 text-indigo-700">
             <Award className="w-4 h-4" />
             AI 建议
           </div>
           {plan.overview}
        </div>
      </div>

      {/* Phases List */}
      <div className="space-y-4">
        {plan.phases.map((phase, pIndex) => (
          <PhaseCard 
            key={phase.id} 
            phase={phase} 
            pIndex={pIndex} 
            onToggleTask={toggleTask}
          />
        ))}
      </div>
    </div>
  );
};

// Sub-component for Phase to handle its own open/close state if needed
// Or simply render always open. Let's make it collapsible but open by default.
const PhaseCard: React.FC<{
  phase: Phase;
  pIndex: number;
  onToggleTask: (pIdx: number, tIdx: number) => void;
}> = ({ phase, pIndex, onToggleTask }) => {
  const [isOpen, setIsOpen] = useState(true);

  const completedInPhase = phase.tasks.filter(t => t.isCompleted).length;
  const totalInPhase = phase.tasks.length;
  const isPhaseComplete = totalInPhase > 0 && completedInPhase === totalInPhase;

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 ${isPhaseComplete ? 'border-green-200 bg-green-50/30' : 'border-slate-200'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            isPhaseComplete ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {pIndex + 1}
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isPhaseComplete ? 'text-green-800' : 'text-slate-800'}`}>
              {phase.title}
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              {phase.duration} • {phase.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">
            {completedInPhase} / {totalInPhase}
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-3 border-t border-slate-100/50 pt-4">
          {phase.tasks.map((task, tIndex) => (
            <div 
              key={task.id} 
              className={`group flex items-start gap-3 p-3 rounded-lg transition-all ${
                task.isCompleted ? 'bg-slate-50/50' : 'hover:bg-slate-50'
              }`}
            >
              <button
                onClick={() => onToggleTask(pIndex, tIndex)}
                className="mt-0.5 flex-shrink-0 focus:outline-none"
              >
                {task.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                )}
              </button>
              
              <div className="flex-1 space-y-1">
                <p className={`text-base font-medium transition-all ${
                  task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'
                }`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className={`text-sm ${task.isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                    {task.description}
                  </p>
                )}
                {task.tips && !task.isCompleted && (
                   <div className="flex items-start gap-1.5 mt-2 text-xs text-indigo-600 bg-indigo-50 p-2 rounded w-fit">
                     <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                     <span>{task.tips}</span>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanView;