import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const talent = await prisma.talent.findUnique({
      where: { id },
      include: { projects: true }
    });

    if (!talent) {
      return NextResponse.json({ error: "Talent introuvable" }, { status: 404 });
    }

    return NextResponse.json(talent);
  } catch (error) {
    console.error("Erreur API Talent:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}