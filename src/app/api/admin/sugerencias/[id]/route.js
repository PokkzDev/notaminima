import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Mark suggestion as read/unread
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { leido } = body;

    const sugerencia = await prisma.sugerencia.findUnique({
      where: { id }
    });

    if (!sugerencia) {
      return NextResponse.json(
        { error: 'Sugerencia no encontrada' },
        { status: 404 }
      );
    }

    const updated = await prisma.sugerencia.update({
      where: { id },
      data: { leido: typeof leido === 'boolean' ? leido : !sugerencia.leido }
    });

    return NextResponse.json({ sugerencia: updated });
  } catch (error) {
    console.error('Error updating sugerencia:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la sugerencia' },
      { status: 500 }
    );
  }
}

// Delete suggestion
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const sugerencia = await prisma.sugerencia.findUnique({
      where: { id }
    });

    if (!sugerencia) {
      return NextResponse.json(
        { error: 'Sugerencia no encontrada' },
        { status: 404 }
      );
    }

    await prisma.sugerencia.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sugerencia:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la sugerencia' },
      { status: 500 }
    );
  }
}

