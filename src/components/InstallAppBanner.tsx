import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, MoreVertical } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (already installed as PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // If browser didn't fire event or already fired, show manual guide modal
      setShowGuideModal(true);
    }
  };

  if (isInstalled || isDismissed) return null;

  return (
    <>
      {/* Floating Bottom Install Prompt Banner for Mobile / Desktop */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-40 animate-in slide-in-from-bottom duration-300">
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/50 rounded-2xl p-3.5 shadow-2xl backdrop-blur-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md shadow-indigo-600/40">
              V
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                <span>단어장 앱 설치</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-medium border border-emerald-500/30">
                  Chrome App
                </span>
              </h4>
              <p className="text-[11px] text-slate-300 truncate">
                홈 화면에 추가하여 앱으로 사용하세요
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-500/30 transition active:scale-95 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>설치</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Installation Guide Modal (when beforeinstallprompt is not directly available) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Chrome 앱 간편 설치 방법</h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 bg-slate-850 p-3 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <span className="text-white font-semibold flex items-center gap-1">
                    우측 상단 메뉴(<MoreVertical className="w-3.5 h-3.5 inline text-indigo-400" />) 터치
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    모바일 Chrome 브라우저 우측 상단의 점 3개 메뉴를 누릅니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-850 p-3 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <span className="text-emerald-400 font-bold">
                    "앱 설치" 또는 "홈 화면에 추가" 터치
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    메뉴 목록에서 [앱 설치]를 선택하면 설치 확인창이 뜹니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-850 p-3 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <span className="text-white font-semibold">
                    완료! 바탕화면에서 바로 실행
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    홈 화면에 단독 앱 아이콘이 생성되며 주소창 없이 전체화면으로 실행됩니다.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
            >
              확인했습니다
            </button>
          </div>
        </div>
      )}
    </>
  );
};
