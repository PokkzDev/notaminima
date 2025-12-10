import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Helper function to get date range
function getDateRange(period) {
  const now = new Date();
  const start = new Date();
  
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setDate(now.getDate() - 30);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      start.setDate(now.getDate() - 30);
  }
  
  return { start, end: now };
}

// Helper to get previous period for comparison
function getPreviousPeriodRange(period) {
  const { start, end } = getDateRange(period);
  const duration = end.getTime() - start.getTime();
  
  return {
    start: new Date(start.getTime() - duration),
    end: new Date(start.getTime())
  };
}

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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // Get date ranges
    const { start: currentStart, end: currentEnd } = getDateRange(period);
    const { start: prevStart, end: prevEnd } = getPreviousPeriodRange(period);

    // Base queries
    const [
      totalUsers,
      activeUsers,
      usersByRole,
      totalPromedios,
      totalSemesters,
      totalCarreras
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
      prisma.carrera.count()
    ]);

    // Current period stats
    const [
      newUsersCurrentPeriod,
      newPromediosCurrentPeriod,
      newSemestersCurrentPeriod
    ] = await Promise.all([
      prisma.user.count({
        where: {
          deletedAt: null,
          createdAt: { gte: currentStart, lte: currentEnd }
        }
      }),
      prisma.promedio.count({
        where: {
          createdAt: { gte: currentStart, lte: currentEnd }
        }
      }),
      prisma.semester.count({
        where: {
          createdAt: { gte: currentStart, lte: currentEnd }
        }
      })
    ]);

    // Previous period stats for comparison
    const [
      newUsersPrevPeriod,
      newPromediosPrevPeriod,
      newSemestersPrevPeriod
    ] = await Promise.all([
      prisma.user.count({
        where: {
          deletedAt: null,
          createdAt: { gte: prevStart, lte: prevEnd }
        }
      }),
      prisma.promedio.count({
        where: {
          createdAt: { gte: prevStart, lte: prevEnd }
        }
      }),
      prisma.semester.count({
        where: {
          createdAt: { gte: prevStart, lte: prevEnd }
        }
      })
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous * 100).toFixed(1);
    };

    // Get registration trends based on period
    const recentUsers = await prisma.user.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: currentStart }
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Get promedio trends
    const recentPromedios = await prisma.promedio.findMany({
      where: {
        createdAt: { gte: currentStart }
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Group by appropriate interval based on period
    const getGroupKey = (date, period) => {
      const d = new Date(date);
      switch (period) {
        case 'today':
          return `${d.getHours()}:00`;
        case 'week':
          return d.toISOString().split('T')[0];
        case 'month':
          return d.toISOString().split('T')[0];
        case 'year':
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        default:
          return d.toISOString().split('T')[0];
      }
    };

    // Group registrations
    const usersByDate = {};
    const promediosByDate = {};
    
    for (const user of recentUsers) {
      const key = getGroupKey(user.createdAt, period);
      usersByDate[key] = (usersByDate[key] || 0) + 1;
    }
    
    for (const promedio of recentPromedios) {
      const key = getGroupKey(promedio.createdAt, period);
      promediosByDate[key] = (promediosByDate[key] || 0) + 1;
    }

    // Generate trend data with all intervals
    const generateTrendData = (dataByKey, period) => {
      const trend = [];
      const now = new Date();
      
      switch (period) {
        case 'today':
          for (let h = 0; h <= now.getHours(); h++) {
            const key = `${h}:00`;
            trend.push({ label: key, count: dataByKey[key] || 0 });
          }
          break;
        case 'week':
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            trend.push({ 
              label: date.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' }), 
              date: key,
              count: dataByKey[key] || 0 
            });
          }
          break;
        case 'month':
          for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            trend.push({ 
              label: date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }), 
              date: key,
              count: dataByKey[key] || 0 
            });
          }
          break;
        case 'year':
          for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            trend.push({ 
              label: date.toLocaleDateString('es-CL', { month: 'short', year: '2-digit' }), 
              date: key,
              count: dataByKey[key] || 0 
            });
          }
          break;
      }
      
      return trend;
    };

    const userTrend = generateTrendData(usersByDate, period);
    const promedioTrend = generateTrendData(promediosByDate, period);

    // Get users with activity stats
    const [usersWithPromedios, usersWithSemesters, usersWithCarreras] = await Promise.all([
      prisma.user.count({
        where: {
          deletedAt: null,
          promedios: { some: {} }
        }
      }),
      prisma.user.count({
        where: {
          deletedAt: null,
          semesters: { some: {} }
        }
      }),
      prisma.user.count({
        where: {
          deletedAt: null,
          carreras: { some: {} }
        }
      })
    ]);

    // Get top users by promedios count
    const topUsersByPromedios = await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        username: true,
        email: true,
        _count: {
          select: { promedios: true, semesters: true, carreras: true }
        }
      },
      orderBy: {
        promedios: { _count: 'desc' }
      },
      take: 5
    });

    // Get verification rate over time
    const verifiedUsers = await prisma.user.findMany({
      where: {
        deletedAt: null,
        emailVerified: { not: null }
      },
      select: { emailVerified: true },
      orderBy: { emailVerified: 'asc' }
    });

    // Activity by day of week
    const allUsers = await prisma.user.findMany({
      where: { deletedAt: null },
      select: { createdAt: true }
    });

    const dayOfWeekDistribution = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    for (const user of allUsers) {
      const day = new Date(user.createdAt).getDay();
      dayOfWeekDistribution[day]++;
    }

    // Activity by hour
    const hourDistribution = Array(24).fill(0);
    for (const user of allUsers) {
      const hour = new Date(user.createdAt).getHours();
      hourDistribution[hour]++;
    }

    // Transform role distribution
    const roleDistribution = {};
    for (const item of usersByRole) {
      roleDistribution[item.role] = item._count;
    }

    // Recent activity (last 24h, 7d, 30d comparisons)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const [
      usersLast24h,
      promediosLast24h
    ] = await Promise.all([
      prisma.user.count({
        where: {
          deletedAt: null,
          createdAt: { gte: oneDayAgo }
        }
      }),
      prisma.promedio.count({
        where: {
          createdAt: { gte: oneDayAgo }
        }
      })
    ]);

    // Calculate peak registration day
    const peakDay = userTrend.reduce((max, day) => 
      day.count > max.count ? day : max, { count: 0 });

    // Average daily registrations for the period
    const avgDailyRegistrations = (newUsersCurrentPeriod / Math.max(1, userTrend.length)).toFixed(1);

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
        
        // Engagement
        usersWithPromedios,
        usersWithSemesters,
        usersWithCarreras,
        engagementRate: totalUsers > 0 ? ((usersWithPromedios / totalUsers) * 100).toFixed(1) : 0,
        
        // Averages
        averagePromediosPerUser: totalUsers > 0 ? (totalPromedios / totalUsers).toFixed(2) : 0,
        averageSemestersPerUser: totalUsers > 0 ? (totalSemesters / totalUsers).toFixed(2) : 0,
        averagePromediosPerActiveUser: usersWithPromedios > 0 ? (totalPromedios / usersWithPromedios).toFixed(2) : 0,
        
        // Current period
        currentPeriod: {
          label: period,
          newUsers: newUsersCurrentPeriod,
          newPromedios: newPromediosCurrentPeriod,
          newSemesters: newSemestersCurrentPeriod,
          avgDailyRegistrations
        },
        
        // Growth comparison
        growth: {
          users: calculateGrowth(newUsersCurrentPeriod, newUsersPrevPeriod),
          promedios: calculateGrowth(newPromediosCurrentPeriod, newPromediosPrevPeriod),
          semesters: calculateGrowth(newSemestersCurrentPeriod, newSemestersPrevPeriod)
        },
        
        // Quick stats
        last24h: {
          users: usersLast24h,
          promedios: promediosLast24h
        },
        
        // Role distribution
        roleDistribution,
        
        // Trends
        userTrend,
        promedioTrend,
        
        // Distributions
        dayOfWeekDistribution: {
          labels: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          data: dayOfWeekDistribution
        },
        hourDistribution: {
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          data: hourDistribution
        },
        
        // Top users
        topUsers: topUsersByPromedios.map(u => ({
          id: u.id,
          username: u.username,
          email: u.email,
          promedios: u._count.promedios,
          semesters: u._count.semesters,
          carreras: u._count.carreras
        })),
        
        // Peak activity
        peakDay: peakDay.label || 'N/A',
        peakDayCount: peakDay.count
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
