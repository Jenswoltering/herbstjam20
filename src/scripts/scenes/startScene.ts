import screenable from '../../helpers/screenable-helper'
import ColorManager from '../manager/colorManager'
import ScreenBlocked from '../../helpers/screenBlocked'

//import Joystick from '@screenable/screenable/dist/types/core/controller/joystick'

export default class StartScene extends Phaser.Scene {
    unsubNewUser: () => void
    unsubUserLeft: () => void
    unsubButtonPress: () => void
    unsubServerError: () => void
    bgImage: Phaser.GameObjects.Sprite
    titleSprite: Phaser.GameObjects.Sprite
    _titleAnimation: Phaser.Animations.Animation | boolean
    colorManger: ColorManager
    constructor() {
        super({ key: 'StartScene' })
        this.colorManger = ColorManager.getInstance()
    }

    create() {
        console.log('startscene start')
        const titleFrames = this.anims.generateFrameNames('animationen', {
            start: 1,
            end: 4,
            prefix: 'title/title_',
            suffix: '.png',
            zeroPad: 2,
        })
        this._titleAnimation = this.anims.create({
            key: 'title_animation',
            frames: titleFrames,
            frameRate: 6,
            repeat: -1,
        })
        this.bgImage = this.add.sprite(0, 0, 'menu_bg').setOrigin(0, 0)
        this.titleSprite = this.add.sprite(600, 350, 'animationen', 'title/title_01.png')
        this.titleSprite.play('title_animation')
        if (screenable.errorEncountered == true) {
            console.log('errrrror')
            new ScreenBlocked(this, this.cameras.main.width / 2, this.cameras.main.height / 2)
        }
        this.unsubServerError = screenable.events.onServerFailResponse.sub((msg) => {
            console.log('fehler', msg)
            new ScreenBlocked(this, this.cameras.main.width / 2, this.cameras.main.height / 2)
        })
        this.unsubNewUser = screenable.events.onNewUser.sub((user) => {
            // change scene

            const usercolor = this.colorManger.addUser(user.userID)

            if (usercolor) {
                setTimeout(
                    () => {
                        screenable.controller.sendScore(user, 's1', usercolor.screenableColor, '0', '0')
                    },
                    0,
                    usercolor
                )
            }
            //setTimeout(() => {}, 1000)

            this.unsubNewUser()
            this.scene.start('MainScene')
            /* this.scene.transition({
                target: 'MainScene',
                duration: 200,
                sleep: false,
            }) */
        })
    }

    update() {}
}
