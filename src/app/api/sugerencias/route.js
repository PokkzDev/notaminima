import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req) {
  try {
    // Rate limiting por IP
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimitKey = `suggestion:${ip}`;
    const rateLimitResult = checkRateLimit(rateLimitKey);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor, espera un momento.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { nombre, email, tipo, plataforma, mensaje } = body;

    // Validaciones
    if (!mensaje || mensaje.trim().length === 0) {
      return NextResponse.json(
        { error: 'El mensaje es obligatorio' },
        { status: 400 }
      );
    }

    if (mensaje.trim().length < 10) {
      return NextResponse.json(
        { error: 'El mensaje debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    if (mensaje.trim().length > 2000) {
      return NextResponse.json(
        { error: 'El mensaje no puede exceder los 2000 caracteres' },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'El email no es válido' },
        { status: 400 }
      );
    }

    if (nombre && nombre.trim().length > 100) {
      return NextResponse.json(
        { error: 'El nombre no puede exceder los 100 caracteres' },
        { status: 400 }
      );
    }

    const tiposValidos = ['sugerencia', 'error', 'pregunta', 'otro'];
    const tipoFinal = tiposValidos.includes(tipo) ? tipo : 'sugerencia';

    const plataformasValidas = ['desktop', 'mobile'];
    const plataformaFinal = plataformasValidas.includes(plataforma) ? plataforma : 'desktop';

    // Guardar en la base de datos
    const sugerencia = await prisma.sugerencia.create({
      data: {
        nombre: nombre?.trim() || null,
        email: email?.trim() || null,
        tipo: tipoFinal,
        plataforma: plataformaFinal,
        mensaje: mensaje.trim(),
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: '¡Gracias por tu sugerencia! La revisaremos pronto.',
        id: sugerencia.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al guardar sugerencia:', error);
    return NextResponse.json(
      { error: 'Error al procesar la sugerencia. Por favor, intenta de nuevo.' },
      { status: 500 }
    );
  }
}

