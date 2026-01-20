import { CalculatorState, CalculationResult } from '../types';
import { DEPARTMENTS } from '../constants';

// INSERISCI QUI L'URL DEL TUO GOOGLE APPS SCRIPT WEB APP
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

// Funzione per estrarre UTM parameters dalla URL
export const getUtmParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmTerm: params.get('utm_term') || '',
    utmContent: params.get('utm_content') || '',
  };
};

// Funzione per ottenere i nomi dei dipartimenti selezionati
const getSelectedDepartments = (state: CalculatorState): string => {
  const selected: string[] = [];
  Object.keys(state.departments).forEach(deptId => {
    const deptState = state.departments[deptId];
    if (deptState.isSelected) {
      const deptDef = DEPARTMENTS.find(d => d.id === deptId);
      if (deptDef) selected.push(deptDef.name);
    }
  });
  return selected.join(', ');
};

// Funzione per ottenere i processi selezionati
const getSelectedProcesses = (state: CalculatorState): string => {
  const selected: string[] = [];
  Object.keys(state.departments).forEach(deptId => {
    const deptState = state.departments[deptId];
    const deptDef = DEPARTMENTS.find(d => d.id === deptId);
    if (!deptDef) return;

    Object.keys(deptState.processes).forEach(procId => {
      const procState = deptState.processes[procId];
      if (procState.isSelected) {
        const procDef = deptDef.processes.find(p => p.id === procId);
        if (procDef) selected.push(procDef.name);
      }
    });

    if (deptState.customProcess?.isSelected && deptState.customProcess.name) {
      selected.push(deptState.customProcess.name);
    }
  });
  return selected.join(', ');
};

// Funzione principale per inviare i dati al Google Sheet
export const sendToGoogleSheet = async (
  state: CalculatorState,
  results: CalculationResult
): Promise<boolean> => {
  const utmParams = getUtmParams();

  const data = {
    // Timestamp
    timestamp: new Date().toISOString(),

    // UTM Parameters
    utmSource: utmParams.utmSource,
    utmMedium: utmParams.utmMedium,
    utmCampaign: utmParams.utmCampaign,
    utmTerm: utmParams.utmTerm,
    utmContent: utmParams.utmContent,

    // Lead Info
    firstName: state.lead.firstName,
    lastName: state.lead.lastName,
    email: state.lead.email,
    phone: state.lead.phone,
    companyName: state.lead.companyName,
    role: state.lead.role,

    // Company Profile
    industry: state.company.industry,
    companySize: state.company.size,
    revenue: state.company.revenue,
    digitizationLevel: state.company.digitizationLevel,

    // Selected Departments & Processes
    selectedDepartments: getSelectedDepartments(state),
    selectedProcesses: getSelectedProcesses(state),

    // Economic Parameters
    averageHourlyCost: state.economics.averageHourlyCost,
    inefficiencyFactor: state.economics.inefficiencyFactor,

    // ROI Results
    totalAnnualSavings: Math.round(results.totalAnnualSavings),
    totalAnnualHours: Math.round(results.totalAnnualHours),
    fteEquivalent: results.fteEquivalent.toFixed(2),
    roiMonths: results.roiMonths,
    roi3YearPct: Math.round(results.roi3YearPct),

    // Top Processes (as string)
    topProcesses: results.topProcesses.map(p => `${p.name}: €${Math.round(p.savings)}`).join(' | '),
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script richiede no-cors
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Data sent to Google Sheet');
    return true;
  } catch (error) {
    console.error('Error sending data to Google Sheet:', error);
    return false;
  }
};
