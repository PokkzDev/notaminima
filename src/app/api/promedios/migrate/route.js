import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { cursos } = await request.json();

    if (!cursos || !Array.isArray(cursos)) {
      return NextResponse.json(
        { error: 'Datos inválidos. Se requiere un array de cursos' },
        { status: 400 }
      );
    }

    // Delete existing promedios for this user
    await prisma.promedio.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    // Create new promedios from migrated data
    const createdPromedios = await Promise.all(
      cursos.map((curso) =>
        prisma.promedio.create({
          data: {
            userId: session.user.id,
            nombre: curso.nombre,
            notas: curso.notas || [],
          },
        })
      )
    );

    return NextResponse.json(
      { 
        message: 'Datos migrados exitosamente',
        promedios: createdPromedios 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error migrating data:', error);
    return NextResponse.json(
      { error: 'Error al migrar datos' },
      { status: 500 }
    );
  }
}


