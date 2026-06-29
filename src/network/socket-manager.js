/**
 * SocketManager - Gestor de conexiones de red
 */

class SocketManager {
    constructor(game) {
        this.game = game;
        this.socket = null;
        this.isConnected = false;
        this.playerId = null;
    }

    /**
     * Conectar al servidor
     */
    async connect() {
        return new Promise((resolve, reject) => {
            try {
                // Aquí iría la conexión real al servidor
                // this.socket = io('https://tu-servidor.com');
                console.log('🌐 Conectando a servidor...');
                this.isConnected = true;
                resolve();
            } catch (error) {
                console.error('❌ Error conectando:', error);
                reject(error);
            }
        });
    }

    /**
     * Unirse al servidor
     */
    async joinServer() {
        if (this.socket) {
            this.socket.emit('player_join', {
                playerId: this.game.playerStats.name,
                role: this.game.playerStats.role
            });
        }
    }

    /**
     * Enviar posición del jugador
     */
    sendPlayerPosition(position) {
        if (this.socket && this.isConnected) {
            this.socket.emit('player_position', {
                x: position.x,
                y: position.y,
                z: position.z
            });
        }
    }

    /**
     * Desconectar
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.isConnected = false;
        }
    }
}
