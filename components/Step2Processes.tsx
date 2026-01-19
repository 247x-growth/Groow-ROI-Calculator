import React, { useState, useEffect } from 'react';
import { DepartmentState, SelectedProcess } from '../types';
import { DEPARTMENTS } from '../constants';
import * as Icons from 'lucide-react';

interface Props {
  data: Record<string, DepartmentState>;
  onChange: (data: Record<string, DepartmentState>) => void;
}

const Step3Processes: React.FC<Props> = ({ data, onChange }) => {
  // Only get departments that were selected in the previous step
  // Ensure data exists and handle potential undefined
  const activeDepartments = DEPARTMENTS.filter(d => data[d.id]?.isSelected);
  
  // Default open the first active department
  const [openDept, setOpenDept] = useState<string | null>(activeDepartments.length > 0 ? activeDepartments[0].id : null);

  const toggleDept = (id: string) => {
    setOpenDept(openDept === id ? null : id);
  };

  const handleStaffChange = (deptId: string, count: number) => {
    const newData = { ...data };
    if (newData[deptId]) {
        newData[deptId] = { ...newData[deptId], staffCount: Math.max(1, count) };
        onChange(newData);
    }
  };

  const toggleProcess = (deptId: string, processId: string) => {
    const newData = { ...data };
    if (newData[deptId] && newData[deptId].processes[processId]) {
        const current = newData[deptId].processes[processId];
        newData[deptId].processes[processId] = {
            ...current,
            isSelected: !current.isSelected
        };
        onChange(newData);
    }
  };

  const toggleCustomProcess = (deptId: string) => {
      const newData = { ...data };
      if (newData[deptId]) {
          const current = newData[deptId].customProcess;
          newData[deptId] = {
              ...newData[deptId],
              customProcess: {
                  ...current,
                  isSelected: !current.isSelected
              }
          };
          onChange(newData);
      }
  };

  const updateCustomProcessName = (deptId: string, name: string) => {
      const newData = { ...data };
      if (newData[deptId]) {
           newData[deptId] = {
              ...newData[deptId],
              customProcess: {
                  ...newData[deptId].customProcess,
                  name: name
              }
          };
          onChange(newData);
      }
  };

  if (activeDepartments.length === 0) {
      return (
          <div className="text-center p-10">
              <p className="text-gray-400">Nessun reparto selezionato. Torna indietro e seleziona almeno un reparto.</p>
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-sans text-white mb-2">Attività Manuali</h2>
        <p className="text-gray-400">Per i reparti selezionati, spunta le attività che svolgete manualmente.</p>
      </div>

      <div className="space-y-4">
        {activeDepartments.map((dept) => {
          const Icon = (Icons as any)[dept.icon] || Icons.Circle;
          const isOpen = openDept === dept.id;
          const deptState = data[dept.id];
          const activeCount = Object.values(deptState.processes).filter((p: SelectedProcess) => p.isSelected).length + (deptState.customProcess?.isSelected ? 1 : 0);

          return (
            <div key={dept.id} className={`border rounded-xl transition-all duration-300 overflow-hidden ${isOpen ? 'border-primary/50 bg-bg-card' : 'border-white/10 hover:border-white/20 bg-bg-card/50'}`}>
              
              {/* Header */}
              <button 
                onClick={() => toggleDept(dept.id)}
                className="w-full p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isOpen ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'}`}>
                        <Icon size={24} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-lg text-white">{dept.name}</h3>
                        <p className="text-xs text-gray-400">{activeCount} attività selezionate</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {!isOpen && (
                         <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Icons.Users size={14} /> {deptState.staffCount}
                         </div>
                    )}
                    <Icons.ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-gray-500'}`} />
                </div>
              </button>

              {/* Body */}
              {isOpen && (
                <div className="p-5 pt-0 border-t border-white/5">
                    {/* Staff Input */}
                    <div className="py-4 flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <Icons.Users size={16} className="text-accent" />
                            Numero persone nel reparto:
                        </label>
                        <div className="flex items-center gap-3 bg-bg-dark rounded-lg p-1 border border-white/10">
                            <button 
                                onClick={() => handleStaffChange(dept.id, deptState.staffCount - 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded"
                            >-</button>
                            <span className="font-mono font-bold w-8 text-center">{deptState.staffCount}</span>
                            <button 
                                onClick={() => handleStaffChange(dept.id, deptState.staffCount + 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded"
                            >+</button>
                        </div>
                    </div>

                    {/* Processes List (Checkbox Only) */}
                    <div className="grid sm:grid-cols-2 gap-3 mt-2">
                        {dept.processes.map(proc => {
                            const procState = deptState.processes[proc.id];
                            return (
                                <button 
                                    key={proc.id} 
                                    onClick={() => toggleProcess(dept.id, proc.id)}
                                    className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 hover:bg-white/5 ${procState.isSelected ? 'bg-primary/10 border-primary/40' : 'bg-transparent border-transparent'}`}
                                >
                                    <div className={`mt-0.5 min-w-[20px] h-5 w-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${procState.isSelected ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                                        {procState.isSelected && <Icons.Check size={14} className="text-white" />}
                                    </div>
                                    <div>
                                        <span className={`text-sm block ${procState.isSelected ? 'text-white font-medium' : 'text-gray-400'}`}>
                                            {proc.name}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                        
                        {/* Custom Process Option */}
                         <div className={`p-3 rounded-lg border text-left transition-all hover:bg-white/5 ${deptState.customProcess?.isSelected ? 'bg-primary/10 border-primary/40' : 'bg-transparent border-transparent'}`}>
                             <button 
                                onClick={() => toggleCustomProcess(dept.id)}
                                className="flex items-start gap-3 w-full"
                             >
                                <div className={`mt-0.5 min-w-[20px] h-5 w-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${deptState.customProcess?.isSelected ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                                    {deptState.customProcess?.isSelected && <Icons.Check size={14} className="text-white" />}
                                </div>
                                <span className={`text-sm block ${deptState.customProcess?.isSelected ? 'text-white font-medium' : 'text-gray-400'}`}>
                                    Altro / Attività personalizzata
                                </span>
                             </button>
                             
                             {deptState.customProcess?.isSelected && (
                                 <div className="mt-3 ml-8">
                                     <input 
                                        type="text" 
                                        placeholder="Descrivi l'attività..."
                                        value={deptState.customProcess.name}
                                        onChange={(e) => updateCustomProcessName(dept.id, e.target.value)}
                                        className="w-full bg-bg-dark border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none placeholder-gray-600"
                                        autoFocus
                                     />
                                 </div>
                             )}
                         </div>

                    </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Step3Processes;