export default class ScreenBlocked extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        let backdrop = scene.add
            .rectangle(
                scene.cameras.main.width / 2,
                scene.cameras.main.height / 2,
                scene.cameras.main.width,
                scene.cameras.main.height,
                0x424242,
                0.8
            )
            .setDepth(888)
        super(scene, x, y, 'already_open')
        scene.add.existing(this)

        scene.physics.add.existing(this)
        this.setDepth(999)
    }
}
