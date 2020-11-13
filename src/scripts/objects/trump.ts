//import Joystick from '@screenable/screenable/dist/types/core/controller/joystick'

export default class Trump extends Phaser.Physics.Arcade.Sprite {
    _walkLeftAnimation: Phaser.Animations.Animation | boolean
    _walkRightAnimation: Phaser.Animations.Animation | boolean
    _walkUpAnimation: Phaser.Animations.Animation | boolean
    _walkDownAnimation: Phaser.Animations.Animation | boolean
    _idleAnimation: Phaser.Animations.Animation | boolean
    _controlledByUser: string

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'trump', 'trump/trump_run-1.png')
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this._controlledByUser = ''
        this.generateAnimations()
    }

    controllPlayer(userId: string) {
        this._controlledByUser = userId
    }

    isControlledByUser(userId: string): boolean {
        if (this._controlledByUser === userId) {
            return true
        } else {
            return false
        }
    }
    private generateAnimations() {
        // --------------------------
        // SET FRAMES FOR ANIMATIONS
        // --------------------------
        const leftFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 18,
            end: 23,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })
        const downFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 0,
            end: 5,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })
        const rightFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 6,
            end: 11,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })
        const upFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 12,
            end: 17,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })
        const idleFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 1,
            end: 1,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })

        // ------------------------------------
        // CREATE ANIMATION WITH FRAMES AND KEY
        // ------------------------------------
        this._walkDownAnimation = this.anims.animationManager.create({
            key: 'trump-down',
            frames: downFrames,
            frameRate: 12,
            repeat: -1,
        })
        this._walkRightAnimation = this.anims.animationManager.create({
            key: 'trump-right',
            frames: rightFrames,
            frameRate: 20,
            repeat: -1,
        })
        this._walkUpAnimation = this.anims.animationManager.create({
            key: 'trump-up',
            frames: upFrames,
            frameRate: 20,
            repeat: -1,
        })
        this._walkLeftAnimation = this.anims.animationManager.create({
            key: 'trump-left',
            frames: leftFrames,
            frameRate: 20,
            repeat: -1,
        })
        this._idleAnimation = this.anims.animationManager.create({
            key: 'trump-idle',
            frames: idleFrames,
            frameRate: 20,
            repeat: -1,
        })
    }

    handleMove(joystickMove: string) {
        switch (joystickMove) {
            case 'UP':
                this.walkUp()
                break
            case 'RIGHT':
                this.walkRight()
                break
            case 'DOWN':
                this.walkDown()
                break
            case 'LEFT':
                this.walkLeft()
                break
            case 'NO':
                this.idle()
                break
            default:
                this.idle()
                break
        }
    }

    public idle() {
        this.setVelocity(0, 0)
        this.anims.play(this._idleAnimation as Phaser.Animations.Animation, true)
    }

    public walkLeft() {
        this.setVelocity(-75, 0)
        this.anims.play(this._walkLeftAnimation as Phaser.Animations.Animation, true)
    }

    public walkRight() {
        this.setVelocity(75, 0)
        this.anims.play(this._walkRightAnimation as Phaser.Animations.Animation, true)
    }

    public walkUp() {
        this.setVelocity(0, -75)
        this.anims.play(this._walkUpAnimation as Phaser.Animations.Animation, true)
    }

    public walkDown() {
        this.setVelocity(0, 75)
        this.anims.play(this._walkDownAnimation as Phaser.Animations.Animation, true)
    }

    update() {
        //super.update()
    }
}
