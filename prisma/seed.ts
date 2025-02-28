import { PrismaClient } from '@prisma/client';
import { SponsorType } from '@prisma/client';
const prisma = new PrismaClient();

const sponsors = [
  {
    name: 'A1',
    color: '#ff2524',
    type: SponsorType.GOLD,
    description:
      'А1 България е водещ доставчик на дигитални услуги и телекомуникационни решения, който свързва хора, бизнеси и устройства, за да помогне на клиентите да се възползват от дигиталните технологии. Компанията предоставя мобилни и фиксирани услуги, високоскоростен интернет, интерактивна, цифрова, сателитна и мобилна телевизия, четири собствени спортни канала с марката MAX Sport, платежни услуги, ICT, cloud и IoT бизнес решения. А1 има дълга история на технологичен пионер в страната от осъществяването на първия разговор по GSM и изпращането на първия SMS до старта на първата 5G мрежа, която осигурява гигабитови скорости на клиентите. Днес близо 3 600 служители и модерна телекомуникационна и ICT инфраструктура осигуряват достъп до дигитални технологии за потребителите и бизнеса, свързвайки хора, неща и локации.',
    logo: 'a1.png',
    website: 'https://www.a1.bg/bg',
  },
  {
    name: 'Astea',
    color: '#59c414',
    type: SponsorType.SILVER,
    description:
      'Astea е водещ експерт в софтуерното консултиране и разработката на персонализирани технологични решения. През последните 19 години компанията се е наложила като надежден партньор за клиентите си по целия свят и е активна в разнообразни сектори, вариращи от финансови услуги и електронна търговия до здравеопазване и образование. А успехите идват благодарение на енергичните астейци – специалисти от всички области на софтуерното инженерство, обединени около общата цел да намират точните решения сред многообразието от технологии.',
    logo: 'astea.png',
    website: 'https://asteasolutions.com/',
  },
  {
    name: 'Endurosat',
    color: '#1d8bcb',
    type: SponsorType.GOLD,
    description:
      'Мисията на ЕндуроСат е да направи Космосът по-достъпен за всички. Компанията проектира, създава и управлява сателити от ново поколение, които да служат на бизнеса, за изследователски цели и научни екипи. Също така предоставя единствената по рода си „Космос като услуга“ (space as a service), базирана на собствените си софтуерно-дефинирани сателити. ЕндуроСат е една от най-бързо растящите космически компании в Европа. Горд член на Международната федерация по астронавтика (IAF) и мрежата Endeavor, екипът на ЕндуроСат надхвърля 230 талантливи разработчици, инженери и учени, като в момента обслужва повече от 350 клиенти по света. Клиентите им включват комерсиални космически компании, фокусирани върху IoT, дистанционно наблюдение, метеорология и наблюдение на Земята, както и изследователски организации, включително космически агенции, университети и институти.',
    logo: 'endurosat.png',
    website: 'https://www.endurosat.com/',
  },
  {
    name: 'Experian',
    color: '#004f9a',
    type: SponsorType.SILVER,
    description:
      'Experian е глобална компания за данни и технологии, която предоставя иновативни решения, които помагат на потребители и бизнеси по цял свят да управляват по-добре своите финанси. С повече от 20 години опит в България, компанията е ключов център за обработка на данни и разработка на софтуерни решения. Част от портфолиото им включва решения като софтуери за автоматизирано вземане на решения, защита от кражба на самоличността и онлайн измами, както и решения за оценка на кредитния риск. Компанията разполага с над 1000 служители в България и вярва, че благосъстоянието на екипа е ключово за успеха на бизнеса. В подкрепа на това Experian предлага широк набор от модерни социални придобивки и програми за професионално развитие, като утвърждава, че тези практики подобряват служителската ангажираност и резултатите на компанията.',
    logo: 'experian.png',
    website: 'https://www.experian.bg/',
  },
  {
    name: 'Hacksoft',
    color: '#f89724',
    type: SponsorType.GOLD,
    description:
      'HackSoft е българска софтуерна компания, която се занимава с „end-to-end“ софтуерна разработка. Компанията се стреми да създава софтуерни решения, които отговарят на нуждите на клиентите, като същевременно осигурява среда, в която екипът ѝ се развива, надгражда уменията си и се чувства ценен. Идеята за HackSoft се ражда именно в сградата на ФМИ, а много от служителите са негови възпитаници. За тях е чест да подкрепят мястото, което им е дало толкова много.',
    logo: 'hacksoft.png',
    website: 'https://www.hacksoft.io/',
  },
  {
    name: 'Hypoport',
    color: '#f89724',
    type: SponsorType.SILVER,
    description:
      'Hypoport Sofia is the Bulgaria based company within the Hypoport Group – a network of technology companies for the credit, real estate and insurance industries. As part of a powerful network, we are revolutionizing financial markets. We use our skills, talents and technologies to ensure that every person can make the most of their financial opportunities and create innovations for financial freedom, security and shaping the future. Our digital platforms and services connect the offerings of the credit, real estate and insurance industries with the needs of our customers: simple, secure, transparent and fair. We are one of the market leaders in the FinTech industry in Germany and are proud of a network of more than 20 autonomous subsidiaries with around 2,500 colleagues.',
    logo: 'hypoport.png',
    website: 'https://www.hypoport.bg/',
  },
  {
    name: 'Milestone',
    color: '#009bda',
    type: SponsorType.SILVER,
    description:
      'Milestone Systems стартира през 1998 г. в Дания. Днес сме сред лидерите в производството на софтуер за видеомениджмънт и IP-базирано видеонаблюдение. Представени сме в над 25 държави. В София се намира вторият ни по големина център за развойна дейност. Всички офиси на Milestone Systems носят свободолюбив скандинавски дух и култура на откритост, която насърчава раждането на иновации. Основната ни цел е да бъдем част от всяка видео инсталация в света, като с това помагаме на бизнесите и организациите да защитават хората и активите си, както и да оптимизират и развият своите бизнес процеси. За да постигнем това, постоянно усъвършенстваме и развиваме нашата платформа за видеотехнологии с отворен код.',
    logo: 'milestone.png',
    website: 'https://www.milestonesys.com/',
  },
  {
    name: 'Raven',
    color: '#fffff4',
    type: SponsorType.GOLD,
    description:
      'RAVEN is a cutting-edge algorithmic trading firm specializing in high-frequency trading across the digital asset space. We focus on market making and liquidity provision, ensuring seamless price discovery and efficient markets on both blockchains and centralized exchanges. By leveraging advanced low-latency systems and high-performance infrastructure, RAVEN enhances market efficiency and stability. With a commitment to continuous technological innovation, we push the boundaries of quantitative trading and blockchain integration. Bulgaria is our home. The global crypto market is our playground - 24/7/365.',
    logo: 'raven.png',
    website: 'https://www.ravendao.net/',
  },
  {
    name: 'SAP',
    color: '#00b8f1',
    type: SponsorType.GOLD,
    description:
      'SAP Labs България е българският развоен център на софтуерния гигант SAP, където над 1800 професионалисти работят върху ключови проекти и облачни решения за компанията. Признат като стратегическа локация и сърце на технологичния хъб на SAP за югоизточна Европа, SAP Labs България вече 9 пъти получава отличието „Най-добър работодател“ в България.',
    logo: 'sap.png',
    website: 'https://www.sap.com/',
  },
  {
    name: 'Sourcelab',
    color: '#f9a21c',
    type: SponsorType.BRONZE,
    description:
      'At Sourcelab, we define ourselves as a hub for software craftsmanship. Together we are part of the never-ending journey to improve ourselves and inspire others along the way. We believe that writing code is the easiest part of the process. Understanding the business value and doing what is most important at the moment makes a difference.',
    logo: 'sourcelab.png',
    website: 'https://sourcelab.eu/',
  },
  {
    name: 'Wiser',
    color: '#1414a0',
    type: SponsorType.GOLD,
    description:
      'Wiser Technology е една от най-бързо развиващите се български софтуерни компании, публично търгувана на Българската фондова борса (БФБ: WISR). С екип от над 600 софтуерни инженери и консултанти в България, Сърбия и Гърция, ние предоставяме ИТ консултиране, разработване и внедряване на софтуерни системи. В Wiser ценим хората, тяхното мнение и желание за растеж, насърчаваме споделянето на идеи и отворена комуникация. Работим по високотехнологични и предизвикателни решения за водещите световни марки в автомобилостроенето, комуникациите, финансовата сфера и отбранителната индустрия. Сред клиентите ни са Airbus, Leonardo, UniCredit, Nokia, Bosch, AT&T, а сред технологичните ни партньори – IBM, Amazon, Google, Microsoft и SAP.',
    logo: 'wiser.png',
    website: 'https://wisertech.com/',
  },
];

async function main() {
  for (const sponsor of sponsors) {
    await prisma.sponsor.create({ data: sponsor });
  }
  console.log('Sponsors inserted successfully!');
}

main()
  .catch((e) => {
    console.error('Error inserting sponsors:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
