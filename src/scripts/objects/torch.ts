export default class Torch extends Phaser.Physics.Arcade.Sprite {
    _extinguishAnimation: Phaser.Animations.Animation | boolean
    _burningAnimation: Phaser.Animations.Animation | boolean
    _isOn: boolean
    _controlledByUser: string

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'torch_burning')
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
        this._burningAnimation = this.anims.animationManager.create({
            key: 'trump-down',
            frames: windyFrames,
            frameRate: 12,
            repeat: -1,
        })
        this._extinguishAnimation = this.anims.animationManager.create({
            key: 'trump-right',
            frames: idleFrames,
            frameRate: 20,
            repeat: -1,
        })
    }

    lightTorch() {
        this._isOn = true
        this.setTexture('torch_on')
        setTimeout(() => {
            this.extinguishTorch()
        }, 4000)
    }
    extinguishTorch() {
        this._isOn = false
        this.clearTint()
        this.setTexture('torch_off')
    }

    public playExtinguish() {
        this.anims.play(this._extinguishAnimation as Phaser.Animations.Animation, true)
    }

    public playBurn() {
        this.anims.play(this._burningAnimation as Phaser.Animations.Animation, true)
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
