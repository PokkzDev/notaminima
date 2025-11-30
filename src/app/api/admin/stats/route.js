import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Get user counts by role
    const [totalUsers, activeUsers, usersByRole, totalPromedios, totalSemesters] = await Promise.all([
      prisma.user.count({
        where: { deletedAt: null }
      }),
      prisma.user.count({
        where: {
          deletedAt: null,
          emailVerified: { not: null }
        }
      }),
      prisma.user.groupBy({
        by: ['role'],
        where: { deletedAt: null },
        _count: true
      }),
      prisma.promedio.count(),
      prisma.semester.count()
    ]);

    // Get registration trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await prisma.user.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group registrations by date
    const registrationsByDate = {};
    for (const user of recentUsers) {
      const date = user.createdAt.toISOString().split('T')[0];
      registrationsByDate[date] = (registrationsByDate[date] || 0) + 1;
    }

    // Fill in missing dates with 0
    const registrationTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      registrationTrend.push({
        date: dateStr,
        count: registrationsByDate[dateStr] || 0
      });
    }

    // Calculate averages
    const usersWithPromedios = await prisma.user.count({
      where: {
        deletedAt: null,
        promedios: { some: {} }
      }
    });

    const usersWithSemesters = await prisma.user.count({
      where: {
        deletedAt: null,
        semesters: { some: {} }
      }
    });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentPromedios, recentSemesters, newUsersThisWeek] = await Promise.all([
      prisma.promedio.count({
        where: {
          createdAt: { gte: sevenDaysAgo }
        }
      }),
      prisma.semester.count({
        where: {
          createdAt: { gte: sevenDaysAgo }
        }
      }),
      prisma.user.count({
        where: {
          deletedAt: null,
          createdAt: { gte: sevenDaysAgo }
        }
      })
    ]);

    // Transform usersByRole to object
    const roleDistribution = {};
    for (const item of usersByRole) {
      roleDistribution[item.role] = item._count;
    }

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        unverifiedUsers: totalUsers - activeUsers,
        roleDistribution,
        totalPromedios,
        totalSemesters,
        usersWithPromedios,
        usersWithSemesters,
        averagePromediosPerUser: totalUsers > 0 ? (totalPromedios / totalUsers).toFixed(2) : 0,
        averageSemestersPerUser: totalUsers > 0 ? (totalSemesters / totalUsers).toFixed(2) : 0,
        recentActivity: {
          newUsers: newUsersThisWeek,
          newPromedios: recentPromedios,
          newSemesters: recentSemesters
        },
        registrationTrend
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
