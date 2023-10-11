import { Graphics, Sprite } from 'pixi.js';
export interface Point2D {
  x: number;
  y: number;
}

export class Ear extends Graphics {
  public path = new Graphics()
  constructor() {
    super()
    this.lineStyle(20, 0xff0000, 1)
    this.drawRect(this.x, this.y, 1, 1)
  }

  hear(soundSource: Sprite) {
    const { x: x1, y: y1 } = this.getGlobalPosition()
    const { x: x2, y: y2 } = soundSource.getGlobalPosition()
    this.path.clear().lineStyle(2, 0xff0000, 1).moveTo(x1, y1).lineTo(x2, y2)
    console.log(`from ${x1} ${y1} to ${x2} ${y2}`)
    // const { x, y } = soundSource.toGlobal(soundSource.position)
    // console.log(x, y)

    // this.lineTo(800,600)
    // // Calcula a distância entre a fonte sonora e a orelha
    // const distance = Math.sqrt(
    //   Math.pow(soundSource.x - this.position.x, 2) +
    //   Math.pow(soundSource.y - this.position.y, 2)
    // );

    // // Calcula o volume com base na distância
    // const volume = 1 / distance;

    // // Retorna o volume e a direção do som
    // return {
    //   volume,
    //   direction: Math.atan2(
    //     soundSource.y - this.position.y,
    //     soundSource.x - this.position.x
    //   ),
    // };
  }
}


