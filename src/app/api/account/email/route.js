import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createEmailChangeToken, getPendingEmailChangeToken } from '@/lib/auth';
import { sendEmailChangeVerificationEmail } from '@/lib/email';
import { isValidEmail, normalizeEmail } from '@/lib/validation';
import { prisma } from '@/lib/prisma';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { email: newEmail } = await request.json();

    if (!newEmail) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      );
    }

    if (!isValidEmail(newEmail)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(newEmail);

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        deletedAt: null,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está en uso' },
        { status: 400 }
      );
    }

    // Check if it's the same email
    if (normalizedEmail === normalizeEmail(session.user.email)) {
      return NextResponse.json(
        { error: 'Este es tu email actual' },
        { status: 400 }
      );
    }

    // Check if there's already a pending verification token for this email change
    const pendingToken = await getPendingEmailChangeToken(session.user.id, normalizedEmail);
    if (pendingToken) {
      return NextResponse.json(
        { error: 'Ya se ha enviado un email de verificación a esta dirección. Por favor revisa tu bandeja de entrada.' },
        { status: 400 }
      );
    }

    // Create verification token
    const token = await createEmailChangeToken(session.user.id, normalizedEmail);

    // Send verification email (don't fail if email fails, but log it)
    try {
      const emailResult = await sendEmailChangeVerificationEmail(normalizedEmail, token);
      if (!emailResult.success) {
        console.error('Failed to send email change verification email:', {
          email: normalizedEmail,
          error: emailResult.error,
        });
        // Still return success to user, but log the error
      } else {
        console.log('Email change verification email sent successfully to:', normalizedEmail);
      }
    } catch (emailError) {
      console.error('Exception while sending email change verification email:', {
        email: normalizedEmail,
        error: emailError,
      });
      // Continue even if email fails (for development/testing)
    }

    return NextResponse.json(
      { message: 'Se ha enviado un email de verificación a la nueva dirección. Por favor revisa tu bandeja de entrada y haz clic en el enlace para completar el cambio.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el email' },
      { status: 500 }
    );
  }
}

