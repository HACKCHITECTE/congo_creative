import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Extraction des données
    const { 
      talentId, 
      projectId,
      originality,
      aesthetic,
      finish,
      toolMastery,
      complexity,
      organization,
      potential,
      presentation,
      engagement,
      publicVote,
      finalScore 
    } = body;

    // 2. Gestion de l'utilisateur Admin (Jury)
    let adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: "admin@congoindex.com",
          name: "Jury Principal",
          role: "ADMIN"
        }
      });
    }

    // 3. Enregistrement unique du score détaillé
    // J'ai supprimé le doublon ici pour n'avoir qu'une seule insertion
    await prisma.score.create({
      data: {
        projectId,
        juryId: adminUser.id,
        originality,
        aesthetic,
        finish,
        toolMastery,
        complexity,
        organization,
        potential,
        presentation,
        engagement,
        publicVote,
        finalScore, 
      }
    });

    // 4. On récupère TOUTES les notes de TOUS les projets de ce talent pour la moyenne
    const allScores = await prisma.score.findMany({
      where: { 
        project: { 
          talentId: talentId 
        } 
      },
      select: { 
        finalScore: true 
      }
    });

    // 5. Calcul de la moyenne arithmétique
    const sum = allScores.reduce((acc, s) => acc + s.finalScore, 0);
    const average = allScores.length > 0 ? sum / allScores.length : 0;

    // 6. Mise à jour de la note globale du Talent
    await prisma.talent.update({
      where: { id: talentId },
      data: { 
        globalScore: average 
      }
    });

    // 7. Rafraîchissement du cache pour les pages publiques
    revalidatePath('/classement');
    revalidatePath('/admin');
    revalidatePath(`/talent/${talentId}`);

    // ✅ FIX : On utilise "average" et non "globalAverage"
    return NextResponse.json({ success: true, newScore: average });
    
  } catch (error: any) {
    console.error("ERREUR DÉTAILLÉE API SCORE:", error); 
    return NextResponse.json({ 
      error: "Erreur lors de l'enregistrement.", 
      details: error.message 
    }, { status: 500 });
  }
}