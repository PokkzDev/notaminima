'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faTrash, 
  faEdit, 
  faCheck, 
  faTimes,
  faCalculator,
  faGraduationCap,
  faFolder,
  faGripVertical,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './Promedio.module.css';

// Sortable carrera tab component
function SortableCarreraTab({ carrera, isSelected, isEditing, nombreEditado, setNombreCarreraEditado, guardarEdicionCarrera, cancelarEdicionCarrera, setSelectedCarreraId, iniciarEdicionCarrera, confirmarEliminarCarrera, setConfirmarEliminarCarrera, eliminarCarrera }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: carrera.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.carreraTabWrapper}>
      {isEditing ? (
        <div className={styles.editarCarreraForm}>
          <input
            type="text"
            value={nombreEditado}
            onChange={(e) => setNombreCarreraEditado(e.target.value)}
            className={styles.editarCarreraInput}
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') guardarEdicionCarrera(carrera.id);
            }}
          />
          <button
            onClick={() => guardarEdicionCarrera(carrera.id)}
            className={styles.carreraActionButton}
            title="Guardar"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button
            onClick={cancelarEdicionCarrera}
            className={styles.carreraActionButton}
            title="Cancelar"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      ) : (
        <>
          <button
            className={`${styles.carreraTab} ${isSelected ? styles.carreraTabActive : ''}`}
            onClick={() => setSelectedCarreraId(carrera.id)}
          >
            <span
              {...attributes}
              {...listeners}
              className={styles.dragHandle}
              title="Arrastra para reordenar"
            >
              <FontAwesomeIcon icon={faGripVertical} />
            </span>
            <FontAwesomeIcon icon={faBriefcase} />
            <span>{carrera.nombre}</span>
          </button>
          {isSelected && (
            <div className={styles.carreraActions}>
              <button
                onClick={() => iniciarEdicionCarrera(carrera)}
                className={styles.carreraActionButton}
                title="Editar nombre"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              {confirmarEliminarCarrera === carrera.id ? (
                <div className={styles.confirmDeleteCarrera}>
                  <span className={styles.confirmCarreraText}>¿Eliminar?</span>
                  <button
                    onClick={() => eliminarCarrera(carrera.id, false)}
                    className={styles.confirmCarreraButton}
                    title="Mantener semestres"
                  >
                    Mantener semestres
                  </button>
                  <button
                    onClick={() => eliminarCarrera(carrera.id, true)}
                    className={styles.deleteCarreraButton}
                    title="Eliminar todo"
                  >
                    Eliminar todo
                  </button>
                  <button
                    onClick={() => setConfirmarEliminarCarrera(null)}
                    className={styles.cancelCarreraButton}
                    title="Cancelar"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmarEliminarCarrera(carrera.id)}
                  className={styles.carreraDeleteButton}
                  title="Eliminar carrera"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

SortableCarreraTab.propTypes = {
  carrera: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  nombreEditado: PropTypes.string.isRequired,
  setNombreCarreraEditado: PropTypes.func.isRequired,
  guardarEdicionCarrera: PropTypes.func.isRequired,
  cancelarEdicionCarrera: PropTypes.func.isRequired,
  setSelectedCarreraId: PropTypes.func.isRequired,
  iniciarEdicionCarrera: PropTypes.func.isRequired,
  confirmarEliminarCarrera: PropTypes.string,
  setConfirmarEliminarCarrera: PropTypes.func.isRequired,
  eliminarCarrera: PropTypes.func.isRequired
};

// Sortable semester tab component
function SortableSemesterTab({ semester, isSelected, isEditing, nombreEditado, setNombreSemestreEditado, guardarEdicionSemestre, cancelarEdicionSemestre, setSelectedSemesterId, iniciarEdicionSemestre, confirmarEliminarSemestre, setConfirmarEliminarSemestre, eliminarSemestre }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: semester.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.semesterTabWrapper}>
      {isEditing ? (
        <div className={styles.editarSemestreForm}>
          <input
            type="text"
            value={nombreEditado}
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
            className={`${styles.semesterTab} ${isSelected ? styles.semesterTabActive : ''}`}
            onClick={() => setSelectedSemesterId(semester.id)}
          >
            <span
              {...attributes}
              {...listeners}
              className={styles.dragHandle}
              title="Arrastra para reordenar"
            >
              <FontAwesomeIcon icon={faGripVertical} />
            </span>
            <FontAwesomeIcon icon={faGraduationCap} />
            <span>{semester.nombre}</span>
          </button>
          {isSelected && (
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
  );
}

SortableSemesterTab.propTypes = {
  semester: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  nombreEditado: PropTypes.string.isRequired,
  setNombreSemestreEditado: PropTypes.func.isRequired,
  guardarEdicionSemestre: PropTypes.func.isRequired,
  cancelarEdicionSemestre: PropTypes.func.isRequired,
  setSelectedSemesterId: PropTypes.func.isRequired,
  iniciarEdicionSemestre: PropTypes.func.isRequired,
  confirmarEliminarSemestre: PropTypes.string,
  setConfirmarEliminarSemestre: PropTypes.func.isRequired,
  eliminarSemestre: PropTypes.func.isRequired
};

// Sortable curso card component
function SortableCursoCard({ curso, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: curso.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.cursoCard}>
      <div className={styles.cursoDragHandle} {...attributes} {...listeners}>
        <FontAwesomeIcon icon={faGripVertical} />
      </div>
      {children}
    </div>
  );
}

SortableCursoCard.propTypes = {
  curso: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  children: PropTypes.node.isRequired
};

export default function Promedio() {
  const { status } = useSession();
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
  
  // Carrera state
  const [carreras, setCarreras] = useState([]);
  const [selectedCarreraId, setSelectedCarreraId] = useState(null); // null = "Sin Carrera"
  const [hasOrphanSemesters, setHasOrphanSemesters] = useState(false);
  const [nuevoCarreraNombre, setNuevoCarreraNombre] = useState('');
  const [mostrarFormCarrera, setMostrarFormCarrera] = useState(false);
  const [editandoCarrera, setEditandoCarrera] = useState(null);
  const [nombreCarreraEditado, setNombreCarreraEditado] = useState('');
  const [confirmarEliminarCarrera, setConfirmarEliminarCarrera] = useState(null);
  const [loadingCarreras, setLoadingCarreras] = useState(true);

  // Semester state
  const [semesters, setSemesters] = useState([]);
  const [allSemesters, setAllSemesters] = useState([]); // All semesters across all carreras (for move dropdown)
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

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper to determine initial carrera selection
  const determineInitialCarrera = useCallback((carreras, orphanSemesters) => {
    const lastSelectedId = localStorage.getItem('lastSelectedCarreraId');
    const hasOrphans = orphanSemesters.length > 0;
    
    if (lastSelectedId) {
      const carreraExists = carreras.some(c => c.id === lastSelectedId);
      if (carreraExists) return lastSelectedId;
      if (lastSelectedId === 'null' && hasOrphans) return null;
    }
    
    // Fallback: orphans exist -> null, otherwise first carrera
    if (hasOrphans) return null;
    if (carreras.length > 0) return carreras[0].id;
    return null;
  }, []);

  // Helper to determine initial semester selection
  const determineInitialSemester = useCallback((semesters, orphanPromedios) => {
    const lastSelectedId = localStorage.getItem('lastSelectedSemesterId');
    const hasOrphans = orphanPromedios.length > 0;
    
    if (lastSelectedId) {
      const semesterExists = semesters.some(s => s.id === lastSelectedId);
      if (semesterExists) return lastSelectedId;
      if (lastSelectedId === 'null' && hasOrphans) return null;
    }
    
    // Fallback: orphans exist -> null, otherwise first semester
    if (hasOrphans) return null;
    if (semesters.length > 0) return semesters[0].id;
    return null;
  }, []);

  const loadAllSemesters = useCallback(async () => {
    try {
      // Fetch ALL semesters (no carrera filter) for the move dropdown
      const response = await fetch('/api/semesters');
      if (!response.ok) return;
      
      const data = await response.json();
      setAllSemesters(data.semesters);
    } catch (error) {
      console.error('Error loading all semesters:', error);
    }
  }, []);

  const loadCarreras = useCallback(async () => {
    try {
      setLoadingCarreras(true);
      const response = await fetch('/api/carreras');
      if (!response.ok) return;
      
      const data = await response.json();
      setCarreras(data.carreras);
      
      // Check if there are orphan semesters (without carrera)
      const orphanResponse = await fetch('/api/semesters?carreraId=null');
      if (!orphanResponse.ok) return;
      
      const orphanData = await orphanResponse.json();
      setHasOrphanSemesters(orphanData.semesters.length > 0);
      
      // Load all semesters for move dropdown
      await loadAllSemesters();
      
      const selectedId = determineInitialCarrera(data.carreras, orphanData.semesters);
      setSelectedCarreraId(selectedId);
    } catch (error) {
      console.error('Error loading carreras:', error);
    } finally {
      setLoadingCarreras(false);
    }
  }, [determineInitialCarrera, loadAllSemesters]);

  const loadSemesters = useCallback(async (carreraId) => {
    try {
      setLoadingSemesters(true);
      const url = carreraId 
        ? `/api/semesters?carreraId=${carreraId}`
        : '/api/semesters?carreraId=null';
      const response = await fetch(url);
      if (!response.ok) return;
      
      const data = await response.json();
      setSemesters(data.semesters);
      
      // Check if there are orphan cursos (without semester)
      const orphanResponse = await fetch('/api/promedios?semesterId=null');
      if (!orphanResponse.ok) return;
      
      const orphanData = await orphanResponse.json();
      setHasOrphanCursos(orphanData.promedios.length > 0);
      
      const selectedId = determineInitialSemester(data.semesters, orphanData.promedios);
      setSelectedSemesterId(selectedId);
    } catch (error) {
      console.error('Error loading semesters:', error);
    } finally {
      setLoadingSemesters(false);
    }
  }, [determineInitialSemester]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      globalThis.location.href = '/login';
    }
  }, [status]);

  // Load carreras from API
  useEffect(() => {
    if (status === 'authenticated') {
      loadCarreras();
    }
  }, [status, loadCarreras]);

  // Load semesters when carrera selection changes
  useEffect(() => {
    if (status === 'authenticated' && loadingCarreras === false) {
      loadSemesters(selectedCarreraId);
      // Save the selected carrera to localStorage
      if (selectedCarreraId === null) {
        localStorage.setItem('lastSelectedCarreraId', 'null');
      } else {
        localStorage.setItem('lastSelectedCarreraId', selectedCarreraId);
      }
    }
  }, [selectedCarreraId, status, loadingCarreras, loadSemesters]);

  // Load cursos when semester selection changes
  useEffect(() => {
    if (status === 'authenticated' && loadingSemesters === false) {
      loadCursos(selectedSemesterId);
      // Save the selected semester to localStorage
      if (selectedSemesterId === null) {
        localStorage.setItem('lastSelectedSemesterId', 'null');
      } else {
        localStorage.setItem('lastSelectedSemesterId', selectedSemesterId);
      }
    }
  }, [selectedSemesterId, status, loadingSemesters]);

  // Cleanup: cancel pending requests and clear timers on unmount
  useEffect(() => {
    return () => {
      // Clear all pending debounce timers
      for (const timeoutId of Object.values(saveTimeoutRefs.current)) {
        clearTimeout(timeoutId);
      }
      saveTimeoutRefs.current = {};
      
      // Abort all pending requests
      for (const controller of Object.values(abortControllersRef.current)) {
        controller.abort();
      }
      abortControllersRef.current = {};
    };
  }, []);

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

  // Carrera CRUD functions
  const agregarCarrera = async () => {
    if (nuevoCarreraNombre.trim() === '') return;

    try {
      setSaving(true);
      const response = await fetch('/api/carreras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nuevoCarreraNombre.trim()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCarreras([...carreras, data.carrera]);
        setNuevoCarreraNombre('');
        setMostrarFormCarrera(false);
        // Don't auto-select - let user stay in current view and move semesters manually
      } else {
        const errorData = await response.json();
        alert('Error al crear carrera: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error creating carrera:', error);
      alert('Error al crear carrera');
    } finally {
      setSaving(false);
    }
  };

  const eliminarCarrera = async (carreraId, deleteAll = false) => {
    try {
      setSaving(true);
      const url = deleteAll 
        ? `/api/carreras/${carreraId}?deleteAll=true`
        : `/api/carreras/${carreraId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCarreras(carreras.filter(c => c.id !== carreraId));
        setConfirmarEliminarCarrera(null);
        
        // If we deleted the selected carrera, go to "Sin Carrera" or first available
        if (selectedCarreraId === carreraId) {
          const remainingCarreras = carreras.filter(c => c.id !== carreraId);
          if (!deleteAll) {
            // Semesters became orphans, show "Sin Carrera"
            setHasOrphanSemesters(true);
            setSelectedCarreraId(null);
          } else if (remainingCarreras.length > 0) {
            setSelectedCarreraId(remainingCarreras[0].id);
          } else {
            setSelectedCarreraId(null);
          }
        }
      } else {
        const errorData = await response.json();
        alert('Error al eliminar carrera: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error deleting carrera:', error);
      alert('Error al eliminar carrera');
    } finally {
      setSaving(false);
    }
  };

  const iniciarEdicionCarrera = (carrera) => {
    setEditandoCarrera(carrera.id);
    setNombreCarreraEditado(carrera.nombre);
  };

  const guardarEdicionCarrera = async (carreraId) => {
    if (nombreCarreraEditado.trim() === '') {
      cancelarEdicionCarrera();
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/carreras/${carreraId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombreCarreraEditado.trim()
        }),
      });

      if (response.ok) {
        setCarreras(carreras.map(c => 
          c.id === carreraId 
            ? { ...c, nombre: nombreCarreraEditado.trim() }
            : c
        ));
        setEditandoCarrera(null);
        setNombreCarreraEditado('');
      } else {
        const errorData = await response.json();
        alert('Error al actualizar carrera: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error updating carrera:', error);
      alert('Error al actualizar carrera');
    } finally {
      setSaving(false);
    }
  };

  const cancelarEdicionCarrera = () => {
    setEditandoCarrera(null);
    setNombreCarreraEditado('');
  };

  const handleCarreraDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = carreras.findIndex((c) => c.id === active.id);
      const newIndex = carreras.findIndex((c) => c.id === over.id);

      const newCarreras = arrayMove(carreras, oldIndex, newIndex);
      const previousCarreras = [...carreras];
      setCarreras(newCarreras);

      // Save the new order to the backend
      try {
        const response = await fetch('/api/carreras/reorder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carreras: newCarreras.map((c) => ({ id: c.id })),
          }),
        });

        if (!response.ok) {
          console.error('Error saving carrera order');
          // Revert on error
          setCarreras(previousCarreras);
        }
      } catch (error) {
        console.error('Error saving carrera order:', error);
        // Revert on error
        setCarreras(previousCarreras);
      }
    }
  };

  const moverSemestreACarrera = async (semesterId, nuevaCarreraId) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/semesters/${semesterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carreraId: nuevaCarreraId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Remove from current view
        setSemesters(semesters.filter(s => s.id !== semesterId));
        
        // Update allSemesters with new carrera info
        setAllSemesters(allSemesters.map(s => 
          s.id === semesterId ? { ...s, carreraId: nuevaCarreraId, carrera: data.semester.carrera } : s
        ));
        
        // Update orphan status if moving from "Sin Carrera"
        if (!selectedCarreraId) {
          const remainingSemesters = semesters.filter(s => s.id !== semesterId);
          if (remainingSemesters.length === 0) {
            setHasOrphanSemesters(false);
          }
        }
      } else {
        const errorData = await response.json();
        alert('Error al mover semestre: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error moving semestre:', error);
      alert('Error al mover semestre');
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
          nombre: nuevoSemestreNombre.trim(),
          carreraId: selectedCarreraId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSemesters([...semesters, data.semester]);
        setAllSemesters([...allSemesters, data.semester]); // Update all semesters list
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
        setAllSemesters(allSemesters.filter(s => s.id !== semesterId)); // Update all semesters list
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
        const updatedName = nombreSemestreEditado.trim();
        setSemesters(semesters.map(s => 
          s.id === semesterId 
            ? { ...s, nombre: updatedName }
            : s
        ));
        setAllSemesters(allSemesters.map(s => 
          s.id === semesterId 
            ? { ...s, nombre: updatedName }
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

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = semesters.findIndex((s) => s.id === active.id);
      const newIndex = semesters.findIndex((s) => s.id === over.id);

      const newSemesters = arrayMove(semesters, oldIndex, newIndex);
      const previousSemesters = [...semesters];
      setSemesters(newSemesters);

      // Save the new order to the backend
      try {
        const response = await fetch('/api/semesters/reorder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            semesters: newSemesters.map((s) => ({ id: s.id })),
          }),
        });

        if (!response.ok) {
          console.error('Error saving semester order');
          // Revert on error
          setSemesters(previousSemesters);
        }
      } catch (error) {
        console.error('Error saving semester order:', error);
        // Revert on error
        setSemesters(previousSemesters);
      }
    }
  };

  const handleCursoDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = cursos.findIndex((c) => c.id === active.id);
      const newIndex = cursos.findIndex((c) => c.id === over.id);

      const newCursos = arrayMove(cursos, oldIndex, newIndex);
      const previousCursos = [...cursos];
      setCursos(newCursos);

      // Save the new order to the backend
      try {
        const response = await fetch('/api/promedios/reorder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            promedios: newCursos.map((c) => ({ id: c.id })),
          }),
        });

        if (!response.ok) {
          console.error('Error saving curso order');
          // Revert on error
          setCursos(previousCursos);
        }
      } catch (error) {
        console.error('Error saving curso order:', error);
        // Revert on error
        setCursos(previousCursos);
      }
    }
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
    
    let numero = Number.parseFloat(valor);
    
    // Si el número es mayor a 10, asumimos que olvidó el punto decimal
    if (numero >= 10 && numero <= 70) {
      numero = numero / 10;
    }
    
    // Limitar entre 1.0 y 7.0
    if (numero < 1) numero = 1;
    if (numero > 7) numero = 7;
    
    return numero.toFixed(1);
  };

  const validarPonderacion = (valor) => {
    if (valor === '') return '';
    
    let numero = Number.parseFloat(valor);
    
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
    const num = Number.parseFloat(valor);
    return Number.isNaN(num) || num < 1 || num > 7;
  };

  const esPonderacionInvalida = (valor) => {
    if (valor === '') return false;
    const num = Number.parseFloat(valor);
    return Number.isNaN(num) || num < 0 || num > 100;
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
              !Number.isNaN(Number.parseFloat(nota.valor)) && !Number.isNaN(Number.parseFloat(nota.ponderacion))
    );

    if (notasValidas.length === 0) return null;

    let sumaProductos = 0;

    for (const nota of notasValidas) {
      const valor = Number.parseFloat(nota.valor);
      const ponderacion = Number.parseFloat(nota.ponderacion);
      sumaProductos += valor * (ponderacion / 100);
    }

    return sumaProductos;
  };

  // Calcula el promedio final considerando examen final si existe
  const calcularPromedio = (notas, examenFinal) => {
    const promedioNotasRegulares = calcularPromedioNotasRegulares(notas);
    
    if (promedioNotasRegulares === null) {
      // Si no hay notas regulares válidas, solo puede calcularse si hay examen final
      if (examenFinal && examenFinal.valor !== '' && examenFinal.ponderacion !== '' &&
          !Number.isNaN(Number.parseFloat(examenFinal.valor)) && !Number.isNaN(Number.parseFloat(examenFinal.ponderacion))) {
        const valorExamen = Number.parseFloat(examenFinal.valor);
        const ponderacionExamen = Number.parseFloat(examenFinal.ponderacion);
        return (valorExamen * (ponderacionExamen / 100)).toFixed(2);
      }
      return null;
    }

    // Si hay examen final, calcular promedio combinado
    if (examenFinal && examenFinal.valor !== '' && examenFinal.ponderacion !== '' &&
        !Number.isNaN(Number.parseFloat(examenFinal.valor)) && !Number.isNaN(Number.parseFloat(examenFinal.ponderacion))) {
      const valorExamen = Number.parseFloat(examenFinal.valor);
      const ponderacionExamen = Number.parseFloat(examenFinal.ponderacion);
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
      nota => nota.ponderacion !== '' && !Number.isNaN(Number.parseFloat(nota.ponderacion))
    );

    return notasValidas.reduce((sum, nota) => sum + Number.parseFloat(nota.ponderacion), 0).toFixed(0);
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
        {(loading || loadingCarreras || loadingSemesters) ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingContent}>
              <div className={styles.loadingIconWrapper}>
                <FontAwesomeIcon icon={faCalculator} className={styles.loadingMainIcon} />
                <div className={styles.loadingSpinnerRing}></div>
              </div>
              <h2 className={styles.loadingTitle}>Cargando tus cursos</h2>
              <p className={styles.loadingSubtitle}>Preparando tu información académica...</p>
            </div>
          </div>
        ) : (
          <>
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <FontAwesomeIcon icon={faCalculator} />
          </div>
          <h1 className={styles.title}>Promedio de Notas</h1>
          <p className={styles.subtitle}>
            Administra tus cursos y calcula tu promedio ponderado
          </p>
        </header>

        {/* Carrera Selector */}
        {!loadingCarreras && (
          <div className={styles.carreraSection}>
            <div className={styles.carreraHeader}>
              <FontAwesomeIcon icon={faBriefcase} className={styles.carreraIcon} />
              <h2 className={styles.carreraTitle}>Carreras</h2>
            </div>
            
            <div className={styles.carreraTabs}>
              {/* Sin Carrera tab - only show if there are orphan semesters */}
              {hasOrphanSemesters && (
                <button
                  className={`${styles.carreraTab} ${selectedCarreraId === null ? styles.carreraTabActive : ''}`}
                  onClick={() => setSelectedCarreraId(null)}
                >
                  <FontAwesomeIcon icon={faFolder} />
                  <span>Sin Carrera</span>
                </button>
              )}
              
              {/* Carrera tabs with drag and drop */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleCarreraDragEnd}
              >
                <SortableContext
                  items={carreras.map(c => c.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {carreras.map(carrera => (
                    <SortableCarreraTab
                      key={carrera.id}
                      carrera={carrera}
                      isSelected={selectedCarreraId === carrera.id}
                      isEditing={editandoCarrera === carrera.id}
                      nombreEditado={nombreCarreraEditado}
                      setNombreCarreraEditado={setNombreCarreraEditado}
                      guardarEdicionCarrera={guardarEdicionCarrera}
                      cancelarEdicionCarrera={cancelarEdicionCarrera}
                      setSelectedCarreraId={setSelectedCarreraId}
                      iniciarEdicionCarrera={iniciarEdicionCarrera}
                      confirmarEliminarCarrera={confirmarEliminarCarrera}
                      setConfirmarEliminarCarrera={setConfirmarEliminarCarrera}
                      eliminarCarrera={eliminarCarrera}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              
              {/* Add carrera button/form */}
              {mostrarFormCarrera ? (
                <div className={styles.agregarCarreraForm}>
                  <input
                    type="text"
                    value={nuevoCarreraNombre}
                    onChange={(e) => setNuevoCarreraNombre(e.target.value)}
                    placeholder="Ej: Ingeniería Civil"
                    className={styles.carreraInput}
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') agregarCarrera();
                    }}
                  />
                  <button onClick={agregarCarrera} className={styles.confirmarCarreraButton}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button
                    onClick={() => {
                      setMostrarFormCarrera(false);
                      setNuevoCarreraNombre('');
                    }}
                    className={styles.cancelarCarreraButton}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setMostrarFormCarrera(true)}
                  className={styles.nuevaCarreraButton}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Nueva Carrera</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Semester Selector */}
        {!loadingSemesters && !loadingCarreras && (
          <div className={styles.semesterSection}>
            <div className={styles.semesterHeader}>
              <FontAwesomeIcon icon={faGraduationCap} className={styles.semesterIcon} />
              <h2 className={styles.semesterTitle}>Semestres{selectedCarreraId && carreras.find(c => c.id === selectedCarreraId) ? ` - ${carreras.find(c => c.id === selectedCarreraId).nombre}` : ''}</h2>
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
              
              {/* Semester tabs with drag and drop */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={semesters.map(s => s.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {semesters.map(semester => (
                    <SortableSemesterTab
                      key={semester.id}
                      semester={semester}
                      isSelected={selectedSemesterId === semester.id}
                      isEditing={editandoSemestre === semester.id}
                      nombreEditado={nombreSemestreEditado}
                      setNombreSemestreEditado={setNombreSemestreEditado}
                      guardarEdicionSemestre={guardarEdicionSemestre}
                      cancelarEdicionSemestre={cancelarEdicionSemestre}
                      setSelectedSemesterId={setSelectedSemesterId}
                      iniciarEdicionSemestre={iniciarEdicionSemestre}
                      confirmarEliminarSemestre={confirmarEliminarSemestre}
                      setConfirmarEliminarSemestre={setConfirmarEliminarSemestre}
                      eliminarSemestre={eliminarSemestre}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {/* Move semester to carrera select */}
              {carreras.length > 0 && selectedSemesterId && (
                <select
                  className={styles.moverCarreraSelectCompact}
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      moverSemestreACarrera(selectedSemesterId, e.target.value === 'null' ? null : e.target.value);
                    }
                  }}
                  title="Mover a otra carrera"
                >
                  <option value="">Mover a...</option>
                  {selectedCarreraId !== null && (
                    <option value="null">Sin Carrera</option>
                  )}
                  {carreras
                    .filter(c => c.id !== selectedCarreraId)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))
                  }
                </select>
              )}
              
              {/* Add semester button/form - only show if a carrera is selected */}
              {(selectedCarreraId || carreras.length === 0) && (
                mostrarFormSemestre ? (
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
                )
              )}
            </div>
          </div>
        )}

        <div className={styles.content}>
          {cursos.length > 0 && (
            <div className={styles.resumenSection}>
              <div className={styles.resumenGrid}>
                {cursos.map(curso => {
                  const promedio = calcularPromedio(curso.notas, curso.examenFinal);
                  const promedioNum = promedio ? Number.parseFloat(promedio) : null;
                  const ponderacionTotal = Number.parseFloat(calcularPonderacionTotal(curso.notas));
                  
                  // Determinar estado y clase
                  let estadoTexto = '';
                  let claseEstado = styles.resumenCardNeutral;
                  
                  if (promedioNum !== null) {
                    if (ponderacionTotal === 100) {
                      // Curso completo
                      if (promedioNum >= 6.0) {
                        estadoTexto = 'Excelente';
                        claseEstado = styles.resumenCardExcelente;
                      } else if (promedioNum >= 5.0) {
                        estadoTexto = 'Muy Bueno';
                        claseEstado = styles.resumenCardMuyBueno;
                      } else if (promedioNum >= 4.0) {
                        estadoTexto = 'Aprobado';
                        claseEstado = styles.resumenCardAprobado;
                      } else {
                        estadoTexto = 'Reprobado';
                        claseEstado = styles.resumenCardReprobado;
                      }
                    } else if (promedioNum >= 6.0) {
                      // Curso incompleto
                      estadoTexto = 'En Progreso';
                      claseEstado = styles.resumenCardExcelente;
                    } else if (promedioNum >= 5.0) {
                      estadoTexto = 'En Progreso';
                      claseEstado = styles.resumenCardMuyBueno;
                    } else if (promedioNum >= 4.0) {
                      estadoTexto = 'En Progreso';
                      claseEstado = styles.resumenCardAprobado;
                    } else {
                      estadoTexto = 'Bajo 4.0';
                      claseEstado = styles.resumenCardEnRiesgo;
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
                            {promedioNum === null ? '-' : promedioNum.toFixed(2)}
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

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleCursoDragEnd}
          >
            <SortableContext
              items={cursos.map(c => c.id)}
              strategy={rectSortingStrategy}
            >
              <div className={styles.cursosContainer}>
                {cursos.map(curso => {
                  const promedio = calcularPromedio(curso.notas, curso.examenFinal);
                  const ponderacionTotal = calcularPonderacionTotal(curso.notas);

                  return (
                    <SortableCursoCard key={curso.id} curso={curso}>
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
                                className={styles.iconButtonSmall}
                                title="Guardar"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                              <button
                                onClick={cancelarEdicionCurso}
                                className={styles.iconButtonSmall}
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
                                className={styles.iconButtonSmall}
                                title="Editar nombre"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </>
                          )}
                        </div>
                        <div className={styles.cursoHeaderRight}>
                          <div className={styles.promedioCompact}>
                            <span className={styles.promedioCompactValue}>
                              {promedio === null ? '-' : promedio}
                            </span>
                            <span className={styles.promedioCompactLabel}>
                              {ponderacionTotal}% evaluado
                            </span>
                          </div>
                          {/* Move to semester select - show all semesters from all carreras */}
                          {allSemesters.filter(s => s.id !== selectedSemesterId).length > 0 && (
                            <select
                              className={styles.moverSemestreSelectCompact}
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  moverCursoASemestre(curso.id, e.target.value);
                                }
                              }}
                              title="Mover a otro semestre"
                            >
                              <option value="">Mover a...</option>
                              {allSemesters
                                .filter(s => s.id !== selectedSemesterId)
                                .map(s => (
                                  <option key={s.id} value={s.id}>
                                    {s.carrera ? `${s.carrera.nombre} - ${s.nombre}` : s.nombre}
                                  </option>
                                ))
                              }
                            </select>
                          )}
                          {confirmarEliminarCurso === curso.id ? (
                            <div className={styles.confirmDeleteCompact}>
                              <button
                                onClick={() => eliminarCurso(curso.id)}
                                className={styles.confirmButtonCompact}
                                title="Confirmar"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                              <button
                                onClick={() => setConfirmarEliminarCurso(null)}
                                className={styles.cancelButtonCompact}
                                title="Cancelar"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmarEliminarCurso(curso.id)}
                              className={styles.deleteButtonCompact}
                              title="Eliminar curso"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className={styles.notasSectionCompact}>
                        {curso.notas.length > 0 || curso.examenFinal ? (
                          <div className={styles.notasListCompact}>
                            {curso.notas.map((nota, index) => (
                              <div key={nota.id} className={styles.notaRowCompact}>
                                <span className={styles.notaIndexLabel}>#{index + 1}</span>
                                <div className={styles.notaInputGroup}>
                                  <input
                                    type="number"
                                    value={nota.valor}
                                    onChange={(e) => actualizarNota(curso.id, nota.id, 'valor', e.target.value)}
                                    onBlur={(e) => manejarBlurNota(curso.id, nota.id, e.target.value)}
                                    placeholder="Nota"
                                    min="1.0"
                                    max="7.0"
                                    step="0.1"
                                    className={`${styles.notaInputCompact} ${esNotaInvalida(nota.valor) ? styles.inputError : ''}`}
                                  />
                                  <span className={styles.inputSeparator}>×</span>
                                  <input
                                    type="number"
                                    value={nota.ponderacion}
                                    onChange={(e) => actualizarNota(curso.id, nota.id, 'ponderacion', e.target.value)}
                                    onBlur={(e) => manejarBlurPonderacion(curso.id, nota.id, e.target.value)}
                                    placeholder="%"
                                    min="0"
                                    max="100"
                                    step="1"
                                    className={`${styles.ponderacionInputCompact} ${esPonderacionInvalida(nota.ponderacion) ? styles.inputError : ''}`}
                                  />
                                  <span className={styles.percentSign}>%</span>
                                </div>
                                {confirmarEliminarNota === `${curso.id}-${nota.id}` ? (
                                  <div className={styles.confirmDeleteInline}>
                                    <button
                                      onClick={() => eliminarNota(curso.id, nota.id)}
                                      className={styles.confirmInlineBtn}
                                      title="Confirmar"
                                    >
                                      <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                    <button
                                      onClick={() => setConfirmarEliminarNota(null)}
                                      className={styles.cancelInlineBtn}
                                      title="Cancelar"
                                    >
                                      <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmarEliminarNota(`${curso.id}-${nota.id}`)
                                    }
                                    className={styles.deleteInlineBtn}
                                    title="Eliminar nota"
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                )}
                              </div>
                            ))}
                            {curso.examenFinal && (
                              <div className={styles.examenFinalRowCompact}>
                                <span className={styles.examenFinalTag}>Examen</span>
                                <div className={styles.notaInputGroup}>
                                  <input
                                    type="number"
                                    value={curso.examenFinal.valor || ''}
                                    onChange={(e) => actualizarExamenFinal(curso.id, 'valor', e.target.value)}
                                    onBlur={(e) => manejarBlurExamenFinalValor(curso.id, e.target.value)}
                                    placeholder="Nota"
                                    min="1.0"
                                    max="7.0"
                                    step="0.1"
                                    className={`${styles.notaInputCompact} ${styles.examenInput} ${esNotaInvalida(curso.examenFinal.valor) ? styles.inputError : ''}`}
                                  />
                                  <span className={styles.inputSeparator}>×</span>
                                  <input
                                    type="number"
                                    value={curso.examenFinal.ponderacion || ''}
                                    onChange={(e) => actualizarExamenFinal(curso.id, 'ponderacion', e.target.value)}
                                    onBlur={(e) => manejarBlurExamenFinalPonderacion(curso.id, e.target.value)}
                                    placeholder="%"
                                    min="0"
                                    max="100"
                                    step="1"
                                    className={`${styles.ponderacionInputCompact} ${styles.examenInput} ${esPonderacionInvalida(curso.examenFinal.ponderacion) ? styles.inputError : ''}`}
                                  />
                                  <span className={styles.percentSign}>%</span>
                                </div>
                                {confirmarEliminarExamenFinal === curso.id ? (
                                  <div className={styles.confirmDeleteInline}>
                                    <button
                                      onClick={() => eliminarExamenFinal(curso.id)}
                                      className={styles.confirmInlineBtn}
                                      title="Confirmar"
                                    >
                                      <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                    <button
                                      onClick={() => setConfirmarEliminarExamenFinal(null)}
                                      className={styles.cancelInlineBtn}
                                      title="Cancelar"
                                    >
                                      <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmarEliminarExamenFinal(curso.id)}
                                    className={styles.deleteInlineBtn}
                                    title="Eliminar examen"
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className={styles.sinNotasCompact}>Sin notas</p>
                        )}

                        <div className={styles.cursoFooter}>
                          <div className={styles.ponderacionInfo}>
                            {Number.parseFloat(ponderacionTotal) !== 100 && Number.parseFloat(ponderacionTotal) > 0 && (
                              <span className={styles.ponderacionWarningCompact}>
                                {Number.parseFloat(ponderacionTotal) < 100 
                                  ? 'Falta ' + (100 - Number.parseFloat(ponderacionTotal)) + '%' 
                                  : 'Excede ' + (Number.parseFloat(ponderacionTotal) - 100) + '%'}
                              </span>
                            )}
                          </div>
                          <div className={styles.agregarButtonsCompact}>
                            {Number.parseFloat(ponderacionTotal) < 100 && (
                              <button
                                onClick={() => agregarNota(curso.id)}
                                className={styles.agregarNotaCompact}
                              >
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Nota</span>
                              </button>
                            )}
                            {!curso.examenFinal && (
                              <button
                                onClick={() => agregarExamenFinal(curso.id)}
                                className={styles.agregarExamenCompact}
                              >
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Examen</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </SortableCursoCard>
                  );
                })}
                
                {/* Add New Course Card - Only show if a semester is selected */}
                {!loadingSemesters && (
                  semesters.length === 0 || selectedSemesterId === null ? (
                    <div className={styles.addCursoPlaceholderDisabled}>
                      <FontAwesomeIcon icon={faGraduationCap} className={styles.addCursoIconDisabled} />
                      <span className={styles.addCursoTextDisabled}>
                        {semesters.length === 0 
                          ? 'Crea un semestre para agregar cursos'
                          : 'Selecciona un semestre para agregar cursos'}
                      </span>
                    </div>
                  ) : mostrarFormCurso ? (
                    <div className={styles.addCursoCard}>
                      <div className={styles.addCursoFormContent}>
                        <input
                          type="text"
                          value={nuevoCursoNombre}
                          onChange={(e) => setNuevoCursoNombre(e.target.value)}
                          placeholder="Nombre del curso"
                          className={styles.addCursoInput}
                          autoFocus
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') agregarCurso();
                          }}
                        />
                        <div className={styles.addCursoActions}>
                          <button onClick={agregarCurso} className={styles.addCursoConfirm} disabled={!nuevoCursoNombre.trim()}>
                            <FontAwesomeIcon icon={faCheck} />
                            <span>Crear</span>
                          </button>
                          <button
                            onClick={() => {
                              setMostrarFormCurso(false);
                              setNuevoCursoNombre('');
                            }}
                            className={styles.addCursoCancel}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setMostrarFormCurso(true)}
                      className={styles.addCursoPlaceholder}
                    >
                      <FontAwesomeIcon icon={faPlus} className={styles.addCursoIcon} />
                      <span className={styles.addCursoText}>Agregar curso</span>
                    </button>
                  )
                )}
              </div>
            </SortableContext>
          </DndContext>

        </div>
          </>
        )}
      </div>
      </main>
    </>
  );
}
