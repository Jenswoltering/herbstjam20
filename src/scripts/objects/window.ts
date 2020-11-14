import ColorManager from '../manager/colorManager'

export default class Window extends Phaser.Physics.Arcade.Sprite {
    _openAnimation: Phaser.Animations.Animation | boolean
    _idleAnimation: Phaser.Animations.Animation | boolean
    _closeAnimation: Phaser.Animations.Animation | boolean
    _windyAnimation: Phaser.Animations.Animation | boolean
    _isOpen: boolean
    _controlledByUser: string
    colorManager: ColorManager

    constructor(scene: Phaser.Scene, x: number, y: number, assignUser?: string | null) {
        super(scene, x, y, 'animationen', 'Fensterzu/window_01.png')
        this.colorManager = ColorManager.getInstance()
        scene.add.existing(this)
        scene.physics.add.existing(this)
        if (assignUser) {
            this.controllPlayer(assignUser)
        }

        this.generateAnimations()
    }

    controllPlayer(userId: string) {
        this._controlledByUser = userId
        this.colorManager.setUserAssigned(userId)
        this.setTint(this.colorManager.getUserColorPhaser(userId))
    }
    isConntrolledByUser(userId: string): boolean {
        if (this._controlledByUser == userId) {
            return true
        } else {
            return false
        }
    }
    removePlayerControll() {
        if (this._controlledByUser != '') {
            this.colorManager.removeUserAssigned(this._controlledByUser)
            this._controlledByUser = ''
            this.clearTint()
        }
    }

    private generateAnimations() {
        // --------------------------
        // SET FRAMES FOR ANIMATIONS
        // --------------------------
        const openFrames = this.anims.animationManager.generateFrameNames('animationen', {
            start: 1,
            end: 21,
            prefix: 'fensterauf/fensterauf_',
            suffix: '.png',
            zeroPad: 2,
        })
        const closeFrames = this.anims.animationManager.generateFrameNames('animationen', {
            start: 1,
            end: 1,
            prefix: 'Fensterzu/window_',
            suffix: '.png',
            zeroPad: 2,
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
            key: 'close_fenster',
            frames: closeFrames,
            frameRate: 20,
            repeat: -1,
        })
        this._openAnimation = this.anims.animationManager.create({
            key: 'open_window',
            frames: openFrames,
            frameRate: 20,
            repeat: -1,
        })
    }

    openWindow() {
        this._isOpen = true
        //this.setTexture('window_open')
        this.playOpen()
        //this.anims.play(this._openAnimation as Phaser.Animations.Animation, true)
        setTimeout(() => {
            this.closeWindow()
        }, 3000)
    }
    closeWindow() {
        this._isOpen = false
        this.removePlayerControll()
        this.playClose()
        this.clearTint()
        //this.setTexture('window_closed')
    }
    toggleWindow() {
        if (this._isOpen) {
            this.closeWindow
        } else {
            this.openWindow
        }
    }

    public playOpen() {
        this.scene.sound.play('sound_window_open')
        this.anims.play(this._openAnimation as Phaser.Animations.Animation, true)
    }

    public playClose() {
        this.scene.sound.play('sound_window_close')
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
