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
  },
  brand: {
    primary: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    active: 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100',
    iconBg: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    gradient: 'from-gray-500/10 to-gray-600/5',
  },
  kol: {
    primary: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800/50',
    active: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500/10 to-blue-600/5',
  },
} as const;

export type RoleKey = keyof typeof roleColors;

export const cardStyles = {
  container: 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
  padding: 'p-5',
  paddingSm: 'p-4',
  gap: 'gap-4',
  gapSm: 'gap-3',
} as const;

export const tableStyles = {
  overflowWrapper: 'overflow-x-auto',
  thead: 'bg-gray-50 dark:bg-gray-800',
  theadSticky: 'sticky top-0',
  tr: 'border-b border-gray-100 dark:border-gray-700',
  th: 'px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase',
  trHover: 'hover:bg-gray-50 dark:hover:bg-gray-700/30',
} as const;

// ─── MODAL ────────────────────────────────────────────────────────────
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
          <div className={`${width} w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── KPI WIDGET ──────────────────────────────────────────────────────
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
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white mt-0.5">{value}</p>
          {change && (
            <p className={`text-[10px] mt-0.5 ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
              {positive ? '+' : ''}{change}
            </p>
          )}
        </div>
        <div className={`p-2 rounded ${colors.iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─── BADGE ───────────────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  colorClass?: string;
}

export function Badge({ label, colorClass = 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' }: BadgeProps) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${colorClass}`}>{label}</span>;
}

// ─── BUTTON ───────────────────────────────────────────────────────────
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
  const colors = roleColors[role];
  const base = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';
  const sizes = { sm: 'px-2.5 py-1 text-xs', md: 'px-3 py-1.5 text-sm' };
  let cls = '';
  if (variant === 'primary') cls = `${colors.iconBg.replace('text-', 'text-')} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600`;
  else if (variant === 'danger') cls = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 focus:ring-red-400';
  else if (variant === 'secondary') cls = 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400';
  else cls = 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${cls} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {children}
    </button>
  );
}

// ─── PAGE TRANSITION ──────────────────────────────────────────────────
export function PageTransition({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

// ─── AVATAR ───────────────────────────────────────────────────────────
export function Avatar({ initials, size = 'md', role = 'brand' }: { initials: string; size?: 'sm' | 'md' | 'lg' | 'xl'; role?: RoleKey }) {
  const sizes = { sm: 'w-7 h-7 text-[10px]', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm', xl: 'w-16 h-16 text-xl' };
  const avatarGradients = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    brand: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
    kol: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  };
  return (
    <div className={`${sizes[size]} ${avatarGradients[role]} flex items-center justify-center font-medium rounded-full`}>
      {initials}
    </div>
  );
}

// ─── COPY BUTTON ──────────────────────────────────────────────────────
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handleCopy} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Sao chép">
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check className="w-3.5 h-3.5 text-green-500" />
          </motion.div>
        ) : (
          <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Copy className="w-3.5 h-3.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── QR DISPLAY ───────────────────────────────────────────────────────
export function QRDisplay({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-14 h-14', md: 'w-20 h-20', lg: 'w-28 h-28' };
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
    <div className={`${sizes[size]} bg-white rounded p-0.5`}>
      <div className="w-full h-full grid grid-cols-9 grid-rows-9 gap-px">
        {pattern.flat().map((cell, i) => (
          <div key={i} className={`rounded-sm ${cell ? 'bg-gray-900' : 'bg-white'}`} />
        ))}
      </div>
    </div>
  );
}

// ─── CREDENTIAL DISPLAY ───────────────────────────────────────────────
export function CredentialDisplay({ username, password }: { username: string; password: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 space-y-2">
      <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">Thông tin đăng nhập</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded px-2.5 py-1.5">
          <div><span className="text-[10px] text-gray-400">Tài khoản: </span><span className="text-xs font-mono text-gray-900 dark:text-white">{username}</span></div>
          <CopyButton text={username} />
        </div>
        <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded px-2.5 py-1.5">
          <div><span className="text-[10px] text-gray-400">Mật khẩu: </span><span className="text-xs font-mono text-gray-900 dark:text-white">{password}</span></div>
          <CopyButton text={password} />
        </div>
      </div>
    </div>
  );
}

// ─── STAR RATING ──────────────────────────────────────────────────────
export function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < Math.round(rating) ? 'bg-amber-400' : 'bg-gray-200 dark:bg-gray-600'}`} />
      ))}
      <span className="ml-1 text-[10px] text-gray-500 dark:text-gray-400">{rating.toFixed(1)}</span>
    </div>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
