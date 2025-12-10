import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const user = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            promedios: true,
            semesters: true,
            carreras: true
          }
        },
        promedios: {
          select: {
            id: true,
            nombre: true,
            notas: true,
            semesterId: true
          }
        },
        carreras: {
          select: {
            id: true,
            nombre: true,
            semesters: {
              select: {
                id: true,
                nombre: true,
                promedios: {
                  select: {
                    id: true,
                    nombre: true
                  }
                }
              },
              orderBy: { orden: 'asc' }
            }
          },
          orderBy: { orden: 'asc' }
        },
        semesters: {
          where: { carreraId: null },
          select: {
            id: true,
            nombre: true,
            promedios: {
              select: {
                id: true,
                nombre: true
              }
            }
          },
          orderBy: { orden: 'asc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Calculate total notes across all promedios
    let totalNotas = 0;
    user.promedios.forEach(promedio => {
      if (promedio.notas && Array.isArray(promedio.notas)) {
        totalNotas += promedio.notas.length;
      }
    });

    // Build carreras structure with semesters and ramos
    const carrerasWithRamos = user.carreras.map(carrera => ({
      id: carrera.id,
      nombre: carrera.nombre,
      semesters: carrera.semesters.map(semester => ({
        id: semester.id,
        nombre: semester.nombre,
        ramos: semester.promedios.map(p => p.nombre)
      }))
    }));

    // Add "Sin Carrera" semesters if any exist
    const sinCarreraSemesters = user.semesters.map(semester => ({
      id: semester.id,
      nombre: semester.nombre,
      ramos: semester.promedios.map(p => p.nombre)
    }));

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        emailVerified: user.emailVerified !== null,
        emailVerifiedAt: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        promediosCount: user._count.promedios,
        semestersCount: user._count.semesters,
        carrerasCount: user._count.carreras,
        totalNotas: totalNotas,
        carrerasWithRamos,
        sinCarreraSemesters
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { role, action } = body;

    // Check user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Handle verify action
    if (action === 'verify') {
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { error: 'El usuario ya está verificado' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { emailVerified: new Date() },
        select: {
          id: true,
          email: true,
          username: true,
          emailVerified: true
        }
      });

      return NextResponse.json({
        user: updatedUser,
        message: 'Usuario verificado correctamente'
      });
    }

    // Handle unverify action
    if (action === 'unverify') {
      if (!existingUser.emailVerified) {
        return NextResponse.json(
          { error: 'El usuario no está verificado' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { emailVerified: null },
        select: {
          id: true,
          email: true,
          username: true,
          emailVerified: true
        }
      });

      return NextResponse.json({
        user: updatedUser,
        message: 'Verificación eliminada correctamente'
      });
    }

    // Handle role change
    if (role) {
      // Validate role
      if (!['ADMIN', 'STUDENT', 'TEACHER'].includes(role)) {
        return NextResponse.json(
          { error: 'Rol inválido' },
          { status: 400 }
        );
      }

      // Prevent admin from changing their own role
      if (id === session.user.id) {
        return NextResponse.json(
          { error: 'No puedes cambiar tu propio rol' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          email: true,
          username: true,
          role: true
        }
      });

      return NextResponse.json({
        user: updatedUser,
        message: 'Rol actualizado correctamente'
      });
    }

    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Prevent admin from deleting themselves
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu propia cuenta desde aquí' },
        { status: 400 }
      );
    }

    // Prevent deleting the last admin
    if (existingUser.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: {
          role: 'ADMIN',
          deletedAt: null
        }
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'No se puede eliminar el único administrador del sistema' },
          { status: 400 }
        );
      }
    }

    // Soft delete the user
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return NextResponse.json({
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
}
