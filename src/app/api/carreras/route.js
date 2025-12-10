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

    const carreras = await prisma.carrera.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        orden: 'asc',
      },
      include: {
        semesters: {
          orderBy: {
            orden: 'asc',
          },
          include: {
            promedios: {
              orderBy: {
                orden: 'asc',
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ carreras });
  } catch (error) {
    console.error('Error fetching carreras:', error);
    return NextResponse.json(
      { error: 'Error al obtener carreras' },
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

    const { nombre } = await request.json();

    if (!nombre) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    // Get the highest orden value for this user
    const lastCarrera = await prisma.carrera.findFirst({
      where: { userId: session.user.id },
      orderBy: { orden: 'desc' },
    });

    const newOrden = lastCarrera ? lastCarrera.orden + 1 : 0;

    const carrera = await prisma.carrera.create({
      data: {
        userId: session.user.id,
        nombre,
        orden: newOrden,
      },
      include: {
        semesters: true,
      },
    });

    return NextResponse.json({ carrera }, { status: 201 });
  } catch (error) {
    console.error('Error creating carrera:', error);
    return NextResponse.json(
      { error: 'Error al crear carrera' },
      { status: 500 }
    );
  }
}



