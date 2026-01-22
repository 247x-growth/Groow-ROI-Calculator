
import React from 'react';
import { EconomicParameters } from '../types';
import * as Icons from 'lucide-react';

interface Props {
  data: EconomicParameters;
  onChange: (data: EconomicParameters) => void;
}

const Step3Economics: React.FC<Props> = ({ data, onChange }) => {

  const updateField = (field: keyof EconomicParameters, value: number) => {
    onChange({ ...data, [field]: value });
  };

  // Helper to generate gradient style - accounts for unselected state (value = 0)
  const getSliderStyle = (val: number, min: number, max: number, colorHex: string, unselectedValue: number) => {
    if (val === unselectedValue) {
      return { background: '#374151' };
    }
    const percent = ((val - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, ${colorHex} 0%, ${colorHex} ${percent}%, #374151 ${percent}%, #374151 100%)`
    };
  };

  const hourlyCostSelected = data.averageHourlyCost > 0;
  const inefficiencySelected = data.inefficiencyFactor > 0;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Parametri Economici</h2>
        <p className="text-gray-400 text-sm md:text-base font-normal">Sposta i cursori per impostare i parametri economici.</p>
      </div>

      <div className="bg-bg-card border border-white/10 rounded-xl p-4 md:p-8 space-y-6 md:space-y-8">

        {/* Average Hourly Cost */}
        <div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 md:mb-4 gap-1">
            <div>
              <h3 className="text-base md:text-lg font-bold text-white">
                Costo Orario Medio <span className="text-red-400">*</span>
              </h3>
              <p className="text-[10px] md:text-xs font-light text-gray-400">Media lorda (RAL + Contributi) per dipendente</p>
              {!hourlyCostSelected && (
                <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                  <Icons.AlertCircle size={12} /> Muovi il cursore per selezionare
                </p>
              )}
            </div>
            <div className={`text-xl md:text-2xl font-bold ${hourlyCostSelected ? 'text-primary' : 'text-gray-500'}`}>
              {hourlyCostSelected ? `€${data.averageHourlyCost}/h` : '-/h'}
            </div>
          </div>

          <input
            type="range" min="0" max="100" step="1"
            value={data.averageHourlyCost}
            onChange={(e) => updateField('averageHourlyCost', parseInt(e.target.value))}
            style={getSliderStyle(data.averageHourlyCost, 0, 100, '#3348F6', 0)}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className={`p-2 md:p-3 rounded-lg border mt-3 ${hourlyCostSelected ? 'bg-bg-card border-white/10' : 'bg-amber-500/5 border-amber-500/30'}`}>
            <p className="text-xs md:text-sm text-gray-300">
              {!hourlyCostSelected && "👆 Seleziona il costo orario per continuare"}
              {data.averageHourlyCost >= 1 && data.averageHourlyCost < 25 && "Livello Junior/Entry level (€15-25/h)"}
              {data.averageHourlyCost >= 25 && data.averageHourlyCost < 45 && "Livello Middle/Impiegato (€25-45/h)"}
              {data.averageHourlyCost >= 45 && data.averageHourlyCost < 70 && "Livello Senior/Manager (€45-70/h)"}
              {data.averageHourlyCost >= 70 && "Livello Dirigente/Executive (€70-100/h)"}
            </p>
          </div>
        </div>

        <div className="h-px bg-white/5 w-full"></div>

        {/* Improvement Margin */}
        <div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 md:mb-4 gap-1">
            <div>
              <h3 className="text-base md:text-lg font-bold text-white">
                Margine di Miglioramento <span className="text-red-400">*</span>
              </h3>
              <p className="text-[10px] md:text-xs font-light text-gray-400">Potenziale di efficienza con l'automazione</p>
              {!inefficiencySelected && (
                <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                  <Icons.AlertCircle size={12} /> Muovi il cursore per selezionare
                </p>
              )}
            </div>
            <div className={`text-xl md:text-2xl font-bold ${inefficiencySelected ? 'text-accent' : 'text-gray-500'}`}>
              {inefficiencySelected ? `${data.inefficiencyFactor.toFixed(2)}x` : '-'}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex-1">
              <input
                type="range" min="0" max="200" step="5"
                value={data.inefficiencyFactor * 100}
                onChange={(e) => updateField('inefficiencyFactor', parseInt(e.target.value) / 100)}
                style={getSliderStyle(data.inefficiencyFactor * 100, 0, 200, '#32D9F6', 0)}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className={`p-2 md:p-3 rounded-lg border mt-3 ${inefficiencySelected ? 'bg-bg-card border-white/10' : 'bg-amber-500/5 border-amber-500/30'}`}>
                <p className="text-xs md:text-sm text-gray-300">
                  {!inefficiencySelected && "👆 Seleziona il margine di miglioramento per continuare"}
                  {data.inefficiencyFactor >= 1.0 && data.inefficiencyFactor < 1.3 && "Margine basso - Processi già efficienti (1.0-1.3x)"}
                  {data.inefficiencyFactor >= 1.3 && data.inefficiencyFactor < 1.6 && "Margine moderato - Buon potenziale di automazione (1.3-1.6x)"}
                  {data.inefficiencyFactor >= 1.6 && data.inefficiencyFactor <= 2.0 && "Margine ampio - Alto potenziale di risparmio (1.6-2.0x)"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Economics;
