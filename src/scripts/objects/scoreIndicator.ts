export default class ScoreIndicator extends Phaser.Physics.Arcade.Sprite {
    _plusOneAnimation: Phaser.Animations.Animation | boolean
    _minusOneAnimation: Phaser.Animations.Animation | boolean
    _plusTwoAnimation: Phaser.Animations.Animation | boolean
    _plusThreeAnimation: Phaser.Animations.Animation | boolean

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'animationen', 'pluseins/pluseins_00.png')
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setDepth(100)
        this.generateAnimations()
    }

    private generateAnimations() {
        // --------------------------
        // SET FRAMES FOR ANIMATIONS
        // --------------------------
        const plusOneFrames = this.anims.animationManager.generateFrameNames('animationen', {
            start: 0,
            end: 29,
            prefix: 'pluseins/pluseins_',
            suffix: '.png',
            zeroPad: 2,
        })
        const plusTwoFrames = this.anims.animationManager.generateFrameNames('animationen', {
            start: 0,
            end: 29,
            prefix: 'pluszwei/pluszwei_',
            suffix: '.png',
            zeroPad: 2,
        })
        const plusThreeFrames = this.anims.animationManager.generateFrameNames('animationen', {
            start: 0,
            end: 29,
            prefix: 'plusdrei/plusdrei_',
            suffix: '.png',
            zeroPad: 2,
        })
        const minusOneFrames = this.anims.animationManager.generateFrameNames('animationen', {
            start: 0,
            end: 29,
            prefix: 'minuseins/minuseins_',
            suffix: '.png',
            zeroPad: 2,
        })

        // ------------------------------------
        // CREATE ANIMATION WITH FRAMES AND KEY
        // ------------------------------------
        this._plusOneAnimation = this.anims.animationManager.create({
            key: 'plusone_animation',
            frames: plusOneFrames,
            frameRate: 20,
            repeat: 0,
        })
        this._plusTwoAnimation = this.anims.animationManager.create({
            key: 'plustwo_animation',
            frames: plusTwoFrames,
            frameRate: 15,
            repeat: 0,
        })
        this._plusThreeAnimation = this.anims.animationManager.create({
            key: 'plusthree_animation',
            frames: plusThreeFrames,
            frameRate: 15,
            repeat: 0,
        })
        this._minusOneAnimation = this.anims.animationManager.create({
            key: 'minusone_animation',
            frames: minusOneFrames,
            frameRate: 15,
            repeat: 0,
        })
    }

    public showPlusOne(position: Phaser.Math.Vector2) {
        const positionWithOffset: Phaser.Math.Vector2 = new Phaser.Math.Vector2(position.x + 200, position.y - 50)
        this.setPosition(positionWithOffset.x, positionWithOffset.y)
        this.anims.play(this._plusOneAnimation as Phaser.Animations.Animation, false)
    }

    public showPlusTwo(position: Phaser.Math.Vector2) {
        const positionWithOffset: Phaser.Math.Vector2 = new Phaser.Math.Vector2(position.x + 200, position.y - 50)
        this.setPosition(positionWithOffset.x, positionWithOffset.y)
        this.anims.play(this._plusTwoAnimation as Phaser.Animations.Animation, false)
    }

    public showPlusThree(position: Phaser.Math.Vector2) {
        const positionWithOffset: Phaser.Math.Vector2 = new Phaser.Math.Vector2(position.x + 200, position.y - 50)
        this.setPosition(positionWithOffset.x, positionWithOffset.y)
        this.anims.play(this._plusThreeAnimation as Phaser.Animations.Animation, false)
    }

    public showMinusOne(position: Phaser.Math.Vector2) {
        const positionWithOffset: Phaser.Math.Vector2 = new Phaser.Math.Vector2(position.x + 200, position.y - 50)
        this.setPosition(positionWithOffset.x, positionWithOffset.y)
        this.anims.play(this._minusOneAnimation as Phaser.Animations.Animation, false)
    }

    update() {}
}
