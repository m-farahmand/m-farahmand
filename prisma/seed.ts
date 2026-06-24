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
      title: "Robox Startup — Project Manager",
      description:
        "Managed scooter production and mechanical design. Coordinated electronics and software teams using Agile practices.",
      tags: "Agile,Hardware,Management",
      sortOrder: 1,
    },
    {
      year: 2019,
      title: "MonoChair — IoT & Embedded Systems",
      description:
        "Led development of electronic wheelchairs. Programmed STM32 microcontrollers, implemented MQTT over WiFi, and controlled BLDC motors.",
      tags: "C++,STM32,MQTT,IoT",
      sortOrder: 2,
    },
    {
      year: 2020,
      title: "Tefas — Product Manager at Sinaa Bank",
      description:
        "Led product initiatives in banking. Introduced Agile/Scrum, designed wireframes, and reviewed C# (.NET Core) and React code.",
      tags: "Product Management,Banking,Agile",
      sortOrder: 3,
    },
    {
      year: 2021,
      title: "Taha Company — Co-Founder & Full-Stack Engineer",
      description:
        "Built hotel automation system with Node.js (Strapi, PostgreSQL) and Vue.js. Implemented Jenkins DevOps pipelines.",
      tags: "Node.js,Vue.js,PostgreSQL,DevOps",
      sortOrder: 4,
    },
    {
      year: 2022,
      title: "Microservices & Distributed Systems",
      description:
        "Deep dive into event-driven architecture, messaging queues, and cloud-native patterns with NestJS and Docker.",
      tags: "NestJS,Docker,Microservices",
      sortOrder: 5,
    },
    {
      year: 2023,
      title: "ML & Distributed Systems",
      description:
        "Explored machine learning integration with distributed backend systems. Focus on scalable, resilient architectures.",
      tags: "ML,Distributed Systems,Cloud",
      sortOrder: 6,
    },
    {
      year: 2024,
      title: "Crypto Infrastructure — Backend Developer",
      description:
        "Built token infrastructure using microservices and event-driven architecture. Risk management with .NET Core and Protobuf.",
      tags: "C#,.NET Core,Protobuf,RabbitMQ",
      sortOrder: 7,
    },
    {
      year: 2025,
      title: "Personal Platform & Products",
      description:
        "Building a personal platform to showcase journey, sell software products, apps, and IoT devices.",
      tags: "Next.js,Platform,E-commerce",
      sortOrder: 8,
    },
  ];

  for (const entry of timelineEntries) {
    const existing = await prisma.timelineEntry.findFirst({
      where: { year: entry.year, title: entry.title },
    });
    if (!existing) {
      await prisma.timelineEntry.create({ data: entry });
    }
  }

  const products = [
    {
      name: "Hotel Automation Suite",
      slug: "hotel-automation-suite",
      description:
        "A complete hotel management automation platform built with Node.js and Vue.js. Handles reservations, billing, housekeeping, and reporting.",
      shortDesc: "Full-stack hotel management automation",
      price: 299,
      type: "software",
      features:
        "Reservation management\nBilling & invoicing\nHousekeeping workflow\nReal-time reporting\nMulti-property support",
      media: [{ url: "/products/hotel-suite.svg", type: "image" }],
    },
    {
      name: "Travel Agency Portal",
      slug: "travel-agency-portal",
      description:
        "Web application for travel agencies to manage bookings, itineraries, and customer relationships with TDD-driven quality.",
      shortDesc: "Travel agency booking & management",
      price: 199,
      type: "app",
      features:
        "Booking management\nItinerary builder\nCustomer CRM\nPayment tracking\nMulti-language ready",
      media: [{ url: "/products/travel-portal.svg", type: "image" }],
    },
    {
      name: "Smart Wheelchair Controller",
      slug: "smart-wheelchair-controller",
      description:
        "IoT-enabled wheelchair control system with STM32 microcontroller, MQTT connectivity, and Android companion app for remote monitoring.",
      shortDesc: "IoT wheelchair control with MQTT",
      price: 1499,
      type: "device",
      inventory: 10,
      features:
        "STM32-based motor control\nMQTT over WiFi\nJoystick interface\nAndroid companion app\nBLDC motor support",
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
      title: "Building Event-Driven Microservices with .NET",
      slug: "building-event-driven-microservices",
      excerpt:
        "Lessons learned from building token infrastructure with messaging queues and Protobuf.",
      content:
        "## Overview\n\nEvent-driven architecture has become essential for scalable backend systems.\n\n### Key Takeaways\n\n- Use messaging queues for decoupling\n- Protobuf for efficient serialization\n- Design for failure from day one\n\nThis post covers patterns we used in production crypto infrastructure.",
    },
    {
      title: "From Monolith to Microservices: A Practical Guide",
      slug: "monolith-to-microservices",
      excerpt:
        "A step-by-step approach to decomposing a monolithic application into microservices.",
      content:
        "## Why Microservices?\n\nWhen your system grows beyond a single team's capacity, microservices offer independent deployment and scaling.\n\n### Migration Strategy\n\n1. Identify bounded contexts\n2. Extract the most independent module first\n3. Implement API gateway pattern\n4. Add observability early",
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
