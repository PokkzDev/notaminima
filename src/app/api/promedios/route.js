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
    const semesterId = searchParams.get('semesterId');

    const whereClause = {
      userId: session.user.id,
    };

    // Filter by semester if specified
    if (semesterId === 'null') {
      // Get promedios without a semester (orphans)
      whereClause.semesterId = null;
    } else if (semesterId) {
      whereClause.semesterId = semesterId;
    }

    const promedios = await prisma.promedio.findMany({
      where: whereClause,
      orderBy: {
        orden: 'asc',
      },
    });

    return NextResponse.json({ promedios });
  } catch (error) {
    console.error('Error fetching promedios:', error);
    return NextResponse.json(
      { error: 'Error al obtener promedios' },
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

    const { nombre, notas, examenFinal, semesterId } = await request.json();

    if (!nombre || !notas) {
      return NextResponse.json(
        { error: 'Nombre y notas son requeridos' },
        { status: 400 }
      );
    }

    // Verify semester belongs to user if provided
    if (semesterId) {
      const semester = await prisma.semester.findFirst({
        where: {
          id: semesterId,
          userId: session.user.id,
        },
      });

      if (!semester) {
        return NextResponse.json(
          { error: 'Semestre no encontrado' },
          { status: 404 }
        );
      }
    }

    const promedio = await prisma.promedio.create({
      data: {
        userId: session.user.id,
        nombre,
        notas,
        examenFinal: examenFinal || null,
        semesterId: semesterId || null,
      },
    });

    return NextResponse.json({ promedio }, { status: 201 });
  } catch (error) {
    console.error('Error creating promedio:', error);
    return NextResponse.json(
      { error: 'Error al crear promedio' },
      { status: 500 }
    );
  }
}


