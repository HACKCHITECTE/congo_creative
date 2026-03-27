import { MapPin, Globe, MessageCircle, ArrowLeft, Star, UserCircle, Linkedin, LayoutTemplate, PlaySquare } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProjectGallery from '@/components/ProjectGallery';


// On définit le type des params comme une Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TalentProfile({ params }: PageProps) {
  // 1️⃣ C'est ici que ça se joue : on attend la résolution des params
  const { id } = await params;

  // 2️⃣ Maintenant que l'ID est bien récupéré, on interroge la BDD
  const talent = await prisma.talent.findUnique({
    where: { id: id }, // Plus d'undefined ici !
    include: { projects: true }
  });

  if (!talent) return notFound();

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* BARRE DE RETOUR */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link href="/classement" className="text-secondaryText hover:text-accent flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> Retour au classement
        </Link>
      </div>

      <main className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12 pb-24">
        
        {/* COLONNE GAUCHE : INFOS GÉNÉRALES */}
        <div className="space-y-8">
          <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 border-t-4 border-t-accent">

            {/* 👇 NOUVEAU : ZONE PHOTO DE PROFIL 👇 */}
          <div className="flex justify-center mb-6">
            {talent.profilePictureUrl ? (
              <img src={talent.profilePictureUrl} alt={talent.fullName} className="size-32 rounded-full object-cover border-4 border-neutral-800 shadow-xl" />
            ) : (
              <UserCircle className="size-32 text-neutral-700 mx-auto" strokeWidth={1} />
            )}
          </div>
          
            <h1 className="text-3xl font-black mb-2">{talent.fullName}</h1>
            <p className="text-accent font-bold uppercase tracking-widest text-sm mb-6">{talent.job}</p>
            
            <div className="space-y-4 text-secondaryText">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-accent" /> {talent.city}
              </div>
  
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-green-500" /> 
                <a href={`https://wa.me/${talent.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="hover:text-white">
                  {talent.whatsapp}
                </a>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
                {talent.portfolioUrl && (
                  <a href={talent.portfolioUrl} target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                    <Globe size={18} className="text-neutral-400" /> Site / Portfolio
                  </a>
                )}
    
                {talent.linkedinUrl && (
                  <a href={talent.linkedinUrl} target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                    <Linkedin size={18} className="text-blue-400" /> LinkedIn
                  </a>
                )}
    
                {talent.behanceUrl && (
                  <a href={talent.behanceUrl} target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                    <LayoutTemplate size={18} className="text-blue-500" /> Behance
                  </a>
                )}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-800">
              <p className="text-xs text-neutral-500 uppercase mb-1">Congo Creative Score</p>
              <div className="text-5xl font-black text-white flex items-center gap-2">
                {talent.globalScore.toFixed(1)} <Star className="text-accent fill-accent" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : PORTFOLIO / PROJETS */}
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6">À propos</h2>
            <p className="text-secondaryText leading-relaxed">
              {talent.bio || "Ce talent n'a pas encore rédigé sa présentation."}
            </p>
          </section>

          <ProjectGallery projects={talent.projects} />
          
        </div>
      </main>
    </div>
  );
}