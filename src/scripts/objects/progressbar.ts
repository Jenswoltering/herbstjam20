export default class Progressbar extends Phaser.Physics.Arcade.Sprite {
    score: number
    progressBarBar: Phaser.GameObjects.Graphics
    _shadows: Phaser.Animations.Animation | boolean

    targetScore = 15

    constructor(scene: Phaser.Scene) {
        super(scene, 200, 100, 'progressbar')
        this.setDepth(99)
        this.score = 0
        this.progressBarBar = this.scene.add.graphics().setScrollFactor(0)
        this.progressBarBar.setDepth(98)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        const shadowsFrames = this.anims.animationManager.generateFrameNames('animationen', {
            start: 1,
            end: 4,
            prefix: 'progress/Progress_',
            suffix: '.png',
            zeroPad: 2,
        })
        this._shadows = this.anims.animationManager.create({
            key: 'progress_wabble',
            frames: shadowsFrames,
            frameRate: 6,
            repeat: -1,
        })
        this.anims.play(this._shadows as Phaser.Animations.Animation, true)
        this.setScrollFactor(0)
    }

    public plusOne(bonus: number) {
        if (this.score <= this.targetScore) {
            this.score += bonus
            this.score > this.targetScore ? this.score = this.targetScore : {}
            this.progressBarBar.clear()
            this.progressBarBar.fillStyle(0xb6eef2, 1)
            this.progressBarBar.fillRect(54, 100, (300 / this.targetScore) * this.score, 37)
        }
    }

    public minusOne() {
        if (this.score > 0) {
            this.score--
            this.progressBarBar.clear()
            this.progressBarBar.fillStyle(0xb6eef2, 1)
            this.progressBarBar.fillRect(54, 100, (300 / this.targetScore) * this.score, 37)
        }
    }
    public getScore(): number {
        return this.score
    }

    public getScoreDifference(): number {
        return this.targetScore - this.score
    }
    update() {}
}
