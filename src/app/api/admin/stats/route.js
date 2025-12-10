import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
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

    // Get date boundaries
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const twelveMonthsAgo = new Date(todayStart);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    // Base queries
    const [
      totalUsers,
      activeUsers,
      usersByRole,
      totalPromedios,
      totalSemesters,
      totalCarreras,
      usersToday,
      usersLast7Days
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
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
      prisma.semester.count(),
      prisma.carrera.count(),
      prisma.user.count({
        where: {
          deletedAt: null,
          createdAt: { gte: todayStart }
        }
      }),
      prisma.user.count({
        where: {
          deletedAt: null,
          createdAt: { gte: sevenDaysAgo }
        }
      })
    ]);

    // Get users for last 7 days chart (day by day)
    const usersLast7DaysRaw = await prisma.user.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: sevenDaysAgo }
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Group by day for last 7 days
    const last7DaysData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(todayStart);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = usersLast7DaysRaw.filter(u => {
        const created = new Date(u.createdAt);
        return created >= date && created < nextDate;
      }).length;
      
      last7DaysData.push({
        label: date.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' }),
        date: date.toISOString().split('T')[0],
        count
      });
    }

    // Get users for last 12 months chart
    const usersLast12MonthsRaw = await prisma.user.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: twelveMonthsAgo }
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Group by month for last 12 months
    const last12MonthsData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      
      const count = usersLast12MonthsRaw.filter(u => {
        const created = new Date(u.createdAt);
        return created >= date && created < nextMonth;
      }).length;
      
      last12MonthsData.push({
        label: date.toLocaleDateString('es-CL', { month: 'short', year: '2-digit' }),
        month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        count
      });
    }

    // Transform role distribution
    const roleDistribution = {};
    for (const item of usersByRole) {
      roleDistribution[item.role] = item._count;
    }

    return NextResponse.json({
      stats: {
        // Overview
        totalUsers,
        activeUsers,
        unverifiedUsers: totalUsers - activeUsers,
        verificationRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0,
        
        // Content stats
        totalPromedios,
        totalSemesters,
        totalCarreras,
        
        // Registration stats
        usersToday,
        usersLast7Days,
        last7DaysData,
        last12MonthsData,
        
        // Role distribution
        roleDistribution
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
