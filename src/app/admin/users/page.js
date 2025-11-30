'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserShield,
  faUsers,
  faChartLine,
  faSpinner,
  faSearch,
  faBook,
  faCalendarAlt,
  faEdit,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faCheckCircle,
  faTimesCircle,
  faGraduationCap,
  faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons';
import styles from '../Admin.module.css';

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
  const [roleModal, setRoleModal] = useState({ open: false, user: null, newRole: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  const loadUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });

      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, pagination.limit]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      loadUsers(1);
    }
  }, [status, session, roleFilter, statusFilter, loadUsers]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
        loadUsers(1);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, status, session?.user?.role, loadUsers]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadUsers(newPage);
    }
  };

  const handleRoleChange = async () => {
    if (!roleModal.user || !roleModal.newRole) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/users/${roleModal.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleModal.newRole })
      });

      if (response.ok) {
        setRoleModal({ open: false, user: null, newRole: '' });
        loadUsers(pagination.page);
      } else {
        const data = await response.json();
        alert(data.error || 'Error al cambiar rol');
      }
    } catch (error) {
      console.error('Error changing role:', error);
      alert('Error al cambiar rol');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/users/${deleteModal.user.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDeleteModal({ open: false, user: null });
        loadUsers(pagination.page);
      } else {
        const data = await response.json();
        alert(data.error || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN': return styles.badgeAdmin;
      case 'TEACHER': return styles.badgeTeacher;
      default: return styles.badgeStudent;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN': return faUserShield;
      case 'TEACHER': return faChalkboardTeacher;
      default: return faGraduationCap;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'TEACHER': return 'Profesor';
      default: return 'Estudiante';
    }
  };

  if (status === 'loading' || (loading && users.length === 0)) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
            <p>Cargando usuarios...</p>
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
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <h1 className={styles.title}>Gestión de Usuarios</h1>
          <p className={styles.subtitle}>
            Administra los usuarios de la plataforma
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className={styles.navTabs}>
          <Link href="/admin" className={styles.navTab}>
            <FontAwesomeIcon icon={faChartLine} />
            Estadísticas
          </Link>
          <Link href="/admin/users" className={`${styles.navTab} ${styles.navTabActive}`}>
            <FontAwesomeIcon icon={faUsers} />
            Usuarios
          </Link>
        </div>

        {/* Table Controls */}
        <div className={styles.tableControls}>
          <div className={styles.searchInput}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Buscar por email o username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos los roles</option>
            <option value="ADMIN">Administrador</option>
            <option value="STUDENT">Estudiante</option>
            <option value="TEACHER">Profesor</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos los estados</option>
            <option value="verified">Verificados</option>
            <option value="unverified">Sin verificar</option>
          </select>
        </div>

        {/* Users Table */}
        <div className={styles.tableSection}>
          <div className={styles.tableContainer}>
            {users.length === 0 ? (
              <div className={styles.emptyState}>
                <FontAwesomeIcon icon={faUsers} className={styles.emptyIcon} />
                <p className={styles.emptyText}>No se encontraron usuarios</p>
              </div>
            ) : (
              <>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Datos</th>
                      <th>Fecha Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className={styles.userInfo}>
                            <span className={styles.username}>{user.username}</span>
                            <span className={styles.email}>{user.email}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${getRoleBadgeClass(user.role)}`}>
                            <FontAwesomeIcon icon={getRoleIcon(user.role)} />
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td>
                          {user.emailVerified ? (
                            <span className={`${styles.badge} ${styles.badgeVerified}`}>
                              <FontAwesomeIcon icon={faCheckCircle} />
                              Verificado
                            </span>
                          ) : (
                            <span className={`${styles.badge} ${styles.badgeUnverified}`}>
                              <FontAwesomeIcon icon={faTimesCircle} />
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td>
                          <div className={styles.statsCell}>
                            <span className={styles.miniStat}>
                              <FontAwesomeIcon icon={faBook} className={styles.miniStatIcon} />
                              {user.promediosCount}
                            </span>
                            <span className={styles.miniStat}>
                              <FontAwesomeIcon icon={faCalendarAlt} className={styles.miniStatIcon} />
                              {user.semestersCount}
                            </span>
                          </div>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <div className={styles.actionsCell}>
                            <button
                              className={styles.actionButton}
                              onClick={() => setRoleModal({ open: true, user, newRole: user.role })}
                              title="Cambiar rol"
                              disabled={user.id === session.user.id}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                              onClick={() => setDeleteModal({ open: true, user })}
                              title="Eliminar usuario"
                              disabled={user.id === session.user.id}
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
                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} usuarios
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

        {/* Role Change Modal */}
        {roleModal.open && (
          <div className={styles.modalBackdrop} onClick={() => !actionLoading && setRoleModal({ open: false, user: null, newRole: '' })}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Cambiar Rol</h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setRoleModal({ open: false, user: null, newRole: '' })}
                  disabled={actionLoading}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <p className={styles.modalText}>
                  Cambiar el rol de <strong>{roleModal.user?.username}</strong> ({roleModal.user?.email})
                </p>
                <label className={styles.modalLabel}>Nuevo rol</label>
                <select
                  className={styles.modalSelect}
                  value={roleModal.newRole}
                  onChange={(e) => setRoleModal({ ...roleModal, newRole: e.target.value })}
                  disabled={actionLoading}
                >
                  <option value="STUDENT">Estudiante</option>
                  <option value="TEACHER">Profesor</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className={styles.modalFooter}>
                <button
                  className={`${styles.modalButton} ${styles.modalButtonSecondary}`}
                  onClick={() => setRoleModal({ open: false, user: null, newRole: '' })}
                  disabled={actionLoading}
                >
                  Cancelar
                </button>
                <button
                  className={`${styles.modalButton} ${styles.modalButtonPrimary}`}
                  onClick={handleRoleChange}
                  disabled={actionLoading || roleModal.newRole === roleModal.user?.role}
                >
                  {actionLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.open && (
          <div className={styles.modalBackdrop} onClick={() => !actionLoading && setDeleteModal({ open: false, user: null })}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Eliminar Usuario</h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setDeleteModal({ open: false, user: null })}
                  disabled={actionLoading}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <p className={styles.modalText}>
                  ¿Estás seguro de que deseas eliminar al usuario <strong>{deleteModal.user?.username}</strong> ({deleteModal.user?.email})?
                </p>
                <p className={styles.modalText}>
                  Esta acción eliminará la cuenta y todos sus datos asociados. Esta acción no se puede deshacer.
                </p>
              </div>
              <div className={styles.modalFooter}>
                <button
                  className={`${styles.modalButton} ${styles.modalButtonSecondary}`}
                  onClick={() => setDeleteModal({ open: false, user: null })}
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
