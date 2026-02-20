'use client'

import { useEffect, useState, ReactNode } from "react";
import {
  LuBookHeart, LuFileText, LuTrendingUp, LuArrowUp, LuArrowDown,
  LuClock, LuCheckCheck, LuActivity, LuLayoutDashboard, LuZap
} from "react-icons/lu";
import admissionController from "./controllers/Admission";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Home: React.FC = () => {
  const { data: session, status } = useSession();
  const rehab_center_id = session?.user?.rehab_center_id;

  const [stats, setStats] = useState({
    totalServices: 0,
    totalAdmissions: 0,
    activeAdmissions: 0,
    completedAdmissions: 0,
    monthlyGrowth: 0,
    serviceUtilization: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect('/login');
    if (status === "authenticated") fetchDashboardData();
  }, [status, rehab_center_id]);

  const fetchDashboardData = async () => {
    if (!rehab_center_id) return;
    setLoading(true);
    try {
      const [dashboardRes] = await Promise.all([
        admissionController.fetch_admission_history_dashboard(rehab_center_id)
      ]);
      const data = dashboardRes?.data ?? {};
      const months = Object.keys(data.monthly_admissions ?? {}).sort();
      const thisMonth = data.monthly_admissions[months[months.length - 1]] ?? 0;
      const lastMonth = months.length > 1 ? data.monthly_admissions[months[months.length - 2]] ?? 0 : 0;
      const growth = lastMonth === 0 ? (thisMonth > 0 ? 100 : 0) : Math.round(((thisMonth - lastMonth) / lastMonth) * 100);

      setStats({
        totalServices: data.total_services ?? 0,
        totalAdmissions: data.total_admissions ?? 0,
        activeAdmissions: data.active_admissions ?? 0,
        completedAdmissions: data.completed_admissions ?? 0,
        serviceUtilization: data.service_utilization ?? 0,
        monthlyGrowth: growth
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#f8fafc" }}>
      <div className="container-xl">

        <div className="row align-items-center mb-5">
          <div className="col">
            <div className="d-flex align-items-center gap-2 text-primary mb-1">
              <LuZap size={18} fill="currentColor" />
              {/* <span className="fw-bold small text-uppercase tracking-wider">Live Insights</span> */}
              <p className="fw-black text-dark display-6 mb-0" style={{ letterSpacing: '-1.5px' }}>
                Dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <StatCard
            icon={<LuBookHeart />}
            color="#6366f1"
            title="Services"
            value={stats.totalServices}
            loading={loading}
            trend="+12%"
          />
          <StatCard
            icon={<LuFileText />}
            color="#10b981"
            title="Total Admissions"
            value={stats.totalAdmissions}
            loading={loading}
          />
          <StatCard
            icon={<LuClock />}
            color="#f59e0b"
            title="Active Now"
            value={stats.activeAdmissions}
            loading={loading}
          />
          <StatCard
            icon={<LuCheckCheck />}
            color="#3b82f6"
            title="Success"
            value={stats.completedAdmissions}
            loading={loading}
            isLast
          />
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <AnalyticsCard
              icon={<LuTrendingUp size={24} />}
              title="Monthly Performance"
              value={`${Math.abs(stats.monthlyGrowth)}%`}
              isPositive={stats.monthlyGrowth >= 0}
              loading={loading}
              label="Patient growth rate vs last month"
            />
          </div>
          <div className="col-lg-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-white"
              style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
              <LuActivity size={32} className="mb-3 text-info" />
              <h5 className="text-white-50 small text-uppercase">Utilization</h5>
              <h2 className="display-5 fw-bold mb-2">{stats.serviceUtilization}%</h2>
              <div className="progress bg-secondary-subtle mt-3" style={{ height: '8px' }}>
                <div className="progress-bar bg-info" style={{ width: `${stats.serviceUtilization}%` }}></div>
              </div>
              <p className="small text-white-50 mt-3">Facility resource allocation currently optimal.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, color, title, value, loading, trend }: any) => (
  <div className="col-md-6 col-xl-3">
    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden" style={{ background: '#fff' }}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="icon-box" style={{ backgroundColor: `${color}15`, color: color }}>
            {icon}
          </div>
          {trend && <span className="badge bg-success-lt text-success rounded-pill px-2">{trend}</span>}
        </div>
        <h6 className="text-muted fw-bold small text-uppercase mb-1">{title}</h6>
        <h2 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.75rem' }}>
          {loading ? <div className="spinner-border spinner-border-sm opacity-25" /> : value}
        </h2>
      </div>
    </div>
  </div>
);

const AnalyticsCard = ({ icon, title, value, isPositive, loading, label }: any) => (
  <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
    <div className="d-flex align-items-center gap-3 mb-4">
      <div className="bg-light p-2 rounded-3 text-primary">{icon}</div>
      <h5 className="fw-bold text-dark mb-0">{title}</h5>
    </div>
    <div className="row align-items-end">
      <div className="col">
        <div className="d-flex align-items-center gap-3">
          <h1 className="display-4 fw-bold mb-0">{loading ? "..." : value}</h1>
          <div className={`d-flex align-items-center rounded-pill px-3 py-1 ${isPositive ? 'bg-success text-white' : 'bg-danger text-white'}`}>
            {isPositive ? <LuArrowUp size={16} /> : <LuArrowDown size={16} />}
            <span className="ms-1 fw-bold small">{isPositive ? 'Growth' : 'Drop'}</span>
          </div>
        </div>
        <p className="text-muted mt-3 mb-0">{label}</p>
      </div>
      <div className="col-auto d-none d-md-block opacity-25">
        <LuTrendingUp size={100} />
      </div>
    </div>
  </div>
);

export default Home;