import { NextResponse } from 'next/server';
import { createUser, getUserByEmail, verifyToken, deleteVerificationToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isValidPassword } from '@/lib/validation';

export async function POST(request) {
  try {
    const { verificationToken, password, username } = await request.json();

    // Validate required fields
    if (!verificationToken || !password || !username) {
      return NextResponse.json(
        { error: 'Token de verificación, contraseña y nombre de usuario son requeridos' },
        { status: 400 }
      );
    }

    // Verify token and get email
    const email = await verifyToken(verificationToken);
    
    if (!email) {
      return NextResponse.json(
        { error: 'Token de verificación inválido o expirado' },
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

    // Validate username
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      return NextResponse.json(
        { error: 'El nombre de usuario es requerido' },
        { status: 400 }
      );
    }

    if (trimmedUsername.length > 100) {
      return NextResponse.json(
        { error: 'El nombre de usuario no puede exceder 100 caracteres' },
        { status: 400 }
      );
    }

    // Check if user already exists (shouldn't happen if flow is correct, but check anyway)
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: trimmedUsername },
    });
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Este nombre de usuario ya está en uso' },
        { status: 400 }
      );
    }

    // Create user (email is already normalized from token)
    const user = await createUser(email, password, trimmedUsername);

    // Delete verification token after successful registration
    await deleteVerificationToken(verificationToken);

    return NextResponse.json(
      { 
        message: 'Usuario creado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error al crear el usuario' },
      { status: 500 }
    );
  }
}

