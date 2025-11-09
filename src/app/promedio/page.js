'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faTrash, 
  faEdit, 
  faCheck, 
  faTimes,
  faBook,
  faCalculator,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import AdSense from '../components/AdSense';
import styles from './Promedio.module.css';

export default function Promedio() {
  const { data: session, status } = useSession();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nuevoCursoNombre, setNuevoCursoNombre] = useState('');
  const [mostrarFormCurso, setMostrarFormCurso] = useState(false);
  const [editandoCurso, setEditandoCurso] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [confirmarEliminarCurso, setConfirmarEliminarCurso] = useState(null);
  const [confirmarEliminarNota, setConfirmarEliminarNota] = useState(null);
  const [simuladorAbierto, setSimuladorAbierto] = useState({});
  const [modoSimulador, setModoSimulador] = useState({});
  const [targetPromedio, setTargetPromedio] = useState({});
  const [notaSimulada, setNotaSimulada] = useState({});
  const saveTimeoutRef = useRef(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login';
    }
  }, [status]);

  // Load cursos from API
  useEffect(() => {
    if (status === 'authenticated') {
      loadCursos();
    }
  }, [status]);

  const loadCursos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/promedios');
      if (response.ok) {
        const data = await response.json();
        // Convert from database format to component format
        const cursosFormatted = data.promedios.map(p => ({
          id: p.id,
          nombre: p.nombre,
          notas: p.notas || []
        }));
        setCursos(cursosFormatted);
      } else {
        console.error('Error loading cursos');
      }
    } catch (error) {
      console.error('Error loading cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarCurso = async () => {
    if (nuevoCursoNombre.trim() === '') return;

    try {
      setSaving(true);
      const response = await fetch('/api/promedios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nuevoCursoNombre.trim(),
          notas: []
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const nuevoCurso = {
          id: data.promedio.id,
          nombre: data.promedio.nombre,
          notas: data.promedio.notas || []
        };
        setCursos([...cursos, nuevoCurso]);
        setNuevoCursoNombre('');
        setMostrarFormCurso(false);
      } else {
        const errorData = await response.json();
        alert('Error al crear curso: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error creating curso:', error);
      alert('Error al crear curso');
    } finally {
      setSaving(false);
    }
  };

  const eliminarCurso = async (cursoId) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/promedios/${cursoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCursos(cursos.filter(curso => curso.id !== cursoId));
        setConfirmarEliminarCurso(null);
      } else {
        const errorData = await response.json();
        alert('Error al eliminar curso: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error deleting curso:', error);
      alert('Error al eliminar curso');
    } finally {
      setSaving(false);
    }
  };

  const iniciarEdicionCurso = (curso) => {
    setEditandoCurso(curso.id);
    setNombreEditado(curso.nombre);
  };

  const guardarEdicionCurso = async (cursoId) => {
    if (nombreEditado.trim() === '') {
      cancelarEdicionCurso();
      return;
    }

    try {
      setSaving(true);
      const curso = cursos.find(c => c.id === cursoId);
      const response = await fetch(`/api/promedios/${cursoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombreEditado.trim(),
          notas: curso.notas
        }),
      });

      if (response.ok) {
        setCursos(cursos.map(curso => 
          curso.id === cursoId 
            ? { ...curso, nombre: nombreEditado.trim() }
            : curso
        ));
        setEditandoCurso(null);
        setNombreEditado('');
      } else {
        const errorData = await response.json();
        alert('Error al actualizar curso: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error updating curso:', error);
      alert('Error al actualizar curso');
    } finally {
      setSaving(false);
    }
  };

  const cancelarEdicionCurso = () => {
    setEditandoCurso(null);
    setNombreEditado('');
  };

  const agregarNota = (cursoId) => {
    setCursos(cursos.map(curso => {
      if (curso.id === cursoId) {
        return {
          ...curso,
          notas: [...curso.notas, { id: Date.now(), valor: '', ponderacion: '' }]
        };
      }
      return curso;
    }));
  };

  const validarYFormatearNota = (valor) => {
    if (valor === '') return '';
    
    let numero = parseFloat(valor);
    
    // Si el número es mayor a 10, asumimos que olvidó el punto decimal
    if (numero >= 10 && numero <= 70) {
      numero = numero / 10;
    }
    
    // Limitar entre 1.0 y 7.0
    if (numero < 1.0) numero = 1.0;
    if (numero > 7.0) numero = 7.0;
    
    return numero.toFixed(1);
  };

  const validarPonderacion = (valor) => {
    if (valor === '') return '';
    
    let numero = parseFloat(valor);
    
    // No permitir valores negativos o mayores a 100
    if (numero < 0) numero = 0;
    if (numero > 100) numero = 100;
    
    return numero.toString();
  };

  const actualizarNota = (cursoId, notaId, campo, valor) => {
    const updatedCursos = cursos.map(curso => {
      if (curso.id === cursoId) {
        return {
          ...curso,
          notas: curso.notas.map(nota =>
            nota.id === notaId ? { ...nota, [campo]: valor } : nota
          )
        };
      }
      return curso;
    });
    setCursos(updatedCursos);
    // Debounce save to API
    debounceSaveCurso(cursoId, updatedCursos.find(c => c.id === cursoId));
  };

  const debounceSaveCurso = (cursoId, curso) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveCurso(cursoId, curso);
    }, 1000);
  };

  const saveCurso = async (cursoId, curso) => {
    try {
      await fetch(`/api/promedios/${cursoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: curso.nombre,
          notas: curso.notas
        }),
      });
    } catch (error) {
      console.error('Error saving curso:', error);
    }
  };

  const manejarBlurNota = (cursoId, notaId, valor) => {
    if (valor !== '') {
      const valorFormateado = validarYFormatearNota(valor);
      actualizarNota(cursoId, notaId, 'valor', valorFormateado);
    }
  };

  const manejarBlurPonderacion = (cursoId, notaId, valor) => {
    if (valor !== '') {
      const valorValidado = validarPonderacion(valor);
      actualizarNota(cursoId, notaId, 'ponderacion', valorValidado);
    }
  };

  const esNotaInvalida = (valor) => {
    if (valor === '') return false;
    const num = parseFloat(valor);
    return isNaN(num) || num < 1.0 || num > 7.0;
  };

  const esPonderacionInvalida = (valor) => {
    if (valor === '') return false;
    const num = parseFloat(valor);
    return isNaN(num) || num < 0 || num > 100;
  };

  const eliminarNota = (cursoId, notaId) => {
    const updatedCursos = cursos.map(curso => {
      if (curso.id === cursoId) {
        return {
          ...curso,
          notas: curso.notas.filter(nota => nota.id !== notaId)
        };
      }
      return curso;
    });
    setCursos(updatedCursos);
    setConfirmarEliminarNota(null);
    const curso = updatedCursos.find(c => c.id === cursoId);
    saveCurso(cursoId, curso);
  };

  const calcularPromedio = (notas) => {
    const notasValidas = notas.filter(
      nota => nota.valor !== '' && nota.ponderacion !== '' && 
              !isNaN(parseFloat(nota.valor)) && !isNaN(parseFloat(nota.ponderacion))
    );

    if (notasValidas.length === 0) return null;

    let sumaProductos = 0;

    notasValidas.forEach(nota => {
      const valor = parseFloat(nota.valor);
      const ponderacion = parseFloat(nota.ponderacion);
      sumaProductos += valor * (ponderacion / 100);
    });

    return sumaProductos.toFixed(2);
  };

  const calcularPonderacionTotal = (notas) => {
    const notasValidas = notas.filter(
      nota => nota.ponderacion !== '' && !isNaN(parseFloat(nota.ponderacion))
    );

    return notasValidas.reduce((sum, nota) => sum + parseFloat(nota.ponderacion), 0).toFixed(0);
  };

  // Calcula la suma ponderada actual (sin dividir por 100)
  const calcularSumaPonderada = (notas) => {
    const notasValidas = notas.filter(
      nota => nota.valor !== '' && nota.ponderacion !== '' && 
              !isNaN(parseFloat(nota.valor)) && !isNaN(parseFloat(nota.ponderacion))
    );

    if (notasValidas.length === 0) return 0;

    return notasValidas.reduce((sum, nota) => {
      const valor = parseFloat(nota.valor);
      const ponderacion = parseFloat(nota.ponderacion);
      return sum + valor * (ponderacion / 100);
    }, 0);
  };

  // Calcula la nota requerida para alcanzar un promedio objetivo
  const calcularNotaRequerida = (notas, targetPromedio) => {
    const sumaPonderada = calcularSumaPonderada(notas);
    const ponderacionTotal = parseFloat(calcularPonderacionTotal(notas));
    const ponderacionRestante = 100 - ponderacionTotal;

    if (ponderacionRestante <= 0) return null;

    const notaRequerida = (targetPromedio * 100 - sumaPonderada * 100) / ponderacionRestante;

    // Validar que la nota requerida esté en el rango válido
    if (notaRequerida < 1.0) return { valor: 1.0, imposible: true, mensaje: 'El promedio objetivo es muy bajo. No es posible alcanzarlo con las notas actuales.' };
    if (notaRequerida > 7.0) return { valor: 7.0, imposible: true, mensaje: 'El promedio objetivo es muy alto. Se requiere una nota mayor a 7.0 para alcanzarlo.' };
    
    return { valor: notaRequerida, imposible: false };
  };

  // Calcula el promedio final si se obtiene una nota específica
  const calcularPromedioSimulado = (notas, notaSimulada) => {
    const sumaPonderada = calcularSumaPonderada(notas);
    const ponderacionTotal = parseFloat(calcularPonderacionTotal(notas));
    const ponderacionRestante = 100 - ponderacionTotal;

    if (ponderacionRestante <= 0) return null;

    const promedioFinal = sumaPonderada + (notaSimulada * (ponderacionRestante / 100));

    return promedioFinal;
  };

  // Funciones para manejar el simulador
  const toggleSimulador = (cursoId) => {
    setSimuladorAbierto(prev => ({
      ...prev,
      [cursoId]: !prev[cursoId]
    }));
    // Inicializar modo si no existe
    if (!modoSimulador[cursoId]) {
      setModoSimulador(prev => ({
        ...prev,
        [cursoId]: 'target'
      }));
    }
  };

  const cambiarModoSimulador = (cursoId, modo) => {
    setModoSimulador(prev => ({
      ...prev,
      [cursoId]: modo
    }));
  };

  const actualizarTargetPromedio = (cursoId, valor) => {
    const num = parseFloat(valor);
    if (valor === '' || (!isNaN(num) && num >= 1.0 && num <= 7.0)) {
      setTargetPromedio(prev => ({
        ...prev,
        [cursoId]: valor
      }));
    }
  };

  const actualizarNotaSimulada = (cursoId, valor) => {
    const num = parseFloat(valor);
    if (valor === '' || (!isNaN(num) && num >= 1.0 && num <= 7.0)) {
      setNotaSimulada(prev => ({
        ...prev,
        [cursoId]: valor
      }));
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Calculadora de Promedio Ponderado',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CLP',
    },
    description: 'Calcula tu promedio de notas ponderado. Gestiona múltiples cursos y calcula automáticamente tu promedio académico.',
    url: 'https://notaminima.cl/promedio',
    featureList: [
      'Gestión de múltiples cursos',
      'Cálculo de promedio ponderado',
    ],
  };

  return (
    <>
      <Script
        id="json-ld-promedio"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className={styles.main}>
      <div className={styles.container}>
        {loading && (
          <div className={styles.loadingContainer}>
            <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
            <p>Cargando tus cursos...</p>
          </div>
        )}

        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <FontAwesomeIcon icon={faCalculator} />
          </div>
          <h1 className={styles.title}>Promedio de Notas</h1>
          <p className={styles.subtitle}>
            Administra tus cursos y calcula tu promedio ponderado
          </p>
        </header>

        <div className={styles.adContainer}>
          <AdSense adSlot="" adFormat="auto" />
        </div>

        <div className={styles.content}>
          {!loading && cursos.length === 0 && !mostrarFormCurso && (
            <div className={styles.emptyState}>
              <FontAwesomeIcon icon={faBook} className={styles.emptyIcon} />
              <p className={styles.emptyText}>No tienes cursos agregados</p>
              <p className={styles.emptySubtext}>Comienza agregando tu primer curso</p>
            </div>
          )}

          {cursos.length > 0 && (
            <div className={styles.resumenSection}>
              <h2 className={styles.resumenTitle}>Resumen de Cursos</h2>
              <div className={styles.resumenGrid}>
                {cursos.map(curso => {
                  const promedio = calcularPromedio(curso.notas);
                  const promedioNum = promedio ? parseFloat(promedio) : null;
                  const ponderacionTotal = parseFloat(calcularPonderacionTotal(curso.notas));
                  
                  // Determinar estado y clase
                  let estadoTexto = '';
                  let claseEstado = styles.resumenCardNeutral;
                  
                  if (promedioNum !== null) {
                    if (ponderacionTotal === 100) {
                      // Curso completo
                      if (promedioNum >= 4.0) {
                        estadoTexto = 'Aprobado';
                        claseEstado = styles.resumenCardAprobado;
                      } else {
                        estadoTexto = 'Reprobado';
                        claseEstado = styles.resumenCardReprobado;
                      }
                    } else {
                      // Curso incompleto
                      if (promedioNum >= 4.0) {
                        estadoTexto = 'En Progreso';
                        claseEstado = styles.resumenCardAprobado;
                      } else {
                        estadoTexto = 'Bajo 4.0';
                        claseEstado = styles.resumenCardEnRiesgo;
                      }
                    }
                  }

                  return (
                    <div 
                      key={curso.id} 
                      className={`${styles.resumenCard} ${claseEstado}`}
                    >
                      <div className={styles.resumenCardHeader}>
                        <h3 className={styles.resumenCardNombre}>{curso.nombre}</h3>
                      </div>
                      <div className={styles.resumenCardBody}>
                        <div className={styles.resumenPromedioContainer}>
                          <span className={styles.resumenPromedioLabel}>Promedio</span>
                          <span className={styles.resumenPromedioValue}>
                            {promedioNum !== null ? promedioNum.toFixed(2) : '-'}
                          </span>
                        </div>
                        <div className={styles.resumenInfo}>
                          <span className={styles.resumenInfoLabel}>
                            {ponderacionTotal}% evaluado
                          </span>
                          {estadoTexto && (
                            <span className={styles.resumenEstado}>
                              {estadoTexto}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.cursosContainer}>
            {cursos.map(curso => {
              const promedio = calcularPromedio(curso.notas);
              const ponderacionTotal = calcularPonderacionTotal(curso.notas);

              return (
                <div key={curso.id} className={styles.cursoCard}>
                  <div className={styles.cursoHeader}>
                    <div className={styles.cursoTitleSection}>
                      {editandoCurso === curso.id ? (
                        <div className={styles.editarCursoForm}>
                          <input
                            type="text"
                            value={nombreEditado}
                            onChange={(e) => setNombreEditado(e.target.value)}
                            className={styles.editarCursoInput}
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') guardarEdicionCurso(curso.id);
                            }}
                          />
                          <button
                            onClick={() => guardarEdicionCurso(curso.id)}
                            className={styles.iconButton}
                            title="Guardar"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            onClick={cancelarEdicionCurso}
                            className={styles.iconButton}
                            title="Cancelar"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h2 className={styles.cursoNombre}>{curso.nombre}</h2>
                          <button
                            onClick={() => iniciarEdicionCurso(curso)}
                            className={styles.iconButton}
                            title="Editar nombre"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </>
                      )}
                    </div>
                    <div className={styles.cursoActions}>
                      <div className={styles.promediosContainer}>
                        <div className={styles.promedioDisplay}>
                          <div className={styles.promedioInfo}>
                            <span className={styles.promedioLabel}>Promedio Acumulado</span>
                            <span className={styles.promedioSubLabel}>
                              ({ponderacionTotal}% evaluado)
                            </span>
                          </div>
                          <span className={styles.promedioValue}>
                            {promedio !== null ? promedio : '-'}
                          </span>
                        </div>
                      </div>
                      {confirmarEliminarCurso === curso.id ? (
                        <div className={styles.confirmDeleteGroup}>
                          <span className={styles.confirmText}>¿Eliminar?</span>
                          <button
                            onClick={() => eliminarCurso(curso.id)}
                            className={styles.confirmButton}
                            title="Confirmar"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            onClick={() => setConfirmarEliminarCurso(null)}
                            className={styles.cancelButton}
                            title="Cancelar"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmarEliminarCurso(curso.id)}
                          className={styles.deleteButton}
                          title="Eliminar curso"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={styles.notasSection}>
                    {curso.notas.length > 0 ? (
                      <>
                        <div className={styles.notasHeader}>
                          <span className={styles.notaHeaderItem}>Nota</span>
                          <span className={styles.notaHeaderItem}>Ponderación (%)</span>
                          <span className={styles.notaHeaderItem}>Acciones</span>
                        </div>
                        {curso.notas.map(nota => (
                          <div key={nota.id} className={styles.notaRow}>
                            <input
                              type="number"
                              value={nota.valor}
                              onChange={(e) => actualizarNota(curso.id, nota.id, 'valor', e.target.value)}
                              onBlur={(e) => manejarBlurNota(curso.id, nota.id, e.target.value)}
                              placeholder="1.0 - 7.0"
                              min="1.0"
                              max="7.0"
                              step="0.1"
                              className={`${styles.notaInput} ${esNotaInvalida(nota.valor) ? styles.inputError : ''}`}
                            />
                            <input
                              type="number"
                              value={nota.ponderacion}
                              onChange={(e) => actualizarNota(curso.id, nota.id, 'ponderacion', e.target.value)}
                              onBlur={(e) => manejarBlurPonderacion(curso.id, nota.id, e.target.value)}
                              placeholder="0 - 100"
                              min="0"
                              max="100"
                              step="1"
                              className={`${styles.notaInput} ${esPonderacionInvalida(nota.ponderacion) ? styles.inputError : ''}`}
                            />
                            {confirmarEliminarNota === `${curso.id}-${nota.id}` ? (
                              <div className={styles.confirmDeleteNotaGroup}>
                                <button
                                  onClick={() => eliminarNota(curso.id, nota.id)}
                                  className={styles.confirmNotaButton}
                                  title="Confirmar"
                                >
                                  <FontAwesomeIcon icon={faCheck} />
                                </button>
                                <button
                                  onClick={() => setConfirmarEliminarNota(null)}
                                  className={styles.cancelNotaButton}
                                  title="Cancelar"
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmarEliminarNota(`${curso.id}-${nota.id}`)}
                                className={styles.deleteNotaButton}
                                title="Eliminar nota"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            )}
                          </div>
                        ))}
                        <div className={styles.ponderacionTotal}>
                          <span>Ponderación Total: {ponderacionTotal}%</span>
                          {parseFloat(ponderacionTotal) !== 100 && (
                            <span className={styles.ponderacionWarning}>
                              {parseFloat(ponderacionTotal) < 100 
                                ? '(Falta ' + (100 - parseFloat(ponderacionTotal)) + '%)' 
                                : '(Excede en ' + (parseFloat(ponderacionTotal) - 100) + '%)'}
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className={styles.sinNotas}>No hay notas agregadas</p>
                    )}

                    <button
                      onClick={() => agregarNota(curso.id)}
                      className={styles.agregarNotaButton}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      Agregar Nota
                    </button>
                  </div>

                  {/* Simulador de Notas */}
                  {parseFloat(ponderacionTotal) < 100 && (
                    <div className={styles.simuladorSection}>
                      <button
                        onClick={() => toggleSimulador(curso.id)}
                        className={styles.simuladorToggle}
                      >
                        <FontAwesomeIcon icon={faCalculator} />
                        {simuladorAbierto[curso.id] ? 'Ocultar Simulador' : 'Simulador de Notas'}
                      </button>

                      {simuladorAbierto[curso.id] && (
                        <div className={styles.simuladorContent}>
                          <div className={styles.simuladorModos}>
                            <button
                              onClick={() => cambiarModoSimulador(curso.id, 'target')}
                              className={`${styles.modoButton} ${modoSimulador[curso.id] === 'target' ? styles.modoButtonActive : ''}`}
                            >
                              Nota Requerida
                            </button>
                            <button
                              onClick={() => cambiarModoSimulador(curso.id, 'simulate')}
                              className={`${styles.modoButton} ${modoSimulador[curso.id] === 'simulate' ? styles.modoButtonActive : ''}`}
                            >
                              Simular Nota
                            </button>
                          </div>

                          <div className={styles.simuladorInfo}>
                            <span className={styles.simuladorInfoText}>
                              Ponderación restante: {100 - parseFloat(ponderacionTotal)}%
                            </span>
                          </div>

                          {modoSimulador[curso.id] === 'target' && (
                            <div className={styles.simuladorModeContent}>
                              <label className={styles.simuladorLabel}>
                                ¿Qué promedio quieres alcanzar?
                              </label>
                              <input
                                type="number"
                                value={targetPromedio[curso.id] || ''}
                                onChange={(e) => actualizarTargetPromedio(curso.id, e.target.value)}
                                placeholder="1.0 - 7.0"
                                min="1.0"
                                max="7.0"
                                step="0.1"
                                className={styles.simuladorInput}
                              />
                              {targetPromedio[curso.id] && !isNaN(parseFloat(targetPromedio[curso.id])) && (
                                <div className={styles.simuladorResultado}>
                                  {(() => {
                                    const resultado = calcularNotaRequerida(curso.notas, parseFloat(targetPromedio[curso.id]));
                                    if (!resultado) {
                                      return (
                                        <div className={styles.simuladorMensaje}>
                                          <span className={styles.simuladorMensajeTexto}>
                                            No hay evaluación restante para calcular
                                          </span>
                                        </div>
                                      );
                                    }
                                    if (resultado.imposible) {
                                      return (
                                        <div className={styles.simuladorMensaje}>
                                          <span className={styles.simuladorMensajeTexto}>
                                            {resultado.mensaje}
                                          </span>
                                          <span className={styles.simuladorMensajeNota}>
                                            Nota mínima requerida: {resultado.valor.toFixed(2)}
                                          </span>
                                        </div>
                                      );
                                    }
                                    const notaRequerida = resultado.valor;
                                    const esAprobado = notaRequerida >= 4.0;
                                    return (
                                      <>
                                        <span className={styles.simuladorResultadoLabel}>Necesitas obtener:</span>
                                        <span className={`${styles.simuladorResultadoValor} ${esAprobado ? styles.simuladorResultadoAprobado : styles.simuladorResultadoReprobado}`}>
                                          {notaRequerida.toFixed(2)}
                                        </span>
                                        <span className={`${styles.simuladorResultadoEstado} ${esAprobado ? styles.simuladorEstadoAprobado : styles.simuladorEstadoReprobado}`}>
                                          {esAprobado ? 'Aprobado' : 'Reprobado'}
                                        </span>
                                      </>
                                    );
                                  })()}
                                </div>
                              )}
                            </div>
                          )}

                          {modoSimulador[curso.id] === 'simulate' && (
                            <div className={styles.simuladorModeContent}>
                              <label className={styles.simuladorLabel}>
                                ¿Qué nota obtendrías?
                              </label>
                              <input
                                type="number"
                                value={notaSimulada[curso.id] || ''}
                                onChange={(e) => actualizarNotaSimulada(curso.id, e.target.value)}
                                placeholder="1.0 - 7.0"
                                min="1.0"
                                max="7.0"
                                step="0.1"
                                className={styles.simuladorInput}
                              />
                              {notaSimulada[curso.id] && !isNaN(parseFloat(notaSimulada[curso.id])) && (
                                <div className={styles.simuladorResultado}>
                                  {(() => {
                                    const promedioFinal = calcularPromedioSimulado(curso.notas, parseFloat(notaSimulada[curso.id]));
                                    if (promedioFinal === null) {
                                      return (
                                        <div className={styles.simuladorMensaje}>
                                          <span className={styles.simuladorMensajeTexto}>
                                            No hay evaluación restante para calcular
                                          </span>
                                        </div>
                                      );
                                    }
                                    const esAprobado = promedioFinal >= 4.0;
                                    return (
                                      <>
                                        <span className={styles.simuladorResultadoLabel}>Tu promedio final sería:</span>
                                        <span className={`${styles.simuladorResultadoValor} ${esAprobado ? styles.simuladorResultadoAprobado : styles.simuladorResultadoReprobado}`}>
                                          {promedioFinal.toFixed(2)}
                                        </span>
                                        <span className={`${styles.simuladorResultadoEstado} ${esAprobado ? styles.simuladorEstadoAprobado : styles.simuladorEstadoReprobado}`}>
                                          {esAprobado ? 'Aprobado' : 'Reprobado'}
                                        </span>
                                      </>
                                    );
                                  })()}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.agregarCursoSection}>
            {mostrarFormCurso ? (
              <div className={styles.agregarCursoForm}>
                <input
                  type="text"
                  value={nuevoCursoNombre}
                  onChange={(e) => setNuevoCursoNombre(e.target.value)}
                  placeholder="Nombre del curso"
                  className={styles.cursoInput}
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') agregarCurso();
                  }}
                />
                <button onClick={agregarCurso} className={styles.confirmarButton}>
                  <FontAwesomeIcon icon={faCheck} />
                  Agregar
                </button>
                <button
                  onClick={() => {
                    setMostrarFormCurso(false);
                    setNuevoCursoNombre('');
                  }}
                  className={styles.cancelarButton}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setMostrarFormCurso(true)}
                className={styles.nuevoCursoButton}
              >
                <FontAwesomeIcon icon={faPlus} />
                Nuevo Curso
              </button>
            )}
          </div>

        </div>
      </div>
      </main>
    </>
  );
}
