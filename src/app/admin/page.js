'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserShield,
  faUsers,
  faUserCheck,
  faUserClock,
  faBook,
  faCalendarAlt,
  faChartLine,
  faSpinner,
  faGraduationCap,
  faChalkboardTeacher,
  faArrowUp,
  faArrowDown,
  faClock,
  faFire,
  faTrophy,
  faLightbulb,
  faPercent,
  faChartBar,
  faChartPie
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import styles from './Admin.module.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PERIOD_OPTIONS = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: '7 días' },
  { value: 'month', label: '30 días' },
  { value: 'year', label: '12 meses' }
];

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      loadStats();
    }
  }, [status, session, period]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/stats?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 13, weight: '600' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: 10 },
          color: '#9ca3af',
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: { 
          font: { size: 10 },
          color: '#9ca3af',
          stepSize: 1
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  }), []);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          font: { size: 12 },
          color: '#9ca3af',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 13, weight: '600' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8
      }
    },
    cutout: '65%'
  }), []);

  // Prepare chart data
  const userTrendData = useMemo(() => {
    if (!stats?.userTrend) return null;
    return {
      labels: stats.userTrend.map(d => d.label),
      datasets: [{
        label: 'Nuevos Usuarios',
        data: stats.userTrend.map(d => d.count),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: period === 'month' ? 0 : 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3b82f6'
      }]
    };
  }, [stats?.userTrend, period]);

  const promedioTrendData = useMemo(() => {
    if (!stats?.promedioTrend) return null;
    return {
      labels: stats.promedioTrend.map(d => d.label),
      datasets: [{
        label: 'Nuevos Promedios',
        data: stats.promedioTrend.map(d => d.count),
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: '#8b5cf6',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: period === 'month' ? 0 : 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#8b5cf6'
      }]
    };
  }, [stats?.promedioTrend, period]);

  const dayOfWeekData = useMemo(() => {
    if (!stats?.dayOfWeekDistribution) return null;
    return {
      labels: stats.dayOfWeekDistribution.labels,
      datasets: [{
        label: 'Registros',
        data: stats.dayOfWeekDistribution.data,
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(6, 182, 212, 0.8)'
        ],
        borderRadius: 6,
        borderSkipped: false
      }]
    };
  }, [stats?.dayOfWeekDistribution]);

  const hourDistributionData = useMemo(() => {
    if (!stats?.hourDistribution) return null;
    const peakHour = Math.max(...stats.hourDistribution.data);
    return {
      labels: stats.hourDistribution.labels,
      datasets: [{
        label: 'Actividad',
        data: stats.hourDistribution.data,
        backgroundColor: stats.hourDistribution.data.map(v => 
          v === peakHour ? 'rgba(16, 185, 129, 0.9)' : 'rgba(59, 130, 246, 0.6)'
        ),
        borderRadius: 4,
        borderSkipped: false
      }]
    };
  }, [stats?.hourDistribution]);

  const roleDistributionData = useMemo(() => {
    if (!stats?.roleDistribution) return null;
    return {
      labels: ['Estudiantes', 'Profesores', 'Administradores'],
      datasets: [{
        data: [
          stats.roleDistribution.STUDENT || 0,
          stats.roleDistribution.TEACHER || 0,
          stats.roleDistribution.ADMIN || 0
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.9)',
          'rgba(16, 185, 129, 0.9)',
          'rgba(139, 92, 246, 0.9)'
        ],
        borderWidth: 0,
        hoverOffset: 8
      }]
    };
  }, [stats?.roleDistribution]);

  const engagementData = useMemo(() => {
    if (!stats) return null;
    const engaged = stats.usersWithPromedios || 0;
    const notEngaged = (stats.totalUsers || 0) - engaged;
    return {
      labels: ['Con actividad', 'Sin actividad'],
      datasets: [{
        data: [engaged, notEngaged],
        backgroundColor: [
          'rgba(16, 185, 129, 0.9)',
          'rgba(156, 163, 175, 0.3)'
        ],
        borderWidth: 0,
        hoverOffset: 8
      }]
    };
  }, [stats]);

  const GrowthIndicator = ({ value }) => {
    const numValue = parseFloat(value);
    const isPositive = numValue >= 0;
    return (
      <span className={`${styles.growthIndicator} ${isPositive ? styles.growthPositive : styles.growthNegative}`}>
        <FontAwesomeIcon icon={isPositive ? faArrowUp : faArrowDown} />
        {Math.abs(numValue)}%
      </span>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
            <p>Cargando panel de administración...</p>
          </div>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <FontAwesomeIcon icon={faUserShield} />
          </div>
          <h1 className={styles.title}>Panel de Administración</h1>
          <p className={styles.subtitle}>
            Estadísticas y gestión de la plataforma
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className={styles.navTabs}>
          <Link href="/admin" className={`${styles.navTab} ${styles.navTabActive}`}>
            <FontAwesomeIcon icon={faChartLine} />
            Estadísticas
          </Link>
          <Link href="/admin/users" className={styles.navTab}>
            <FontAwesomeIcon icon={faUsers} />
            Usuarios
          </Link>
          <Link href="/admin/sugerencias" className={styles.navTab}>
            <FontAwesomeIcon icon={faLightbulb} />
            Sugerencias
          </Link>
        </div>

        {/* Period Selector */}
        <div className={styles.periodSelector}>
          <span className={styles.periodLabel}>Período:</span>
          <div className={styles.periodButtons}>
            {PERIOD_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`${styles.periodButton} ${period === opt.value ? styles.periodButtonActive : ''}`}
                onClick={() => setPeriod(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {stats && (
          <>
            {/* Quick Stats Row */}
            <div className={styles.quickStatsRow}>
              <div className={styles.quickStatCard}>
                <div className={styles.quickStatIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className={styles.quickStatContent}>
                  <span className={styles.quickStatValue}>{stats.last24h.users}</span>
                  <span className={styles.quickStatLabel}>Usuarios (24h)</span>
                </div>
              </div>
              <div className={styles.quickStatCard}>
                <div className={styles.quickStatIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                  <FontAwesomeIcon icon={faBook} />
                </div>
                <div className={styles.quickStatContent}>
                  <span className={styles.quickStatValue}>{stats.last24h.promedios}</span>
                  <span className={styles.quickStatLabel}>Promedios (24h)</span>
                </div>
              </div>
              <div className={styles.quickStatCard}>
                <div className={styles.quickStatIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <FontAwesomeIcon icon={faFire} />
                </div>
                <div className={styles.quickStatContent}>
                  <span className={styles.quickStatValue}>{stats.peakDayCount}</span>
                  <span className={styles.quickStatLabel}>Pico: {stats.peakDay}</span>
                </div>
              </div>
              <div className={styles.quickStatCard}>
                <div className={styles.quickStatIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <FontAwesomeIcon icon={faPercent} />
                </div>
                <div className={styles.quickStatContent}>
                  <span className={styles.quickStatValue}>{stats.engagementRate}%</span>
                  <span className={styles.quickStatLabel}>Engagement</span>
                </div>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Total Usuarios</span>
                  <span className={styles.statValue}>{stats.totalUsers}</span>
                  <div className={styles.statGrowth}>
                    <GrowthIndicator value={stats.growth.users} />
                    <span className={styles.statPeriod}>vs período anterior</span>
                  </div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <FontAwesomeIcon icon={faUserCheck} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Usuarios Verificados</span>
                  <span className={styles.statValue}>{stats.activeUsers}</span>
                  <span className={styles.statSubtext}>{stats.verificationRate}% del total</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <FontAwesomeIcon icon={faUserClock} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Sin Verificar</span>
                  <span className={styles.statValue}>{stats.unverifiedUsers}</span>
                  <span className={styles.statSubtext}>Pendientes de activación</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                  <FontAwesomeIcon icon={faBook} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Total Promedios</span>
                  <span className={styles.statValue}>{stats.totalPromedios}</span>
                  <div className={styles.statGrowth}>
                    <GrowthIndicator value={stats.growth.promedios} />
                    <span className={styles.statPeriod}>vs período anterior</span>
                  </div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Total Semestres</span>
                  <span className={styles.statValue}>{stats.totalSemesters}</span>
                  <div className={styles.statGrowth}>
                    <GrowthIndicator value={stats.growth.semesters} />
                    <span className={styles.statPeriod}>vs período anterior</span>
                  </div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                  <FontAwesomeIcon icon={faChartLine} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Promedio Diario</span>
                  <span className={styles.statValue}>{stats.currentPeriod.avgDailyRegistrations}</span>
                  <span className={styles.statSubtext}>registros/día</span>
                </div>
              </div>
            </div>

            {/* Charts Row 1 - Trends */}
            <div className={styles.chartsRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>
                    <FontAwesomeIcon icon={faChartLine} />
                    Tendencia de Usuarios
                  </h3>
                  <span className={styles.chartPeriod}>
                    {stats.currentPeriod.newUsers} nuevos
                  </span>
                </div>
                <div className={styles.chartWrapper}>
                  {userTrendData && <Line data={userTrendData} options={chartOptions} />}
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>
                    <FontAwesomeIcon icon={faChartLine} />
                    Tendencia de Promedios
                  </h3>
                  <span className={styles.chartPeriod}>
                    {stats.currentPeriod.newPromedios} nuevos
                  </span>
                </div>
                <div className={styles.chartWrapper}>
                  {promedioTrendData && <Line data={promedioTrendData} options={chartOptions} />}
                </div>
              </div>
            </div>

            {/* Charts Row 2 - Distributions */}
            <div className={styles.chartsRowThree}>
              <div className={styles.chartCardSmall}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>
                    <FontAwesomeIcon icon={faChartPie} />
                    Por Rol
                  </h3>
                </div>
                <div className={styles.chartWrapperSmall}>
                  {roleDistributionData && <Doughnut data={roleDistributionData} options={doughnutOptions} />}
                </div>
              </div>

              <div className={styles.chartCardSmall}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>
                    <FontAwesomeIcon icon={faChartPie} />
                    Engagement
                  </h3>
                </div>
                <div className={styles.chartWrapperSmall}>
                  {engagementData && <Doughnut data={engagementData} options={doughnutOptions} />}
                </div>
              </div>

              <div className={styles.chartCardSmall}>
                <div className={styles.chartHeader}>
                  <h3 className={styles.chartTitle}>
                    <FontAwesomeIcon icon={faChartBar} />
                    Por Día
                  </h3>
                </div>
                <div className={styles.chartWrapperSmall}>
                  {dayOfWeekData && <Bar data={dayOfWeekData} options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      x: { ...chartOptions.scales.x, display: true }
                    }
                  }} />}
                </div>
              </div>
            </div>

            {/* Hour Distribution */}
            <div className={styles.chartCardWide}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>
                  <FontAwesomeIcon icon={faClock} />
                  Actividad por Hora del Día
                </h3>
                <span className={styles.chartSubtitle}>Distribución de registros según hora (UTC)</span>
              </div>
              <div className={styles.chartWrapperWide}>
                {hourDistributionData && <Bar data={hourDistributionData} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: { display: false }
                  }
                }} />}
              </div>
            </div>

            {/* Role Distribution Cards */}
            <div className={styles.roleSection}>
              <h2 className={styles.sectionTitle}>Distribución por Rol</h2>
              <div className={styles.roleGrid}>
                <div className={styles.roleCard}>
                  <div className={styles.roleIcon} style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
                    <FontAwesomeIcon icon={faUserShield} />
                  </div>
                  <div className={styles.roleInfo}>
                    <span className={styles.roleName}>Administradores</span>
                    <span className={styles.roleCount}>{stats.roleDistribution.ADMIN || 0}</span>
                  </div>
                </div>
                <div className={styles.roleCard}>
                  <div className={styles.roleIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </div>
                  <div className={styles.roleInfo}>
                    <span className={styles.roleName}>Estudiantes</span>
                    <span className={styles.roleCount}>{stats.roleDistribution.STUDENT || 0}</span>
                  </div>
                </div>
                <div className={styles.roleCard}>
                  <div className={styles.roleIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <FontAwesomeIcon icon={faChalkboardTeacher} />
                  </div>
                  <div className={styles.roleInfo}>
                    <span className={styles.roleName}>Profesores</span>
                    <span className={styles.roleCount}>{stats.roleDistribution.TEACHER || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Users */}
            <div className={styles.topUsersSection}>
              <h2 className={styles.sectionTitle}>
                <FontAwesomeIcon icon={faTrophy} className={styles.trophyIcon} />
                Top Usuarios por Actividad
              </h2>
              <div className={styles.topUsersGrid}>
                {stats.topUsers.map((user, index) => (
                  <div key={user.id} className={styles.topUserCard}>
                    <div className={styles.topUserRank} data-rank={index + 1}>
                      {index + 1}
                    </div>
                    <div className={styles.topUserInfo}>
                      <span className={styles.topUserName}>{user.username}</span>
                      <span className={styles.topUserEmail}>{user.email}</span>
                    </div>
                    <div className={styles.topUserStats}>
                      <span className={styles.topUserStat}>
                        <FontAwesomeIcon icon={faBook} />
                        {user.promedios}
                      </span>
                      <span className={styles.topUserStat}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        {user.semesters}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className={styles.engagementSection}>
              <h2 className={styles.sectionTitle}>Métricas de Engagement</h2>
              <div className={styles.engagementGrid}>
                <div className={styles.engagementCard}>
                  <div className={styles.engagementValue}>{stats.usersWithPromedios}</div>
                  <div className={styles.engagementLabel}>Con Promedios</div>
                  <div className={styles.engagementBar}>
                    <div 
                      className={styles.engagementProgress} 
                      style={{ width: `${stats.engagementRate}%`, background: 'linear-gradient(90deg, #10b981, #059669)' }}
                    />
                  </div>
                  <div className={styles.engagementPercent}>{stats.engagementRate}%</div>
                </div>
                <div className={styles.engagementCard}>
                  <div className={styles.engagementValue}>{stats.usersWithSemesters}</div>
                  <div className={styles.engagementLabel}>Con Semestres</div>
                  <div className={styles.engagementBar}>
                    <div 
                      className={styles.engagementProgress} 
                      style={{ 
                        width: `${stats.totalUsers > 0 ? (stats.usersWithSemesters / stats.totalUsers * 100).toFixed(1) : 0}%`,
                        background: 'linear-gradient(90deg, #8b5cf6, #6d28d9)'
                      }}
                    />
                  </div>
                  <div className={styles.engagementPercent}>
                    {stats.totalUsers > 0 ? (stats.usersWithSemesters / stats.totalUsers * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div className={styles.engagementCard}>
                  <div className={styles.engagementValue}>{stats.averagePromediosPerActiveUser}</div>
                  <div className={styles.engagementLabel}>Promedio por Usuario Activo</div>
                  <div className={styles.engagementSubtext}>
                    {stats.averagePromediosPerUser} promedio general
                  </div>
                </div>
                <div className={styles.engagementCard}>
                  <div className={styles.engagementValue}>{stats.averageSemestersPerUser}</div>
                  <div className={styles.engagementLabel}>Semestres por Usuario</div>
                  <div className={styles.engagementSubtext}>
                    {stats.totalSemesters} total
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
