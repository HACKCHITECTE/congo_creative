import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, profilePictureUrl, job, city, email, whatsapp, portfolioUrl, behanceUrl, linkedinUrl, bio, availability, projects } = body;

    // Création du Talent et de ses projets en une seule transaction
    const newTalent = await prisma.talent.create({
      data: {
        fullName,
        profilePictureUrl,
        job,
        city,
        email,
        whatsapp,
        portfolioUrl,
        behanceUrl,
        linkedinUrl,
        bio,
        availability,
        globalScore: 0, // Score initial à 0 avant évaluation du jury
        projects: {
          create: projects.map((p: any) => ({
            title: p.title,
            description: p.description,
            mediaUrl: p.mediaUrl,
            processUrl: p.processUrl,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, talentId: newTalent.id });
  } catch (error: any) {
    console.error("Erreur soumission:", error);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement." }, { status: 500 });
  }
}