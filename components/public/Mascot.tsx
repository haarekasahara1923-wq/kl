'use client';
import { motion } from 'framer-motion';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Mascot({ size = 'md', className = '' }: MascotProps) {
  const sizes = { sm: 80, md: 120, lg: 160 };
  const s = sizes[size];

  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{
        y: [0, -8, 0],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        width={s}
        height={s}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="KL School mascot - friendly student owl"
        role="img"
      >
        {/* Body */}
        <ellipse cx="60" cy="75" rx="28" ry="32" fill="#FF7A00" />
        {/* Head */}
        <circle cx="60" cy="45" r="26" fill="#FF9A3C" />
        {/* Eyes */}
        <circle cx="50" cy="42" r="9" fill="white" />
        <circle cx="70" cy="42" r="9" fill="white" />
        <circle cx="51" cy="43" r="5" fill="#0A1F44" />
        <circle cx="71" cy="43" r="5" fill="#0A1F44" />
        {/* Eye shine */}
        <circle cx="53" cy="41" r="2" fill="white" />
        <circle cx="73" cy="41" r="2" fill="white" />
        {/* Beak */}
        <path d="M57 52 L60 58 L63 52 Z" fill="#E06500" />
        {/* Graduation cap */}
        <rect x="38" y="22" width="44" height="6" rx="2" fill="#0A1F44" />
        <polygon points="60,10 82,22 38,22" fill="#0A1F44" />
        <line x1="82" y1="22" x2="88" y2="32" stroke="#FF7A00" strokeWidth="2" />
        <circle cx="88" cy="33" r="3" fill="#FF7A00" />
        {/* Wings */}
        <ellipse cx="32" cy="75" rx="10" ry="16" fill="#E06500" transform="rotate(-15 32 75)" />
        <ellipse cx="88" cy="75" rx="10" ry="16" fill="#E06500" transform="rotate(15 88 75)" />
        {/* Book */}
        <rect x="46" y="82" width="28" height="18" rx="3" fill="#0A1F44" />
        <line x1="60" y1="82" x2="60" y2="100" stroke="white" strokeWidth="1.5" />
        <line x1="50" y1="88" x2="58" y2="88" stroke="white" strokeWidth="1" />
        <line x1="50" y1="93" x2="58" y2="93" stroke="white" strokeWidth="1" />
        {/* Cheek blush */}
        <circle cx="42" cy="50" r="5" fill="#FFB347" opacity="0.5" />
        <circle cx="78" cy="50" r="5" fill="#FFB347" opacity="0.5" />
        {/* Smile */}
        <path d="M54 55 Q60 61 66 55" stroke="#E06500" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}
