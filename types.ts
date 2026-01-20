export interface ProcessDefinition {
  id: string;
  name: string;
  defaultHours: number;
  automationFactor: number; // 0.35 to 0.85
}

export interface DepartmentDefinition {
  id: string;
  name: string;
  icon: string;
  defaultStaffCount: number;
  processes: ProcessDefinition[];
}

export interface SelectedProcess {
  processId: string;
  hoursPerWeek: number;
  isSelected: boolean;
}

export interface CustomProcessState {
  isSelected: boolean;
  name: string;
  hoursPerWeek: number;
}

export interface DepartmentState {
  isSelected: boolean; // New field for Step 2
  staffCount: number;
  processes: Record<string, SelectedProcess>;
  customProcess: CustomProcessState;
}

export interface CompanyProfile {
  industry: string;
  size: 'Micro' | 'Piccola' | 'Media';
  revenue: string;
  digitizationLevel: number;
}

export interface LeadInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  role: string;
}

export interface EconomicParameters {
  averageHourlyCost: number; // Simplified from breakdown
  inefficiencyFactor: number;
}

export interface CalculatorState {
  step: number;
  company: CompanyProfile;
  departments: Record<string, DepartmentState>;
  economics: EconomicParameters;
  lead: LeadInfo;
  utm: UtmParams;
}

export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

export interface CalculationResult {
  totalAnnualSavings: number;
  totalAnnualHours: number;
  fteEquivalent: number;
  roiMonths: number;
  roi3YearPct: number;
  savingsByDept: { name: string; value: number }[];
  topProcesses: { name: string; savings: number; hours: number }[];
  timelineData: { month: string; cumulativeSavings: number; cost: number }[];
}