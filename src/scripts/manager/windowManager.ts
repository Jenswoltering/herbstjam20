import { Vector } from 'matter'
import Window from '../objects/window'

const use3Lane = true
const debuggingRun = true


export default class WindowManager {
    scene: Phaser.Scene
    windows: Window[] = new Array()
    posX: number = 0
    time: number = 0

    bottomThreshold: number = 0
    topThreshold: number = 0
    windowThreshold: number = 0

    windowBaseInterval = 20
    minDistance = 300
    maxDistance = 3000
    lane1Top = 150
    lane1bot = 300
    lane2top = 450
    lane2bot = 650
    lane3top = 800
    lane3bot = 950


    constructor(scene: Phaser.Scene) {
        this.scene = scene
        console.log('managercreate')
    }

    userInput(userId: string) {
        // open window if user id matches
    }

    removeWindowOutOfViewport() {}

    getAttractionPoint(ghostPostion: Phaser.Math.Vector2): Phaser.Math.Vector2 {

        // TODO: factor in Distance to Ghost and diminishing returns from multiple windows

        var attractTo: Phaser.Math.Vector2 = ghostPostion.clone()
        this.windows.forEach(fenster => {
            if (/*fenster._isOpen &&*/ ! fenster.checkOutOfViewport()) {
                var vect = fenster.getCenter(new Phaser.Math.Vector2).subtract(ghostPostion)
                attractTo = attractTo.add(vect)
            }
        })

        return attractTo
    }

    create() {
        while (this.posX < this.scene.cameras.main.worldView.right) {
            this.posX += this.windowBaseInterval
            if (use3Lane) {
                this.addWindows3Lane()
            } else {
                this.addWindowsRandomEqualized
            }

        }
    }

    update(ghostPosition: Phaser.Math.Vector2) {

        if (this.posX == 0) {
            this.create()
        }

        this.posX = this.scene.cameras.main.worldView.right

        if (this.time > this.windowBaseInterval) {
            if (use3Lane) {
                this.addWindows3Lane()
            } else {
                this.addWindowsRandomEqualized
            }
            this.time = 0
        }
        else {
            this.time++
        }

    }

    addWindowsRandomEqualized() {
        if (this.windowThreshold + Phaser.Math.Between(100, 1000) < this.posX) {

            this.windowThreshold = this.posX
            var p1 = Phaser.Math.Between(50, 1000)
            this.windows.push(new Window(this.scene, this.posX, p1))

            if (Phaser.Math.Between(0, 100) > 75) {
                var p2 = Phaser.Math.Between(100, 1000)
                this.windows.push(new Window(this.scene, this.posX, p2))

                if (Phaser.Math.Between(0, 100) > 75) {
                    var p3 = Phaser.Math.Between(100, 1000)
                    this.windows.push(new Window(this.scene, this.posX, p3))
                }
            }
        }
    }

    addWindows3Lane() {
        if (this.topThreshold + Phaser.Math.Between(this.minDistance, this.maxDistance) < this.posX) {
            this.windows.push(new Window(this.scene, this.posX, Phaser.Math.Between(this.lane1Top, this.lane1Top)))
            this.topThreshold = this.posX
        }
        if (this.windowThreshold + Phaser.Math.Between(this.minDistance, this.maxDistance) < this.posX) {
            this.windows.push(new Window(this.scene, this.posX, Phaser.Math.Between(this.lane2top, this.lane2bot)))
            this.windowThreshold = this.posX
        }
        if (this.bottomThreshold + Phaser.Math.Between(this.minDistance, this.maxDistance) < this.posX) {
            this.windows.push(new Window(this.scene, this.posX, Phaser.Math.Between(this.lane3top, this.lane3bot)))
            this.bottomThreshold = this.posX
        }
    }
}
