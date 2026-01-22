
import React, { useState } from 'react';
import { CalculatorState, DepartmentState, SelectedProcess, LeadInfo } from './types';
import { DEPARTMENTS } from './constants';
import { LandingHero, LandingHowItWorks, LandingCapabilities, LandingSocial } from './components/StepLanding';
import Step1Profile from './components/Step1Profile';
import Step2Departments from './components/Step2Departments';
import Step3Processes from './components/Step2Processes';
import Step3Economics from './components/Step3Economics';
import StepLeadCapture from './components/StepLeadCapture';
import Dashboard from './components/Dashboard';
import * as Icons from 'lucide-react';

const INITIAL_DEPARTMENTS: Record<string, DepartmentState> = {};
DEPARTMENTS.forEach(dept => {
  INITIAL_DEPARTMENTS[dept.id] = {
    isSelected: false,
    staffCount: dept.defaultStaffCount,
    processes: {},
    customProcess: {
      isSelected: false,
      name: '',
      hoursPerWeek: 5
    }
  };
  dept.processes.forEach(proc => {
    INITIAL_DEPARTMENTS[dept.id].processes[proc.id] = {
      processId: proc.id,
      hoursPerWeek: proc.defaultHours,
      isSelected: false
    };
  });
});

import { getUtmParams } from './utils/googleSheets';

const INITIAL_STATE: CalculatorState = {
  step: 1,
  company: {
    industry: '',
    size: '',
    revenue: '',
    digitizationLevel: 0,
  },
  departments: INITIAL_DEPARTMENTS,
  economics: {
    averageHourlyCost: 0,
    inefficiencyFactor: 0,
  },
  lead: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    role: ''
  },
  utm: getUtmParams()
};

const App: React.FC = () => {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  const MAX_STEPS = 5;

  const nextStep = () => {
    setState(prev => ({ ...prev, step: Math.min(MAX_STEPS + 1, prev.step + 1) }));
    setTimeout(() => {
      const calcEl = document.getElementById('calculator-widget');
      if (calcEl) {
        calcEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const prevStep = () => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
    setTimeout(() => {
      const calcEl = document.getElementById('calculator-widget');
      if (calcEl) {
        calcEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const updateCompany = (data: any) => setState(prev => ({ ...prev, company: data }));
  const updateDepts = (data: any) => setState(prev => ({ ...prev, departments: data }));
  const updateEcon = (data: any) => setState(prev => ({ ...prev, economics: data }));
  const updateLead = (data: LeadInfo) => setState(prev => ({ ...prev, lead: data }));

  const reset = () => setState(INITIAL_STATE);

  const canProceed = () => {
    if (state.step === 1) return state.company.industry && state.company.size && state.company.revenue && state.company.digitizationLevel > 0;
    if (state.step === 2) return Object.values(state.departments).some((d: DepartmentState) => d.isSelected);
    if (state.step === 3) {
      const activeDepts = Object.values(state.departments).filter((d: DepartmentState) => d.isSelected);
      return activeDepts.some((d: DepartmentState) =>
        Object.values(d.processes).some((p: SelectedProcess) => p.isSelected) || d.customProcess.isSelected
      );
    }
    if (state.step === 4) return state.economics.averageHourlyCost > 0 && state.economics.inefficiencyFactor > 0;
    return true;
  };

  const scrollToCalculator = () => {
    const element = document.getElementById('calculator-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-midnight-silicon text-white font-sans selection:bg-electric-pulse selection:text-white">
      {/* Navigation - High contrast solid background for logo legibility */}
      <nav className="fixed w-full top-0 z-50 bg-[#0a0c0e] border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {/* Logo - smaller on mobile */}
            <img src="/logo-groow.png" alt="Groow Logo" className="h-8 md:h-14 w-auto object-contain" />
          </div>
          <button
            onClick={scrollToCalculator}
            className="px-3 md:px-6 py-2 md:py-2.5 rounded-full bg-electric-pulse hover:bg-cobalto-futuro transition-all text-xs md:text-sm font-medium shadow-lg shadow-electric-pulse/20"
          >
            <span className="hidden sm:inline">Calcola il tuo risparmio</span>
            <span className="sm:hidden">Calcola ROI</span>
          </button>
        </div>
      </nav>

      <main>
        <LandingHero onCtaClick={scrollToCalculator} />
        <LandingHowItWorks />

        {/* Calculator Section */}
        <section id="calculator-section" className="py-16 md:py-32 px-4 md:px-6 bg-midnight-silicon relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium text-white mb-2 md:mb-4">Calcola il ROI del tuo Agente AI</h2>
              <p className="text-base md:text-xl text-gray-400 font-light">Compila il configuratore per ricevere un'analisi personalizzata.</p>
            </div>

            <div id="calculator-widget" className="groow-card overflow-hidden flex flex-col md:flex-row min-h-[600px] md:min-h-[700px]">
              {/* Progress Column - nascosta nella Dashboard */}
              {state.step <= MAX_STEPS && (
                <div className="bg-white/[0.02] p-4 md:p-8 md:w-72 border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
                  <div className="mb-6 md:mb-12 flex md:block items-center gap-3">
                    <span className="text-[10px] font-medium text-electric-pulse uppercase tracking-[0.2em]">Step Attuale</span>
                    <div className="text-3xl md:text-5xl font-medium text-white md:mt-2">
                      0{state.step}<span className="text-gray-700 text-lg md:text-2xl">/0{MAX_STEPS}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-8">
                    {[
                      { num: 1, label: 'Profilo Azienda' },
                      { num: 2, label: 'Reparti' },
                      { num: 3, label: 'Processi' },
                      { num: 4, label: 'Parametri' },
                      { num: 5, label: 'Lead' }
                    ].map((s) => (
                      <div key={s.num} className="flex items-center gap-5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${state.step >= s.num ? 'bg-electric-pulse text-white' : 'bg-white/5 text-gray-600'
                          }`}>
                          {state.step > s.num ? <Icons.Check size={14} /> : s.num}
                        </div>
                        <span className={`text-sm font-medium ${state.step === s.num ? 'text-white' : 'text-gray-600'}`}>
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Column */}
              <div className="flex-1 p-4 md:p-8 lg:p-12 flex flex-col">
                <div className="flex-1">
                  {state.step === 1 && <Step1Profile data={state.company} onChange={updateCompany} />}
                  {state.step === 2 && <Step2Departments data={state.departments} onChange={updateDepts} />}
                  {state.step === 3 && <Step3Processes data={state.departments} onChange={updateDepts} />}
                  {state.step === 4 && <Step3Economics data={state.economics} onChange={updateEcon} />}
                  {state.step === 5 && <StepLeadCapture data={state.lead} onChange={updateLead} onSubmit={nextStep} calculatorState={state} />}
                  {state.step === 6 && <Dashboard state={state} onReset={reset} />}
                </div>

                {state.step < 6 && (
                  <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                    <button
                      onClick={prevStep}
                      disabled={state.step === 1}
                      className={`text-gray-400 hover:text-white font-medium transition-colors ${state.step === 1 ? 'invisible' : ''}`}
                    >
                      Indietro
                    </button>

                    {state.step !== 5 && (
                      <button
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className={`px-10 py-3.5 rounded-full font-medium transition-all ${canProceed()
                          ? 'bg-electric-pulse text-white shadow-lg shadow-electric-pulse/30'
                          : 'bg-white/5 text-gray-600 cursor-not-allowed'
                          }`}
                      >
                        Continua
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <LandingCapabilities />
        <LandingSocial />

        {/* Footer */}
        <footer className="bg-midnight-silicon border-t border-white/5 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20">
              <img src="/logo-groow.png" alt="Groow Logo" className="h-12 w-auto mb-8 object-contain" />
              <p className="text-gray-500 mt-8 text-lg font-light leading-relaxed max-w-md">
                Automatizziamo il lavoro quotidiano delle PMI italiane con Agenti AI intelligenti e supervisionati.
              </p>
            </div>
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-600 text-sm font-light">© 2026 Groow.ai by Webidoo. All rights reserved.</p>
              <div className="flex gap-8 text-gray-600 text-sm font-light">
                <a href="https://groow.ai/en/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="https://groow.ai/en/terms-and-conditions/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Termini e Condizioni</a>
                <a href="https://groow.ai/en/cookie-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
