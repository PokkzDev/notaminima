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
  // faChalkboardTeacher,
  faLightbulb,
  faUserPlus,
  faCalendarDay,
  faCalendarWeek
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import styles from './Admin.module.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

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
  }, [status, session]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
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
          font: { size: 11 },
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
          font: { size: 11 },
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

  // Chart data for last 7 days
  const last7DaysChartData = useMemo(() => {
    if (!stats?.last7DaysData) return null;
    return {
      labels: stats.last7DaysData.map(d => d.label),
      datasets: [{
        label: 'Cuentas Registradas',
        data: stats.last7DaysData.map(d => d.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }]
    };
  }, [stats?.last7DaysData]);

  // Chart data for last 12 months
  const last12MonthsChartData = useMemo(() => {
    if (!stats?.last12MonthsData) return null;
    return {
      labels: stats.last12MonthsData.map(d => d.label),
      datasets: [{
        label: 'Cuentas Registradas',
        data: stats.last12MonthsData.map(d => d.count),
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderColor: '#8b5cf6',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#8b5cf6'
      }]
    };
  }, [stats?.last12MonthsData]);

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

        {stats && (
          <>
            {/* Main Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Total Usuarios</span>
                  <span className={styles.statValue}>{stats.totalUsers}</span>
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
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Total Semestres</span>
                  <span className={styles.statValue}>{stats.totalSemesters}</span>
                </div>
              </div>
            </div>

            {/* Registration Stats Section */}
            <div className={styles.registrationSection}>
              <h2 className={styles.sectionTitle}>
                <FontAwesomeIcon icon={faUserPlus} />
                Cuentas Registradas
              </h2>
              
              {/* Registration Quick Stats */}
              <div className={styles.registrationQuickStats}>
                <div className={styles.registrationStatCard}>
                  <div className={styles.registrationStatIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <FontAwesomeIcon icon={faCalendarDay} />
                  </div>
                  <div className={styles.registrationStatContent}>
                    <span className={styles.registrationStatValue}>{stats.usersToday}</span>
                    <span className={styles.registrationStatLabel}>Hoy</span>
                  </div>
                </div>
                <div className={styles.registrationStatCard}>
                  <div className={styles.registrationStatIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                    <FontAwesomeIcon icon={faCalendarWeek} />
                  </div>
                  <div className={styles.registrationStatContent}>
                    <span className={styles.registrationStatValue}>{stats.usersLast7Days}</span>
                    <span className={styles.registrationStatLabel}>Últimos 7 días</span>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className={styles.chartsRow}>
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3 className={styles.chartTitle}>
                      <FontAwesomeIcon icon={faCalendarWeek} />
                      Últimos 7 días
                    </h3>
                    <span className={styles.chartBadge}>{stats.usersLast7Days} total</span>
                  </div>
                  <div className={styles.chartWrapper}>
                    {last7DaysChartData && <Bar data={last7DaysChartData} options={chartOptions} />}
                  </div>
                </div>

                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3 className={styles.chartTitle}>
                      <FontAwesomeIcon icon={faChartLine} />
                      Por Mes (12 meses)
                    </h3>
                    <span className={styles.chartBadge}>
                      {stats.last12MonthsData?.reduce((sum, d) => sum + d.count, 0) || 0} total
                    </span>
                  </div>
                  <div className={styles.chartWrapper}>
                    {last12MonthsChartData && <Line data={last12MonthsChartData} options={chartOptions} />}
                  </div>
                </div>
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
                {/* <div className={styles.roleCard}>
                  <div className={styles.roleIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <FontAwesomeIcon icon={faChalkboardTeacher} />
                  </div>
                  <div className={styles.roleInfo}>
                    <span className={styles.roleName}>Profesores</span>
                    <span className={styles.roleCount}>{stats.roleDistribution.TEACHER || 0}</span>
                  </div>
                </div> */}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
