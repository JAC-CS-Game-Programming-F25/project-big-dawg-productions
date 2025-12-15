export default class SoundPool {
	/**
	 * Manages an array of sounds so that we can play the same sound
	 * multiple times in our game without having to wait for one sound
	 * to be finished playing before playing the same sound again.
	 *
	 * @param {String} source
	 * @param {Number} size
	 * @see https://blog.sklambert.com/html5-canvas-game-html5-audio-and-finishing-touches/
	 */
	constructor(source, size = 1, volume, loop = false) {
		this.source = source;
		this.size = size;
		this.volume = volume;
		this.loop = loop;
		this.pool = [];
		this.currentSound = 0;
			this.isMp3Supported = (() => {
				try { return !!(new Audio()).canPlayType('audio/mpeg'); } catch { return true; }
			})();

		this.initializePool();
	}

	initializePool() {
		for (let i = 0; i < this.size; i++) {
			const audio = new Audio(this.source);
			audio.preload = 'auto';
			audio.crossOrigin = 'anonymous';

				audio.volume = (typeof this.volume === 'number') ? this.volume : 1.0;
			audio.loop = this.loop;

				// Attach error listener for diagnostics
				audio.addEventListener('error', () => {
					try { console.warn('[SoundPool] Audio error', this.source); } catch {}
				});
				// Proactively load resource
				try { audio.load(); } catch {}

			this.pool.push(audio);
		}
	}

	/**
	 * Checks if the currentSound is ready to play, plays the sound,
	 * then increments the currentSound counter.
	 */
	play() {
		const audio = this.pool[this.currentSound];
			// Validate support and source
			if (!this.isMp3Supported) {
				try { console.warn('[SoundPool] MP3 not supported by browser'); } catch {}
				return;
			}
			if (!audio || !audio.src) {
				try { console.warn('[SoundPool] Missing audio source', this.source); } catch {}
				return;
			}
		if (audio.currentTime === 0
			|| audio.ended
			|| audio.paused) {
			try {
				audio.play();
			} catch (e) {
				try { console.warn('[SoundPool] play() failed', this.source, e?.message); } catch {}
			}
		}

		this.currentSound = (this.currentSound + 1) % this.size;
	}

	pause() {
		this.pool[this.currentSound].pause();
	}

	isPaused() {
			// reset to start to avoid any residual offset
			try { audio.currentTime = 0; } catch {}
		return this.pool[this.currentSound].paused;
	}

	stop() {
		this.pause();
		this.pool[this.currentSound].currentTime = 0;
	}
}
