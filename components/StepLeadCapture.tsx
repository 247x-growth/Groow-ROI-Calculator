import React, { useState } from 'react';
import { LeadInfo, CalculatorState } from '../types';
import * as Icons from 'lucide-react';
import { sendToGoogleSheet } from '../utils/googleSheets';
import { calculateROI } from '../utils/calculations';

interface Props {
  data: LeadInfo;
  onChange: (data: LeadInfo) => void;
  onSubmit: () => void;
  calculatorState: CalculatorState;
}

const StepLeadCapture: React.FC<Props> = ({ data, onChange, onSubmit, calculatorState }) => {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof LeadInfo, value: string) => {
    onChange({ ...data, [field]: value });
    if (value && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!data.firstName) newErrors.firstName = true;
    if (!data.lastName) newErrors.lastName = true;
    if (!data.email || !data.email.includes('@')) newErrors.email = true;
    if (!data.companyName) newErrors.companyName = true;
    if (!data.phone) newErrors.phone = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Calcola i risultati ROI e invia a Google Sheet
    const stateWithLead = { ...calculatorState, lead: data };
    const results = calculateROI(stateWithLead);
    await sendToGoogleSheet(stateWithLead, results);

    setIsSubmitting(false);
    onSubmit();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-4 md:mb-8">
        <div className="inline-flex items-center justify-center p-2 md:p-3 bg-success/20 text-success rounded-full mb-3 md:mb-4">
          <Icons.CheckCircle2 size={28} className="md:w-8 md:h-8" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-sans text-white mb-2">Analisi Completata</h2>
        <p className="text-gray-400 text-sm md:text-base">
          Abbiamo calcolato il tuo potenziale di automazione. <br />
          Inserisci i tuoi dati per sbloccare il report dettagliato.
        </p>
      </div>

      <div className="bg-bg-card border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {/* Split Name/Surname */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-300">Nome *</label>
              <div className="relative">
                <Icons.User className="absolute left-3 top-2.5 md:top-3 text-gray-500" size={16} />
                <input
                  type="text"
                  value={data.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className={`w-full bg-bg-dark border rounded-lg py-2 md:py-2.5 pl-9 md:pl-10 pr-4 text-white text-sm md:text-base focus:outline-none focus:border-primary transition-colors ${errors.firstName ? 'border-red-500' : 'border-white/10'}`}
                  placeholder="Mario"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-300">Cognome *</label>
              <div className="relative">
                <Icons.User className="absolute left-3 top-2.5 md:top-3 text-gray-500" size={16} />
                <input
                  type="text"
                  value={data.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className={`w-full bg-bg-dark border rounded-lg py-2 md:py-2.5 pl-9 md:pl-10 pr-4 text-white text-sm md:text-base focus:outline-none focus:border-primary transition-colors ${errors.lastName ? 'border-red-500' : 'border-white/10'}`}
                  placeholder="Rossi"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Ruolo Aziendale</label>
              <div className="relative">
                <Icons.Briefcase className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  value={data.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  className="w-full bg-bg-dark border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="CEO, CFO..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Telefono *</label>
              <div className="relative">
                <Icons.Phone className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[\d\s+\-\(\)]*$/.test(val)) {
                      updateField('phone', val);
                    }
                  }}
                  className={`w-full bg-bg-dark border rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors ${errors.phone ? 'border-red-500' : 'border-white/10'}`}
                  placeholder="+39 333 1234567"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Aziendale *</label>
            <div className="relative">
              <Icons.Mail className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="email"
                value={data.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`w-full bg-bg-dark border rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                placeholder="mario.rossi@azienda.it"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nome Azienda *</label>
            <div className="relative">
              <Icons.Building2 className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="text"
                value={data.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className={`w-full bg-bg-dark border rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors ${errors.companyName ? 'border-red-500' : 'border-white/10'}`}
                placeholder="Nome della tua azienda"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full group bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <Icons.Loader2 size={20} className="animate-spin" />
                  Invio in corso...
                </>
              ) : (
                <>
                  <Icons.Unlock size={20} />
                  Sblocca il Report ROI
                  <Icons.ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              I tuoi dati sono al sicuro e saranno trattati a norma di legge
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepLeadCapture;