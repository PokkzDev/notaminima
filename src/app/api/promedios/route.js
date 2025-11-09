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

    const promedios = await prisma.promedio.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
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

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { nombre, notas } = await request.json();

    if (!nombre || !notas) {
      return NextResponse.json(
        { error: 'Nombre y notas son requeridos' },
        { status: 400 }
      );
    }

    const promedio = await prisma.promedio.create({
      data: {
        userId: session.user.id,
        nombre,
        notas,
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


