/**
 * Gentle, manually controlled ambient music controller.
 * - Strictly OFF by default (no autoplay).
 * - Uses /assets/ambient.mp3 if provided in public/assets/ambient.mp3,
 *   and falls back to a warm, romantic Web Audio API felt-piano progression
 *   so the audio control works out of the box with zero 404 errors.
 */

class AmbientMusicController {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private useHtmlAudio = false;
  private checkedAsset = false;
  private stepIndex = 0;

  // Warm romantic progression in F major: Fmaj7 -> Dm7 -> Bbmaj7 -> C9sus4
  private readonly chords: number[][] = [
    [174.61, 261.63, 349.23, 440.0, 523.25], // F3, C4, F4, A4, C5
    [146.83, 220.0, 293.66, 349.23, 440.0], // D3, A3, D4, F4, A4
    [116.54, 233.08, 293.66, 349.23, 440.0], // Bb2, Bb3, D4, F4, A4
    [130.81, 196.0, 261.63, 349.23, 392.0], // C3, G3, C4, F4, G4
  ];

  public getPlayingState(): boolean {
    return this.isPlaying;
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      await this.start();
      return true;
    }
  }

  public async start(): Promise<void> {
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Check once if /assets/ambient.mp3 is actually hosted as an audio file
    if (!this.checkedAsset) {
      this.checkedAsset = true;
      try {
        const res = await fetch('/assets/ambient.mp3', { method: 'HEAD' });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('audio')) {
          this.audioEl = new Audio('/assets/ambient.mp3');
          this.audioEl.loop = true;
          this.audioEl.volume = 0.35;
          this.useHtmlAudio = true;
        }
      } catch {
        this.useHtmlAudio = false;
      }
    }

    if (this.useHtmlAudio && this.audioEl) {
      try {
        await this.audioEl.play();
        return;
      } catch {
        // Fall back to Web Audio API felt piano if HTMLAudio fails
      }
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!this.ctx && AudioCtx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.playWarmChord();
    this.intervalId = window.setInterval(() => {
      if (this.isPlaying) {
        this.playWarmChord();
      }
    }, 3400);
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.audioEl) {
      this.audioEl.pause();
    }
  }

  private playWarmChord(): void {
    if (!this.ctx || !this.isPlaying) return;
    const chord = this.chords[this.stepIndex % this.chords.length];
    this.stepIndex += 1;

    const now = this.ctx.currentTime;
    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const noteStart = now + idx * 0.24;
      const duration = 3.6;

      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteStart);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq * 2, noteStart);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(920, noteStart);
      filter.frequency.exponentialRampToValueAtTime(320, noteStart + duration);

      const peakGain = idx === 0 ? 0.045 : 0.032;
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.linearRampToValueAtTime(peakGain, noteStart + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteStart);
      subOsc.start(noteStart);
      osc.stop(noteStart + duration + 0.05);
      subOsc.stop(noteStart + duration + 0.05);
    });
  }
}

export const ambientMusic = new AmbientMusicController();
