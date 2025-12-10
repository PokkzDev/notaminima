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

    const { carreras } = await request.json();

    if (!carreras || !Array.isArray(carreras)) {
      return NextResponse.json(
        { error: 'Se requiere un array de carreras' },
        { status: 400 }
      );
    }

    // Update orden for each carrera
    const updatePromises = carreras.map((carrera, index) =>
      prisma.carrera.updateMany({
        where: {
          id: carrera.id,
          userId: session.user.id,
        },
        data: {
          orden: index,
        },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering carreras:', error);
    return NextResponse.json(
      { error: 'Error al reordenar carreras' },
      { status: 500 }
    );
  }
}



