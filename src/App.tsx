import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, ChevronDown, Shield, Briefcase, User,
  LayoutDashboard, Users, BarChart3,
  Package, CircleUser, ClipboardList, Wallet,
  Settings, LogOut, Bell, Menu, Activity, Zap, Target,
  FileText, ChevronRight, Clock, CheckCircle2, Lock, DollarSign,
  Award, ListFilter, Search, X, TrendingUp, TrendingDown, Sparkles, LayoutGrid
} from 'lucide-react';
import { AdminDashboard, BrandManagement, CampaignManagement, KOLManagement, ProductManagement, PaymentMonitoring, WorkHistory, SystemRanking, ReportCenter, PerformanceCenter, PaymentProcessing, PaymentHold, PaymentPaid } from './views/admin/AdminPanel';
import { BrandDashboard } from './views/brand/BrandDashboard';
import { KOLDashboard } from './views/kol/KOLPortal';
import type { Role } from './data/mockData';

// ─── ROLE CONFIGURATION ─────────────────────────────────────────────────
const roleConfig: Record<Role, {
  label: string;
  icon: typeof Shield;
  gradient: string;
  accent: string;
  badge: string;
  glowClass: string;
}> = {
  admin: {
    label: 'Quản trị viên',
    icon: Shield,
    gradient: 'from-red-500 to-rose-600',
    accent: 'text-red-500',
    badge: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800/50',
    glowClass: 'shadow-red-500/20',
  },
  brand: {
    label: 'Brand Dashboard',
    icon: Briefcase,
    gradient: 'from-brand-400 to-brand-600',
    accent: 'text-brand-500',
    badge: 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 border-brand-200 dark:border-brand-800/50',
    glowClass: 'shadow-brand-500/20',
  },
  kol: {
    label: 'KOL / KOC Portal',
    icon: User,
    gradient: 'from-blue-400 to-indigo-600',
    accent: 'text-blue-500',
    badge: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
    glowClass: 'shadow-blue-500/20',
  },
};

// ─── SIDEBAR CONFIG ─────────────────────────────────────────────────────
const sidebarItems: Record<Role, {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  children?: { id: string; label: string; icon: typeof ListFilter }[];
  isHeader?: boolean;
}[]> = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'business-header', label: 'Business', icon: Briefcase, isHeader: true },
    { id: 'brands', label: 'Brands', icon: Briefcase, children: [{ id: 'brands', label: 'Danh sách Brand', icon: ListFilter }] },
    { id: 'products', label: 'Products', icon: Package, children: [{ id: 'products', label: 'Danh sách sản phẩm', icon: ListFilter }] },
    { id: 'campaigns', label: 'Campaigns', icon: Target, children: [{ id: 'campaigns', label: 'Danh sách chiến dịch', icon: ListFilter }] },
    { id: 'creators-header', label: 'Creators', icon: Users, isHeader: true },
    { id: 'kolmanagement', label: 'KOL / KOC', icon: Users, children: [{ id: 'kolmanagement', label: 'Danh sách KOL/KOC', icon: ListFilter }] },
    { id: 'rankings', label: 'Rankings', icon: Award, children: [{ id: 'ranking', label: 'Xếp hạng', icon: Award }] },
    { id: 'finance-header', label: 'Finance', icon: Wallet, isHeader: true },
    { id: 'payments', label: 'Payments', icon: Wallet, children: [
      { id: 'payments', label: 'Danh sách thanh toán', icon: ListFilter },
      { id: 'payments-processing', label: 'Xử lý thanh toán', icon: DollarSign },
      { id: 'payments-paid', label: 'Đã thanh toán', icon: CheckCircle2 },
      { id: 'payments-hold', label: 'Tạm giữ', icon: Lock },
    ]},
    { id: 'analytics-header', label: 'Analytics', icon: BarChart3, isHeader: true },
    { id: 'performance', label: 'Performance', icon: Activity, children: [{ id: 'performance', label: 'Tổng quan', icon: BarChart3 }] },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'audit-header', label: 'Audit', icon: Clock, isHeader: true },
    { id: 'history', label: 'Activity Logs', icon: Clock },
  ],
  brand: [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'products', label: 'Sản phẩm', icon: Package },
    { id: 'campaigns', label: 'Chiến dịch', icon: Target },
    { id: 'kol', label: 'KOL / KOC', icon: Users },
    { id: 'tasks', label: 'Nhiệm vụ', icon: ClipboardList },
    { id: 'content', label: 'Phê duyệt nội dung', icon: Activity },
    { id: 'performance', label: 'Theo dõi hiệu suất', icon: Activity },
    { id: 'payment', label: 'Thanh toán', icon: Wallet },
  ],
  kol: [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'profile', label: 'Hồ sơ & Thông tin', icon: CircleUser },
    { id: 'tasks', label: 'Nhiệm vụ', icon: ClipboardList },
    { id: 'payment', label: 'Thanh toán', icon: Wallet },
  ],
};

    <div className="min-h-screen bg-slate-50 dark:bg-[#0c1222] font-sans">
      {/* ─── TOPBAR ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center
        bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
        border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between w-full px-4 lg:px-6">
          {/* Left: Logo + Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>

            <div className="flex items-center gap-3">
              {/* Logo Mark */}
              <div className="flex-shrink-0">
                <img src={`/logo.png?t=${Date.now()}`} alt="KOLLAb" className="h-8 w-auto object-contain" />
              </div>

              <div className="hidden sm:block">
                <h1 className="text-base font-bold font-display tracking-tight text-slate-900 dark:text-white leading-none">
                  KOL<span className="text-brand-500">LAB</span>
                </h1>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none mt-0.5">
                  KOL Campaign Platform
                </p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block ml-6">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-brand-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-64 pl-10 pr-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80
                    text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500
                    border border-transparent focus:border-brand-400 focus:bg-white dark:focus:bg-slate-700
                    outline-none transition-all duration-200"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700/80 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  ⌘K
                </kbd>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">KOLLAB</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search - Mobile */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Search className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-5 h-5 text-slate-400" />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-5 h-5 text-slate-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Notifications */}
            {role !== 'kol' && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Panel */}
                <AnimatePresence>
                  {notificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 mt-2 w-80 origin-top-right
                        bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60
                        shadow-panel overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/60">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Thông báo</h3>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 text-xs font-semibold">
                              {unreadCount} mới
                            </span>
                          )}
                        </div>
                        <button className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">
                          Đánh dấu đã đọc
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                        {notifications.map((notif) => (
                          <div key={notif.id} className={`px-5 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-700/30 cursor-pointer transition-colors ${notif.unread ? 'bg-brand-50/30 dark:bg-brand-900/8' : ''}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notif.unread ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{notif.title}</p>
                                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${notifColorMap[notif.color]}`} />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700/60">
                        <button className="w-full text-center text-sm text-brand-500 hover:text-brand-600 font-semibold transition-colors">
                          Xem tất cả thông báo
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70
                  bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60
                  transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${currentRoleConfig.gradient} flex items-center justify-center shadow-sm`}>
                  <RoleIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="hidden sm:inline text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {currentRoleConfig.label}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {roleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2 w-60 origin-top-right
                      bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60
                      shadow-panel overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/60">
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Chuyển đổi vai trò</p>
                    </div>
                    {(Object.keys(roleConfig) as Role[]).map((r) => {
                      const config = roleConfig[r];
                      const Icon = config.icon;
                      const isActive = r === role;
                      return (
                        <button
                          key={r}
                          onClick={() => { setRole(r); setRoleDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors ${
                            isActive
                              ? 'bg-brand-50/70 dark:bg-brand-900/15'
                              : 'hover:bg-slate-50/70 dark:hover:bg-slate-700/40'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-sm ${isActive ? 'ring-2 ring-brand-400/40' : 'opacity-80'}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-left">
                            <p className={`font-semibold ${isActive ? 'text-brand-600 dark:text-brand-300' : 'text-slate-700 dark:text-slate-200'}`}>
                              {config.label}
                            </p>
                            {isActive && <p className="text-[10px] text-brand-500 dark:text-brand-400">Đang hoạt động</p>}
                          </div>
                          {isActive && (
                            <CheckCircle2 className="w-4 h-4 text-brand-500 ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            </div>
        </div>
      </header>

      {/* ─── MOBILE SEARCH OVERLAY ──────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white dark:bg-slate-800 mx-4 mt-4 rounded-2xl shadow-panel overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-4">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Tìm kiếm chiến dịch, sản phẩm, KOL..."
                  className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setSearchOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MOBILE BACKDROP ──────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR ───────────────────────────────────────────────────── */}
      <aside className={`
        fixed top-16 left-0 bottom-0 z-40 w-64 flex flex-col
        bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60
        transition-transform duration-300 ease-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-hide">
          {sidebarItems[role].map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isParentActive = hasChildren && item.children?.some(child => activeView === child.id);
            const isActive = activeView === item.id;
            const isExpanded = expandedItems.has(item.id);
            const isHeader = item.isHeader;

            if (isHeader) {
              return (
                <div key={item.id} className="pt-4 pb-1.5 px-3">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-600 uppercase">
                    {item.label}
                  </span>
                </div>
              );
            }

            if (hasChildren && item.children!.length > 1) {
              return (
                <div key={item.id} className="space-y-0.5">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isParentActive
                        ? 'bg-brand-50/70 dark:bg-brand-900/20 text-brand-600 dark:text-brand-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isParentActive ? 'text-brand-500' : ''}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 pl-3 border-l border-slate-200/80 dark:border-slate-700/50 space-y-0.5 py-1">
                          {item.children?.map((child) => {
                            const ChildIcon = child.icon;
                            const isChildActive = activeView === child.id;
                            return (
                              <button
                                key={child.id}
                                onClick={() => handleNav(child.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                                  isChildActive
                                    ? 'bg-brand-50/70 dark:bg-brand-900/20 text-brand-600 dark:text-brand-300 font-semibold'
                                    : 'text-slate-500 dark:text-slate-500 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                              >
                                <ChildIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{child.label}</span>
                                {isChildActive && (
                                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            if (hasChildren && item.children!.length === 1) {
              const singleChild = item.children![0];
              const isChildActive = activeView === singleChild.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(singleChild.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isChildActive
                      ? 'bg-brand-50/70 dark:bg-brand-900/20 text-brand-600 dark:text-brand-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isChildActive ? 'text-brand-500' : ''}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isChildActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50/70 dark:bg-brand-900/20 text-brand-600 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand-500' : ''}`} />
                {item.label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 dark:text-slate-500 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <Settings className="w-4 h-4" />
            Cài đặt
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50/70 dark:hover:bg-red-900/20 transition-colors">
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 lg:p-6 xl:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${activeView}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {ActiveComponent && <ActiveComponent initialView={activeView} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Dropdown Backdrop */}
      {(roleDropdownOpen || notificationOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setRoleDropdownOpen(false); setNotificationOpen(false); }} />
      )}
    </div>
  );
}

export default App;
