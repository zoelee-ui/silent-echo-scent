"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Download, RotateCcw, Menu, X, Compass, Flower2, User } from 'lucide-react';

// 1. 市售香水資料庫 (對應測驗結果)
const PERFUME_MATCHES: { [key: string]: any } = {
  CALM: { 
    brand: "LE LABO", title: "Santal 33", 
    tag: "WOODY ARCHIVE", pantone: "7530 C",
    notes: { Top: "紫羅蘭葉", Heart: "小荳蔻", Base: "檀香木、皮革" },
    description: "這款香水如同隱居於都市的智者，平靜中帶有極致的個人風格。",
    hex: "#8E867E"
  },
  WILD: { 
    brand: "BYREDO", title: "Mixed Emotions", 
    tag: "RADICAL SPIRIT", pantone: "172 C",
    notes: { Top: "瑪黛茶", Heart: "黑醋栗", Base: "樺木、紙莎草" },
    description: "混亂中的和諧，適合直覺強烈且不願被定義的自由靈魂。",
    hex: "#E2583E"
  },
  ETHERIAL: { 
    brand: "DIPTYQUE", title: "L'Eau Papier", 
    tag: "PAPER MUSK", pantone: "7527 C",
    notes: { Top: "芝麻", Heart: "含羞草", Base: "白麝香、木質香" },
    description: "墨水在紙張上暈開的詩意，捕捉如晨霧般的通透美感。",
    hex: "#D0F0C0"
  },
  LUNAR: { 
    brand: "AESOP", title: "Gloam", 
    tag: "FLORAL SHADOW", pantone: "7512 C",
    notes: { Top: "粉紅胡椒", Heart: "藏紅花", Base: "鳶尾花、廣藿香" },
    description: "夜晚的溫潤律動，在靜謐的月光下緩緩綻放感官層次。",
    hex: "#F5E050"
  }
};

export default function Home() {
  const [step, setStep] = useState('login');
  const [qIndex, setQIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [sentiment, setSentiment] = useState({ CALM: 0, WILD: 0, ETHERIAL: 0, LUNAR: 0 });
  const [progress, setProgress] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const [showBlindLight, setShowBlindLight] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const lastAngle = useRef<number | null>(null);
  const totalRotation = useRef(0);

  const questions = [
    { q: "當你置身於一個空間，你最先注意到的是？", options: [{ t: "光影的留白", v: 'ETHERIAL' }, { t: "材質的觸感", v: 'CALM' }] },
    { q: "你傾向如何開啟一段對話？", options: [{ t: "溫柔地傾聽", v: 'LUNAR' }, { t: "直接地表達", v: 'WILD' }] },
    { q: "哪種自然元素最能代表你的能量？", options: [{ t: "深埋的礦石", v: 'CALM' }, { t: "流動的晨霧", v: 'ETHERIAL' }] },
    { q: "在人群中，你更享受哪種狀態？", options: [{ t: "靜謐的觀察者", v: 'LUNAR' }, { t: "熱情的帶領者", v: 'WILD' }] },
    { q: "你的直覺更傾向於哪種律動？", options: [{ t: "緩慢的潮汐", v: 'CALM' }, { t: "無規則的閃爍", v: 'WILD' }] },
  ];

  const handleNextQuiz = (val: string) => {
    setSentiment(prev => ({ ...prev, [val]: prev[val as keyof typeof sentiment] + 1 }));
    setIsVisible(false);
    setTimeout(() => {
      if (qIndex < questions.length - 1) {
        setQIndex(qIndex + 1);
        setIsVisible(true);
      } else {
        setStep('particle');
        setIsVisible(true);
      }
    }, 800);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (step !== 'particle' || isExploding) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    if (lastAngle.current !== null) {
      let delta = angle - lastAngle.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      totalRotation.current += Math.abs(delta);
      const newProgress = Math.min(100, (totalRotation.current / 1200) * 100);
      setProgress(newProgress);
      if (newProgress >= 100) {
        setIsExploding(true);
        setTimeout(() => setShowBlindLight(true), 200);
        setTimeout(() => { setStep('result'); setShowBlindLight(false); }, 1200);
      }
    }
    lastAngle.current = angle;
  };

  const saveResultCard = async () => {
    if(!resultRef.current) return;
    setIsCapturing(true); 
    await new Promise(r => setTimeout(r, 100));
    const html2canvas = (await import('html2canvas')).default;
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 3,
        backgroundColor: '#FDFDFD', 
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `Scent-Match-Result.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) { console.error(err); } finally { setIsCapturing(false); }
  };

  const resKey = Object.entries(sentiment).sort((a, b) => b[1] - a[1])[0][0];
  const res = PERFUME_MATCHES[resKey] || PERFUME_MATCHES.CALM;
  const fadeClass = `transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}`;

  return (
    <main className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 text-black select-none relative overflow-hidden font-sans" onMouseMove={handleMouseMove}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes nebulaFlow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes ringShock { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(4); opacity: 0; } }
        @keyframes blindLight { 0% { opacity: 0; } 20% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes visionFocus { 0% { filter: blur(20px); opacity: 0; } 100% { filter: blur(0px); opacity: 1; } }
        @keyframes lowSaturatePulse {
          0%, 100% { opacity: 0.15; filter: blur(60px) saturate(30%); }
          50% { opacity: 0.25; filter: blur(80px) saturate(45%); }
        }
      `}} />

      {/* 3. 導航欄功能 (Navigation Bar) */}
      <nav className="fixed top-0 left-0 w-full z-[110] px-8 py-6 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-black/[0.03]">
        <div className="text-[9px] tracking-[0.8em] font-light opacity-60">SILENT ECHO</div>
        <button onClick={() => setNavOpen(!navOpen)} className="p-2 hover:opacity-50 transition-opacity">
          {navOpen ? <X size={18} strokeWidth={1} /> : <Menu size={18} strokeWidth={1} />}
        </button>
      </nav>

      {/* 導航展開菜單 */}
      <div className={`fixed inset-0 z-[105] bg-[#FDFDFD]/95 backdrop-blur-xl transition-all duration-700 ease-in-out ${navOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="h-full flex flex-col items-center justify-center gap-12">
          {[
            { label: "BRAND STORY", icon: <Compass size={16} /> },
            { label: "SCENT TEST", icon: <Flower2 size={16} /> },
            { label: "VIP PORTAL", icon: <User size={16} /> }
          ].map((item, idx) => (
            <button key={idx} className="group flex items-center gap-4 text-[10px] tracking-[0.5em] opacity-40 hover:opacity-100 transition-all">
              <span className="group-hover:rotate-12 transition-transform">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {showBlindLight && <div className="fixed inset-0 bg-white z-[120] animate-[blindLight_1s_ease-out_forwards]" />}

      {step === 'login' && (
        <div className={`max-w-md w-full text-center ${fadeClass}`}>
          <div className="relative w-40 h-56 mx-auto mb-20 flex flex-col items-center justify-start pt-16 group">
            <div className="relative w-32 h-32 rounded-full border border-black/15 animate-[nebulaFlow_15s_infinite] border-dashed" />
            <div className="absolute top-[68%] -translate-y-1/2 flex flex-col items-center">
              <div className="w-1.5 h-1.5 bg-black rounded-full mb-8" />
              <span className="text-[7.5px] tracking-[1.15em] pl-[1.15em] text-black/40 uppercase">Find Your Scent</span>
            </div>
          </div>
          <button onClick={() => { setIsVisible(false); setTimeout(() => { setStep('quiz'); setIsVisible(true); }, 900); }} className="group relative px-12 py-3 overflow-hidden border border-black/10 hover:border-black transition-colors duration-500">
            <span className="relative z-10 text-[10px] tracking-[0.6em] group-hover:text-white transition-colors duration-500 uppercase">ENTER PATH</span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          </button>
        </div>
      )}

      {step === 'quiz' && (
        <div className={`max-w-xl w-full text-center ${fadeClass}`}>
          <p className="text-[8px] tracking-[1em] text-black/20 uppercase mb-24">QUESTION 0{qIndex + 1}</p>
          <p className="text-2xl mb-24 text-black/80 font-light px-6">「 {questions[qIndex].q} 」</p>
          <div className="flex flex-col gap-10">
            {questions[qIndex].options.map((opt, i) => (
              <button key={i} onClick={() => handleNextQuiz(opt.v)} className="group text-[11px] tracking-[0.4em] text-black/40 hover:text-black transition-all duration-500 flex flex-col items-center uppercase">
                <span className="mb-2 group-hover:tracking-[0.8em] group-hover:text-black transition-all duration-700 ease-in-out">{opt.t}</span>
                <div className="w-0 h-[0.5px] bg-black/40 group-hover:w-24 group-hover:bg-black transition-all duration-700 ease-in-out"></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'particle' && (
        <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute z-20 text-[10px] tracking-[1.2em] text-black/20 uppercase" style={{ opacity: Math.max(0, 1 - progress / 50) }}>於虛無中畫圓</div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-[-10%] bg-[#FDFDFD]" style={{ filter: `blur(${30 - progress * 0.3}px)`, background: `radial-gradient(circle at center, transparent ${progress * 0.5}%, #FDFDFD ${progress + 20}%)` }} />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="absolute inset-0 opacity-40 animate-[nebulaFlow_15s_infinite]" style={{ background: `radial-gradient(circle at ${30+i*20}% ${40+i*10}%, white 0%, transparent 70%)`, animationDelay: `${i*-5}s` }} />
            ))}
          </div>
          {isExploding && <div className="absolute z-30 w-10 h-10 border border-black/20 rounded-full animate-[ringShock_0.8s_forwards]" />}
          <div className="absolute inset-0 transition-opacity duration-[2000ms]" style={{ backgroundColor: res.hex, opacity: progress * 0.004 }} />
        </div>
      )}

      {step === 'result' && (
        <div ref={resultRef} className={`w-full max-w-[420px] bg-[#FDFDFD] text-black p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-black/[0.02] relative overflow-hidden ${isCapturing ? '!filter-none !opacity-100' : ''}`} style={{ animation: isCapturing ? 'none' : 'visionFocus 3s forwards' }}>
          <div className="absolute inset-0 opacity-100 pointer-events-none">
             <div className="absolute inset-0 animate-[lowSaturatePulse_8s_infinite] transition-opacity duration-[3000ms]" 
                  style={{ background: `radial-gradient(circle at center, ${res.hex} 0%, #FDFDFD 80%)` }} />
          </div>
          <div className="relative z-10 text-center">
            <div className="flex justify-between text-[7px] tracking-[0.4em] opacity-30 mb-16 uppercase">
              <span>PANTONE® {res.pantone}</span>
              <span>{res.tag}</span>
            </div>
            <p className="text-[10px] tracking-[0.4em] text-black/30 mb-2 uppercase">{res.brand}</p>
            <h1 className="text-3xl font-light mb-8 tracking-[0.1em] uppercase">{res.title}</h1>
            <p className="text-[11px] text-black/50 italic mb-16 leading-relaxed px-4">{res.description}</p>
            
            <div className="grid grid-cols-1 gap-10 py-8 border-y border-black/5 mb-16">
               {Object.entries(res.notes).map(([key, note]: any) => (
                 <div key={key} className="flex flex-col items-center">
                   <span className="text-[6px] tracking-[0.8em] text-black/10 uppercase mb-1">{key} Note</span>
                   <span className="text-[11px] tracking-[0.2em] text-black/70">{note}</span>
                 </div>
               ))}
            </div>
            
            <div className="flex justify-center gap-12 border-t border-black/5 pt-8">
              <button onClick={saveResultCard} className="group flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-all duration-700 ease-in-out">
                <Download size={18} strokeWidth={1} className="group-hover:translate-y-[1px] transition-transform duration-500" />
                <span className="text-[7px] tracking-widest uppercase">Save Match</span>
              </button>
              <button onClick={() => window.location.reload()} className="group flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-all duration-700 ease-in-out">
                <RotateCcw size={18} strokeWidth={1} className="group-hover:rotate-45 transition-transform duration-700" />
                <span className="text-[7px] tracking-widest uppercase">Retry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}