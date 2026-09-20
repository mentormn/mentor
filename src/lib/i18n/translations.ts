export type Language = 'mn' | 'en';

export const translations = {
  en: {
    // Brand & Header
    brandTitle: 'Academic Mentorship Infrastructure',
    nationalTag: 'NATIONAL',
    navClasses: 'Sprint Classes',
    navMinistry: 'Ministry Telemetry',
    navVerify: 'Verify Certificate',
    navOpenClass: 'Open a Class',
    navProfile: 'Dual Profile',
    switchLang: 'Монгол хэл',

    // Landing Hero
    heroBadge: 'National Academic Mentorship & Intelligence Infrastructure',
    heroTitlePrefix: 'Learn from students who ',
    heroTitleHighlight: 'actually mastered it.',
    heroDesc: 'Outdated classroom lecturing leaves curiosity behind. Mentor.mn connects ambitious students with proven peer mentors for focused 1–3 week sprint classes (1 to 10 seats). Build tangible deliverables, earn Ministry-accredited formal credentials, and pay it forward.',
    heroFindClass: 'Find a Class & Claim a Seat',
    heroOpenClass: 'Open a Class as a Mentor',
    badgeCohorts: 'Flexible Cohorts (1 to 10 Seats)',
    badgeDeliverables: 'Deliverable-Gated Progression',
    badgeCredentials: 'SHA-256 Verifiable Ministry Credentials',

    // Flywheel Stats
    flywheelTitle: 'Live National Knowledge Flywheel',
    flywheelSubtitle: 'Real-time impact telemetry across Mongolia\'s schools and provinces',
    flywheelAuditLink: 'View Full Ministry Audit',
    statActiveClasses: 'Active Sprint Classes',
    statActiveSub: 'In-session this week',
    statStudents: 'Students Guided',
    statStudentsSub: 'Across 1 to 10-seat cohorts',
    statAimags: 'Aimags Reached',
    statAimagsSub: 'Urban-to-rural knowledge transfer',
    statMultiplier: 'Knowledge Multiplier',
    statMultiplierSub: 'Graduates who become mentors',

    // How it works
    howItWorksTitle: 'How the Knowledge Flywheel Works',
    howItWorksSubtitle: 'A self-sustaining system designed to improve all students over time',
    step1Title: 'Sprint Classes (1 to 10 Seats)',
    step1Desc: 'Mentors open focused 1–3 week sprint classes on topics they mastered (e.g. Cambridge Differentiation, Pygame Dev, Olympiad Circuits) with custom seat limits.',
    step2Title: 'Deliverable Verification',
    step2Desc: 'No time-farming. At the end of the sprint, students submit genuine proof: a working codebase, solved proof set, or lab analysis. Mentors review and verify.',
    step3Title: 'Pay It Forward & Formal Tiers',
    step3Desc: 'Mentors level up through formal tiers (Junior → Senior → Master → National Laureate), while graduated students open their own sprint classes for younger peers!',

    // Featured Classes
    openClassesTitle: 'Open Sprint Classes',
    openClassesSub: 'Classes starting soon with open seats',
    browseAllClasses: 'Browse All Classes',
    viewClass: 'View Class',
    seatsFilled: 'seats filled',
    seatLeft: 'seat left',
    seatsLeftPlural: 'seats left',
    classFull: 'Class full',

    // Formal Tiers
    tiersTitle: 'Formal Academic Mentor Tiers',
    tiersSub: 'Mentors advance by teaching cohorts and verifying genuine deliverables, unlocking prestigious credentials for university admissions.',

    // Classes Directory
    classesTitle: 'Sprint Classes Directory',
    classesSub: 'Browse 1–3 week focused sprint classes. Join a micro-pod or cohort and learn from peers who mastered the subject.',
    searchPlaceholder: 'Search by topic, subject, or mentor name...',
    filterSubject: 'Subject',
    filterSize: 'Cohort Size',
    claimSeat: 'Claim Seat',
    enrolledBadge: 'Enrolled ✓',
    teachingBadge: 'Teaching',
    classSpaceBtn: 'Class Space',
    noClassesFound: 'No sprint classes found matching your criteria',

    // Create Class
    createTitle: 'Open a Sprint Class',
    createSub: 'Teach what you mastered. Pick your seat capacity (1 to 10 seats), schedule your 1–3 week sprint, and help younger peers learn with genuine mastery.',
    fieldTitle: 'Class Title & Specific Focus *',
    fieldSubject: 'Subject Domain *',
    fieldCurriculum: 'Curriculum Standard *',
    fieldDesc: 'Sprint Overview & Deliverable Goal *',
    fieldSeats: 'Seat Capacity (Cohort Size)',
    fieldDuration: 'Duration *',
    fieldStartDate: 'Start Date *',
    fieldEndDate: 'End Date *',
    fieldSchedule: 'Schedule Summary *',
    fieldMeetingLink: 'Meeting Video Link *',
    publishBtn: 'Publish Sprint Class & Open Seats',

    // Class Space
    joinVideoBtn: 'Join Video Session ↗',
    leadMentor: 'Lead Mentor',
    sprintWindow: 'Sprint Window & Schedule',
    cohortStatus: 'Cohort Status',
    tabDeliverables: 'Artifacts & Deliverables',
    tabRoster: 'Class Roster',
    submitDeliverableTitle: 'Submit Your Sprint Deliverable (Proof of Mastery)',
    submitDeliverableDesc: 'To complete this sprint and graduate, submit your artifact: a GitHub repository link, photo of solved problem sets, or project document.',
    submitDeliverableBtn: 'Submit Artifact for Verification',
    payItForwardTitle: 'You Have Mastered This Sprint! Pay It Forward.',
    payItForwardDesc: 'Your deliverable has been formally certified by your mentor. Because you now possess real mastery of this topic, you have unlocked the ability to open your own sprint class and guide 1–3 younger peers!',
    openClassBtn: 'Open a Class to Teach This Subject',
    mentorFeedbackLabel: 'Mentor Feedback:',
    approveDeliverableBtn: 'Approve & Certify Deliverable',

    // Profile
    profileMyLearning: 'My Learning (As a Student)',
    profileMyMentoring: 'My Mentoring (As a Mentor)',
    canMentorLabel: 'Can Mentor (Specializations):',
    learningGoalsLabel: 'Currently Learning (Goals):',
    mentorXpLabel: 'Mentor XP',
    studentsTaughtLabel: 'Students Taught',
    enrolledClassesLabel: 'Enrolled',
    classesTeachingTitle: 'Classes You Are Teaching',
    ministryCertsTitle: 'Ministry-Accredited Civic Certificates',
    ministryCertsSub: 'Cryptographically signed credentials verifiable by universities and educational ministries worldwide.',

    // Verification
    certHeaderTitle: 'CERTIFICATE OF MERIT & CIVIC SERVICE',
    certSubTitle: 'NATIONAL PEER EDUCATION PROGRAM',
    certVerifiedBadge: 'Cryptographically Verified Civic Credential',
    certPrintBtn: 'Print / Save as PDF',
    certCertifiesThat: 'This certifies that',
    certValidSig: 'Tamper-Proof Signature Valid',

    // Ministry Audit
    auditTitle: 'National Academic Knowledge Transfer Audit',
    auditSub: 'Real-time oversight into student-led academic mentorship, provincial reach across Mongolia\'s 21 aimags, and the self-sustaining peer education multiplier.',
    provincialReachTitle: 'Provincial Participation & Knowledge Transfer',
    deliverableAuditTitle: 'Deliverable Integrity & Anti-Gaming Spot-Check',
  },
  mn: {
    // Brand & Header
    brandTitle: 'Академик менторшил ба мэдлэгийн дэд бүтэц',
    nationalTag: 'ҮНДЭСНИЙ',
    navClasses: 'Спринт хичээлүүд',
    navMinistry: 'Яамны статистик',
    navVerify: 'Сертификат шалгах',
    navOpenClass: 'Хичээл нээх',
    navProfile: 'Хос профайл',
    switchLang: 'English',

    // Landing Hero
    heroBadge: 'Үндэсний академик менторшил ба боловсролын дэд бүтэц',
    heroTitlePrefix: 'Өөрийн хичээл зүтгэлээр эзэмшсэн ',
    heroTitleHighlight: 'үе тэнгийнхнээсээ суралц.',
    heroDesc: 'Хуучирсан танхимын сургалт сурах хүсэл эрмэлзлийг мохоодог. Mentor.mn нь суралцах эрмэлзэлтэй хүүхдүүдийг тухайн хичээлээ бүрэн эзэмшсэн үе тэнгийн менторуудтай 1–3 долоо хоногийн богино хугацааны спринт ангиудад (1-10 суудал) холбодог. Бодит бүтээл хийж, Боловсролын яамны баталгаажсан сертификат авч, дараагийн дүү нартаа зааж түгээгээрэй.',
    heroFindClass: 'Хичээл сонгож суудал захиалах',
    heroOpenClass: 'Ментороор хичээл нээх',
    badgeCohorts: 'Уян хатан ангиуд (1-10 суудал)',
    badgeDeliverables: 'Бодит бүтээлээр баталгаажих шалгуур',
    badgeCredentials: 'SHA-256 криптограф баталгаатай сертификат',

    // Flywheel Stats
    flywheelTitle: 'Үндэсний мэдлэгийн flywheel (Хүрд)',
    flywheelSubtitle: 'Монгол улсын сургуулиуд болон 21 аймаг дахь бодит үр дүнгийн үзүүлэлт',
    flywheelAuditLink: 'Яамны бүрэн тайланг харах',
    statActiveClasses: 'Идэвхтэй спринт ангиуд',
    statActiveSub: 'Энэ долоо хоногт хичээллэж буй',
    statStudents: 'Суралцсан сурагчид',
    statStudentsSub: '1-ээс 10 хүртэлх суудлын ангиудад',
    statAimags: 'Хамрагдсан аймгууд',
    statAimagsSub: 'Хот-хөдөөгийн мэдлэг шилжүүлэлт',
    statMultiplier: 'Мэдлэгийн үржүүлэгч',
    statMultiplierSub: 'Төгсөөд ментор болсон сурагчид',

    // How it works
    howItWorksTitle: 'Мэдлэгийн хүрд хэрхэн ажилладаг вэ?',
    howItWorksSubtitle: 'Сурагчид бие биенээ хөгжүүлж, цаг хугацааны эрхээр үндэсний боловсролыг өсгөх тогтолцоо',
    step1Title: 'Спринт хичээлүүд (1-10 Суудал)',
    step1Desc: 'Өөрийн бүрэн эзэмшсэн сэдвээр (Кембрижийн математик, Пайтон тоглоом хөгжүүлэлт, Физикийн олимпиад) 1-3 долоо хоногийн богино спринт анги нээнэ.',
    step2Title: 'Бодит бүтээлээр баталгаажих',
    step2Desc: 'Зүгээр суусан цагаар оноо авахгүй. Спринтийн төгсгөлд сурагчид бодит код, бодсон бодлогын дэвтэр эсвэл судалгаагаа илгээж, ментор шалгаж баталгаажуулна.',
    step3Title: 'Бусдад заах & Албан ёсны зэрэг',
    step3Desc: 'Менторууд хичээл заах бүрт зэрэг ахиж (Дагалдан → Ахлах → Мастер → Үндэсний Лауреат), харин төгссөн сурагчид өөрсдөө дүү нартаа зориулж шинэ хичээл нээнэ!',

    // Featured Classes
    openClassesTitle: 'Нээлттэй спринт ангиуд',
    openClassesSub: 'Удахгүй эхлэх, сул суудалтай хичээлүүд',
    browseAllClasses: 'Бүх хичээлийг үзэх',
    viewClass: 'Хичээл рүү орох',
    seatsFilled: 'суудал захиалагдсан',
    seatLeft: 'суудал үлдсэн',
    seatsLeftPlural: 'суудал үлдсэн',
    classFull: 'Суудал дүүрсэн',

    // Formal Tiers
    tiersTitle: 'Менторын албан ёсны зэрэг дэв',
    tiersSub: 'Менторууд сурагчдыг чиглүүлж, бодит бүтээлийг баталгаажуулснаар их сургуулийн элсэлтэд үнэ цэнтэй албан ёсны батламж авна.',

    // Classes Directory
    classesTitle: 'Спринт хичээлүүдийн жагсаалт',
    classesSub: '1-3 долоо хоногийн эрчимжүүлсэн хичээлүүдээс сонгон, үе тэнгийн шилдэг ментороос суралцаарай.',
    searchPlaceholder: 'Сэдэв, хичээл, эсвэл менторын нэрээр хайх...',
    filterSubject: 'Хичээлийн төрөл',
    filterSize: 'Ангийн багтаамж',
    claimSeat: 'Суудал авах',
    enrolledBadge: 'Элссэн ✓',
    teachingBadge: 'Зааж буй',
    classSpaceBtn: 'Хичээлийн танхим',
    noClassesFound: 'Таны хайсан шалгуурт тохирох хичээл олдсонгүй',

    // Create Class
    createTitle: 'Спринт хичээл нээх',
    createSub: 'Өөрийн хамгийн сайн мэддэг сэдвээ сонгож, суудлын тоогоо (1-10) тохируулан дүү нартаа чин сэтгэлээсээ зааж өгөөрэй.',
    fieldTitle: 'Хичээлийн сэдэв, онцлох чиглэл *',
    fieldSubject: 'Хичээлийн салбар *',
    fieldCurriculum: 'Сургалтын хөтөлбөр *',
    fieldDesc: 'Спринтийн зорилго & Гаргах бодит бүтээл *',
    fieldSeats: 'Суудлын багтаамж (Ангийн хэмжээ)',
    fieldDuration: 'Үргэлжлэх хугацаа *',
    fieldStartDate: 'Эхлэх өдөр *',
    fieldEndDate: 'Дуусах өдөр *',
    fieldSchedule: 'Хичээлийн цагийн хуваарь *',
    fieldMeetingLink: 'Видео уулзалтын линк *',
    publishBtn: 'Спринт хичээлийг нийтэлж, суудал нээх',

    // Class Space
    joinVideoBtn: 'Видео хичээлд орох ↗',
    leadMentor: 'Чиглүүлэгч Ментор',
    sprintWindow: 'Хичээллэх хугацаа & Хуваарь',
    cohortStatus: 'Ангийн бүртгэлийн төлөв',
    tabDeliverables: 'Төслийн бүтээлүүд',
    tabRoster: 'Ангийн сурагчид',
    submitDeliverableTitle: 'Спринт бүтээлээ илгээх (Эзэмшсэний нотолгоо)',
    submitDeliverableDesc: 'Энэхүү спринтийг амжилттай дүүргэхийн тулд бодит бүтээлээ илгээнэ үү: GitHub кодын холбоос, бодсон бодлогын зураг, төслийн файл.',
    submitDeliverableBtn: 'Бүтээлээ шалгуулахаар илгээх',
    payItForwardTitle: 'Та энэ хичээлийг амжилттай эзэмшлээ! Дүү нартаа зааж түгээгээрэй.',
    payItForwardDesc: 'Таны хийсэн бүтээл ментороор баталгаажлаа. Та энэ сэдвийг бүрэн эзэмшсэн тул одоо өөрөө шинэ спринт анги нээж, 1-3 дүү нартаа зааж өгөх эрх нээгдлээ!',
    openClassBtn: 'Энэ сэдвээр хичээл нээж заах',
    mentorFeedbackLabel: 'Менторын сэтгэгдэл:',
    approveDeliverableBtn: 'Бүтээлийг шалгаж батлах',

    // Profile
    profileMyLearning: 'Миний суралцаж буй (Сурагчаар)',
    profileMyMentoring: 'Миний зааж буй (Ментороор)',
    canMentorLabel: 'Заах боломжтой сэдвүүд:',
    learningGoalsLabel: 'Суралцахыг хүсэж буй зорилтууд:',
    mentorXpLabel: 'Менторын XP',
    studentsTaughtLabel: 'Заасан сурагчид',
    enrolledClassesLabel: 'Элссэн хичээл',
    classesTeachingTitle: 'Таны зааж буй хичээлүүд',
    ministryCertsTitle: 'Боловсролын яамны баталгаажсан сертификатууд',
    ministryCertsSub: 'Дэлхийн их дээд сургуулиудад шалгагдах боломжтой криптограф гарын үсэгтэй сертификатууд.',

    // Verification
    certHeaderTitle: 'МЕНТОРШИЛ БА НИЙГМИЙН ТУСЫН БАТЛАМЖ',
    certSubTitle: 'ҮНДЭСНИЙ ҮЕ ТЭНГИЙН БОЛОВСРОЛЫН ХӨТӨЛБӨР',
    certVerifiedBadge: 'Криптограф баталгаажуулалттай албан ёсны сертификат',
    certPrintBtn: 'Хэвлэх / PDF хадгалах',
    certCertifiesThat: 'Энэхүү батламжаар гэрчлэх нь:',
    certValidSig: 'Хуурамчаар үйлдэх боломжгүй гарын үсэг баталгаажсан',

    // Ministry Audit
    auditTitle: 'Үндэсний академик мэдлэг шилжүүлэлтийн тайлан',
    auditSub: 'Сурагчдын манлайлалтай менторшил, 21 аймаг дахь хамрагдалт, боловсролын хүрдний нөлөөллийн бодит хяналт.',
    provincialReachTitle: 'Аймгуудын оролцоо ба мэдлэг шилжүүлэлт',
    deliverableAuditTitle: 'Бүтээлийн үнэн бодит байдлыг шалгах бүртгэл',
  },
};
