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
    const { nombre, notas, examenFinal, semesterId } = await request.json();

    if (!nombre && !notas && examenFinal === undefined && semesterId === undefined) {
      return NextResponse.json(
        { error: 'Nombre, notas, examenFinal o semesterId son requeridos' },
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

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (notas) updateData.notas = notas;
    if (examenFinal !== undefined) updateData.examenFinal = examenFinal;
    if (semesterId !== undefined) updateData.semesterId = semesterId || null;

    // Update with userId in where clause - combines ownership check and update in one query
    // Prisma will throw P2025 if record not found or doesn't belong to user
    const promedio = await prisma.promedio.update({
      where: { 
        id,
        userId: session.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({ promedio });
  } catch (error) {
    console.error('Error updating promedio:', error);
    
    // Handle Prisma record not found error (P2025)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Promedio no encontrado' },
        { status: 404 }
      );
    }
    
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

    // Delete with userId in where clause - combines ownership check and delete in one query
    // Prisma will throw P2025 if record not found or doesn't belong to user
    await prisma.promedio.delete({
      where: { 
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: 'Promedio eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting promedio:', error);
    
    // Handle Prisma record not found error (P2025)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Promedio no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al eliminar promedio' },
      { status: 500 }
    );
  }
}


