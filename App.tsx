
import React, { useState, useRef } from 'react';
import Snowfall from './components/Snowfall';
import Santa from './components/Santa';
import { AppState, ChristmasPoem } from './types';

// Direct high-quality link for "Ordinary" by Alex Warren
const SONG_URL = 'https://files.catbox.moe/p55v2i.mp3';

const STATIC_POEMS: ChristmasPoem[] = [
  {
    title: "A Winter Sparkle",
    content: "The stars are bright, the snow is new,\nBut nothing shines as bright as you.\nIn the winter chill and festive glow,\nYou're the magic in the show.\nMerry Christmas to the one who brings,\nThe joy that every angel sings."
  },
  {
    title: "Holiday Wonder",
    content: "Winter winds and frosty air,\nMagic's floating everywhere.\nJust a note to let you know,\nWith every flake of falling snow,\nYou're the highlight of my year,\nBringing warmth and holiday cheer."
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.HOME);
  const [crushName] = useState('Prachiii');
  const [openedGift, setOpenedGift] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showUnlock, setShowUnlock] = useState(true);
  const [activePoemIndex, setActivePoemIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [personalNoteText] = useState(`Hey Prachiii, 

Umeed karta hu acchi hogi tum. Tabiyat wagerah bhi acchi hogi. Thandi nhi lagi hogi 😂 Nahaya nhi hoga atleast 1 mahine se 🐼😼 Ha ha me sab janta hu 😼🐣  

Dekho To zara is ladki ko, kitna chamak rhi h aaj 😒🦥 kya h is cartooni ladki ka raaz, aise hi raho idiot ladkiiiii...... Waise me christmas wish bhi kisko kar rha hu........... jo khud ek angel h, batao kitna nadan hu me🐣!

Kehte h ki duaaa or daan bata ke nhi karteeee.... .. bas dil se karte h........... toh me tumhare liye ye chhoti si duaa karta hu ki tum hamesha khush raho, tumhari zindagi me hamesha pyaar or khushiyaan bani rahe..... or tum jese log hamesha apne aas paas khushiyaan baant te rahe...... or haan me us din thaaa gussee me lekin us din ke baad nhiiii (spelling mistakes thi us dairy me🐼), usme likhaa tha na sab trash ho gaya... Isiliye ye 12 bajne ke pahla bana rha hu taaki prove kar saku ki haaa.... I'm still the same little girllll... 
Mere se itne jaldi peecha nhi chootegaaaa....... 
Hamesha Khush raho.... 🎄🎁❄️❤️`);

  // THE CRITICAL FIX: Unlock audio via user gesture for Vercel/Netlify/Mobile
  const startMagic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(SONG_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.crossOrigin = "anonymous";
    }
    
    audioRef.current.play()
      .then(() => {
        setIsMuted(false);
        setShowUnlock(false);
      })
      .catch((err) => {
        console.error("Audio failed to play:", err);
        // Even if audio fails, we must let the user into the site
        setShowUnlock(false);
      });
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(console.error);
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  const BackButton = () => (
    <button 
      onClick={() => setView(AppState.HOME)}
      className="mb-8 flex items-center gap-2 text-white/70 hover:text-white transition-all group"
    >
      <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
      <span className="font-semibold uppercase tracking-[0.2em] text-[10px]">Back to Wonderland</span>
    </button>
  );

  return (
    <div className="min-h-screen relative text-white selection:bg-red-500 selection:text-white overflow-x-hidden bg-gradient-to-b from-[#020617] via-[#450a0a] to-[#064e3b] font-sans">
      <Snowfall />
      <Santa />
      
      {/* UNLOCK OVERLAY - Browser Requirement for Audio */}
      {showUnlock && (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
           <div className="text-9xl mb-8 animate-bounce">🎁</div>
           <h2 className="text-5xl md:text-7xl font-christmas text-red-500 mb-6 drop-shadow-2xl">A Gift for {crushName}...</h2>
           <p className="text-slate-400 mb-10 max-w-md text-lg italic leading-relaxed">
             "Tap to unwrap and hear something special."
           </p>
           <button 
            onClick={startMagic}
            className="bg-red-600 hover:bg-red-500 text-white px-16 py-8 rounded-full font-bold text-3xl shadow-[0_0_60px_rgba(220,38,38,0.5)] transition-all hover:scale-110 active:scale-95 border-b-8 border-red-900"
           >
             Unwrap ✨
           </button>
        </div>
      )}

      {/* Music Control */}
      {!showUnlock && (
        <button 
          onClick={toggleMusic}
          className={`fixed bottom-10 left-10 z-50 p-6 rounded-full backdrop-blur-3xl border border-white/20 shadow-2xl transition-all hover:scale-110 active:scale-90 ${!isMuted ? 'bg-green-500/40 text-white animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-white/10 text-white/30'}`}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M12 18.364l-4.707-4.707H4a1 1 0 01-1-1v-4a1 1 0 011-1h3.293L12 5.636v12.728z" />
            </svg>
          )}
        </button>
      )}

      <nav className="fixed top-0 left-0 w-full p-6 z-40 flex justify-between items-center backdrop-blur-md bg-black/10 border-b border-white/5">
        <h1 className="text-3xl font-christmas font-bold tracking-widest cursor-pointer hover:text-red-400 transition-colors" onClick={() => setView(AppState.HOME)}>
          Festive Hearts
        </h1>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView(AppState.SURPRISE)}
             className="bg-red-600 hover:bg-red-500 px-8 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-xl text-sm"
          >
            Gift 🎁
          </button>
        </div>
      </nav>

      <main className="pt-36 px-4 pb-24 max-w-4xl mx-auto z-10 relative">
        {view === AppState.HOME && (
          <div className="text-center space-y-16 py-10">
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-6xl md:text-9xl font-christmas text-red-500 drop-shadow-2xl">
                Merry Christmas, <br/>
                <span className="text-green-400">{crushName}!</span>
              </h2>
              <p className="text-xl md:text-3xl font-light text-slate-200 max-w-2xl mx-auto leading-relaxed italic drop-shadow-md">
                "Sending you warmth, light, and a little bit of magic."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
              <div 
                className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 hover:border-red-500/30 transition-all cursor-pointer group text-left shadow-2xl" 
                onClick={() => setView(AppState.POEMS)}
              >
                <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">📜</div>
                <h4 className="text-2xl font-bold mb-4 text-red-400 font-christmas">Festive Poems</h4>
                <p className="text-slate-400">Magic verses written for the holiday spirit.</p>
              </div>
              
              <div 
                className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 hover:border-green-500/30 transition-all cursor-pointer group text-left shadow-2xl" 
                onClick={() => setView(AppState.PERSONAL_NOTE)}
              >
                <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">✉️</div>
                <h4 className="text-2xl font-bold mb-4 text-green-400 font-christmas">A Heartfelt Note</h4>
                <p className="text-slate-400">A private message kept warm just for you.</p>
              </div>

              <div 
                className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 hover:border-yellow-500/30 transition-all cursor-pointer group text-left shadow-2xl" 
                onClick={() => setView(AppState.SURPRISE)}
              >
                <div className="text-6xl mb-6 group-hover:rotate-12 transition-transform duration-500">🌟</div>
                <h4 className="text-2xl font-bold mb-4 text-yellow-400 font-christmas">Hidden Surprise</h4>
                <p className="text-slate-400">Find the special sparkle in the digital tree.</p>
              </div>
            </div>
          </div>
        )}

        {view === AppState.POEMS && (
          <div className="animate-scale-in py-10 max-w-2xl mx-auto text-center">
            <BackButton />
            <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl transform -rotate-1 border-[12px] border-red-50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 transform translate-x-16 -translate-y-16 rotate-45"></div>
               <h2 className="text-4xl md:text-5xl font-christmas text-red-600 mb-10 font-bold">{STATIC_POEMS[activePoemIndex].title}</h2>
               <div className="text-2xl md:text-3xl text-slate-800 leading-relaxed italic whitespace-pre-wrap font-christmas min-h-[250px] flex items-center justify-center">
                  {STATIC_POEMS[activePoemIndex].content}
               </div>
               <div className="mt-12 flex justify-center gap-4">
                  <button 
                    onClick={() => setActivePoemIndex(0)} 
                    className={`w-4 h-4 rounded-full transition-all ${activePoemIndex === 0 ? 'bg-red-600 scale-125' : 'bg-red-200'}`}
                  ></button>
                  <button 
                    onClick={() => setActivePoemIndex(1)} 
                    className={`w-4 h-4 rounded-full transition-all ${activePoemIndex === 1 ? 'bg-red-600 scale-125' : 'bg-red-200'}`}
                  ></button>
               </div>
               <button 
                onClick={() => setActivePoemIndex((prev) => (prev === 0 ? 1 : 0))}
                className="mt-10 text-red-600 font-bold uppercase tracking-widest text-xs hover:text-red-400 transition-colors"
               >
                 View Next Verse →
               </button>
            </div>
          </div>
        )}

        {view === AppState.PERSONAL_NOTE && (
          <div className="animate-fade-in py-10">
             <BackButton />
             <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-6xl font-christmas text-green-400 mb-12 drop-shadow-lg">From Me to You</h2>
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-left">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-white to-green-500"></div>
                  <p className="text-3xl md:text-4xl text-slate-100 leading-relaxed font-christmas whitespace-pre-wrap italic">
                    {personalNoteText}
                  </p>
                  <div className="mt-16 pt-10 border-t border-white/10 text-center">
                    <p className="text-slate-400 uppercase tracking-[0.5em] font-bold text-sm">Merry Christmas, {crushName}</p>
                  </div>
                </div>
             </div>
          </div>
        )}

        {view === AppState.SURPRISE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 animate-fade-in">
             <div className="w-full max-w-2xl">
               <BackButton />
             </div>
             
             {!openedGift ? (
               <div className="text-center space-y-12">
                 <h2 className="text-5xl md:text-7xl font-christmas text-red-500 font-bold drop-shadow-2xl">Touch the Box...</h2>
                 <div 
                   onClick={() => setOpenedGift(true)}
                   className="w-72 h-72 md:w-96 md:h-96 bg-red-600 relative cursor-pointer group shadow-[0_40px_80px_rgba(0,0,0,0.6)] transition-all hover:scale-110 active:scale-95 rounded-3xl border-4 border-white/10 mx-auto"
                 >
                   <div className="absolute inset-0 flex justify-center"><div className="w-16 h-full bg-yellow-500 shadow-inner"></div></div>
                   <div className="absolute inset-0 flex items-center"><div className="h-16 w-full bg-yellow-500 shadow-inner"></div></div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-yellow-100 shadow-2xl">
                      <span className="text-yellow-950 font-black text-2xl tracking-tighter">OPEN</span>
                   </div>
                 </div>
               </div>
             ) : (
               <div className="text-center space-y-12 animate-scale-in max-w-2xl bg-white/5 p-16 rounded-[4rem] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                 <div className="text-[10rem] animate-bounce drop-shadow-2xl">🌟</div>
                 <h3 className="text-6xl md:text-8xl font-christmas text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">You're Amazing Okieee!</h3>
                 <p className="text-3xl md:text-4xl text-slate-100 italic leading-relaxed font-christmas">
                   "Tareef ki adat ho gai h kyaaa... Bhago yaha seeeeee......, Wiase meri tareef kar sakti ho 🐼 me thodi mana karungaaaa.... And I hope this small thing will make your day happy and a smile on your face.. lips to lambe haiii hi tumharee😂"
                 </p>
                 <button 
                  onClick={() => setOpenedGift(false)}
                  className="bg-white/10 px-12 py-4 rounded-full text-sm font-bold uppercase tracking-widest text-slate-400 border border-white/10 hover:bg-white/20 transition-all mt-10"
                 >
                   Rewrap Gift
                 </button>
               </div>
             )}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full p-8 text-center text-[10px] uppercase tracking-[0.6em] opacity-30 z-40 backdrop-blur-sm pointer-events-none">
        Holiday Magic for {crushName} • MY LIL ANGEL MISS
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-scale-in { animation: scale-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default App;
