import { NextResponse } from 'next/server';
import { verifyPasswordResetToken, deletePasswordResetToken, updateUserPassword, getUserByEmail } from '@/lib/auth';
import { isValidPassword } from '@/lib/validation';
import { resetRateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token de recuperación requerido' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'La nueva contraseña es requerida' },
        { status: 400 }
      );
    }

    // Validate password complexity
    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'La contraseña debe cumplir todos los requisitos de complejidad: más de 7 caracteres, un símbolo, una letra mayúscula, una letra minúscula y un número' },
        { status: 400 }
      );
    }

    // Verify token and get email
    const email = await verifyPasswordResetToken(token);

    if (!email) {
      return NextResponse.json(
        { error: 'El enlace de recuperación es inválido o ha expirado. Por favor solicita uno nuevo.' },
        { status: 400 }
      );
    }

    // Get user by email
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Update user password
    await updateUserPassword(user.id, password);

    // Delete the used token
    await deletePasswordResetToken(token);

    // Reset rate limit for this email after successful password reset
    resetRateLimit(email);

    return NextResponse.json(
      { message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Error al restablecer la contraseña' },
      { status: 500 }
    );
  }
}

// GET endpoint to verify if a token is valid (without consuming it)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token de recuperación requerido' },
        { status: 400 }
      );
    }

    // Verify token (this doesn't delete it)
    const email = await verifyPasswordResetToken(token);

    if (!email) {
      return NextResponse.json(
        { valid: false, error: 'El enlace de recuperación es inválido o ha expirado.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { valid: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Error al verificar el token' },
      { status: 500 }
    );
  }
}
