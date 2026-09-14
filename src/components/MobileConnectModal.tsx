import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, Copy, Check, Globe } from 'lucide-react';

interface MobileConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileConnectModal: React.FC<MobileConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Network address
  const url = typeof window !== 'undefined' 
    ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? `http://192.168.55.17:5173` 
        : window.location.origin)
    : 'http://192.168.55.17:5173';

  useEffect(() => {
    if (isOpen && url) {
      QRCode.toDataURL(url, {
        width: 240,
        margin: 1.5,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      .then(setQrDataUrl)
      .catch(console.error);
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                안드로이드 폰에서 실행하기
              </h2>
              <p className="text-[11px] text-slate-400">
                QR 코드 스캔 또는 주소 직접 입력
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-center">
          {/* QR Code Container */}
          <div className="bg-white p-3.5 rounded-2xl w-fit mx-auto shadow-xl border border-slate-200">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Mobile Connect QR Code" className="w-48 h-48 rounded-lg" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                QR 코드 생성 중...
              </div>
            )}
          </div>

          {/* URL Box & Copy */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-left">
            <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs text-slate-200 font-mono flex-1 truncate">
              {url}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition active:scale-95 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨' : '주소 복사'}</span>
            </button>
          </div>

          {/* Step by Step Guide */}
          <div className="text-left space-y-2.5 bg-slate-850 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="text-slate-300">
                <span className="font-semibold text-white">같은 Wi-Fi(공유기) 연결</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  안드로이드 폰이 PC와 동일한 와이파이에 연결되어 있어야 합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="text-slate-300">
                <span className="font-semibold text-white">스마트폰 기본 카메라로 QR 스캔</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  카메라를 QR 코드에 대면 상단에 뜨는 웹사이트 링크를 터치합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="text-slate-300">
                <span className="font-semibold text-emerald-400">진짜 앱처럼 홈 화면에 추가하기</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Chrome 우측 상단 메뉴(<span className="text-slate-200 font-bold">⋮</span>) ➔ <span className="text-indigo-300 font-bold">"앱 설치"</span> 또는 <span className="text-indigo-300 font-bold">"홈 화면에 추가"</span>를 누르면 일반 앱 아이콘으로 생성됩니다!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-850 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
