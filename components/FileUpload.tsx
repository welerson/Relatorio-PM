import React, { useRef, useState } from 'react';
import { Upload, FileUp, CheckCircle, AlertCircle } from 'lucide-react';
import { ServiceRecord, ServiceType } from '../types';

interface FileUploadProps {
  onDataLoaded: (newData: ServiceRecord[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus('processing');

    // Simulate file processing delay and parsing
    setTimeout(() => {
      try {
        // In a real app, we would parse CSV/PDF here.
        // For this demo, we generate realistic mock data to simulate an appended file.
        const newRecords: ServiceRecord[] = Array.from({ length: 5 }).map((_, i) => ({
            id: `imported-${Date.now()}-${i}`,
            type: Object.values(ServiceType)[Math.floor(Math.random() * Object.values(ServiceType).length)],
            date: new Date().toLocaleDateString('pt-BR'),
            startTime: '08:00',
            endTime: '18:00',
            durationHours: 10,
            personnel: `IMPORTADO VIA ARQUIVO ${i + 1}`
        }));

        onDataLoaded(newRecords);
        setStatus('success');
        
        // Reset status after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
      } catch (e) {
        setStatus('error');
      }
    }, 1500);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
      <input 
        type="file" 
        accept=".csv,.pdf,.xlsx" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />
      
      {status === 'idle' && (
        <div 
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer w-full flex flex-col items-center"
        >
            <div className="bg-indigo-50 p-3 rounded-full mb-2">
                <Upload className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">Importar Dados</p>
            <p className="text-xs text-slate-400">PDF, Excel ou CSV</p>
        </div>
      )}

      {status === 'processing' && (
        <div className="flex flex-col items-center">
             <ActivityIcon />
             <p className="text-xs text-slate-500 mt-2">Processando arquivo...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center">
            <CheckCircle className="w-8 h-8 text-emerald-500 mb-1" />
            <p className="text-xs text-emerald-600 font-medium">Dados Consolidados!</p>
        </div>
      )}
    </div>
  );
};

const ActivityIcon = () => (
    <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default FileUpload;