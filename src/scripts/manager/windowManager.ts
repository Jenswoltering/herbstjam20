import { Vector } from 'matter'
import Window from '../objects/window'
import Torch from '../objects/torch'
import ColorManager from './colorManager'

const use3Lane = true

export default class WindowManager {
    scene: Phaser.Scene
    windows: Window[] = new Array()
    torches: Torch[] = new Array()

    posX: number = 0
    steps: number = 0
    colorManager = ColorManager.getInstance()
    bottomThreshold: number = 0
    topThreshold: number = 0
    windowThreshold: number = 0
    torchThreshold: number = 0

    torchTopThreshold: number = 0
    torchMiddleThreshold: number = 0
    torchBotThreshold: number = 0

    windowBaseInterval = 20
    minDistance = 300
    maxDistance = 3000
    lane1top = 150
    lane1bot = 300
    lane2top = 450
    lane2bot = 650
    lane3top = 800
    lane3bot = 950
    torchBoundary = 200
    torchExtraDistTop = 200
    torchExtraDistMid = 500
    torchExtraDistBot = 200

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        console.log('managercreate')
    }

    userInput(userId: string) {
        // open window if user id matches
        this.windows.forEach((fenster) => {
            if (!fenster.checkOutOfViewport()) {
                if (fenster.isConntrolledByUser(userId)) {
                    fenster.openWindow()
                }
            }
        })
    }

    randomWindowOwnership() {
        let randompick: Array<number> = new Array()
        this.windows.forEach((fenster, index) => {
            if (!fenster.checkOutOfViewport()) {
                randompick.push(index)
                fenster.removePlayerControll()
            }
        })
        console.log(randompick)
        let connectedUsers = Array.from(this.colorManager.userColorAssociation.keys())
        console.log(connectedUsers)
        // random
        for (let index = 0; index < connectedUsers.length; index++) {
            const changeColorOf = Phaser.Math.Between(0, randompick.length - 1)
            console.log('change', randompick[changeColorOf])
            this.windows[randompick[changeColorOf]].controllPlayer(connectedUsers[index])
            this.windows[randompick[changeColorOf]].setTint(this.colorManager.getUserColorPhaser(connectedUsers[index]))
        }
    }

    removeWindowOutOfViewport() {}

    getAttractionPoint(ghostPostion: Phaser.Math.Vector2): Phaser.Math.Vector2 | undefined {
        // TODO: factor in Distance to Ghost and diminishing returns from multiple windows
        let isOneOpen: boolean = false
        var attractTo: Phaser.Math.Vector2 = ghostPostion.clone()
        this.windows.forEach((fenster) => {
            if (fenster._isOpen && !fenster.checkOutOfViewport()) {
                isOneOpen = true
                var vect = fenster.getCenter(new Phaser.Math.Vector2()).subtract(ghostPostion)
                vect.scale(1 / vect.length())
                attractTo = attractTo.add(vect)
            }
        })
        if (isOneOpen) {
            return attractTo
        } else {
            undefined
        }
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
        setInterval(() => {
            this.randomWindowOwnership()
        }, 3000)
    }

    update(ghostPosition: Phaser.Math.Vector2) {
        if (this.posX == 0) {
            this.create()
        }

        this.posX = this.scene.cameras.main.worldView.right

        if (this.posX > this.steps) {
            if (use3Lane) {
                this.addWindows3Lane()
            } else {
                this.addWindowsRandomEqualized
            }
            this.steps = this.posX + this.windowBaseInterval
            this.addTorch()
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
            var w = new Window(this.scene, this.posX, Phaser.Math.Between(this.lane1top, this.lane1bot))
            this.windows.push(w)
            this.topThreshold = this.posX
        }
        if (this.windowThreshold + Phaser.Math.Between(this.minDistance, this.maxDistance) < this.posX) {
            var w = new Window(this.scene, this.posX, Phaser.Math.Between(this.lane2top, this.lane2bot))
            this.windows.push(w)
            this.windowThreshold = this.posX
        }
        if (this.bottomThreshold + Phaser.Math.Between(this.minDistance, this.maxDistance) < this.posX) {
            var w = new Window(this.scene, this.posX, Phaser.Math.Between(this.lane3top, this.lane3bot))
            this.windows.push(w)
            this.bottomThreshold = this.posX
        }
    }

    addTorch() {
        if (this.torchTopThreshold + Phaser.Math.Between(this.minDistance, this.maxDistance) < this.posX) {
            var p = Phaser.Math.Between(this.lane1top, this.lane1bot)
            this.summonTorch(this.posX - this.torchBoundary, p)
            this.torchTopThreshold = this.posX + Phaser.Math.Between(0, this.torchExtraDistTop)
        }
        if (this.torchMiddleThreshold + Phaser.Math.Between(this.minDistance, this.maxDistance) < this.posX) {
            var p = Phaser.Math.Between(this.lane2top, this.lane2bot)
            this.summonTorch(this.posX - this.torchBoundary, p)
            this.torchMiddleThreshold = this.posX + Phaser.Math.Between(0, this.torchExtraDistMid)
        }
        if (this.torchBotThreshold + Phaser.Math.Between(this.minDistance, this.maxDistance) < this.posX) {
            var p = Phaser.Math.Between(this.lane3top, this.lane3bot)
            this.summonTorch(this.posX - this.torchBoundary, p)
            this.torchBotThreshold = this.posX + Phaser.Math.Between(0, this.torchExtraDistBot)
        }
    }

    summonTorch(torchX: number, torchY: number) : boolean {
        var validTorch = true
        this.windows.forEach(fenster => {
            if (Phaser.Math.Distance.Between(fenster.x, fenster.y, torchX, torchY) < this.torchBoundary) {
                validTorch = false
            }
        })
        if (validTorch) {
            this.torches.push(new Torch(this.scene, torchX, torchY))
            return true
        }
        else {
            return false
        }
    }
}
