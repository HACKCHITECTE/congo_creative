import { Sparkles, Users, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-primary min-h-screen text-white">
      {/* 1️⃣ HEADER / NAV */}
      <header className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              <span className="text-white">Congo</span>
              <span className="text-accent font-black">INDEX</span>
            </h1>
            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">BETA v0.1</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-secondaryText">
            <a href="classement" className="hover:text-accent transition-colors">Classement</a>
            <a href="annuaire" className="hover:text-accent transition-colors">Annuaire</a>
            <a href="about" className="hover:text-accent transition-colors">À Propos</a>
            <a href="submit" className="bg-neutral-800 text-white px-5 py-2.5 rounded-full hover:bg-accent hover:text-primary transition-all duration-300 font-bold">
              Soumettre un Projet
            </a>
          </nav>
        </div>
      </header>

      {/* 2️⃣ HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 py-24 sm:py-32 flex flex-col items-center text-center">
        <span className="inline-flex gap-2 items-center rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent ring-1 ring-inset ring-accent/20 mb-6">
          <Sparkles className="size-3.5" />
          Officiel : L'élite créative du Congo
        </span>
        
        <h2 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter mb-8 max-w-4xl mx-auto">
          Identifiez, Valorisez, <span className="text-accent">Recrutez</span> l'élite créative au Congo
        </h2>
        
        <p className="text-xl text-secondaryText max-w-2xl mx-auto mb-12">
          Le <strong className="text-white">Congo Creative Index</strong> est le référentiel premium du talent national : 
          Design, Vidéo, Motion, Marketing. Trouvez les meilleurs, certifiés par experts.
        </p>
        
        <div className="flex gap-4">
          <a href="#submit" className="bg-accent text-primary px-10 py-4.5 rounded-full hover:bg-amber-400 transition-all duration-300 font-extrabold text-lg flex items-center gap-2.5 shadow-lg shadow-accent/20">
            Rejoindre l'Index (Soumettre)
            <span className="size-6 bg-primary/10 rounded-full flex items-center justify-center">→</span>
          </a>
          <a href="#ranking" className="bg-neutral-800 text-white px-10 py-4.5 rounded-full hover:bg-neutral-700 transition-all duration-300 font-semibold text-lg">
            Découvrir le Top 10
          </a>
        </div>
      </main>

      {/* 3️⃣ COMMENT ÇA MARCHE / FEATURES */}
      <section className="border-t border-neutral-800 bg-neutral-950 py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          
          <div className="border border-neutral-800 rounded-3xl p-8 bg-primary hover:border-accent/40 transition-all duration-300 group">
            <Sparkles className="size-10 text-accent mb-6 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-bold mb-3">Sélection Rigoureuse</h4>
            <p className="text-secondaryText text-sm">Classement impartial et authentifié, basé sur un <strong className="text-white">scoring expert</strong> des compétences techniques.</p>
          </div>

          <div className="border border-neutral-800 rounded-3xl p-8 bg-primary hover:border-accent/40 transition-all duration-300 group">
            <Users className="size-10 text-accent mb-6 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-bold mb-3">Annuaire Premium</h4>
            <p className="text-secondaryText text-sm">Accès direct aux meilleurs talents certifiés, classés par métier, disponibilité et localisation.</p>
          </div>

          <div className="border border-neutral-800 rounded-3xl p-8 bg-primary hover:border-accent/40 transition-all duration-300 group">
            <CheckCircle className="size-10 text-accent mb-6 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-bold mb-3">Futur National Awards</h4>
            <p className="text-secondaryText text-sm">Le tremplin officiel pour les récompenses créatives, propulsant le talent national sur la scène.</p>
          </div>

        </div>
      </section>

      {/* 4️⃣ FOOTER */}
      <footer className="border-t border-neutral-800 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-secondaryText">
          <p>© 2026 Congo Creative INDEX. Tous droits réservés.</p>
          <p className="mt-1 text-xs text-neutral-600">Infrastructure de sélection et distribution de talent au Congo.</p>
        </div>
      </footer>

    </div>
  );
}