"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Download, RotateCcw, Menu, X, Compass, Flower2, User, ChevronRight, ArrowLeft } from 'lucide-react';

const PERFUME_MATCHES: { [key: string]: any } = {
  CALM: { brand: "LE LABO", title: "SANTAL 33", tag: "WOODY ARCHIVE", pantone: "7530 C", notes: { TOP: "紫羅蘭葉", HEART: "小荳蔻", BASE: "檀香木、皮革" }, description: "這款香水如同隱居於都市的智者，平靜中帶有極致的個人風格。", hex: "#8E867E" },
  WILD: { brand: "BYREDO", title: "MIXED EMOTIONS", tag: "RADICAL SPIRIT", pantone: "172 C", notes: { TOP: "瑪黛茶", HEART: "紅茶", BASE: "樺木" }, description: "混亂中的和諧，適合直覺強烈且不願被定義的自由靈魂。", hex: "#E2583E" },
  ETHERIAL: { brand: "DIPTYQUE", title: "L'EAU PAPIER", tag: "PAPER MUSK", pantone: "7527 C", notes: { TOP: "白麝香", HEART: "含羞草", BASE: "琥珀" }, description: "墨水在紙張上暈開的詩意，捕捉如晨霧般的通透美感。", hex: "#D0F0C0" },
  LUNAR: { brand: "AESOP", title: "GLOAM", tag: "FLORAL EARTH", pantone: "7512 C", notes: { TOP: "粉紅胡椒", HEART: "藏紅花", BASE: "鳶尾花" }, description: "這款香水以令人迷戀的香辛料氣息開場，逐漸綻放充滿活力的獨特花香。", hex: "#F5E050" },
  DARK: { brand: "BYREDO", title: "REINE DE NUIT", tag: "NIGHT VEIL", pantone: "Black 6 C", notes: { TOP: "黑醋栗", HEART: "焚香", BASE: "玫瑰" }, description: "在深夜中綻放的午夜玫瑰，冷冽、高貴且帶有侵略性的視覺美感。", hex: "#2D1B2D" },
  MYSTIC: { brand: "FUEGUIA 1833", title: "METAFORA", tag: "DREAMCORE", pantone: "Cool Gray 10 C", notes: { TOP: "粉紅胡椒", HEART: "茉莉花", BASE: "廣藿香" }, description: "超現實的層次轉換，像是夢境中冰冷的機械零件與花朵混雜的抽象感。", hex: "#707070" }
};

export default function Home() {
  const [step, setStep] = useState('login');
  const [qIndex, setQIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [sentiment, setSentiment] = useState({ CALM: 0, WILD: 0, ETHERIAL: 0, LUNAR: 0, DARK: 0, MYSTIC: 0 });
  const [progress, setProgress] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const totalRotation = useRef(0);
  const lastAngle = useRef<number | null>(null);

  const questions = [
    { q: "當你置身於一個空間，你最先注意到的是？", options: [{ t: "光影的留白", v: 'ETHERIAL' }, { t: "材質的觸感", v: 'CALM' }] },
    { q: "在一段漫長的沉默中，你期待什麼出現？", options: [{ t: "隱約的幽暗", v: 'DARK' }, { t: "溫潤的餘溫", v: 'LUNAR' }] },
    { q: "哪種自然元素最能代表你的能量？", options: [{ t: "流動的晨霧", v: 'ETHERIAL' }, { t: "無機的機械", v: 'MYSTIC' }] },
    { q: "你最渴望在哪種時刻停留在當下？", options: [{ t: "深夜的慶典", v: 'DARK' }, { t: "日落的奔跑", v: 'WILD' }] },
    { q: "你的直覺更傾向於哪種律動？", options: [{ t: "緩慢的潮汐", v: 'CALM' }, { t: "無規則的閃爍", v: 'MYSTIC' }] },
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
    if (step !== 'particle') return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    if (lastAngle.current !== null) {
      let delta = angle - lastAngle.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      totalRotation.current += Math.abs(delta);
      const newProgress = Math.min(100, (totalRotation.current / 1200) * 100);
      setProgress(newProgress);
      if (newProgress >= 100) {
        setStep('result');
      }
    }
    lastAngle.current = angle;
  };

  const saveResultCard = async () => {
    if(!resultRef.current) return;
    setIsCapturing(true); 
    await new Promise(r => setTimeout(r, 200));
    const html2canvas = (await import('html2canvas')).default;
    try {
      const canvas = await html2canvas(resultRef.current, { 
        scale: 3, 
        backgroundColor: '#FDFDFD', // 固化背景色，解決發白問題
        useCORS: true, 
        logging: false,
        removeContainer: true
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
        @keyframes visionFocus { 0% { filter: blur(20px); opacity: 0; } 100% { filter: blur(0px); opacity: 1; } }
      `}} />

      {/* 導航 */}
      <nav className="fixed top-0 left-0 w-full z-[110] px-8 py-6 flex justify-between items-center">
        <div className="text-[9px] tracking-[0.8em] font-light opacity-60">SILENT ECHO</div>
        <button onClick={() => setNavOpen(!navOpen)} className="p-2 opacity-20 hover:opacity-100 transition-opacity">
          {navOpen ? <X size={18} strokeWidth={1} /> : <Menu size={18} strokeWidth={1} />}
        </button>
      </nav>

      {/* 登入首頁 */}
      {step === 'login' && (
        <div className={`w-full flex flex-col items-center justify-center gap-20 ${fadeClass}`}>
           <div className="relative flex items-center justify-center">
             <div className="absolute w-48 h-48 border border-black/5 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
             <div className="w-1.5 h-1.5 bg-black rounded-full mb-4" />
             <span className="absolute mt-12 text-[8px] tracking-[0.8em] text-black/20 uppercase pl-[0.8em]">FIND YOUR SCENT</span>
           </div>
          <button onClick={() => { setIsVisible(false); setTimeout(() => { setStep('quiz'); setIsVisible(true); }, 800); }} className="px-12 py-4 border border-black/10 text-[9px] tracking-[0.6em] hover:bg-black hover:text-white transition-all uppercase pl-[0.6em]">
            ENTER PATH
          </button>
        </div>
      )}

      {/* 測驗過程 (省略重複邏輯以節省篇幅，同前版) */}
      {step === 'quiz' && (
        <div className={`max-w-xl w-full text-center ${fadeClass}`}>
          <p className="text-[8px] tracking-[1em] text-black/10 uppercase mb-24">OPTION 0{qIndex + 1}</p>
          <p className="text-xl mb-24 text-black/70 font-light px-6 leading-relaxed">「 {questions[qIndex].q} 」</p>
          <div className="flex flex-col gap-10">
            {questions[qIndex].options.map((opt, i) => (
              <button key={i} onClick={() => handleNextQuiz(opt.v)} className="group text-[10px] tracking-[0.4em] text-black/30 hover:text-black transition-all duration-500 uppercase">
                <span className="mb-2 block group-hover:tracking-[0.6em] transition-all">{opt.t}</span>
                <div className="w-0 h-[0.5px] bg-black/20 mx-auto group-hover:w-16 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 粒子儀式 */}
      {step === 'particle' && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="text-[9px] tracking-[1em] text-black/10 uppercase animate-pulse">RESONATING...</div>
        </div>
      )}

      {/* 結果頁面：完全還原參考圖樣式 */}
      {step === 'result' && (
        <div ref={resultRef} className={`w-full max-w-[420px] bg-[#FDFDFD] text-black p-16 relative overflow-hidden flex flex-col items-center`} style={{ animation: 'visionFocus 3s forwards' }}>
          {/* 背景漸層 */}
          <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: `radial-gradient(circle at center, transparent 0%, #FDFDFD 85%)`, opacity: 0.5 }} />
          
          <div className="relative z-10 w-full text-center">
            {/* Header */}
            <div className="flex justify-between text-[7px] tracking-[0.3em] text-black/30 mb-20 uppercase">
              <span>PANTONE® {res.pantone}</span>
              <span>{res.tag}</span>
            </div>

            {/* Brand & Title */}
            <p className="text-[10px] tracking-[0.5em] text-black/30 mb-4 uppercase pl-[0.5em]">{res.brand}</p>
            <h1 className="text-4xl font-light mb-10 tracking-[0.15em] uppercase">{res.title}</h1>
            
            {/* Description */}
            <p className="text-[10px] text-black/40 italic mb-16 leading-[2.2] px-6">{res.description}</p>
            
            {/* Separator */}
            <div className="w-full h-[0.5px] bg-black/5 mb-16" />

            {/* Notes Section */}
            <div className="space-y-12 mb-16">
              {Object.entries(res.notes).map(([key, note]: any) => (
                <div key={key} className="flex flex-col items-center uppercase">
                  <span className="text-[6px] tracking-[0.5em] text-black/20 mb-2">{key} NOTE</span>
                  <span className="text-[12px] tracking-[0.2em] text-black/70 font-light">{note}</span>
                </div>
              ))}
            </div>

            {/* Separator */}
            <div className="w-full h-[0.5px] bg-black/5 mb-16" />

            {/* Bottom Actions (Icons) */}
            {!isCapturing && (
              <div className="flex justify-center gap-16 mt-4">
                <button onClick={saveResultCard} className="flex flex-col items-center gap-3 group">
                  <Download size={18} strokeWidth={1} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[7px] tracking-[0.3em] opacity-20 group-hover:opacity-60 uppercase">SAVE MATCH</span>
                </button>
                <button onClick={() => window.location.reload()} className="flex flex-col items-center gap-3 group">
                  <RotateCcw size={18} strokeWidth={1} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[7px] tracking-[0.3em] opacity-20 group-hover:opacity-60 uppercase">RETRY</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}