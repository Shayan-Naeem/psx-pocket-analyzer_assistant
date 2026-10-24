/**
 * Native HTML5 Notification API & Offline Web Audio Chime Service
 */

class NotificationService {
  private audioCtx: AudioContext | null = null;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return 'denied';
    }
  }

  public playAlertChime(): void {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      // Dual-tone financial chime (659Hz to 880Hz, E5 to A5)
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (err) {
      console.warn('Audio chime playback failed:', err);
    }
  }

  public dispatchNotification(title: string, body: string, tag?: string): boolean {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    try {
      const notification = new Notification(title, {
        body,
        tag: tag || 'psx-pocket-advisor',
        badge: '/favicon.ico',
        icon: '/favicon.ico',
        silent: false,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return true;
    } catch (err) {
      console.warn('Failed to dispatch native notification:', err);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
