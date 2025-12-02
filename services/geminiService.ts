import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlanFormData, GeneratedPlanResponse } from "../types";

// 初始化 Gemini 客户端
// 注意：API KEY 必须通过环境变量配置，不可在前端硬编码或询问用户
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const planSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overview: {
      type: Type.STRING,
      description: "对整个计划的简要概述和鼓励语，约50-100字。",
    },
    phases: {
      type: Type.ARRAY,
      description: "计划的不同阶段。",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "阶段标题，例如：'基础夯实期'。" },
          duration: { type: Type.STRING, description: "该阶段持续时间，例如：'第1周'。" },
          description: { type: Type.STRING, description: "该阶段的主要目标。" },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "具体任务名称。" },
                description: { type: Type.STRING, description: "任务的具体执行细节。" },
                tips: { type: Type.STRING, description: "完成该任务的小贴士或资源推荐。" },
              },
              required: ["title", "description", "tips"],
            },
          },
        },
        required: ["title", "duration", "description", "tasks"],
      },
    },
  },
  required: ["overview", "phases"],
};

export const generatePlan = async (data: PlanFormData): Promise<GeneratedPlanResponse> => {
  const intensityMap = {
    relaxed: "轻松，注重循序渐进",
    moderate: "适中，平衡生活与目标",
    intense: "高强度，全力以赴，速成",
  };

  const prompt = `
    请为我制定一个详细的学习或执行计划。
    
    目标：${data.goal}
    总时长：${data.duration}
    背景/当前情况：${data.context}
    期望强度：${intensityMap[data.intensity]}
    
    请将计划分解为清晰的阶段，每个阶段包含具体的、可执行的任务。
    任务应当具体且可衡量。请用中文回答。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: planSchema,
        // thinkingConfig not needed for this structured task, flash is sufficient
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("生成失败，未收到有效内容");
    }

    return JSON.parse(text) as GeneratedPlanResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};