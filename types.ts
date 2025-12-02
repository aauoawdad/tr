// 计划任务
export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  tips?: string;
}

// 计划阶段
export interface Phase {
  id: string;
  title: string;
  duration: string; // e.g., "第1-2周"
  description: string;
  tasks: Task[];
}

// 完整计划
export interface Plan {
  id: string;
  goal: string;
  createdAt: number;
  overview: string;
  phases: Phase[];
  totalTasks: number;
  completedTasks: number;
}

// 用户输入表单数据
export interface PlanFormData {
  goal: string;
  duration: string;
  context: string;
  intensity: 'relaxed' | 'moderate' | 'intense';
}

// API 响应结构 (Gemini JSON Schema)
export interface GeneratedPlanResponse {
  overview: string;
  phases: {
    title: string;
    duration: string;
    description: string;
    tasks: {
      title: string;
      description: string;
      tips: string;
    }[];
  }[];
}