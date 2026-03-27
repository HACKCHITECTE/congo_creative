"use client";

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Camera, Send, Plus, UserCircle } from 'lucide-react'; // 👈 Ajout de UserCircle

export default function SoumissionPage() {
  // 1. Mise à jour du state initial 👇
  const [formData, setFormData] = useState({
    fullName: '', profilePictureUrl: '', // Ajout de la photo ici
    job: 'Design', city: '', email: '', whatsapp: '', 
    portfolioUrl: '', behanceUrl: '', linkedinUrl: '', bio: '', availability: 'Freelance'
  });
  const [projects, setProjects] = useState([{ title: '', description: '', mediaUrl: '', processUrl: '' }]);
  const [loading, setLoading] = useState(false);

  // ... (fonction handleSubmit identique) ...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Pour le test, on s'assure qu'au moins un projet a un média chargé
    if (!projects[0].mediaUrl) {
      alert("Veuillez charger au moins un média pour votre projet de test.");
      setLoading(false);
      return;
    }
    
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({ ...formData, projects }),
    });

    if (response.ok) {
      alert("Candidature envoyée avec succès !");
      window.location.href = '/classement';
    } else {
      alert("Erreur lors de l'envoi.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-primary py-20 px-6 font-(family-name:--font-jakarta)">
      <div className="max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 p-8 md:p-12 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-black text-white mb-2">Rejoindre l'Index</h1>
        <p className="text-secondaryText mb-12">Remplissez votre profil pour être évalué et apparaître dans le classement officiel.</p>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* SECTION 1 : VOTRE PROFIL */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="text-accent flex items-center justify-center size-8 rounded-full bg-accent/10 text-sm font-black">1</span>
              Votre Profil
            </h2>

            {/* 👇 NOUVEAU : ZONE PHOTO DE PROFIL 👇 */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-10 pb-10 border-b border-neutral-800">
              {/* Aperçu de la photo */}
              {formData.profilePictureUrl ? (
                <img src={formData.profilePictureUrl} alt="Aperçu" className="size-24 rounded-full object-cover border-4 border-neutral-800 shadow-xl" />
              ) : (
                <UserCircle className="size-24 text-neutral-700" strokeWidth={1} />
              )}
              
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(result: any) => {
                  // Mise à jour de formData.profilePictureUrl
                  setFormData({...formData, profilePictureUrl: result.info.secure_url});
                }}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="bg-neutral-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-neutral-700 transition-colors flex items-center gap-2">
                    <Camera size={18} /> {formData.profilePictureUrl ? "Changer la photo" : "Ajouter une photo de profil"}
                  </button>
                )}
              </CldUploadWidget>
              <p className="text-xs text-neutral-500 max-w-xs text-center md:text-left">Format carré recommandé (ex: 400x400px). JPG ou PNG.</p>
            </div>
            
            {/* Reste des INFOS PERSONNELLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Nom complet" required className="bg-neutral-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-accent" 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              
              <select className="bg-neutral-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-accent"
                onChange={(e) => setFormData({...formData, job: e.target.value})}>
                <option>Design</option>
                <option>Motion Design</option>
                <option>Montage Vidéo</option>
                <option>Marketing</option>
              </select>

              <input type="email" placeholder="Email" required className="bg-neutral-800 border-none rounded-xl p-4 text-white" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} />
              
              <input type="text" placeholder="WhatsApp (ex: 06 444...)" required className="bg-neutral-800 border-none rounded-xl p-4 text-white" 
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
                
              <input type="text" placeholder="Ville (ex: Brazzaville)" required className="bg-neutral-800 border-none rounded-xl p-4 text-white" 
                onChange={(e) => setFormData({...formData, city: e.target.value})} />

              <select className="bg-neutral-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-accent"
                onChange={(e) => setFormData({...formData, availability: e.target.value})}>
                <option>Freelance</option>
                <option>Cherche un CDI</option>
                <option>Ouvert aux Projets</option>
              </select>
            </div>

            {/* LIENS PROS */}
            <div className="space-y-4 pt-6 border-t border-neutral-800 mt-6">
               <h2 className="text-xl font-bold text-white mb-4">Vos Liens</h2>
               <input type="url" placeholder="Lien Portfolio Web (ex: site personnel)" required className="w-full bg-neutral-800 border-none rounded-xl p-4 text-white" 
                onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})} />
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <input type="url" placeholder="Lien Behance (Optionnel)" className="bg-neutral-800 border-none rounded-xl p-4 text-white" 
                  onChange={(e) => setFormData({...formData, behanceUrl: e.target.value})} />
                 <input type="url" placeholder="Lien LinkedIn (Optionnel)" className="bg-neutral-800 border-none rounded-xl p-4 text-white" 
                  onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})} />
               </div>

               <textarea placeholder="Votre Bio / Présentation (Optionnel)" rows={3} className="w-full bg-neutral-800 border-none rounded-xl p-4 text-white"
                onChange={(e) => setFormData({...formData, bio: e.target.value})}></textarea>
            </div>
          </section>

          {/* SECTION 2 : VOS PROJETS */}
          <section>
             <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <span className="text-accent flex items-center justify-center size-8 rounded-full bg-accent/10 text-sm font-black">2</span>
              Vos Projets
            </h2>
            <p className="text-secondaryText mb-8 text-sm">Chargez une belle image de couverture, et fournissez un lien vers votre processus (Making-of, fichiers PDF, PSD, AE, vidéo Drive...)</p>

            {projects.map((project, index) => (
              <div key={index} className="p-6 md:p-8 bg-neutral-950 rounded-3xl border border-neutral-800 space-y-6">
                
                <input type="text" placeholder="Titre du projet" required className="w-full bg-neutral-800 border-none rounded-lg p-4 text-white font-bold" 
                  onChange={(e) => {
                    const newProjects = [...projects];
                    newProjects[index].title = e.target.value;
                    setProjects(newProjects);
                  }} />

                <textarea placeholder="Description courte de ce que vous avez réalisé..." rows={2} className="w-full bg-neutral-800 border-none rounded-lg p-4 text-white"
                  onChange={(e) => {
                    const newProjects = [...projects];
                    newProjects[index].description = e.target.value;
                    setProjects(newProjects);
                  }}></textarea>
                
                <div className="flex flex-col md:flex-row gap-4">
                  {/* UPLOAD CLOUDINARY (Couverture) */}
                  <div className="flex-1 border border-dashed border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                    <p className="text-xs text-neutral-400 mb-2">Image de couverture visible sur le site</p>
                    <CldUploadWidget 
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      onSuccess={(result: any) => {
                        const newProjects = [...projects];
                        newProjects[index].mediaUrl = result.info.secure_url;
                        setProjects(newProjects);
                      }}
                    >
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className="flex items-center justify-center w-full gap-2 text-sm text-accent bg-accent/10 py-3 rounded-lg border border-accent/20 hover:bg-accent/20 transition-all font-bold">
                          <Camera size={18} /> {project.mediaUrl ? "Couverture chargée ✓" : "Charger une image"}
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>

                  {/* LIEN DU PROCESSUS (Drive/YouTube) */}
                  <div className="flex-2 bg-neutral-800 rounded-xl p-4 flex items-center">
                    <input type="url" placeholder="Lien de la vidéo du processus ou fichiers (Google Drive, YouTube...)" required 
                      className="w-full bg-transparent border-none text-white focus:ring-0 text-sm" 
                      onChange={(e) => {
                        const newProjects = [...projects];
                        newProjects[index].processUrl = e.target.value;
                        setProjects(newProjects);
                      }} />
                  </div>
                </div>

              </div>
            ))}
          </section>

          <button type="submit" disabled={loading} className="w-full bg-accent text-primary font-black py-5 rounded-2xl text-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-accent/30 hover:scale-[1.01]">
            {loading ? "Envoi en cours..." : "Soumettre ma candidature"}
            <Send size={22} />
          </button>
        </form>
      </div>
    </div>
  );
}