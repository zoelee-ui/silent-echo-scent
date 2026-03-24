"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';

const SCENT_PROFILES: { [key: string]: any } = {
  CALM: { 
    tag: "DEEP OCEAN", title: "深海隱士", 
    pantone: "19-4052 TCX", notes: { Top: "海鹽", Heart: "鼠尾草", Base: "琥珀" },
    therapy: "深海波動能強制平復神經系統。", hex: "#0F4C81",
    poems: ["月色與雪色之間，你是絕對的留白"] 
  },
  WILD: { 
    tag: "SACRED FIRE", title: "荒野行者", 
    pantone: "17-1456 TCX", notes: { Top: "粉紅胡椒", Heart: "煙燻皮革", Base: "大西洋雪松" },
    therapy: "火焰動能喚醒感官直覺。", hex: "#E2583E",
    poems: ["我在廢墟中開出的花，最為驚豔"] 
  },
  ETHERIAL: { 
    tag: "MISTY MOSS", title: "極光詩人", 
    pantone: "13-0111 TCX", notes: { Top: "佛手柑", Heart: "白毫銀針", Base: "清冷麝香" },
    therapy: "草木留白感，找回思緒通透性。", hex: "#D0F0C0",
    poems: ["林深時見鹿，海藍時見鯨"] 
  },
  LUNAR: { 
    tag: "LUNAR LIGHT", title: "月光旅人", 
    pantone: "12-0727 TCX", notes: { Top: "桂花", Heart: "檀香", Base: "琥珀" },
    therapy: "月光的溫潤能軟化情緒邊界。", hex: "#F5E050",
    poems: ["今晚月色真美，風也溫柔"] 
  }
};

export default function Home() {
  const [step, setStep] = useState('login');
  const [qIndex, setQIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [sentiment, setSentiment] = useState({ CALM: 0, WILD: 0, ETHERIAL: 0, LUNAR: 0 });
  const [progress, setProgress] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const [showBlindLight, setShowBlindLight] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const lastAngle = useRef<number | null>(null);
  const totalRotation = useRef(0);

  const questions = [
    { q: "當你閉上眼，你感知到的空間尺度是？", options: [{ t: "無限延伸的水平線", v: 'CALM' }, { t: "垂直向上的光束", v: 'ETHERIAL' }] },
    { q: "在一段漫長的沉默中，你期待什麼出現？", options: [{ t: "溫潤的餘溫", v: 'LUNAR' }, { t: "劇烈的爆裂聲", v: 'WILD' }] },
    { q: "若要選擇一種守護你的物質？", options: [{ t: "古老的原石", v: 'CALM' }, { t: "流動的晨露", v: 'ETHERIAL' }] },
    { q: "你最渴望在哪種時刻停留在當下？", options: [{ t: "深夜的獨處", v: 'LUNAR' }, { t: "日落的奔跑", v: 'WILD' }] },
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
      link.download = `SilentEcho-Result.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) { console.error(err); } finally { setIsCapturing(false); }
  };

  const resKey = Object.entries(sentiment).sort((a, b) => b[1] - a[1])[0][0];
  const res = SCENT_PROFILES[resKey] || SCENT_PROFILES.CALM;
  const fadeClass = `transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}`;

  return (
    <main className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 text-black select-none relative overflow-hidden font-sans" onMouseMove={handleMouseMove}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes nebulaFlow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes ringShock { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(4); opacity: 0; } }
        @keyframes blindLight { 0% { opacity: 0; } 20% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes visionFocus { 0% { filter: blur(20px); opacity: 0; } 100% { filter: blur(0px); opacity: 1; } }
        @keyframes noiseBreathe { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.2; } }
        @keyframes lowSaturatePulse {
          0%, 100% { opacity: 0.2; filter: blur(60px) saturate(30%); }
          50% { opacity: 0.35; filter: blur(80px) saturate(45%); }
        }
      `}} />

      {showBlindLight && <div className="fixed inset-0 bg-white z-[100] animate-[blindLight_1s_ease-out_forwards]" />}

      {step === 'login' && (
        <div className={`max-w-md w-full text-center ${fadeClass}`}>
          <div className="relative w-40 h-56 mx-auto mb-20 flex flex-col items-center justify-start pt-16 group">
            <div className="relative w-32 h-32 rounded-full border border-black/15 animate-[noiseBreathe_8s_infinite] border-dashed" />
            <div className="absolute top-[68%] -translate-y-1/2 flex flex-col items-center">
              <div className="w-1.5 h-1.5 bg-black rounded-full mb-8" />
              <span className="text-[7.5px] tracking-[1.15em] pl-[1.15em] text-black/40">SILENT ECHO</span>
            </div>
          </div>
          <button onClick={() => { setIsVisible(false); setTimeout(() => { setStep('quiz'); setIsVisible(true); }, 900); }} className="group relative px-12 py-3 overflow-hidden border border-black/10 hover:border-black transition-colors duration-500">
            <span className="relative z-10 text-[10px] tracking-[0.6em] group-hover:text-white transition-colors duration-500 uppercase">START</span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          </button>
        </div>
      )}

      {step === 'quiz' && (
        <div className={`max-w-xl w-full text-center ${fadeClass}`}>
          {/* 文案已修正為 QUESTION */}
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
                  style={{ 
                    background: `radial-gradient(circle at center, ${res.hex} 0%, #FDFDFD 80%)`,
                  }} />
          </div>
          <div className="relative z-10 text-center">
            <div className="flex justify-between text-[7px] tracking-[0.4em] opacity-30 mb-16 uppercase">
              <span>PANTONE® {res.pantone}</span>
              <span>{res.tag}</span>
            </div>
            <h1 className="text-3xl font-light mb-8 tracking-[0.1em] uppercase">{res.title}</h1>
            <p className="text-[12px] text-black/40 italic mb-16 leading-relaxed">「 {res.poems[0]} 」</p>
            <div className="mb-16 border-l border-black/5 pl-8 text-left">
              <h4 className="text-[8px] tracking-[0.4em] text-black/20 uppercase mb-4 font-bold">Therapy Protocol</h4>
              <p className="text-[11px] text-black/60 leading-relaxed">{res.therapy}</p>
            </div>
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
                <span className="text-[7px] tracking-widest uppercase">Save</span>
              </button>
              <button onClick={() => window.location.reload()} className="group flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-all duration-700 ease-in-out">
                <RotateCcw size={18} strokeWidth={1} className="group-hover:rotate-45 transition-transform duration-700" />
                <span className="text-[7px] tracking-widest uppercase">Restart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}