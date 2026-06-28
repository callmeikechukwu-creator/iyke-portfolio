import { db as prisma } from "../src/lib/db";

async function main() {
  console.log("Seeding database testimonials...");

  // Clear existing testimonials
  await prisma.testimonial.deleteMany();

  const testimonials = [
    {
      clientName: "Bright Omoemi",
      role: "Head of Operations",
      company: "GOATC Education",
      quote: "The computer-based testing (CBT) platform built by Ikechukwu worked flawlessly. Its real-time WebSocket dashboard synchronized student metrics in sub-seconds and handled load with absolute stability.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150&q=80",
      order: 1,
    },
    {
      clientName: "Marcus Vance",
      role: "CTO & Co-Founder",
      company: "Veloce Technologies",
      quote: "Ikechukwu restructured our backend infrastructure and integrated Redis caching layers that cut our API latencies by over 60%. His execution is fast, structured, and extremely precise.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=150&h=150&q=80",
      order: 2,
    },
    {
      clientName: "Dr. Elizabeth Adeyemi",
      role: "Director of Software",
      company: "Apex Health Alliance",
      quote: "A world-class full-stack engineer who understands how to bridge rich, premium designs with robust backends. He delivered our media processing pipeline and Render/AWS staging on time.",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=150&h=150&q=80",
      order: 3,
    },
  ];

  for (const item of testimonials) {
    await prisma.testimonial.create({
      data: item,
    });
  }

  console.log("Successfully seeded testimonials!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
