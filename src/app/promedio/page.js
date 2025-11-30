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
  faSpinner,
  faGraduationCap,
  faChevronLeft,
  faChevronRight,
  faFolder
} from '@fortawesome/free-solid-svg-icons';
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
  const [confirmarEliminarExamenFinal, setConfirmarEliminarExamenFinal] = useState(null);
  
  // Semester state
  const [semesters, setSemesters] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState(null); // null = "Sin Semestre"
  const [hasOrphanCursos, setHasOrphanCursos] = useState(false);
  const [nuevoSemestreNombre, setNuevoSemestreNombre] = useState('');
  const [mostrarFormSemestre, setMostrarFormSemestre] = useState(false);
  const [editandoSemestre, setEditandoSemestre] = useState(null);
  const [nombreSemestreEditado, setNombreSemestreEditado] = useState('');
  const [confirmarEliminarSemestre, setConfirmarEliminarSemestre] = useState(null);
  const [loadingSemesters, setLoadingSemesters] = useState(true);
  
  // Per-course debounce timers and abort controllers
  const saveTimeoutRefs = useRef({}); // { cursoId: timeoutId }
  const abortControllersRef = useRef({}); // { cursoId: AbortController }

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login';
    }
  }, [status]);

  // Load semesters and cursos from API
  useEffect(() => {
    if (status === 'authenticated') {
      loadSemesters();
    }
  }, [status]);

  // Load cursos when semester selection changes
  useEffect(() => {
    if (status === 'authenticated' && !loadingSemesters) {
      loadCursos(selectedSemesterId);
    }
  }, [selectedSemesterId, status, loadingSemesters]);

  // Cleanup: cancel pending requests and clear timers on unmount
  useEffect(() => {
    return () => {
      // Clear all pending debounce timers
      Object.values(saveTimeoutRefs.current).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
      saveTimeoutRefs.current = {};
      
      // Abort all pending requests
      Object.values(abortControllersRef.current).forEach(controller => {
        controller.abort();
      });
      abortControllersRef.current = {};
    };
  }, []);

  const loadSemesters = async () => {
    try {
      setLoadingSemesters(true);
      const response = await fetch('/api/semesters');
      if (response.ok) {
        const data = await response.json();
        setSemesters(data.semesters);
        
        // Check if there are orphan cursos (without semester)
        const orphanResponse = await fetch('/api/promedios?semesterId=null');
        if (orphanResponse.ok) {
          const orphanData = await orphanResponse.json();
          setHasOrphanCursos(orphanData.promedios.length > 0);
          
          // If there are orphan cursos and no semesters, show "Sin Semestre"
          // Otherwise, select first semester if available
          if (orphanData.promedios.length > 0) {
            setSelectedSemesterId(null);
          } else if (data.semesters.length > 0) {
            setSelectedSemesterId(data.semesters[0].id);
          }
        }
      }
    } catch (error) {
      console.error('Error loading semesters:', error);
    } finally {
      setLoadingSemesters(false);
    }
  };

  const loadCursos = async (semesterId) => {
    try {
      setLoading(true);
      const url = semesterId 
        ? `/api/promedios?semesterId=${semesterId}`
        : '/api/promedios?semesterId=null';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // Convert from database format to component format
        const cursosFormatted = data.promedios.map(p => ({
          id: p.id,
          nombre: p.nombre,
          notas: p.notas || [],
          examenFinal: p.examenFinal || null,
          semesterId: p.semesterId
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
          notas: [],
          examenFinal: null,
          semesterId: selectedSemesterId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const nuevoCurso = {
          id: data.promedio.id,
          nombre: data.promedio.nombre,
          notas: data.promedio.notas || [],
          examenFinal: data.promedio.examenFinal || null,
          semesterId: data.promedio.semesterId
        };
        setCursos([...cursos, nuevoCurso]);
        setNuevoCursoNombre('');
        setMostrarFormCurso(false);
        
        // Update orphan status if adding to "Sin Semestre"
        if (!selectedSemesterId) {
          setHasOrphanCursos(true);
        }
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
        const newCursos = cursos.filter(curso => curso.id !== cursoId);
        setCursos(newCursos);
        setConfirmarEliminarCurso(null);
        
        // Update orphan status if deleting from "Sin Semestre" and no more orphans
        if (!selectedSemesterId && newCursos.length === 0) {
          setHasOrphanCursos(false);
        }
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

  // Semester CRUD functions
  const agregarSemestre = async () => {
    if (nuevoSemestreNombre.trim() === '') return;

    try {
      setSaving(true);
      const response = await fetch('/api/semesters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nuevoSemestreNombre.trim()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSemesters([...semesters, data.semester]);
        setNuevoSemestreNombre('');
        setMostrarFormSemestre(false);
        // Auto-select the new semester
        setSelectedSemesterId(data.semester.id);
      } else {
        const errorData = await response.json();
        alert('Error al crear semestre: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error creating semester:', error);
      alert('Error al crear semestre');
    } finally {
      setSaving(false);
    }
  };

  const eliminarSemestre = async (semesterId, deleteCourses = false) => {
    try {
      setSaving(true);
      const url = deleteCourses 
        ? `/api/semesters/${semesterId}?deleteCourses=true`
        : `/api/semesters/${semesterId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSemesters(semesters.filter(s => s.id !== semesterId));
        setConfirmarEliminarSemestre(null);
        
        // If we deleted the selected semester, go to "Sin Semestre" or first available
        if (selectedSemesterId === semesterId) {
          const remainingSemesters = semesters.filter(s => s.id !== semesterId);
          if (!deleteCourses) {
            // Courses became orphans, show "Sin Semestre"
            setHasOrphanCursos(true);
            setSelectedSemesterId(null);
          } else if (remainingSemesters.length > 0) {
            setSelectedSemesterId(remainingSemesters[0].id);
          } else {
            setSelectedSemesterId(null);
          }
        }
      } else {
        const errorData = await response.json();
        alert('Error al eliminar semestre: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error deleting semester:', error);
      alert('Error al eliminar semestre');
    } finally {
      setSaving(false);
    }
  };

  const iniciarEdicionSemestre = (semestre) => {
    setEditandoSemestre(semestre.id);
    setNombreSemestreEditado(semestre.nombre);
  };

  const guardarEdicionSemestre = async (semesterId) => {
    if (nombreSemestreEditado.trim() === '') {
      cancelarEdicionSemestre();
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/semesters/${semesterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombreSemestreEditado.trim()
        }),
      });

      if (response.ok) {
        setSemesters(semesters.map(s => 
          s.id === semesterId 
            ? { ...s, nombre: nombreSemestreEditado.trim() }
            : s
        ));
        setEditandoSemestre(null);
        setNombreSemestreEditado('');
      } else {
        const errorData = await response.json();
        alert('Error al actualizar semestre: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error updating semester:', error);
      alert('Error al actualizar semestre');
    } finally {
      setSaving(false);
    }
  };

  const cancelarEdicionSemestre = () => {
    setEditandoSemestre(null);
    setNombreSemestreEditado('');
  };

  const moverCursoASemestre = async (cursoId, nuevoSemesterId) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/promedios/${cursoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          semesterId: nuevoSemesterId
        }),
      });

      if (response.ok) {
        // Remove from current view
        setCursos(cursos.filter(c => c.id !== cursoId));
        
        // Update orphan status if moving from "Sin Semestre"
        if (!selectedSemesterId) {
          const remainingCursos = cursos.filter(c => c.id !== cursoId);
          if (remainingCursos.length === 0) {
            setHasOrphanCursos(false);
          }
        }
      } else {
        const errorData = await response.json();
        alert('Error al mover curso: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error moving curso:', error);
      alert('Error al mover curso');
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
          notas: curso.notas,
          examenFinal: curso.examenFinal
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
    // Clear existing timeout for this course
    if (saveTimeoutRefs.current[cursoId]) {
      clearTimeout(saveTimeoutRefs.current[cursoId]);
    }
    
    // Cancel any in-flight request for this course
    if (abortControllersRef.current[cursoId]) {
      abortControllersRef.current[cursoId].abort();
    }
    
    // Set new timeout with increased delay
    saveTimeoutRefs.current[cursoId] = setTimeout(() => {
      saveCurso(cursoId, curso);
      // Clean up timeout reference after execution
      delete saveTimeoutRefs.current[cursoId];
    }, 1500);
  };

  const saveCurso = async (cursoId, curso) => {
    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllersRef.current[cursoId] = abortController;
    
    try {
      const response = await fetch(`/api/promedios/${cursoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: curso.nombre,
          notas: curso.notas,
          examenFinal: curso.examenFinal
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error || 'Error al guardar curso');
      }

      // Clean up abort controller on success
      delete abortControllersRef.current[cursoId];
    } catch (error) {
      // Don't show error if request was aborted (user is still typing)
      if (error.name === 'AbortError') {
        return;
      }
      
      console.error('Error saving curso:', error);
      // Show user-friendly error message
      alert(`Error al guardar cambios: ${error.message || 'Error desconocido'}`);
      
      // Clean up abort controller on error
      delete abortControllersRef.current[cursoId];
    }
  };

  // Funciones para manejar examen final
  const agregarExamenFinal = (cursoId) => {
    setCursos(cursos.map(curso => {
      if (curso.id === cursoId) {
        return {
          ...curso,
          examenFinal: { valor: '', ponderacion: '' }
        };
      }
      return curso;
    }));
  };

  const actualizarExamenFinal = (cursoId, campo, valor) => {
    const updatedCursos = cursos.map(curso => {
      if (curso.id === cursoId) {
        return {
          ...curso,
          examenFinal: curso.examenFinal 
            ? { ...curso.examenFinal, [campo]: valor }
            : { valor: '', ponderacion: '' }
        };
      }
      return curso;
    });
    setCursos(updatedCursos);
    debounceSaveCurso(cursoId, updatedCursos.find(c => c.id === cursoId));
  };

  const eliminarExamenFinal = (cursoId) => {
    const updatedCursos = cursos.map(curso => {
      if (curso.id === cursoId) {
        return {
          ...curso,
          examenFinal: null
        };
      }
      return curso;
    });
    setCursos(updatedCursos);
    setConfirmarEliminarExamenFinal(null);
    const curso = updatedCursos.find(c => c.id === cursoId);
    saveCurso(cursoId, curso);
  };

  const manejarBlurExamenFinalValor = (cursoId, valor) => {
    if (valor !== '') {
      const valorFormateado = validarYFormatearNota(valor);
      actualizarExamenFinal(cursoId, 'valor', valorFormateado);
    }
  };

  const manejarBlurExamenFinalPonderacion = (cursoId, valor) => {
    if (valor !== '') {
      const valorValidado = validarPonderacion(valor);
      actualizarExamenFinal(cursoId, 'ponderacion', valorValidado);
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

  // Calcula el promedio de las notas regulares (siempre deben sumar 100% entre ellas)
  const calcularPromedioNotasRegulares = (notas) => {
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

    return sumaProductos;
  };

  // Calcula el promedio final considerando examen final si existe
  const calcularPromedio = (notas, examenFinal) => {
    const promedioNotasRegulares = calcularPromedioNotasRegulares(notas);
    
    if (promedioNotasRegulares === null) {
      // Si no hay notas regulares válidas, solo puede calcularse si hay examen final
      if (examenFinal && examenFinal.valor !== '' && examenFinal.ponderacion !== '' &&
          !isNaN(parseFloat(examenFinal.valor)) && !isNaN(parseFloat(examenFinal.ponderacion))) {
        const valorExamen = parseFloat(examenFinal.valor);
        const ponderacionExamen = parseFloat(examenFinal.ponderacion);
        return (valorExamen * (ponderacionExamen / 100)).toFixed(2);
      }
      return null;
    }

    // Si hay examen final, calcular promedio combinado
    if (examenFinal && examenFinal.valor !== '' && examenFinal.ponderacion !== '' &&
        !isNaN(parseFloat(examenFinal.valor)) && !isNaN(parseFloat(examenFinal.ponderacion))) {
      const valorExamen = parseFloat(examenFinal.valor);
      const ponderacionExamen = parseFloat(examenFinal.ponderacion);
      const ponderacionNotasRegulares = 100 - ponderacionExamen;
      
      const promedioFinal = (promedioNotasRegulares * (ponderacionNotasRegulares / 100)) + 
                           (valorExamen * (ponderacionExamen / 100));
      return promedioFinal.toFixed(2);
    }

    // Si no hay examen final, retornar promedio de notas regulares
    return promedioNotasRegulares.toFixed(2);
  };

  const calcularPonderacionTotal = (notas) => {
    const notasValidas = notas.filter(
      nota => nota.ponderacion !== '' && !isNaN(parseFloat(nota.ponderacion))
    );

    return notasValidas.reduce((sum, nota) => sum + parseFloat(nota.ponderacion), 0).toFixed(0);
  };

  // Calcula la suma ponderada de las notas regulares (sin dividir por 100)
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
        {(loading || loadingSemesters) && (
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

        {/* Semester Selector */}
        {!loadingSemesters && (
          <div className={styles.semesterSection}>
            <div className={styles.semesterHeader}>
              <FontAwesomeIcon icon={faGraduationCap} className={styles.semesterIcon} />
              <h2 className={styles.semesterTitle}>Semestres</h2>
            </div>
            
            <div className={styles.semesterTabs}>
              {/* Sin Semestre tab - only show if there are orphan cursos */}
              {hasOrphanCursos && (
                <button
                  className={`${styles.semesterTab} ${selectedSemesterId === null ? styles.semesterTabActive : ''}`}
                  onClick={() => setSelectedSemesterId(null)}
                >
                  <FontAwesomeIcon icon={faFolder} />
                  <span>Sin Semestre</span>
                </button>
              )}
              
              {/* Semester tabs */}
              {semesters.map(semester => (
                <div key={semester.id} className={styles.semesterTabWrapper}>
                  {editandoSemestre === semester.id ? (
                    <div className={styles.editarSemestreForm}>
                      <input
                        type="text"
                        value={nombreSemestreEditado}
                        onChange={(e) => setNombreSemestreEditado(e.target.value)}
                        className={styles.editarSemestreInput}
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') guardarEdicionSemestre(semester.id);
                        }}
                      />
                      <button
                        onClick={() => guardarEdicionSemestre(semester.id)}
                        className={styles.semesterActionButton}
                        title="Guardar"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        onClick={cancelarEdicionSemestre}
                        className={styles.semesterActionButton}
                        title="Cancelar"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        className={`${styles.semesterTab} ${selectedSemesterId === semester.id ? styles.semesterTabActive : ''}`}
                        onClick={() => setSelectedSemesterId(semester.id)}
                      >
                        <FontAwesomeIcon icon={faGraduationCap} />
                        <span>{semester.nombre}</span>
                      </button>
                      {selectedSemesterId === semester.id && (
                        <div className={styles.semesterActions}>
                          <button
                            onClick={() => iniciarEdicionSemestre(semester)}
                            className={styles.semesterActionButton}
                            title="Editar nombre"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          {confirmarEliminarSemestre === semester.id ? (
                            <div className={styles.confirmDeleteSemestre}>
                              <span className={styles.confirmSemestreText}>¿Eliminar?</span>
                              <button
                                onClick={() => eliminarSemestre(semester.id, false)}
                                className={styles.confirmSemestreButton}
                                title="Mover cursos a Sin Semestre"
                              >
                                Mantener cursos
                              </button>
                              <button
                                onClick={() => eliminarSemestre(semester.id, true)}
                                className={styles.deleteSemestreButton}
                                title="Eliminar cursos también"
                              >
                                Eliminar todo
                              </button>
                              <button
                                onClick={() => setConfirmarEliminarSemestre(null)}
                                className={styles.cancelSemestreButton}
                                title="Cancelar"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmarEliminarSemestre(semester.id)}
                              className={styles.semesterDeleteButton}
                              title="Eliminar semestre"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              
              {/* Add semester button/form */}
              {mostrarFormSemestre ? (
                <div className={styles.agregarSemestreForm}>
                  <input
                    type="text"
                    value={nuevoSemestreNombre}
                    onChange={(e) => setNuevoSemestreNombre(e.target.value)}
                    placeholder="Ej: 2024-1"
                    className={styles.semestreInput}
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') agregarSemestre();
                    }}
                  />
                  <button onClick={agregarSemestre} className={styles.confirmarSemestreButton}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button
                    onClick={() => {
                      setMostrarFormSemestre(false);
                      setNuevoSemestreNombre('');
                    }}
                    className={styles.cancelarSemestreButton}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setMostrarFormSemestre(true)}
                  className={styles.nuevoSemestreButton}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Nuevo Semestre</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className={styles.content}>
          {!loading && !loadingSemesters && cursos.length === 0 && !mostrarFormCurso && (
            <div className={styles.emptyState}>
              <FontAwesomeIcon icon={faBook} className={styles.emptyIcon} />
              <p className={styles.emptyText}>
                {selectedSemesterId === null && !hasOrphanCursos 
                  ? 'Crea un semestre para comenzar'
                  : 'No tienes cursos agregados'}
              </p>
              <p className={styles.emptySubtext}>
                {selectedSemesterId === null && !hasOrphanCursos 
                  ? 'Organiza tus notas por semestre'
                  : 'Comienza agregando tu primer curso'}
              </p>
            </div>
          )}

          {cursos.length > 0 && (
            <div className={styles.resumenSection}>
              <div className={styles.resumenGrid}>
                {cursos.map(curso => {
                  const promedio = calcularPromedio(curso.notas, curso.examenFinal);
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
              const promedio = calcularPromedio(curso.notas, curso.examenFinal);
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
                      {/* Move to semester select */}
                      {semesters.length > 0 && (
                        <select
                          className={styles.moverSemestreSelect}
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              moverCursoASemestre(curso.id, e.target.value === 'null' ? null : e.target.value);
                            }
                          }}
                          title="Mover a otro semestre"
                        >
                          <option value="">Mover a...</option>
                          {selectedSemesterId !== null && (
                            <option value="null">Sin Semestre</option>
                          )}
                          {semesters
                            .filter(s => s.id !== selectedSemesterId)
                            .map(s => (
                              <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))
                          }
                        </select>
                      )}
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
                    {curso.notas.length > 0 || curso.examenFinal ? (
                      <>
                        {curso.notas.length > 0 && (
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
                          </>
                        )}
                        {curso.examenFinal && (
                          <div key="examen-final" className={`${styles.notaRow} ${styles.examenFinalRow}`}>
                            <div className={styles.examenFinalLabel}>Examen Final</div>
                            <input
                              type="number"
                              value={curso.examenFinal.valor || ''}
                              onChange={(e) => actualizarExamenFinal(curso.id, 'valor', e.target.value)}
                              onBlur={(e) => manejarBlurExamenFinalValor(curso.id, e.target.value)}
                              placeholder="1.0 - 7.0"
                              min="1.0"
                              max="7.0"
                              step="0.1"
                              className={`${styles.notaInput} ${esNotaInvalida(curso.examenFinal.valor) ? styles.inputError : ''}`}
                            />
                            <input
                              type="number"
                              value={curso.examenFinal.ponderacion || ''}
                              onChange={(e) => actualizarExamenFinal(curso.id, 'ponderacion', e.target.value)}
                              onBlur={(e) => manejarBlurExamenFinalPonderacion(curso.id, e.target.value)}
                              placeholder="0 - 100"
                              min="0"
                              max="100"
                              step="1"
                              className={`${styles.notaInput} ${esPonderacionInvalida(curso.examenFinal.ponderacion) ? styles.inputError : ''}`}
                            />
                            {confirmarEliminarExamenFinal === curso.id ? (
                              <div className={styles.confirmDeleteNotaGroup}>
                                <button
                                  onClick={() => eliminarExamenFinal(curso.id)}
                                  className={styles.confirmNotaButton}
                                  title="Confirmar"
                                >
                                  <FontAwesomeIcon icon={faCheck} />
                                </button>
                                <button
                                  onClick={() => setConfirmarEliminarExamenFinal(null)}
                                  className={styles.cancelNotaButton}
                                  title="Cancelar"
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmarEliminarExamenFinal(curso.id)}
                                className={styles.deleteNotaButton}
                                title="Eliminar examen final"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            )}
                          </div>
                        )}
                        <div className={styles.ponderacionTotal}>
                          {curso.notas.length > 0 && (
                            <>
                              <span>Ponderación Total Notas Regulares: {ponderacionTotal}%</span>
                              {parseFloat(ponderacionTotal) !== 100 && (
                                <span className={styles.ponderacionWarning}>
                                  {parseFloat(ponderacionTotal) < 100 
                                    ? '(Falta ' + (100 - parseFloat(ponderacionTotal)) + '%)' 
                                    : '(Excede en ' + (parseFloat(ponderacionTotal) - 100) + '%)'}
                                </span>
                              )}
                            </>
                          )}
                          {curso.examenFinal && curso.examenFinal.ponderacion && (
                            <span className={styles.examenFinalPonderacion}>
                              {curso.notas.length > 0 ? ' | ' : ''}Examen Final: {curso.examenFinal.ponderacion}%
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className={styles.sinNotas}>No hay notas agregadas</p>
                    )}

                    <div className={styles.agregarButtons}>
                      {parseFloat(ponderacionTotal) < 100 && (
                        <button
                          onClick={() => agregarNota(curso.id)}
                          className={styles.agregarNotaButton}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                          Agregar Nota
                        </button>
                      )}
                      {!curso.examenFinal && (
                        <button
                          onClick={() => agregarExamenFinal(curso.id)}
                          className={styles.agregarExamenFinalButton}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                          Agregar Examen Final
                        </button>
                      )}
                    </div>
                  </div>
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
