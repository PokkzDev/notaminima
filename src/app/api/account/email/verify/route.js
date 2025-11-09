import { NextResponse } from 'next/server';
import { verifyEmailChangeToken, updateUserEmail, deleteVerificationToken } from '@/lib/auth';
import { normalizeEmail } from '@/lib/validation';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token de verificación requerido' },
        { status: 400 }
      );
    }

    // Verify token and get userId and newEmail
    const tokenData = await verifyEmailChangeToken(token);

    if (!tokenData) {
      return NextResponse.json(
        { error: 'Token de verificación inválido o expirado' },
        { status: 400 }
      );
    }

    const { userId, newEmail } = tokenData;
    const normalizedEmail = normalizeEmail(newEmail);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Check if new email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        deletedAt: null,
        NOT: {
          id: userId,
        },
      },
    });

    if (existingUser) {
      // Delete the token since email is already taken
      await deleteVerificationToken(token);
      return NextResponse.json(
        { error: 'Este email ya está en uso por otra cuenta' },
        { status: 400 }
      );
    }

    // Update user email
    await updateUserEmail(userId, normalizedEmail);

    // Delete all sessions for this user to force re-authentication
    await prisma.session.deleteMany({
      where: { userId: userId },
    });

    // Delete verification token after successful update
    await deleteVerificationToken(token);

    return NextResponse.json(
      { 
        message: 'Email actualizado correctamente',
        email: normalizedEmail,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email change verification error:', error);
    return NextResponse.json(
      { error: 'Error al verificar el cambio de email' },
      { status: 500 }
    );
  }
}

