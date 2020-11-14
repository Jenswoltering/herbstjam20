export default class Window extends Phaser.Physics.Arcade.Sprite {
    _openAnimation: Phaser.Animations.Animation | boolean
    _idleAnimation: Phaser.Animations.Animation | boolean
    _closeAnimation: Phaser.Animations.Animation | boolean
    _windyAnimation: Phaser.Animations.Animation | boolean
    _isOpen: boolean
    _controlledByUser: string

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'window_closed')
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.generateAnimations()
    }

    controllPlayer(userId: string) {
        this._controlledByUser = userId
    }
    isConntrolledByUser(userId: string): boolean {
        if (this._controlledByUser == userId) {
            return true
        } else {
            return false
        }
    }
    removePlayerControll() {
        this._controlledByUser = ''
        this.clearTint()
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

    openWindow() {
        this._isOpen = true
        this.setTexture('window_open')
        setTimeout(() => {
            this.closeWindow()
        }, 4000)
    }
    closeWindow() {
        this._isOpen = false
        this.clearTint()
        this.setTexture('window_closed')
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

    public checkOutOfViewport(): boolean {
        if (this.scene.cameras.main.worldView.contains(this.body.x + 150, this.body.y)) {
            return false
        } else {
            return true
        }
    }

    update() {
        this.checkOutOfViewport()
    }
}
