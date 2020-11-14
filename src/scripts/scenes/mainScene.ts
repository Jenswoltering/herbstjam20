import Trump from '../objects/trump'
import screenable from '../../helpers/screenable-helper'
import Ghost from '../objects/ghost'
import Window from '../objects/window'
//import Joystick from '@screenable/screenable/dist/types/core/controller/joystick'

export default class MainScene extends Phaser.Scene {
    userInputs: Map<string, any> = new Map()
    players: Map<string, Trump> = new Map()
    ghost: Ghost
    window: Window
    unsubNewUser: () => void
    unsubUserLeft: () => void
    unsubJoystickMove: () => void

    constructor() {
        super({ key: 'MainScene' })
    }

    create() {
        this.add
            .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
                color: '#000000',
                fontSize: 24,
            })
            .setOrigin(1, 0)
        this.cameras.main.setBounds(0, 0, 9999, 1080)

        this.add.tileSprite(0, 0, 5000, 1080, 'brick').setOrigin(0, 0)
        this.ghost = new Ghost(this, 50, 540)
        this.window = new Window(this, 900, 200)

        this.cameras.main.startFollow(this.ghost, true, 0.8, 0.8, -700, 0)
        setTimeout(() => {
            this.window._isOpen = true
            this.ghost.setAttractionPoint(this.window.body.position)
            setTimeout(() => {
                this.window._isOpen = false

                this.ghost.removeAttractionPoint()
            }, 2000)
        }, 3000)

        // - - - - - - - - - -
        // SCREENABLE EVENTS
        // - - - - - - - - - -
        this.unsubNewUser = screenable.events.onNewUser.sub((user) => {
            // Do whatever you want whenever a new user connects
            // you can access the user/userid by the passed user props
            this.userInputs.set(user.userID, '')
            const newTrumpPlayer = new Trump(this, 100, 100)
            newTrumpPlayer.controllPlayer(user.userID)
            this.players.set(user.userID, newTrumpPlayer)
        })
        this.unsubUserLeft = screenable.events.onUserLeft.sub((user) => {
            // Do whatever you want whenever a user leaves
            // you can access the user/userid by the passed user props
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
        this.ghost.update()
    }
}
