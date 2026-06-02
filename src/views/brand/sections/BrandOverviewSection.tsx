import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, DollarSign, Eye, Heart, MessageCircle, Package, Plus, Target, TrendingUp, Users, Award } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { KPIWidget, Badge } from '../../../components/SharedUI';
import { brands, campaigns, kols, kolRankings, payments, tasks, campaignStatusLabels, paymentStatusLabels, taskStatusLabels, taskStatusColors, type TaskStatus } from '../../../data/mockData';

const currentBrandId = 'b1';
const currentBrand = brands.find(b => b.id === currentBrandId) || brands[0];

export function BrandOverviewSection() {
  const brandCampaigns = campaigns.filter(c => c.brandId === currentBrandId);
  const brandTasks = tasks.filter(t => brandCampaigns.some(c => c.id === t.campaignId));
  const brandPayments = payments.filter(p => brandTasks.some(t => t.id === p.taskId));
  const brandKOLs = kols.filter(k => brandCampaigns.some(c => c.assignedKOLs.includes(k.id)));
  const completedTasks = brandTasks.filter(t => ['completed', 'payment_pending', 'paid'].includes(t.status)).length;
  const topKOL = kolRankings.find(r => brandTasks.some(t => t.kolId === r.kolId));
  const totalViews = brandCampaigns.reduce((s, c) => s + c.totalViews, 0);
  const totalEngagement = brandCampaigns.reduce((s, c) => s + Math.round(c.totalViews * (c.avgEngagementRate / 100)), 0);
  const engagementRate = totalViews > 0 ? ((totalEngagement / totalViews) * 100).toFixed(1) : '0.0';
  const conversionRate = (brandCampaigns.reduce((s, c) => s + (c.totalConversions || 0), 0) / Math.max(totalViews, 1) * 100).toFixed(1);
  const avgViews = brandCampaigns.length > 0 ? Math.round(totalViews / brandCampaigns.length) : 0;
  const campaignStatusData = [
    { name: 'Bản nháp', value: brandCampaigns.filter(c => c.status === 'draft').length, color: '#64748b' },
    { name: 'Đang chạy', value: brandCampaigns.filter(c => c.status === 'active').length, color: '#55B3D9' },
    { name: 'Tracking', value: brandCampaigns.filter(c => c.status === 'tracking').length, color: '#73C6D9' },
    { name: 'Hoàn thành', value: brandCampaigns.filter(c => c.status === 'completed').length, color: '#88E8F2' },
    { name: 'Đã hủy', value: brandCampaigns.filter(c => c.status === 'cancelled').length, color: '#94a3b8' },
  ];
  const trendData = brandCampaigns.slice(0, 6).map((c, index) => ({
    name: c.name.split(' ').slice(0, 2).join(' '),
    views: Math.round(c.totalViews * (0.78 + index * 0.05)),
    conversions: Math.round((c.totalConversions || 0) * (0.8 + index * 0.04)),
  }));
  const recentTasks = brandTasks.slice(0, 5);
  const pendingReviews = brandTasks.filter(t => t.status === 'draft_submitted' || t.status === 'revision_required').slice(0, 5);
  const pendingPayments = brandPayments.filter(p => p.status === 'pending' || p.status === 'partial_paid' || p.status === 'hold').slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        <KPIWidget label="Total Views" value={totalViews >= 1000000 ? `${(totalViews / 1000000).toFixed(1)}M` : `${Math.round(totalViews / 1000)}K`} icon={<Eye className="w-5 h-5" />} />
        <KPIWidget label="Average Views" value={avgViews >= 1000 ? `${Math.round(avgViews / 1000)}K` : avgViews.toString()} icon={<TrendingUp className="w-5 h-5" />} accent="from-blue-500/10 to-blue-600/5" />
        <KPIWidget label="Total Engagement" value={`${Math.round(totalEngagement / 1000)}K`} icon={<Heart className="w-5 h-5" />} accent="from-pink-500/10 to-pink-600/5" />
        <KPIWidget label="Engagement Rate" value={`${engagementRate}%`} icon={<MessageCircle className="w-5 h-5" />} accent="from-teal-500/10 to-teal-600/5" />
        <KPIWidget label="Conversion Rate" value={`${conversionRate}%`} icon={<Target className="w-5 h-5" />} accent="from-emerald-500/10 to-emerald-600/5" />
        <KPIWidget label="Assigned KOL/KOC" value={brandKOLs.length.toString()} icon={<Users className="w-5 h-5" />} accent="from-violet-500/10 to-violet-600/5" />
        <KPIWidget label="Task Progress" value={`${completedTasks}/${brandTasks.length}`} icon={<CheckCircle2 className="w-5 h-5" />} accent="from-amber-500/10 to-amber-600/5" />
        <KPIWidget label="Top KOL" value={topKOL?.kolName || '-'} icon={<Award className="w-5 h-5" />} accent="from-cyan-500/10 to-cyan-600/5" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/60 dark:border-slate-700/60 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Campaign Status</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={campaignStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3}>
                  {campaignStatusData.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/60 dark:border-slate-700/60 p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Campaign Performance Trend</h3>
            <span className="text-xs text-gray-500">Views & Conversions</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#55B3D9" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="conversions" stroke="#88E8F2" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/60 dark:border-slate-700/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Campaigns</h3>
            <Badge label={`${brandCampaigns.length} total`} colorClass="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300" />
          </div>
          <div className="space-y-3">{brandCampaigns.slice(0, 5).map(c => <div key={c.id} className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-slate-700/50 px-4 py-3"><div><p className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</p><p className="text-xs text-gray-500">{c.productName}</p></div><Badge label={campaignStatusLabels[c.status]} colorClass={c.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : c.status === 'tracking' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'} /></div>)}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/60 dark:border-slate-700/60 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Creator Activities</h3>
          <div className="space-y-3">{recentTasks.map(t => <div key={t.id} className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-slate-700/50 px-4 py-3"><div><p className="text-sm font-medium text-gray-900 dark:text-white">{t.kolName}</p><p className="text-xs text-gray-500">{t.campaignName}</p></div><Badge label={taskStatusLabels[t.status as TaskStatus]} colorClass={taskStatusColors[t.status as TaskStatus]} /></div>)}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/60 dark:border-slate-700/60 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Pending Reviews</h3>
          <div className="space-y-3">{pendingReviews.length > 0 ? pendingReviews.map(t => <div key={t.id} className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-slate-700/50 px-4 py-3"><div><p className="text-sm font-medium text-gray-900 dark:text-white">{t.kolName}</p><p className="text-xs text-gray-500">{t.campaignName}</p></div><Badge label={taskStatusLabels[t.status as TaskStatus]} colorClass={taskStatusColors[t.status as TaskStatus]} /></div>) : <p className="text-sm text-gray-500">No pending reviews.</p>}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/60 dark:border-slate-700/60 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Pending Payments</h3>
          <div className="space-y-3">{pendingPayments.length > 0 ? pendingPayments.map(p => <div key={p.id} className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-slate-700/50 px-4 py-3"><div><p className="text-sm font-medium text-gray-900 dark:text-white">{p.kolName}</p><p className="text-xs text-gray-500">{p.campaignName}</p></div><Badge label={paymentStatusLabels[p.status]} colorClass={p.status === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : p.status === 'hold' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'} /></div>) : <p className="text-sm text-gray-500">No pending payments.</p>}</div>
        </div>
      </div>
    </div>
  );
}
