/**
 * Clase Car - Gestiona los autos
 */

class Car {
    constructor(config) {
        this.id = config.id || Math.random();
        this.name = config.name || 'Unknown Car';
        this.model = config.model || 'GENERIC';
        this.type = config.type || 'SPORT'; // SPORT, STREET, HEAVY, EXOTIC
        
        // Estadísticas base
        this.stats = {
            speed: config.speed || 8,
            acceleration: config.acceleration || 6,
            handling: config.handling || 7,
            durability: config.durability || 5
        };
        
        // Personalizaciones
        this.customization = {
            color: config.color || '#ff0080',
            engineMod: config.engineMod || false,
            aerodynamics: config.aerodynamics || false,
            armor: config.armor || 0, // 0-3
            glyph: config.glyph || 'TECUCIZTECATL' // Inspirado en dioses mexicas
        };
        
        this.health = 100;
        this.fuel = 100;
        this.position = new THREE.Vector3(0, 0, 0);
        this.mesh = null;
        
        this.createMesh();
    }

    /**
     * Crear mesh 3D del auto
     */
    createMesh() {
        const group = new THREE.Group();
        
        // Carrocería principal
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 5);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: this.customization.color,
            metalness: 0.8,
            roughness: 0.2,
            emissive: this.customization.color,
            emissiveIntensity: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        body.position.y = 0.8;
        group.add(body);
        
        // Llantas
        const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            metalness: 0.6,
            roughness: 0.5
        });
        
        const wheelPositions = [
            [-1.2, 0.6, 1.5],
            [1.2, 0.6, 1.5],
            [-1.2, 0.6, -1.5],
            [1.2, 0.6, -1.5]
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...pos);
            wheel.castShadow = true;
            group.add(wheel);
        });
        
        // Detalles de neón (glifo)
        const neonGeometry = new THREE.BoxGeometry(0.1, 0.1, 2);
        const neonMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const neonStripe = new THREE.Mesh(neonGeometry, neonMaterial);
        neonStripe.position.z = 0;
        neonStripe.position.y = 1.6;
        group.add(neonStripe);
        
        this.mesh = group;
    }

    /**
     * Actualizar posición
     */
    setPosition(position) {
        this.position.copy(position);
        if (this.mesh) {
            this.mesh.position.copy(position);
        }
    }

    /**
     * Aplicar daño
     */
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        if (this.health <= 0) {
            this.destroy();
        }
    }

    /**
     * Reparar auto
     */
    repair(amount) {
        this.health = Math.min(100, this.health + amount);
    }

    /**
     * Destruir auto
     */
    destroy() {
        console.log(`💥 Auto ${this.name} fue destruido`);
    }

    /**
     * Repostar
     */
    refuel() {
        this.fuel = 100;
    }

    /**
     * Obtener estadísticas totales (incluyendo modificaciones)
     */
    getTotalStats() {
        let stats = { ...this.stats };
        
        if (this.customization.engineMod) {
            stats.speed += 2;
            stats.acceleration += 1;
        }
        
        if (this.customization.aerodynamics) {
            stats.speed += 1;
            stats.handling += 2;
        }
        
        stats.durability += this.customization.armor;
        
        return stats;
    }
}
