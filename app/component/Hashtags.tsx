"use client";
import { Hash, TrendingUp, Instagram, Facebook, Music, Youtube } from "lucide-react";
import hashtagsData from "../data/hashtagsData.json";

// Маппинг иконок для платформ
const platformIcons: { [key: string]: any } = {
  "Instagram": Instagram,
  "Facebook": Facebook,
  "TikTok": Music,
  "YouTube": Youtube
};

export default function Hashtags() {
  return (
    <div id="hashtag" className="w-full bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
      {/* Заголовок */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Hash className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Популярные хештеги</h1>
          <p className="text-gray-400 text-sm">Топ тегов за неделю</p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

      {/* Карточки платформ */}
      <div className="grid md:grid-cols-2 gap-4">
        {hashtagsData.hashtags.map((item) => {
          const Icon = platformIcons[item.platform];
          return (
            <div
              key={item.platform}
              className={`group relative overflow-hidden bg-gradient-to-br ${item.bgGradient} backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 `}
            >
              {/* Декоративные элементы */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              
              <div className="relative">
                {/* Заголовок платформы */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-lg">{item.platform}</h3>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                </div>

                {/* Теги */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={tag}
                      className={`px-4 py-2 bg-gradient-to-r ${item.gradient} bg-opacity-20 backdrop-blur text-white rounded-full text-sm font-medium border border-white/10 hover:border-white/30 hover:shadow-lg transition-all duration-200 cursor-pointer `}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Счётчик тегов */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-gray-400 text-xs flex items-center gap-2">
                    <Hash className="w-3 h-3" />
                    {item.tags.length} трендовых тегов
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Дополнительная информация */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-white text-sm font-medium mb-1">Совет по хештегам</p>
            <p className="text-gray-400 text-xs">
              Используйте комбинацию популярных и нишевых хештегов для максимального охвата. 
              Оптимальное количество: 5-10 тегов на пост.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}