import React, { useState, useRef, useEffect } from 'react';

export interface NeuralSubmitButtonProps {
  /** Text shown during idle state */
  label?: string;
  /** Text shown during success state */
  successLabel?: string;
  /** Subtitle or secondary badge if desired */
  subLabel?: string;
  /** Optional click handler before or alongside animation */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  /** Optional callback fired when submission payoff finishes */
  onSubmitSuccess?: () => void;
  /** Whether the button automatically resets to idle after success (default: true for demo) */
  autoReset?: boolean;
  /** Delay in milliseconds before auto-resetting to idle (default: 2200ms) */
  autoResetDelay?: number;
  /** Custom button type */
  type?: 'button' | 'submit' | 'reset';
  /** Disabled state */
  disabled?: boolean;
  /** Custom additional className */
  className?: string;
  /** ID for accessibility and testing */
  id?: string;
  /** Controlled state override if provided */
  stateOverride?: 'idle' | 'loading' | 'success';
}

export const NeuralSubmitButton: React.FC<NeuralSubmitButtonProps> = ({
  label = 'Submit Request',
  successLabel = 'Submitted',
  subLabel,
  onClick,
  onSubmitSuccess,
  autoReset = true,
  autoResetDelay = 2200,
  type = 'button',
  disabled = false,
  className = '',
  id = 'neural-submit-request-btn',
  stateOverride,
}) => {
  const [internalState, setInternalState] = useState<'idle' | 'loading' | 'success'>('idle');
  const currentState = stateOverride || internalState;

  const timersRef = useRef<number[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || currentState !== 'idle') return;

    if (onClick) {
      onClick(e);
    }

    // Step 1 & 2: Start Loading (~1s neural activity wave)
    setInternalState('loading');
    clearAllTimers();

    // After ~1000ms (2 diagonal wave cycles across the 3x3 grid), trigger payoff
    const payoffTimer = window.setTimeout(() => {
      setInternalState('success');
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      // Step 4: Hold success state, then reset to idle after ~2s for demo purposes
      if (autoReset) {
        const resetTimer = window.setTimeout(() => {
          setInternalState('idle');
        }, autoResetDelay);
        timersRef.current.push(resetTimer);
      }
    }, 1000);

    timersRef.current.push(payoffTimer);
  };

  return (
    <>
      <style>{`
        /* --- SCOPED NEURAL SUBMIT BUTTON STYLES & KEYFRAMES --- */
        
        .neural-btn-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          padding: 2px;
          /* STATIC conic-gradient border: Violet (#7c6bff) -> Cyan (#33d8ff) -> Pink (#ff6bcb) -> Violet (#7c6bff) */
          /* STRICTLY STATIC: NO ROTATION OR SPIN ANYWHERE */
          background: conic-gradient(
            from 135deg,
            #7c6bff 0%,
            #33d8ff 35%,
            #ff6bcb 70%,
            #7c6bff 100%
          );
          box-shadow: 
            0 4px 20px -2px rgba(124, 107, 255, 0.35),
            0 0 25px -4px rgba(51, 216, 255, 0.3),
            inset 0 0 12px rgba(255, 107, 203, 0.2);
          cursor: pointer;
          outline: none;
          text-decoration: none;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          max-width: 100%;
          box-sizing: border-box;
        }

        .neural-btn-wrapper:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 32px -2px rgba(124, 107, 255, 0.5),
            0 0 35px -2px rgba(51, 216, 255, 0.45),
            0 0 20px rgba(255, 107, 203, 0.35);
        }

        .neural-btn-wrapper:active:not(:disabled) {
          transform: translateY(0px) scale(0.98);
        }

        .neural-btn-wrapper:focus-visible {
          outline: 2px solid #33d8ff;
          outline-offset: 4px;
          box-shadow: 0 0 0 5px rgba(124, 107, 255, 0.5), 0 0 25px #33d8ff;
        }

        .neural-btn-wrapper:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: grayscale(0.2);
        }

        /* Inner Dark Glass Pill Container */
        .neural-btn-inner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          width: 100%;
          padding: 0.65rem 1.5rem;
          border-radius: 9999px;
          background: rgba(10, 8, 24, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          overflow: hidden;
          z-index: 1;
          box-sizing: border-box;
        }

        /* Drifting Low-Opacity Gradient Blobs (Violet, Cyan, Pink) */
        .neural-blob-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 9999px;
          pointer-events-none;
          mix-blend-mode: screen;
          z-index: 0;
        }

        .neural-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(14px);
          opacity: 0.45;
          pointer-events-none;
        }

        /* Blob 1: Violet */
        .neural-blob-violet {
          width: 70px;
          height: 70px;
          background: radial-gradient(circle, #7c6bff 0%, rgba(124, 107, 255, 0) 70%);
          top: -20px;
          left: 15%;
          animation: blob-drift-1 6s ease-in-out infinite;
        }

        /* Blob 2: Cyan */
        .neural-blob-cyan {
          width: 75px;
          height: 75px;
          background: radial-gradient(circle, #33d8ff 0%, rgba(51, 216, 255, 0) 70%);
          bottom: -25px;
          right: 20%;
          animation: blob-drift-2 7s ease-in-out infinite;
        }

        /* Blob 3: Pink */
        .neural-blob-pink {
          width: 65px;
          height: 65px;
          background: radial-gradient(circle, #ff6bcb 0%, rgba(255, 107, 203, 0) 70%);
          top: 10px;
          right: 45%;
          animation: blob-drift-3 8s ease-in-out infinite;
        }

        /* Blob drift animations: STRICTLY TRANSLATE / SCALE ONLY, NO ROTATION */
        @keyframes blob-drift-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(25px, 15px) scale(1.2); }
        }

        @keyframes blob-drift-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1.1); }
          50% { transform: translate(-20px, -15px) scale(0.9); }
        }

        @keyframes blob-drift-3 {
          0%, 100% { transform: translate(0px, 0px) scale(0.95); }
          50% { transform: translate(-15px, 20px) scale(1.25); }
        }

        /* --- 1. IDLE LABEL & SHIMMER --- */
        .neural-label-wrapper {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease, transform 0.2s ease;
          width: 100%;
          text-align: center;
        }

        .neural-label-text {
          font-family: inherit;
          font-weight: 700;
          font-size: 0.92rem;
          line-height: 1.35;
          letter-spacing: -0.01em;
          color: #ffffff;
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #dcd8ff 22%,
            #a5eeff 45%,
            #ffc0ed 68%,
            #ffffff 90%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-shimmer-wave 3.6s ease-in-out infinite;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .neural-sublabel-text {
          font-size: 0.65rem;
          color: #94a3b8;
          font-weight: 500;
          margin-top: 2px;
          white-space: nowrap;
        }

        @keyframes text-shimmer-wave {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }

        .neural-label-hidden {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          position: absolute !important;
          transform: scale(0.85);
        }

        /* --- 2. NEURAL 3x3 DOTS GRID (ACTIVE THINKING) --- */
        .neural-grid-wrapper {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: scale(0.6);
          transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .neural-grid-visible {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transform: scale(1) !important;
        }

        .neural-dots-grid {
          display: grid;
          grid-template-columns: repeat(3, 8px);
          grid-template-rows: repeat(3, 8px);
          gap: 6px;
          align-items: center;
          justify-content: center;
        }

        .neural-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background-color: #7c6bff;
          transform: scale(0.7);
          opacity: 0.35;
        }

        /* When loading is active, sweep diagonal pulse waves */
        .neural-grid-visible .neural-dot {
          animation: neural-pulse-wave 0.52s ease-in-out infinite alternate;
        }

        /* Diagonal Stagger Matrix (row + col):
           (0,0)=0 | (0,1),(1,0)=1 | (0,2),(1,1),(2,0)=2 | (1,2),(2,1)=3 | (2,2)=4
        */
        .neural-grid-visible .dot-d0 { animation-delay: 0.00s; }
        .neural-grid-visible .dot-d1 { animation-delay: 0.09s; }
        .neural-grid-visible .dot-d2 { animation-delay: 0.18s; }
        .neural-grid-visible .dot-d3 { animation-delay: 0.27s; }
        .neural-grid-visible .dot-d4 { animation-delay: 0.36s; }

        /* Dot pulse keyframe: STRICTLY PULSING, COLOR TRANSITION & GLOW (NO ROTATION) */
        @keyframes neural-pulse-wave {
          0% {
            transform: scale(0.65);
            background-color: #7c6bff;
            box-shadow: 0 0 3px rgba(124, 107, 255, 0.4);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.35);
            background-color: #33d8ff;
            box-shadow: 0 0 10px #33d8ff, 0 0 18px rgba(51, 216, 255, 0.85);
            opacity: 1;
          }
          100% {
            transform: scale(1.1);
            background-color: #ff6bcb;
            box-shadow: 0 0 8px #ff6bcb, 0 0 16px rgba(255, 107, 203, 0.8);
            opacity: 0.9;
          }
        }

        /* --- 3. SUCCESS PAYOFF: CHECKMARK DRAW + BLUR-TO-SHARP BOUNCE TEXT --- */
        .neural-success-wrapper {
          position: absolute;
          inset: 0;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: scale(0.85);
          transition: opacity 0.2s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          padding: 0 1rem;
        }

        .neural-success-visible {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transform: scale(1) !important;
        }

        /* Checkmark SVG with stroke animation */
        .neural-check-svg {
          width: 20px;
          height: 20px;
          stroke: #33d8ff;
          filter: drop-shadow(0 0 6px rgba(51, 216, 255, 0.8));
          flex-shrink: 0;
        }

        .neural-check-path {
          stroke-dasharray: 32;
          stroke-dashoffset: 32;
        }

        .neural-success-visible .neural-check-path {
          animation: draw-check-stroke 0.45s cubic-bezier(0.65, 0, 0.35, 1) 0.05s forwards;
        }

        @keyframes draw-check-stroke {
          0% { stroke-dashoffset: 32; }
          100% { stroke-dashoffset: 0; }
        }

        /* "Submitted" text fades from blurred to sharp with slight bounce */
        .neural-success-text {
          font-family: inherit;
          font-weight: 800;
          font-size: 0.92rem;
          color: #ffffff;
          letter-spacing: -0.01em;
          white-space: nowrap;
          text-shadow: 0 0 12px rgba(51, 216, 255, 0.5), 0 0 20px rgba(124, 107, 255, 0.4);
        }

        .neural-success-visible .neural-success-text {
          animation: blur-sharp-bounce 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
        }

        @keyframes blur-sharp-bounce {
          0% {
            opacity: 0;
            filter: blur(8px);
            transform: scale(0.8);
          }
          60% {
            opacity: 1;
            filter: blur(0px);
            transform: scale(1.06);
          }
          85% {
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: scale(1);
          }
        }

        /* --- 4. BURST PARTICLES (VIOLET, CYAN, PINK) --- */
        .neural-particles-container {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .burst-particle {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          opacity: 0;
        }

        .bp-violet {
          background-color: #7c6bff;
          box-shadow: 0 0 8px #7c6bff;
        }

        .bp-cyan {
          background-color: #33d8ff;
          box-shadow: 0 0 8px #33d8ff;
        }

        .bp-pink {
          background-color: #ff6bcb;
          box-shadow: 0 0 8px #ff6bcb;
        }

        /* 8 directional radial bursts (pure translation + scale fade, NO rotation) */
        .neural-success-visible ~ .neural-particles-container .pt-1 { animation: burst-dir-1 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .neural-success-visible ~ .neural-particles-container .pt-2 { animation: burst-dir-2 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .neural-success-visible ~ .neural-particles-container .pt-3 { animation: burst-dir-3 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .neural-success-visible ~ .neural-particles-container .pt-4 { animation: burst-dir-4 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .neural-success-visible ~ .neural-particles-container .pt-5 { animation: burst-dir-5 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .neural-success-visible ~ .neural-particles-container .pt-6 { animation: burst-dir-6 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .neural-success-visible ~ .neural-particles-container .pt-7 { animation: burst-dir-7 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .neural-success-visible ~ .neural-particles-container .pt-8 { animation: burst-dir-8 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes burst-dir-1 {
          0% { transform: translate(0, 0) scale(1.6); opacity: 1; }
          100% { transform: translate(45px, 0px) scale(0); opacity: 0; }
        }
        @keyframes burst-dir-2 {
          0% { transform: translate(0, 0) scale(1.6); opacity: 1; }
          100% { transform: translate(32px, -24px) scale(0); opacity: 0; }
        }
        @keyframes burst-dir-3 {
          0% { transform: translate(0, 0) scale(1.6); opacity: 1; }
          100% { transform: translate(0px, -34px) scale(0); opacity: 0; }
        }
        @keyframes burst-dir-4 {
          0% { transform: translate(0, 0) scale(1.6); opacity: 1; }
          100% { transform: translate(-32px, -24px) scale(0); opacity: 0; }
        }
        @keyframes burst-dir-5 {
          0% { transform: translate(0, 0) scale(1.6); opacity: 1; }
          100% { transform: translate(-45px, 0px) scale(0); opacity: 0; }
        }
        @keyframes burst-dir-6 {
          0% { transform: translate(0, 0) scale(1.6); opacity: 1; }
          100% { transform: translate(-32px, 24px) scale(0); opacity: 0; }
        }
        @keyframes burst-dir-7 {
          0% { transform: translate(0, 0) scale(1.6); opacity: 1; }
          100% { transform: translate(0px, 34px) scale(0); opacity: 0; }
        }
        @keyframes burst-dir-8 {
          0% { transform: translate(0, 0) scale(1.6); opacity: 1; }
          100% { transform: translate(32px, 24px) scale(0); opacity: 0; }
        }

        /* --- 5. PREFERS-REDUCED-MOTION SUPPORT --- */
        @media (prefers-reduced-motion: reduce) {
          .neural-btn-wrapper,
          .neural-blob,
          .neural-label-text,
          .neural-dot,
          .neural-check-path,
          .neural-success-text,
          .burst-particle {
            animation: none !important;
            transition: none !important;
          }
          .neural-check-path {
            stroke-dashoffset: 0 !important;
          }
          .neural-label-text {
            background-position: 0 0 !important;
          }
        }
      `}</style>

      <button
        id={id}
        type={type}
        onClick={handleClick}
        disabled={disabled || currentState !== 'idle'}
        className={`neural-btn-wrapper ${className}`}
        aria-label={currentState === 'success' ? successLabel : label}
        aria-live="polite"
      >
        <div className="neural-btn-inner">
          {/* Drifting gradient blobs background */}
          <div className="neural-blob-container" aria-hidden="true">
            <div className="neural-blob neural-blob-violet" />
            <div className="neural-blob neural-blob-cyan" />
            <div className="neural-blob neural-blob-pink" />
          </div>

          {/* 1. Idle Label with animated gradient shimmer */}
          <div
            className={`neural-label-wrapper ${
              currentState !== 'idle' ? 'neural-label-hidden' : ''
            }`}
          >
            <span className="neural-label-text">{label}</span>
            {subLabel && <span className="neural-sublabel-text">{subLabel}</span>}
          </div>

          {/* 2. Neural 3x3 Dots Grid (Thinking state on click) */}
          <div
            className={`neural-grid-wrapper ${
              currentState === 'loading' ? 'neural-grid-visible' : ''
            }`}
            aria-hidden={currentState !== 'loading'}
          >
            <div className="neural-dots-grid">
              {/* Row 0 */}
              <span className="neural-dot dot-d0" />
              <span className="neural-dot dot-d1" />
              <span className="neural-dot dot-d2" />
              {/* Row 1 */}
              <span className="neural-dot dot-d1" />
              <span className="neural-dot dot-d2" />
              <span className="neural-dot dot-d3" />
              {/* Row 2 */}
              <span className="neural-dot dot-d2" />
              <span className="neural-dot dot-d3" />
              <span className="neural-dot dot-d4" />
            </div>
          </div>

          {/* 3. Success Payoff (Checkmark SVG stroke draw + Blurred-to-sharp "Submitted") */}
          <div
            className={`neural-success-wrapper ${
              currentState === 'success' ? 'neural-success-visible' : ''
            }`}
            aria-hidden={currentState !== 'success'}
          >
            <svg
              className="neural-check-svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 12.5L9.5 17.5L19.5 6.5" className="neural-check-path" />
            </svg>
            <span className="neural-success-text">{successLabel}</span>
          </div>

          {/* 4. Burst Particles */}
          <div className="neural-particles-container" aria-hidden="true">
            <span className="burst-particle bp-violet pt-1" />
            <span className="burst-particle bp-cyan pt-2" />
            <span className="burst-particle bp-pink pt-3" />
            <span className="burst-particle bp-violet pt-4" />
            <span className="burst-particle bp-cyan pt-5" />
            <span className="burst-particle bp-pink pt-6" />
            <span className="burst-particle bp-violet pt-7" />
            <span className="burst-particle bp-pink pt-8" />
          </div>
        </div>
      </button>
    </>
  );
};
