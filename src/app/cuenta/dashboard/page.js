'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faGraduationCap,
  faBook,
  faCheckCircle,
  faTimesCircle,
  faTrophy,
  faExclamationTriangle,
  faSpinner,
  faArrowUp,
  faArrowDown,
  faMinus
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

// Pure helper functions for calculating stats (outside component to avoid recreation)
const calcularPromedioCurso = (notas, examenFinal) => {
  const notasValidas = notas.filter(
    nota => nota.valor !== '' && nota.ponderacion !== '' &&
      !Number.isNaN(Number.parseFloat(nota.valor)) && !Number.isNaN(Number.parseFloat(nota.ponderacion))
  );

  if (notasValidas.length === 0) {
    if (examenFinal && examenFinal.valor !== '' && examenFinal.ponderacion !== '' &&
      !Number.isNaN(Number.parseFloat(examenFinal.valor)) && !Number.isNaN(Number.parseFloat(examenFinal.ponderacion))) {
      const valorExamen = Number.parseFloat(examenFinal.valor);
      const ponderacionExamen = Number.parseFloat(examenFinal.ponderacion);
      return valorExamen * (ponderacionExamen / 100);
    }
    return null;
  }

  let sumaProductos = 0;
  for (const nota of notasValidas) {
    const valor = Number.parseFloat(nota.valor);
    const ponderacion = Number.parseFloat(nota.ponderacion);
    sumaProductos += valor * (ponderacion / 100);
  }

  if (examenFinal && examenFinal.valor !== '' && examenFinal.ponderacion !== '' &&
    !Number.isNaN(Number.parseFloat(examenFinal.valor)) && !Number.isNaN(Number.parseFloat(examenFinal.ponderacion))) {
    const valorExamen = Number.parseFloat(examenFinal.valor);
    const ponderacionExamen = Number.parseFloat(examenFinal.ponderacion);
    const ponderacionNotasRegulares = 100 - ponderacionExamen;

    return (sumaProductos * (ponderacionNotasRegulares / 100)) +
      (valorExamen * (ponderacionExamen / 100));
  }

  return sumaProductos;
};

const calcularPonderacionTotal = (notas) => {
  const notasValidas = notas.filter(
    nota => nota.ponderacion !== '' && !Number.isNaN(Number.parseFloat(nota.ponderacion))
  );
  return notasValidas.reduce((sum, nota) => sum + Number.parseFloat(nota.ponderacion), 0);
};

const getCursoStatus = (nota, ponderacion) => {
  if (nota === null) return 'enProgreso';
  if (ponderacion < 100) return 'enProgreso';
  return nota >= 4 ? 'aprobado' : 'reprobado';
};

const calculateOverallStats = (allPromedios) => {
  const result = {
    totalCursos: allPromedios.length,
    cursosAprobados: 0,
    cursosReprobados: 0,
    cursosEnProgreso: 0,
    sumPromedios: 0,
    countPromediosValidos: 0,
    mejorNota: null,
    peorNota: null,
    mejorCurso: null,
    peorCurso: null
  };

  for (const promedio of allPromedios) {
    const nota = calcularPromedioCurso(promedio.notas || [], promedio.examenFinal);
    const ponderacion = calcularPonderacionTotal(promedio.notas || []);
    const status = getCursoStatus(nota, ponderacion);

    if (status === 'enProgreso') {
      result.cursosEnProgreso++;
      if (nota === null) continue;
    } else if (status === 'aprobado') {
      result.cursosAprobados++;
    } else {
      result.cursosReprobados++;
    }

    result.sumPromedios += nota;
    result.countPromediosValidos++;

    if (result.mejorNota === null || nota > result.mejorNota) {
      result.mejorNota = nota;
      result.mejorCurso = promedio.nombre;
    }
    if (result.peorNota === null || nota < result.peorNota) {
      result.peorNota = nota;
      result.peorCurso = promedio.nombre;
    }
  }

  return result;
};

const calculateSemesterStats = (semester, allPromedios) => {
  const semesterPromedios = allPromedios.filter(p => p.semesterId === semester.id);
  let semSum = 0;
  let semCount = 0;
  let semAprobados = 0;
  let semReprobados = 0;

  for (const promedio of semesterPromedios) {
    const nota = calcularPromedioCurso(promedio.notas || [], promedio.examenFinal);
    const ponderacion = calcularPonderacionTotal(promedio.notas || []);

    if (nota === null) continue;

    semSum += nota;
    semCount++;

    const status = getCursoStatus(nota, ponderacion);
    if (status === 'aprobado') semAprobados++;
    else if (status === 'reprobado') semReprobados++;
  }

  return {
    id: semester.id,
    nombre: semester.nombre,
    orden: semester.orden,
    totalCursos: semesterPromedios.length,
    promedio: semCount > 0 ? semSum / semCount : null,
    aprobados: semAprobados,
    reprobados: semReprobados
  };
};

const calculateTendencia = (semesterStats) => {
  if (semesterStats.length < 2) return null;
  const ultimo = semesterStats[semesterStats.length - 1];
  const penultimo = semesterStats[semesterStats.length - 2];
  if (ultimo.promedio === null || penultimo.promedio === null) return null;
  return ultimo.promedio - penultimo.promedio;
};

const calculateOrphanStats = (orphanPromedios) => {
  let orphanSum = 0;
  let orphanCount = 0;
  for (const promedio of orphanPromedios) {
    const nota = calcularPromedioCurso(promedio.notas || [], promedio.examenFinal);
    if (nota !== null) {
      orphanSum += nota;
      orphanCount++;
    }
  }
  return {
    total: orphanPromedios.length,
    promedio: orphanCount > 0 ? orphanSum / orphanCount : null
  };
};

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const calculateStats = useCallback((semesters, allPromedios, orphanPromedios) => {
    const overallStats = calculateOverallStats(allPromedios);
    const promedioGeneral = overallStats.countPromediosValidos > 0 
      ? overallStats.sumPromedios / overallStats.countPromediosValidos 
      : null;

    const semesterStats = semesters
      .map(semester => calculateSemesterStats(semester, allPromedios))
      .sort((a, b) => a.orden - b.orden);

    setStats({
      totalCursos: overallStats.totalCursos,
      cursosAprobados: overallStats.cursosAprobados,
      cursosReprobados: overallStats.cursosReprobados,
      cursosEnProgreso: overallStats.cursosEnProgreso,
      promedioGeneral,
      mejorNota: overallStats.mejorNota,
      peorNota: overallStats.peorNota,
      mejorCurso: overallStats.mejorCurso,
      peorCurso: overallStats.peorCurso,
      semesterStats,
      tendencia: calculateTendencia(semesterStats),
      orphanStats: calculateOrphanStats(orphanPromedios)
    });
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load semesters with promedios
      const semestersResponse = await fetch('/api/semesters');
      const semestersData = semestersResponse.ok ? await semestersResponse.json() : { semesters: [] };
      
      // Load all promedios (including orphans)
      const promediosResponse = await fetch('/api/promedios');
      const promediosData = promediosResponse.ok ? await promediosResponse.json() : { promedios: [] };
      
      // Load orphan promedios
      const orphanResponse = await fetch('/api/promedios?semesterId=null');
      const orphanData = orphanResponse.ok ? await orphanResponse.json() : { promedios: [] };
      
      // Calculate stats
      calculateStats(semestersData.semesters, promediosData.promedios, orphanData.promedios);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadDashboardData();
    }
  }, [status, loadDashboardData]);

  const getTendenciaIcon = () => {
    if (stats?.tendencia == null) return null;
    if (stats.tendencia > 0.1) return <FontAwesomeIcon icon={faArrowUp} className={styles.tendenciaUp} />;
    if (stats.tendencia < -0.1) return <FontAwesomeIcon icon={faArrowDown} className={styles.tendenciaDown} />;
    return <FontAwesomeIcon icon={faMinus} className={styles.tendenciaNeutral} />;
  };

  const getTendenciaText = () => {
    if (stats?.tendencia == null) return 'Sin datos';
    if (stats.tendencia > 0.1) return `+${stats.tendencia.toFixed(2)}`;
    if (stats.tendencia < -0.1) return stats.tendencia.toFixed(2);
    return 'Estable';
  };

  const getPromedioClass = (promedio) => {
    if (promedio == null) return '';
    return promedio >= 4 ? styles.promedioAprobado : styles.promedioReprobado;
  };

  if (status === 'loading' || loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
            <p>Cargando dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  // Determine which content to render
  const renderDashboardContent = () => {
    if (stats?.totalCursos === 0) {
      return (
        <div className={styles.emptyState}>
          <FontAwesomeIcon icon={faBook} className={styles.emptyIcon} />
          <p className={styles.emptyText}>No tienes cursos registrados</p>
          <p className={styles.emptySubtext}>
            Agrega tus cursos en la sección de Promedio para ver tus estadísticas
          </p>
        </div>
      );
    }

    if (!stats) {
      return null;
    }

    return (
      <>
            {/* Main Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Promedio General</span>
                  <span className={styles.statValue}>
                    {stats.promedioGeneral === null ? '-' : stats.promedioGeneral.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Cursos Aprobados</span>
                  <span className={styles.statValue}>{stats.cursosAprobados}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                  <FontAwesomeIcon icon={faTimesCircle} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Cursos Reprobados</span>
                  <span className={styles.statValue}>{stats.cursosReprobados}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <FontAwesomeIcon icon={faBook} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>En Progreso</span>
                  <span className={styles.statValue}>{stats.cursosEnProgreso}</span>
                </div>
              </div>
            </div>

            {/* Highlights Section */}
            <div className={styles.highlightsSection}>
              <h2 className={styles.sectionTitle}>Destacados</h2>
              <div className={styles.highlightsGrid}>
                {stats.mejorCurso && (
                  <div className={styles.highlightCard}>
                    <FontAwesomeIcon icon={faTrophy} className={styles.highlightIconGold} />
                    <div className={styles.highlightContent}>
                      <span className={styles.highlightLabel}>Mejor Nota</span>
                      <span className={styles.highlightValue}>{stats.mejorNota?.toFixed(2)}</span>
                      <span className={styles.highlightCurso}>{stats.mejorCurso}</span>
                    </div>
                  </div>
                )}

                {stats.peorCurso && stats.peorNota !== stats.mejorNota && (
                  <div className={styles.highlightCard}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={styles.highlightIconWarning} />
                    <div className={styles.highlightContent}>
                      <span className={styles.highlightLabel}>Nota más Baja</span>
                      <span className={styles.highlightValue}>{stats.peorNota?.toFixed(2)}</span>
                      <span className={styles.highlightCurso}>{stats.peorCurso}</span>
                    </div>
                  </div>
                )}

                {stats.semesterStats.length >= 2 && (
                  <div className={styles.highlightCard}>
                    {getTendenciaIcon()}
                    <div className={styles.highlightContent}>
                      <span className={styles.highlightLabel}>Tendencia</span>
                      <span className={styles.highlightValue}>{getTendenciaText()}</span>
                      <span className={styles.highlightCurso}>vs semestre anterior</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Semester Breakdown */}
            {stats.semesterStats.length > 0 && (
              <div className={styles.semesterSection}>
                <h2 className={styles.sectionTitle}>Rendimiento por Semestre</h2>
                <div className={styles.semesterGrid}>
                  {stats.semesterStats.map(semester => (
                    <div key={semester.id} className={styles.semesterCard}>
                      <div className={styles.semesterHeader}>
                        <FontAwesomeIcon icon={faGraduationCap} className={styles.semesterIcon} />
                        <h3 className={styles.semesterName}>{semester.nombre}</h3>
                      </div>
                      <div className={styles.semesterBody}>
                        <div className={styles.semesterStat}>
                          <span className={styles.semesterStatLabel}>Promedio</span>
                          <span className={`${styles.semesterStatValue} ${getPromedioClass(semester.promedio)}`}>
                            {semester.promedio == null ? '-' : semester.promedio.toFixed(2)}
                          </span>
                        </div>
                        <div className={styles.semesterStats}>
                          <div className={styles.semesterMiniStat}>
                            <span className={styles.miniStatValue}>{semester.totalCursos}</span>
                            <span className={styles.miniStatLabel}>Cursos</span>
                          </div>
                          <div className={styles.semesterMiniStat}>
                            <span className={`${styles.miniStatValue} ${styles.aprobadoColor}`}>{semester.aprobados}</span>
                            <span className={styles.miniStatLabel}>Aprobados</span>
                          </div>
                          <div className={styles.semesterMiniStat}>
                            <span className={`${styles.miniStatValue} ${styles.reprobadoColor}`}>{semester.reprobados}</span>
                            <span className={styles.miniStatLabel}>Reprobados</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orphan cursos info */}
            {stats.orphanStats.total > 0 && (
              <div className={styles.orphanSection}>
                <p className={styles.orphanText}>
                  Tienes <strong>{stats.orphanStats.total}</strong> curso(s) sin asignar a un semestre
                  {stats.orphanStats.promedio !== null && (
                    <> con promedio <strong>{stats.orphanStats.promedio.toFixed(2)}</strong></>
                  )}
                </p>
              </div>
            )}
          </>
    );
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <h1 className={styles.title}>Dashboard Académico</h1>
          <p className={styles.subtitle}>
            Resumen de tu rendimiento académico
          </p>
        </header>

        {renderDashboardContent()}
      </div>
    </main>
  );
}
