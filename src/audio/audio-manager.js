/**
 * AudioManager - Gestor de audio
 */

class AudioManager {
    constructor(masterVolume) {
        this.masterVolume = masterVolume;
        this.sounds = {};
        this.backgroundMusic = null;
    }

    /**
     * Cargar sonido
     */
    loadSound(name, url) {
        // Usar Howler.js si está disponible
        console.log(`🔊 Cargando sonido: ${name}`);
    }

    /**
     * Reproducir sonido
     */
    playSound(name) {
        if (this.sounds[name]) {
            console.log(`▶ Reproduciendo: ${name}`);
        }
    }

    /**
     * Reproducir música de fondo
     */
    playBackgroundMusic(name) {
        console.log(`🎵 Reproduciendo música: ${name}`);
    }

    /**
     * Detener música
     */
    stopBackgroundMusic() {
        console.log('⏹ Deteniendo música');
    }

    /**
     * Ajustar volumen maestro
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
}
