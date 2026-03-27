import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.talent.createMany({
      data: [
        { fullName: "Jean Mukendi", job: "Motion Designer", city: "Brazzaville", whatsapp: "060000000", email: "jean@test.com", portfolioUrl: "https://behance.net/jean", globalScore: 92.5, availability: "Freelance" },
        { fullName: "Sarah Nguesso", job: "Directrice Artistique", city: "Pointe-Noire", whatsapp: "060000001", email: "sarah@test.com", portfolioUrl: "https://dribbble.com/sarah", globalScore: 89.0, availability: "CDI" },
        { fullName: "Marc Kimbangou", job: "UI/UX Designer", city: "Brazzaville", whatsapp: "060000002", email: "marc@test.com", portfolioUrl: "https://behance.net/marc", globalScore: 85.5, availability: "Projet" },
      ],
      skipDuplicates: true, // Évite les erreurs si tu cliques deux fois
    });
    
    return NextResponse.json({ message: "Succès ! 3 talents injectés dans Neon." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de l'injection." }, { status: 500 });
  }
}