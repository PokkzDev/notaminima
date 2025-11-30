import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { softDeleteUser, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'La contraseña es requerida para eliminar la cuenta' },
        { status: 400 }
      );
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true, deletedAt: true },
    });

    if (!user?.password) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (user.deletedAt) {
      return NextResponse.json(
        { error: 'Esta cuenta ya ha sido eliminada' },
        { status: 400 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 400 }
      );
    }

    // Soft delete user
    await softDeleteUser(session.user.id);

    // Delete all sessions for this user
    await prisma.session.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(
      { message: 'Cuenta eliminada correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la cuenta' },
      { status: 500 }
    );
  }
}

