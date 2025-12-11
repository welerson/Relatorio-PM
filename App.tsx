import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  FileText, 
  Download, 
  Clock, 
  Users, 
  ShieldCheck, 
  Activity,
  Plus
} from 'lucide-react';
import { MOCK_DATA } from './constants';
import { ServiceRecord, FilterState } from './types';
import StatCard from './components/StatCard';
import FilterBar from './components/FilterBar';
import FileUpload from './components/FileUpload';
import { 
  ServicesPieChart, 
  HoursBarChart, 
  WeekendStatsChart, 
  PersonnelActivityChart,
  WeekdayChart,
  DurationCategoryChart
} from './components/Charts';

const App: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  // State for Data
  const [allData, setAllData] = useState<ServiceRecord[]>(MOCK_DATA);
  const [filteredData, setFilteredData] = useState<ServiceRecord[]>(MOCK_DATA);

  // State for Filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'ALL',
    startDate: '',
    endDate: ''
  });

  // Handler for adding new data via "Upload"
  const handleDataImport = (newData: ServiceRecord[]) => {
    setAllData(prev => [...prev, ...newData]);
  };

  // Filter Logic
  useEffect(() => {
    let result = allData;

    // 1. Filter by Type
    if (filters.type !== 'ALL') {
        result = result.filter(item => item.type === filters.type);
    }

    // 2. Filter by Search Term (Personnel name or Generic search)
    if (filters.search) {
        const lowerSearch = filters.search.toLowerCase();
        result = result.filter(item => 
            (item.personnel?.toLowerCase().includes(lowerSearch) || 
             item.type.toLowerCase().includes(lowerSearch))
        );
    }

    // 3. Filter by Date Range (Naive implementation assuming DD/MM/YYYY format)
    if (filters.startDate) {
        const start = new Date(filters.startDate);
        result = result.filter(item => {
            const [d, m, y] = item.date.split('/').map(Number);
            return new Date(y, m-1, d) >= start;
        });
    }

    if (filters.endDate) {
        const end = new Date(filters.endDate);
        result = result.filter(item => {
            const [d, m, y] = item.date.split('/').map(Number);
            return new Date(y, m-1, d) <= end;
        });
    }

    setFilteredData(result);
  }, [filters, allData]);


  // Summary Statistics based on Filtered Data
  const stats = useMemo(() => {
      return {
          totalHours: filteredData.reduce((acc, curr) => acc + curr.durationHours, 0),
          totalServices: filteredData.length,
          uniquePersonnel: new Set(filteredData.filter(d => d.personnel && d.personnel !== 'GENERICO').map(d => d.personnel)).size,
          sentinelHours: filteredData.filter(d => d.type === 'Sentinela').reduce((acc, curr) => acc + curr.durationHours, 0)
      };
  }, [filteredData]);

  const handleDownloadPDF = useCallback(async () => {
    setIsExporting(true);
    const element = document.getElementById('dashboard-content');
    if (!element) return;

    // Temporarily hide filter controls for the PDF if desired, or keep them to show context
    // For this implementation, we capture everything in 'dashboard-content'
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        logging: false,
        windowWidth: 1600, 
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById('dashboard-content');
            if (clonedElement) {
                clonedElement.style.padding = '40px'; 
                clonedElement.style.height = 'auto';
            }
            // Optional: Hide the upload button in PDF
            const uploadSection = clonedDoc.getElementById('upload-section');
            if(uploadSection) uploadSection.style.display = 'none';
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      let heightLeft = scaledHeight;
      let position = 0;
      let page = 0;

      while (heightLeft > 0) {
        if (page > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, scaledHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight; 
        page++;
      }

      pdf.save('relatorio-operacional-customizado.pdf');
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-md">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Relatório Operacional</h1>
            <p className="text-xs text-slate-500">Painel de Controle Integrado</p>
          </div>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold shadow-md transition-all transform active:scale-95 ${
            isExporting 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
          }`}
        >
          {isExporting ? (
            <Activity className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isExporting ? 'Processando...' : 'Baixar Relatório'}
        </button>
      </nav>

      {/* Main Content Area */}
      <main id="dashboard-content" className="flex-1 p-8 max-w-[1600px] mx-auto w-full bg-slate-50">
        
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Análise de Dados</h2>
                <p className="text-slate-600 mt-1">Consolidação e Cruzamento de Informações</p>
            </div>
             <div id="upload-section" className="flex items-center gap-2">
                 <FileUpload onDataLoaded={handleDataImport} />
            </div>
        </div>

        {/* Filter Bar */}
        <FilterBar 
            filters={filters} 
            setFilters={setFilters} 
            totalRecords={filteredData.length} 
        />

        {/* KPI Grid (Dynamic) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total de Horas (Filtro)" 
            value={stats.totalHours.toFixed(1)} 
            icon={Clock} 
            color="text-blue-600 bg-blue-100" 
            subtext="Baseado na seleção atual"
          />
          <StatCard 
            title="Registros Encontrados" 
            value={stats.totalServices} 
            icon={FileText} 
            color="text-emerald-600 bg-emerald-100"
            subtext={`De um total de ${allData.length}`}
          />
          <StatCard 
            title="Efetivo Aluno" 
            value={stats.uniquePersonnel} 
            icon={Users} 
            color="text-indigo-600 bg-indigo-100"
            subtext="Pessoal distinto filtrado"
          />
           <StatCard 
            title="Horas Sentinela" 
            value={stats.sentinelHours.toFixed(1)} 
            icon={ShieldCheck} 
            color="text-amber-600 bg-amber-100"
            subtext="Segurança filtrada"
          />
        </div>

        {/* Section Title */}
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            Visualização Gráfica Dinâmica
        </h3>

        {/* Charts Grid - Passing filteredData */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <ServicesPieChart data={filteredData} />
          <HoursBarChart data={filteredData} />
          <WeekdayChart data={filteredData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <WeekendStatsChart data={filteredData} />
          <PersonnelActivityChart data={filteredData} />
          <DurationCategoryChart data={filteredData} />
        </div>

        {/* Detailed Table */}
        <div className="break-before-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Tabela de Dados Cruzados</h3>
                <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
                    {filteredData.length} registros visíveis
                </span>
            </div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold sticky top-0">
                        <tr>
                            <th className="px-6 py-3">Data</th>
                            <th className="px-6 py-3">Tipo</th>
                            <th className="px-6 py-3">Horário</th>
                            <th className="px-6 py-3">Responsável</th>
                            <th className="px-6 py-3 text-right">Duração</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredData.length > 0 ? (
                            filteredData.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-slate-900">{record.date}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border
                                            ${record.type === 'Sentinela' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                            record.type === 'Escala Alunos' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-slate-50 text-slate-700 border-slate-200'}`}>
                                            {record.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-slate-500">{record.startTime} - {record.endTime}</td>
                                    <td className="px-6 py-3 font-medium">{record.personnel || '-'}</td>
                                    <td className="px-6 py-3 text-right font-mono font-bold text-slate-700">{record.durationHours}h</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                    Nenhum registro encontrado para os filtros selecionados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-300 text-center text-xs text-slate-500 flex justify-between items-center">
            <span>Confidencial - Uso Interno</span>
            <span>Sistema de Dashboard Operacional v3.0</span>
        </div>
      </main>
    </div>
  );
};

export default App;