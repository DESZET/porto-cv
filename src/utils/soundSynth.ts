class WebAudioSynth {
  private ctx: AudioContext | null = null;
  private volume: number = 0.5;

  private initCtx() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  playThwip() {
    this.initCtx();
    if (!this.ctx) return;
    const ctx = this.ctx;
    
    // Create white noise buffer
    const duration = 0.15; // 0.15 seconds
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 8.0;
    
    // Modulate filter frequency (sweep from high to low)
    const now = ctx.currentTime;
    filter.frequency.setValueAtTime(6000, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration);

    // Gain
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.7, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  }

  playWhoosh() {
    this.initCtx();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 0.4;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";

    const gain = ctx.createGain();
    
    // Low frequency sweep
    osc.frequency.setValueAtTime(70, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + duration);
    
    osc2.frequency.setValueAtTime(140, now);
    osc2.frequency.exponentialRampToValueAtTime(500, now + duration);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.volume * 0.4, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Soft lowpass filter to remove triangle harshness
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
    osc2.start(now);
    osc2.stop(now + duration);
  }

  playBoom() {
    this.initCtx();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 0.6;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    const gainNode = ctx.createGain();

    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + duration);

    gainNode.gain.setValueAtTime(this.volume * 0.9, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Distort a bit with a low-pass filter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, now);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playGlitch() {
    this.initCtx();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "square";
    const gainNode = ctx.createGain();

    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.setValueAtTime(150, now + 0.04);
    osc.frequency.setValueAtTime(800, now + 0.08);

    gainNode.gain.setValueAtTime(this.volume * 0.25, now);
    gainNode.gain.setValueAtTime(this.volume * 0.08, now + 0.04);
    gainNode.gain.setValueAtTime(this.volume * 0.15, now + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playZap() {
    this.initCtx();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 0.2;

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    const gainNode = ctx.createGain();

    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + duration);

    gainNode.gain.setValueAtTime(this.volume * 0.35, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, now);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }
}

// Singleton helper to prevent multiple instances
let synthInstance: WebAudioSynth | null = null;
if (typeof window !== "undefined") {
  synthInstance = new WebAudioSynth();
}

export const soundSynth = synthInstance || ({
  setVolume: () => {},
  playThwip: () => {},
  playWhoosh: () => {},
  playBoom: () => {},
  playGlitch: () => {},
  playZap: () => {},
} as unknown as WebAudioSynth);
