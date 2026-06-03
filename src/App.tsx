import { useState, useEffect } from 'react';
import {
  Sun, Moon, ChevronDown, Shield, Briefcase, User,
  LayoutDashboard, Users, BarChart3,
  Package, CircleUser as UserCircle, ClipboardList, Wallet,
  Settings, LogOut, Bell, Menu, Activity, Zap, Target, Eye, FileText, ChevronRight,
  Award, Clock, CheckCircle2, Lock, DollarSign, BarChart, ListFilter
} from 'lucide-react';
import { AdminDashboard, BrandManagement, CampaignManagement, KOLManagement, ProductManagement, PaymentMonitoring, WorkHistory, SystemRanking, ReportCenter, PerformanceCenter, PaymentProcessing, PaymentHold, PaymentPaid } from './views/admin/AdminPanel';
import { BrandDashboard } from './views/brand/BrandDashboard';
import { KOLDashboard } from './views/kol/KOLPortal';
import type { Role } from './data/mockData';

const roleConfig: Record<Role, { label: string; icon: typeof Shield; color: string; bg: string }> = {
  admin: { label: 'Quản trị viên', icon: Shield, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50' },
  brand: { label: 'Brand', icon: Briefcase, color: 'text-gray-600 dark:text-gray-300', bg: 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600' },
  kol: { label: 'KOL/KOC', icon: User, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50' },
};

const sidebarItems: Record<Role, { id: string; label: string; icon: typeof Shield; children?: { id: string; label: string; icon: typeof Shield }[]; isHeader?: boolean }[]> = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'business-header', label: 'Business', icon: Briefcase, isHeader: true },
    { id: 'brands', label: 'Brands', icon: Briefcase, children: [{ id: 'brands', label: 'Danh sách Brand', icon: ListFilter }] },
    { id: 'products', label: 'Products', icon: Package, children: [{ id: 'products', label: 'Danh sách sản phẩm', icon: ListFilter }] },
    { id: 'campaigns', label: 'Campaigns', icon: Target, children: [{ id: 'campaigns', label: 'Danh sách chiến dịch', icon: ListFilter }] },
    { id: 'creators-header', label: 'Creators', icon: Users, isHeader: true },
    { id: 'kolmanagement', label: 'KOL/KOC', icon: Users, children: [{ id: 'kolmanagement', label: 'Danh sách KOL/KOC', icon: ListFilter }] },
    { id: 'rankings', label: 'Rankings', icon: Award, children: [{ id: 'ranking', label: 'Xếp hạng', icon: Award }] },
    { id: 'finance-header', label: 'Finance', icon: Wallet, isHeader: true },
    { id: 'payments', label: 'Payments', icon: Wallet, children: [{ id: 'payments', label: 'Danh sách thanh toán', icon: ListFilter }, { id: 'payments-processing', label: 'Xử lý thanh toán', icon: DollarSign }, { id: 'payments-paid', label: 'Đã thanh toán', icon: CheckCircle2 }, { id: 'payments-hold', label: 'Tạm giữ', icon: Lock }] },
    { id: 'analytics-header', label: 'Analytics', icon: BarChart3, isHeader: true },
    { id: 'performance', label: 'Performance', icon: Activity, children: [{ id: 'performance', label: 'Tổng quan', icon: BarChart }] },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'audit-header', label: 'Audit', icon: Clock, isHeader: true },
    { id: 'history', label: 'Activity Logs', icon: Clock },
    { id: 'system-header', label: 'System', icon: Settings, isHeader: true },
  ],
  brand: [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'products', label: 'Sản phẩm', icon: Package },
    { id: 'campaigns', label: 'Chiến dịch', icon: Target },
    { id: 'kol', label: 'KOL/KOC', icon: Users },
    { id: 'tasks', label: 'Nhiệm vụ', icon: ClipboardList },
    { id: 'content', label: 'Phê duyệt nội dung', icon: Eye },
    { id: 'performance', label: 'Theo dõi hiệu suất', icon: Activity },
    { id: 'payment', label: 'Thanh toán', icon: Wallet },
  ],
  kol: [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'profile', label: 'Hồ sơ', icon: UserCircle },
    { id: 'tasks', label: 'Nhiệm vụ', icon: ClipboardList },
    { id: 'payment', label: 'Thanh toán', icon: Wallet },
  ],
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState<Role>('brand');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [notificationOpen, setNotificationOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Chiến dịch mới được duyệt', message: 'Chiến dịch "Summer Sale 2026" đã được phê duyệt', time: '5 phút trước', unread: true },
    { id: 2, title: 'KOL hoàn thành nhiệm vụ', message: 'Nguyen Van A đã hoàn thành nhiệm vụ Campaign #123', time: '1 giờ trước', unread: true },
    { id: 3, title: 'Thanh toán đã xử lý', message: 'Thanh toán 5,000,000 VND đã được xử lý thành công', time: '2 giờ trước', unread: false },
    { id: 4, title: 'Cảnh báo ngân sách', message: 'Chiến dịch "Black Friday" đã sử dụng 80% ngân sách', time: '1 ngày trước', unread: false },
  ];

  const viewComponents: Record<Role, Record<string, (props: { initialView?: string; initialStatus?: string }) => React.JSX.Element>> = {
    admin: {
      dashboard: () => <AdminDashboard onNavigate={(viewId) => { setActiveView(viewId); setExpandedItems(new Set()); }} />,
      brands: BrandManagement,
      campaigns: CampaignManagement,
      kolmanagement: KOLManagement,
      products: ProductManagement,
      payments: (props) => <PaymentMonitoring initialStatus={props?.initialStatus} />,
      'payments-processing': PaymentProcessing,
      'payments-paid': PaymentPaid,
      'payments-hold': PaymentHold,
      performance: PerformanceCenter,
      ranking: SystemRanking,
      rankings: SystemRanking,
      reports: ReportCenter,
      history: WorkHistory,
    },
    brand: {
      dashboard: (props) => <BrandDashboard initialView={props?.initialView as any || 'overview'} />,
      products: (props) => <BrandDashboard initialView="products" />,
      campaigns: (props) => <BrandDashboard initialView="campaigns" />,
      kol: (props) => <BrandDashboard initialView="kol" />,
      tasks: (props) => <BrandDashboard initialView="tasks" />,
      content: (props) => <BrandDashboard initialView="content" />,
      performance: (props) => <BrandDashboard initialView="performance" />,
      payment: (props) => <BrandDashboard initialView="payment" />,
    },
    kol: {
      dashboard: (props) => <KOLDashboard initialView={props?.initialView as any || 'dashboard'} />,
      profile: (props) => <KOLDashboard initialView={props?.initialView as any || 'profile'} />,
      tasks: (props) => <KOLDashboard initialView={props?.initialView as any || 'tasks'} />,
      submit: (props) => <KOLDashboard initialView={props?.initialView as any || 'submit'} />,
      payment: (props) => <KOLDashboard initialView={props?.initialView as any || 'payment'} />,
    },
  };

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);
  useEffect(() => { setActiveView(sidebarItems[role][0].id); }, [role]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const currentRoleConfig = roleConfig[role];
  const RoleIcon = currentRoleConfig.icon;
  const ActiveComponent = viewComponents[role]?.[activeView];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 h-14 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Zap className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">KOLLAB</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              {darkMode ? <Sun className="w-4 h-4 text-gray-400" /> : <Moon className="w-4 h-4 text-gray-500" />}
            </button>

            <button onClick={() => setRoleDropdownOpen(!roleDropdownOpen)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border ${currentRoleConfig.bg}`}>
              <RoleIcon className={`w-3.5 h-3.5 ${currentRoleConfig.color}`} />
              <span className="hidden sm:inline">{currentRoleConfig.label}</span>
              <ChevronDown className={`w-3 h-3 ${currentRoleConfig.color}`} />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-2 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-1 z-50">
                {(Object.keys(roleConfig) as Role[]).map((r) => {
                  const config = roleConfig[r];
                  const Icon = config.icon;
                  return (
                    <button key={r} onClick={() => { setRole(r); setRoleDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs ${r === role ? `${config.bg} ${config.color} font-semibold` : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                      <Icon className="w-3.5 h-3.5" />{config.label}
                    </button>
                  );
                })}
              </div>
            )}

            {role !== 'kol' && (
              <button onClick={() => setNotificationOpen(!notificationOpen)} className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Notification Dropdown */}
      {notificationOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setNotificationOpen(false)} />
      )}
      {notificationOpen && (
        <div className="absolute right-2 top-14 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Thông báo</span>
            <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Đánh dấu đã đọc</button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notif) => (
              <div key={notif.id} className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${notif.unread ? 'bg-gray-50/50 dark:bg-gray-700/10' : ''}`}>
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0 ${notif.unread ? 'bg-gray-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{notif.title}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
            <button className="w-full text-center text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Xem tất cả thông báo</button>
          </div>
        </div>
      )}

      {roleDropdownOpen && <div className="fixed inset-0 z-30" onClick={() => setRoleDropdownOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-14 left-0 bottom-0 z-30 w-56 transition-transform duration-200 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="flex-1 p-2 overflow-y-auto">
            {sidebarItems[role].map((item) => {
              const Icon = item.icon;
              const hasChildren = !!(item.children && item.children.length > 0);
              const isParentActive = hasChildren && item.children?.some(child => activeView === child.id);
              const isActive = activeView === item.id;
              const isExpanded = expandedItems.has(item.id);
              const isHeader = item.id.endsWith('-header');

              if (isHeader) {
                return (
                  <div key={item.id} className="pt-3 pb-1 px-2">
                    <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">{item.label}</span>
                  </div>
                );
              }

              if (hasChildren && item.children!.length > 1) {
                return (
                  <div key={item.id} className="mb-0.5">
                    <button onClick={() => toggleExpanded(item.id)}
                      className={`w-full flex items-center gap-2 px-2 py-2 text-sm ${isParentActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="ml-5 border-l border-gray-200 dark:border-gray-700 space-y-0.5 py-1">
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = activeView === child.id;
                          return (
                            <button key={child.id} onClick={() => { setActiveView(child.id); setMobileMenuOpen(false); }}
                              className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded ${isChildActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                              <ChildIcon className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>{child.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              if (hasChildren && item.children!.length === 1) {
                const singleChild = item.children![0];
                const isChildActive = activeView === singleChild.id;
                return (
                  <button key={item.id} onClick={() => { setActiveView(singleChild.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-2 py-2 text-sm mb-0.5 ${isChildActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button key={item.id} onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-2 py-2 text-sm mb-0.5 ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className={`p-2 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Settings className="w-4 h-4" />Cài đặt
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="w-4 h-4" />Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main */}
      <main className="lg:ml-56 pt-14 min-h-screen">
        <div className="p-6">
          {ActiveComponent && <ActiveComponent initialView={activeView} />}
        </div>
      </main>
    </div>
  );
}

export default App;
