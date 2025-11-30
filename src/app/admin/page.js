'use client';

import { useState, useEffect } from 'react';
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
  faUserPlus,
  faListAlt
} from '@fortawesome/free-solid-svg-icons';
import styles from './Admin.module.css';

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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
  };

  const getMaxCount = () => {
    if (!stats?.registrationTrend) return 1;
    const max = Math.max(...stats.registrationTrend.map(d => d.count));
    return max > 0 ? max : 1;
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
                  <span className={styles.statSubtext}>{stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}% del total</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <FontAwesomeIcon icon={faUserClock} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Sin Verificar</span>
                  <span className={styles.statValue}>{stats.unverifiedUsers}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                  <FontAwesomeIcon icon={faBook} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Total Promedios</span>
                  <span className={styles.statValue}>{stats.totalPromedios}</span>
                  <span className={styles.statSubtext}>{stats.averagePromediosPerUser} por usuario</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Total Semestres</span>
                  <span className={styles.statValue}>{stats.totalSemesters}</span>
                  <span className={styles.statSubtext}>{stats.averageSemestersPerUser} por usuario</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                  <FontAwesomeIcon icon={faChartLine} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Usuarios Activos</span>
                  <span className={styles.statValue}>{stats.usersWithPromedios}</span>
                  <span className={styles.statSubtext}>con cursos registrados</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.activitySection}>
              <h2 className={styles.sectionTitle}>Actividad Reciente (7 días)</h2>
              <div className={styles.activityGrid}>
                <div className={styles.activityCard}>
                  <div className={styles.activityValue}>{stats.recentActivity.newUsers}</div>
                  <div className={styles.activityLabel}>Nuevos Usuarios</div>
                  <div className={styles.activityPeriod}>últimos 7 días</div>
                </div>
                <div className={styles.activityCard}>
                  <div className={styles.activityValue}>{stats.recentActivity.newPromedios}</div>
                  <div className={styles.activityLabel}>Nuevos Promedios</div>
                  <div className={styles.activityPeriod}>últimos 7 días</div>
                </div>
                <div className={styles.activityCard}>
                  <div className={styles.activityValue}>{stats.recentActivity.newSemesters}</div>
                  <div className={styles.activityLabel}>Nuevos Semestres</div>
                  <div className={styles.activityPeriod}>últimos 7 días</div>
                </div>
              </div>
            </div>

            {/* Registration Trend Chart */}
            <div className={styles.chartSection}>
              <h2 className={styles.sectionTitle}>Registros (últimos 30 días)</h2>
              <div className={styles.chartContainer}>
                <div className={styles.chart}>
                  {stats.registrationTrend.map((day, index) => (
                    <div
                      key={day.date}
                      className={styles.chartBar}
                      style={{
                        height: `${(day.count / getMaxCount()) * 100}%`
                      }}
                      data-tooltip={`${formatDate(day.date)}: ${day.count} registros`}
                      title={`${formatDate(day.date)}: ${day.count} registros`}
                    />
                  ))}
                </div>
                <div className={styles.chartLabels}>
                  <span className={styles.chartLabel}>
                    {formatDate(stats.registrationTrend[0]?.date)}
                  </span>
                  <span className={styles.chartLabel}>
                    {formatDate(stats.registrationTrend[14]?.date)}
                  </span>
                  <span className={styles.chartLabel}>
                    {formatDate(stats.registrationTrend[29]?.date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Role Distribution */}
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

            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <Link href="/admin/users" className={styles.quickActionLink}>
                <FontAwesomeIcon icon={faListAlt} />
                Ver todos los usuarios
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
