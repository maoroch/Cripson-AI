"use client";
import { Lightbulb, TrendingUp, BarChart3, Sparkles, Loader2 } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import chartData from "../data/data.json";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-lg border border-white/20 rounded-xl p-3 shadow-xl">
        <p className="text-white font-semibold mb-1">{label}</p>
        <p className="text-purple-400 text-sm">
          Значение: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function LineChartDemo() {
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  // Функция для анализа данных через GROQ AI
  const analyzeChartData = async () => {
    setIsAnalyzing(true);
    setAnalysisError("");
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'charts',
          chartData: chartData.chartData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }

      const result = await response.json();
      setAiAnalysis(result.analysis);
    } catch (err) {
      setAnalysisError('Ошибка при анализе данных');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Автоматически запускаем анализ при загрузке компонента
  useEffect(() => {
    analyzeChartData();
  }, []);

  // Функция для получения краткого анализа данных
  const getQuickStats = () => {
    const stats = {
      totalGrowth: 0,
      maxValue: 0,
      trends: [] as string[]
    };

    chartData.chartData.forEach(chart => {
      const values = chart.data.map((d: any) => d.value);
      const max = Math.max(...values);
      const min = Math.min(...values);
      const growth = ((max - min) / min * 100).toFixed(1);
      
      stats.totalGrowth += parseFloat(growth);
      stats.maxValue = Math.max(stats.maxValue, max);
      
      if (parseFloat(growth) > 20) {
        stats.trends.push(`📈 ${chart.name} показал рост ${growth}%`);
      } else if (parseFloat(growth) < 0) {
        stats.trends.push(`📉 ${chart.name} снизился на ${Math.abs(parseFloat(growth))}%`);
      }
    });

    return stats;
  };

  const quickStats = getQuickStats();

  return (
    <div id="trends" className="w-full bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
      {/* Заголовок */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Аналитика</h1>
          <p className="text-gray-400 text-sm">Сравнение роста за разные периоды</p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

      {/* Диаграммы */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {chartData.chartData.map((chart, index) => (
          <div 
            key={index}
            className={`group relative overflow-hidden bg-gradient-to-br ${chart.gradient.join(" ")} backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300`}
          >
            {/* Декоративные элементы */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            
            <div className="relative">
              {/* Заголовок графика */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 bg-gradient-to-br ${chart.iconGradient.join(" ")} rounded-lg flex items-center justify-center`}>
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{chart.name}</h3>
                    <p className="text-gray-400 text-xs">Период: {chart.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full">
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse" 
                    style={{ 
                      backgroundColor: chart.color === '#8884d8' ? '#60a5fa' : '#34d399' 
                    }}
                  />
                  <span className="text-xs text-gray-300">Активна</span>
                </div>
              </div>

              {/* График */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chart.data}>
                    <defs>
                      <linearGradient id={`colorValue${index + 1}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chart.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chart.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={chart.color} 
                      strokeWidth={3}
                      dot={{ fill: chart.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: chart.color }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Статистика */}
              <div className="mt-4 flex justify-between text-sm">
                <div>
                  <p className="text-gray-400">Максимум</p>
                  <p className="text-white font-bold">{chart.stats.max}</p>
                </div>
                <div>
                  <p className="text-gray-400">Среднее</p>
                  <p className="text-white font-bold">{chart.stats.average}</p>
                </div>
                <div>
                  <p className="text-gray-400">Рост</p>
                  <p className="text-green-400 font-bold">{chart.stats.growth}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Analysis */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-5 border border-yellow-500/20">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            {isAnalyzing ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Sparkles className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold text-lg">AI Анализ</h3>
              <button
                onClick={analyzeChartData}
                disabled={isAnalyzing}
                className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 disabled:opacity-50 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs font-medium transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                {isAnalyzing ? 'Анализ...' : 'Обновить'}
              </button>
            </div>

            {analysisError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-3">
                <p className="text-red-400 text-sm">{analysisError}</p>
              </div>
            )}

            {isAnalyzing ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm">AI анализирует данные...</p>
                </div>
                <div className="text-xs text-gray-400">
                  Анализируем тренды: {quickStats.trends.slice(0, 2).join(', ')}
                </div>
              </div>
            ) : aiAnalysis ? (
              <div>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  {aiAnalysis}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {quickStats.trends.slice(0, 3).map((trend, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-400 border border-white/10"
                    >
                      {trend}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm">Пока данных нет</p>
                <p className="text-gray-500 text-xs mt-1">
                  Нажмите "Обновить" для получения AI-анализа
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}