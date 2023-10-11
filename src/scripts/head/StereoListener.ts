import { Ear, Point2D } from "./Ear";
import { Container, Sprite } from 'pixi.js';
export class StereoListener extends Container {

    leftEar: Ear;
    rightEar: Ear;


    constructor(headSize = 100) {
        super()
        this.leftEar = new Ear();
        this.rightEar = new Ear();
        this.addChild(this.leftEar)
        this.addChild(this.rightEar)

        this.on('added', () => {
            this.leftEar.position.set(0.5)
            
            const { height, width, x, y } = this.parent

            this.leftEar.position.set(x, y + (height / 2));
            this.rightEar.position.set(x+width, y + (height / 2));
            // this.rightEar.x = x + width
            // this.rightEar.y = y + (height / 2)
            // this.leftEar.position.set(x, y + (height / 2));
            
        })
    }



    hear(soundSource: Sprite) {
        // Ouve com cada orelha virtual
        const leftEarResult = this.leftEar.hear(soundSource);
        const rightEarResult = this.rightEar.hear(soundSource);

        // Retorna os resultados combinados em um formato estéreo
        // return {
        //     leftVolume: leftEarResult.volume,
        //     leftDirection: leftEarResult.direction,
        //     rightVolume: rightEarResult.volume,
        //     rightDirection: rightEarResult.direction,
        // };
    }
}
