import Trump from '../objects/trump'
import screenable from '../../helpers/screenable-helper'
import Ghost from '../objects/ghost'
import Window from '../objects/window'
import WindowManager from '../manager/windowManager'
import Progressbar from '../objects/progressbar'
import IFarben from '../manager/farben.interface'
import ColorManager from '../manager/colorManager'
//import Joystick from '@screenable/screenable/dist/types/core/controller/joystick'

export default class MainScene extends Phaser.Scene {
    userInputs: Map<string, any> = new Map()
    userColorAssociation: Map<string, IFarben> = new Map()
    unusedColors: Array<IFarben> = new Array()
    players: Map<string, Trump> = new Map()
    windowManager: WindowManager
    progress: Progressbar
    ghost: Ghost
    window: Window
    wallBG1: Phaser.GameObjects.TileSprite
    wallBG2: Phaser.GameObjects.TileSprite
    colorManger: ColorManager
    BGused: number
    unsubNewUser: () => void
    unsubUserLeft: () => void
    unsubJoystickMove: () => void

    constructor() {
        super({ key: 'MainScene' })
    }

    scroreUpdate() {
        this.progress.plusOne()
    }

    create() {
        this.cameras.main.setBounds(0, 0, 4000, 1080)
        this.colorManger = ColorManager.getInstance()
        this.wallBG1 = this.add.tileSprite(0, 0, 4000, 1080, 'brick').setOrigin(0, 0)
        this.BGused = 1
        this.ghost = new Ghost(this, 50, 540)
        this.window = new Window(this, 900, 200)
        this.progress = new Progressbar(this)
        setTimeout(() => {
            this.scroreUpdate()
            setTimeout(() => {
                this.scroreUpdate()
                setTimeout(() => {
                    this.scroreUpdate()
                    setTimeout(() => {
                        this.scroreUpdate()
                    }, 2000)
                }, 2000)
            }, 2000)
        }, 2000)

        this.cameras.main.startFollow(this.ghost, true, 0.8, 0.8, -700, 0)
        this.windowManager = new WindowManager(this)
        // - - - - - - - - - -
        // SCREENABLE EVENTS
        // - - - - - - - - - -
        this.unsubNewUser = screenable.events.onNewUser.sub((user) => {
            // Do whatever you want whenever a new user connects
            // you can access the user/userid by the passed user props
            this.userInputs.set(user.userID, '')
            const usercolor = this.colorManger.addUser(user.userID)

            if (usercolor) {
                setTimeout(
                    () => {
                        screenable.controller.sendScore(user, 's1', usercolor.screenableColor, '0', '0')
                    },
                    200,
                    usercolor
                )
            }
            setTimeout(() => {}, 1000)
            //screenable.controller.sendScore(user, 's1', 'brown-6', '0', '0')
            const newTrumpPlayer = new Trump(this, 100, 100)
            newTrumpPlayer.controllPlayer(user.userID)
            this.players.set(user.userID, newTrumpPlayer)
        })
        this.unsubUserLeft = screenable.events.onUserLeft.sub((user) => {
            // Do whatever you want whenever a user leaves
            // you can access the user/userid by the passed user props
            this.colorManger.removeUser(user.userID)
            if (this.userInputs.has(user.userID)) {
                this.userInputs.delete(user.userID)
            }
            if (this.players.has(user.userID)) {
                this.players.get(user.userID)!.destroy()
                this.players.delete(user.userID)
            }
        })
        this.unsubUserLeft = screenable.events.onJoystickMove.sub((user, joystick) => {
            // Do whatever you want whenever a joystick is moved
            // you can access the user/userid and joystick by the passed user props
            this.userInputs.set(user.userID, joystick)
        })
    }

    expandWord() {
        this.cameras.main.setBounds(0, 0, this.cameras.main.getBounds().width + 4000, 1080)
        if (this.BGused % 2) {
            this.wallBG1 = this.add
                .tileSprite(4000 * this.BGused, 0, 4000, 1080, 'brick')
                .setOrigin(0, 0)
                .setDepth(-1)
            this.BGused++
        } else {
            this.wallBG2 = this.add
                .tileSprite(4000 * this.BGused, 0, 4000, 1080, 'brick')
                .setOrigin(0, 0)
                .setDepth(-1)
            this.BGused++
        }
    }

    /*  movePlayers() {
        this.players.forEach((player: Trump, playerUserId: string) => {
            this.userInputs.forEach((joystick: any, inputUserId: string) => {
                if (joystick != '') {
                    if (player.isControlledByUser(inputUserId)) {
                        player.handleMove(joystick.get4Dir())
                    }
                }
            })
        })
    } */
    update() {
        /* this.movePlayers() */
        if (this.cameras.main.worldView.x > this.cameras.main.getBounds().width - 2000) {
            this.expandWord()
        }
        //console.log(this.cameras.main.worldView.x)
        this.ghost.update()
        this.window.update()
        this.windowManager.update(new Phaser.Math.Vector2())
        this.ghost.setAttractionPoint(
            this.windowManager.getAttractionPoint(this.ghost.getCenter(new Phaser.Math.Vector2()))
        )
    }
}
