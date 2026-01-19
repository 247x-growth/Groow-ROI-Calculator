
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
  const sliderPercentage = ((data.digitizationLevel - 1) / (5 - 1)) * 100;
  const sliderStyle = {
    background: `linear-gradient(to right, #32D9F6 0%, #32D9F6 ${sliderPercentage}%, #374151 ${sliderPercentage}%, #374151 100%)`
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Profilo Azienda</h2>
        <p className="text-gray-400">Iniziamo conoscendo meglio la tua realtà.</p>
      </div>

      {/* Industry */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">Settore Industriale</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {INDUSTRIES.map((ind) => {
            // Safe fallback for icons
            const Icon = (Icons as any)[ind.icon] || Icons.HelpCircle;
            const isSelected = data.industry === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => updateField('industry', ind.id)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(51,72,246,0.3)]'
                    : 'bg-bg-card border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <Icon size={24} className={isSelected ? 'text-accent' : 'text-gray-500'} />
                <span className="text-sm font-medium">{ind.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size & Revenue Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Dimensione Azienda</label>
          <div className="flex flex-col gap-2">
            {['Micro', 'Piccola', 'Media'].map((size, idx) => (
              <button
                key={size}
                onClick={() => updateField('size', size)}
                className={`w-full p-3 text-left rounded-lg border transition-all ${
                  data.size === size
                    ? 'bg-primary/20 border-primary text-white'
                    : 'bg-bg-card border-white/10 text-gray-400 hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-center">
                    <span className="font-medium">{sizes[idx]}</span>
                    {data.size === size && <Icons.CheckCircle2 size={18} className="text-accent" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Fatturato Annuo</label>
          <div className="flex flex-col gap-2">
             {REVENUE_RANGES.map((range) => (
                <button
                    key={range}
                    onClick={() => updateField('revenue', range)}
                    className={`w-full p-3 text-left rounded-lg border transition-all ${
                    data.revenue === range
                        ? 'bg-accent/20 border-accent text-white'
                        : 'bg-bg-card border-white/10 text-gray-400 hover:bg-white/5'
                    }`}
                >
                    <span className="font-medium">{range}</span>
                </button>
             ))}
          </div>
        </div>
      </div>

      {/* Digitization Level */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex justify-between items-end">
             <label className="block text-sm font-medium text-gray-300">Livello Digitalizzazione</label>
             <span className="text-2xl font-mono font-bold text-accent">{data.digitizationLevel}/5</span>
        </div>
        
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={data.digitizationLevel}
          onChange={(e) => updateField('digitizationLevel', parseInt(e.target.value))}
          style={sliderStyle}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-accent"
        />
        
        <div className="bg-bg-card p-4 rounded-lg border border-white/10">
            <p className="text-sm text-gray-300">
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
