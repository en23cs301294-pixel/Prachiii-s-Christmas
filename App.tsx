
import React, { useState, useEffect, useRef } from 'react';
import Snowfall from './components/Snowfall';
import Santa from './components/Santa';
import { AppState, ChristmasPoem } from './types';
import { generateChristmasPoem } from './services/geminiService';

/**
 * CONFIGURATION: 
 * 1. Place your own MP3 file in the project folder.
 * 2. Rename it to 'background-music.mp3'.
 * 3. Or, paste a direct URL to an MP3 file below.
 */
const AUDIO_SOURCE = './background-music.mp3'; 

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.HOME);
  const [crushName, setCrushName] = useState('Prachiii');
  const [mood, setMood] = useState('sweet');
  const [poem, setPoem] = useState<ChristmasPoem | null>(null);
  const [loading, setLoading] = useState(false);
  const [openedGift, setOpenedGift] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // YOUR PERSONAL NOTE: You can edit this text right here.
  const [personalNoteText] = useState(`Hey Prachiii, 

Umeed karta hu acchi hogi tum. Tabiyat wagerah bhi acchi hogi. Thandi nhi lagi hogi 😂 Nahaya nhi hoga atleast 1 mahine se 🐼😼 Ha ha me sab janta hu 😼🐣  

Dekho To zara is ladki ko, kitna chamak rhi h aaj 😒🦥 kya h is cartooni ladki ka raaz, aise hi raho idiot ladkiiiii...... Waise me christmas wish bhi kisko kar rha hu........... jo khud ek angel h, batao kitna nadan hu me🐣!

Kehte h ki duaaa or daan bata ke nhi karteeee.... .. bas dil se karte h........... toh me tumhare liye ye chhoti si duaa karta hu ki tum hamesha khush raho, tumhari zindagi me hamesha pyaar or khushiyaan bani rahe..... or tum jese log hamesha apne aas paas khushiyaan baant te rahe...... or haan me us din thaaa gussee me lekin us din ke baad nhiiii (spelling mistakes thi us dairy me🐼), usme likhaa tha na sab trash ho gaya... Isiliye ye 12 bajne ke pahla bana rha hu taaki prove kar saku ki haaa.... I'm still the same little girllll... 
Mere se itne jaldi peecha nhi chootegaaaa....... 
Hamesha Khush raho.... 🎄🎁❄️❤️`);

  // Attempt to play on first click to bypass browser autoplay restrictions
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && isMuted) {
        audioRef.current.play()
          .then(() => {
            setIsMuted(false);
            setAudioReady(true);
          })
          .catch((err) => {
            console.log("Audio file might be missing or blocked:", err);
          });
      }
      window.removeEventListener('click', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [isMuted]);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(err => console.error("Playback failed", err));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleCreatePoem = async () => {
    if (!crushName) return;
    setLoading(true);
    try {
      const result = await generateChristmasPoem(crushName, mood);
      setPoem(result);
      setView(AppState.MESSAGE_GEN);
    } catch (error) {
      console.error(error);
      alert("Santa's magic hit a snag. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const BackButton = () => (
    <button 
      onClick={() => setView(AppState.HOME)}
      className="mb-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
    >
      <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
      <span className="font-semibold uppercase tracking-widest text-xs">Back to Home</span>
    </button>
  );

  return (
    <div className="min-h-screen relative text-white selection:bg-red-500 selection:text-white overflow-hidden bg-gradient-to-b from-slate-900 via-red-900 to-green-900 font-sans">
      <Snowfall />
      <Santa />
      
      {/* Background Music */}
      <audio 
        ref={audioRef}
        loop 
        preload="auto"
        onCanPlay={() => setAudioReady(true)}
        src={AUDIO_SOURCE} 
      />

      {/* Music Toggle Button */}
      <button 
        onClick={toggleMusic}
        className={`fixed bottom-10 left-10 z-50 p-4 rounded-full backdrop-blur-md border border-white/20 shadow-2xl transition-all hover:scale-110 active:scale-90 ${!isMuted ? 'bg-green-500/40 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse-slow' : 'bg-white/10 text-white/50'}`}
        title={isMuted ? "Play Your Music" : "Mute Music"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M12 18.364l-4.707-4.707H4a1 1 0 01-1-1v-4a1 1 0 011-1h3.293L12 5.636v12.728z" />
          </svg>
        )}
      </button>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 z-40 flex justify-between items-center backdrop-blur-sm bg-black/10 border-b border-white/5">
        <h1 className="text-3xl font-christmas font-bold tracking-wider cursor-pointer select-none" onClick={() => setView(AppState.HOME)}>
          🎄 Festive Hearts
        </h1>
        <div className="space-x-4 flex items-center">
          <button 
            onClick={() => setView(AppState.MESSAGE_GEN)}
            className="hidden md:block hover:text-red-300 transition-colors font-medium text-sm uppercase tracking-widest"
          >
            Magic Poem
          </button>
          <button 
            onClick={() => setView(AppState.PERSONAL_NOTE)}
            className="hidden md:block hover:text-green-300 transition-colors font-medium text-sm uppercase tracking-widest"
          >
            Personal Note
          </button>
          <button 
             onClick={() => setView(AppState.SURPRISE)}
             className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg text-sm"
          >
            SURPRISE!
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-32 px-4 pb-24 max-w-4xl mx-auto z-10 relative">
        {view === AppState.HOME && (
          <div className="text-center space-y-12 py-10">
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-5xl md:text-8xl font-christmas text-red-500 drop-shadow-[0_5px_15px_rgba(239,68,68,0.3)]">
                Merry Christmas, <span className="text-green-500">{crushName}!</span>
              </h2>
              <p className="text-xl md:text-2xl font-light text-slate-300 max-w-2xl mx-auto leading-relaxed">
                A digital wonderland crafted with care, especially for you.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-2xl max-w-lg mx-auto">
              <h3 className="text-2xl font-semibold mb-6 font-christmas text-red-400">Personalize Your Experience</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Enter her name..." 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-lg text-center"
                  value={crushName}
                  onChange={(e) => setCrushName(e.target.value)}
                />
                <select 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-lg appearance-none cursor-pointer text-center"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                >
                  <option value="sweet">Sweet & Festive 🍬</option>
                  <option value="funny">Funny & Jolly 🤡</option>
                  <option value="poetic">Deep & Thoughtful ✨</option>
                </select>
                <button 
                  onClick={handleCreatePoem}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-red-500/40 transition-all transform active:scale-95 flex justify-center items-center gap-3 mt-4"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>Generate Magic Poem <span className="animate-pulse">✨</span></>
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="bg-green-900/20 backdrop-blur-sm p-8 rounded-3xl border border-green-500/20 hover:border-green-500/40 hover:bg-green-900/30 transition-all cursor-pointer group text-left" onClick={() => setView(AppState.PERSONAL_NOTE)}>
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">✉️</div>
                <h4 className="text-2xl font-bold mb-3 text-green-400 font-christmas">Personal Note</h4>
                <p className="text-slate-400 leading-relaxed">A heartfelt message written directly from the heart of the North Pole.</p>
              </div>
              <div className="bg-red-900/20 backdrop-blur-sm p-8 rounded-3xl border border-red-500/20 hover:border-red-500/40 hover:bg-red-900/30 transition-all cursor-pointer group text-left" onClick={() => setView(AppState.SURPRISE)}>
                <div className="text-5xl mb-6 group-hover:rotate-12 transition-transform">🎁</div>
                <h4 className="text-2xl font-bold mb-3 text-red-400 font-christmas">Hidden Surprise</h4>
                <p className="text-slate-400 leading-relaxed">Something special is tucked away inside. Can you guess what it is?</p>
              </div>
            </div>
          </div>
        )}

        {view === AppState.MESSAGE_GEN && (
          <div className="animate-scale-in py-10 max-w-2xl mx-auto">
            <BackButton />
            {poem ? (
              <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] transform -rotate-1 relative overflow-hidden text-center border-8 border-red-50/50">
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-600 transform translate-x-20 -translate-y-20 rotate-45 flex items-end justify-center pb-4">
                    <span className="text-white font-bold text-2xl -rotate-45">🎁</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-christmas text-red-600 mb-10 font-bold">{poem.title}</h2>
                <div className="text-2xl md:text-3xl text-slate-800 leading-loose italic whitespace-pre-wrap font-medium font-christmas">
                  "{poem.content}"
                </div>
                <div className="mt-16 pt-10 border-t border-slate-100">
                   <p className="text-slate-400 text-sm mb-6 uppercase tracking-widest">A festive gift for {crushName}</p>
                   <button onClick={() => setView(AppState.HOME)} className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95">Back to Wonderland</button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-6 animate-bounce">🎅</div>
                <p className="text-2xl font-christmas text-red-400 animate-pulse tracking-widest">Consulting the Elves for the perfect words...</p>
              </div>
            )}
          </div>
        )}

        {view === AppState.PERSONAL_NOTE && (
          <div className="animate-fade-in space-y-10 py-10">
             <BackButton />
             <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-5xl font-christmas text-green-400 mb-12">Letter from Santa's Workshop</h2>
                
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 md:p-20 shadow-[0_30px_100px_rgba(0,0,0,0.4)] relative overflow-hidden text-left">
                  {/* Decorative Glowing Orbs */}
                  <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-500/10 rounded-full blur-[100px]"></div>
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-500/10 rounded-full blur-[100px]"></div>
                  
                  <div className="relative z-10">
                    <div className="text-green-500 text-7xl font-christmas mb-2 opacity-20">"</div>
                    <p className="text-2xl md:text-3xl text-slate-100 leading-relaxed font-christmas whitespace-pre-wrap italic drop-shadow-sm">
                      {personalNoteText}
                    </p>
                    <div className="flex justify-end text-green-500 text-7xl font-christmas -mt-4 opacity-20">"</div>
                  </div>
                  
                  <div className="mt-12 pt-10 border-t border-white/5 text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-[0.4em] font-semibold">Written with ❄️ for {crushName}</p>
                  </div>
                </div>
             </div>
          </div>
        )}

        {view === AppState.SURPRISE && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] py-10 space-y-10 animate-fade-in">
             <div className="w-full max-w-2xl">
               <BackButton />
             </div>
             
             {!openedGift ? (
               <div className="text-center space-y-10">
                 <h2 className="text-4xl md:text-5xl font-christmas text-red-500 font-bold drop-shadow-lg">A Secret Gift for {crushName}!</h2>
                 <p className="text-slate-400 italic">Click the package to unwrap the magic...</p>
                 <div 
                   onClick={() => setOpenedGift(true)}
                   className="w-72 h-72 bg-gradient-to-br from-red-600 to-red-700 relative cursor-pointer group shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all hover:scale-110 active:scale-95 rounded-2xl overflow-hidden border-4 border-white/10"
                 >
                   {/* Bow and Ribbon */}
                   <div className="absolute inset-0 flex justify-center">
                      <div className="w-10 h-full bg-yellow-500 shadow-inner"></div>
                   </div>
                   <div className="absolute inset-0 flex items-center">
                      <div className="h-10 w-full bg-yellow-500 shadow-inner"></div>
                   </div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-200 group-hover:animate-spin-slow">
                      <div className="text-yellow-900 font-black text-lg">OPEN</div>
                   </div>
                   {/* Festive Glitter Overlay */}
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-20"></div>
                 </div>
               </div>
             ) : (
               <div className="text-center space-y-10 animate-scale-in max-w-xl bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-md">
                 <div className="text-9xl animate-bounce drop-shadow-2xl">🌟</div>
                 <h3 className="text-6xl md:text-7xl font-christmas text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">You Sparkle, {crushName}!</h3>
                 <p className="text-2xl md:text-3xl text-slate-200 italic leading-relaxed font-christmas">
                   "Tareef ki adat ho gai h kyaaa... Bhago yaha seeeeee......, Wiase meri tareef kar sakti ho 🐼 me thodi mana karungaaaa.... And I hope this small thing will make your day happy and a smile on your face.. lips to lambe haiii hi tumharee😂"
                 </p>
                 <div className="pt-10">
                   <button 
                    onClick={() => setOpenedGift(false)}
                    className="bg-white/5 px-8 py-3 rounded-full hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest border border-white/10 text-slate-400"
                   >
                     Re-wrap Gift 🎁
                   </button>
                 </div>
               </div>
             )}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full p-6 text-center text-[10px] uppercase tracking-[0.5em] opacity-30 z-40 backdrop-blur-sm select-none">
        Handcrafted for {crushName} • My LIL Angle Miss
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
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.9; }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-scale-in { animation: scale-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;
