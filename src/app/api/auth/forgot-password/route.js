import { NextResponse } from 'next/server';
import { getUserByEmail, createPasswordResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import { isValidEmail, normalizeEmail } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);

    // Check rate limit (max 3 requests per 15 minutes per email)
    const rateLimit = checkRateLimit(normalizedEmail);
    
    if (!rateLimit.success) {
      const minutesRemaining = Math.ceil(rateLimit.retryAfterSeconds / 60);
      return NextResponse.json(
        { 
          error: `Demasiados intentos. Por favor espera ${minutesRemaining} minuto${minutesRemaining > 1 ? 's' : ''} antes de intentar nuevamente.`,
          retryAfter: rateLimit.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // Check if user exists
    const user = await getUserByEmail(normalizedEmail);

    // Always return success message to prevent email enumeration attacks
    // Even if user doesn't exist, we don't want to reveal that information
    const successMessage = 'Si existe una cuenta con este email, recibirás instrucciones para restablecer tu contraseña.';

    if (!user) {
      // User doesn't exist, but we return success to prevent enumeration
      return NextResponse.json(
        { message: successMessage },
        { status: 200 }
      );
    }

    // Check if user has a password (might be OAuth-only account)
    if (!user.password) {
      // User exists but doesn't have a password (OAuth account)
      // Return success to prevent enumeration
      return NextResponse.json(
        { message: successMessage },
        { status: 200 }
      );
    }

    // Create password reset token
    const token = await createPasswordResetToken(normalizedEmail);

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(normalizedEmail, token);

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      return NextResponse.json(
        { error: 'Error al enviar el email. Por favor intenta nuevamente.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: successMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
