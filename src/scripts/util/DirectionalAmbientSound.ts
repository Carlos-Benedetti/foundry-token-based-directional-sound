import { DirectionalAmbientSoundStates } from "../errors/DirectionalAmbientSoundStates";
import { AmbientSoundListenedUnconnectedError } from "./AmbientSoundListenedUnconnectedError";
import Logger from "./Logger";

export class DirectionalAmbientSound {

    public state = DirectionalAmbientSoundStates.DISCONNECTED
    public lastUpdate: Date = new Date()

    private container: AudioContainer
    private gainNode: GainNode
    private gainNodeL: GainNode;
    private gainNodeR: GainNode;
    private merger: ChannelMergerNode;

    private source: AudioBufferSourceNode | MediaElementAudioSourceNode;



    constructor(public ambientSound: AmbientSound) {

        const { sound } = this.ambientSound;
        this.container = sound.container;
        this.gainNode = this.container.gainNode

        const audioCtx = this.container.context
        this.source = this.container.sourceNode

        this.gainNodeL = audioCtx.createGain();
        this.gainNodeR = audioCtx.createGain();

        this.merger = audioCtx.createChannelMerger(2);

        this.gainNodeL.connect(this.merger, 0, 0);
        this.gainNodeR.connect(this.merger, 0, 1);

    }

    get connected(): boolean {
        return this.state === DirectionalAmbientSoundStates.CONNECTED
    }

    connect() {

        this.source.connect(this.gainNodeL);
        this.source.connect(this.gainNodeR);


        this.merger.connect(this.container.context.destination);

        this.state = DirectionalAmbientSoundStates.CONNECTED
    }

    disconnect() {

        this.gainNode.disconnect(this.gainNodeL);
        this.gainNode.disconnect(this.gainNodeR);


        this.merger.disconnect(this.container.context.destination);

        this.state = DirectionalAmbientSoundStates.DISCONNECTED
    }

    listenerUpdateHandler(listener: Token) {

        // checks if this ambient sound should recive updates
        if (!this.connected) {
            throw new AmbientSoundListenedUnconnectedError();
        }


        //             Simulating Ears
        //                   X
        //     --------------------------------
        //   |
        //   |
        //   |   (radius) - center + (radius)
        // Y | I--------------I--------------I
        //   | (leftEar)   [token]   (rightEar)
        //   |
        //   |
        // 


        const head = listener.clone()

        const leftEar = new PIXI.Graphics()
        const rightEar = new PIXI.Graphics()

        head.addChild(leftEar)
        leftEar.position.set(0, head.center.y)

        head.addChild(rightEar)
        rightEar.position.set(head.width, head.center.y)



        // then getting the distance bettwen then and the target      
        //
        //                   X
        //     --------------------------------
        //   |
        //   |         [AmbientSound]
        //   |           /         \
        //   |          /           \ 
        //   |         /             \
        //   |  (leftDistance)  (rightDistance)
        //   |       /                 \
        //   |      /                   \
        //   |     /                     \  
        //   |    /                       \
        // Y | I--------------I--------------I
        //   | (leftEar)   [token]   (rightEar)
        //   |
        //   |

        const leftDistance = canvas.grid.measureDistance(listener.center, leftEar);
        const rightDistance = canvas.grid.measureDistance(listener.center, rightEar);

        const { width: headWidth } = listener

        // 
        // I---------------I       (leftDistance)
        // I---------------------I (rightDistance)
        //             I---------I (headWidth)
        //                 I-----I (deltaW) = diference in distances 
        // 

        const deltaW = leftDistance - rightDistance

        //gets the gain bettewn 1 and 0
        const leftGain = ((headWidth - deltaW) / 2) - (headWidth - 1);
        const rightGain = ((headWidth + deltaW) / 2) - (headWidth - 1);


        const audioCtx = this.container.context
        this.gainNodeL.gain.setValueAtTime(leftGain, audioCtx.currentTime)
        this.gainNodeR.gain.setValueAtTime(rightGain, audioCtx.currentTime)

        Logger.log(Logger.Low, `[Sound Updated ${this.ambientSound.id}] L: ${leftGain} | R: ${rightGain} \\ Delta L: ${leftDistance} | Delta R: ${rightDistance} | Delta W: ${deltaW}`);
    }

}
