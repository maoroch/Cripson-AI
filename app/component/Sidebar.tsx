"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Hash, TrendingUp, X, Menu, Sparkles, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  useEffect(() => {
    const closeOnOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#mobile-nav") && !target.closest("#burger")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Панель", icon: LayoutDashboard, href: "#dashboard", gradient: "from-blue-500 to-purple-500" },
    { id: "hashtag", label: "Хештеги", icon: Hash, href: "#hashtag", gradient: "from-purple-500 to-pink-500" },
    { id: "trends", label: "Тренды", icon: TrendingUp, href: "#trends", gradient: "from-pink-500 to-red-500" },
  ];

  return (
    <>
      {/* ===== BURGER BUTTON (mobile only) ===== */}
      <button
        id="burger"
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-5 left-5 z-50 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* ===== MOBILE OVERLAY ===== */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ===== MOBILE NAV ===== */}
      <nav
        id="mobile-nav"
        className={`fixed top-0 left-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 text-white p-6 z-40
        transition-transform duration-300 md:hidden shadow-2xl
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Critso</h2>
              <p className="text-xs text-gray-400">AI Platform</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

        {/* Menu Items */}
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={() => {
                    setActiveItem(item.id);
                    setOpen(false);
                  }}
                  className={`group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                      : 'hover:bg-white/5'
                    }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl" />
                  )}
                  
                  <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all
                    ${isActive 
                      ? 'bg-white/20 backdrop-blur' 
                      : `bg-gradient-to-br ${item.gradient} opacity-80 group-hover:opacity-100`
                    }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <span className="relative font-semibold text-white">{item.label}</span>
                  
                  {isActive && (
                    <ChevronRight className="relative ml-auto w-4 h-4 text-white" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Bottom Section */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-semibold mb-1">Pro версия</p>
                <p className="text-gray-400 text-xs">Разблокируйте все функции</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-70 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 text-white p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Cripson AI</h2>
            <p className="text-xs text-gray-400">Analytics Platform</p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

        {/* Menu Items */}
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={() => setActiveItem(item.id)}
                  className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-r ${item.gradient} shadow-xl` 
                      : 'hover:bg-white/5'
                    }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 rounded-2xl blur-2xl" />
                  )}
                  
                  <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all
                    ${isActive 
                      ? 'bg-white/20 backdrop-blur' 
                      : `bg-gradient-to-br ${item.gradient} opacity-80 group-hover:opacity-100 group-hover:scale-110`
                    }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <span className="relative font-semibold text-white text-lg">{item.label}</span>
                  
                  {isActive && (
                    <ChevronRight className="relative ml-auto w-5 h-5 text-white" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>


      </aside>
    </>
  );
}