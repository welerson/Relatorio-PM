import React from 'react';
import { Search, Filter, Calendar as CalendarIcon, X } from 'lucide-react';
import { FilterState, ServiceType } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalRecords: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, totalRecords }) => {
  
  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
        search: '',
        type: 'ALL',
        startDate: '',
        endDate: ''
    });
  };

  const hasActiveFilters = filters.search || filters.type !== 'ALL' || filters.startDate || filters.endDate;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center justify-between">
        
        {/* Search Input */}
        <div className="w-full lg:w-1/3 relative">
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Pesquisa Global</label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Nome, matrícula ou tipo..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                />
            </div>
        </div>

        {/* Filters Group */}
        <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Type Filter */}
            <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Tipo de Serviço</label>
                <select 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={filters.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                >
                    <option value="ALL">Todos os Tipos</option>
                    {Object.values(ServiceType).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Start Date */}
            <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Data Inicial</label>
                <input 
                    type="date"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600"
                    value={filters.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                />
            </div>

            {/* End Date */}
            <div>
                 <label className="text-xs font-semibold text-slate-500 mb-1 block">Data Final</label>
                <input 
                    type="date"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600"
                    value={filters.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                />
            </div>
        </div>

        {/* Clear Button */}
        {hasActiveFilters && (
            <button 
                onClick={clearFilters}
                className="hidden lg:flex items-center justify-center p-2 text-slate-400 hover:text-red-500 transition-colors ml-2"
                title="Limpar Filtros"
            >
                <X className="w-5 h-5" />
            </button>
        )}
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3" />
            <span>Filtros ativos: {hasActiveFilters ? 'Sim' : 'Não'}</span>
          </div>
          <span>Mostrando {totalRecords} registros consolidados</span>
      </div>
    </div>
  );
};

export default FilterBar;