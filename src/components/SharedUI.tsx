import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { ReactNode, useState } from 'react';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────
export const roleColors = {
  admin: {
    primary: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800/50',
    active: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
    iconBg: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    gradient: 'from-red-500/10 to-red-600/5',
    buttonPrimary: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    buttonSecondary: 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300',
  },
  brand: {
    primary: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    border: 'border-teal-200 dark:border-teal-800/50',
    active: 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300',
    iconBg: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400',
    gradient: 'from-teal-500/10 to-teal-600/5',
    buttonPrimary: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500',
    buttonSecondary: 'bg-teal-100 hover:bg-teal-200 text-teal-700 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 dark:text-teal-300',
  },
  kol: {
    primary: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800/50',
    active: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500/10 to-blue-600/5',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    buttonSecondary: 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300',
  },
} as const;

export type RoleKey = keyof typeof roleColors;

export const cardStyles = {
  container: 'bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/60 dark:border-slate-700/60',
  containerFlat: 'bg-gray-50 dark:bg-slate-700/50 rounded-xl',
  padding: 'p-6',
  paddingSm: 'p-4',
  gap: 'gap-4',
  gapSm: 'gap-3',
  shadow: 'shadow-sm hover:shadow-md transition-shadow',
} as const;

export const tableStyles = {
  overflowWrapper: 'overflow-x-auto',
  thead: 'bg-gray-50 dark:bg-slate-700',
  theadSticky: 'sticky top-0',
  tr: 'border-b border-gray-100 dark:border-slate-700/50',
  th: 'px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide',
  trHover: 'hover:bg-gray-50/50 dark:hover:bg-slate-700/30',
} as const;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function Modal({ isOpen, onClose, title, children, width = 'max-w-2xl' }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`${width} w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface KPIWidgetProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: ReactNode;
  accent?: string;
  role?: RoleKey;
}

export function KPIWidget({ label, value, change, positive, icon, accent, role = 'brand' }: KPIWidgetProps) {
  const colors = roleColors[role];
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`bg-gradient-to-br ${accent ?? colors.gradient} to-transparent rounded-2xl p-5 border border-gray-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800/80`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-xs mt-1 font-medium ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
              {positive ? '+' : ''}{change} so với kỳ trước
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${colors.iconBg}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

interface BadgeProps {
  label: string;
  colorClass?: string;
}

export function Badge({ label, colorClass = 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300' }: BadgeProps) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>{label}</span>;
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
  disabled?: boolean;
  role?: RoleKey;
}

export function Button({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, role = 'brand' }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const colors = roleColors[role];
  const primary = `${colors.buttonPrimary} text-white shadow-sm hover:shadow-md`;
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' };
  const variantClass = variant === 'primary' ? primary : variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md focus:ring-red-500' : variant === 'secondary' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200' : 'hover:bg-gray-100 text-gray-600 dark:hover:bg-slate-700 dark:text-gray-300';
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick} disabled={disabled} className={`${base} ${variantClass} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {children}
    </motion.button>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function Avatar({ initials, size = 'md', role = 'brand' }: { initials: string; size?: 'sm' | 'md' | 'lg' | 'xl'; role?: RoleKey }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-20 h-20 text-2xl' };
  const avatarGradients = {
    admin: 'from-red-400 to-red-600',
    brand: 'from-teal-400 to-teal-600',
    kol: 'from-blue-400 to-blue-600',
  };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${avatarGradients[role]} flex items-center justify-center text-white font-semibold shadow-sm`}>
      {initials}
    </div>
  );
}

// Copy to clipboard button
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors" title="Sao chép">
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="w-4 h-4 text-emerald-500" /></motion.div>
        ) : (
          <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Copy className="w-4 h-4" /></motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// QR Code display component with pixel art style
export function QRDisplay({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-16 h-16', md: 'w-24 h-24', lg: 'w-32 h-32' };
  // Simple pixel art pattern to simulate QR code
  const pattern = [
    [1,1,1,0,1,0,1,1,1],
    [1,0,1,0,0,0,1,0,1],
    [1,1,1,0,1,0,1,1,1],
    [0,0,0,1,0,1,0,0,0],
    [1,0,1,0,1,0,1,0,1],
    [0,0,0,1,0,1,0,0,0],
    [1,1,1,0,1,0,1,1,1],
    [1,0,1,0,0,0,1,0,1],
    [1,1,1,0,1,0,1,1,1],
  ];
  return (
    <div className={`${sizes[size]} bg-white rounded-lg p-1 shadow-sm`}>
      <div className="w-full h-full grid grid-cols-9 grid-rows-9 gap-px">
        {pattern.flat().map((cell, i) => (
          <div key={i} className={`rounded-[1px] ${cell ? 'bg-gray-900' : 'bg-white'}`} />
        ))}
      </div>
    </div>
  );
}

// Credential display for account creation
export function CredentialDisplay({ username, password }: { username: string; password: string }) {
  return (
    <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/50 rounded-xl p-4 space-y-3">
      <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase">Thông tin đăng nhập</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg px-3 py-2">
          <div><span className="text-xs text-gray-500 dark:text-gray-400">Tài khoản: </span><span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{username}</span></div>
          <CopyButton text={username} />
        </div>
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg px-3 py-2">
          <div><span className="text-xs text-gray-500 dark:text-gray-400">Mật khẩu: </span><span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{password}</span></div>
          <CopyButton text={password} />
        </div>
      </div>
    </div>
  );
}

// Star rating display
export function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={`w-3 h-3 rounded-full ${i < Math.round(rating) ? 'bg-amber-400' : 'bg-gray-200 dark:bg-slate-600'}`} />
      ))}
      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">{rating.toFixed(1)}</span>
    </div>
  );
}

// Section header component
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
