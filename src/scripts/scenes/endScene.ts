import screenable from '../../helpers/screenable-helper'
import ColorManager from '../manager/colorManager'

//import Joystick from '@screenable/screenable/dist/types/core/controller/joystick'

export default class EndScene extends Phaser.Scene {
    unsubNewUser: () => void
    unsubUserLeft: () => void
    unsubButtonPress: () => void
    bgImage: Phaser.GameObjects.Sprite
    titleSprite: Phaser.GameObjects.Sprite
    _titleAnimation: Phaser.Animations.Animation | boolean
    colorManger: ColorManager
    constructor() {
        super({ key: 'EndScene' })
        this.colorManger = ColorManager.getInstance()
    }

    create() {
        screenable.rewards.sendRewardToAll(1)

        this.unsubUserLeft = screenable.events.onUserLeft.sub((user) => {
            // Do whatever you want whenever a user leaves
            // you can access the user/userid by the passed user props
            this.colorManger.removeUser(user.userID)
        })
        /* const titleFrames = this.anims.generateFrameNames('animationen', {
            start: 1,
            end: 4,
            prefix: 'title/title_',
            suffix: '.png',
            zeroPad: 2,
        })
        this._titleAnimation = this.anims.create({
            key: 'title_end_animation',
            frames: titleFrames,
            frameRate: 6,
            repeat: -1,
        }) */
        this.bgImage = this.add.sprite(0, 0, 'end_bg').setOrigin(0, 0)
        setTimeout(() => {
            this.unsubUserLeft()
            this.scene.transition({
                target: 'StartScene',
                duration: 1,
                sleep: false,
            })
        }, 5000)
        //this.titleSprite = this.add.sprite(600, 350, 'animationen', 'title/title_01.png')
        //this.titleSprite.play('title_end_animation')
        /* this.unsubNewUser = screenable.events.onNewUser.sub((user) => {
            // change scene

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

            this.unsubNewUser()
            this.scene.transition({
                target: 'MainScene',
                duration: 1,
                sleep: false,
            })
        })*/
    }

    update() {}
}
