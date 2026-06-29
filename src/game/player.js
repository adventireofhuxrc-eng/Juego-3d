/**
 * Clase Player - Gestiona el jugador
 */

class Player {
    constructor(config) {
        this.name = config.name || 'Unknown';
        this.role = config.role || 'PILOTO';
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        this.currentCar = null;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.speed = 0;
        this.maxSpeed = 200; // km/h
        
        // Estadísticas
        this.health = 100;
        this.notoriety = 0;
        this.money = 10000;
        this.ownedCars = [];
        
        // Controles
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            boost: false,
            handbrake: false
        };
        
        this.setupInputHandlers();
    }

    /**
     * Configurar manejadores de entrada
     */
    setupInputHandlers() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    /**
     * Manejar teclas presionadas
     */
    handleKeyDown(event) {
        const key = event.key.toLowerCase();
        switch(key) {
            case 'w': this.controls.forward = true; break;
            case 's': this.controls.backward = true; break;
            case 'a': this.controls.left = true; break;
            case 'd': this.controls.right = true; break;
            case 'shift': this.controls.boost = true; break;
            case ' ': this.controls.handbrake = true; break;
        }
    }

    /**
     * Manejar teclas liberadas
     */
    handleKeyUp(event) {
        const key = event.key.toLowerCase();
        switch(key) {
            case 'w': this.controls.forward = false; break;
            case 's': this.controls.backward = false; break;
            case 'a': this.controls.left = false; break;
            case 'd': this.controls.right = false; break;
            case 'shift': this.controls.boost = false; break;
            case ' ': this.controls.handbrake = false; break;
        }
    }

    /**
     * Actualizar jugador cada frame
     */
    update(deltaTime) {
        if (this.currentCar) {
            this.updateCarMovement(deltaTime);
        }
    }

    /**
     * Actualizar movimiento del auto
     */
    updateCarMovement(deltaTime) {
        const acceleration = 150;
        const friction = 0.95;
        const rotationSpeed = 3;
        
        // Aceleración
        if (this.controls.forward) {
            this.speed = Math.min(this.speed + acceleration * deltaTime, 
                this.controls.boost ? this.maxSpeed * 1.3 : this.maxSpeed);
        } else {
            this.speed *= friction;
        }
        
        // Rotación
        if (this.controls.left) {
            this.rotation.y += rotationSpeed * deltaTime;
        }
        if (this.controls.right) {
            this.rotation.y -= rotationSpeed * deltaTime;
        }
        
        // Actualizar posición
        const direction = new THREE.Vector3(
            Math.sin(this.rotation.y),
            0,
            Math.cos(this.rotation.y)
        ).normalize();
        
        this.position.addScaledVector(direction, this.speed * deltaTime * 0.01);
    }

    /**
     * Obtener posición del jugador
     */
    getPosition() {
        return this.position;
    }

    /**
     * Asignar auto actual
     */
    setCurrentCar(car) {
        this.currentCar = car;
    }

    /**
     * Aumentar notoriedad
     */
    increaseNotoriety(amount) {
        this.notoriety = Math.min(100, this.notoriety + amount);
        console.log(`⭐ Notoriedad: ${this.notoriety}/100`);
    }

    /**
     * Obtener rol del jugador
     */
    getRole() {
        return this.role;
    }
}
