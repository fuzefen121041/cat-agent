import { Mastra } from "@mastra/core";
import * as agents from "./agents/index.js";

/**
 * 初始化 Mastra 实例
 * 配置所有猫咪护理相关的 agents
 */
export const mastra = new Mastra({
  agents: {
    breedIdentification: agents.breedIdentificationAgent,
    healthConsultation: agents.healthConsultationAgent,
    nutritionAdvisor: agents.nutritionAdvisorAgent,
    behaviorAnalysis: agents.behaviorAnalysisAgent,
    catCareConsultation: agents.catCareConsultationAgent,
  },
});

export default mastra;
