"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Download, RotateCcw, Menu, X, Compass, Flower2, User, ChevronRight, ArrowLeft, Layers, Microscope } from 'lucide-react';

const PERFUME_MATCHES: { [key: string]: any } = {
  CALM: { 
    brand: "LE LABO", title: "Santal 33", 
    tag: "WOODY ARCHIVE", pantone: "7530 C",
    notes: { Top: "紫羅蘭葉、小荳蔻", Heart: "鳶尾花、紙莎草", Base: "檀香木、皮革、琥珀" },
    vipNote: "這支香水的靈魂在於澳洲檀香木的處理，呈現出一種略顯潮濕、如老舊圖書館般的紙張質感。",
    description: "隱居於都市的智者，平靜中帶有極致的個人風格。",
    hex: "#8E867E"
  },
  WILD: { 
    brand: "BYREDO", title: "Mixed Emotions", 
    tag: "RADICAL SPIRIT", pantone: "172 C",
    notes: { Top: "瑪黛茶、黑醋栗", Heart: "錫蘭紅茶、紫羅蘭葉", Base: "樺木、紙莎草" },
    vipNote: "黑醋栗的酸與瑪黛茶的苦味在開場時會產生一種煙燻的衝突感，象徵著情緒的不可預測。",
    description: "混亂中的和諧，適合直覺強烈且不願被定義的自由靈魂。",
    hex: "#E2583E"
  },
  ETHERIAL: { 
    brand: "DIPTYQUE", title: "L'Eau Papier", 
    tag: "PAPER MUSK", pantone: "7527 C",
    notes: { Top: "白麝香", Heart: "含羞草、芝麻", Base: "琥珀、木質香" },
    vipNote: "白麝香與烘烤芝麻的結合創造出一種極具顆粒感的「墨水感」，這在現代調香中非常罕見。",
    description: "墨水在紙張上暈開的詩意，捕捉如晨霧般的通透美感。",
    hex: "#D0F0C0"
  },
  LUNAR: { 
    brand: "AESOP", title: "Gloam", 
    tag: "FLORAL EARTH", pantone: "7512 C",
    notes: { Top: "粉紅胡椒、小荳蔻、苦橙葉", Heart: "藏紅花、茉莉花、含羞草", Base: "鳶尾花、廣藿香、古巴香脂" },
    vipNote: "這款香水的高級感來自於古巴香脂的穩定性，它讓辛辣的前調平穩過渡到大地的草本氣息中。",
    description: "這款香水以令人迷戀的香辛料氣息開場，逐漸綻放充滿活力的獨特花香。",
    hex: "#F5E050"
  },
  DARK: { 
    brand: "BYREDO", title: "Reine de Nuit", 
    tag: "NIGHT VEIL", pantone: "Black 6 C",
    notes: { Top: "黑醋栗、番紅花", Heart: "焚香、玫瑰", Base: "黃葵籽、廣藿香" },
    vipNote: "使用了高濃度的番紅花萃取，搭配略帶髒感的廣藿香，勾勒出一種帶有金屬感的哥德式冷酷。",
    description: "在深夜中綻放的午夜玫瑰，冷冽、高貴且帶有侵略性的視覺美感。",
    hex: "#2D1B2D" 
  },
  MYSTIC: { 
    brand: "FUEGUIA 1833", title: "Metafora", 
    tag: "DREAMCORE", pantone: "Cool Gray 10 C",
    notes: { Top: "粉紅胡椒", Heart: "茉莉花", Base: "廣藿香" },
    vipNote: "來自巴塔哥尼亞的天然原料，其氣味中含有一種難以捕捉的冷冽空氣感，像是清晨的機械廢墟。",
    description: "超現實的層次轉換，像是夢境中冰冷的機械零件與花朵混雜的抽象感。",
    hex: "#707070"
  }
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
        @keyframes lowSaturatePulse {
          0%, 100% { opacity: 0.15; filter: blur(60px) saturate(30%); }
          50% { opacity: 0.25; filter: blur(80px) saturate(45%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}} />

      {/* 導航欄 - 標題全大寫 */}
      <nav className="fixed top-0 left-0 w-full z-[110] px-6 md:px-12 py-6 md:py-8 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-black/[0.03]">
        <div className="text-[9px] md:text-[11px] tracking-[0.8em] font-light opacity-60">SILENT ECHO</div>
        <button onClick={() => { setNavOpen(!navOpen); setVipOpen(false); }} className="p-2 hover:opacity-50 transition-opacity">
          {navOpen ? <X size={18} strokeWidth={1} /> : <Menu size={18} strokeWidth={1} />}
        </button>
      </nav>

      {/* 導航選單 - 選項全大寫 */}
      <div className={`fixed inset-0 z-[105] bg-[#FDFDFD]/95 backdrop-blur-xl transition-all duration-700 ease-in-out ${navOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="h-full flex flex-col items-center justify-center gap-10 md:gap-14">
          <button onClick={() => { setStoryOpen(true); setNavOpen(false); }} className="group flex items-center gap-4 text-[10px] md:text-[12px] tracking-[0.5em] opacity-40 hover:opacity-100 transition-all uppercase pl-[0.5em]">
            <Compass size={16} className="group-hover:rotate-12 transition-transform" /> BRAND STORY
          </button>
          <button onClick={() => { setNavOpen(false); window.location.reload(); }} className="group flex items-center gap-4 text-[10px] md:text-[12px] tracking-[0.5em] opacity-40 hover:opacity-100 transition-all uppercase pl-[0.5em]">
            <Flower2 size={16} className="group-hover:rotate-12 transition-transform" /> SCENT TEST
          </button>
          {!vipOpen ? (
            <button onClick={() => { setVipOpen(true); setVipStage('mission'); }} className="group flex items-center gap-4 text-[10px] md:text-[12px] tracking-[0.5em] opacity-40 hover:opacity-100 transition-all uppercase pl-[0.5em]">
              <User size={16} className="group-hover:rotate-12 transition-transform" /> VIP ACCESS
            </button>
          ) : (
            <div className="flex flex-col items-center animate-[visionFocus_0.6s_forwards] max-w-[320px] text-center px-6">
              {vipStage === 'mission' ? (
                <>
                  <p className="text-[9px] md:text-[10px] tracking-[0.3em] leading-[2.2] text-black/40 mb-10 uppercase">
                    SHARE THIS PAGE TO IG STORY AND TAG @SILENT_ECHO<br/>
                    DM THE SCREENSHOT TO GET YOUR ACCESS CODE
                  </p>
                  <button onClick={() => setVipStage('input')} className="text-[8px] md:text-[9px] tracking-[0.6em] border border-black/10 px-8 py-3 hover:bg-black hover:text-white transition-all uppercase pl-[0.6em]">I HAVE A CODE</button>
                  <button onClick={() => setVipOpen(false)} className="text-[7px] tracking-widest opacity-20 hover:opacity-100 uppercase mt-8">NOT NOW</button>
                </>
              ) : (
                <form onSubmit={handleVipSubmit} className="flex flex-col items-center">
                  <div className="relative flex items-center border-b border-black/20 pb-2 mb-6 w-56">
                    <input autoFocus type="text" placeholder="ACCESS CODE" value={vipCode} onChange={(e) => setVipCode(e.target.value)} className="bg-transparent text-[11px] tracking-[0.3em] outline-none w-full placeholder:text-black/10 text-center uppercase" />
                    <button type="submit" className="absolute -right-8 opacity-20 hover:opacity-100 transition-opacity"><ChevronRight size={16} /></button>
                  </div>
                  <button onClick={() => setVipStage('mission')} className="text-[7px] tracking-widest opacity-20 hover:opacity-100 uppercase mt-2">BACK TO MISSION</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BRAND STORY 彈窗 - 標題全大寫 */}
      <div className={`fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 transition-all duration-1000 ease-in-out ${storyOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl" onClick={() => setStoryOpen(false)} />
        <div className="relative max-w-2xl w-full bg-[#FDFDFD] p-10 md:p-24 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.03)] border border-black/[0.02] overflow-y-auto max-h-[85vh] custom-scrollbar">
          <button onClick={() => setStoryOpen(false)} className="absolute top-8 right-8 opacity-20 hover:opacity-100 transition-opacity">
            <X size={20} strokeWidth={1} />
          </button>
          <div className="text-center">
            <div className="w-1 h-8 bg-black/10 mx-auto mb-14" />
            <h2 className="text-[10px] md:text-[11px] tracking-[1.2em] opacity-30 mb-20 uppercase pl-[1.2em]">PHILOSOPHY</h2>
            <div className="space-y-16 text-left max-w-md mx-auto">
              <section>
                <p className="text-[8px] tracking-[0.5em] opacity-20 mb-4 uppercase pl-[0.5em]">MISSION</p>
                <p className="text-[13px] md:text-[14px] leading-[2.4] font-light opacity-60 tracking-[0.15em]">
                  在這個資訊過載的時代，氣味不應成為另一種選擇壓力。Silent Echo 致力於消除挑選香水時的焦慮，我們不談論成分，只談論你的頻率。
                </p>
              </section>
              <section>
                <p className="text-[8px] tracking-[0.5em] opacity-20 mb-4 uppercase pl-[0.5em]">RESONANCE</p>
                <p className="text-[13px] md:text-[14px] leading-[2.4] font-light opacity-60 tracking-[0.15em]">
                  如果你曾迷失於百貨公司的香氛專櫃，或是無法描述內心渴望的氣息，這裡將是你的歸宿。我們透過光影、節奏與留白，幫助你媒合出那支能與你靈魂共振的「回聲」。
                </p>
              </section>
              <div className="pt-12 flex justify-center"><div className="w-12 h-[0.5px] bg-black/10" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* VIP DASHBOARD */}
      {step === 'vip_dashboard' && (
        <div className={`max-w-5xl w-full h-[80vh] flex flex-col px-4 md:px-10 ${fadeClass}`}>
          <div className="flex justify-between items-end mb-12 md:mb-16 border-b border-black/[0.05] pb-8">
            <div className="text-left">
              <p className="text-[8px] tracking-[1em] opacity-20 mb-2 uppercase pl-[1em]">EXCLUSIVE ACCESS</p>
              <h1 className="text-xl md:text-2xl font-light tracking-[0.4em] uppercase">PRIVATE ARCHIVE</h1>
            </div>
            <button onClick={() => { setIsVisible(false); setTimeout(() => { setStep('login'); setIsVisible(true); }, 800); }} className="flex items-center gap-2 opacity-20 hover:opacity-100 text-[8px] tracking-[0.4em] transition-all uppercase">
              <ArrowLeft size={14} strokeWidth={1} /> BACK HOME
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-16 overflow-y-auto pr-4 custom-scrollbar flex-grow pb-10">
            {Object.values(PERFUME_MATCHES).map((item: any, idx) => (
              <div key={idx} className="group space-y-8 border-l border-black/[0.03] pl-8">
                <div className="flex items-center justify-between">
                  <span className="text-[7px] tracking-widest opacity-20 uppercase">0{idx + 1} / COLLECTION</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.hex }} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[10px] tracking-[0.5em] opacity-30 uppercase">{item.brand}</h3>
                  <h2 className="text-lg md:text-xl font-light tracking-wider uppercase">{item.title}</h2>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/[0.02] border border-black/[0.05]"><Layers size={10} strokeWidth={1} className="opacity-30" /><span className="text-[7px] tracking-widest opacity-40 uppercase">{item.pantone}</span></div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/[0.02] border border-black/[0.05]"><Microscope size={10} strokeWidth={1} className="opacity-30" /><span className="text-[7px] tracking-widest opacity-40 uppercase">{item.tag}</span></div>
                </div>
                <p className="text-[11px] md:text-[12px] leading-[2.2] text-black/50 italic tracking-widest border-t border-black/[0.03] pt-6">{item.vipNote}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 md:p-8 border border-dashed border-black/10 bg-black/[0.01] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-[8px] tracking-[1em] opacity-20 mb-3 uppercase pl-[1em]">REWARD</p>
                <h2 className="text-sm tracking-[0.3em] font-light uppercase">VIP EXCLUSIVE: 15% OFF DISCOUNT CODE</h2>
              </div>
              <div className="bg-white px-6 py-3 border border-black/5 text-[12px] md:text-[14px] tracking-[0.5em] font-mono pl-[0.5em]">ECHO_SILENT_15OFF</div>
          </div>
        </div>
      )}

      {showBlindLight && <div className="fixed inset-0 bg-white z-[120] animate-[blindLight_1s_ease-out_forwards]" />}

      {/* 首頁入口 */}
      {step === 'login' && (
        <div className={`w-full flex flex-col items-center justify-center gap-20 md:gap-28 ${fadeClass}`}>
          <div className="flex flex-col items-center">
             <span className="text-[10px] md:text-[12px] tracking-[1.5em] md:pl-[1.5em] text-black/40 uppercase font-light text-center">
                FIND YOUR OWN SCENT
             </span>
          </div>
          <button 
            onClick={() => { setIsVisible(false); setTimeout(() => { setStep('quiz'); setIsVisible(true); }, 900); }} 
            className="group relative px-14 py-4 md:px-20 md:py-6 overflow-hidden border border-black/10 hover:border-black transition-colors duration-500 uppercase"
          >
            <span className="relative z-10 text-[10px] md:text-[12px] tracking-[0.6em] group-hover:text-white transition-colors duration-500 pl-[0.6em]">
                START
            </span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          </button>
        </div>
      )}

      {/* Quiz */}
      {step === 'quiz' && (
        <div className={`max-w-2xl w-full text-center px-4 ${fadeClass}`}>
          <p className="text-[8px] md:text-[10px] tracking-[1em] text-black/20 uppercase mb-20 md:mb-32">QUESTION 0{qIndex + 1}</p>
          <p className="text-2xl md:text-3xl mb-24 md:mb-36 text-black/80 font-light px-6 leading-relaxed">「 {questions[qIndex].q} 」</p>
          <div className="flex flex-col gap-10 md:gap-14">
            {questions[qIndex].options.map((opt, i) => (
              <button key={i} onClick={() => handleNextQuiz(opt.v)} className="group text-[11px] md:text-[13px] tracking-[0.4em] text-black/40 hover:text-black transition-all duration-500 flex flex-col items-center uppercase">
                <span className="mb-2 group-hover:tracking-[0.8em] group-hover:text-black transition-all duration-700 ease-in-out">{opt.t}</span>
                <div className="w-0 h-[0.5px] bg-black/40 group-hover:w-28 md:group-hover:w-40 group-hover:bg-black transition-all duration-700 ease-in-out"></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Particle */}
      {step === 'particle' && (
        <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute z-20 text-[10px] md:text-[12px] tracking-[1.2em] text-black/20 uppercase text-center" style={{ opacity: Math.max(0, 1 - progress / 50) }}>DRAW A CIRCLE IN THE VOID</div>
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

      {/* Result */}
      {step === 'result' && (
        <div className="w-full flex flex-col items-center justify-center min-h-[80vh] py-10">
          <div ref={resultRef} className={`w-full max-w-[420px] md:max-w-[460px] bg-[#FDFDFD] text-black p-12 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-black/[0.02] relative overflow-hidden ${isCapturing ? '!filter-none !opacity-100' : ''}`} style={{ animation: isCapturing ? 'none' : 'visionFocus 3s forwards' }}>
            <div className="absolute inset-0 opacity-100 pointer-events-none">
                {!isCapturing && (
                  <div className="absolute inset-0 animate-[lowSaturatePulse_8s_infinite] transition-opacity duration-[3000ms]" style={{ background: `radial-gradient(circle at center, ${res.hex} 0%, #FDFDFD 80%)` }} />
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
                  <Download size={18} strokeWidth={1} className="group-hover:translate-y-[1px] transition-transform duration-500" />
                  <span className="text-[7px] md:text-[8px] tracking-widest pl-[0.2em]">SAVE MATCH</span>
                </button>
                <button onClick={() => window.location.reload()} className="group flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-all duration-700 ease-in-out">
                  <RotateCcw size={18} strokeWidth={1} className="group-hover:rotate-45 transition-transform duration-700" />
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