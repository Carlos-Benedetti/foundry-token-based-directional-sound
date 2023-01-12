export class AmbientSoundListenedUnconnectedError extends Error {
    constructor() {
        super('AmbientSound placeable got directionality update while sterio was disabled');
    }
}
