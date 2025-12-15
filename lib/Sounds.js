import SoundPool from "./SoundPool.js";

export default class Sounds {
	constructor() {
		this.sounds = {};
	}

	load(soundDefinitions) {
		soundDefinitions.forEach((soundDefinition) => {
			this.sounds[soundDefinition.name] = new SoundPool(
				soundDefinition.path,
				soundDefinition.size ?? 1,
				soundDefinition.volume ?? 1.0,
				soundDefinition.loop,
			);
			try { console.debug('[Sounds] Loaded', soundDefinition.name, soundDefinition.path); } catch {}
		});
	}

	get(name) {
		return this.sounds[name];
	}

	play(name) {
		const s = this.get(name);
		if (s) {
			try { s.play(); } catch (e) { try { console.warn('[Sounds] play blocked', name, e?.message); } catch {} }
		} else {
			try { console.warn('[Sounds] Missing sound', name); } catch {}
		}
	}

	pause(name) {
		this.get(name).pause();
	}

	stop(name) {
		this.get(name).stop()
	}
}
