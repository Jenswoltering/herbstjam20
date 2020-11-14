export default class Progressbar extends Phaser.Physics.Arcade.Sprite {
    score: number
    progressBarBar: Phaser.GameObjects.Graphics
    constructor(scene: Phaser.Scene) {
        super(scene, 300, 100, 'progressbar')
        this.setDepth(99)
        this.score = 0
        this.progressBarBar = this.scene.add.graphics().setScrollFactor(0)
        this.progressBarBar.setDepth(98)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setScrollFactor(0)
    }

    public plusOne() {
        if (this.score <= 10) {
            this.progressBarBar.clear()
            this.progressBarBar.fillStyle(0xb6eef2, 1)
            this.progressBarBar.fillRect(90, 100, (440 / 10) * this.score, 57)
            this.score++
        }
    }
    public getScore(): number {
        return this.score
    }
    update() {}
}
