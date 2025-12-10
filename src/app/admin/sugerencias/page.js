'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLightbulb,
  faUsers,
  faChartLine,
  faSpinner,
  faSearch,
  faEnvelope,
  faEnvelopeOpen,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faBug,
  faQuestionCircle,
  faStickyNote,
  faInbox,
  faCheck,
  faEye,
  faEyeSlash,
  faDesktop,
  faMobileAlt
} from '@fortawesome/free-solid-svg-icons';
import styles from '../Admin.module.css';
import sugerenciasStyles from './Sugerencias.module.css';

export default function AdminSugerenciasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sugerencias, setSugerencias] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [plataformaFilter, setPlataformaFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  // Modal states
  const [viewModal, setViewModal] = useState({ open: false, sugerencia: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, sugerencia: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  const loadSugerencias = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });

      if (search) params.append('search', search);
      if (tipoFilter) params.append('tipo', tipoFilter);
      if (plataformaFilter) params.append('plataforma', plataformaFilter);
      if (estadoFilter) params.append('estado', estadoFilter);

      const response = await fetch(`/api/admin/sugerencias?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSugerencias(data.sugerencias);
        setNoLeidas(data.noLeidas);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error loading sugerencias:', error);
    } finally {
      setLoading(false);
    }
  }, [search, tipoFilter, plataformaFilter, estadoFilter, pagination.limit]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      loadSugerencias(1);
    }
  }, [status, session, tipoFilter, plataformaFilter, estadoFilter, loadSugerencias]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
        loadSugerencias(1);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, status, session?.user?.role, loadSugerencias]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadSugerencias(newPage);
    }
  };

  const handleToggleRead = async (sugerencia) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/sugerencias/${sugerencia.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leido: !sugerencia.leido })
      });

      if (response.ok) {
        loadSugerencias(pagination.page);
        if (viewModal.open && viewModal.sugerencia?.id === sugerencia.id) {
          setViewModal({ open: false, sugerencia: null });
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Error al actualizar');
      }
    } catch (error) {
      console.error('Error toggling read:', error);
      alert('Error al actualizar');
    } finally {
      setActionLoading(false);
    }
  };

  const handleView = async (sugerencia) => {
    setViewModal({ open: true, sugerencia });
    
    // Mark as read when opening
    if (!sugerencia.leido) {
      try {
        await fetch(`/api/admin/sugerencias/${sugerencia.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leido: true })
        });
        loadSugerencias(pagination.page);
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.sugerencia) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/sugerencias/${deleteModal.sugerencia.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDeleteModal({ open: false, sugerencia: null });
        loadSugerencias(pagination.page);
      } else {
        const data = await response.json();
        alert(data.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting sugerencia:', error);
      alert('Error al eliminar');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'sugerencia': return faLightbulb;
      case 'error': return faBug;
      case 'pregunta': return faQuestionCircle;
      default: return faStickyNote;
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'sugerencia': return 'Sugerencia';
      case 'error': return 'Error';
      case 'pregunta': return 'Pregunta';
      default: return 'Otro';
    }
  };

  const getTipoBadgeClass = (tipo) => {
    switch (tipo) {
      case 'sugerencia': return sugerenciasStyles.badgeSugerencia;
      case 'error': return sugerenciasStyles.badgeError;
      case 'pregunta': return sugerenciasStyles.badgePregunta;
      default: return sugerenciasStyles.badgeOtro;
    }
  };

  const getPlataformaIcon = (plataforma) => {
    return plataforma === 'mobile' ? faMobileAlt : faDesktop;
  };

  const getPlataformaLabel = (plataforma) => {
    return plataforma === 'mobile' ? 'Móvil' : 'Escritorio';
  };

  if (status === 'loading' || (loading && sugerencias.length === 0)) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
            <p>Cargando sugerencias...</p>
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
            <FontAwesomeIcon icon={faLightbulb} />
          </div>
          <h1 className={styles.title}>Buzón de Sugerencias</h1>
          <p className={styles.subtitle}>
            {noLeidas > 0 ? (
              <>Tienes <strong>{noLeidas}</strong> mensaje{noLeidas !== 1 ? 's' : ''} sin leer</>
            ) : (
              'No hay mensajes sin leer'
            )}
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className={styles.navTabs}>
          <Link href="/admin" className={styles.navTab}>
            <FontAwesomeIcon icon={faChartLine} />
            Estadísticas
          </Link>
          <Link href="/admin/users" className={styles.navTab}>
            <FontAwesomeIcon icon={faUsers} />
            Usuarios
          </Link>
          <Link href="/admin/sugerencias" className={`${styles.navTab} ${styles.navTabActive}`}>
            <FontAwesomeIcon icon={faLightbulb} />
            Sugerencias
            {noLeidas > 0 && (
              <span className={sugerenciasStyles.badge}>{noLeidas}</span>
            )}
          </Link>
        </div>

        {/* Table Controls */}
        <div className={styles.tableControls}>
          <div className={styles.searchWrapper}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nombre, email o mensaje..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos los tipos</option>
            <option value="sugerencia">Sugerencia</option>
            <option value="error">Error</option>
            <option value="pregunta">Pregunta</option>
            <option value="otro">Otro</option>
          </select>
          <select
            value={plataformaFilter}
            onChange={(e) => setPlataformaFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas las plataformas</option>
            <option value="desktop">Escritorio</option>
            <option value="mobile">Móvil</option>
          </select>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos los estados</option>
            <option value="no_leido">Sin leer</option>
            <option value="leido">Leídos</option>
          </select>
        </div>

        {/* Suggestions Table */}
        <div className={styles.tableSection}>
          <div className={styles.tableContainer}>
            {sugerencias.length === 0 ? (
              <div className={styles.emptyState}>
                <FontAwesomeIcon icon={faInbox} className={styles.emptyIcon} />
                <p className={styles.emptyText}>No se encontraron sugerencias</p>
              </div>
            ) : (
              <>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}></th>
                      <th>Remitente</th>
                      <th>Tipo</th>
                      <th>Plataforma</th>
                      <th>Mensaje</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sugerencias.map((sugerencia) => (
                      <tr 
                        key={sugerencia.id} 
                        className={!sugerencia.leido ? sugerenciasStyles.unreadRow : ''}
                        onClick={() => handleView(sugerencia)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          <FontAwesomeIcon 
                            icon={sugerencia.leido ? faEnvelopeOpen : faEnvelope}
                            className={sugerencia.leido ? sugerenciasStyles.readIcon : sugerenciasStyles.unreadIcon}
                          />
                        </td>
                        <td>
                          <div className={styles.userInfo}>
                            <span className={styles.username}>
                              {sugerencia.nombre || 'Anónimo'}
                            </span>
                            {sugerencia.email && (
                              <span className={styles.email}>{sugerencia.email}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`${sugerenciasStyles.tipoBadge} ${getTipoBadgeClass(sugerencia.tipo)}`}>
                            <FontAwesomeIcon icon={getTipoIcon(sugerencia.tipo)} />
                            {getTipoLabel(sugerencia.tipo)}
                          </span>
                        </td>
                        <td>
                          <span className={`${sugerenciasStyles.plataformaBadge} ${sugerencia.plataforma === 'mobile' ? sugerenciasStyles.badgeMobile : sugerenciasStyles.badgeDesktop}`}>
                            <FontAwesomeIcon icon={getPlataformaIcon(sugerencia.plataforma)} />
                            {getPlataformaLabel(sugerencia.plataforma)}
                          </span>
                        </td>
                        <td>
                          <span className={sugerenciasStyles.mensajePreview}>
                            {sugerencia.mensaje.substring(0, 100)}
                            {sugerencia.mensaje.length > 100 ? '...' : ''}
                          </span>
                        </td>
                        <td>{formatDate(sugerencia.createdAt)}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className={styles.actionsCell}>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleToggleRead(sugerencia)}
                              title={sugerencia.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                            >
                              <FontAwesomeIcon icon={sugerencia.leido ? faEyeSlash : faEye} />
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                              onClick={() => setDeleteModal({ open: true, sugerencia })}
                              title="Eliminar"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className={styles.pagination}>
                  <span className={styles.paginationInfo}>
                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} sugerencias
                  </span>
                  <div className={styles.paginationButtons}>
                    <button
                      className={styles.paginationButton}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          className={`${styles.paginationButton} ${pagination.page === pageNum ? styles.paginationButtonActive : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      className={styles.paginationButton}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* View Modal */}
        {viewModal.open && viewModal.sugerencia && (
          <div className={styles.modalBackdrop} onClick={() => setViewModal({ open: false, sugerencia: null })}>
            <div className={`${styles.modal} ${sugerenciasStyles.viewModal}`} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  <FontAwesomeIcon icon={getTipoIcon(viewModal.sugerencia.tipo)} style={{ marginRight: '0.5rem' }} />
                  {getTipoLabel(viewModal.sugerencia.tipo)}
                </h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setViewModal({ open: false, sugerencia: null })}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={sugerenciasStyles.viewMeta}>
                  <div className={sugerenciasStyles.viewMetaItem}>
                    <strong>De:</strong> {viewModal.sugerencia.nombre || 'Anónimo'}
                  </div>
                  {viewModal.sugerencia.email && (
                    <div className={sugerenciasStyles.viewMetaItem}>
                      <strong>Email:</strong> 
                      <a href={`mailto:${viewModal.sugerencia.email}`}>{viewModal.sugerencia.email}</a>
                    </div>
                  )}
                  <div className={sugerenciasStyles.viewMetaItem}>
                    <strong>Plataforma:</strong> 
                    <FontAwesomeIcon icon={getPlataformaIcon(viewModal.sugerencia.plataforma)} style={{ marginLeft: '0.25rem', marginRight: '0.25rem' }} />
                    {getPlataformaLabel(viewModal.sugerencia.plataforma)}
                  </div>
                  <div className={sugerenciasStyles.viewMetaItem}>
                    <strong>Fecha:</strong> {formatDate(viewModal.sugerencia.createdAt)}
                  </div>
                </div>
                <div className={sugerenciasStyles.viewMessage}>
                  {viewModal.sugerencia.mensaje}
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button
                  className={`${styles.modalButton} ${styles.modalButtonSecondary}`}
                  onClick={() => handleToggleRead(viewModal.sugerencia)}
                  disabled={actionLoading}
                >
                  <FontAwesomeIcon icon={viewModal.sugerencia.leido ? faEyeSlash : faCheck} style={{ marginRight: '0.5rem' }} />
                  {viewModal.sugerencia.leido ? 'Marcar no leído' : 'Marcar leído'}
                </button>
                {viewModal.sugerencia.email && (
                  <a
                    href={`mailto:${viewModal.sugerencia.email}?subject=Re: Tu ${getTipoLabel(viewModal.sugerencia.tipo).toLowerCase()} en NotaMinima`}
                    className={`${styles.modalButton} ${styles.modalButtonPrimary}`}
                  >
                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem' }} />
                    Responder
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.open && (
          <div className={styles.modalBackdrop} onClick={() => !actionLoading && setDeleteModal({ open: false, sugerencia: null })}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Eliminar Sugerencia</h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setDeleteModal({ open: false, sugerencia: null })}
                  disabled={actionLoading}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <p className={styles.modalText}>
                  ¿Estás seguro de que deseas eliminar esta sugerencia de <strong>{deleteModal.sugerencia?.nombre || 'Anónimo'}</strong>?
                </p>
                <p className={styles.modalText}>
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className={styles.modalFooter}>
                <button
                  className={`${styles.modalButton} ${styles.modalButtonSecondary}`}
                  onClick={() => setDeleteModal({ open: false, sugerencia: null })}
                  disabled={actionLoading}
                >
                  Cancelar
                </button>
                <button
                  className={`${styles.modalButton} ${styles.modalButtonDanger}`}
                  onClick={handleDelete}
                  disabled={actionLoading}
                >
                  {actionLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

