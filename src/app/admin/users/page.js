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
  faChalkboardTeacher,
  faLightbulb,
  faEnvelope,
  faIdCard,
  faFolderOpen,
  faStickyNote,
  faClock,
  faUserEdit,
  faExclamationTriangle,
  faUserCheck,
  faUserTimes
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
  const [userModal, setUserModal] = useState({ open: false, user: null, loading: false });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

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

  const openUserModal = async (user) => {
    setUserModal({ open: true, user: null, loading: true });
    setSelectedRole(user.role);
    
    try {
      const response = await fetch(`/api/admin/users/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserModal({ open: true, user: data.user, loading: false });
        setSelectedRole(data.user.role);
      } else {
        setUserModal({ open: false, user: null, loading: false });
        alert('Error al cargar los datos del usuario');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUserModal({ open: false, user: null, loading: false });
      alert('Error al cargar los datos del usuario');
    }
  };

  const closeUserModal = () => {
    if (!actionLoading) {
      setUserModal({ open: false, user: null, loading: false });
      setSelectedRole('');
    }
  };

  const handleRoleChange = async () => {
    if (!userModal.user || !selectedRole || selectedRole === userModal.user.role) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/users/${userModal.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole })
      });

      if (response.ok) {
        // Update local user data
        setUserModal(prev => ({
          ...prev,
          user: { ...prev.user, role: selectedRole }
        }));
        loadUsers(pagination.page);
      } else {
        const data = await response.json();
        alert(data.error || 'Error al cambiar rol');
        setSelectedRole(userModal.user.role);
      }
    } catch (error) {
      console.error('Error changing role:', error);
      alert('Error al cambiar rol');
      setSelectedRole(userModal.user.role);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyToggle = async (user, isVerified) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isVerified ? 'unverify' : 'verify' })
      });

      if (response.ok) {
        // Update modal user data if open
        if (userModal.open && userModal.user?.id === user.id) {
          setUserModal(prev => ({
            ...prev,
            user: { 
              ...prev.user, 
              emailVerified: !isVerified,
              emailVerifiedAt: !isVerified ? new Date().toISOString() : null
            }
          }));
        }
        loadUsers(pagination.page);
      } else {
        const data = await response.json();
        alert(data.error || 'Error al cambiar estado de verificación');
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
      alert('Error al cambiar estado de verificación');
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
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  };

  const getUserInitials = (user) => {
    if (!user) return '?';
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return '?';
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
          <Link href="/admin/sugerencias" className={styles.navTab}>
            <FontAwesomeIcon icon={faLightbulb} />
            Sugerencias
          </Link>
        </div>

        {/* Table Controls */}
        <div className={styles.tableControls}>
          <div className={styles.searchWrapper}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por email o username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
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
                              onClick={() => openUserModal(user)}
                              title="Ver detalles"
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

        {/* User Detail Modal */}
        {userModal.open && (
          <div className={styles.modalBackdrop} onClick={closeUserModal}>
            <div className={styles.userModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  <FontAwesomeIcon icon={faUserEdit} style={{ marginRight: '0.5rem' }} />
                  Detalles del Usuario
                </h3>
                <button
                  className={styles.modalClose}
                  onClick={closeUserModal}
                  disabled={actionLoading}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              {userModal.loading ? (
                <div className={styles.modalLoading}>
                  <FontAwesomeIcon icon={faSpinner} spin className={styles.modalSpinner} />
                  <p>Cargando datos del usuario...</p>
                </div>
              ) : userModal.user && (
                <div className={styles.userModalContent}>
                  {/* User Header */}
                  <div className={styles.userModalHeader}>
                    <div className={`${styles.userAvatar} ${styles[`userAvatar${userModal.user.role}`]}`}>
                      {getUserInitials(userModal.user)}
                    </div>
                    <div className={styles.userHeaderInfo}>
                      <h4 className={styles.userModalName}>{userModal.user.username}</h4>
                      <p className={styles.userModalEmail}>
                        <FontAwesomeIcon icon={faEnvelope} />
                        {userModal.user.email}
                      </p>
                      <div className={styles.userModalBadges}>
                        <span className={`${styles.badge} ${getRoleBadgeClass(userModal.user.role)}`}>
                          <FontAwesomeIcon icon={getRoleIcon(userModal.user.role)} />
                          {getRoleLabel(userModal.user.role)}
                        </span>
                        {userModal.user.emailVerified ? (
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
                      </div>
                    </div>
                  </div>

                  {/* User ID */}
                  <div className={styles.userIdSection}>
                    <FontAwesomeIcon icon={faIdCard} />
                    <span className={styles.userId}>{userModal.user.id}</span>
                  </div>

                  {/* Stats Grid */}
                  <div className={styles.userStatsGrid}>
                    <div className={styles.userStatCard}>
                      <div className={styles.userStatIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                        <FontAwesomeIcon icon={faBook} />
                      </div>
                      <div className={styles.userStatInfo}>
                        <span className={styles.userStatValue}>{userModal.user.promediosCount}</span>
                        <span className={styles.userStatLabel}>Promedios</span>
                      </div>
                    </div>
                    <div className={styles.userStatCard}>
                      <div className={styles.userStatIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <div className={styles.userStatInfo}>
                        <span className={styles.userStatValue}>{userModal.user.semestersCount}</span>
                        <span className={styles.userStatLabel}>Semestres</span>
                      </div>
                    </div>
                    <div className={styles.userStatCard}>
                      <div className={styles.userStatIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <FontAwesomeIcon icon={faFolderOpen} />
                      </div>
                      <div className={styles.userStatInfo}>
                        <span className={styles.userStatValue}>{userModal.user.carrerasCount}</span>
                        <span className={styles.userStatLabel}>Carreras</span>
                      </div>
                    </div>
                    <div className={styles.userStatCard}>
                      <div className={styles.userStatIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                        <FontAwesomeIcon icon={faStickyNote} />
                      </div>
                      <div className={styles.userStatInfo}>
                        <span className={styles.userStatValue}>{userModal.user.totalNotas}</span>
                        <span className={styles.userStatLabel}>Notas</span>
                      </div>
                    </div>
                  </div>

                  {/* Dates Section */}
                  <div className={styles.userDatesSection}>
                    <h5 className={styles.userSectionTitle}>
                      <FontAwesomeIcon icon={faClock} />
                      Información de Cuenta
                    </h5>
                    <div className={styles.userDatesList}>
                      <div className={styles.userDateItem}>
                        <span className={styles.userDateLabel}>Registro</span>
                        <span className={styles.userDateValue}>
                          {formatDateTime(userModal.user.createdAt)}
                          <span className={styles.userDateRelative}>{getRelativeTime(userModal.user.createdAt)}</span>
                        </span>
                      </div>
                      <div className={styles.userDateItem}>
                        <span className={styles.userDateLabel}>Última actualización</span>
                        <span className={styles.userDateValue}>
                          {formatDateTime(userModal.user.updatedAt)}
                          <span className={styles.userDateRelative}>{getRelativeTime(userModal.user.updatedAt)}</span>
                        </span>
                      </div>
                      {userModal.user.emailVerified && userModal.user.emailVerifiedAt && (
                        <div className={styles.userDateItem}>
                          <span className={styles.userDateLabel}>Email verificado</span>
                          <span className={styles.userDateValue}>
                            {formatDateTime(userModal.user.emailVerifiedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Management Section */}
                  <div className={styles.userVerifySection}>
                    <h5 className={styles.userSectionTitle}>
                      <FontAwesomeIcon icon={faUserCheck} />
                      Estado de Verificación
                    </h5>
                    <div className={styles.verifyStatus}>
                      {userModal.user.emailVerified ? (
                        <div className={styles.verifyStatusBadge}>
                          <FontAwesomeIcon icon={faCheckCircle} className={styles.verifyStatusIconSuccess} />
                          <span>Email verificado</span>
                        </div>
                      ) : (
                        <div className={styles.verifyStatusBadge}>
                          <FontAwesomeIcon icon={faTimesCircle} className={styles.verifyStatusIconWarning} />
                          <span>Email pendiente de verificación</span>
                        </div>
                      )}
                      <button
                        className={userModal.user.emailVerified ? styles.unverifyButton : styles.verifyButton}
                        onClick={() => handleVerifyToggle(userModal.user, userModal.user.emailVerified)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : userModal.user.emailVerified ? (
                          <>
                            <FontAwesomeIcon icon={faUserTimes} />
                            Quitar verificación
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faUserCheck} />
                            Verificar usuario
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Role Management Section */}
                  {userModal.user.id !== session.user.id && (
                    <div className={styles.userRoleSection}>
                      <h5 className={styles.userSectionTitle}>
                        <FontAwesomeIcon icon={faUserShield} />
                        Gestión de Rol
                      </h5>
                      <div className={styles.roleSelector}>
                        <button
                          className={`${styles.roleOption} ${selectedRole === 'STUDENT' ? styles.roleOptionActive : ''} ${styles.roleOptionStudent}`}
                          onClick={() => setSelectedRole('STUDENT')}
                          disabled={actionLoading}
                        >
                          <FontAwesomeIcon icon={faGraduationCap} />
                          <span>Estudiante</span>
                        </button>
                        <button
                          className={`${styles.roleOption} ${selectedRole === 'TEACHER' ? styles.roleOptionActive : ''} ${styles.roleOptionTeacher}`}
                          onClick={() => setSelectedRole('TEACHER')}
                          disabled={actionLoading}
                        >
                          <FontAwesomeIcon icon={faChalkboardTeacher} />
                          <span>Profesor</span>
                        </button>
                        <button
                          className={`${styles.roleOption} ${selectedRole === 'ADMIN' ? styles.roleOptionActive : ''} ${styles.roleOptionAdmin}`}
                          onClick={() => setSelectedRole('ADMIN')}
                          disabled={actionLoading}
                        >
                          <FontAwesomeIcon icon={faUserShield} />
                          <span>Admin</span>
                        </button>
                      </div>
                      {selectedRole !== userModal.user.role && (
                        <button
                          className={styles.saveRoleButton}
                          onClick={handleRoleChange}
                          disabled={actionLoading}
                        >
                          {actionLoading ? (
                            <>
                              <FontAwesomeIcon icon={faSpinner} spin />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faCheckCircle} />
                              Guardar cambio de rol
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Self user warning */}
                  {userModal.user.id === session.user.id && (
                    <div className={styles.selfUserWarning}>
                      <FontAwesomeIcon icon={faExclamationTriangle} />
                      <span>No puedes modificar tu propio rol ni eliminarte desde aquí.</span>
                    </div>
                  )}

                  {/* Actions */}
                  {userModal.user.id !== session.user.id && (
                    <div className={styles.userModalActions}>
                      <button
                        className={styles.deleteUserButton}
                        onClick={() => {
                          closeUserModal();
                          setDeleteModal({ open: true, user: userModal.user });
                        }}
                        disabled={actionLoading}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Eliminar usuario
                      </button>
                    </div>
                  )}
                </div>
              )}
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
