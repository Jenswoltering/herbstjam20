import Window from './window'
export default class Ghost extends Phaser.Physics.Arcade.Sprite {
    _attractedANimation: Phaser.Animations.Animation | boolean
    _toCloseAnimation: Phaser.Animations.Animation | boolean
    _collideAnimation: Phaser.Animations.Animation | boolean
    _flyAnimation: Phaser.Animations.Animation | boolean
    _collectAnimation: Phaser.Animations.Animation | boolean
    _controlledByUser: string
    _attractionPoint: Phaser.Math.Vector2 | null
    _defaultAttraction: Phaser.Math.Vector2
    _isAttracted: boolean

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ghost')
        scene.add.existing(this)
        this.setDepth(90)
        scene.physics.add.existing(this)
        this.setCollideWorldBounds(true)

        this._isAttracted = false
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
        const collideFrame = this.anims.animationManager.generateFrameNames('trump', {
            start: 18,
            end: 23,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })
        const collectFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 0,
            end: 5,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })
        const attractFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 6,
            end: 11,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })
        const toCloseFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 12,
            end: 17,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })
        const flayFrames = this.anims.animationManager.generateFrameNames('trump', {
            start: 1,
            end: 1,
            prefix: 'trump/trump_run-',
            suffix: '.png',
            zeroPad: 1,
        })

        // ------------------------------------
        // CREATE ANIMATION WITH FRAMES AND KEY
        // ------------------------------------
        this._collideAnimation = this.anims.animationManager.create({
            key: 'trump-down',
            frames: collideFrame,
            frameRate: 12,
            repeat: -1,
        })
        this._flyAnimation = this.anims.animationManager.create({
            key: 'trump-right',
            frames: flayFrames,
            frameRate: 20,
            repeat: -1,
        })
        this._collectAnimation = this.anims.animationManager.create({
            key: 'trump-up',
            frames: collectFrames,
            frameRate: 20,
            repeat: -1,
        })
        this._toCloseAnimation = this.anims.animationManager.create({
            key: 'trump-left',
            frames: toCloseFrames,
            frameRate: 20,
            repeat: -1,
        })
        this._attractedANimation = this.anims.animationManager.create({
            key: 'trump-idle',
            frames: attractFrames,
            frameRate: 20,
            repeat: -1,
        })
    }

    public playFlying() {
        this.anims.play(this._flyAnimation as Phaser.Animations.Animation, true)
    }

    public playCollect() {
        this.anims.play(this._collectAnimation as Phaser.Animations.Animation, true)
    }

    public palyAttract() {
        this.anims.play(this._attractedANimation as Phaser.Animations.Animation, true)
    }

    public playToClose() {
        this.anims.play(this._toCloseAnimation as Phaser.Animations.Animation, true)
    }

    public playCollide() {
        this.anims.play(this._collideAnimation as Phaser.Animations.Animation, true)
    }

    public setAttractionPoint(point: Phaser.Math.Vector2) {
        this._isAttracted = true
        this._attractionPoint = point
    }

    public removeAttractionPoint() {
        this._isAttracted = false
        this._attractionPoint = null
    }

    update() {
        //super.update()
        if (this._isAttracted) {
            this.scene.physics.accelerateTo(this, this._attractionPoint!.x, this._attractionPoint!.y, 800)
        } else {
            this._defaultAttraction = new Phaser.Math.Vector2(this.body.x + 500, 540)
            this.scene.physics.accelerateTo(this, this._defaultAttraction!.x, this._defaultAttraction!.y, 200, 280, 160)
        }
    }
}
