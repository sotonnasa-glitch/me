/**
 * High-performance, zero-latency procedural Space Ambience Synthesizer
 * Built with Web Audio API - pure mathematical synthesis, zero network assets.
 */

class SpaceAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private oscillators: (OscillatorNode | AudioNode)[] = [];

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      // Smooth fade in
      this.masterGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 3.0);
      this.masterGain.connect(this.ctx.destination);

      // 1. Deep Interstellar Sub Drone (Fundamental 55Hz & 110Hz binaural)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const droneFilter = this.ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(220, this.ctx.currentTime);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55.6, this.ctx.currentTime); // Subtle 0.6Hz binaural beating

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.45, this.ctx.currentTime);

      osc1.connect(droneFilter);
      osc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(this.masterGain);

      osc1.start();
      osc2.start();
      this.oscillators.push(osc1, osc2);

      // 2. Cosmic Harmonic Shimmer (Pulsing high-pass chord)
      const oscHarmonic = this.ctx.createOscillator();
      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(440, this.ctx.currentTime);

      // LFO for breathing volume
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime); // 6.6s cycle
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      lfo.connect(lfoGain.gain);

      const harmonicFilter = this.ctx.createBiquadFilter();
      harmonicFilter.type = 'bandpass';
      harmonicFilter.frequency.setValueAtTime(880, this.ctx.currentTime);
      harmonicFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      oscHarmonic.connect(harmonicFilter);
      harmonicFilter.connect(lfoGain);
      lfoGain.connect(this.masterGain);

      lfo.start();
      oscHarmonic.start();
      this.oscillators.push(oscHarmonic, lfo);

      this.isPlaying = true;
    } catch {
      this.isPlaying = false;
    }
  }

  public playOrbPulse() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Cosmic Crystal Resonance Ping on Touch/Click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(293.66, this.ctx.currentTime + 1.2); // Glide down

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.5);
    } catch {
      // Audio not permitted yet or not supported
    }
  }

  public stop() {
    if (!this.ctx || !this.masterGain) return;
    try {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
      setTimeout(() => {
        this.oscillators.forEach((o) => {
          try {
            (o as OscillatorNode).stop?.();
          } catch {
            // ignore
          }
        });
        this.oscillators = [];
        this.isPlaying = false;
      }, 1050);
    } catch {
      this.isPlaying = false;
    }
  }
}

export const spaceAudio = new SpaceAudioEngine();
