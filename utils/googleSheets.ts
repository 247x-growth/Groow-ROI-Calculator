import { CalculatorState, CalculationResult, UtmParams } from '../types';
import { DEPARTMENTS } from '../constants';

// INSERISCI QUI L'URL DEL TUO GOOGLE APPS SCRIPT WEB APP
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxuU0hZcTdzZHGWr7AhGglzKO6gXJGXH85w_z6IgwO9M1PfiM4P6jaFlJBQAP_Zi__V/exec';

// Funzione per estrarre UTM parameters dalla URL
export const getUtmParams = (): UtmParams => {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || '',
    term: params.get('utm_term') || '',
    content: params.get('utm_content') || '',
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
  // Use UTMs from state (captured on load)
  const { utm } = state;

  const data = {
    // Timestamp
    timestamp: new Date().toISOString(),

    // UTM Parameters
    utmSource: utm.source,
    utmMedium: utm.medium,
    utmCampaign: utm.campaign,
    utmTerm: utm.term,
    utmContent: utm.content,

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

  // Placeholder check removed


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
