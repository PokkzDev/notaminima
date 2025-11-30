import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { semesters } = await request.json();

    if (!semesters || !Array.isArray(semesters)) {
      return NextResponse.json(
        { error: 'Lista de semestres requerida' },
        { status: 400 }
      );
    }

    // Update all semesters with their new order
    const updatePromises = semesters.map((semester, index) =>
      prisma.semester.update({
        where: {
          id: semester.id,
          userId: session.user.id,
        },
        data: {
          orden: index,
        },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Orden actualizado exitosamente' });
  } catch (error) {
    console.error('Error reordering semesters:', error);
    return NextResponse.json(
      { error: 'Error al reordenar semestres' },
      { status: 500 }
    );
  }
}
