import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Hidden test account (mandatory)
  const testHash = await bcrypt.hash('jrcu5u*pUh', 12)
  const testUser = await prisma.user.upsert({
    where: { email: 'abacus-5c77b7f5@example.com' },
    update: {},
    create: {
      name: 'Test Admin',
      email: 'abacus-5c77b7f5@example.com',
      passwordHash: testHash,
      userType: 'idea_owner',
      phone: '5550000000',
    },
  })

  // Sample users for demo matches
  const investorHash = await bcrypt.hash('demo123456', 12)
  const investor = await prisma.user.upsert({
    where: { email: 'yatirimci@ideai.com' },
    update: {},
    create: {
      name: 'Mehmet Kaya',
      email: 'yatirimci@ideai.com',
      passwordHash: investorHash,
      userType: 'investor',
      phone: '5551112233',
    },
  })

  const devHash = await bcrypt.hash('demo123456', 12)
  const developer = await prisma.user.upsert({
    where: { email: 'yazilimci@ideai.com' },
    update: {},
    create: {
      name: 'Ayşe Demir',
      email: 'yazilimci@ideai.com',
      passwordHash: devHash,
      userType: 'support_team',
      phone: '5554445566',
    },
  })

  const marketerHash = await bcrypt.hash('demo123456', 12)
  const marketer = await prisma.user.upsert({
    where: { email: 'pazarlamaci@ideai.com' },
    update: {},
    create: {
      name: 'Ali Yılmaz',
      email: 'pazarlamaci@ideai.com',
      passwordHash: marketerHash,
      userType: 'support_team',
      phone: '5557778899',
    },
  })

  // Profiles
  await prisma.profile.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      data: {
        title: 'AI Destekli İş Eşleştirme Platformu',
        description: 'Fikir sahiplerini yatırımcılar ve uzmanlarla yapay zeka ile eşleştiren platform.',
        sector: 'Teknoloji',
        capital: '500000',
        weeklyHours: '40',
      },
    },
  })

  await prisma.profile.upsert({
    where: { userId: investor.id },
    update: {},
    create: {
      userId: investor.id,
      data: {
        budget: '1000000',
        interests: 'Teknoloji, Finans, Sağlık',
        riskLevel: 'medium',
        country: 'Türkiye',
        city: 'İstanbul',
      },
    },
  })

  await prisma.profile.upsert({
    where: { userId: developer.id },
    update: {},
    create: {
      userId: developer.id,
      subRole: 'developer',
      data: {
        expertise: 'React, Node.js, Python, AI/ML',
        workModel: 'equity',
        weeklyHours: '25',
        experience: '7',
      },
    },
  })

  await prisma.profile.upsert({
    where: { userId: marketer.id },
    update: {},
    create: {
      userId: marketer.id,
      subRole: 'marketer',
      data: {
        expertise: 'Dijital Pazarlama, SEO, Sosyal Medya',
        workModel: 'partnership',
        weeklyHours: '20',
        experience: '5',
      },
    },
  })

  // Matches for test user
  await prisma.match.upsert({
    where: { userAId_userBId: { userAId: testUser.id, userBId: investor.id } },
    update: {},
    create: {
      userAId: testUser.id,
      userBId: investor.id,
      score: 92,
      status: 'pending',
    },
  })

  await prisma.match.upsert({
    where: { userAId_userBId: { userAId: testUser.id, userBId: developer.id } },
    update: {},
    create: {
      userAId: testUser.id,
      userBId: developer.id,
      score: 87,
      status: 'pending',
    },
  })

  await prisma.match.upsert({
    where: { userAId_userBId: { userAId: testUser.id, userBId: marketer.id } },
    update: {},
    create: {
      userAId: testUser.id,
      userBId: marketer.id,
      score: 78,
      status: 'pending',
    },
  })

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
