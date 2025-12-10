import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const tipo = searchParams.get('tipo') || '';
    const estado = searchParams.get('estado') || '';
    const search = searchParams.get('search') || '';

    const where = {};

    if (tipo) {
      where.tipo = tipo;
    }

    if (estado === 'leido') {
      where.leido = true;
    } else if (estado === 'no_leido') {
      where.leido = false;
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search } },
        { email: { contains: search } },
        { mensaje: { contains: search } }
      ];
    }

    const [sugerencias, total, noLeidas] = await Promise.all([
      prisma.sugerencia.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sugerencia.count({ where }),
      prisma.sugerencia.count({ where: { leido: false } })
    ]);

    return NextResponse.json({
      sugerencias,
      noLeidas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching sugerencias:', error);
    return NextResponse.json(
      { error: 'Error al cargar las sugerencias' },
      { status: 500 }
    );
  }
}

