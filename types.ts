
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum BPStatus {
  NORMAL = 'Normal',
  ELEVATED = 'Elevated',
  HYPERTENSION_S1 = 'Hypertension Stage 1',
  HYPERTENSION_S2 = 'Hypertension Stage 2',
  CRISIS = 'Hypertensive Crisis'
}

export enum HRStatus {
  BRADYCARDIA = 'Bradycardia',
  NORMAL = 'Normal',
  TACHYCARDIA = 'Tachycardia'
}

export interface UserInput {
  age: number;
  gender: Gender;
  systolic: number;
  diastolic: number;
  heartRate: number;
}

export interface AnalysisResult {
  bpStatus: BPStatus;
  hrStatus: HRStatus;
  explanation: string;
  advice: string[];
}
