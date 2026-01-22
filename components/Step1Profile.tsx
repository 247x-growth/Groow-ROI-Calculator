
import React from 'react';
import { CompanyProfile } from '../types';
import { INDUSTRIES, REVENUE_RANGES } from '../constants';
import * as Icons from 'lucide-react';

interface Props {
  data: CompanyProfile;
  onChange: (data: CompanyProfile) => void;
}

const Step1Profile: React.FC<Props> = ({ data, onChange }) => {
  const updateField = (field: keyof CompanyProfile, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const sizes = ['Micro (1-9)', 'Piccola (10-49)', 'Media (50-249)'];

  // Calculate percentage for gradient background
  // When value is 1, percentage should be 0% (start)
  // When value is 5, percentage should be 100% (end)
  // Formula: (value - 1) / (5 - 1) * 100 for the track fill
  // But for the thumb position, the browser uses (value - min) / (max - min)
  // Since min=0, max=5, for value=2 the thumb is at 40% (2/5)
  // The fill should match: (value / 5) * 100
  const sliderPercentage = data.digitizationLevel > 0
    ? (data.digitizationLevel / 5) * 100
    : 0;
  const sliderStyle = {
    background: data.digitizationLevel > 0
      ? `linear-gradient(to right, #32D9F6 0%, #32D9F6 ${sliderPercentage}%, #374151 ${sliderPercentage}%, #374151 100%)`
      : '#374151'
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Profilo Azienda</h2>
        <p className="text-gray-400 text-sm md:text-base">Iniziamo conoscendo meglio la tua realtà.</p>
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Settore Industriale <span className="text-red-400">*</span>
        </label>
        {!data.industry && (
          <p className="text-xs text-amber-400 flex items-center gap-1">
            <Icons.AlertCircle size={12} /> Seleziona il tuo settore
          </p>
        )}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {INDUSTRIES.map((ind) => {
            // Safe fallback for icons
            const Icon = (Icons as any)[ind.icon] || Icons.HelpCircle;
            const isSelected = data.industry === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => updateField('industry', ind.id)}
                className={`p-2 md:p-4 rounded-xl border flex flex-col items-center gap-1 md:gap-2 transition-all duration-200 ${isSelected
                  ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(51,72,246,0.3)]'
                  : 'bg-bg-card border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'
                  }`}
              >
                <Icon size={20} className={`md:w-6 md:h-6 ${isSelected ? 'text-accent' : 'text-gray-500'}`} />
                <span className="text-xs md:text-sm font-medium text-center leading-tight">{ind.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size & Revenue Row */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Dimensione Azienda <span className="text-red-400">*</span>
          </label>
          {!data.size && (
            <p className="text-xs text-amber-400 flex items-center gap-1">
              <Icons.AlertCircle size={12} /> Seleziona la dimensione
            </p>
          )}
          <div className="flex flex-col gap-2">
            {['Micro', 'Piccola', 'Media'].map((size, idx) => (
              <button
                key={size}
                onClick={() => updateField('size', size)}
                className={`w-full p-2.5 md:p-3 text-left rounded-lg border transition-all ${data.size === size
                  ? 'bg-primary/20 border-primary text-white'
                  : 'bg-bg-card border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm md:text-base">{sizes[idx]}</span>
                  {data.size === size && <Icons.CheckCircle2 size={18} className="text-accent" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Fatturato Annuo <span className="text-red-400">*</span>
          </label>
          {!data.revenue && (
            <p className="text-xs text-amber-400 flex items-center gap-1">
              <Icons.AlertCircle size={12} /> Seleziona il fatturato
            </p>
          )}
          <div className="flex flex-col gap-2">
            {REVENUE_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => updateField('revenue', range)}
                className={`w-full p-2.5 md:p-3 text-left rounded-lg border transition-all ${data.revenue === range
                  ? 'bg-accent/20 border-accent text-white'
                  : 'bg-bg-card border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
              >
                <span className="font-medium text-sm md:text-base">{range}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Digitization Level */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <div className="flex justify-between items-end">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Livello Digitalizzazione <span className="text-red-400">*</span>
            </label>
            {data.digitizationLevel === 0 && (
              <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                <Icons.AlertCircle size={12} /> Muovi il cursore per selezionare
              </p>
            )}
          </div>
          <span className={`text-2xl font-mono font-bold ${data.digitizationLevel > 0 ? 'text-accent' : 'text-gray-500'}`}>
            {data.digitizationLevel > 0 ? `${data.digitizationLevel}/5` : '-/5'}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={data.digitizationLevel}
          onChange={(e) => updateField('digitizationLevel', parseInt(e.target.value))}
          style={sliderStyle}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-accent"
        />

        <div className={`p-3 md:p-4 rounded-lg border ${data.digitizationLevel > 0 ? 'bg-bg-card border-white/10' : 'bg-amber-500/5 border-amber-500/30'}`}>
          <p className="text-sm text-gray-300">
            {data.digitizationLevel === 0 && "👆 Seleziona un livello per continuare"}
            {data.digitizationLevel === 1 && "Principalmente carta e fogli Excel disconnessi."}
            {data.digitizationLevel === 2 && "Software base (email, fatturazione) ma molti processi manuali."}
            {data.digitizationLevel === 3 && "Gestionali presenti ma usati parzialmente. Dati non sincronizzati."}
            {data.digitizationLevel === 4 && "Sistemi integrati, ma permangono attività ripetitive manuali."}
            {data.digitizationLevel === 5 && "Automazioni base già presenti. Focus su IA e ottimizzazione."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1Profile;
