import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const semesters = await prisma.semester.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        orden: 'asc',
      },
      include: {
        promedios: true,
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

    if (!session || !session.user) {
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
    const lastSemester = await prisma.semester.findFirst({
      where: { userId: session.user.id },
      orderBy: { orden: 'desc' },
    });

    const newOrden = lastSemester ? lastSemester.orden + 1 : 0;

    const semester = await prisma.semester.create({
      data: {
        userId: session.user.id,
        nombre,
        orden: newOrden,
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
