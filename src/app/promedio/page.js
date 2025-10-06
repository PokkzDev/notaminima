'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faTrash, 
  faEdit, 
  faCheck, 
  faTimes,
  faBook,
  faDownload,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import styles from './Promedio.module.css';

export default function Promedio() {
  const [cursos, setCursos] = useState([]);
  const [nuevoCursoNombre, setNuevoCursoNombre] = useState('');
  const [mostrarFormCurso, setMostrarFormCurso] = useState(false);
  const [editandoCurso, setEditandoCurso] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [confirmarEliminarCurso, setConfirmarEliminarCurso] = useState(null);
  const [confirmarEliminarNota, setConfirmarEliminarNota] = useState(null);
  const [mostrarModalImportar, setMostrarModalImportar] = useState(false);
  const [archivoImportar, setArchivoImportar] = useState(null);
  const [errorImportar, setErrorImportar] = useState('');
  const [validandoArchivo, setValidandoArchivo] = useState(false);
  const [archivoValido, setArchivoValido] = useState(null);

  // Cargar datos desde localStorage
  useEffect(() => {
    const cursosGuardados = localStorage.getItem('cursosPromedio');
    if (cursosGuardados) {
      try {
        setCursos(JSON.parse(cursosGuardados));
      } catch (error) {
        console.error('Error al cargar cursos:', error);
      }
    }
  }, []);

  // Guardar datos en localStorage
  useEffect(() => {
    if (cursos.length > 0 || localStorage.getItem('cursosPromedio')) {
      localStorage.setItem('cursosPromedio', JSON.stringify(cursos));
    }
  }, [cursos]);

  const agregarCurso = () => {
    if (nuevoCursoNombre.trim() === '') return;

    const nuevoCurso = {
      id: Date.now(),
      nombre: nuevoCursoNombre.trim(),
      notas: []
    };

    setCursos([...cursos, nuevoCurso]);
    setNuevoCursoNombre('');
    setMostrarFormCurso(false);
  };

  const eliminarCurso = (cursoId) => {
    setCursos(cursos.filter(curso => curso.id !== cursoId));
    setConfirmarEliminarCurso(null);
  };

  const iniciarEdicionCurso = (curso) => {
    setEditandoCurso(curso.id);
    setNombreEditado(curso.nombre);
  };

  const guardarEdicionCurso = (cursoId) => {
    if (nombreEditado.trim() === '') {
      cancelarEdicionCurso();
      return;
    }

    setCursos(cursos.map(curso => 
      curso.id === cursoId 
        ? { ...curso, nombre: nombreEditado.trim() }
        : curso
    ));
    setEditandoCurso(null);
    setNombreEditado('');
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
    setCursos(cursos.map(curso => {
      if (curso.id === cursoId) {
        return {
          ...curso,
          notas: curso.notas.map(nota =>
            nota.id === notaId ? { ...nota, [campo]: valor } : nota
          )
        };
      }
      return curso;
    }));
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
    setCursos(cursos.map(curso => {
      if (curso.id === cursoId) {
        return {
          ...curso,
          notas: curso.notas.filter(nota => nota.id !== notaId)
        };
      }
      return curso;
    }));
    setConfirmarEliminarNota(null);
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

  const exportarDatos = () => {
    const datos = {
      version: '1.0',
      fecha: new Date().toISOString(),
      cursos: cursos
    };

    const json = JSON.stringify(datos, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `promedio-notas-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const abrirModalImportar = () => {
    setMostrarModalImportar(true);
    setArchivoImportar(null);
    setErrorImportar('');
    setArchivoValido(null);
    setValidandoArchivo(false);
  };

  const cerrarModalImportar = () => {
    setMostrarModalImportar(false);
    setArchivoImportar(null);
    setErrorImportar('');
    setArchivoValido(null);
    setValidandoArchivo(false);
  };

  const manejarArchivoSeleccionado = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setArchivoImportar(null);
    setErrorImportar('');
    setArchivoValido(null);

    // Verificar extensión
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setErrorImportar('Por favor selecciona un archivo JSON válido (.json)');
      return;
    }

    // Verificar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorImportar('El archivo es demasiado grande (máximo 5MB)');
      return;
    }

    // Pre-validar el archivo
    setValidandoArchivo(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const texto = e.target.result;
        
        if (!texto || texto.trim() === '') {
          setErrorImportar('El archivo está vacío');
          setValidandoArchivo(false);
          return;
        }

        let contenido;
        try {
          contenido = JSON.parse(texto);
        } catch (jsonError) {
          setErrorImportar('El archivo no contiene JSON válido');
          setValidandoArchivo(false);
          return;
        }

        // Validar estructura
        const validacion = validarEstructuraJSON(contenido);
        if (!validacion.valido) {
          setErrorImportar(validacion.error);
          setValidandoArchivo(false);
          setArchivoValido(false);
          return;
        }

        // Archivo válido
        setArchivoImportar(file);
        setArchivoValido(true);
        setValidandoArchivo(false);
        setErrorImportar('');
      } catch (error) {
        setErrorImportar('Error al validar el archivo: ' + error.message);
        setValidandoArchivo(false);
        setArchivoValido(false);
      }
    };

    reader.onerror = () => {
      setErrorImportar('Error al leer el archivo');
      setValidandoArchivo(false);
      setArchivoValido(false);
    };

    reader.readAsText(file);
  };

  const validarEstructuraJSON = (contenido) => {
    // Verificar que tenga la propiedad cursos
    if (!contenido.cursos) {
      return { valido: false, error: 'El archivo no contiene la propiedad "cursos"' };
    }

    // Verificar que cursos sea un array
    if (!Array.isArray(contenido.cursos)) {
      return { valido: false, error: 'La propiedad "cursos" debe ser un array' };
    }

    // Verificar cada curso
    for (let i = 0; i < contenido.cursos.length; i++) {
      const curso = contenido.cursos[i];

      // Verificar que el curso tenga id, nombre y notas
      if (!curso.hasOwnProperty('id') || !curso.hasOwnProperty('nombre') || !curso.hasOwnProperty('notas')) {
        return { valido: false, error: `El curso en posición ${i + 1} no tiene la estructura correcta (falta id, nombre o notas)` };
      }

      // Verificar que notas sea un array
      if (!Array.isArray(curso.notas)) {
        return { valido: false, error: `El curso "${curso.nombre}" debe tener un array de notas` };
      }

      // Verificar cada nota
      for (let j = 0; j < curso.notas.length; j++) {
        const nota = curso.notas[j];

        if (!nota.hasOwnProperty('id') || !nota.hasOwnProperty('valor') || !nota.hasOwnProperty('ponderacion')) {
          return { valido: false, error: `Una nota del curso "${curso.nombre}" no tiene la estructura correcta` };
        }
      }
    }

    return { valido: true };
  };

  const importarDatos = () => {
    if (!archivoImportar) {
      setErrorImportar('Por favor selecciona un archivo');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Verificar que el contenido sea un JSON válido
        const texto = e.target.result;
        
        if (!texto || texto.trim() === '') {
          setErrorImportar('El archivo está vacío');
          return;
        }

        let contenido;
        try {
          contenido = JSON.parse(texto);
        } catch (jsonError) {
          setErrorImportar('El archivo no es un JSON válido: ' + jsonError.message);
          return;
        }

        // Validar la estructura del JSON
        const validacion = validarEstructuraJSON(contenido);
        if (!validacion.valido) {
          setErrorImportar(validacion.error);
          return;
        }

        // Todo está bien, importar los datos
        setCursos(contenido.cursos);
        cerrarModalImportar();
      } catch (error) {
        setErrorImportar('Error inesperado: ' + error.message);
      }
    };

    reader.onerror = () => {
      setErrorImportar('Error al leer el archivo. Por favor intenta nuevamente.');
    };

    reader.readAsText(archivoImportar);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Promedio de Notas</h1>
          <p className={styles.subtitle}>
            Administra tus cursos y calcula tu promedio ponderado
          </p>
          
          {cursos.length > 0 && (
            <div className={styles.actionButtons}>
              <div className={styles.buttonWithTooltip}>
                <button onClick={exportarDatos} className={styles.exportButton}>
                  <FontAwesomeIcon icon={faDownload} />
                  Exportar Datos
                </button>
                <span className={styles.tooltip}>
                  Descarga tus cursos y notas en un archivo JSON
                </span>
              </div>
              <div className={styles.buttonWithTooltip}>
                <button onClick={abrirModalImportar} className={styles.importButton}>
                  <FontAwesomeIcon icon={faUpload} />
                  Importar Datos
                </button>
                <span className={styles.tooltip}>
                  Carga un archivo JSON previamente exportado
                </span>
              </div>
            </div>
          )}
        </header>

        <div className={styles.content}>
          {cursos.length === 0 && !mostrarFormCurso && (
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

      {mostrarModalImportar && (
        <div className={styles.modalOverlay} onClick={cerrarModalImportar}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Importar Datos</h2>
              <button onClick={cerrarModalImportar} className={styles.modalCloseButton}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalDescription}>
                Selecciona un archivo JSON previamente exportado para restaurar tus cursos y notas.
              </p>

              <div className={styles.fileInputContainer}>
                <input
                  type="file"
                  id="fileInput"
                  accept=".json,application/json"
                  onChange={manejarArchivoSeleccionado}
                  className={styles.fileInput}
                />
                <label htmlFor="fileInput" className={`${styles.fileInputLabel} ${archivoValido ? styles.fileInputValid : ''}`}>
                  <FontAwesomeIcon icon={faUpload} />
                  {archivoImportar ? archivoImportar.name : 'Seleccionar archivo JSON'}
                </label>
              </div>

              {validandoArchivo && (
                <div className={styles.validatingMessage}>
                  Validando archivo...
                </div>
              )}

              {archivoValido && !errorImportar && (
                <div className={styles.successMessage}>
                  <FontAwesomeIcon icon={faCheck} />
                  Archivo válido - Listo para importar
                </div>
              )}

              {errorImportar && (
                <div className={styles.errorMessage}>
                  {errorImportar}
                </div>
              )}

              <div className={styles.modalActions}>
                <button 
                  onClick={importarDatos} 
                  className={styles.modalImportButton}
                  disabled={!archivoValido || validandoArchivo}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  Importar
                </button>
                <button onClick={cerrarModalImportar} className={styles.modalCancelButton}>
                  <FontAwesomeIcon icon={faTimes} />
                  Cancelar
                </button>
              </div>

              <div className={styles.warningMessage}>
                <strong>Advertencia:</strong> Importar datos reemplazará todos tus cursos y notas actuales.
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
