export default class Window extends Phaser.Physics.Arcade.Sprite {
    _openAnimation: Phaser.Animations.Animation | boolean
    _idleAnimation: Phaser.Animations.Animation | boolean
    _closeAnimation: Phaser.Animations.Animation | boolean
    _windyAnimation: Phaser.Animations.Animation | boolean
    _isOpen: boolean
    _controlledByUser: string

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'window')
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.generateAnimations()
    }

    controllPlayer(userId: string) {
        this._controlledByUser = userId
    }

    private generateAnimations() {
        // --------------------------
        // SET FRAMES FOR ANIMATIONS
        // --------------------------
        const openFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 18,
            end: 23,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })
        const closeFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 0,
            end: 5,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })
        const windyFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 6,
            end: 11,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })
        const idleFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 12,
            end: 17,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })

        // ------------------------------------
        // CREATE ANIMATION WITH FRAMES AND KEY
        // ------------------------------------
        this._windyAnimation = this.anims.animationManager.create({
            key: 'trump-down',
            frames: windyFrames,
            frameRate: 12,
            repeat: -1,
        })
        this._idleAnimation = this.anims.animationManager.create({
            key: 'trump-right',
            frames: idleFrames,
            frameRate: 20,
            repeat: -1,
        })
        this._closeAnimation = this.anims.animationManager.create({
            key: 'trump-up',
            frames: closeFrames,
            frameRate: 20,
            repeat: -1,
        })
    }

    public playOpen() {
        this.anims.play(this._openAnimation as Phaser.Animations.Animation, true)
    }

    public playClose() {
        this.anims.play(this._closeAnimation as Phaser.Animations.Animation, true)
    }

    public playWindy() {
        this.anims.play(this._windyAnimation as Phaser.Animations.Animation, true)
    }

    public playIdle() {
        this.anims.play(this._idleAnimation as Phaser.Animations.Animation, true)
    }

    update() {}
}
