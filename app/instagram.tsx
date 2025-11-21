"use client";
import { useState, useEffect } from "react";
import { Lightbulb, TrendingUp, MousePointerClick, Eye, DollarSign, Target, BarChart3 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

// Данные из JSON
const platformData = {
  id: "instagram",
  name: "Instagram",
  summary: {
    impressions: 120430,
    clicks: 12400,
    ctr: 10.29,
    cpc: 0.12,
    spent: 1480,
    conversions: 480,
    cpa: 3.08,
    revenue: 5200,
    roi: 251.3
  }
};

// Данные для графиков по дням
const weeklyData = [
  { name: "Пн", impressions: 18000, clicks: 1800, conversions: 70, spent: 220 },
  { name: "Вт", impressions: 22000, clicks: 2300, conversions: 85, spent: 280 },
  { name: "Ср", impressions: 25000, clicks: 2600, conversions: 95, spent: 310 },
  { name: "Чт", impressions: 28000, clicks: 2900, conversions: 110, spent: 350 },
  { name: "Пт", impressions: 27430, clicks: 2800, conversions: 120, spent: 320 }
];

const performanceData = [
  { name: "Показы", value: platformData.summary.impressions, color: "#8b5cf6" },
  { name: "Клики", value: platformData.summary.clicks, color: "#3b82f6" },
  { name: "Конверсии", value: platformData.summary.conversions, color: "#10b981" }
];

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981"];

export default function AnalyticsDashboard() {
  const { summary } = platformData;

  const stats = [
    { label: "Показы", value: summary.impressions.toLocaleString(), icon: Eye, color: "bg-purple-500" },
    { label: "Клики", value: summary.clicks.toLocaleString(), icon: MousePointerClick, color: "bg-blue-500" },
    { label: "CTR", value: `${summary.ctr}%`, icon: TrendingUp, color: "bg-green-500" },
    { label: "Расходы", value: `$${summary.spent}`, icon: DollarSign, color: "bg-orange-500" },
    { label: "Конверсии", value: summary.conversions, icon: Target, color: "bg-pink-500" },
    { label: "ROI", value: `${summary.roi}%`, icon: BarChart3, color: "bg-emerald-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Аналитика {platformData.name}
          </h1>
          <p className="text-gray-300">Обзор эффективности рекламной кампании</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-300 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Графики */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* График кликов и показов */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Показы и клики по дням</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff30', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="impressions" stroke="#8b5cf6" strokeWidth={3} name="Показы" />
                <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={3} name="Клики" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* График конверсий */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Конверсии и расходы</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff30', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="conversions" fill="#10b981" name="Конверсии" />
                <Bar dataKey="spent" fill="#f59e0b" name="Расходы ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Круговая диаграмма и метрики */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Распределение</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff30', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Детальные метрики</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-gray-300 text-sm mb-2">Стоимость клика (CPC)</p>
                <p className="text-3xl font-bold text-blue-400">${summary.cpc}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-gray-300 text-sm mb-2">Стоимость конверсии (CPA)</p>
                <p className="text-3xl font-bold text-green-400">${summary.cpa}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-gray-300 text-sm mb-2">Выручка</p>
                <p className="text-3xl font-bold text-purple-400">${summary.revenue.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-gray-300 text-sm mb-2">Возврат инвестиций (ROI)</p>
                <p className="text-3xl font-bold text-emerald-400">{summary.roi}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Рекомендации */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Анализ ИИ</h3>
          </div>
          <div className="space-y-3 text-gray-200">
            <p className="text-lg">
              🎯 <strong>Отличные результаты!</strong> Ваш ROI составляет {summary.roi}%, что значительно выше среднего по рынку.
            </p>
            <p>
              📊 CTR {summary.ctr}% показывает высокую релевантность объявлений вашей аудитории.
            </p>
            <p>
              💡 <strong>Рекомендация:</strong> Увеличьте бюджет на 20-30% для масштабирования успешной кампании. Текущий CPA ${summary.cpa} позволяет это сделать с сохранением прибыльности.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}