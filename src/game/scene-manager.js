/**
 * SceneManager - Gestor de escenas
 */

class SceneManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.scenes = {};
        this.currentScene = null;
        this.camera = null;
        
        this.initCamera();
    }

    /**
     * Inicializar cámara
     */
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        this.camera.position.set(0, 30, 50);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Establecer escena actual
     */
    setScene(scene) {
        this.currentScene = scene;
    }

    /**
     * Renderizar
     */
    render() {
        if (this.currentScene && this.camera) {
            this.renderer.render(this.currentScene, this.camera);
        }
    }

    /**
     * Actualizar cámara a seguir jugador
     */
    followPlayer(playerPosition, playerRotation) {
        const distance = 50;
        const height = 20;
        
        this.camera.position.x = playerPosition.x - Math.sin(playerRotation.y) * distance;
        this.camera.position.y = playerPosition.y + height;
        this.camera.position.z = playerPosition.z - Math.cos(playerRotation.y) * distance;
        
        this.camera.lookAt(
            playerPosition.x,
            playerPosition.y + 5,
            playerPosition.z
        );
    }
}
