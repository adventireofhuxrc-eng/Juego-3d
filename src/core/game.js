/**
 * Core Game Engine - NAHUAC: Cyber Street Racing
 * Sistema principal del juego
 */

class NahuacGame {
    constructor() {
        this.isOnline = false;
        this.gameState = 'MENU'; // MENU, LOADING, PLAYING, PAUSED, GAME_OVER
        this.currentPlayer = null;
        this.world = null;
        this.camera = null;
        this.renderer = null;
        this.sceneManager = null;
        this.networkManager = null;
        this.uiManager = null;
        this.audioManager = null;
        
        // Estadísticas del jugador
        this.playerStats = {
            notoriety: 0, // Escala 0-100 (desconocido a leyenda)
            wins: 0,
            losses: 0,
            totalDistance: 0,
            ownedCars: [],
            currentCar: null,
            clan: null,
            role: 'PILOTO' // PILOTO, HACKER, MECANICO, ESTRATEGA
        };

        // Configuración
        this.config = {
            maxPlayers: 32,
            difficulty: 'NORMAL',
            graphics: 'HIGH',
            masterVolume: 0.8
        };
    }

    /**
     * Inicializar el juego
     */
    async init() {
        console.log('🏎️ Iniciando NAHUAC: Cyber Street Racing...');
        
        try {
            // Verificar conexión a internet
            this.isOnline = await this.checkInternetConnection();
            console.log(`Modo: ${this.isOnline ? 'ONLINE' : 'OFFLINE'}`);

            // Inicializar sistemas
            await this.initRenderer();
            await this.initScene();
            await this.initAudio();
            await this.initUI();
            
            if (this.isOnline) {
                await this.initNetwork();
            }

            // Cargar datos persistentes
            await this.loadPlayerData();
            
            this.gameState = 'MENU';
            this.showMainMenu();
            
            console.log('✅ Juego inicializado correctamente');
        } catch (error) {
            console.error('❌ Error en inicialización:', error);
            this.showErrorScreen(error.message);
        }
    }

    /**
     * Inicializar renderer Three.js
     */
    async initRenderer() {
        const canvas = document.createElement('canvas');
        document.getElementById('app').appendChild(canvas);
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true,
            alpha: false 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x0a0e27, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        
        // Respuesta a redimensionamiento
        window.addEventListener('resize', () => this.onWindowResize());
    }

    /**
     * Inicializar escena
     */
    async initScene() {
        this.sceneManager = new SceneManager(this.renderer);
        this.world = new World();
    }

    /**
     * Inicializar audio
     */
    async initAudio() {
        this.audioManager = new AudioManager(this.config.masterVolume);
    }

    /**
     * Inicializar UI
     */
    async initUI() {
        this.uiManager = new UIManager(this);
    }

    /**
     * Inicializar red (solo online)
     */
    async initNetwork() {
        this.networkManager = new SocketManager(this);
        await this.networkManager.connect();
    }

    /**
     * Verificar conexión a internet
     */
    async checkInternetConnection() {
        try {
            const response = await fetch('https://www.google.com', { 
                mode: 'no-cors',
                cache: 'no-store' 
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Cargar datos persistentes del jugador
     */
    async loadPlayerData() {
        const savedData = localStorage.getItem('nahuac_player');
        if (savedData) {
            this.playerStats = JSON.parse(savedData);
            console.log('📊 Datos del jugador cargados');
        }
    }

    /**
     * Guardar datos persistentes del jugador
     */
    async savePlayerData() {
        localStorage.setItem('nahuac_player', JSON.stringify(this.playerStats));
        console.log('💾 Datos guardados');
    }

    /**
     * Mostrar menú principal
     */
    showMainMenu() {
        this.uiManager.showMainMenu(this.isOnline);
    }

    /**
     * Iniciar campaña offline
     */
    async startCampaign() {
        console.log('🎮 Iniciando Campaña...');
        this.gameState = 'LOADING';
        
        // Crear jugador
        this.currentPlayer = new Player({
            name: 'Jugador',
            role: this.playerStats.role
        });
        
        // Cargar mundo
        await this.world.loadMap('tenochtitlan');
        this.gameState = 'PLAYING';
        this.gameLoop();
    }

    /**
     * Unirse a servidor online
     */
    async joinOnline() {
        console.log('🌐 Conectando al servidor...');
        this.gameState = 'LOADING';
        
        if (this.networkManager) {
            await this.networkManager.joinServer();
            this.gameState = 'PLAYING';
            this.gameLoop();
        }
    }

    /**
     * Loop principal del juego
     */
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        
        if (this.gameState === 'PLAYING') {
            const deltaTime = 1 / 60; // 60 FPS
            
            // Actualizar lógica
            this.update(deltaTime);
            
            // Renderizar
            this.sceneManager.render();
        }
    }

    /**
     * Actualización por frame
     */
    update(deltaTime) {
        if (this.currentPlayer) {
            this.currentPlayer.update(deltaTime);
        }
        
        if (this.world) {
            this.world.update(deltaTime);
        }
        
        // Sincronizar online si está conectado
        if (this.isOnline && this.networkManager) {
            this.networkManager.sendPlayerPosition(this.currentPlayer.getPosition());
        }
    }

    /**
     * Manejar redimensionamiento de ventana
     */
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.renderer.setSize(width, height);
        this.sceneManager.camera.aspect = width / height;
        this.sceneManager.camera.updateProjectionMatrix();
    }

    /**
     * Mostrar pantalla de error
     */
    showErrorScreen(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0a0e27;
            color: #ff0080;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
            font-size: 18px;
            z-index: 9999;
        `;
        errorDiv.innerHTML = `<div>❌ Error: ${message}</div>`;
        document.body.appendChild(errorDiv);
    }

    /**
     * Pausar juego
     */
    pause() {
        this.gameState = 'PAUSED';
        this.uiManager.showPauseMenu();
    }

    /**
     * Reanudar juego
     */
    resume() {
        this.gameState = 'PLAYING';
    }
}

// Iniciar juego cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const game = new NahuacGame();
        game.init();
    });
} else {
    const game = new NahuacGame();
    game.init();
}
