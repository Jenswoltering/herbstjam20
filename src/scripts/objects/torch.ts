export default class Torch extends Phaser.Physics.Arcade.Sprite {
    _extinguishAnimation: Phaser.Animations.Animation | boolean
    _burningAnimation: Phaser.Animations.Animation | boolean
    _isOn: boolean
    _controlledByUser: string

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'animationen', 'fackel/torch_on_01.png')
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.body.setSize(80, 120)
        this._isOn = true
        this.generateAnimations()
        this.playBurn()
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
        const bruningFrames = this.anims.animationManager.generateFrameNames('animationen', {
            start: 1,
            end: 3,
            prefix: 'fackel/torch_on_',
            suffix: '.png',
            zeroPad: 2,
        })
        const extinguishFrames = this.anims.animationManager.generateFrameNames('animationen', {
            start: 1,
            end: 1,
            prefix: 'fackelaus/torch_off_',
            suffix: '.png',
            zeroPad: 1,
        })

        // ------------------------------------
        // CREATE ANIMATION WITH FRAMES AND KEY
        // ------------------------------------
        this._burningAnimation = this.anims.animationManager.create({
            key: 'torch_burn',
            frames: bruningFrames,
            frameRate: 8,
            repeat: -1,
        })
        this._extinguishAnimation = this.anims.animationManager.create({
            key: 'torch_extinguish',
            frames: extinguishFrames,
            frameRate: 1,
            repeat: -1,
        })
    }

    lightTorch() {
        this._isOn = true
        //this.setTexture('torch_on')
        setTimeout(() => {
            this.extinguishTorch()
        }, 4000)
    }
    extinguishTorch() {
        this._isOn = false
        this.clearTint()
        this.playExtinguish()
        //this.setTexture('animationen', 'fackelaus/torch_off.png')
    }

    public playExtinguish() {
        this.anims.play(this._extinguishAnimation as Phaser.Animations.Animation, true)
        //this.setTexture('animationen', 'fackelaus/torch_off.png')
        //this.anims.play(this._extinguishAnimation as Phaser.Animations.Animation, true)
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
