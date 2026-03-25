"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Download, RotateCcw, Menu, X, Compass, Flower2, User, ChevronRight, ArrowLeft, Layers, Microscope } from 'lucide-react';

const PERFUME_MATCHES: { [key: string]: any } = {
  CALM: { brand: "LE LABO", title: "Santal 33", tag: "WOODY ARCHIVE", pantone: "7530 C", notes: { Top: "紫羅蘭葉、小荳蔻", Heart: "鳶尾花、紙莎草", Base: "檀香木、皮革、琥珀" }, description: "隱居於都市的智者，平靜中帶有極致的個人風格。", hex: "#8E867E" },
  WILD: { brand: "BYREDO", title: "Mixed Emotions", tag: "RADICAL SPIRIT", pantone: "172 C", notes: { Top: "瑪黛茶、黑醋栗", Heart: "錫蘭紅茶、紫羅蘭葉", Base: "樺木、紙莎草" }, description: "混難中的和諧，適合直覺強烈且不願被定義的自由靈魂。", hex: "#E2583E" },
  ETHERIAL: { brand: "DIPTYQUE", title: "L'Eau Papier", tag: "PAPER MUSK", pantone: "7527 C", notes: { Top: "白麝香", Heart: "含羞草、芝麻", Base: "琥珀、木質香" }, description: "墨水在紙張上暈開的詩意，捕捉如晨霧般的通透美感。", hex: "#D0F0C0" },
  LUNAR: { brand: "AESOP", title: "Gloam", tag: "FLORAL EARTH", pantone: "7512 C", notes: { Top: "粉紅胡椒、小荳蔻、苦橙葉", Heart: "藏紅花、茉莉花、含羞草", Base: "鳶尾花、廣藿香、古巴香脂" }, description: "這款香水以令人迷戀的香辛料氣息開場，逐漸綻放充滿活力的獨特花香。", hex: "#F5E050" },
  DARK: { brand: "BYREDO", title: "Reine de Nuit", tag: "NIGHT VEIL", pantone: "Black 6 C", notes: { Top: "黑醋栗、番紅花", Heart: "焚香、玫瑰", Base: "黃葵籽、廣藿香" }, description: "在深夜中綻放的午夜玫瑰，冷冽、高貴且帶有侵略性的視覺美感。", hex: "#2D1B2D" },
  MYSTIC: { brand: "FUEGUIA 1833", title: "Metafora", tag: "DREAMCORE", pantone: "Cool Gray 10 C", notes: { Top: "粉紅胡椒", Heart: "茉莉花", Base: "廣藿香" }, description: "超現實的層次轉換，像是夢境中冰冷的機械零件與花朵混雜的抽象感。", hex: "#707070" }
};

export default function Home() {
  const [step, setStep] = useState('login');
  const [qIndex, setQIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [sentiment, setSentiment] = useState({ CALM: 0, WILD: 0, ETHERIAL: 0, LUNAR: 0, DARK: 0, MYSTIC: 0 });
  const [isCapturing, setIsCapturing] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

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
        setStep('result');
        setIsVisible(true);
      }
    }, 800);
  };

  const saveResultCard = async () => {
    if(!resultRef.current) return;
    setIsCapturing(true); 
    await new Promise(r => setTimeout(r, 300)); // 給予足夠的渲染緩衝
    const html2canvas = (await import('html2canvas')).default;
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2, // 適度降低倍率提高穩定性
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FDFDFD", // 顯式定義底色，防止全白
        onclone: (clonedDoc) => {
          const card = clonedDoc.querySelector('[data-result-card="true"]') as HTMLElement;
          if (card) {
            card.style.opacity = "1";
            card.style.filter = "none";
            // 💡 關鍵修正：截圖時強制使用「高明度」的乾淨背景
            const overlay = card.querySelector('[data-gradient-overlay="true"]') as HTMLElement;
            if (overlay) {
              overlay.style.opacity = "0.15"; 
              overlay.style.background = `radial-gradient(circle at center, ${res.hex} 0%, transparent 85%)`;
            }
          }
        }
      });
      const link = document.createElement('a');
      link.download = `Silent-Echo-Result.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) { 
      console.error("Capture failed:", err); 
    } finally { 
      setIsCapturing(false); 
    }
  };

  const resKey = Object.entries(sentiment).sort((a, b) => b[1] - a[1])[0][0];
  const res = PERFUME_MATCHES[resKey] || PERFUME_MATCHES.CALM;

  return (
    <main className="min-h-screen bg-[#FDFDFD] flex items-center justify-center text-black relative overflow-hidden font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes visionFocus { 0% { filter: blur(15px); opacity: 0; } 100% { filter: blur(0px); opacity: 1; } }
        @keyframes subtleFloat { 0%, 100% { opacity: 0.12; } 50% { opacity: 0.22; } }
      `}} />

      {step === 'login' && (
        <button onClick={() => setStep('quiz')} className="px-12 py-4 border border-black/10 tracking-[0.5em] text-[12px] uppercase hover:bg-black hover:text-white transition-all">START DISCOVERY</button>
      )}

      {step === 'quiz' && (
        <div className={`text-center px-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-2xl font-light mb-20 leading-relaxed">「 {questions[qIndex].q} 」</p>
          <div className="flex flex-col gap-8">
            {questions[qIndex].options.map((opt, i) => (
              <button key={i} onClick={() => handleNextQuiz(opt.v)} className="text-[12px] tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity uppercase">{opt.t}</button>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="w-full flex flex-col items-center">
          <div ref={resultRef} data-result-card="true" className={`w-[380px] bg-[#FDFDFD] p-12 relative flex flex-col items-center border border-black/[0.03] ${isCapturing ? '!filter-none !opacity-100' : 'animate-[visionFocus_2s_forwards]'}`}>
            
            {/* 背景氛圍層：確保顏色乾淨、通透 */}
            <div data-gradient-overlay="true" className="absolute inset-0 z-0 pointer-events-none" 
                 style={{ 
                   background: `radial-gradient(circle at center, ${res.hex} 0%, transparent 80%)`, 
                   opacity: isCapturing ? 0.15 : 0.1,
                   animation: isCapturing ? 'none' : 'subtleFloat 6s infinite ease-in-out'
                 }} 
            />
            
            <div className="relative z-10 w-full text-center">
              <div className="flex justify-between w-full text-[7px] tracking-[0.4em] opacity-20 mb-16 uppercase">
                <span>PANTONE® {res.pantone}</span><span>{res.tag}</span>
              </div>
              <p className="text-[9px] tracking-[0.5em] text-black/30 mb-2 uppercase">{res.brand}</p>
              <h1 className="text-2xl font-light mb-10 tracking-[0.15em] uppercase">{res.title}</h1>
              <p className="text-[11px] text-black/40 italic mb-16 leading-relaxed px-2">{res.description}</p>
              
              <div className="w-full h-[0.5px] bg-black/[0.05] mb-12" />
              <div className="space-y-10 mb-12">
                {Object.entries(res.notes).map(([k, v]: any) => (
                  <div key={k} className="flex flex-col">
                    <span className="text-[6px] tracking-[0.6em] text-black/10 mb-1 uppercase">{k} NOTE</span>
                    <span className="text-[11px] tracking-[0.1em] text-black/60">{v}</span>
                  </div>
                ))}
              </div>
              <div className="w-full h-[0.5px] bg-black/[0.05] mb-16" />

              <div className="flex justify-center gap-12">
                <button onClick={saveResultCard} className="flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-all text-[7px] tracking-widest uppercase">
                  <Download size={16} strokeWidth={1} />SAVE MATCH
                </button>
                <button onClick={() => window.location.reload()} className="flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-all text-[7px] tracking-widest uppercase">
                  <RotateCcw size={16} strokeWidth={1} />RETRY
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}