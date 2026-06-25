import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@farahmand.dev";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, role: "admin" },
  });

  await prisma.blogPost.deleteMany({ where: { slug: "" } });

  const timelineEntries = [
    {
      year: 2018,
      sortOrder: 1,
      translations: {
        fa: {
          title: "استارتاپ Robox — مدیر پروژه",
          description:
            "مدیریت تولید اسکوتر و طراحی مکانیکی. هماهنگی تیم‌های الکترونیک و نرم‌افزار با روش‌های Agile.",
          tags: "Agile,Hardware,Management",
        },
        en: {
          title: "Robox Startup — Project Manager",
          description:
            "Managed scooter production and mechanical design. Coordinated electronics and software teams using Agile practices.",
          tags: "Agile,Hardware,Management",
        },
      },
    },
    {
      year: 2019,
      sortOrder: 2,
      translations: {
        fa: {
          title: "MonoChair — IoT و سیستم‌های تعبیه‌شده",
          description:
            "رهبری توسعه ویلچرهای الکترونیکی. برنامه‌نویسی میکروکنترلر STM32، پیاده‌سازی MQTT روی WiFi و کنترل موتور BLDC.",
          tags: "C++,STM32,MQTT,IoT",
        },
        en: {
          title: "MonoChair — IoT & Embedded Systems",
          description:
            "Led development of electronic wheelchairs. Programmed STM32 microcontrollers, implemented MQTT over WiFi, and controlled BLDC motors.",
          tags: "C++,STM32,MQTT,IoT",
        },
      },
    },
    {
      year: 2020,
      sortOrder: 3,
      translations: {
        fa: {
          title: "Tefas — مدیر محصول در بانک سینا",
          description:
            "رهبری ابتکارات محصول در بانکداری. معرفی Agile/Scrum، طراحی وایرفریم و بازبینی کد C# (.NET Core) و React.",
          tags: "Product Management,Banking,Agile",
        },
        en: {
          title: "Tefas — Product Manager at Sinaa Bank",
          description:
            "Led product initiatives in banking. Introduced Agile/Scrum, designed wireframes, and reviewed C# (.NET Core) and React code.",
          tags: "Product Management,Banking,Agile",
        },
      },
    },
    {
      year: 2021,
      sortOrder: 4,
      translations: {
        fa: {
          title: "شرکت Taha — هم‌بنیان‌گذار و مهندس فول‌استک",
          description:
            "ساخت سیستم اتوماسیون هتل با Node.js (Strapi, PostgreSQL) و Vue.js. پیاده‌سازی خطوط DevOps با Jenkins.",
          tags: "Node.js,Vue.js,PostgreSQL,DevOps",
        },
        en: {
          title: "Taha Company — Co-Founder & Full-Stack Engineer",
          description:
            "Built hotel automation system with Node.js (Strapi, PostgreSQL) and Vue.js. Implemented Jenkins DevOps pipelines.",
          tags: "Node.js,Vue.js,PostgreSQL,DevOps",
        },
      },
    },
    {
      year: 2022,
      sortOrder: 5,
      translations: {
        fa: {
          title: "میکروسرویس‌ها و سیستم‌های توزیع‌شده",
          description:
            "تمرکز عمیق بر معماری رویداد-محور، صف‌های پیام و الگوهای Cloud-Native با NestJS و Docker.",
          tags: "NestJS,Docker,Microservices",
        },
        en: {
          title: "Microservices & Distributed Systems",
          description:
            "Deep dive into event-driven architecture, messaging queues, and cloud-native patterns with NestJS and Docker.",
          tags: "NestJS,Docker,Microservices",
        },
      },
    },
    {
      year: 2023,
      sortOrder: 6,
      translations: {
        fa: {
          title: "ML و سیستم‌های توزیع‌شده",
          description:
            "کاوش یکپارچه‌سازی یادگیری ماشین با سیستم‌های بک‌اند توزیع‌شده. تمرکز بر معماری‌های مقیاس‌پذیر و resilient.",
          tags: "ML,Distributed Systems,Cloud",
        },
        en: {
          title: "ML & Distributed Systems",
          description:
            "Explored machine learning integration with distributed backend systems. Focus on scalable, resilient architectures.",
          tags: "ML,Distributed Systems,Cloud",
        },
      },
    },
    {
      year: 2024,
      sortOrder: 7,
      translations: {
        fa: {
          title: "زیرساخت کریپتو — توسعه‌دهنده بک‌اند",
          description:
            "ساخت زیرساخت توکن با میکروسرویس‌ها و معماری رویداد-محور. مدیریت ریسک با .NET Core و Protobuf.",
          tags: "C#,.NET Core,Protobuf,RabbitMQ",
        },
        en: {
          title: "Crypto Infrastructure — Backend Developer",
          description:
            "Built token infrastructure using microservices and event-driven architecture. Risk management with .NET Core and Protobuf.",
          tags: "C#,.NET Core,Protobuf,RabbitMQ",
        },
      },
    },
    {
      year: 2025,
      sortOrder: 8,
      translations: {
        fa: {
          title: "پلتفرم شخصی و محصولات",
          description:
            "ساخت پلتفرم شخصی برای نمایش مسیر حرفه‌ای، فروش محصولات نرم‌افزاری، اپلیکیشن‌ها و دستگاه‌های IoT.",
          tags: "Next.js,Platform,E-commerce",
        },
        en: {
          title: "Personal Platform & Products",
          description:
            "Building a personal platform to showcase journey, sell software products, apps, and IoT devices.",
          tags: "Next.js,Platform,E-commerce",
        },
      },
    },
  ];

  for (const entry of timelineEntries) {
    for (const [lang, data] of Object.entries(entry.translations)) {
      await prisma.timelineEntry.upsert({
        where: {
          year_sortOrder_lang: {
            year: entry.year,
            sortOrder: entry.sortOrder,
            lang,
          },
        },
        create: {
          year: entry.year,
          sortOrder: entry.sortOrder,
          lang,
          ...data,
        },
        update: data,
      });
    }
  }

  const products = [
    {
      slug: "hotel-automation-suite",
      price: 299,
      type: "software",
      media: [{ url: "/products/hotel-suite.svg", type: "image" }],
      translations: {
        fa: {
          name: "سوییت اتوماسیون هتل",
          description:
            "پلتفرم جامع اتوماسیون مدیریت هتل ساخته‌شده با Node.js و Vue.js. مدیریت رزرو، صورتحساب، housekeeping و گزارش‌گیری.",
          shortDesc: "اتوماسیون کامل مدیریت هتل",
          features:
            "مدیریت رزرو\nصورتحساب و فاکتور\nگردش کار housekeeping\nگزارش‌گیری لحظه‌ای\nپشتیبانی چند ملک",
        },
        en: {
          name: "Hotel Automation Suite",
          description:
            "A complete hotel management automation platform built with Node.js and Vue.js. Handles reservations, billing, housekeeping, and reporting.",
          shortDesc: "Full-stack hotel management automation",
          features:
            "Reservation management\nBilling & invoicing\nHousekeeping workflow\nReal-time reporting\nMulti-property support",
        },
      },
    },
    {
      slug: "travel-agency-portal",
      price: 199,
      type: "app",
      media: [{ url: "/products/travel-portal.svg", type: "image" }],
      translations: {
        fa: {
          name: "پورتال آژانس مسافرتی",
          description:
            "اپلیکیشن وب برای آژانس‌های مسافرتی جهت مدیریت رزرو، برنامه سفر و روابط مشتری با کیفیت مبتنی بر TDD.",
          shortDesc: "رزرو و مدیریت آژانس مسافرتی",
          features:
            "مدیریت رزرو\nسازنده برنامه سفر\nCRM مشتری\nپیگیری پرداخت\nآماده چندزبانه",
        },
        en: {
          name: "Travel Agency Portal",
          description:
            "Web application for travel agencies to manage bookings, itineraries, and customer relationships with TDD-driven quality.",
          shortDesc: "Travel agency booking & management",
          features:
            "Booking management\nItinerary builder\nCustomer CRM\nPayment tracking\nMulti-language ready",
        },
      },
    },
    {
      slug: "smart-wheelchair-controller",
      price: 1499,
      type: "device",
      inventory: 10,
      media: [{ url: "/products/wheelchair.svg", type: "image" }],
      translations: {
        fa: {
          name: "کنترلر هوشمند ویلچر",
          description:
            "سیستم کنترل ویلچر IoT با میکروکنترلر STM32، اتصال MQTT و اپلیکیشن اندروید برای پایش از راه دور.",
          shortDesc: "کنترل IoT ویلچر با MQTT",
          features:
            "کنترل موتور مبتنی بر STM32\nMQTT روی WiFi\nرابط جوی‌استیک\nاپلیکیشن همراه اندروید\nپشتیبانی موتور BLDC",
        },
        en: {
          name: "Smart Wheelchair Controller",
          description:
            "IoT-enabled wheelchair control system with STM32 microcontroller, MQTT connectivity, and Android companion app for remote monitoring.",
          shortDesc: "IoT wheelchair control with MQTT",
          features:
            "STM32-based motor control\nMQTT over WiFi\nJoystick interface\nAndroid companion app\nBLDC motor support",
        },
      },
    },
  ];

  for (const product of products) {
    const { media, translations, ...shared } = product;

    for (const [lang, data] of Object.entries(translations)) {
      const record = await prisma.product.upsert({
        where: { slug_lang: { slug: shared.slug, lang } },
        create: {
          slug: shared.slug,
          lang,
          price: shared.price,
          type: shared.type,
          inventory: "inventory" in shared ? shared.inventory : null,
          ...data,
        },
        update: {
          price: shared.price,
          type: shared.type,
          inventory: "inventory" in shared ? shared.inventory : null,
          ...data,
        },
      });

      if (lang === "fa" && media) {
        await prisma.productMedia.deleteMany({ where: { productId: record.id } });
        await prisma.productMedia.createMany({
          data: media.map((item) => ({ ...item, productId: record.id })),
        });
      }
    }
  }

  const blogPosts = [
    {
      slug: "building-event-driven-microservices",
      translations: {
        fa: {
          title: "ساخت میکروسرویس‌های رویداد-محور با .NET",
          excerpt:
            "درس‌هایی از ساخت زیرساخت توکن با صف‌های پیام و Protobuf.",
          content:
            "## مرور کلی\n\nمعماری رویداد-محور برای سیستم‌های بک‌اند مقیاس‌پذیر ضروری شده است.\n\n### نکات کلیدی\n\n- استفاده از صف پیام برای جداسازی\n- Protobuf برای سریال‌سازی کارآمد\n- طراحی برای شکست از روز اول\n\nاین مطلب الگوهایی را که در زیرساخت کریپتو تولیدی استفاده کردیم پوشش می‌دهد.",
        },
        en: {
          title: "Building Event-Driven Microservices with .NET",
          excerpt:
            "Lessons learned from building token infrastructure with messaging queues and Protobuf.",
          content:
            "## Overview\n\nEvent-driven architecture has become essential for scalable backend systems.\n\n### Key Takeaways\n\n- Use messaging queues for decoupling\n- Protobuf for efficient serialization\n- Design for failure from day one\n\nThis post covers patterns we used in production crypto infrastructure.",
        },
      },
    },
    {
      slug: "monolith-to-microservices",
      translations: {
        fa: {
          title: "از مونولیت به میکروسرویس: راهنمای عملی",
          excerpt:
            "رویکرد گام‌به‌گام برای تجزیه اپلیکیشن مونولیتیک به میکروسرویس‌ها.",
          content:
            "## چرا میکروسرویس؟\n\nوقتی سیستم شما از ظرفیت یک تیم فراتر می‌رود، میکروسرویس‌ها استقرار و مقیاس‌دهی مستقل را ارائه می‌دهند.\n\n### استراتژی مهاجرت\n\n1. شناسایی bounded contextها\n2. استخراج مستقل‌ترین ماژول اول\n3. پیاده‌سازی الگوی API gateway\n4. افزودن observability از ابتدا",
        },
        en: {
          title: "From Monolith to Microservices: A Practical Guide",
          excerpt:
            "A step-by-step approach to decomposing a monolithic application into microservices.",
          content:
            "## Why Microservices?\n\nWhen your system grows beyond a single team's capacity, microservices offer independent deployment and scaling.\n\n### Migration Strategy\n\n1. Identify bounded contexts\n2. Extract the most independent module first\n3. Implement API gateway pattern\n4. Add observability early",
        },
      },
    },
  ];

  for (const post of blogPosts) {
    for (const [lang, data] of Object.entries(post.translations)) {
      await prisma.blogPost.upsert({
        where: { slug_lang: { slug: post.slug, lang } },
        create: {
          slug: post.slug,
          lang,
          published: true,
          ...data,
        },
        update: {
          published: true,
          ...data,
        },
      });
    }
  }

  console.log("Seed completed successfully");
  console.log(`Admin login: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
