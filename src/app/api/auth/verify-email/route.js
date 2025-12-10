import { NextResponse } from 'next/server';
import { createVerificationToken, deleteVerificationTokensByEmail, getUserByEmail, verifyToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import { isValidEmail, normalizeEmail } from '@/lib/validation';

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

    // Verify token and get email
    const email = await verifyToken(token);

    if (!email) {
      return NextResponse.json(
        { error: 'Token de verificación inválido o expirado' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Email verificado exitosamente',
        email,
        token, // Return token so frontend can use it
      },
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

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate required field
    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      );
    }

    // Normalize email (trim and lowercase)
    const normalizedEmail = normalizeEmail(email);

    // Validate email format
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Delete any existing verification tokens for this email (invalidate old codes)
    await deleteVerificationTokensByEmail(normalizedEmail);

    // Create verification token
    const token = await createVerificationToken(normalizedEmail);

    // Send verification email (don't fail if email fails, but log it)
    try {
      const emailResult = await sendVerificationEmail(normalizedEmail, token);
      if (emailResult.success) {
        console.log('Verification email sent successfully to:', normalizedEmail);
      } else {
        console.error('Failed to send verification email:', {
          email: normalizedEmail,
          error: emailResult.error,
        });
        // Still return success to user, but log the error
      }
    } catch (emailError) {
      console.error('Exception while sending verification email:', {
        email: normalizedEmail,
        error: emailError,
      });
      // Continue even if email fails (for development/testing)
    }

    return NextResponse.json(
      { 
        message: 'Email de verificación enviado. Por favor revisa tu bandeja de entrada.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification initiation error:', error);
    return NextResponse.json(
      { error: 'Error al enviar el email de verificación' },
      { status: 500 }
    );
  }
}

