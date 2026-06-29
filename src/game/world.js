/**
 * Clase World - Gestiona el mundo del juego
 */

class World {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);
        this.scene.fog = new THREE.Fog(0x0a0e27, 500, 1000);
        
        this.maps = {};
        this.currentMap = null;
        this.npcCars = [];
        this.policePatrols = [];
        this.dynamicEvents = [];
        
        this.setupLighting();
    }

    /**
     * Configurar iluminación
     */
    setupLighting() {
        // Luz ambiental (noche cyberpunk)
        const ambientLight = new THREE.AmbientLight(0x1a1a3f, 0.5);
        this.scene.add(ambientLight);
        
        // Luz direccional (luna)
        const dirLight = new THREE.DirectionalLight(0x00ffff, 0.4);
        dirLight.position.set(100, 150, 100);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        this.scene.add(dirLight);
        
        // Puntos de luz (farolas de neón)
        for (let i = 0; i < 10; i++) {
            const light = new THREE.PointLight(
                new THREE.Color().setHSL(Math.random(), 1, 0.5),
                1,
                200
            );
            light.position.set(
                Math.random() * 200 - 100,
                50,
                Math.random() * 200 - 100
            );
            this.scene.add(light);
        }
    }

    /**
     * Cargar mapa
     */
    async loadMap(mapName) {
        console.log(`🗺️ Cargando mapa: ${mapName}`);
        
        if (mapName === 'tenochtitlan') {
            this.createTenochtitlanMap();
        }
        
        this.currentMap = mapName;
    }

    /**
     * Crear mapa de Tenochtitlan
     */
    createTenochtitlanMap() {
        // Suelo/pista
        const groundGeometry = new THREE.PlaneGeometry(500, 500);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Edificios (pirámides cyberpunk)
        this.createBuildings();
        
        // Carreteras con glifos de neón
        this.createNeonRoads();
        
        // Puntos de interés
        this.createPointsOfInterest();
    }

    /**
     * Crear edificios
     */
    createBuildings() {
        const buildingPositions = [
            { x: -100, z: -100, height: 150, name: 'Templo Mayor' },
            { x: 100, z: -100, height: 120, name: 'Centro Financiero' },
            { x: -100, z: 100, height: 100, name: 'Arsenal Clandestino' },
            { x: 100, z: 100, height: 130, name: 'Mercado Negro' }
        ];
        
        buildingPositions.forEach(building => {
            const geometry = new THREE.BoxGeometry(
                40, 
                building.height, 
                40
            );
            const material = new THREE.MeshStandardMaterial({
                color: 0x1a3a5f,
                metalness: 0.7,
                roughness: 0.3,
                emissive: 0x00ffff,
                emissiveIntensity: 0.1
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(building.x, building.height / 2, building.z);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
        });
    }

    /**
     * Crear carreteras con glifos de neón
     */
    createNeonRoads() {
        // Carretera horizontal
        const roadH = new THREE.PlaneGeometry(400, 40);
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0e27,
            emissive: 0xff0080,
            emissiveIntensity: 0.2
        });
        const roadHorizontal = new THREE.Mesh(roadH, roadMaterial);
        roadHorizontal.position.z = 0;
        roadHorizontal.position.y = 0.1;
        roadHorizontal.rotation.x = -Math.PI / 2 + 0.01;
        this.scene.add(roadHorizontal);
        
        // Carretera vertical
        const roadV = new THREE.PlaneGeometry(40, 400);
        const roadVertical = new THREE.Mesh(roadV, roadMaterial);
        roadVertical.position.x = 0;
        roadVertical.position.y = 0.1;
        roadVertical.rotation.x = -Math.PI / 2 + 0.01;
        this.scene.add(roadVertical);
    }

    /**
     * Crear puntos de interés
     */
    createPointsOfInterest() {
        // Puertos de reparación
        // Estaciones de carrera
        // Puntos de venta
    }

    /**
     * Actualizar mundo cada frame
     */
    update(deltaTime) {
        // Actualizar eventos dinámicos
        this.updateDynamicEvents(deltaTime);
        
        // Actualizar patrullas policiales
        this.updatePolicePatrols(deltaTime);
    }

    /**
     * Actualizar eventos dinámicos
     */
    updateDynamicEvents(deltaTime) {
        // Generar eventos aleatorios
    }

    /**
     * Actualizar patrullas policiales
     */
    updatePolicePatrols(deltaTime) {
        // Lógica de patrullas
    }

    /**
     * Obtener escena Three.js
     */
    getScene() {
        return this.scene;
    }
}
