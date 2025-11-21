"use client";
import { useState, useEffect } from "react";
import { Instagram, Facebook, Music, Youtube, Search, TrendingUp, Users, DollarSign, X } from "lucide-react";
import platformsData from "../data/platformsData.json";

// Маппинг иконок для платформ
const platformIcons: { [key: string]: any } = {
  "instagram": Instagram,
  "facebook": Facebook,
  "tiktok": Music,
  "google": Search,
  "youtube": Youtube
};

type PlatformData = {
  id: string;
  name: string;
  gradient: string;
  stats: {
    impressions: number;
    clicks: number;
    ctr: number;
    spent: number;
    conversions: number;
    roi: number;
  };
};

type PlatformsData = {
  [key: string]: PlatformData;
};

type ModalProps = {
  platformId: string | null;
  onClose: () => void;
};

function Modal({ platformId, onClose }: ModalProps) {
  if (!platformId) return null;

  const platformData = platformsData.platforms as PlatformsData;
  const platform = platformData[platformId];

  if (!platform) return null;

  const Icon = platformIcons[platform.id];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 z-50 animate-in fade-in duration-300">
      <div className={`bg-gradient-to-br ${platform.gradient} rounded-3xl p-1 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300`}>
        <div className="bg-slate-900 rounded-3xl p-6">
          {/* Заголовок */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${platform.gradient} rounded-2xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">{platform.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <p className="text-gray-400 text-sm">Показы</p>
              </div>
              <p className="text-2xl font-bold text-white">{platform.stats.impressions.toLocaleString()}</p>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <p className="text-gray-400 text-sm">Клики</p>
              </div>
              <p className="text-2xl font-bold text-white">{platform.stats.clicks.toLocaleString()}</p>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <p className="text-gray-400 text-sm">Расходы</p>
              </div>
              <p className="text-2xl font-bold text-white">${platform.stats.spent}</p>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <p className="text-gray-400 text-sm">ROI</p>
              </div>
              <p className="text-2xl font-bold text-white">{platform.stats.roi}%</p>
            </div>
          </div>

          {/* Дополнительные метрики */}
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">CTR</span>
              <span className="text-white font-bold">{platform.stats.ctr}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Конверсии</span>
              <span className="text-white font-bold">{platform.stats.conversions}</span>
            </div>
          </div>

          <button
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/20"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cards() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const platformData = platformsData.platforms as PlatformsData;

  const platforms = Object.keys(platformData).map(key => ({
    id: key,
    data: platformData[key]
  }));

  return (
    <div className="w-full">
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Рекламные платформы</h1>
        <p className="text-gray-400">Нажмите на карточку для просмотра детальной статистики</p>
      </div>

      {/* Карточки */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Instagram, Facebook, TikTok */}
        {platforms.slice(0, 3).map((platform) => {
          const Icon = platformIcons[platform.id];
          return (
            <div
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`group relative overflow-hidden cursor-pointer h-44 rounded-3xl bg-gradient-to-br ${platform.data.gradient} shadow-xl hover:shadow-2xl transition-all duration-300 `}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              
              {/* Декоративные элементы */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              
              <div className="relative h-full flex flex-col items-center justify-center p-6 text-white">
                <Icon className="w-12 h-12 mb-3 drop-shadow-lg" />
                <h3 className="text-2xl font-bold mb-2">{platform.data.name}</h3>
                <div className="flex gap-4 text-sm">
                  <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                    CTR: {platform.data.stats.ctr}%
                  </span>
                  <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                    ROI: {platform.data.stats.roi}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Google и YouTube на всю ширину */}
        {platforms.slice(3).map((platform) => {
          const Icon = platformIcons[platform.id];
          return (
            <div
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`group relative overflow-hidden cursor-pointer h-44 rounded-3xl bg-gradient-to-br ${platform.data.gradient} shadow-xl hover:shadow-2xl transition-all duration-300  md:col-span-1 lg:col-span-1`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              
              {/* Декоративные элементы */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              
              <div className="relative h-full flex flex-col items-center justify-center p-6 text-white">
                <Icon className="w-12 h-12 mb-3 drop-shadow-lg" />
                <h3 className="text-2xl font-bold mb-2">{platform.data.name}</h3>
                <div className="flex gap-4 text-sm">
                  <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                    CTR: {platform.data.stats.ctr}%
                  </span>
                  <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                    ROI: {platform.data.stats.roi}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Модальное окно */}
      <Modal platformId={selectedPlatform} onClose={() => setSelectedPlatform(null)} />
    </div>
  );
}