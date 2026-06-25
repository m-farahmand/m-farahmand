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

  const timelineEntries = [
    {
      year: 2018,
      title: "استارتاپ Robox — مدیر پروژه",
      description:
        "مدیریت تولید اسکوتر و طراحی مکانیکی. هماهنگی تیم‌های الکترونیک و نرم‌افزار با روش‌های Agile.",
      tags: "Agile,Hardware,Management",
      sortOrder: 1,
    },
    {
      year: 2019,
      title: "MonoChair — IoT و سیستم‌های تعبیه‌شده",
      description:
        "رهبری توسعه ویلچرهای الکترونیکی. برنامه‌نویسی میکروکنترلر STM32، پیاده‌سازی MQTT روی WiFi و کنترل موتور BLDC.",
      tags: "C++,STM32,MQTT,IoT",
      sortOrder: 2,
    },
    {
      year: 2020,
      title: "Tefas — مدیر محصول در بانک سینا",
      description:
        "رهبری ابتکارات محصول در بانکداری. معرفی Agile/Scrum، طراحی وایرفریم و بازبینی کد C# (.NET Core) و React.",
      tags: "Product Management,Banking,Agile",
      sortOrder: 3,
    },
    {
      year: 2021,
      title: "شرکت Taha — هم‌بنیان‌گذار و مهندس فول‌استک",
      description:
        "ساخت سیستم اتوماسیون هتل با Node.js (Strapi, PostgreSQL) و Vue.js. پیاده‌سازی خطوط DevOps با Jenkins.",
      tags: "Node.js,Vue.js,PostgreSQL,DevOps",
      sortOrder: 4,
    },
    {
      year: 2022,
      title: "میکروسرویس‌ها و سیستم‌های توزیع‌شده",
      description:
        "تمرکز عمیق بر معماری رویداد-محور، صف‌های پیام و الگوهای Cloud-Native با NestJS و Docker.",
      tags: "NestJS,Docker,Microservices",
      sortOrder: 5,
    },
    {
      year: 2023,
      title: "ML و سیستم‌های توزیع‌شده",
      description:
        "کاوش یکپارچه‌سازی یادگیری ماشین با سیستم‌های بک‌اند توزیع‌شده. تمرکز بر معماری‌های مقیاس‌پذیر و resilient.",
      tags: "ML,Distributed Systems,Cloud",
      sortOrder: 6,
    },
    {
      year: 2024,
      title: "زیرساخت کریپتو — توسعه‌دهنده بک‌اند",
      description:
        "ساخت زیرساخت توکن با میکروسرویس‌ها و معماری رویداد-محور. مدیریت ریسک با .NET Core و Protobuf.",
      tags: "C#,.NET Core,Protobuf,RabbitMQ",
      sortOrder: 7,
    },
    {
      year: 2025,
      title: "پلتفرم شخصی و محصولات",
      description:
        "ساخت پلتفرم شخصی برای نمایش مسیر حرفه‌ای، فروش محصولات نرم‌افزاری، اپلیکیشن‌ها و دستگاه‌های IoT.",
      tags: "Next.js,Platform,E-commerce",
      sortOrder: 8,
    },
  ];

  for (const entry of timelineEntries) {
    const existing = await prisma.timelineEntry.findFirst({
      where: { year: entry.year, sortOrder: entry.sortOrder },
    });
    if (existing) {
      await prisma.timelineEntry.update({
        where: { id: existing.id },
        data: entry,
      });
    } else {
      await prisma.timelineEntry.create({ data: entry });
    }
  }

  const products = [
    {
      name: "سوییت اتوماسیون هتل",
      slug: "hotel-automation-suite",
      description:
        "پلتفرم جامع اتوماسیون مدیریت هتل ساخته‌شده با Node.js و Vue.js. مدیریت رزرو، صورتحساب، housekeeping و گزارش‌گیری.",
      shortDesc: "اتوماسیون کامل مدیریت هتل",
      price: 299,
      type: "software",
      features:
        "مدیریت رزرو\nصورتحساب و فاکتور\nگردش کار housekeeping\nگزارش‌گیری لحظه‌ای\nپشتیبانی چند ملک",
      media: [{ url: "/products/hotel-suite.svg", type: "image" }],
    },
    {
      name: "پورتال آژانس مسافرتی",
      slug: "travel-agency-portal",
      description:
        "اپلیکیشن وب برای آژانس‌های مسافرتی جهت مدیریت رزرو، برنامه سفر و روابط مشتری با کیفیت مبتنی بر TDD.",
      shortDesc: "رزرو و مدیریت آژانس مسافرتی",
      price: 199,
      type: "app",
      features:
        "مدیریت رزرو\nسازنده برنامه سفر\nCRM مشتری\nپیگیری پرداخت\nآماده چندزبانه",
      media: [{ url: "/products/travel-portal.svg", type: "image" }],
    },
    {
      name: "کنترلر هوشمند ویلچر",
      slug: "smart-wheelchair-controller",
      description:
        "سیستم کنترل ویلچر IoT با میکروکنترلر STM32، اتصال MQTT و اپلیکیشن اندروید برای پایش از راه دور.",
      shortDesc: "کنترل IoT ویلچر با MQTT",
      price: 1499,
      type: "device",
      inventory: 10,
      features:
        "کنترل موتور مبتنی بر STM32\nMQTT روی WiFi\nرابط جوی‌استیک\nاپلیکیشن همراه اندروید\nپشتیبانی موتور BLDC",
      media: [{ url: "/products/wheelchair.svg", type: "image" }],
    },
  ];

  for (const product of products) {
    const { media, ...data } = product;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: data,
      create: {
        ...data,
        media: { create: media },
      },
    });
  }

  const blogPosts = [
    {
      title: "ساخت میکروسرویس‌های رویداد-محور با .NET",
      slug: "building-event-driven-microservices",
      excerpt:
        "درس‌هایی از ساخت زیرساخت توکن با صف‌های پیام و Protobuf.",
      content:
        "## مرور کلی\n\nمعماری رویداد-محور برای سیستم‌های بک‌اند مقیاس‌پذیر ضروری شده است.\n\n### نکات کلیدی\n\n- استفاده از صف پیام برای جداسازی\n- Protobuf برای سریال‌سازی کارآمد\n- طراحی برای شکست از روز اول\n\nاین مطلب الگوهایی را که در زیرساخت کریپتو تولیدی استفاده کردیم پوشش می‌دهد.",
    },
    {
      title: "از مونولیت به میکروسرویس: راهنمای عملی",
      slug: "monolith-to-microservices",
      excerpt:
        "رویکرد گام‌به‌گام برای تجزیه اپلیکیشن مونولیتیک به میکروسرویس‌ها.",
      content:
        "## چرا میکروسرویس؟\n\nوقتی سیستم شما از ظرفیت یک تیم فراتر می‌رود، میکروسرویس‌ها استقرار و مقیاس‌دهی مستقل را ارائه می‌دهند.\n\n### استراتژی مهاجرت\n\n1. شناسایی bounded contextها\n2. استخراج مستقل‌ترین ماژول اول\n3. پیاده‌سازی الگوی API gateway\n4. افزودن observability از ابتدا",
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
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
