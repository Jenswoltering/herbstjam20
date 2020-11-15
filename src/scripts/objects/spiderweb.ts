export default class SpiderWeb extends Phaser.Physics.Arcade.Sprite {
    _idleAnimation: Phaser.Animations.Animation | boolean
    _breakAnimation: Phaser.Animations.Animation | boolean
    _isBroken: boolean
    _controlledByUser: string

    slowdown = 0.5
    breaking = 20

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'spiderweb')
        scene.add.existing(this)
        scene.physics.add.existing(this)

        //this.generateAnimations()
        //this.playIdle()
        this._isBroken = false
        this.body.setSize(120, 120)
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
            start: 0,
            end: 5,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })

        // ------------------------------------
        // CREATE ANIMATION WITH FRAMES AND KEY
        // ------------------------------------
        this._idleAnimation = this.anims.animationManager.create({
            key: 'spiderweb',
            frames: bruningFrames,
            frameRate: 8,
            repeat: -1,
        })
        this._breakAnimation = this.anims.animationManager.create({
            key: 'torch_extinguish',
            frames: extinguishFrames,
            frameRate: 20,
            repeat: -1,
        })
    }

    breakWeb(): boolean {
        console.log('web breaking: ' + this.breaking)
        if (this.breaking <= 0) {
            this._isBroken = true
            this.clearTint()
            // this.setTint(0xff0000)
            this.setTexture('spiderweb_ripped')
            return false
        } else {
            this.breaking--
            return true
        }
    }

    public playBreak() {
        this.setTexture('animationen', 'fackelaus/torch_off.png')
        //this.anims.play(this._extinguishAnimation as Phaser.Animations.Animation, true)
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
