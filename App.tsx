
import React, { useState, useEffect, useRef } from 'react';
import Snowfall from './components/Snowfall';
import Santa from './components/Santa';
import { AppState, ChristmasPoem } from './types';
import { generateChristmasPoem } from './services/geminiService';

// Reliable Christmas track for mobile browsers
const FESTIVE_TRACK = 'https://www.chosic.com/wp-content/uploads/2021/11/Jingle-Bells-Christmas-Instrumental.mp3';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.HOME);
  const [crushName, setCrushName] = useState('Prachiii');
  const [mood, setMood] = useState('sweet');
  const [poem, setPoem] = useState<ChristmasPoem | null>(null);
  const [loading, setLoading] = useState(false);
  const [openedGift, setOpenedGift] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showUnlock, setShowUnlock] = useState(true);
  
  const audioObj = useRef<HTMLAudioElement | null>(null);
  
  const [personalNoteText] = useState(`Hey Prachiii, 

Umeed karta hu acchi hogi tum. Tabiyat wagerah bhi acchi hogi. Thandi nhi lagi hogi 😂 Nahaya nhi hoga atleast 1 mahine se 🐼😼 Ha ha me sab janta hu 😼🐣  

Dekho To zara is ladki ko, kitna chamak rhi h aaj 😒🦥 kya h is cartooni ladki ka raaz, aise hi raho idiot ladkiiiii...... Waise me christmas wish bhi kisko kar rha hu........... jo khud ek angel h, batao kitna nadan hu me🐣!

Kehte h ki duaaa or daan bata ke nhi karteeee.... .. bas dil se karte h........... toh me tumhare liye ye chhoti si duaa karta hu ki tum hamesha khush raho, tumhari zindagi me hamesha pyaar or khushiyaan bani rahe..... or tum jese log hamesha apne aas paas khushiyaan baant te rahe...... or haan me us din thaaa gussee me lekin us din ke baad nhiiii (spelling mistakes thi us dairy me🐼), usme likhaa tha na sab trash ho gaya... Isiliye ye 12 bajne ke pahla bana rha hu taaki prove kar saku ki haaa.... I'm still the same little girllll... 
Mere se itne jaldi peecha nhi chootegaaaa....... 
Hamesha Khush raho.... 🎄🎁❄️❤️`);

  const startMagic = () => {
    // 1. Create and Load Audio immediately on user click (Mandatory for Mobile)
    if (!audioObj.current) {
      const audio = new Audio(FESTIVE_TRACK);
      audio.loop = true;
      audio.volume = 0.5;
      audio.load(); // Pre-load source
      audioObj.current = audio;
    }

    // 2. Play immediately in the same click event
    audioObj.current.play()
      .then(() => {
        setIsMuted(false);
        setShowUnlock(false);
      })
      .catch((err) => {
        console.error("Autoplay prevented:", err);
        // If it still fails, we enter the site so she can see the content
        setShowUnlock(false);
      });
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioObj.current) {
      if (audioObj.current.paused) {
        audioObj.current.play();
        setIsMuted(false);
      } else {
        audioObj.current.pause();
        setIsMuted(true);
      }
    }
  };

  const handleCreatePoem = async () => {
    if (!crushName) return;
    setLoading(true);
    try {
      const result = await generateChristmasPoem(crushName, mood);
      setPoem(result);
      setView(AppState.MESSAGE_GEN);
    } catch (error: any) {
      console.error("Gemini Error:", error);
      alert(`The North Pole is busy! 🎅\n\nDouble-check that you added 'API_KEY' to your Netlify Environment Variables.\n\nError detail: ${error.message}`);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen relative text-white selection:bg-red-500 selection:text-white overflow-x-hidden bg-gradient-to-b from-[#0f172a] via-[#7f1d1d] to-[#064e3b] font-sans">
      <Snowfall />
      <Santa />
      
      {/* 
          MOBILE UNLOCK SCREEN 
          Essential to satisfy mobile browser "User Interaction" requirements for audio.
      */}
      {showUnlock && (
        <div className="fixed inset-0 z-[100] bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
           <div className="text-8xl mb-8 animate-bounce">🎁</div>
           <h2 className="text-5xl md:text-7xl font-christmas text-red-500 mb-6 drop-shadow-2xl">A Gift for {crushName}...</h2>
           <p className="text-slate-400 mb-10 max-w-md text-lg italic leading-relaxed">
             "Tap the button to unwrap a digital Christmas wonderland and start the music."
           </p>
           <button 
            onClick={startMagic}
            className="bg-red-600 hover:bg-red-500 text-white px-14 py-6 rounded-full font-bold text-2xl shadow-[0_0_50px_rgba(220,38,38,0.6)] transition-all hover:scale-110 active:scale-95 border-b-8 border-red-800"
           >
             Unwrap Magic ✨
           </button>
        </div>
      )}

      {/* Music Control - Only shows after unwrap */}
      {!showUnlock && (
        <button 
          onClick={toggleMusic}
          className={`fixed bottom-10 left-10 z-50 p-5 rounded-full backdrop-blur-2xl border border-white/20 shadow-2xl transition-all hover:scale-110 active:scale-90 ${!isMuted ? 'bg-green-500/40 text-white animate-pulse' : 'bg-white/10 text-white/30'}`}
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
      )}

      {/* Header */}
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

      {/* Content */}
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

            <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl max-w-lg mx-auto">
              <h3 className="text-3xl font-semibold mb-8 font-christmas text-red-400 tracking-wide">Magic Poem Generator</h3>
              <div className="space-y-5">
                <input 
                  type="text" 
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-red-500 transition-all text-xl text-center placeholder:text-white/10"
                  value={crushName}
                  onChange={(e) => setCrushName(e.target.value)}
                  placeholder="Enter Name..."
                />
                <select 
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-red-500 text-xl appearance-none text-center"
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
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:scale-[1.02] py-6 rounded-2xl font-bold text-2xl shadow-2xl transition-all transform active:scale-95 flex justify-center items-center gap-4 mt-6 border-b-4 border-red-800"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  ) : (
                    <>Generate Magic ✨</>
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
              <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 hover:border-green-500/30 transition-all cursor-pointer group text-left shadow-2xl" onClick={() => setView(AppState.PERSONAL_NOTE)}>
                <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">✉️</div>
                <h4 className="text-3xl font-bold mb-4 text-green-400 font-christmas">A Heartfelt Note</h4>
                <p className="text-slate-400 text-lg">A private message kept warm for you in the North Pole.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 hover:border-red-500/30 transition-all cursor-pointer group text-left shadow-2xl" onClick={() => setView(AppState.SURPRISE)}>
                <div className="text-6xl mb-6 group-hover:rotate-12 transition-transform duration-500">🌟</div>
                <h4 className="text-3xl font-bold mb-4 text-red-400 font-christmas">Hidden Surprise</h4>
                <p className="text-slate-400 text-lg">Every Christmas tree has one special sparkle. Find yours.</p>
              </div>
            </div>
          </div>
        )}

        {view === AppState.MESSAGE_GEN && (
          <div className="animate-scale-in py-10 max-w-2xl mx-auto">
            <BackButton />
            {poem ? (
              <div className="bg-white p-16 md:p-24 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] transform -rotate-1 relative overflow-hidden text-center border-[12px] border-red-50">
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-600 transform translate-x-24 -translate-y-24 rotate-45 flex items-end justify-center pb-6">
                    <span className="text-white font-bold text-3xl -rotate-45">✨</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-christmas text-red-600 mb-12 font-bold">{poem.title}</h2>
                <div className="text-3xl md:text-4xl text-slate-800 leading-relaxed italic whitespace-pre-wrap font-christmas">
                  {poem.content}
                </div>
                <div className="mt-20 pt-10 border-t border-slate-100">
                   <p className="text-slate-400 text-sm mb-8 uppercase tracking-[0.3em] font-bold">Crafted for {crushName}</p>
                   <button onClick={() => setView(AppState.HOME)} className="bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95 text-xl">Back to Magic</button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-[4rem] backdrop-blur-sm border border-white/10">
                <div className="text-9xl mb-10 animate-bounce">🎅</div>
                <p className="text-3xl font-christmas text-red-400 animate-pulse tracking-widest">Santa is writing your poem...</p>
              </div>
            )}
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
                 <h3 className="text-6xl md:text-8xl font-christmas text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">You're Magic!</h3>
                 <p className="text-3xl md:text-4xl text-slate-100 italic leading-relaxed font-christmas">
                   "Tareef ki adat ho gai h kyaaa... Bhago yaha seeeeee......, Wiase meri tareef kar sakti ho 🐼 me thodi mana karungaaaa.... And I hope this small thing will make your day happy and a smile on your face.. lips to lambe haiii hi tumharee😂!"
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
        Holiday Magic for {crushName} • LIL ANGLE MISS
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
