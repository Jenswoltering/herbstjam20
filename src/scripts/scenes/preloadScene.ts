export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' })
    }

    preload() {
        this.load.setPath('assets/')
        this.load.image('brick', 'img/haunted_background.png')
        this.load.image('ghost', 'img/sir_ghost.png')
        this.load.image('progressbar', 'img/progressbar.png')
        this.load.multiatlas('plusone', 'plusone.json')
        this.load.image('window_closed', 'img/window_opaque_closed.png')
        this.load.image('menu_bg', 'img/menu_bg.jpg')
        this.load.image('end_bg', 'img/end_bg.jpg')
        this.load.image('window_open', 'img/window_opaque_open.png')
        this.load.image('web', 'img/web.png')
        this.load.multiatlas('animationen', 'animationen.json')
        this.load.multiatlas('trump', 'trump.json')
        this.load.audio('sound_window_open', 'sounds/fensterauf.mp3')
        this.load.audio('sound_window_close', 'sounds/fensterzu.mp3')
    }

    create() {
        this.scene.start('StartScene')

        /**
         * This is how you would dynamically import the mainScene class (with code splitting),
         * add the mainScene to the Scene Manager
         * and start the scene.
         * The name of the chunk would be 'mainScene.chunk.js
         * Find more@ about code splitting here: https://webpack.js.org/guides/code-splitting/
         */
        // let someCondition = true
        // if (someCondition)
        //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
        //     this.scene.add('MainScene', mainScene.default, true)
        //   })
        // else console.log('The mainScene class will not even be loaded by the browser')
    }
}
