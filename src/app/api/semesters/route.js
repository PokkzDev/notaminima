import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const carreraId = searchParams.get('carreraId');

    const whereClause = {
      userId: session.user.id,
    };

    // Filter by carrera if specified
    if (carreraId === 'null') {
      whereClause.carreraId = null;
    } else if (carreraId) {
      whereClause.carreraId = carreraId;
    }

    const semesters = await prisma.semester.findMany({
      where: whereClause,
      orderBy: {
        orden: 'asc',
      },
      include: {
        promedios: true,
        carrera: true,
      },
    });

    return NextResponse.json({ semesters });
  } catch (error) {
    console.error('Error fetching semesters:', error);
    return NextResponse.json(
      { error: 'Error al obtener semestres' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { nombre, carreraId } = await request.json();

    if (!nombre) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    // If carreraId is provided, verify ownership
    if (carreraId) {
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

    // Get the highest orden value for this user (within the carrera if specified)
    const lastSemester = await prisma.semester.findFirst({
      where: { 
        userId: session.user.id,
        carreraId: carreraId || null,
      },
      orderBy: { orden: 'desc' },
    });

    const newOrden = lastSemester ? lastSemester.orden + 1 : 0;

    const semester = await prisma.semester.create({
      data: {
        userId: session.user.id,
        nombre,
        orden: newOrden,
        carreraId: carreraId || null,
      },
      include: {
        carrera: true,
      },
    });

    return NextResponse.json({ semester }, { status: 201 });
  } catch (error) {
    console.error('Error creating semester:', error);
    return NextResponse.json(
      { error: 'Error al crear semestre' },
      { status: 500 }
    );
  }
}
