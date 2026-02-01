
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, AnalysisResult, BPStatus, HRStatus } from "../types";

export const analyzeHealthData = async (input: UserInput): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Act as a professional medical health analyst. Analyze the following user health data:
    - User Age: ${input.age}
    - Gender: ${input.gender}
    - Systolic BP: ${input.systolic} mmHg
    - Diastolic BP: ${input.diastolic} mmHg
    - Heart Rate: ${input.heartRate} BPM
    
    INSTRUCTIONS:
    1. Classify Blood Pressure based on standard medical ranges (AHA/ACC):
       - Normal: <120 / <80
       - Elevated: 120-129 / <80
       - Stage 1: 130-139 / 80-89
       - Stage 2: >=140 / >=90
       - Crisis: >180 / >120
    2. Classify Heart Rate considering age and gender:
       - Standard resting is 60-100 BPM. 
       - Adjust for age (athletes/elderly may have lower, infants higher).
    3. Provide a clear medical explanation of these specific readings for someone of their age and gender.
    4. Provide 3-5 actionable health recommendations.
    
    Your tone must be professional, friendly, and medically responsible.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bpStatus: { type: Type.STRING, description: "Classification of BP: Normal, Elevated, Hypertension Stage 1, Hypertension Stage 2, Hypertensive Crisis" },
          hrStatus: { type: Type.STRING, description: "Classification of Heart Rate: Bradycardia, Normal, Tachycardia" },
          explanation: { type: Type.STRING, description: "A summary explaining what the result means for the user's demographic." },
          advice: { 
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of general health recommendations."
          }
        },
        required: ["bpStatus", "hrStatus", "explanation", "advice"]
      }
    }
  });

  try {
    const text = response.text.trim();
    return JSON.parse(text) as AnalysisResult;
  } catch (e) {
    console.error("AI Analysis failed, falling back to local logic", e);
    return determineStatusLocally(input);
  }
};

const determineStatusLocally = (input: UserInput): AnalysisResult => {
  let bpStatus = BPStatus.NORMAL;
  if (input.systolic >= 180 || input.diastolic >= 120) bpStatus = BPStatus.CRISIS;
  else if (input.systolic >= 140 || input.diastolic >= 90) bpStatus = BPStatus.HYPERTENSION_S2;
  else if (input.systolic >= 130 || input.diastolic >= 80) bpStatus = BPStatus.HYPERTENSION_S1;
  else if (input.systolic >= 120) bpStatus = BPStatus.ELEVATED;

  let hrStatus = HRStatus.NORMAL;
  if (input.heartRate < 60) hrStatus = HRStatus.BRADYCARDIA;
  else if (input.heartRate > 100) hrStatus = HRStatus.TACHYCARDIA;

  return {
    bpStatus,
    hrStatus,
    explanation: `Your reading of ${input.systolic}/${input.diastolic} mmHg is classified as ${bpStatus} for a ${input.age} year old.`,
    advice: [
      "Consult a healthcare professional for a complete diagnosis.",
      "Reduce sodium intake and monitor daily levels.",
      "Engage in at least 30 minutes of moderate physical activity most days.",
      "Track your readings over a week to identify consistent patterns."
    ]
  };
};
