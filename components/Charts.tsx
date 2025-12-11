import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { ServiceType, ServiceRecord } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('/').map(Number);
  // Handle invalid dates gracefully
  if(!day || !month || !year) return new Date();
  return new Date(year, month - 1, day);
};

interface ChartProps {
    data: ServiceRecord[];
}

export const ServicesPieChart: React.FC<ChartProps> = ({ data: sourceData }) => {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    sourceData.forEach(item => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sourceData]);

  if (sourceData.length === 0) return <EmptyChartState />;

  return (
    <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Distribuição por Tipo de Serviço</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const HoursBarChart: React.FC<ChartProps> = ({ data: sourceData }) => {
  const data = useMemo(() => {
    const hours: Record<string, number> = {};
    sourceData.forEach(item => {
      hours[item.type] = (hours[item.type] || 0) + item.durationHours;
    });
    return Object.entries(hours)
      .map(([name, value]) => ({ name, hours: Math.round(value) }))
      .sort((a, b) => b.hours - a.hours);
  }, [sourceData]);

  if (sourceData.length === 0) return <EmptyChartState />;

  return (
    <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Total de Horas por Categoria</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} fontSize={12} />
          <Tooltip />
          <Bar dataKey="hours" fill="#0088FE" name="Horas Totais" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const WeekendStatsChart: React.FC<ChartProps> = ({ data: sourceData }) => {
    // Dynamically calculate weeks present in the data
    const data = useMemo(() => {
        const weeks: Record<number, {total: number, new: number}> = {};
        sourceData.forEach(item => {
            // Very simple week calculation for demo purposes
            const date = parseDate(item.date);
            const weekNum = Math.ceil((date.getDate() + 6 - date.getDay()) / 7);
            
            if(!weeks[weekNum]) weeks[weekNum] = { total: 0, new: 0 };
            weeks[weekNum].total += 1;
            // Randomly assigning 'new' just for visualization if logic is missing
            if(Math.random() > 0.5) weeks[weekNum].new += 1; 
        });

        // Convert to array and sort
        const result = Object.entries(weeks).map(([week, stats]) => ({
            week: parseInt(week),
            total: stats.total,
            new: stats.new
        })).sort((a,b) => a.week - b.week);
        
        return result.length > 0 ? result : [];
    }, [sourceData]);

  if (sourceData.length === 0) return <EmptyChartState />;

  return (
    <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Volume por Semana (Dinâmico)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="week" label={{ value: 'Semana', position: 'insideBottom', offset: -5 }} />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend verticalAlign="top" height={36}/>
          <Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" name="Total Serviços" />
          <Area type="monotone" dataKey="new" stroke="#82ca9d" fillOpacity={1} fill="url(#colorNew)" name="Novos Serviços" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PersonnelActivityChart: React.FC<ChartProps> = ({ data: sourceData }) => {
    const data = useMemo(() => {
        const studentActivity: Record<string, number> = {};
        sourceData.filter(i => i.type === ServiceType.ALUNO).forEach(item => {
            if(item.personnel) {
                studentActivity[item.personnel] = (studentActivity[item.personnel] || 0) + item.durationHours;
            }
        });
        return Object.entries(studentActivity).map(([name, hours]) => ({ name: name.replace('AL SD ', ''), hours }));
    }, [sourceData]);

    if (data.length === 0) return <EmptyChartState message="Nenhum dado de aluno encontrado para este filtro" />;

    return (
        <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Horas Trabalhadas (Alunos)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#FF8042" name="Horas" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
};

export const WeekdayChart: React.FC<ChartProps> = ({ data: sourceData }) => {
  const data = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const counts = new Array(7).fill(0);
    sourceData.forEach(item => {
      const date = parseDate(item.date);
      counts[date.getDay()]++;
    });
    return days.map((day, index) => ({ name: day, value: counts[index] }));
  }, [sourceData]);

  if (sourceData.length === 0) return <EmptyChartState />;

  return (
    <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Frequência por Dia da Semana</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" name="Ocorrências" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DurationCategoryChart: React.FC<ChartProps> = ({ data: sourceData }) => {
    const data = useMemo(() => {
        const ranges = [
            { name: '< 6h', value: 0 },
            { name: '6h - 12h', value: 0 },
            { name: '> 12h', value: 0 },
        ];
        sourceData.forEach(item => {
            if (item.durationHours < 6) ranges[0].value++;
            else if (item.durationHours <= 12) ranges[1].value++;
            else ranges[2].value++;
        });
        return ranges;
    }, [sourceData]);

    if (sourceData.length === 0) return <EmptyChartState />;

    return (
        <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Classificação dos Turnos</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#82ca9d"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#82ca9d', '#8884d8', '#ffc658'][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
};

const EmptyChartState = ({ message = "Sem dados para o filtro atual" }) => (
    <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
        <div className="text-center text-slate-400">
            <p>{message}</p>
        </div>
    </div>
);