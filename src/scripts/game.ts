import 'phaser'
import MainScene from './scenes/mainScene'
import StartScene from './scenes/startScene'
import EndScene from './scenes/endScene'
import PreloadScene from './scenes/preloadScene'

const DEFAULT_WIDTH = 1920
const DEFAULT_HEIGHT = 1080

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#fff',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    },
    scene: [PreloadScene, StartScene, MainScene, EndScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 },
            checkCollision: {
                up: true,
                down: true,
                left: false,
                right: false,
            },
        },
    },
}

window.addEventListener('load', () => {
    const game = new Phaser.Game(config)
})
