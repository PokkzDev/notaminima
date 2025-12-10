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

    const { id } = await params;

    const carrera = await prisma.carrera.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        semesters: {
          orderBy: {
            orden: 'asc',
          },
          include: {
            promedios: true,
          },
        },
      },
    });

    if (!carrera) {
      return NextResponse.json(
        { error: 'Carrera no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ carrera });
  } catch (error) {
    console.error('Error fetching carrera:', error);
    return NextResponse.json(
      { error: 'Error al obtener carrera' },
      { status: 500 }
    );
  }
}

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
    const { nombre } = await request.json();

    // Verify ownership
    const existingCarrera = await prisma.carrera.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingCarrera) {
      return NextResponse.json(
        { error: 'Carrera no encontrada' },
        { status: 404 }
      );
    }

    const carrera = await prisma.carrera.update({
      where: { id },
      data: { nombre },
      include: {
        semesters: true,
      },
    });

    return NextResponse.json({ carrera });
  } catch (error) {
    console.error('Error updating carrera:', error);
    return NextResponse.json(
      { error: 'Error al actualizar carrera' },
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
    const deleteAll = searchParams.get('deleteAll') === 'true';

    // Verify ownership
    const existingCarrera = await prisma.carrera.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        semesters: {
          include: {
            promedios: true,
          },
        },
      },
    });

    if (!existingCarrera) {
      return NextResponse.json(
        { error: 'Carrera no encontrada' },
        { status: 404 }
      );
    }

    if (deleteAll) {
      // Delete all semesters and their courses (cascade)
      for (const semester of existingCarrera.semesters) {
        await prisma.promedio.deleteMany({
          where: { semesterId: semester.id },
        });
        await prisma.semester.delete({
          where: { id: semester.id },
        });
      }
    } else {
      // Move semesters to "Sin Carrera" (set carreraId to null)
      await prisma.semester.updateMany({
        where: { carreraId: id },
        data: { carreraId: null },
      });
    }

    await prisma.carrera.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting carrera:', error);
    return NextResponse.json(
      { error: 'Error al eliminar carrera' },
      { status: 500 }
    );
  }
}


