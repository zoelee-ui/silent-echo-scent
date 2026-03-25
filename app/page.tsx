"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Download, RotateCcw, Menu, X, Compass, Flower2, User, ChevronRight, ArrowLeft, Layers, Microscope } from 'lucide-react';

const PERFUME_MATCHES: { [key: string]: any } = {
  CALM: { brand: "LE LABO", title: "Santal 33", tag: "WOODY ARCHIVE", pantone: "7530 C", notes: { Top: "紫羅蘭葉、小荳蔻", Heart: "鳶尾花、紙莎草", Base: "檀香木、皮革、琥珀" }, vipNote: "這支香水的靈魂在於澳洲檀香木的處理，呈現出一種略顯潮濕、如老舊圖書館般的紙張質感。", description: "隱居於都市的智者，平靜中帶有極致的個人風格。", hex: "#8E867E" },
  WILD: { brand: "BYREDO", title: "Mixed Emotions", tag: "RADICAL SPIRIT", pantone: "172 C", notes: { Top: "瑪黛茶、黑醋栗", Heart: "錫蘭紅茶、紫羅蘭葉", Base: "樺木、紙莎草" }, vipNote: "黑醋栗的酸與瑪黛茶的苦味在開場時會產生一種煙燻的衝突感，象徵著情緒的不可預測。", description: "混難中的和諧，適合直覺強烈且不願被定義的自由靈魂。", hex: "#E2583E" },
  ETHERIAL: { brand: "DIPTYQUE", title: "L'Eau Papier", tag: "PAPER MUSK", pantone: "7527 C", notes: { Top: "白麝香", Heart: "含羞草、芝麻", Base: "琥珀、木質香" }, vipNote: "白麝香與烘烤芝麻的結合創造出一種極具顆粒感的「墨水感」，這在現代調香中非常罕見。", description: "墨水在紙張上暈開的詩意，捕捉如晨霧般的通透美感。", hex: "#D0F0C0" },
  LUNAR: { brand: "AESOP", title: "Gloam", tag: "FLORAL EARTH", pantone: "7512 C", notes: { Top: "粉紅胡椒、小荳蔻、苦橙葉", Heart: "藏紅花、勞丹脂、茉莉", Base: "鳶尾花、廣藿香、古巴香脂" }, vipNote: "這款香水的高級感來自於古巴香脂的穩定性，它讓辛辣的前調平穩過渡到大地的草本氣息中。", description: "這款香水以令人迷戀的香辛料氣息開場，逐漸綻放充滿活力的獨特花香。", hex: "#F5E050" },
  DARK: { brand: "BYREDO", title: "Reine de Nuit", tag: "NIGHT VEIL", pantone: "Black 6 C", notes: { Top: "黑醋栗、番紅花", Heart: "焚香、玫瑰", Base: "黃葵籽、廣藿香" }, vipNote: "使用了高濃度的番紅花萃取，搭配略帶髒感的廣藿香，勾勒出一種帶有金屬感的哥德式冷酷。", description: "在深夜中綻放的午夜玫瑰，冷冽、高貴且帶有侵略性的視覺美感。", hex: "#2D1B2D" },
  MYSTIC: { brand: "FUEGUIA 1833", title: "Metafora", tag: "DREAMCORE", pantone: "Cool Gray 10 C", notes: { Top: "粉紅胡椒", Heart: "茉莉花", Base: "廣藿香" }, vipNote: "來自巴塔哥尼亞的天然原料，其氣味中含有一種難以捕捉的冷冽空氣感，像是清晨的機械廢墟。", description: "超現實的層次轉換，像是夢境中冰冷的機械零件與花朵混雜的抽象感。", hex: "#707070" }
};

export default function Home() {
  const [step, setStep] = useState('login');
  const [qIndex, setQIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [vipOpen, setVipOpen] = useState(false);
  const [vipStage, setVipStage] = useState('mission');
  const [vipCode, setVipCode] = useState('');
  const [sentiment, setSentiment] = useState({ CALM: 0, WILD: 0, ETHERIAL: 0, LUNAR: 0, DARK: 0, MYSTIC: 0 });
  const [progress, setProgress] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const [showBlindLight, setShowBlindLight] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const lastAngle = useRef<number | null>(null);
  const totalRotation = useRef(0);

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

  const handleVipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vipCode.toUpperCase() === 'ECHO-IG-2026') {
      setNavOpen(false);
      setVipOpen(false);
      setIsVisible(false);
      setTimeout(() => { setStep('vip_dashboard'); setIsVisible(true); }, 800);
    } else {
      setVipCode('');
      alert("INVALID CODE. PLEASE CHECK YOUR IG MISSION.");
    }
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
    <main className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4 md:p-12 text-black select-none relative overflow-hidden font-sans" onMouseMove={handleMouseMove}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes nebulaFlow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes ringShock { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(4); opacity: 0; } }
        @keyframes blindLight { 0% { opacity: 0; } 20% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes visionFocus { 0% { filter: blur(20px); opacity: 0; } 100% { filter: blur(0px); opacity: 1; } }
        
        /* ✅ 核心修正：不透明度增加 20% (從 0.15/0.25 -> 0.35/0.45)，飽和度增加 20% (從 30%/45% -> 50%/65%) */
        @keyframes lowSaturatePulse {
          0%, 100% { opacity: 0.35; filter: blur(60px) saturate(50%); }
          50% { opacity: 0.45; filter: blur(80px) saturate(65%); }
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}} />

      {/* Navigation, Story Popup, VIP Dashboard, Quiz, Particle 邏輯維持原樣 */}
      <nav className="fixed top-0 left-0 w-full z-[110] px-6 md:px-12 py-6 md:py-8 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-black/[0.03]">
        <div className="text-[9px] md:text-[11px] tracking-[0.8em] font-light opacity-60">SILENT ECHO</div>
        <button onClick={() => { setNavOpen(!navOpen); setVipOpen(false); }} className="p-2 hover:opacity-50 transition-opacity">
          {navOpen ? <X size={18} strokeWidth={1} /> : <Menu size={18} strokeWidth={1} />}
        </button>
      </nav>

      {/* 此處略過中間不變的 UI 組件以維持簡潔，請確保使用你目前專案中的完整內容 */}
      {/* ... (Login, Quiz, Particle, VIP Dashboard) ... */}

      {/* Result 頁面 */}
      {step === 'result' && (
        <div className="w-full flex flex-col items-center justify-center min-h-[80vh] py-10">
          <div ref={resultRef} className={`w-full max-w-[420px] md:max-w-[460px] bg-[#FDFDFD] text-black p-12 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-black/[0.02] relative overflow-hidden ${isCapturing ? '!filter-none !opacity-100' : ''}`} style={{ animation: isCapturing ? 'none' : 'visionFocus 3s forwards' }}>
            <div className="absolute inset-0 opacity-100 pointer-events-none">
                {!isCapturing && (
                  /* ✅ 修正：增加基礎氛圍不透明度，讓色彩層在截圖時不會變全白 */
                  <div className="absolute inset-0 animate-[lowSaturatePulse_8s_infinite] transition-opacity duration-[3000ms]" style={{ background: `radial-gradient(circle at center, ${res.hex} 0%, #FDFDFD 85%)`, opacity: 0.8 }} />
                )}
            </div>
            <div className="relative z-10 text-center">
              <div className="flex justify-between text-[7px] md:text-[8px] tracking-[0.4em] opacity-30 mb-14 md:mb-20 uppercase"><span>PANTONE® {res.pantone}</span><span>{res.tag}</span></div>
              <p className="text-[10px] md:text-[11px] tracking-[0.4em] text-black/30 mb-2 uppercase">{res.brand}</p>
              <h1 className="text-3xl md:text-4xl font-light mb-8 md:mb-12 tracking-[0.1em] uppercase">{res.title}</h1>
              <p className="text-[11px] md:text-[12px] text-black/50 italic mb-16 md:mb-20 leading-relaxed px-4">{res.description}</p>
              <div className="grid grid-cols-1 gap-10 md:gap-14 py-10 border-y border-black/5 mb-16">
                 {Object.entries(res.notes).map(([key, note]: any) => (
                   <div key={key} className="flex flex-col items-center uppercase">
                     <span className="text-[6px] md:text-[7px] tracking-[0.8em] text-black/10 mb-1">{key} NOTES</span>
                     <span className="text-[11px] md:text-[13px] tracking-[0.2em] text-black/70 px-4 leading-relaxed">{note}</span>
                   </div>
                 ))}
              </div>
              <div className="flex justify-center gap-12 md:gap-16 border-t border-black/5 pt-10 uppercase">
                <button onClick={saveResultCard} className="group flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-all duration-700 ease-in-out">
                  <Download size={18} strokeWidth={1} />
                  <span className="text-[7px] md:text-[8px] tracking-widest pl-[0.2em]">SAVE MATCH</span>
                </button>
                <button onClick={() => window.location.reload()} className="group flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-all duration-700 ease-in-out">
                  <RotateCcw size={18} strokeWidth={1} />
                  <span className="text-[7px] md:text-[8px] tracking-widest pl-[0.2em]">RETRY</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}