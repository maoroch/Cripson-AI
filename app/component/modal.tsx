"use client";
import { useState, useEffect } from "react";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Legend, Area, ComposedChart
} from "recharts";
import { 
  Lightbulb, TrendingUp, Users, MousePointer, 
  DollarSign, Target, Zap, X 
} from "lucide-react";
import data from "../data/ads.json";

type ModalProps = {
  id: string;
};

// Цветовая палитра
const COLORS = {
  primary: "#8884d8",
  secondary: "#82ca9d",
  accent: "#ff8042",
  instagram: "#E1306C",
  facebook: "#1877F2",
  google: "#4285F4",
  twitter: "#1DA1F2"
};

const chartData = [
  { name: "Пн", impressions: 12000, clicks: 1200, conversions: 48, revenue: 520 },
  { name: "Вт", impressions: 18000, clicks: 1800, conversions: 72, revenue: 780 },
  { name: "Ср", impressions: 22000, clicks: 2400, conversions: 96, revenue: 1040 },
  { name: "Чт", impressions: 25000, clicks: 2800, conversions: 112, revenue: 1210 },
  { name: "Пт", impressions: 30000, clicks: 3200, conversions: 128, revenue: 1380 },
  { name: "Сб", impressions: 28000, clicks: 2600, conversions: 104, revenue: 1120 },
  { name: "Вс", impressions: 20000, clicks: 2000, conversions: 80, revenue: 860 },
];

const platformData = [
  { name: "Instagram", value: 45, color: COLORS.instagram },
  { name: "Facebook", value: 30, color: COLORS.facebook },
  { name: "Google", value: 15, color: COLORS.google },
  { name: "Twitter", value: 10, color: COLORS.twitter },
];

const aiTips = [
  {
    id: 1,
    title: "Рекомендация ИИ",
    text: "CTR вырос на 15% за неделю. Рекомендуем увеличить бюджет на Instagram кампании",
    icon: TrendingUp,
    color: "text-green-400"
  },
  {
    id: 2,
    title: "Оптимизация",
    text: "Конверсия выше в вечернее время. Сместите показы на 18:00-22:00",
    icon: Target,
    color: "text-blue-400"
  }
];

// Компонент метрики
const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

export default function Modal({ id }: ModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail === id) setOpen(true);
    };
    window.addEventListener("open-modal", handler as EventListener);
    return () => {
      window.removeEventListener("open-modal", handler as EventListener);
    };
  }, [id]);

  if (!open) return null;

  const platform = data.platforms.find(p => p.id === id);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 p-4 z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl max-w-6xl w-full border border-white/10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Детальная аналитика
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {platform ? (
          <div className="space-y-8">
            {/* Основные метрики */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Показы"
                value={platform.summary.impressions.toLocaleString()}
                change={12.5}
                icon={Users}
                color="text-blue-400"
              />
              <MetricCard
                title="Клики"
                value={platform.summary.clicks.toLocaleString()}
                change={8.3}
                icon={MousePointer}
                color="text-green-400"
              />
              <MetricCard
                title="Конверсии"
                value={platform.summary.conversions}
                change={15.2}
                icon={Target}
                color="text-purple-400"
              />
              <MetricCard
                title="Доход"
                value={`$${platform.summary.revenue}`}
                change={22.1}
                icon={DollarSign}
                color="text-yellow-400"
              />
            </div>

            {/* Графики */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Основной тренд */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-6">Эффективность за неделю</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '12px'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="impressions" 
                      fill={COLORS.primary}
                      fillOpacity={0.3}
                      stroke={COLORS.primary}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke={COLORS.secondary}
                      strokeWidth={3}
                      dot={{ fill: COLORS.secondary, strokeWidth: 2 }}
                    />
                    <Bar 
                      dataKey="conversions" 
                      fill={COLORS.accent}
                      radius={[4, 4, 0, 0]}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Распределение по платформам */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-6">Распределение трафика</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '12px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Дополнительные метрики */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <h4 className="font-semibold">CTR</h4>
                </div>
                <p className="text-2xl font-bold text-purple-400">{platform.summary.ctr}%</p>
                <p className="text-sm text-gray-400 mt-1">Эффективность кликов</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl p-6 border border-green-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h4 className="font-semibold">ROI</h4>
                </div>
                <p className="text-2xl font-bold text-green-400">{platform.summary.roi}%</p>
                <p className="text-sm text-gray-400 mt-1">Окупаемость инвестиций</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <h4 className="font-semibold">Расходы</h4>
                </div>
                <p className="text-2xl font-bold text-yellow-400">${platform.summary.spent}</p>
                <p className="text-sm text-gray-400 mt-1">Общий бюджет</p>
              </div>
            </div>

            {/* Рекомендации ИИ */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Рекомендации ИИ</h3>
              {aiTips.map((tip) => (
                <div key={tip.id} className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                      <tip.icon className={`w-6 h-6 ${tip.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{tip.title}</h4>
                      <p className="text-gray-300 mt-1">{tip.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Данные не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function openModal(id: string) {
  window.dispatchEvent(new CustomEvent("open-modal", { detail: id }));
}