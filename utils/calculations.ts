import { CalculatorState, CalculationResult } from '../types';
import { DEPARTMENTS } from '../constants';

export const calculateROI = (state: CalculatorState): CalculationResult => {
  const { departments, economics } = state;
  const WORKING_WEEKS = 48;

  // Simplified Cost Logic
  const adjustedHourlyCost = economics.averageHourlyCost * economics.inefficiencyFactor;

  let totalWeeklyHoursSaved = 0;
  let savingsByDept: { name: string; value: number }[] = [];
  let processList: { name: string; savings: number; hours: number }[] = [];

  // Iterate Departments
  Object.keys(departments).forEach(deptId => {
    const deptState = departments[deptId];
    const deptDef = DEPARTMENTS.find(d => d.id === deptId);
    
    if (!deptDef) return;

    let deptSavings = 0;

    // Calculate Standard Processes
    Object.keys(deptState.processes).forEach(procId => {
      const procState = deptState.processes[procId];
      if (!procState.isSelected) return;

      const procDef = deptDef.processes.find(p => p.id === procId);
      if (!procDef) return;

      // Logic: (Default Hours/Week * Staff Count) * Automation Factor
      // Note: We now rely on procState.hoursPerWeek which is initialized to defaultHours
      const totalHoursForProcess = procState.hoursPerWeek * deptState.staffCount;
      const savedHours = totalHoursForProcess * procDef.automationFactor;
      
      const monetarySavings = savedHours * adjustedHourlyCost * WORKING_WEEKS;
      
      deptSavings += monetarySavings;
      totalWeeklyHoursSaved += savedHours;

      processList.push({
        name: procDef.name,
        savings: monetarySavings,
        hours: savedHours * WORKING_WEEKS
      });
    });

    // Calculate Custom Process (Altro)
    if (deptState.customProcess && deptState.customProcess.isSelected) {
        // Standardize Logic for "Altro":
        // Users usually type pain-points. We assume a standard automation potential of 60% (0.60).
        const customName = deptState.customProcess.name || `Altro (${deptDef.name})`;
        const hoursPerWeek = deptState.customProcess.hoursPerWeek || 5; // Default 5 hours if not set
        const automationFactor = 0.60;

        const totalHoursForProcess = hoursPerWeek * deptState.staffCount;
        const savedHours = totalHoursForProcess * automationFactor;
        const monetarySavings = savedHours * adjustedHourlyCost * WORKING_WEEKS;

        deptSavings += monetarySavings;
        totalWeeklyHoursSaved += savedHours;

        processList.push({
            name: customName,
            savings: monetarySavings,
            hours: savedHours * WORKING_WEEKS
        });
    }

    if (deptSavings > 0) {
      savingsByDept.push({ name: deptDef.name, value: deptSavings });
    }
  });

  const totalAnnualSavings = totalWeeklyHoursSaved * adjustedHourlyCost * WORKING_WEEKS;
  const totalAnnualHours = totalWeeklyHoursSaved * WORKING_WEEKS;
  const fteEquivalent = totalAnnualHours / 1760; // Standard ~1760 hours

  // Cost Estimation for Groow (Mock Logic based on complexity)
  const complexityScore = processList.length * 1000; 
  const estimatedSetup = Math.min(15000, Math.max(2000, 2000 + (processList.length * 500)));
  const estimatedMonthly = Math.min(3000, Math.max(500, 500 + (processList.length * 100)));
  const annualCostGroow = estimatedSetup + (estimatedMonthly * 12);
  const threeYearCostGroow = estimatedSetup + (estimatedMonthly * 36);

  // Timeline Calculation
  const timelineData = [];
  const monthlySavingsPotential = totalAnnualSavings / 12;
  
  let cumulativeSavings = 0;
  let cumulativeCost = estimatedSetup;

  for (let m = 1; m <= 36; m++) {
    let factor = 0.95;
    if (m <= 2) factor = 0.25;
    else if (m <= 4) factor = 0.60;
    else if (m <= 6) factor = 0.85;

    const monthlySav = monthlySavingsPotential * factor;
    cumulativeSavings += monthlySav;
    cumulativeCost += estimatedMonthly;

    if (m % 3 === 0 || m === 1) { 
        timelineData.push({
            month: `M${m}`,
            cumulativeSavings: Math.round(cumulativeSavings),
            cost: Math.round(cumulativeCost)
        });
    }
  }

  // ROI
  const totalSavings3Years = cumulativeSavings;
  const roi3YearPct = ((totalSavings3Years - threeYearCostGroow) / threeYearCostGroow) * 100;
  
  // Break Even
  let breakEvenMonth = 0;
  let tempSav = 0;
  let tempCost = estimatedSetup;
  for(let m=1; m<=36; m++) {
    let factor = 0.95;
    if (m <= 2) factor = 0.25;
    else if (m <= 4) factor = 0.60;
    else if (m <= 6) factor = 0.85;
    tempSav += (monthlySavingsPotential * factor);
    tempCost += estimatedMonthly;
    if(tempSav >= tempCost) {
        breakEvenMonth = m;
        break;
    }
  }

  return {
    totalAnnualSavings,
    totalAnnualHours,
    fteEquivalent,
    roiMonths: breakEvenMonth,
    roi3YearPct,
    savingsByDept,
    topProcesses: processList.sort((a,b) => b.savings - a.savings).slice(0, 10),
    timelineData
  };
};