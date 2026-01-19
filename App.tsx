
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

const INITIAL_STATE: CalculatorState = {
  step: 1, 
  company: {
    industry: '',
    size: 'Micro',
    revenue: '',
    digitizationLevel: 2,
  },
  departments: INITIAL_DEPARTMENTS,
  economics: {
    averageHourlyCost: 35, 
    inefficiencyFactor: 1.3,
  },
  lead: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    role: ''
  }
};

const App: React.FC = () => {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  const MAX_STEPS = 6;

  const nextStep = () => {
    setState(prev => ({ ...prev, step: Math.min(MAX_STEPS, prev.step + 1) }));
    const calcEl = document.getElementById('calculator-widget');
    if (calcEl) {
        calcEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const prevStep = () => setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  
  const updateCompany = (data: any) => setState(prev => ({ ...prev, company: data }));
  const updateDepts = (data: any) => setState(prev => ({ ...prev, departments: data }));
  const updateEcon = (data: any) => setState(prev => ({ ...prev, economics: data }));
  const updateLead = (data: LeadInfo) => setState(prev => ({ ...prev, lead: data }));

  const reset = () => setState(INITIAL_STATE);

  const canProceed = () => {
    if (state.step === 1) return state.company.industry && state.company.revenue;
    if (state.step === 2) return Object.values(state.departments).some((d: DepartmentState) => d.isSelected);
    if (state.step === 3) {
      const activeDepts = Object.values(state.departments).filter((d: DepartmentState) => d.isSelected);
      return activeDepts.some((d: DepartmentState) => 
        Object.values(d.processes).some((p: SelectedProcess) => p.isSelected) || d.customProcess.isSelected
      );
    }
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
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                {/* Logo Visibility Correction: Updated to new file provided, increased size for clarity */}
                <img src="65552309-844c-4a30-9b37-f0334812f861.png" alt="Groow Logo" className="h-14 w-auto object-contain" />
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
               <span className="hover:text-white cursor-pointer transition-colors">Home</span>
               <span className="hover:text-white cursor-pointer transition-colors">Piattaforma</span>
               <span className="hover:text-white cursor-pointer transition-colors">Agenti AI</span>
               <span className="hover:text-white cursor-pointer transition-colors">Prezzi</span>
            </div>
            <button 
                onClick={scrollToCalculator}
                className="px-6 py-2.5 rounded-full bg-electric-pulse hover:bg-cobalto-futuro transition-all text-sm font-medium shadow-lg shadow-electric-pulse/20"
            >
                Log In / Sign Up
            </button>
         </div>
      </nav>

      <main>
        <LandingHero onCtaClick={scrollToCalculator} />
        <LandingHowItWorks />

        {/* Calculator Section */}
        <section id="calculator-section" className="py-32 px-6 bg-midnight-silicon relative">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-medium text-white mb-4">Calcola il ROI del tuo Agente AI</h2>
                    <p className="text-xl text-gray-400 font-light">Compila il configuratore per ricevere un'analisi personalizzata.</p>
                </div>

                <div id="calculator-widget" className="groow-card overflow-hidden flex flex-col md:flex-row min-h-[700px]">
                    {/* Progress Column */}
                    <div className="bg-white/[0.02] p-8 md:w-72 border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
                        <div className="mb-12">
                            <span className="text-[10px] font-medium text-electric-pulse uppercase tracking-[0.2em]">Step Attuale</span>
                            <div className="text-5xl font-medium text-white mt-2">
                                0{state.step}<span className="text-gray-700 text-2xl">/0{MAX_STEPS}</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-8">
                            {[
                                { num: 1, label: 'Profilo Azienda' },
                                { num: 2, label: 'Reparti' },
                                { num: 3, label: 'Processi' },
                                { num: 4, label: 'Parametri' },
                                { num: 5, label: 'Lead' },
                                { num: 6, label: 'Analisi' }
                            ].map((s) => (
                                <div key={s.num} className="flex items-center gap-5">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                                        state.step >= s.num ? 'bg-electric-pulse text-white' : 'bg-white/5 text-gray-600'
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

                    {/* Form Column */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col">
                        <div className="flex-1">
                            {state.step === 1 && <Step1Profile data={state.company} onChange={updateCompany} />}
                            {state.step === 2 && <Step2Departments data={state.departments} onChange={updateDepts} />}
                            {state.step === 3 && <Step3Processes data={state.departments} onChange={updateDepts} />}
                            {state.step === 4 && <Step3Economics data={state.economics} onChange={updateEcon} />}
                            {state.step === 5 && <StepLeadCapture data={state.lead} onChange={updateLead} onSubmit={nextStep} />}
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
                                        className={`px-10 py-3.5 rounded-full font-medium transition-all ${
                                        canProceed() 
                                            ? 'bg-electric-pulse text-white shadow-lg shadow-electric-pulse/30' 
                                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                        }`}
                                    >
                                        {state.step === 4 ? 'Vedi Risultati' : 'Continua'}
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
                <div className="grid md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-2">
                        {/* Footer Logo: Updated with new file and clear sizing */}
                        <img src="65552309-844c-4a30-9b37-f0334812f861.png" alt="Groow Logo" className="h-12 w-auto mb-8 object-contain" />
                        <p className="text-gray-500 mt-8 text-lg font-light leading-relaxed max-w-md">
                            Automatizziamo il lavoro quotidiano delle PMI italiane con Agenti AI intelligenti e supervisionati.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-8">Piattaforma</h4>
                        <ul className="space-y-4 text-gray-500 font-light">
                            <li className="hover:text-electric-pulse cursor-pointer transition-colors">Agenti AI</li>
                            <li className="hover:text-electric-pulse cursor-pointer transition-colors">Integrazioni</li>
                            <li className="hover:text-electric-pulse cursor-pointer transition-colors">Soluzioni</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-8">Supporto</h4>
                        <ul className="space-y-4 text-gray-500 font-light">
                            <li className="hover:text-electric-pulse cursor-pointer transition-colors">Documentazione</li>
                            <li className="hover:text-electric-pulse cursor-pointer transition-colors">Assistenza</li>
                            <li className="hover:text-electric-pulse cursor-pointer transition-colors">Contatti</li>
                        </ul>
                    </div>
                </div>
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-600 text-sm font-light">© 2024 Groow.ai by Webidoo. All rights reserved.</p>
                    <div className="flex gap-8 text-gray-600 text-sm font-light">
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Termini d'uso</span>
                    </div>
                </div>
            </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
