'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faGraduationCap,
  faBook,
  faCheckCircle,
  faTimesCircle,
  faTrophy,
  faExclamationTriangle,
  faSpinner,
  faArrowUp,
  faArrowDown,
  faMinus,
  faBriefcase,
  faFire,
  faStar,
  faAward,
  faBolt,
  faChartBar,
  faCalculator,
  faLightbulb,
  faRocket,
  faBullseye,
  faClipboardList,
  faPercent,
  faCalendarAlt,
  faExternalLinkAlt,
  faMedal,
  faChartPie,
  faCrown,
  faGem,
  faHeart,
  faShieldAlt,
  faMountain,
  faUserGraduate,
  faDragon,
  faHatWizard,
  faCoffee,
  faBrain,
  faHandPeace,
  faThumbsUp,
  faBalanceScale,
  faFlask,
  faDice,
  faSkull,
  faInfinity,
  faRing,
  faFeather,
  faDumbbell,
  faRunning,
  faHorse,
  faSnowflake,
  faSun,
  faMoon,
  faCloud,
  faUmbrella,
  faPaw,
  faCat,
  faDog,
  faKiwiBird,
  faFrog,
  faSpider,
  faFish,
  faCrow,
  faDove,
  faOtter,
  faHippo,
  faEye,
  faGhost,
  faGamepad,
  faMusic,
  faGuitar,
  faPalette,
  faPencilAlt,
  faBookOpen,
  faAtom,
  faDna,
  faMicroscope,
  faSatellite,
  faUserAstronaut,
  faCode,
  faLaptopCode,
  faTerminal,
  faServer,
  faCoins,
  faPiggyBank,
  faChessKnight,
  faChessQueen,
  faChessKing,
  faPuzzlePiece,
  faCube,
  faCubes,
  faCompass,
  faMap,
  faFlag,
  faBinoculars
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

// Pure helper functions for calculating stats
const calcularPromedioCurso = (notas, examenFinal) => {
  const notasValidas = notas.filter(
    nota => nota.valor !== '' && nota.ponderacion !== '' &&
      !Number.isNaN(Number.parseFloat(nota.valor)) && !Number.isNaN(Number.parseFloat(nota.ponderacion))
  );

  if (notasValidas.length === 0) {
    if (examenFinal && examenFinal.valor !== '' && examenFinal.ponderacion !== '' &&
      !Number.isNaN(Number.parseFloat(examenFinal.valor)) && !Number.isNaN(Number.parseFloat(examenFinal.ponderacion))) {
      const valorExamen = Number.parseFloat(examenFinal.valor);
      const ponderacionExamen = Number.parseFloat(examenFinal.ponderacion);
      return valorExamen * (ponderacionExamen / 100);
    }
    return null;
  }

  let sumaProductos = 0;
  for (const nota of notasValidas) {
    const valor = Number.parseFloat(nota.valor);
    const ponderacion = Number.parseFloat(nota.ponderacion);
    sumaProductos += valor * (ponderacion / 100);
  }

  if (examenFinal && examenFinal.valor !== '' && examenFinal.ponderacion !== '' &&
    !Number.isNaN(Number.parseFloat(examenFinal.valor)) && !Number.isNaN(Number.parseFloat(examenFinal.ponderacion))) {
    const valorExamen = Number.parseFloat(examenFinal.valor);
    const ponderacionExamen = Number.parseFloat(examenFinal.ponderacion);
    const ponderacionNotasRegulares = 100 - ponderacionExamen;

    return (sumaProductos * (ponderacionNotasRegulares / 100)) +
      (valorExamen * (ponderacionExamen / 100));
  }

  return sumaProductos;
};

const calcularPonderacionTotal = (notas) => {
  const notasValidas = notas.filter(
    nota => nota.ponderacion !== '' && !Number.isNaN(Number.parseFloat(nota.ponderacion))
  );
  return notasValidas.reduce((sum, nota) => sum + Number.parseFloat(nota.ponderacion), 0);
};

const getCursoStatus = (nota, ponderacion) => {
  if (nota === null) return 'sinNotas';
  if (ponderacion < 100) return 'enProgreso';
  return nota >= 4 ? 'aprobado' : 'reprobado';
};

const getGradeCategory = (nota) => {
  if (nota >= 6.0) return 'excelente';
  if (nota >= 5.0) return 'muyBueno';
  if (nota >= 4.0) return 'aprobado';
  return 'reprobado';
};

const getGradeCategoryLabel = (category) => {
  const labels = {
    excelente: 'Excelente (6.0-7.0)',
    muyBueno: 'Muy Bueno (5.0-5.9)',
    aprobado: 'Aprobado (4.0-4.9)',
    reprobado: 'Reprobado (1.0-3.9)'
  };
  return labels[category] || category;
};

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [carreras, setCarreras] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [timelineOrder, setTimelineOrder] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const calculateAllStats = useCallback((carrerasData, allPromedios) => {
    // Overall stats
    let totalCursos = 0;
    let cursosAprobados = 0;
    let cursosReprobados = 0;
    let cursosEnProgreso = 0;
    let cursosSinNotas = 0;
    let sumPromedios = 0;
    let countPromediosValidos = 0;
    let mejorNota = null;
    let peorNota = null;
    let mejorCurso = null;
    let peorCurso = null;
    let totalEvaluaciones = 0;
    let evaluacionesPasadas = 0;

    // Grade distribution
    const gradeDistribution = {
      excelente: 0,
      muyBueno: 0,
      aprobado: 0,
      reprobado: 0
    };

    // Courses needing attention (below 4.0 and in progress)
    const coursesNeedingAttention = [];
    const bestCourses = [];
    
    // All courses with grades for detailed analysis
    const coursesWithGrades = [];

    for (const promedio of allPromedios) {
      totalCursos++;
      const nota = calcularPromedioCurso(promedio.notas || [], promedio.examenFinal);
      const ponderacion = calcularPonderacionTotal(promedio.notas || []);
      const status = getCursoStatus(nota, ponderacion);

      // Count evaluations
      const notasValidas = (promedio.notas || []).filter(n => n.valor !== '' && n.ponderacion !== '');
      totalEvaluaciones += notasValidas.length;
      evaluacionesPasadas += notasValidas.filter(n => Number.parseFloat(n.valor) >= 4.0).length;

      if (status === 'sinNotas') {
        cursosSinNotas++;
        continue;
      } else if (status === 'enProgreso') {
        cursosEnProgreso++;
      } else if (status === 'aprobado') {
        cursosAprobados++;
      } else {
        cursosReprobados++;
      }

      if (nota !== null) {
        sumPromedios += nota;
        countPromediosValidos++;

        // Track grade distribution for completed or in-progress courses
        const category = getGradeCategory(nota);
        gradeDistribution[category]++;

        coursesWithGrades.push({
          id: promedio.id,
          nombre: promedio.nombre,
          nota,
          ponderacion,
          status,
          category,
          semesterId: promedio.semesterId
        });

        // Best and worst
        if (mejorNota === null || nota > mejorNota) {
          mejorNota = nota;
          mejorCurso = promedio.nombre;
        }
        if (peorNota === null || nota < peorNota) {
          peorNota = nota;
          peorCurso = promedio.nombre;
        }

        // Courses needing attention
        if (nota < 4.0 && status === 'enProgreso') {
          coursesNeedingAttention.push({
            id: promedio.id,
            nombre: promedio.nombre,
            nota,
            ponderacion
          });
        }

        // Best courses
        if (nota >= 5.5) {
          bestCourses.push({
            id: promedio.id,
            nombre: promedio.nombre,
            nota,
            ponderacion
          });
        }
      }
    }

    // Sort courses
    coursesNeedingAttention.sort((a, b) => a.nota - b.nota);
    bestCourses.sort((a, b) => b.nota - a.nota);

    // Calculate overall GPA early (needed for achievements)
    const promedioGeneral = countPromediosValidos > 0 ? sumPromedios / countPromediosValidos : null;

    // Calculate per-carrera stats
    const carreraStats = carrerasData.map(carrera => {
      let carreraCursos = 0;
      let carreraAprobados = 0;
      let carreraReprobados = 0;
      let carreraSum = 0;
      let carreraCount = 0;

      for (const semester of carrera.semesters || []) {
        for (const promedio of semester.promedios || []) {
          carreraCursos++;
          const nota = calcularPromedioCurso(promedio.notas || [], promedio.examenFinal);
          const ponderacion = calcularPonderacionTotal(promedio.notas || []);
          const status = getCursoStatus(nota, ponderacion);

          if (nota !== null) {
            carreraSum += nota;
            carreraCount++;
          }
          if (status === 'aprobado') carreraAprobados++;
          else if (status === 'reprobado') carreraReprobados++;
        }
      }

      return {
        id: carrera.id,
        nombre: carrera.nombre,
        totalCursos: carreraCursos,
        aprobados: carreraAprobados,
        reprobados: carreraReprobados,
        promedio: carreraCount > 0 ? carreraSum / carreraCount : null,
        totalSemesters: carrera.semesters?.length || 0
      };
    });

    // Calculate semester timeline with GPA trend
    const semesterTimeline = [];
    const allSemesters = [];
    
    for (const carrera of carrerasData) {
      for (const semester of carrera.semesters || []) {
        allSemesters.push({
          ...semester,
          carreraNombre: carrera.nombre
        });
      }
    }

    // Note: semesters are already in order from the API (carreras by orden, semesters within each carrera by orden)
    // No global sort needed - orden is per-carrera, not global

    for (const semester of allSemesters) {
      let semSum = 0;
      let semCount = 0;
      let semAprobados = 0;
      let semReprobados = 0;

      for (const promedio of semester.promedios || []) {
        const nota = calcularPromedioCurso(promedio.notas || [], promedio.examenFinal);
        const ponderacion = calcularPonderacionTotal(promedio.notas || []);
        const status = getCursoStatus(nota, ponderacion);

        if (nota !== null) {
          semSum += nota;
          semCount++;
        }
        if (status === 'aprobado') semAprobados++;
        else if (status === 'reprobado') semReprobados++;
      }

      semesterTimeline.push({
        id: semester.id,
        nombre: semester.nombre,
        carrera: semester.carreraNombre,
        promedio: semCount > 0 ? semSum / semCount : null,
        totalCursos: semester.promedios?.length || 0,
        aprobados: semAprobados,
        reprobados: semReprobados
      });
    }

    // Calculate trend
    let tendencia = null;
    if (semesterTimeline.length >= 2) {
      const validSemesters = semesterTimeline.filter(s => s.promedio !== null);
      if (validSemesters.length >= 2) {
        const ultimo = validSemesters[validSemesters.length - 1];
        const penultimo = validSemesters[validSemesters.length - 2];
        tendencia = ultimo.promedio - penultimo.promedio;
      }
    }

    // Calculate approval rate
    const cursosFinalizados = cursosAprobados + cursosReprobados;
    const tasaAprobacion = cursosFinalizados > 0 ? (cursosAprobados / cursosFinalizados) * 100 : null;

    // Calculate achievements - Fun and extensive!
    // COMMENTED OUT FOR NOW
    /*
    const achievements = [];
    
    // === MILESTONE ACHIEVEMENTS (Course count) ===
    if (countPromediosValidos >= 1) achievements.push({ icon: faRocket, label: 'Primeros pasos', desc: 'Primer curso registrado' });
    if (countPromediosValidos >= 5) achievements.push({ icon: faFeather, label: 'Calentando motores', desc: '5 cursos registrados' });
    if (countPromediosValidos >= 10) achievements.push({ icon: faFire, label: 'En racha', desc: '10+ cursos registrados' });
    if (countPromediosValidos >= 15) achievements.push({ icon: faDumbbell, label: 'Resistencia', desc: '15 cursos completados' });
    if (countPromediosValidos >= 20) achievements.push({ icon: faRunning, label: 'Maratonista', desc: '20 cursos completados' });
    if (countPromediosValidos >= 25) achievements.push({ icon: faStar, label: 'Dedicado', desc: '25+ cursos registrados' });
    if (countPromediosValidos >= 30) achievements.push({ icon: faMountain, label: 'Escalador', desc: '30 cursos superados' });
    if (countPromediosValidos >= 40) achievements.push({ icon: faHorse, label: 'Caballo de batalla', desc: '40 cursos registrados' });
    if (countPromediosValidos >= 50) achievements.push({ icon: faCrown, label: 'Veterano', desc: '50+ cursos' });
    if (countPromediosValidos >= 75) achievements.push({ icon: faDragon, label: 'Leyenda', desc: '75+ cursos' });
    if (countPromediosValidos >= 100) achievements.push({ icon: faInfinity, label: 'Inmortal', desc: '100+ cursos' });

    // === GRADE EXCELLENCE ACHIEVEMENTS ===
    if (mejorNota >= 6.0) achievements.push({ icon: faThumbsUp, label: 'Buen trabajo', desc: 'Nota 6.0 o superior' });
    if (mejorNota >= 6.5) achievements.push({ icon: faTrophy, label: 'Sobresaliente', desc: 'Nota 6.5 o superior' });
    if (mejorNota >= 6.8) achievements.push({ icon: faGem, label: 'Diamante', desc: 'Nota 6.8 o superior' });
    if (mejorNota >= 7.0) achievements.push({ icon: faCrown, label: 'Perfección', desc: '¡Nota 7.0!' });
    
    // === APPROVAL RATE ACHIEVEMENTS ===
    if (tasaAprobacion >= 60) achievements.push({ icon: faShieldAlt, label: 'Sobreviviente', desc: '60%+ tasa aprobación' });
    if (tasaAprobacion >= 75) achievements.push({ icon: faBalanceScale, label: 'Consistente', desc: '75%+ tasa aprobación' });
    if (tasaAprobacion >= 85) achievements.push({ icon: faChessKnight, label: 'Estratega', desc: '85%+ tasa aprobación' });
    if (tasaAprobacion >= 90) achievements.push({ icon: faMedal, label: 'Excelencia', desc: '90%+ tasa aprobación' });
    if (tasaAprobacion >= 95) achievements.push({ icon: faChessQueen, label: 'Elite', desc: '95%+ tasa aprobación' });
    if (tasaAprobacion === 100 && cursosAprobados >= 5) achievements.push({ icon: faChessKing, label: 'Invicto', desc: '100% aprobación (5+ cursos)' });

    // === GPA ACHIEVEMENTS ===
    if (promedioGeneral >= 4.0) achievements.push({ icon: faHandPeace, label: 'A salvo', desc: 'Promedio aprobatorio' });
    if (promedioGeneral >= 4.5) achievements.push({ icon: faCloud, label: 'Navegando', desc: 'Promedio 4.5+' });
    if (promedioGeneral >= 5.0) achievements.push({ icon: faSun, label: 'Brillante', desc: 'Promedio 5.0+' });
    if (promedioGeneral >= 5.5) achievements.push({ icon: faBolt, label: 'Eléctrico', desc: 'Promedio 5.5+' });
    if (promedioGeneral >= 6.0) achievements.push({ icon: faUserGraduate, label: 'Académico', desc: 'Promedio 6.0+' });
    if (promedioGeneral >= 6.5) achievements.push({ icon: faHatWizard, label: 'Mago', desc: 'Promedio 6.5+' });

    // === SEMESTER ACHIEVEMENTS ===
    const numSemesters = semesterTimeline.length;
    if (numSemesters >= 1) achievements.push({ icon: faFlag, label: 'Iniciado', desc: 'Primer semestre' });
    if (numSemesters >= 2) achievements.push({ icon: faCompass, label: 'Orientado', desc: '2 semestres' });
    if (numSemesters >= 4) achievements.push({ icon: faMap, label: 'Explorador', desc: '4 semestres' });
    if (numSemesters >= 6) achievements.push({ icon: faBinoculars, label: 'Visionario', desc: '6 semestres' });
    if (numSemesters >= 8) achievements.push({ icon: faSatellite, label: 'En órbita', desc: '8 semestres' });
    if (numSemesters >= 10) achievements.push({ icon: faUserAstronaut, label: 'Astronauta', desc: '10+ semestres' });

    // === CARRERA ACHIEVEMENTS ===
    if (carrerasData.length >= 1) achievements.push({ icon: faBook, label: 'Enfocado', desc: 'Carrera definida' });
    if (carrerasData.length >= 2) achievements.push({ icon: faBriefcase, label: 'Multidisciplinario', desc: '2+ carreras' });
    if (carrerasData.length >= 3) achievements.push({ icon: faPuzzlePiece, label: 'Renacentista', desc: '3+ carreras' });

    // === SPECIAL GRADE PATTERN ACHIEVEMENTS ===
    const sietes = coursesWithGrades.filter(c => c.nota >= 7.0).length;
    const seises = coursesWithGrades.filter(c => c.nota >= 6.0 && c.nota < 7.0).length;
    const rojos = coursesWithGrades.filter(c => c.nota < 4.0).length;
    
    if (sietes >= 1) achievements.push({ icon: faGem, label: 'Joya rara', desc: 'Un 7.0' });
    if (sietes >= 3) achievements.push({ icon: faCubes, label: 'Coleccionista', desc: '3+ sietes' });
    if (sietes >= 5) achievements.push({ icon: faRing, label: 'Tesoro', desc: '5+ sietes' });
    if (seises >= 5) achievements.push({ icon: faStar, label: 'Estrella', desc: '5+ notas sobre 6.0' });
    if (seises >= 10) achievements.push({ icon: faMoon, label: 'Constelación', desc: '10+ notas sobre 6.0' });
    
    // === COMEBACK/RESILIENCE ACHIEVEMENTS ===
    if (rojos >= 1 && tasaAprobacion >= 70) achievements.push({ icon: faFire, label: 'Fénix', desc: 'Superaste un rojo' });
    if (cursosReprobados >= 1 && cursosAprobados >= 10) achievements.push({ icon: faDove, label: 'Resiliencia', desc: 'Te levantaste después de caer' });
    
    // === EVALUATION COUNT ACHIEVEMENTS ===
    if (totalEvaluaciones >= 10) achievements.push({ icon: faClipboardList, label: 'Evaluado', desc: '10+ evaluaciones' });
    if (totalEvaluaciones >= 25) achievements.push({ icon: faFlask, label: 'Experimentado', desc: '25+ evaluaciones' });
    if (totalEvaluaciones >= 50) achievements.push({ icon: faMicroscope, label: 'Científico', desc: '50+ evaluaciones' });
    if (totalEvaluaciones >= 100) achievements.push({ icon: faAtom, label: 'Nuclear', desc: '100+ evaluaciones' });
    if (totalEvaluaciones >= 200) achievements.push({ icon: faDna, label: 'Genético', desc: '200+ evaluaciones' });

    // === FUN/QUIRKY ACHIEVEMENTS ===
    if (totalCursos === 7) achievements.push({ icon: faDice, label: 'Lucky 7', desc: 'Exactamente 7 cursos' });
    if (totalCursos === 13) achievements.push({ icon: faCat, label: 'Gato negro', desc: '13 cursos (¿suerte?)' });
    if (totalCursos === 42) achievements.push({ icon: faLightbulb, label: 'Respuesta', desc: '42 cursos - La respuesta' });
    if (totalCursos === 69) achievements.push({ icon: faHandPeace, label: 'Nice', desc: '69 cursos 😎' });
    if (totalCursos === 100) achievements.push({ icon: faGamepad, label: 'Centurión', desc: '100 cursos exactos' });
    
    // Perfect score streak (all courses with 6+)
    const allAbove6 = coursesWithGrades.length > 0 && coursesWithGrades.every(c => c.nota >= 6.0);
    if (allAbove6 && coursesWithGrades.length >= 3) achievements.push({ icon: faFire, label: 'En llamas', desc: 'Todos sobre 6.0' });
    
    // All courses approved
    if (cursosReprobados === 0 && cursosAprobados >= 3) achievements.push({ icon: faShieldAlt, label: 'Intocable', desc: 'Sin reprobados (3+ cursos)' });
    
    // === VARIETY ACHIEVEMENTS ===
    const uniqueSemesters = new Set(coursesWithGrades.map(c => c.semesterId)).size;
    if (uniqueSemesters >= 4) achievements.push({ icon: faPalette, label: 'Diverso', desc: 'Cursos en 4+ semestres' });
    
    // === EFFORT ACHIEVEMENTS ===
    if (cursosEnProgreso >= 3) achievements.push({ icon: faCoffee, label: 'Trabajador', desc: '3+ cursos en progreso' });
    if (cursosEnProgreso >= 5) achievements.push({ icon: faBrain, label: 'Multitarea', desc: '5+ cursos en progreso' });
    if (cursosEnProgreso >= 7) achievements.push({ icon: faTerminal, label: 'Hacker', desc: '7+ cursos en progreso' });

    // === SEASONAL/THEMED ACHIEVEMENTS ===
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 2 && currentMonth <= 4) achievements.push({ icon: faUmbrella, label: 'Otoño productivo', desc: 'Activo en otoño' });
    
    // === ANIMAL SPIRIT ACHIEVEMENTS (based on GPA ranges) ===
    if (promedioGeneral >= 6.5) achievements.push({ icon: faKiwiBird, label: 'Espíritu Kiwi', desc: 'Único y excelente' });
    else if (promedioGeneral >= 5.5) achievements.push({ icon: faOtter, label: 'Espíritu Nutria', desc: 'Inteligente y adaptable' });
    else if (promedioGeneral >= 4.5) achievements.push({ icon: faFrog, label: 'Espíritu Rana', desc: 'Saltando obstáculos' });
    else if (promedioGeneral >= 4.0) achievements.push({ icon: faFish, label: 'Espíritu Pez', desc: 'Nadando a contracorriente' });

    // === SECRET ACHIEVEMENTS ===
    if (mejorNota === 7.0 && peorNota >= 6.0) achievements.push({ icon: faEye, label: 'Ojo de águila', desc: 'Todas tus notas sobre 6.0' });
    if (cursosAprobados === 42) achievements.push({ icon: faGhost, label: 'Misterioso', desc: '42 aprobados - Easter egg' });

    // === TECH/NERD ACHIEVEMENTS ===
    if (totalEvaluaciones === 64) achievements.push({ icon: faCode, label: 'Bit perfecto', desc: '64 evaluaciones' });
    if (totalEvaluaciones === 128) achievements.push({ icon: faLaptopCode, label: 'Byte completo', desc: '128 evaluaciones' });
    if (totalCursos === 256) achievements.push({ icon: faServer, label: '8-bit Legend', desc: '256 cursos' });

    // === ECONOMICS ACHIEVEMENTS ===
    if (cursosAprobados >= 20) achievements.push({ icon: faCoins, label: 'Inversor', desc: '20+ cursos aprobados' });
    if (cursosAprobados >= 50) achievements.push({ icon: faPiggyBank, label: 'Ahorrista', desc: '50+ cursos aprobados' });

    // === MUSIC/ART ACHIEVEMENTS ===
    if (promedioGeneral >= 5.0 && tasaAprobacion >= 80) achievements.push({ icon: faMusic, label: 'Armonía', desc: 'Balance perfecto' });
    if (sietes >= 1 && seises >= 5) achievements.push({ icon: faGuitar, label: 'Rockstar', desc: 'Un 7 y varios 6s' });

    // === NATURE ACHIEVEMENTS ===
    if (numSemesters >= 4 && promedioGeneral >= 5.0) achievements.push({ icon: faPaw, label: 'Instinto', desc: '4+ semestres con buen promedio' });

    // === CONSISTENCY ACHIEVEMENTS ===
    const semestersWithGoodGPA = semesterTimeline.filter(s => s.promedio >= 5.0).length;
    if (semestersWithGoodGPA >= 3) achievements.push({ icon: faCube, label: 'Sólido', desc: '3+ semestres con 5.0+' });
    if (semestersWithGoodGPA >= 5) achievements.push({ icon: faCubes, label: 'Irrompible', desc: '5+ semestres con 5.0+' });
    */
    const achievements = []; // Empty array for now

    setStats({
      totalCursos,
      cursosAprobados,
      cursosReprobados,
      cursosEnProgreso,
      cursosSinNotas,
      promedioGeneral,
      mejorNota,
      peorNota,
      mejorCurso,
      peorCurso,
      gradeDistribution,
      carreraStats,
      semesterTimeline,
      tendencia,
      tasaAprobacion,
      totalEvaluaciones,
      evaluacionesPasadas,
      coursesNeedingAttention: coursesNeedingAttention.slice(0, 5),
      bestCourses: bestCourses.slice(0, 5),
      achievements
    });

    setAllCourses(coursesWithGrades);
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load carreras with full nested data
      const carrerasResponse = await fetch('/api/carreras');
      const carrerasData = carrerasResponse.ok ? await carrerasResponse.json() : { carreras: [] };
      
      // Load all promedios
      const promediosResponse = await fetch('/api/promedios');
      const promediosData = promediosResponse.ok ? await promediosResponse.json() : { promedios: [] };
      
      setCarreras(carrerasData.carreras || []);
      calculateAllStats(carrerasData.carreras || [], promediosData.promedios || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [calculateAllStats]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadDashboardData();
    }
  }, [status, loadDashboardData]);

  const getTendenciaIcon = () => {
    if (stats?.tendencia == null) return null;
    if (stats.tendencia > 0.1) return <FontAwesomeIcon icon={faArrowUp} className={styles.tendenciaUp} />;
    if (stats.tendencia < -0.1) return <FontAwesomeIcon icon={faArrowDown} className={styles.tendenciaDown} />;
    return <FontAwesomeIcon icon={faMinus} className={styles.tendenciaNeutral} />;
  };

  const getTendenciaText = () => {
    if (stats?.tendencia == null) return 'Sin datos';
    if (stats.tendencia > 0.1) return `+${stats.tendencia.toFixed(2)}`;
    if (stats.tendencia < -0.1) return stats.tendencia.toFixed(2);
    return 'Estable';
  };

  const getPromedioClass = (promedio) => {
    if (promedio == null) return '';
    if (promedio >= 6.0) return styles.promedioExcelente;
    if (promedio >= 5.0) return styles.promedioMuyBueno;
    if (promedio >= 4.0) return styles.promedioAprobado;
    return styles.promedioReprobado;
  };

  const getGradeBarWidth = (count) => {
    if (!stats) return 0;
    const total = stats.gradeDistribution.excelente + stats.gradeDistribution.muyBueno + 
                  stats.gradeDistribution.aprobado + stats.gradeDistribution.reprobado;
    if (total === 0) return 0;
    return (count / total) * 100;
  };

  if (status === 'loading' || loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingContent}>
              <div className={styles.loadingIconWrapper}>
                <FontAwesomeIcon icon={faChartLine} className={styles.loadingMainIcon} />
                <div className={styles.loadingSpinnerRing}></div>
              </div>
              <h2 className={styles.loadingTitle}>Cargando dashboard</h2>
              <p className={styles.loadingSubtitle}>Analizando tu rendimiento académico...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (stats?.totalCursos === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerIcon}>
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <h1 className={styles.title}>Dashboard Académico</h1>
            <p className={styles.subtitle}>
              Resumen de tu rendimiento académico
            </p>
          </header>

          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <FontAwesomeIcon icon={faBook} />
            </div>
            <h2 className={styles.emptyStateTitle}>¡Comienza tu seguimiento académico!</h2>
            <p className={styles.emptyStateText}>
              Aún no tienes cursos registrados. Agrega tus cursos en la sección de Promedio para ver estadísticas detalladas de tu rendimiento.
            </p>
            <Link href="/promedio" className={styles.emptyStateButton}>
              <FontAwesomeIcon icon={faCalculator} />
              <span>Ir a Promedio de Notas</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <h1 className={styles.title}>Dashboard Académico</h1>
          <p className={styles.subtitle}>
            Análisis completo de tu rendimiento
          </p>
        </header>

        {/* Hero GPA Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroGPA}>
            <div className={styles.gpaCircle}>
              <div className={styles.gpaValue}>
                {stats.promedioGeneral !== null ? stats.promedioGeneral.toFixed(2) : '-'}
              </div>
              <div className={styles.gpaLabel}>Promedio General</div>
            </div>
            <div className={styles.gpaTrend}>
              {getTendenciaIcon()}
              <span className={styles.trendValue}>{getTendenciaText()}</span>
              <span className={styles.trendLabel}>vs semestre anterior</span>
            </div>
          </div>
          
          <div className={styles.heroStats}>
            <div className={styles.heroStatItem}>
              <FontAwesomeIcon icon={faBook} className={styles.heroStatIcon} />
              <div className={styles.heroStatContent}>
                <span className={styles.heroStatValue}>{stats.totalCursos}</span>
                <span className={styles.heroStatLabel}>Total Cursos</span>
              </div>
            </div>
            <div className={styles.heroStatItem}>
              <FontAwesomeIcon icon={faCheckCircle} className={`${styles.heroStatIcon} ${styles.iconAprobado}`} />
              <div className={styles.heroStatContent}>
                <span className={styles.heroStatValue}>{stats.cursosAprobados}</span>
                <span className={styles.heroStatLabel}>Aprobados</span>
              </div>
            </div>
            <div className={styles.heroStatItem}>
              <FontAwesomeIcon icon={faTimesCircle} className={`${styles.heroStatIcon} ${styles.iconReprobado}`} />
              <div className={styles.heroStatContent}>
                <span className={styles.heroStatValue}>{stats.cursosReprobados}</span>
                <span className={styles.heroStatLabel}>Reprobados</span>
              </div>
            </div>
            <div className={styles.heroStatItem}>
              <FontAwesomeIcon icon={faBolt} className={`${styles.heroStatIcon} ${styles.iconProgreso}`} />
              <div className={styles.heroStatContent}>
                <span className={styles.heroStatValue}>{stats.cursosEnProgreso}</span>
                <span className={styles.heroStatLabel}>En Progreso</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Grade Distribution */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faChartBar} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Distribución de Notas</h2>
              </div>
              <div className={styles.gradeDistribution}>
                <div className={styles.gradeBar}>
                  <div className={styles.gradeBarLabel}>
                    <span className={styles.gradeCategory}>Excelente</span>
                    <span className={styles.gradeRange}>6.0 - 7.0</span>
                  </div>
                  <div className={styles.gradeBarTrack}>
                    <div 
                      className={`${styles.gradeBarFill} ${styles.fillExcelente}`}
                      style={{ width: `${getGradeBarWidth(stats.gradeDistribution.excelente)}%` }}
                    />
                  </div>
                  <span className={styles.gradeCount}>{stats.gradeDistribution.excelente}</span>
                </div>
                <div className={styles.gradeBar}>
                  <div className={styles.gradeBarLabel}>
                    <span className={styles.gradeCategory}>Muy Bueno</span>
                    <span className={styles.gradeRange}>5.0 - 5.9</span>
                  </div>
                  <div className={styles.gradeBarTrack}>
                    <div 
                      className={`${styles.gradeBarFill} ${styles.fillMuyBueno}`}
                      style={{ width: `${getGradeBarWidth(stats.gradeDistribution.muyBueno)}%` }}
                    />
                  </div>
                  <span className={styles.gradeCount}>{stats.gradeDistribution.muyBueno}</span>
                </div>
                <div className={styles.gradeBar}>
                  <div className={styles.gradeBarLabel}>
                    <span className={styles.gradeCategory}>Aprobado</span>
                    <span className={styles.gradeRange}>4.0 - 4.9</span>
                  </div>
                  <div className={styles.gradeBarTrack}>
                    <div 
                      className={`${styles.gradeBarFill} ${styles.fillAprobado}`}
                      style={{ width: `${getGradeBarWidth(stats.gradeDistribution.aprobado)}%` }}
                    />
                  </div>
                  <span className={styles.gradeCount}>{stats.gradeDistribution.aprobado}</span>
                </div>
                <div className={styles.gradeBar}>
                  <div className={styles.gradeBarLabel}>
                    <span className={styles.gradeCategory}>Reprobado</span>
                    <span className={styles.gradeRange}>1.0 - 3.9</span>
                  </div>
                  <div className={styles.gradeBarTrack}>
                    <div 
                      className={`${styles.gradeBarFill} ${styles.fillReprobado}`}
                      style={{ width: `${getGradeBarWidth(stats.gradeDistribution.reprobado)}%` }}
                    />
                  </div>
                  <span className={styles.gradeCount}>{stats.gradeDistribution.reprobado}</span>
                </div>
              </div>
            </section>

            {/* Carreras Overview */}
            {stats.carreraStats.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <FontAwesomeIcon icon={faBriefcase} className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>Rendimiento por Carrera</h2>
                </div>
                <div className={styles.carrerasList}>
                  {stats.carreraStats.map(carrera => (
                    <div key={carrera.id} className={styles.carreraCard}>
                      <div className={styles.carreraHeader}>
                        <h3 className={styles.carreraNombre}>{carrera.nombre}</h3>
                        <span className={`${styles.carreraGPA} ${getPromedioClass(carrera.promedio)}`}>
                          {carrera.promedio !== null ? carrera.promedio.toFixed(2) : '-'}
                        </span>
                      </div>
                      <div className={styles.carreraStats}>
                        <div className={styles.carreraStat}>
                          <span className={styles.carreraStatValue}>{carrera.totalSemesters}</span>
                          <span className={styles.carreraStatLabel}>Semestres</span>
                        </div>
                        <div className={styles.carreraStat}>
                          <span className={styles.carreraStatValue}>{carrera.totalCursos}</span>
                          <span className={styles.carreraStatLabel}>Cursos</span>
                        </div>
                        <div className={styles.carreraStat}>
                          <span className={`${styles.carreraStatValue} ${styles.aprobadoColor}`}>{carrera.aprobados}</span>
                          <span className={styles.carreraStatLabel}>Aprobados</span>
                        </div>
                        <div className={styles.carreraStat}>
                          <span className={`${styles.carreraStatValue} ${styles.reprobadoColor}`}>{carrera.reprobados}</span>
                          <span className={styles.carreraStatLabel}>Reprobados</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Semester Timeline */}
            {stats.semesterTimeline.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <FontAwesomeIcon icon={faCalendarAlt} className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>Timeline de Semestres</h2>
                  <select
                    className={styles.timelineOrderSelect}
                    value={timelineOrder}
                    onChange={(e) => setTimelineOrder(e.target.value)}
                  >
                    <option value="asc">Ascendente</option>
                    <option value="desc">Descendente</option>
                  </select>
                </div>
                <div className={styles.timeline}>
                  {(timelineOrder === 'desc' ? [...stats.semesterTimeline].reverse() : stats.semesterTimeline).map((semester, index) => (
                    <div key={semester.id} className={styles.timelineItem}>
                      <div className={styles.timelineDot}>
                        <span className={styles.timelineIndex}>{index + 1}</span>
                      </div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineHeader}>
                          <h4 className={styles.timelineName}>{semester.nombre}</h4>
                          <span className={`${styles.timelineGPA} ${getPromedioClass(semester.promedio)}`}>
                            {semester.promedio !== null ? semester.promedio.toFixed(2) : '-'}
                          </span>
                        </div>
                        <span className={styles.timelineCarrera}>{semester.carrera}</span>
                        <div className={styles.timelineStats}>
                          <span>{semester.totalCursos} cursos</span>
                          <span className={styles.aprobadoColor}>{semester.aprobados} aprobados</span>
                          {semester.reprobados > 0 && (
                            <span className={styles.reprobadoColor}>{semester.reprobados} reprobados</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Quick Stats Cards */}
            <div className={styles.quickStatsGrid}>
              <div className={styles.quickStatCard}>
                <div className={styles.quickStatIconWrapper} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <FontAwesomeIcon icon={faPercent} />
                </div>
                <div className={styles.quickStatContent}>
                  <span className={styles.quickStatValue}>
                    {stats.tasaAprobacion !== null ? `${stats.tasaAprobacion.toFixed(0)}%` : '-'}
                  </span>
                  <span className={styles.quickStatLabel}>Tasa de Aprobación</span>
                </div>
              </div>
              <div className={styles.quickStatCard}>
                <div className={styles.quickStatIconWrapper} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                  <FontAwesomeIcon icon={faClipboardList} />
                </div>
                <div className={styles.quickStatContent}>
                  <span className={styles.quickStatValue}>{stats.totalEvaluaciones}</span>
                  <span className={styles.quickStatLabel}>Evaluaciones Totales</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            {/* COMMENTED OUT FOR NOW
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faStar} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Destacados</h2>
              </div>
              <div className={styles.highlightsList}>
                {stats.mejorCurso && (
                  <div className={styles.highlightCard}>
                    <FontAwesomeIcon icon={faTrophy} className={styles.highlightIconGold} />
                    <div className={styles.highlightContent}>
                      <span className={styles.highlightLabel}>Mejor Nota</span>
                      <span className={styles.highlightValue}>{stats.mejorNota?.toFixed(2)}</span>
                      <span className={styles.highlightCurso}>{stats.mejorCurso}</span>
                    </div>
                  </div>
                )}
                {stats.peorCurso && stats.peorNota !== stats.mejorNota && (
                  <div className={styles.highlightCard}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={styles.highlightIconWarning} />
                    <div className={styles.highlightContent}>
                      <span className={styles.highlightLabel}>Nota más Baja</span>
                      <span className={styles.highlightValue}>{stats.peorNota?.toFixed(2)}</span>
                      <span className={styles.highlightCurso}>{stats.peorCurso}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
            */}

            {/* Courses Needing Attention */}
            {stats.coursesNeedingAttention.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <FontAwesomeIcon icon={faExclamationTriangle} className={`${styles.sectionIcon} ${styles.iconWarning}`} />
                  <h2 className={styles.sectionTitle}>Requieren Atención</h2>
                </div>
                <div className={styles.attentionList}>
                  {stats.coursesNeedingAttention.map(course => (
                    <div key={course.id} className={styles.attentionItem}>
                      <div className={styles.attentionInfo}>
                        <span className={styles.attentionName}>{course.nombre}</span>
                        <span className={styles.attentionProgress}>{course.ponderacion.toFixed(0)}% evaluado</span>
                      </div>
                      <span className={styles.attentionGrade}>{course.nota.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Best Performing Courses */}
            {stats.bestCourses.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <FontAwesomeIcon icon={faFire} className={`${styles.sectionIcon} ${styles.iconFire}`} />
                  <h2 className={styles.sectionTitle}>Mejores Cursos</h2>
                </div>
                <div className={styles.bestList}>
                  {stats.bestCourses.map((course, index) => (
                    <div key={course.id} className={styles.bestItem}>
                      <div className={styles.bestRank}>
                        {index === 0 ? <FontAwesomeIcon icon={faMedal} className={styles.goldMedal} /> : `#${index + 1}`}
                      </div>
                      <div className={styles.bestInfo}>
                        <span className={styles.bestName}>{course.nombre}</span>
                      </div>
                      <span className={`${styles.bestGrade} ${getPromedioClass(course.nota)}`}>
                        {course.nota.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {/* COMMENTED OUT FOR NOW
            {stats.achievements.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <FontAwesomeIcon icon={faAward} className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>
                    Logros
                    <span className={styles.achievementsCount}>{stats.achievements.length}</span>
                  </h2>
                </div>
                <div className={styles.achievementsList}>
                  {stats.achievements.map((achievement, index) => (
                    <div key={index} className={styles.achievementBadge} title={achievement.desc}>
                      <FontAwesomeIcon icon={achievement.icon} className={styles.achievementIcon} />
                      <div className={styles.achievementContent}>
                        <span className={styles.achievementLabel}>{achievement.label}</span>
                        <span className={styles.achievementDesc}>{achievement.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            */}

            {/* Quick Actions */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FontAwesomeIcon icon={faRocket} className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
              </div>
              <div className={styles.quickActions}>
                <Link href="/promedio" className={styles.quickActionButton}>
                  <FontAwesomeIcon icon={faCalculator} />
                  <span>Gestionar Cursos</span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.quickActionArrow} />
                </Link>
                <Link href="/escala-de-notas" className={styles.quickActionButton}>
                  <FontAwesomeIcon icon={faChartPie} />
                  <span>Escala de Notas</span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.quickActionArrow} />
                </Link>
                <Link href="/puntaje-a-nota" className={styles.quickActionButton}>
                  <FontAwesomeIcon icon={faBullseye} />
                  <span>Puntaje a Nota</span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.quickActionArrow} />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
