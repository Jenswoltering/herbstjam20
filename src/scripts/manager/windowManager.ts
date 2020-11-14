import Window from '../objects/window'
export default class WindowManager {
    scene: Phaser.Scene
    windows: Window[] = new Array()

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        console.log('managercreate')
        this.windows.push(new Window(this.scene, 2000, 600))
        this.windows.push(new Window(this.scene, 1300, 800))
    }

    userInput(userId: string) {
        // open window if user id matches
    }

    removeWindowOutOfViewport() {}

    getAtrractionPoint(ghostPostion: Phaser.Math.Vector2): Phaser.Math.Vector2 | null {
        // calculate an average point based on open windows and ghost position
        return null
    }

    update(ghostPosition: Phaser.Math.Vector2) {}
}
