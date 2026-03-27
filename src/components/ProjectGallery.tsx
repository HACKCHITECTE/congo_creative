"use client"; // 👈 Obligatoire pour l'interactivité

import { useState } from 'react';
import { PlaySquare, X, Maximize2 } from 'lucide-react';

// Définition du type Project (basé sur ton schéma Prisma)
interface Project {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string | null;
  processUrl: string | null;
}

interface ProjectGalleryProps {
  projects: Project[];
}

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
  // État pour stocker l'URL de l'image actuellement agrandie (null si fermé)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // Fonction pour ouvrir la lightbox et bloquer le défilement du fond
  const openLightbox = (url: string) => {
    setSelectedImageUrl(url);
    document.body.style.overflow = 'hidden'; // Empêche de scroller le site derrière
  };

  // Fonction pour fermer la lightbox
  const closeLightbox = () => {
    setSelectedImageUrl(null);
    document.body.style.overflow = ''; // Rétablit le défilement
  };

  if (!projects || projects.length === 0) {
    return <p className="text-secondaryText text-sm">Aucun projet soumis.</p>;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-white">Projets Sélectionnés</h2>
      <div className="grid gap-8">
        {projects.map((project) => (
          <div key={project.id} className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800">
            {project.mediaUrl && (
              // ZONE CLIQUABLE DE L'IMAGE 👇
              <div 
                className="cursor-pointer group relative overflow-hidden border-b border-neutral-800" 
                onClick={() => openLightbox(project.mediaUrl!)}
              >
                <img
                  src={project.mediaUrl}
                  alt={project.title}
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay au survol pour indiquer le clic */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold backdrop-blur-sm">
                  <Maximize2 size={20} className="text-accent" />
                  Agrandir l'image
                </div>
              </div>
            )}
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1 text-white">{project.title}</h3>
                  <p className="text-secondaryText text-sm leading-relaxed">{project.description}</p>
                </div>

                {project.processUrl && (
                  <a href={project.processUrl} target="_blank" rel="noopener noreferrer"
                     className="shrink-0 bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-accent hover:text-primary transition-all">
                    <PlaySquare size={16} /> Voir le processus
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 👇 L'INTERFACE LIGHTBOX (MODALE) 👇 */}
      {selectedImageUrl && (
        <div
          className="fixed inset-0 bg-black/95 z-100 flex items-center justify-center p-4 md:p-12 backdrop-blur-sm cursor-zoom-out"
          onClick={closeLightbox} // Ferme si on clique sur le fond
        >
          {/* Bouton Fermer */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2.5 bg-neutral-800 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all z-110"
          >
            <X size={28} />
          </button>
          
          {/* L'image en grand */}
          <img
            src={selectedImageUrl}
            alt="Projet final agrandi"
            className="max-w-full max-h-full rounded-xl shadow-2xl border-4 border-neutral-800 cursor-default"
            onClick={(e) => e.stopPropagation()} // Empêche de fermer si on clique sur l'image elle-même
          />
        </div>
      )}
    </section>
  );
}