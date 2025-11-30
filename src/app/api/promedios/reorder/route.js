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

    const { promedios } = await request.json();

    if (!promedios || !Array.isArray(promedios)) {
      return NextResponse.json(
        { error: 'Lista de promedios requerida' },
        { status: 400 }
      );
    }

    // Update all promedios with their new order
    const updatePromises = promedios.map((promedio, index) =>
      prisma.promedio.update({
        where: {
          id: promedio.id,
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
    console.error('Error reordering promedios:', error);
    return NextResponse.json(
      { error: 'Error al reordenar cursos' },
      { status: 500 }
    );
  }
}
