import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Users, Clock, CheckCircle, ChevronRight, UserCircle } from 'lucide-react';

export const dynamic = 'force-dynamic'; // Pour ne pas cacher cette page

export default async function AdminDashboard() {
  // 1. Récupération des talents avec leurs projets et scores
  const talents = await prisma.talent.findMany({
    include: {
      projects: {
        include: {
          scores: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc', // Les plus récents en premier
    },
  });

  // 2. Calcul des statistiques
  const totalTalents = talents.length;
  const evaluatedTalents = talents.filter(t => 
    t.projects.some(p => p.scores.length > 0)
  ).length;
  const pendingTalents = totalTalents - evaluatedTalents;

  return (
    <div className="min-h-screen bg-primary text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* EN-TÊTE */}
        <div>
          <h1 className="text-4xl font-black mb-2">Dashboard Jury</h1>
          <p className="text-secondaryText">Gérez les évaluations et découvrez les nouveaux talents du Congo.</p>
        </div>

        {/* CARTES DE STATISTIQUES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-blue-500/10 p-4 rounded-full text-blue-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-secondaryText font-medium">Total Candidats</p>
              <p className="text-3xl font-black">{totalTalents}</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-yellow-500/10 p-4 rounded-full text-yellow-500">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-secondaryText font-medium">En Attente</p>
              <p className="text-3xl font-black">{pendingTalents}</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-green-500/10 p-4 rounded-full text-green-500">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-secondaryText font-medium">Évalués</p>
              <p className="text-3xl font-black">{evaluatedTalents}</p>
            </div>
          </div>
        </div>

        {/* LISTE DES CANDIDATS */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-neutral-800">
            <h2 className="text-xl font-bold">Dossiers Récents</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-secondaryText text-sm uppercase tracking-wider border-b border-neutral-800 bg-neutral-950/50">
                  <th className="py-4 px-6 font-medium">Candidat</th>
                  <th className="py-4 px-6 font-medium">Spécialité</th>
                  <th className="py-4 px-6 font-medium">Date de soumission</th>
                  <th className="py-4 px-6 font-medium">Statut</th>
                  <th className="py-4 px-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {talents.map((talent) => {
                  // On vérifie si au moins un projet a un score
                  const isEvaluated = talent.projects.some(p => p.scores.length > 0);
                  
                  return (
                    <tr key={talent.id} className="hover:bg-neutral-800/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {talent.profilePictureUrl ? (
                            <img src={talent.profilePictureUrl} alt="" className="size-10 rounded-full object-cover border border-neutral-700" />
                          ) : (
                            <UserCircle className="size-10 text-neutral-600" />
                          )}
                          <div>
                            <p className="font-bold text-white">{talent.fullName}</p>
                            <p className="text-xs text-secondaryText">{talent.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className="bg-neutral-800 px-3 py-1 rounded-full text-neutral-300">
                          {talent.job}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-secondaryText">
                        {new Date(talent.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-6">
                        {isEvaluated ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full">
                            <CheckCircle size={14} /> Noté ({talent.globalScore.toFixed(1)})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full">
                            <Clock size={14} /> En attente
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link 
                          href={`/admin/evaluer/${talent.id}`}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            isEvaluated 
                              ? "bg-neutral-800 text-white hover:bg-neutral-700" 
                              : "bg-accent text-primary hover:scale-105 shadow-lg shadow-accent/20"
                          }`}
                        >
                          {isEvaluated ? "Revoir" : "Évaluer"} <ChevronRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                
                {talents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-secondaryText">
                      Aucun candidat n'a encore soumis de projet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}