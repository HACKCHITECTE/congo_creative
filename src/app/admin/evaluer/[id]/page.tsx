"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ExternalLink, PlaySquare, Linkedin, Globe, MessageCircle, LayoutTemplate, UserCircle, X, Maximize2, CheckCircle } from 'lucide-react';

export default function EvaluerTalent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [talent, setTalent] = useState<any>(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [notes, setNotes] = useState({
    originality: 0,
    aesthetic: 0,
    finish: 0,
    toolMastery: 0,
    complexity: 0,
    organization: 0,
    potential: 0,      // Remplace "marketability"
    presentation: 0,   // Remplace "professionalism"
    engagement: 0,     // Pour le social
    publicVote: 0      // Pour le vote
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/talents/${id}`)
        .then(res => res.json())
        .then(data => setTalent(data))
        .catch(err => console.error("Erreur chargement:", err));
    }
  }, [id]);

  // Bloquer le scroll quand l'image est en grand
  useEffect(() => {
    if (showLightbox) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [showLightbox]);

  const submitScore = async () => {
  const totalScore = Object.values(notes).reduce((acc, val) => acc + val, 0);
  if (!talent || talent.projects.length === 0) return alert("Données incomplètes.");
  
  setLoading(true);
  
  try {
    const response = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        talentId: id, 
        projectId: talent.projects[0].id, 
        ...notes,
        finalScore: totalScore 
      }),
    });

    // Ajoute ceci pour debugger si ça ne marche pas :
    console.log("Réponse API:", response.status);

    if (response.ok) {
      // 1. On active le pop-up
      setShowSuccess(true);
      
      // 2. On attend un peu, puis on force le rafraîchissement
      setTimeout(() => {
        window.location.href = '/admin'; // Utiliser window.location est parfois plus radical/efficace que router.push pour nettoyer le cache
      }, 2500);
    } else {
      const errorData = await response.json();
      alert(`Erreur: ${errorData.details || "Problème lors de l'enregistrement"}`);
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau ou serveur.");
  } finally {
    setLoading(false);
  }
};

  if (!talent) return <div className="p-12 text-white animate-pulse text-center font-bold">Chargement du dossier candidat...</div>;

  return (
    <div className="min-h-screen bg-primary text-white p-6 md:p-12">

      {/* --- LIGHTBOX (MODALE IMAGE EN GRAND) --- */}
      {showLightbox && talent.projects[0]?.mediaUrl && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setShowLightbox(false)}
        >
          <button className="absolute top-6 right-6 p-2 bg-neutral-800 rounded-full text-white hover:bg-neutral-700 transition-all">
            <X size={32} />
          </button>
          <img 
            src={talent.projects[0].mediaUrl} 
            className="max-w-full max-h-full rounded-lg shadow-2xl border-2 border-neutral-800" 
            alt="Plein écran"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* 👇 --- POP-UP DE SUCCÈS --- 👇 */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm mx-4 transform transition-all scale-100 animate-in zoom-in-95 duration-300">
            <div className="rounded-full bg-green-500/10 p-4 mb-6">
              <CheckCircle className="text-green-500 size-16" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Évaluation Validée !</h3>
            <p className="text-secondaryText mb-6">
              Les notes ont été enregistrées avec succès et le classement a été mis à jour.
            </p>
            {/* Petit spinner de chargement pour faire patienter pendant la redirection */}
            <div className="size-6 border-4 border-neutral-700 border-t-accent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      {/* 👆 --- FIN POP-UP DE SUCCÈS --- 👆 */}

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
        
        {/* --- COLONNE GAUCHE : DOSSIER DU CANDIDAT --- */}
        <div className="space-y-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-6 mb-6">
              {talent.profilePictureUrl ? (
                <img src={talent.profilePictureUrl} className="size-20 rounded-full object-cover border-2 border-accent" alt="" />
              ) : (
                <UserCircle size={80} className="text-neutral-700" />
              )}
              <div>
                <h1 className="text-2xl font-black">{talent.fullName}</h1>
                <p className="text-accent font-bold text-sm uppercase">{talent.job}</p>
              </div>
            </div>

            <p className="text-secondaryText text-sm mb-6 leading-relaxed italic">
              "{talent.bio || "Pas de bio renseignée."}"
            </p>

            {/* LIENS EXTERNES */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {talent.portfolioUrl && (
                <a href={talent.portfolioUrl} target="_blank" className="flex items-center gap-2 p-3 bg-neutral-800 rounded-xl text-xs hover:bg-neutral-700 transition-all">
                  <Globe size={14} className="text-neutral-400" /> Portfolio
                </a>
              )}
              {talent.behanceUrl && (
                <a href={talent.behanceUrl} target="_blank" className="flex items-center gap-2 p-3 bg-neutral-800 rounded-xl text-xs hover:bg-neutral-700 transition-all">
                  <LayoutTemplate size={14} className="text-blue-500" /> Behance
                </a>
              )}
              {talent.linkedinUrl && (
                <a href={talent.linkedinUrl} target="_blank" className="flex items-center gap-2 p-3 bg-neutral-800 rounded-xl text-xs hover:bg-neutral-700 transition-all">
                  <Linkedin size={14} className="text-blue-400" /> LinkedIn
                </a>
              )}
              <a href={`https://wa.me/${talent.whatsapp}`} target="_blank" className="flex items-center gap-2 p-3 bg-neutral-800 rounded-xl text-xs hover:bg-neutral-700 transition-all text-green-500 font-bold">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>

            {/* PROJET ET PROCESSUS */}
            <div className="border-t border-neutral-800 pt-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <PlaySquare size={18} className="text-accent" /> Pièce à conviction (Projet)
              </h3>
              {/* ZONE IMAGE CLIQUABLE */}
              <div 
                className="relative rounded-2xl overflow-hidden border border-neutral-800 mb-6 bg-black group cursor-pointer"
                onClick={() => setShowLightbox(true)}
              >
                {talent.projects[0]?.mediaUrl && (
                  <>
                    <img src={talent.projects[0].mediaUrl} className="w-full h-64 object-contain transition-transform group-hover:scale-105" alt="Projet" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 font-bold">
                      <Maximize2 size={20} className="text-accent" /> Voir en grand
                    </div>
                  </>
                )}
              </div>
              
              {talent.projects[0]?.processUrl && (
                <a 
                  href={talent.projects[0].processUrl} 
                  target="_blank" 
                  className="w-full flex items-center justify-center gap-3 py-4 bg-accent text-primary font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20"
                >
                  VOIR LA VIDÉO DU PROCESSUS (Drive/YouTube)
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE : LE BARÈME DU JURY --- */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-xl h-fit sticky top-12">
          <h2 className="text-2xl font-black mb-8">Notation du Jury</h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          {/* GROUPE VISUEL */}
            <div className="space-y-4">
              <h3 className="text-accent text-xs font-black uppercase tracking-widest">A. Visuel & Esthétique</h3>
              {['originality', 'aesthetic', 'finish'].map((key) => (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <label className="capitalize">{key}</label>
                    <span className="text-accent">{notes[key as keyof typeof notes]}/10</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="0.5" 
                  // 👇 Le "?? 0" règle le problème : si notes[key] est undefined, il utilise 0
                    value={notes[key as keyof typeof notes] ?? 0} 
                    onChange={(e) => setNotes({
                      ...notes, 
                      [key]: parseFloat(e.target.value) || 0 
                    })}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  </div>
                ))}
            </div>

          {/* GROUPE TECHNIQUE */}
            <div className="space-y-4">
              <h3 className="text-accent text-xs font-black uppercase tracking-widest">B. Expertise Technique</h3>
              {['toolMastery', 'complexity', 'organization'].map((key) => (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <label className="capitalize">{key}</label>
                    <span className="text-accent">{notes[key as keyof typeof notes]}/10</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="0.5" 
                  // 👇 Le "?? 0" règle le problème : si notes[key] est undefined, il utilise 0
                    value={notes[key as keyof typeof notes] ?? 0} 
                    onChange={(e) => setNotes({
                      ...notes, 
                      [key]: parseFloat(e.target.value) || 0 
                    })}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              ))}
            </div>

            {/* GROUPE BUSINESS - CORRIGÉ */}
            <div className="space-y-4">
              <h3 className="text-accent text-xs font-black uppercase tracking-widest">C. Potentiel Business</h3>
              {/* Utilise les clés techniques ici 👇 */}
                {[
                  { id: 'potential', label: 'Potentiel Client' },
                  { id: 'presentation', label: 'Bio & Présentation' }
                  ].map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <label className="capitalize">{item.label}</label>
                        <span className="text-accent">{notes[item.id as keyof typeof notes]}/10</span>
                      </div>
                      <input 
                        type="range" min="0" max="10" step="0.5" 
                        value={notes[item.id as keyof typeof notes] ?? 0} 
                        onChange={(e) => setNotes({ ...notes, [item.id]: parseFloat(e.target.value) || 0 })}
                        className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>
                ))}
            </div>

            {/* GROUPE SOCIAL - CORRIGÉ */}
            <div className="space-y-4">
              <h3 className="text-accent text-xs font-black uppercase tracking-widest">D. Engagement Social</h3>
              {[
              { id: 'engagement', label: 'Engagement' },
              { id: 'publicVote', label: 'Vote Public' }
              ].map((item) => (
              <div key={item.id}>
                <div className="flex justify-between text-xs mb-1">
                  <label className="capitalize">{item.label}</label>
                  <span className="text-accent">{notes[item.id as keyof typeof notes]}/10</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="0.5" 
                  value={notes[item.id as keyof typeof notes] ?? 0} 
                  onChange={(e) => setNotes({ ...notes, [item.id]: parseFloat(e.target.value) || 0 })}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
            ))}
          </div>
        </div>

          
          <div className="space-y-4 mt-8">
          {/* BOUTON VALIDER */}
            <button 
              onClick={submitScore}
              disabled={loading || showSuccess}
              className={`w-full font-black py-5 rounded-2xl text-lg transition-all flex items-center justify-center gap-3 ${
                loading ? "bg-neutral-700 text-neutral-500 cursor-not-allowed" : 
                showSuccess ? "bg-green-600 text-white" : "bg-white text-black hover:bg-accent hover:text-primary"
              }`}
            >
              {loading ? "Enregistrement..." : showSuccess ? "ÉVALUATION ENVOYÉE !" : "VALIDER L'ÉVALUATION"}
            </button>

            {/* BOUTON RETOUR (Toujours visible) */}
            <button 
              onClick={() => router.push('/admin')}
              className="w-full font-bold py-4 rounded-2xl text-sm border border-neutral-800 text-secondaryText hover:bg-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              ← Retour au Dashboard Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}