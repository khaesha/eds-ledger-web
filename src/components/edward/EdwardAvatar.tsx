'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// Edda's contextual messages per page
const EDDA_LINES: Record<string, string[]> = {
  '/dashboard': [
    'Edda has been watching your wallet. Results: chaotic.',
    "New month, new bounty. Let's go!",
    'Edda spotted 3 things. Click report to see!'
  ],
  '/expenses': [
    'Add everything! Edda sees all.',
    'Ooh what did you spend on THAT?',
    "CSV upload = Edda's favorite snack."
  ],
  '/report': [
    'Edda worked really hard on this. Probably.',
    "The numbers don't lie. Edda doesn't either... much.",
    'Bounty report ready! Edda is pleased.'
  ],
  '/chat': [
    'Ask Edda anything. Edda knows everything about your money.',
    'Edda is listening! ...Edda is always listening.',
    'No question is too small. Except "what is 2+2". Google that.'
  ]
};

const DEFAULT_LINES = ['Edda is here!', 'Hello from Edda!'];

function pickLine(lines: string[]): string {
  return lines[Math.floor(Math.random() * lines.length)];
}

export default function EddaAvatar({ thinking = false }: { thinking?: boolean }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [line, setLine] = useState('');

  useEffect(() => {
    const lines = EDDA_LINES[pathname] ?? DEFAULT_LINES;
    setLine(pickLine(lines));
  }, [pathname]);

  if (thinking) {
    return (
      <div className="w-8 h-8 rounded-full bg-edward-amber flex items-center justify-center animate-pulse shrink-0 overflow-hidden">
        <Image src="/edward-1.png" alt="Edda" width={32} height={32} className="object-cover" />
      </div>
    );
  }

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                   bg-edward-amber flex items-center justify-center
                   shadow-lg hover:scale-110 transition-transform overflow-hidden"
        title="Summon Edda"
      >
        <Image src="/edward-1.png" alt="Edda" width={56} height={56} className="object-cover" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Speech bubble */}
      <div
        className="
        relative bg-edward-navy2 border border-edward-amber/30
        rounded-2xl rounded-br-none px-4 py-3 max-w-xs
        shadow-lg shadow-black/30
      "
      >
        <p className="text-sm text-white leading-snug">{line}</p>
        <button
          onClick={() => setVisible(false)}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full
                     bg-edward-navy border border-white/20
                     text-edward-muted text-xs flex items-center justify-center
                     hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Avatar circle */}
      <div
        className="
        w-14 h-14 rounded-full bg-edward-amber
        flex items-center justify-center
        shadow-lg cursor-pointer
        hover:scale-105 transition-transform
        border-2 border-edward-amber/50 overflow-hidden
      "
      >
        <Image src="/edward-1.png" alt="Edda" width={56} height={56} className="object-cover" />
      </div>
    </div>
  );
}
