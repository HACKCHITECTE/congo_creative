import { Trophy, MapPin, ExternalLink, UserCircle, Medal } from 'lucide-react';
import prisma from '@/lib/prisma'; // 👈 On importe notre pont vers la BDD
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// La page devient asynchrone pour pouvoir "attendre" les données de la base
export default async function ClassementPage() {
  
  // 👈 REQUÊTE BASE DE DONNÉES NEON
  // On récupère les talents, triés par score décroissant, limité au Top 10
  const talents = await prisma.talent.findMany({
    orderBy: {
      globalScore: 'desc',
    },
    take: 10,
  });

  return (
    <div className="min-h-screen bg-primary pb-24">
      
      {/* HEADER */}
      <div className="bg-neutral-900/50 border-b border-neutral-800 pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center gap-4">
            <Trophy className="text-accent size-10" />
            Le Classement <span className="text-accent">Officiel</span>
          </h1>
          <p className="text-secondaryText text-lg max-w-2xl mx-auto">
            Découvrez les talents créatifs les mieux notés du Congo. Ce classement est généré de manière stricte par notre algorithme et notre jury d'experts.
          </p>
        </div>
      </div>

      {/* TABLEAU */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950/80 text-secondaryText text-sm uppercase tracking-wider border-b border-neutral-800">
                  <th className="py-4 px-6 font-semibold">Rang</th>
                  <th className="py-4 px-6 font-semibold">Talent</th>
                  <th className="py-4 px-6 font-semibold">Spécialité</th>
                  <th className="py-4 px-6 font-semibold">Localisation</th>
                  <th className="py-4 px-6 font-semibold text-right">Score Global</th>
                  <th className="py-4 px-6 font-semibold text-center">Portfolio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {/* On vérifie s'il y a des talents. Si la BDD est vide, on affiche un message. */}
                {talents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-secondaryText">
                      Aucun talent n'a encore été évalué. Soyez le premier à soumettre un projet !
                    </td>
                  </tr>
                ) : (
                  // On boucle sur les vraies données de Neon
                  talents.map((talent, index) => {
                    const rank = index + 1; // Le rang est calculé par rapport à la position
                    return (
                      <tr key={talent.id} className="hover:bg-neutral-800/50 transition-colors group">
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center size-8 rounded-full bg-neutral-800 text-white font-bold group-hover:bg-accent group-hover:text-primary transition-colors">
                            {rank === 1 ? <Medal className="size-4" /> : rank}
                          </div>
                        </td>
                        
                        <td className="py-4 px-6 font-bold text-lg text-white">
                        
                          {/* 👇 NOUVEAU : AJOUT DE L'AVATAR 👇 */}
                          <Link href={`/talent/${talent.id}`} className="hover:text-accent transition-colors flex items-center gap-3">
                          {talent.profilePictureUrl ? (
                          <img src={talent.profilePictureUrl} alt={talent.fullName} className="size-9 rounded-full object-cover border-2 border-neutral-800" />
                            ) : (
                            <UserCircle className="size-9 text-neutral-700" strokeWidth={1.5} />
                            )}
                          {talent.fullName}
                          </Link>
                        </td>
                        
                        <td className="py-4 px-6">
                          <span className="bg-neutral-800 text-neutral-300 text-xs px-3 py-1 rounded-full font-medium">
                            {talent.job}
                          </span>
                        </td>
                        
                        <td className="py-4 px-6 text-secondaryText flex items-center gap-1.5 mt-2">
                          <MapPin className="size-4" /> {talent.city}
                        </td>
                        
                        <td className="py-4 px-6 text-right font-black text-accent text-xl">
                          {talent.globalScore.toFixed(1)}
                        </td>
                        
                        <td className="py-4 px-6 text-center">
                          <a href={talent.portfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2 rounded-lg bg-neutral-800 text-secondaryText hover:text-white hover:bg-neutral-700 transition-all">
                            <ExternalLink className="size-4" />
                          </a>
                        </td>
                        
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}