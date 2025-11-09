import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { nombre, notas } = await request.json();

    if (!nombre && !notas) {
      return NextResponse.json(
        { error: 'Nombre o notas son requeridos' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingPromedio = await prisma.promedio.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingPromedio) {
      return NextResponse.json(
        { error: 'Promedio no encontrado' },
        { status: 404 }
      );
    }

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (notas) updateData.notas = notas;

    const promedio = await prisma.promedio.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ promedio });
  } catch (error) {
    console.error('Error updating promedio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar promedio' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership
    const existingPromedio = await prisma.promedio.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingPromedio) {
      return NextResponse.json(
        { error: 'Promedio no encontrado' },
        { status: 404 }
      );
    }

    await prisma.promedio.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Promedio eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting promedio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar promedio' },
      { status: 500 }
    );
  }
}


