const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

// Chilean first names
const firstNames = [
  'Alejandro', 'Sofía', 'Matías', 'Valentina', 'Sebastián', 'Catalina', 'Benjamín', 'Isidora',
  'Vicente', 'Martina', 'Nicolás', 'Florencia', 'Diego', 'Antonia', 'Felipe', 'Francisca',
  'Joaquín', 'Emilia', 'Tomás', 'Josefa', 'Maximiliano', 'Fernanda', 'José', 'Javiera',
  'Lucas', 'Amanda', 'Gabriel', 'Agustina', 'Daniel', 'Macarena', 'Cristóbal', 'Trinidad',
  'Ignacio', 'María José', 'Andrés', 'Constanza', 'Pablo', 'Bárbara', 'Martín', 'Camila',
  'Francisco', 'Daniela', 'Rodrigo', 'Carolina', 'Carlos', 'Paula', 'Luis', 'Andrea',
  'Eduardo', 'Marcela', 'Javier', 'Claudia', 'Miguel', 'Sandra', 'Antonio', 'Isabel',
  'Manuel', 'Patricia', 'Jorge', 'Mónica', 'Ricardo', 'Lorena', 'Rafael', 'Verónica',
  'Álvaro', 'Natalia', 'Fernando', 'Paola', 'Roberto', 'Soledad', 'Sergio', 'Teresa',
  'Cristian', 'Gloria', 'Mauricio', 'Silvia', 'Claudio', 'Rosa', 'Gonzalo', 'Carmen'
];

// Chilean last names
const lastNames = [
  'González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva',
  'Martínez', 'Sepúlveda', 'Morales', 'Rodríguez', 'López', 'Fuentes', 'Hernández', 'García',
  'Garrido', 'Bravo', 'Reyes', 'Núñez', 'Jara', 'Vera', 'Torres', 'Araya',
  'Figueroa', 'Espinoza', 'Flores', 'Valenzuela', 'Castillo', 'Tapia', 'Aravena', 'Sánchez',
  'Fernández', 'Carrasco', 'Cortés', 'Vega', 'León', 'Herrera', 'Vargas', 'Salazar',
  'Aguilera', 'Pizarro', 'Campos', 'Sandoval', 'Ramírez', 'Cárdenas', 'Guzmán', 'Escobar',
  'Villalobos', 'Olivares', 'Medina', 'Lagos', 'Henríquez', 'Orellana', 'Castro', 'Pacheco'
];

// University courses (Chilean curriculum)
const coursesByArea = {
  'Matemáticas': [
    'Cálculo I', 'Cálculo II', 'Cálculo III', 'Álgebra Lineal', 'Ecuaciones Diferenciales',
    'Estadística', 'Probabilidades', 'Matemáticas Discretas', 'Análisis Numérico', 'Optimización'
  ],
  'Ciencias': [
    'Física I', 'Física II', 'Física III', 'Química General', 'Química Orgánica',
    'Biología Celular', 'Bioquímica', 'Termodinámica', 'Mecánica de Fluidos', 'Electromagnetismo'
  ],
  'Computación': [
    'Introducción a la Programación', 'Estructuras de Datos', 'Algoritmos', 'Bases de Datos',
    'Sistemas Operativos', 'Redes de Computadores', 'Ingeniería de Software', 'Inteligencia Artificial',
    'Desarrollo Web', 'Programación Orientada a Objetos', 'Arquitectura de Computadores'
  ],
  'Humanidades': [
    'Comunicación Oral y Escrita', 'Ética Profesional', 'Historia de Chile', 'Filosofía',
    'Inglés I', 'Inglés II', 'Inglés III', 'Metodología de la Investigación', 'Psicología General'
  ],
  'Ingeniería': [
    'Introducción a la Ingeniería', 'Dibujo Técnico', 'Resistencia de Materiales', 'Electricidad',
    'Gestión de Proyectos', 'Control de Calidad', 'Automatización', 'Manufactura', 'Logística'
  ],
  'Economía': [
    'Economía I', 'Economía II', 'Contabilidad', 'Administración', 'Finanzas',
    'Marketing', 'Recursos Humanos', 'Derecho Laboral', 'Emprendimiento', 'Comercio Internacional'
  ],
  'Salud': [
    'Anatomía Humana', 'Fisiología', 'Farmacología', 'Patología', 'Microbiología',
    'Inmunología', 'Nutrición', 'Epidemiología', 'Bioestadística', 'Salud Pública'
  ]
};

// Semester names
const semesterNames = [
  'Primer Semestre 2023', 'Segundo Semestre 2023',
  'Primer Semestre 2024', 'Segundo Semestre 2024',
  'Primer Semestre 2025', 'Segundo Semestre 2025',
  'Verano 2024', 'Verano 2025'
];

// Utility functions
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomElements(arr, min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 1) {
  const num = Math.random() * (max - min) + min;
  return parseFloat(num.toFixed(decimals));
}

function generateUniqueUsername(firstName, lastName, usedUsernames) {
  // Remove accents and special characters
  const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '');
  
  let baseUsername = normalize(firstName) + '.' + normalize(lastName);
  let username = baseUsername;
  let counter = 1;
  
  while (usedUsernames.has(username)) {
    username = `${baseUsername}${counter}`;
    counter++;
  }
  
  usedUsernames.add(username);
  return username;
}

function generateGrades(numGrades) {
  const grades = [];
  let remainingWeight = 100;
  
  for (let i = 0; i < numGrades; i++) {
    const isLast = i === numGrades - 1;
    let weight;
    
    if (isLast) {
      weight = remainingWeight;
    } else {
      // Minimum weight of 5%, max of remaining - (remaining grades * 5)
      const minWeight = 5;
      const maxWeight = Math.min(40, remainingWeight - (numGrades - i - 1) * 5);
      weight = Math.round(getRandomNumber(minWeight, maxWeight) / 5) * 5; // Round to nearest 5
    }
    
    remainingWeight -= weight;
    
    // Generate grade value (Chilean scale 1.0 - 7.0)
    // Biased towards passing grades (4.0+)
    let gradeValue;
    const rand = Math.random();
    if (rand < 0.1) {
      // 10% chance of failing grade
      gradeValue = getRandomFloat(1.0, 3.9);
    } else if (rand < 0.3) {
      // 20% chance of low passing grade
      gradeValue = getRandomFloat(4.0, 4.9);
    } else if (rand < 0.7) {
      // 40% chance of average grade
      gradeValue = getRandomFloat(5.0, 5.9);
    } else {
      // 30% chance of high grade
      gradeValue = getRandomFloat(6.0, 7.0);
    }
    
    grades.push({
      id: `nota-${i + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      valor: gradeValue,
      ponderacion: weight
    });
  }
  
  return grades;
}

function generateExamFinal() {
  // 40% chance of having a final exam
  if (Math.random() > 0.4) return null;
  
  const weight = getRandomElement([20, 25, 30, 35, 40]);
  
  let examValue;
  const rand = Math.random();
  if (rand < 0.15) {
    examValue = getRandomFloat(1.0, 3.9);
  } else if (rand < 0.35) {
    examValue = getRandomFloat(4.0, 4.9);
  } else if (rand < 0.75) {
    examValue = getRandomFloat(5.0, 5.9);
  } else {
    examValue = getRandomFloat(6.0, 7.0);
  }
  
  return {
    valor: examValue,
    ponderacion: weight
  };
}

function getCoursesForSemester(semesterIndex, numCourses) {
  const allCourses = Object.values(coursesByArea).flat();
  const courses = [];
  const usedCourses = new Set();
  
  // Bias course selection based on semester (earlier = more basic courses)
  const areas = Object.keys(coursesByArea);
  
  for (let i = 0; i < numCourses; i++) {
    let course;
    let attempts = 0;
    
    do {
      const area = getRandomElement(areas);
      const areaCourses = coursesByArea[area];
      
      // Earlier semesters get earlier courses in the array (more basic)
      const maxIndex = Math.min(areaCourses.length, Math.floor(semesterIndex / 2) + 5);
      course = areaCourses[getRandomNumber(0, maxIndex - 1)];
      attempts++;
    } while (usedCourses.has(course) && attempts < 50);
    
    if (!usedCourses.has(course)) {
      usedCourses.add(course);
      courses.push(course);
    }
  }
  
  return courses;
}

async function main() {
  console.log('🌱 Starting comprehensive database seed...\n');
  
  const usedUsernames = new Set();
  const usedEmails = new Set();
  
  // Check existing users to avoid conflicts
  const existingUsers = await prisma.user.findMany({
    select: { email: true, username: true }
  });
  
  existingUsers.forEach(user => {
    usedEmails.add(user.email);
    usedUsernames.add(user.username);
  });
  
  console.log(`📊 Found ${existingUsers.length} existing users\n`);
  
  // Hash a common password for all seed users
  const commonPassword = await hash('TestPass123!', 12);
  
  const totalUsers = 200;
  const createdUsers = [];
  
  console.log(`👥 Creating ${totalUsers} users with courses and grades...\n`);
  
  for (let i = 0; i < totalUsers; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const secondLastName = getRandomElement(lastNames);
    
    const username = generateUniqueUsername(firstName, lastName, usedUsernames);
    
    // Generate unique email
    let email = `${username}@example.com`;
    let emailCounter = 1;
    while (usedEmails.has(email)) {
      email = `${username}${emailCounter}@example.com`;
      emailCounter++;
    }
    usedEmails.add(email);
    
    // Determine role distribution: 80% students, 15% teachers, 5% admins
    let role;
    const roleRand = Math.random();
    if (roleRand < 0.05) {
      role = 'ADMIN';
    } else if (roleRand < 0.20) {
      role = 'TEACHER';
    } else {
      role = 'STUDENT';
    }
    
    // Random verification status (70% verified)
    const emailVerified = Math.random() < 0.7 ? new Date(Date.now() - getRandomNumber(1, 365) * 24 * 60 * 60 * 1000) : null;
    
    // Random soft delete (5% deleted)
    const deletedAt = Math.random() < 0.05 ? new Date(Date.now() - getRandomNumber(1, 30) * 24 * 60 * 60 * 1000) : null;
    
    // Created at random date in the last 2 years
    const createdAt = new Date(Date.now() - getRandomNumber(1, 730) * 24 * 60 * 60 * 1000);
    
    try {
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: commonPassword,
          role,
          emailVerified,
          deletedAt,
          createdAt,
          updatedAt: new Date()
        }
      });
      
      createdUsers.push(user);
      
      // Only create academic data for students
      if (role === 'STUDENT' && !deletedAt) {
        // Create 0-6 semesters per user
        const numSemesters = getRandomNumber(0, 6);
        
        for (let semIdx = 0; semIdx < numSemesters; semIdx++) {
          const semester = await prisma.semester.create({
            data: {
              userId: user.id,
              nombre: semesterNames[semIdx % semesterNames.length],
              orden: semIdx,
              createdAt: new Date(createdAt.getTime() + semIdx * 180 * 24 * 60 * 60 * 1000)
            }
          });
          
          // Create 3-7 courses per semester
          const numCourses = getRandomNumber(3, 7);
          const courseNames = getCoursesForSemester(semIdx, numCourses);
          
          for (let courseIdx = 0; courseIdx < courseNames.length; courseIdx++) {
            const numGrades = getRandomNumber(3, 8);
            const notas = generateGrades(numGrades);
            const examenFinal = generateExamFinal();
            
            await prisma.promedio.create({
              data: {
                userId: user.id,
                semesterId: semester.id,
                nombre: courseNames[courseIdx],
                notas,
                examenFinal,
                orden: courseIdx
              }
            });
          }
        }
        
        // Some users also have courses without semester (unsorted)
        if (Math.random() < 0.3) {
          const numUnsortedCourses = getRandomNumber(1, 3);
          const unsortedCourseNames = getCoursesForSemester(0, numUnsortedCourses);
          
          for (let courseIdx = 0; courseIdx < unsortedCourseNames.length; courseIdx++) {
            const numGrades = getRandomNumber(3, 6);
            const notas = generateGrades(numGrades);
            
            await prisma.promedio.create({
              data: {
                userId: user.id,
                semesterId: null,
                nombre: unsortedCourseNames[courseIdx],
                notas,
                examenFinal: null,
                orden: courseIdx
              }
            });
          }
        }
      }
      
      // Progress indicator
      if ((i + 1) % 20 === 0 || i === totalUsers - 1) {
        console.log(`   Progress: ${i + 1}/${totalUsers} users created`);
      }
      
    } catch (error) {
      console.error(`   ⚠️ Error creating user ${i + 1}:`, error.message);
    }
  }
  
  // Create a specific admin user for testing
  const adminEmail = 'admin@notaminima.cl';
  if (!usedEmails.has(adminEmail)) {
    const adminPassword = await hash('Admin123!', 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        username: 'admin',
        password: adminPassword,
        role: 'ADMIN',
        emailVerified: new Date()
      }
    });
    console.log('\n   ✓ Created admin test user: admin@notaminima.cl');
  }
  
  // Create pokkzdev admin account
  const pokkzdevEmail = 'pokkzdev@notaminima.cl';
  if (!usedEmails.has(pokkzdevEmail)) {
    const pokkzdevPassword = await hash('Asdf1234', 12);
    await prisma.user.create({
      data: {
        email: pokkzdevEmail,
        username: 'pokkzdev',
        password: pokkzdevPassword,
        role: 'ADMIN',
        emailVerified: new Date()
      }
    });
    console.log('   ✓ Created admin: pokkzdev@notaminima.cl');
  }
  
  // Create a specific test student
  const testStudentEmail = 'estudiante@notaminima.cl';
  if (!usedEmails.has(testStudentEmail)) {
    const studentPassword = await hash('Student123!', 12);
    const testStudent = await prisma.user.create({
      data: {
        email: testStudentEmail,
        username: 'estudiante.test',
        password: studentPassword,
        role: 'STUDENT',
        emailVerified: new Date()
      }
    });
    
    // Create comprehensive data for test student
    for (let semIdx = 0; semIdx < 4; semIdx++) {
      const semester = await prisma.semester.create({
        data: {
          userId: testStudent.id,
          nombre: semesterNames[semIdx],
          orden: semIdx
        }
      });
      
      const courseNames = getCoursesForSemester(semIdx, 5);
      for (let courseIdx = 0; courseIdx < courseNames.length; courseIdx++) {
        const notas = generateGrades(5);
        const examenFinal = generateExamFinal();
        
        await prisma.promedio.create({
          data: {
            userId: testStudent.id,
            semesterId: semester.id,
            nombre: courseNames[courseIdx],
            notas,
            examenFinal,
            orden: courseIdx
          }
        });
      }
    }
    console.log('   ✓ Created test student: estudiante@notaminima.cl');
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📈 SEED SUMMARY');
  console.log('='.repeat(50));
  
  const stats = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.semester.count(),
    prisma.promedio.count()
  ]);
  
  console.log(`\n   Total Users:     ${stats[0]}`);
  console.log(`   - Admins:        ${stats[1]}`);
  console.log(`   - Teachers:      ${stats[2]}`);
  console.log(`   - Students:      ${stats[3]}`);
  console.log(`   Total Semesters: ${stats[4]}`);
  console.log(`   Total Courses:   ${stats[5]}`);
  
  // Calculate average grades across all courses
  const promedios = await prisma.promedio.findMany({
    select: { notas: true }
  });
  
  let totalGrades = 0;
  let sumGrades = 0;
  promedios.forEach(p => {
    const notas = p.notas;
    if (Array.isArray(notas)) {
      notas.forEach(nota => {
        if (nota.valor) {
          sumGrades += nota.valor;
          totalGrades++;
        }
      });
    }
  });
  
  const avgGrade = totalGrades > 0 ? (sumGrades / totalGrades).toFixed(2) : 0;
  console.log(`   Total Grades:    ${totalGrades}`);
  console.log(`   Average Grade:   ${avgGrade}`);
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Database seeding completed successfully!');
  console.log('='.repeat(50));
  
  console.log('\n🔑 Test Credentials:');
  console.log('   Admin:     admin@notaminima.cl / Admin123!');
  console.log('   Admin:     pokkzdev@notaminima.cl / Asdf1234');
  console.log('   Student:   estudiante@notaminima.cl / Student123!');
  console.log('   All seed users: [username]@example.com / TestPass123!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
