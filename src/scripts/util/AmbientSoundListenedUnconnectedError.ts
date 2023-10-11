
export class AmbientSoundListenedUnconnectedError extends Error {
    code: 1;
    constructor() {
        super('AmbientSound placeable got directionality update while sterio was disabled');
    }
}
