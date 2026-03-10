import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/services/authService';

const prisma = new PrismaClient();

async function seedChallenges() {
  console.log('🎮 Seeding challenges...');

  // Get existing subjects
  const techSubject = await prisma.subject.findFirst({ where: { name: 'Technology' } });
  const medicalSubject = await prisma.subject.findFirst({ where: { name: 'Medical' } });
  const businessSubject = await prisma.subject.findFirst({ where: { name: 'Business' } });

  if (!techSubject || !medicalSubject || !businessSubject) {
    throw new Error('Subjects not found. Run Phase 2 seed first.');
  }

  // Technology challenges
  const techChallenges = [
    {
      subjectId: techSubject.id,
      level: 1,
      type: 'FourChoicesOneWord',
      prompt: 'What does API stand for?',
      correctAnswer: 'Application Programming Interface',
      distractors: [
        'Advanced Programming Interface',
        'Application Process Integration',
        'Automated Programming Instructions'
      ],
      timeLimit: 30,
      xpReward: 10,
      difficultyLevel: 1,
    },
    {
      subjectId: techSubject.id,
      level: 1,
      type: 'FourChoicesOneWord',
      prompt: 'What does SQL stand for?',
      correctAnswer: 'Structured Query Language',
      distractors: [
        'Simple Query Language',
        'Standard Query Logic',
        'System Query Language'
      ],
      timeLimit: 30,
      xpReward: 10,
      difficultyLevel: 2,
    },
    {
      subjectId: techSubject.id,
      level: 2,
      type: 'FourChoicesOneWord',
      prompt: 'What does REST stand for?',
      correctAnswer: 'Representational State Transfer',
      distractors: [
        'Remote State Transfer',
        'Reliable State Transmission',
        'Resource State Transfer'
      ],
      timeLimit: 45,
      xpReward: 15,
      difficultyLevel: 3,
    },
  ];

  // Medical challenges
  const medicalChallenges = [
    {
      subjectId: medicalSubject.id,
      level: 1,
      type: 'FourChoicesOneWord',
      prompt: 'What does CPR stand for?',
      correctAnswer: 'Cardiopulmonary Resuscitation',
      distractors: [
        'Cardiac Pressure Relief',
        'Circulatory Pulse Restoration',
        'Cardiovascular Pressure Response'
      ],
      timeLimit: 30,
      xpReward: 10,
      difficultyLevel: 1,
    },
    {
      subjectId: medicalSubject.id,
      level: 1,
      type: 'FourChoicesOneWord',
      prompt: 'What does MRI stand for?',
      correctAnswer: 'Magnetic Resonance Imaging',
      distractors: [
        'Medical Radiology Imaging',
        'Molecular Resonance Inspection',
        'Multiple Range Imaging'
      ],
      timeLimit: 30,
      xpReward: 10,
      difficultyLevel: 2,
    },
  ];

  // Business challenges
  const businessChallenges = [
    {
      subjectId: businessSubject.id,
      level: 1,
      type: 'FourChoicesOneWord',
      prompt: 'What does ROI stand for?',
      correctAnswer: 'Return on Investment',
      distractors: [
        'Rate of Interest',
        'Revenue Operations Index',
        'Risk Operations Indicator'
      ],
      timeLimit: 30,
      xpReward: 10,
      difficultyLevel: 1,
    },
    {
      subjectId: businessSubject.id,
      level: 1,
      type: 'FourChoicesOneWord',
      prompt: 'What does KPI stand for?',
      correctAnswer: 'Key Performance Indicator',
      distractors: [
        'Key Process Integration',
        'Knowledge Performance Index',
        'Key Productivity Indicator'
      ],
      timeLimit: 30,
      xpReward: 10,
      difficultyLevel: 2,
    },
  ];

  // Insert all challenges
  const allChallenges = [...techChallenges, ...medicalChallenges, ...businessChallenges];
  
  for (const challenge of allChallenges) {
    await prisma.challenge.create({ data: challenge });
  }

  console.log(`✅ Created ${allChallenges.length} challenges`);
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample subjects
  const techSubject = await prisma.subject.create({
    data: {
      name: 'Technology',
      description: 'Common technology and software development acronyms',
      icon: 'laptop',
      color: '#3B82F6',
      difficulty: 2,
    },
  });

  const medicalSubject = await prisma.subject.create({
    data: {
      name: 'Medical',
      description: 'Medical and healthcare terminology',
      icon: 'heart',
      color: '#EF4444',
      difficulty: 3,
    },
  });

  const businessSubject = await prisma.subject.create({
    data: {
      name: 'Business',
      description: 'Business and finance acronyms',
      icon: 'briefcase',
      color: '#10B981',
      difficulty: 2,
    },
  });

  // Create sample vocabulary for Technology
  const techVocabulary = [
    {
      term: 'API',
      definition: 'A set of protocols and tools for building software applications',
      fullForm: 'Application Programming Interface',
      example: 'The weather app uses an API to get current weather data',
      difficulty: 1,
      subjectId: techSubject.id,
    },
    {
      term: 'SQL',
      definition: 'A programming language designed for managing data in relational databases',
      fullForm: 'Structured Query Language',
      example: 'We use SQL to query the user database',
      difficulty: 2,
      subjectId: techSubject.id,
    },
    {
      term: 'REST',
      definition: 'An architectural style for designing networked applications',
      fullForm: 'Representational State Transfer',
      example: 'Our REST API follows standard HTTP methods',
      difficulty: 3,
      subjectId: techSubject.id,
    },
  ];

  // Create sample vocabulary for Medical
  const medicalVocabulary = [
    {
      term: 'CPR',
      definition: 'An emergency procedure to restore blood circulation and breathing',
      fullForm: 'Cardiopulmonary Resuscitation',
      example: 'The paramedic performed CPR on the patient',
      difficulty: 1,
      subjectId: medicalSubject.id,
    },
    {
      term: 'MRI',
      definition: 'A medical imaging technique using magnetic fields and radio waves',
      fullForm: 'Magnetic Resonance Imaging',
      example: 'The doctor ordered an MRI to examine the brain injury',
      difficulty: 2,
      subjectId: medicalSubject.id,
    },
  ];

  // Create sample vocabulary for Business
  const businessVocabulary = [
    {
      term: 'ROI',
      definition: 'A measure of the efficiency of an investment',
      fullForm: 'Return on Investment',
      example: 'The marketing campaign had a 300% ROI',
      difficulty: 1,
      subjectId: businessSubject.id,
    },
    {
      term: 'KPI',
      definition: 'A measurable value that demonstrates effectiveness in achieving objectives',
      fullForm: 'Key Performance Indicator',
      example: 'Customer satisfaction is our primary KPI',
      difficulty: 2,
      subjectId: businessSubject.id,
    },
  ];

  // Insert vocabulary
  await prisma.vocabulary.createMany({
    data: [...techVocabulary, ...medicalVocabulary, ...businessVocabulary],
  });

  // Create sample achievements
  const achievements = [
    {
      name: 'First Steps',
      description: 'Complete your first vocabulary term',
      icon: 'star',
      category: 'milestone',
      requirement: 1,
      xpReward: 10,
    },
    {
      name: 'Quick Learner',
      description: 'Master 10 terms in a single subject',
      icon: 'lightning',
      category: 'mastery',
      requirement: 10,
      xpReward: 50,
    },
    {
      name: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: 'fire',
      category: 'streak',
      requirement: 7,
      xpReward: 100,
    },
    {
      name: 'Subject Explorer',
      description: 'Try vocabulary from 3 different subjects',
      icon: 'compass',
      category: 'exploration',
      requirement: 3,
      xpReward: 75,
    },
  ];

  await prisma.achievement.createMany({
    data: achievements,
  });

  // Create a test user
  const testUser = await AuthService.createUser({
    email: 'test@example.com',
    username: 'testuser',
    password: 'TestPassword123',
    firstName: 'Test',
    lastName: 'User',
  });

  // Seed challenges
  await seedChallenges();

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${techVocabulary.length + medicalVocabulary.length + businessVocabulary.length} vocabulary terms`);
  console.log(`🏆 Created ${achievements.length} achievements`);
  console.log(`👤 Created test user: test@example.com / TestPassword123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });