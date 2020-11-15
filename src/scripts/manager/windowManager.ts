import { Vector } from 'matter'
import Window from '../objects/window'
import Torch from '../objects/torch'
import ColorManager from './colorManager'
import SpiderWeb from '../objects/spiderweb'

const use3Lane = true
const spawnWebs = true
const minWarmup = 1000
const maxWarmup = 5000
const offset = 500

export default class WindowManager {
    scene: Phaser.Scene
    windows: Window[] = new Array()
    torches: Torch[] = new Array()
    webs: SpiderWeb[] = new Array()
    torchCollisionGroup: Phaser.GameObjects.Group
    webCollisionGroup: Phaser.GameObjects.Group

    colorManager = ColorManager.getInstance()

    windowTopThreshold: number = 0
    windowMidThreshold: number = 0
    windowBotThreshold: number = 0
    windowBaseInterval = 20
    windowMinDistance = 300
    windowMaxDistance = 3000

    torchTopThreshold: number = Phaser.Math.Between(minWarmup, maxWarmup)
    torchMidThreshold: number = Phaser.Math.Between(minWarmup, maxWarmup)
    torchBotThreshold: number = Phaser.Math.Between(minWarmup, maxWarmup)
    torchWindowBoundary = 200
    torchExtraDistTop = 2000
    torchExtraDistMid = 5000
    torchExtraDistBot = 2000
    torchFlatteningTop = 300
    torchFlatteningMid = 300
    torchFlatteningBot = 300
    torchMinDistance = 100
    torchMaxDistance = 1000

    webTopThreshold: number = Phaser.Math.Between(minWarmup, maxWarmup)
    webMidThreshold: number = Phaser.Math.Between(minWarmup, maxWarmup)
    webBotThreshold: number = Phaser.Math.Between(minWarmup, maxWarmup)
    webWindowBoundary = 120
    webTorchBoundary = 200
    webExtraDistTop = 2000
    webExtraDistMid = 5000
    webExtraDistBot = 2000
    webFlatteningTop = 300
    webFlatteningMid = 300
    webFlatteningBot = 300
    webMinDistance = 100
    webMaxDistance = 1000

    posX: number = -offset
    steps: number = 0
    lane1top = 150
    lane1bot = 250
    lane2top = 450
    lane2bot = 550
    lane3top = 750
    lane3bot = 950

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.torchCollisionGroup = this.scene.add.group()
        this.webCollisionGroup = this.scene.add.group()
        console.log('managercreate')
    }

    getTorchOverlapGroup(): Phaser.GameObjects.Group {
        return this.torchCollisionGroup
    }

    getWebOverlapGroup(): Phaser.GameObjects.Group {
        return this.webCollisionGroup
    }

    userInput(userId: string) {
        // open window if user id matches
        this.windows.forEach((fenster) => {
            if (!fenster.checkOutOfViewport()) {
                if (fenster.isConntrolledByUser(userId)) {
                    if (!fenster._isOpen) {
                        fenster.openWindow()
                    } else {
                        fenster.closeWindow()
                    }
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
        console.log('num-user', connectedUsers.length)
        // random
        for (let index = 0; index < connectedUsers.length; index++) {
            const changeColorOf = Phaser.Math.Between(0, randompick.length - 1)
            console.log('change', randompick[changeColorOf], index)
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
        /* setInterval(() => {
            this.randomWindowOwnership()
        }, 3000) */
    }

    update(ghostPosition: Phaser.Math.Vector2) {
        if (this.posX <= 0) {
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
            if (spawnWebs) {
                this.addWeb()
            }
        }
        this.cleanUserAssignment()
    }

    cleanUserAssignment() {
        this.windows.forEach((fenster, index) => {
            if (fenster.checkOutOfViewport()) {
                fenster.removePlayerControll()
            }
        })
    }

    addWindowsRandomEqualized() {
        if (this.windowMidThreshold + Phaser.Math.Between(100, 1000) < this.posX) {
            this.windowMidThreshold = this.posX
            var p1 = Phaser.Math.Between(50, 1000)
            this.windows.push(new Window(this.scene, this.posX, p1, this.colorManager.getUnassignedUser()))

            if (Phaser.Math.Between(0, 100) > 75) {
                var p2 = Phaser.Math.Between(100, 1000)
                this.windows.push(new Window(this.scene, this.posX, p2, this.colorManager.getUnassignedUser()))

                if (Phaser.Math.Between(0, 100) > 75) {
                    var p3 = Phaser.Math.Between(100, 1000)
                    this.windows.push(new Window(this.scene, this.posX, p3, this.colorManager.getUnassignedUser()))
                }
            }
        }
    }

    addWindows3Lane() {
        if (this.windowTopThreshold + Phaser.Math.Between(this.windowMinDistance, this.windowMaxDistance) < this.posX) {
            this.windows.push(
                new Window(
                    this.scene,
                    this.posX + offset,
                    Phaser.Math.Between(this.lane1top, this.lane1top),
                    this.colorManager.getUnassignedUser()
                )
            )
            this.windowTopThreshold = this.posX
        }
        if (this.windowMidThreshold + Phaser.Math.Between(this.windowMinDistance, this.windowMaxDistance) < this.posX) {
            this.windows.push(
                new Window(
                    this.scene,
                    this.posX + offset,
                    Phaser.Math.Between(this.lane2top, this.lane2bot),
                    this.colorManager.getUnassignedUser()
                )
            )
            this.windowMidThreshold = this.posX
        }
        if (this.windowBotThreshold + Phaser.Math.Between(this.windowMinDistance, this.windowMaxDistance) < this.posX) {
            this.windows.push(
                new Window(
                    this.scene,
                    this.posX + offset,
                    Phaser.Math.Between(this.lane3top, this.lane3bot),
                    this.colorManager.getUnassignedUser()
                )
            )
            this.windowBotThreshold = this.posX
        }
    }

    addTorch() {
        if (this.torchTopThreshold + Phaser.Math.Between(this.torchMinDistance, this.torchMaxDistance) < this.posX) {
            var p = Phaser.Math.Between(this.lane1top, this.lane1bot)
            this.summonTorch(this.posX - this.torchWindowBoundary + offset, p) ?
                this.torchTopThreshold = this.posX + Math.max(0, Phaser.Math.Between(this.torchFlatteningTop, this.torchExtraDistTop)) : {}
        }
        if (this.torchMidThreshold + Phaser.Math.Between(this.torchMinDistance, this.torchMaxDistance) < this.posX) {
            var p = Phaser.Math.Between(this.lane2top, this.lane2bot)
            this.summonTorch(this.posX - this.torchWindowBoundary + offset, p) ?
                this.torchMidThreshold = this.posX + Math.max(0, Phaser.Math.Between(this.torchFlatteningMid, this.torchExtraDistMid)) : {}
        }
        if (this.torchBotThreshold + Phaser.Math.Between(this.torchMinDistance, this.torchMaxDistance) < this.posX) {
            var p = Phaser.Math.Between(this.lane3top, this.lane3bot)
            this.summonTorch(this.posX - this.torchWindowBoundary + offset, p) ?
                this.torchBotThreshold = this.posX + Math.max(0, Phaser.Math.Between(this.torchFlatteningBot, this.torchExtraDistBot)) : {}
        }
    }

    summonTorch(torchX: number, torchY: number): boolean {
        let validTorch = true
        this.windows.forEach((fenster) => {
            if (Phaser.Math.Distance.Between(fenster.x, fenster.y, torchX, torchY) < this.torchWindowBoundary) {
                validTorch = false
            }
        })
        if (validTorch) {
            const t = new Torch(this.scene, torchX, torchY)
            this.torchCollisionGroup.add(t)
            this.torches.push(t)
            return true
        } else {
            return false
        }
    }

    addWeb() {
        if (this.webTopThreshold + Phaser.Math.Between(this.webMinDistance, this.webMaxDistance) < this.posX) {
            let p = Phaser.Math.Between(this.lane1top, this.lane1bot)
            if (this.summonWeb(this.posX - this.webTorchBoundary - this.torchWindowBoundary + offset, p)) {
                this.webTopThreshold = this.posX + Math.max(0, Phaser.Math.Between(this.webFlatteningTop, this.webExtraDistTop))
            }
        }
        if (this.webMidThreshold + Phaser.Math.Between(this.webMinDistance, this.webMaxDistance) < this.posX) {
            let p = Phaser.Math.Between(this.lane2top, this.lane2bot)
            if (this.summonWeb(this.posX - this.webTorchBoundary - this.torchWindowBoundary + offset, p)) {
                this.webMidThreshold = this.posX + Math.max(0, Phaser.Math.Between(this.webFlatteningMid, this.webExtraDistMid))
            }
        }
        if (this.webBotThreshold + Phaser.Math.Between(this.webMinDistance, this.webMaxDistance) < this.posX) {
            let p = Phaser.Math.Between(this.lane3top, this.lane3bot)
            if (this.summonWeb(this.posX - this.webTorchBoundary - this.torchWindowBoundary + offset, p)) {
                this.webBotThreshold = this.posX + Math.max(0, Phaser.Math.Between(this.webFlatteningBot, this.webExtraDistBot))
            }
        }
    }

    summonWeb(webX: number, webY: number): boolean {
        let validWeb = true
        this.windows.forEach((fenster) => {
            if (Phaser.Math.Distance.Between(fenster.x, fenster.y, webX, webY) < this.webWindowBoundary) {
                validWeb = false
            }
        })
        this.torches.forEach((fackel) => {
            if (Phaser.Math.Distance.Between(fackel.x, fackel.y, webX, webY) < this.webTorchBoundary) {
                validWeb = false
            }
        })
        if (validWeb) {
            const w = new SpiderWeb(this.scene, webX, webY)
            this.webCollisionGroup.add(w)
            this.webs.push(w)
            return true
        } else {
            return false
        }
    }
}
