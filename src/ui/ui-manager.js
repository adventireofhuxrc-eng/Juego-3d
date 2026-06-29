/**
 * UIManager - Gestor de interfaz de usuario
 */

class UIManager {
    constructor(game) {
        this.game = game;
        this.currentScreen = null;
    }

    /**
     * Mostrar menú principal
     */
    showMainMenu(isOnline) {
        const html = `
            <div class="main-menu">
                <h1>🏎️ NAHUAC</h1>
                <h2>Cyber Street Racing</h2>
                <div class="menu-buttons">
                    <button onclick="window.gameInstance.startCampaign()">▶ Campaña Offline</button>
                    ${isOnline ? '<button onclick="window.gameInstance.joinOnline()">🌐 Jugar Online</button>' : ''}
                    <button onclick="this.showSettings()">⚙️ Configuración</button>
                    <button onclick="this.showCredits()">📜 Créditos</button>
                </div>
            </div>
        `;
        document.getElementById('app').innerHTML += html;
    }

    /**
     * Mostrar menú de pausa
     */
    showPauseMenu() {
        const html = `
            <div class="pause-menu active">
                <h2>PAUSA</h2>
                <div class="menu-buttons">
                    <button onclick="window.gameInstance.resume()">Reanudar</button>
                    <button onclick="window.gameInstance.showMainMenu()">Menú Principal</button>
                    <button onclick="">Salir</button>
                </div>
            </div>
        `;
        document.getElementById('app').innerHTML += html;
    }

    /**
     * Actualizar HUD
     */
    updateHUD(playerData) {
        // Actualizar velocidad
        const speedometer = document.querySelector('.speedometer');
        if (speedometer) {
            speedometer.textContent = Math.floor(playerData.speed);
        }
        
        // Actualizar barra de notoriedad
        const notorietyFill = document.querySelector('.notoriety-fill');
        if (notorietyFill) {
            notorietyFill.style.width = `${playerData.notoriety}%`;
        }
    }

    /**
     * Mostrar configuración
     */
    showSettings() {
        console.log('Mostrando configuración...');
    }

    /**
     * Mostrar créditos
     */
    showCredits() {
        console.log('Mostrando créditos...');
    }
}

// Hacer referencia global al juego
window.gameInstance = null;
