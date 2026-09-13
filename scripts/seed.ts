import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const firstNames = [
  'Ahmet', 'Mehmet', 'Ali', 'Mustafa', 'Hüseyin', 'Hasan', 'İbrahim', 'Osman', 'Ömer', 'Emre',
  'Burak', 'Can', 'Kerem', 'Murat', 'Serkan', 'Uğur', 'Barış', 'Fatih', 'Koray', 'Serhat',
  'Berk', 'Deniz', 'Ege', 'Kaan', 'Mert', 'Onur', 'Selim', 'Tolga', 'Volkan', 'Yasin',
  'Yusuf', 'Batuhan', 'Cem', 'Doğuş', 'Eray', 'Furkan', 'Gökhan', 'Halil', 'İsmail', 'Kadir',
  'Levent', 'Mahmut', 'Necati', 'Orhan', 'Ayşe', 'Fatma', 'Emine', 'Hatice', 'Zeynep', 'Elif',
  'Merve', 'Selin', 'Cansu', 'Ebru', 'Betül', 'Gizem', 'Kübra', 'Seda', 'Büşra', 'Yasemin',
]

const lastNames = [
  'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Aydın', 'Öztürk', 'Arslan', 'Doğan', 'Kılıç',
  'Aslan', 'Çetin', 'Kara', 'Koç', 'Güler', 'Yıldız', 'Bulut', 'Aksoy', 'Taş', 'Korkmaz',
  'Özdemir', 'Şen', 'Erbay', 'Akın', 'Uysal', 'Tekin', 'Yücel', 'Çakır', 'Erdoğan', 'Polat',
  'Bozkurt', 'Yavuz', 'Acar', 'Kaplan', 'Gökalp', 'Turan', 'Sezer', 'Ateş', 'Duman', 'Sarı',
  'Ay', 'Bakır', 'Yüksel', 'Çoban', 'Er', 'Özer', 'Yaman', 'Güneş', 'Kurt', 'Tuncer',
]

const sectors = [
  'Teknoloji', 'Sağlık', 'Eğitim', 'Finans', 'Tarım', 'Enerji', 'E-ticaret', 'Oyun',
  'Seyahat', 'Gayrimenkul', 'Üretim', 'Lojistik', 'Gıda', 'Moda', 'İnsan Kaynakları',
  'Çevre', 'Eğlence', 'Spor', 'Hukuk', 'İletişim',
]

const ideaTemplates: Record<string, string[]> = {
  Teknoloji: [
    'AI destekli müşteri hizmetleri chatbotu',
    'Küçük işletmeler için otomatik muhasebe asistanı',
    'Yapay zeka tabanlı kod review platformu',
    'Akıllı ev cihazları için açık kaynak işletim sistemi',
    'Girişimciler için yatırım eğilimi analiz aracı',
  ],
  Sağlık: [
    'Uzaktan sağlık danışmanlığı uygulaması',
    'Kişiselleştirilmiş beslenme planlayıcısı',
    'Akıllı bileklikle uyku apnesi tespiti',
    'Hasta takip ve randevu yönetim sistemi',
    'Eczacılar için interaktif ilaç etkileşim rehberi',
  ],
  Eğitim: [
    'Öğrenciler için yapay zeka özel ders asistanı',
    'Uzaktan eğitim içerik pazaryeri',
    'Sınav hazırlık strateji uygulaması',
    'Kurumsal eğitim takip platformu',
    'Çocuklar için oyunlaştırılmış kodlama uygulaması',
  ],
  Finans: [
    'Kişisel bütçe ve tasarruf koçu',
    'Kripto varlık portföy takip aracı',
    'Mikro yatırım topluluk platformu',
    'KOBİ\'ler için fatura finansmanı marketi',
    'Otomatik vergi optimizasyonu asistanı',
  ],
  Tarım: [
    'Akıllı sulama ve sensör izleme sistemi',
    'Çiftçiden tüketiciye doğrudan satış platformu',
    'Hasat zamanı tahmin uygulaması',
    'Organik tarım sertifika takip sistemi',
    'Drone destekli tarım haritalama hizmeti',
  ],
  Enerji: [
    'Evsel güneş paneli verimlilik izleyici',
    'Elektrikli araç şarj istasyonu ağı uygulaması',
    'Akıllı bina enerji optimizasyonu platformu',
    'Yenilenebilir enerji yatırım pazaryeri',
    'Sanayi için enerji sarfiyat analiz aracı',
  ],
  'E-ticaret': [
    'Yerel zanaatkarlar için online pazar yeri',
    'İkinci el ürün takas platformu',
    'Abonelik kutusu yönetim sistemi',
    'Küçük esnaf için sosyal ticaret aracı',
    'Kişiselleştirilmiş alışveriş asistanı',
  ],
  Oyun: [
    'Eğitici mobil strateji oyunu',
    'Metaverse tabanlı sanal etkinlik platformu',
    'Yerel çok oyunculu parti oyunu',
    'Fitness verilerini kullanan AR oyunu',
    'Bağımsız oyun geliştiricileri için pazaryeri',
  ],
  Seyahat: [
    'Sürdürülebilir seyahat planlama uygulaması',
    'Yerel rehber bulma ve rezervasyon platformu',
    'Bütçe dostu konaklama karşılaştırma aracı',
    'Seyahat sigortası karşılaştırma asistanı',
    'Grup seyahati organizasyon uygulaması',
  ],
  Gayrimenkul: [
    'Kiralık ev arama ve kredi hesaplama uygulaması',
    'Dijital emlak yatırım analiz platformu',
    'Apartman yönetimi iletişim aracı',
    'Ofis paylaşım pazaryeri',
    'Yapı denetim raporlama sistemleri',
  ],
  Üretim: [
    '3D baskı sipariş ve tasarım pazaryeri',
    'Üretim hatları için kalite kontrol asistanı',
    'Tedarikçi yönetim ve teklif toplama platformu',
    'Atölye randevu ve stok takip sistemi',
    'Yerli üretici ürün vitrini',
  ],
  Lojistik: [
    'Son kilometre teslimat optimizasyonu',
    'Gönderi takibi ve müşteri bildirim sistemi',
    'Küçük kurye firmaları için dispatch uygulaması',
    'Depo stok ve sipariş yönetimi platformu',
    'Taşımacılar için boş dönüş yük eşleştirme',
  ],
  Gıda: [
    'Restoranlar için atık azaltma analitiği',
    'Ev yapımı yemek satış platformu',
    'Yerel üretici gıda abonelik kutusu',
    'Alerjen ve besin değeri tarayıcı uygulaması',
    'Mobil gıda kamyonu konum ve menü uygulaması',
  ],
  Moda: [
    'Sürdürülebilir kıyafet kiralama platformu',
    'Tasarımcı ve müşteri buluşma pazaryeri',
    'Kişisel stil asistanı uygulaması',
    'İkinci el lüks ürün doğrulama hizmeti',
    'Özel dikim sipariş yönetim sistemi',
  ],
  'İnsan Kaynakları': [
    'Uzaktan çalışan performans takip aracı',
    'İş ilanı ve aday eşleştirme platformu',
    'Çalışan referans programı yönetimi',
    'Kurumsal iyileşme anket ve analiz aracı',
    'Serbest çalışan ödeme ve sözleşme sistemi',
  ],
  Çevre: [
    'Atık toplama ve geri dönüşüm ödül uygulaması',
    'Hava kalitesi izleme ve raporlama platformu',
    'Bireysel karbon ayak izi hesaplayıcı',
    'Sürdürülebilir ürün sertifika veritabanı',
    'Su kalitesi sensör ağı ve uyarı sistemi',
  ],
  Eğlence: [
    'Yerel etkinlik keşif ve bilet platformu',
    'Sanatçılar için dijital içerik pazaryeri',
    'Podcast prodüksiyon ve dağıtım aracı',
    'Kullanıcı üretimi yarışma uygulaması',
    'Açık hava sinema organizasyon platformu',
  ],
  Spor: [
    'Amatör spor kulüpleri yönetim uygulaması',
    'Kişisel antrenman planlayıcısı',
    'Spor salonu üyelik ve randevu sistemi',
    'Yarışma ve turnuva organizasyon platformu',
    'Sakatlık öncesi risk analiz uygulaması',
  ],
  Hukuk: [
    'KOBİ\'ler için sözleşme taslağı asistanı',
    'Hukuki danışmanlık randevu platformu',
    'Dava takip ve hatırlatma uygulaması',
    'Fikri mülkiyet başvuru yönetim sistemi',
    'Hukuk büroları için müvekkil portalı',
  ],
  İletişim: [
    'İçerik üreticiler için işbirliği platformu',
    'Yerel haber ve duyuru ağı uygulaması',
    'Ekip içi asenkron video mesajlaşma aracı',
    'Dijital PR kampanya yönetim sistemi',
    'Markalar için influencer eşleştirme platformu',
  ],
}

const supportSubRoles = [
  'developer', 'marketer', 'designer', 'mentor', 'lawyer', 'accountant', 'hr', 'operations',
]

const expertiseBySubRole: Record<string, string[]> = {
  developer: ['React', 'Node.js', 'Python', 'TypeScript', 'Next.js', 'Mobile', 'AI/ML'],
  marketer: ['Dijital Pazarlama', 'SEO', 'Sosyal Medya', 'İçerik Stratejisi', 'Growth Hacking'],
  designer: ['UI/UX', 'Figma', 'Adobe Suite', 'Marka Kimliği', 'Prototipleme'],
  mentor: ['İş Stratejisi', 'Startup Danışmanlığı', 'Pazara Giriş', 'Ölçeklendirme'],
  lawyer: ['Şirket Hukuku', 'Sözleşmeler', 'Fikri Mülkiyet', 'GDPR', 'Yatırım Anlaşmaları'],
  accountant: ['Muhasebe', 'Vergi', 'Finansal Raporlama', 'Bütçeleme', 'KOBİ Danışmanlığı'],
  hr: ['İşe Alım', 'Performans Yönetimi', 'Özlük İşleri', 'Kurumsal Kültür', 'Eğitim'],
  operations: ['Operasyon Yönetimi', 'Süreç İyileştirme', 'Tedarik Zinciri', 'Proje Yönetimi'],
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function pick(arr: string[], seed: number) {
  return arr[Math.floor(seededRandom(seed) * arr.length)]
}

async function main() {
  console.log('Seeding database...')

  const defaultHash = await bcrypt.hash('Demo1234!', 10)

  // Hidden test account (mandatory)
  await prisma.user.upsert({
    where: { email: 'abacus-5c77b7f5@example.com' },
    update: {},
    create: {
      name: 'Test Admin',
      email: 'abacus-5c77b7f5@example.com',
      passwordHash: defaultHash,
      userType: 'idea_owner',
      phone: '5550000000',
    },
  })

  const createdUserIds: string[] = []

  // 50 idea owners
  for (let i = 0; i < 50; i++) {
    const seed = i + 1
    const first = pick(firstNames, seed)
    const last = pick(lastNames, seed * 3)
    const sector = pick(sectors, seed * 5)
    const title = pick(ideaTemplates[sector] || ideaTemplates['Teknoloji'], seed * 7)
    const email = `bot-idea-${String(i + 1).padStart(3, '0')}@demo.ideai.com`
    const phone = `555100${String(i + 1).padStart(4, '0')}`

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: `${first} ${last}`,
        email,
        passwordHash: defaultHash,
        userType: 'idea_owner',
        phone,
      },
    })
    createdUserIds.push(user.id)

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        data: {
          title,
          description,
          bio: `${first} ${last}, ${sector} sektöründe yenilikçi bir girişim fikri ile ilgileniyor ve doğru ortakları arıyor.`,
          sector,
          stage: ['idea', 'mvp', 'early_revenue'][Math.floor(seededRandom(seed * 17) * 3)],
          capital: String([250000, 500000, 750000, 1000000, 1500000][Math.floor(seededRandom(seed * 11) * 5)]),
          capitalCurrency: 'TRY',
          weeklyHours: String([20, 30, 40, 50][Math.floor(seededRandom(seed * 13) * 4)]),
          country: 'Türkiye',
          city: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'][Math.floor(seededRandom(seed * 19) * 5)],
        },
      },
      create: {
        userId: user.id,
        data: {
          title,
          description,
          bio: `${first} ${last}, ${sector} sektöründe yenilikçi bir girişim fikri ile ilgileniyor ve doğru ortakları arıyor.`,
          sector,
          stage: ['idea', 'mvp', 'early_revenue'][Math.floor(seededRandom(seed * 17) * 3)],
          capital: String([250000, 500000, 750000, 1000000, 1500000][Math.floor(seededRandom(seed * 11) * 5)]),
          capitalCurrency: 'TRY',
          weeklyHours: String([20, 30, 40, 50][Math.floor(seededRandom(seed * 13) * 4)]),
          country: 'Türkiye',
          city: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'][Math.floor(seededRandom(seed * 19) * 5)],
        },
      },
    })

    if ((i + 1) % 10 === 0) console.log(`Created ${i + 1} idea owners`)
  }

  // 50 investors
  for (let i = 0; i < 50; i++) {
    const seed = i + 1001
    const first = pick(firstNames, seed)
    const last = pick(lastNames, seed * 3)
    const email = `bot-investor-${String(i + 1).padStart(3, '0')}@demo.ideai.com`
    const phone = `555200${String(i + 1).padStart(4, '0')}`
    const interestCount = 2 + Math.floor(seededRandom(seed * 23) * 2)
    const interests: string[] = []
    for (let j = 0; j < interestCount; j++) {
      const s = pick(sectors, seed * 29 + j)
      if (!interests.includes(s)) interests.push(s)
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: `${first} ${last}`,
        email,
        passwordHash: defaultHash,
        userType: 'investor',
        phone,
      },
    })
    createdUserIds.push(user.id)

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        data: {
          budget: String([500000, 1000000, 2500000, 5000000, 10000000][Math.floor(seededRandom(seed * 31) * 5)]),
          budgetCurrency: 'TRY',
          investmentAreas: interests.join(', '),
          bio: `${first} ${last}, ${interests.join(', ')} alanlarında erken aşama girişimlere yatırım yapmak isteyen bir yatırımcı.`,
          interests: interests.join(', '),
          riskLevel: ['low', 'medium', 'high'][Math.floor(seededRandom(seed * 37) * 3)],
          country: 'Türkiye',
          city: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'][Math.floor(seededRandom(seed * 41) * 5)],
          investorType: ['angel', 'vc', 'corporate', 'crowdfunding'][Math.floor(seededRandom(seed * 43) * 4)],
        },
      },
      create: {
        userId: user.id,
        data: {
          budget: String([500000, 1000000, 2500000, 5000000, 10000000][Math.floor(seededRandom(seed * 31) * 5)]),
          budgetCurrency: 'TRY',
          investmentAreas: interests.join(', '),
          bio: `${first} ${last}, ${interests.join(', ')} alanlarında erken aşama girişimlere yatırım yapmak isteyen bir yatırımcı.`,
          interests: interests.join(', '),
          riskLevel: ['low', 'medium', 'high'][Math.floor(seededRandom(seed * 37) * 3)],
          country: 'Türkiye',
          city: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'][Math.floor(seededRandom(seed * 41) * 5)],
          investorType: ['angel', 'vc', 'corporate', 'crowdfunding'][Math.floor(seededRandom(seed * 43) * 4)],
        },
      },
    })

    if ((i + 1) % 10 === 0) console.log(`Created ${i + 1} investors`)
  }

  // 100 support team members
  for (let i = 0; i < 100; i++) {
    const seed = i + 2001
    const first = pick(firstNames, seed)
    const last = pick(lastNames, seed * 3)
    const subRole = supportSubRoles[i % supportSubRoles.length]
    const email = `bot-support-${String(i + 1).padStart(3, '0')}@demo.ideai.com`
    const phone = `555300${String(i + 1).padStart(4, '0')}`
    const expertisePool = expertiseBySubRole[subRole]
    const expertiseCount = 2 + Math.floor(seededRandom(seed * 47) * 3)
    const expertise: string[] = []
    for (let j = 0; j < expertiseCount; j++) {
      const e = pick(expertisePool, seed * 53 + j)
      if (!expertise.includes(e)) expertise.push(e)
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: `${first} ${last}`,
        email,
        passwordHash: defaultHash,
        userType: 'support_team',
        phone,
      },
    })
    createdUserIds.push(user.id)

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        data: {
          expertise: expertise.join(', '),
          skills: expertise.join(', '),
          bio: `${first} ${last}, ${expertise.join(', ')} konularında girişimlere destek veren bir ${subRole}.`,
          workModel: ['equity', 'partnership', 'freelance', 'volunteer'][Math.floor(seededRandom(seed * 59) * 4)],
          weeklyHours: String([5, 10, 15, 20, 25, 30][Math.floor(seededRandom(seed * 61) * 6)]),
          experience: String([1, 2, 3, 5, 7, 10, 15][Math.floor(seededRandom(seed * 67) * 7)]),
          country: 'Türkiye',
          city: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'][Math.floor(seededRandom(seed * 71) * 5)],
        },
      },
      create: {
        userId: user.id,
        subRole,
        data: {
          expertise: expertise.join(', '),
          skills: expertise.join(', '),
          bio: `${first} ${last}, ${expertise.join(', ')} konularında girişimlere destek veren bir ${subRole}.`,
          workModel: ['equity', 'partnership', 'freelance', 'volunteer'][Math.floor(seededRandom(seed * 59) * 4)],
          weeklyHours: String([5, 10, 15, 20, 25, 30][Math.floor(seededRandom(seed * 61) * 6)]),
          experience: String([1, 2, 3, 5, 7, 10, 15][Math.floor(seededRandom(seed * 67) * 7)]),
          country: 'Türkiye',
          city: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'][Math.floor(seededRandom(seed * 71) * 5)],
        },
      },
    })

    if ((i + 1) % 20 === 0) console.log(`Created ${i + 1} support team members`)
  }

  // Demo matches for first idea owner with first 3 non-idea owners
  const firstIdeaOwner = await prisma.user.findUnique({
    where: { email: 'bot-idea-001@demo.ideai.com' },
  })
  const matchTargets = await prisma.user.findMany({
    where: { userType: { not: 'idea_owner' } },
    take: 5,
    orderBy: { createdAt: 'asc' },
  })

  if (firstIdeaOwner) {
    for (const target of matchTargets) {
      await prisma.match.upsert({
        where: { userAId_userBId: { userAId: firstIdeaOwner.id, userBId: target.id } },
        update: {},
        create: {
          userAId: firstIdeaOwner.id,
          userBId: target.id,
          score: Math.floor(60 + seededRandom(parseInt(target.id.slice(-4), 16) || 1) * 35),
          status: 'pending',
        },
      })
    }
  }

  console.log(`Seeding complete! ${createdUserIds.length} bot users added.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
