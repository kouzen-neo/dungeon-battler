import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Howl } from 'howler';

interface AudioState {
  isMuted: boolean;
  volume: number;
  bgmInstance: Howl | null;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  playBGM: (src: string, loop?: boolean) => void;
  stopBGM: () => void;
  playSFX: (src: string) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      isMuted: false,
      volume: 0.5,
      bgmInstance: null,

      setMuted: (muted) => {
        set({ isMuted: muted });
        Howler.mute(muted);
      },

      setVolume: (volume) => {
        set({ volume });
        Howler.volume(volume);
      },

      playBGM: (src, loop = true) => {
        const { bgmInstance, isMuted, volume } = get();

        // If same BGM is already playing, don't restart
        // @ts-ignore - access internal _src for check
        if (bgmInstance && bgmInstance._src === src && bgmInstance.playing()) {
          return;
        }

        if (bgmInstance) {
          bgmInstance.stop();
          bgmInstance.unload();
        }

        const newBgm = new Howl({
          src: [src],
          loop,
          volume,
          html5: true, // Recommended for large BGM files
          autoplay: !isMuted,
        });

        newBgm.play();
        set({ bgmInstance: newBgm });
      },

      stopBGM: () => {
        const { bgmInstance } = get();
        if (bgmInstance) {
          bgmInstance.stop();
          set({ bgmInstance: null });
        }
      },

      playSFX: (src) => {
        const { isMuted, volume } = get();
        if (isMuted) return;

        /**
         * PLACEHOLDER UNTUK EFEK SUARA (SFX)
         * Anda bisa menambahkan file audio .mp3 atau .wav di folder /public/audio/
         * Kode di bawah ini akan mencoba memutar file tersebut jika ada.
         */
        const sfx = new Howl({
          src: [src],
          volume,
        });
        sfx.play();
      },
    }),
    {
      name: 'dungeon-audio-storage',
      partialize: (state) => ({ isMuted: state.isMuted, volume: state.volume }),
    }
  )
);
