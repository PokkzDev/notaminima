import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { nombre, orden, carreraId } = await request.json();

    if (!nombre && orden === undefined && carreraId === undefined) {
      return NextResponse.json(
        { error: 'Nombre, orden o carreraId son requeridos' },
        { status: 400 }
      );
    }

    // If carreraId is provided (and not null), verify ownership
    if (carreraId !== undefined && carreraId !== null) {
      const carrera = await prisma.carrera.findFirst({
        where: {
          id: carreraId,
          userId: session.user.id,
        },
      });

      if (!carrera) {
        return NextResponse.json(
          { error: 'Carrera no encontrada' },
          { status: 404 }
        );
      }
    }

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (orden !== undefined) updateData.orden = orden;
    if (carreraId !== undefined) updateData.carreraId = carreraId;

    const semester = await prisma.semester.update({
      where: { 
        id,
        userId: session.user.id,
      },
      data: updateData,
      include: {
        carrera: true,
      },
    });

    return NextResponse.json({ semester });
  } catch (error) {
    console.error('Error updating semester:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Semestre no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al actualizar semestre' },
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

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const deleteCourses = searchParams.get('deleteCourses') === 'true';

    if (deleteCourses) {
      // Delete all promedios in this semester first
      await prisma.promedio.deleteMany({
        where: {
          semesterId: id,
          userId: session.user.id,
        },
      });
    }
    // If deleteCourses is false, promedios will have semesterId set to null (SetNull)

    await prisma.semester.delete({
      where: { 
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: 'Semestre eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting semester:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Semestre no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al eliminar semestre' },
      { status: 500 }
    );
  }
}
