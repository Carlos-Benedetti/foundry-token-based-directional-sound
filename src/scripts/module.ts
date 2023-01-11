import Logger from "./util/logger"

// Version
const VERSION = "v1.5.3";

// Target for end users
const RELEASE = {
    threshold: Logger.High,
    name: "Release"
}

// Target for running in foundry as a developer
const DEVEL = {
    threshold: Logger.Low,
    name: "Devel"
}

const Target = RELEASE;

function init() {
    Logger.init("Background Volume", Target.threshold);

    if (Target == DEVEL) {
        // Enable hook debugging
        CONFIG.debug.hooks = true;
    }

    Logger.log(Logger.High, `Background Volume ${VERSION} is initialized (${Target.name} target)`);
}

let listenerToken: Token | null

async function ready() {

    Logger.log(Logger.Low, "Background Volume is ready");
    if (!(game instanceof Game)) return

    await game.audio.awaitFirstGesture();

    // Do anything once the module is ready
    const token = getActingToken({ warn: false });

    if (!token) return;

    listenerToken = token;
    Logger.log(Logger.Low, `Token obtained, id: ${listenerToken.id}`);

    doTheSterio();
}

function onSceneUpdate(data, id, options) {
    if (!(game instanceof Game)) return
    // If the viewed scene was updated, update the background volume
    Logger.log(Logger.Low, "A scene was updated");
    if (game.scenes.viewed.id == id._id) {
        Logger.log(Logger.High, "Received viewed scene update");
    }
}

Hooks.on("init", init);
Hooks.on("ready", ready);
Hooks.on("updateScene", onSceneUpdate);

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag('benettest');
});

/* ------------------------------------ */
// When token is about to be moved
/* ------------------------------------ */
Hooks.on("updateToken", (_token, _updateData, _options, _userId) => {
    Logger.log(Logger.Low, "updateToken called");

    if (listenerToken) {
        doTheSterio();
    }
});

/* ------------------------------------ */
// When ambient sound is about to be moved
/* ------------------------------------ */
Hooks.on("updateAmbientSound", (_ambientSound, _updateData, _options, _userId) => {
    Logger.log(Logger.Low, "updateAmbientSound called");

    if (listenerToken) {
        doTheSterio();
    }
});

/* ------------------------------------ */
// When the user starts controlling a token
/* ------------------------------------ */
Hooks.on("controlToken", async (token, selected) => {

    if (!(game instanceof Game)) return

    Logger.log(Logger.Low, "controlToken called");

    if (selected) {

        Logger.log(Logger.Low, "No token selected but getting from user");

        listenerToken = getActingToken({
            actor: game.user.character,
            warn: false
        });

    } else {

        Logger.log(Logger.Low, "Token Selected so it should be yours");
        listenerToken = token;

    }
    if (listenerToken) {

        Logger.log(Logger.Low, "Token obtained, id: ", listenerToken.id);
        Logger.log(Logger.Low, "Got a Token, Doing the Sterio");

        await game.audio.awaitFirstGesture();

        doTheSterio();

    } else {

        Logger.log(Logger.Low, "Looks like you are the GM");
    }
});


function doTheSterio() {

    if (!(game instanceof Game)) return
    if (game.audio.locked) return;
    if (!listenerToken) return;

    const tokenPosition = {
        x: listenerToken.center.x,
        y: listenerToken.center.y
    };

    const currentTokenId = listenerToken.id;

    const ambientSounds = game.canvas.sounds.placeables;
    Logger.log(Logger.Low, "The sounds: ", ambientSounds);


    for (const ambientSound of ambientSounds) {
        const { sound } = ambientSound
        if (!ambientSound.isAudible) {
            Logger.log(Logger.Medium, "Sound not Audible for (probably is just turned off)");
            continue;
        }
        if (!sound.soundCtx) {
            Logger.log(Logger.Medium, "No Audio Context, waiting for user interaction");
            continue;
        }


        const soundCtx = sound.container

        if (soundCtx.gainNode.numberOfOutputs == 1) {
            const audioCtx = new AudioContext();
            const source = audioCtx.createMediaElementSource(soundCtx.element);

            const gainNodeL = audioCtx.createGain();
            const gainNodeR = audioCtx.createGain();

            const merger = audioCtx.createChannelMerger(2);

            soundCtx.gainNode.connect(gainNodeL);
            soundCtx.gainNode.connect(gainNodeR);

            gainNodeL.connect(merger, 0, 0);
            gainNodeR.connect(merger, 0, 1);

            merger.connect(audioCtx.destination);

            soundCtx.gainNode.addEventListener('sterioUpdate', () => {

                const rightEar = {
                    x: ambientSound.center.x + (ambientSound.width / 2),
                    y: ambientSound.center.y
                };

                const leftEar = {
                    x: ambientSound.center.x - (ambientSound.width / 2),
                    y: ambientSound.center.y
                };

                listenerToken.width



                const lDistance = canvas.grid.measureDistance(tokenPosition, leftEar);
                const rDistance = canvas.grid.measureDistance(tokenPosition, rightEar);

                const { width } = ambientSound
                const deltaW = lDistance - rDistance

                const leftGain = (width - deltaW) / 2;
                const rightGain = (width + deltaW) / 2;

                gainNodeL.gain.value = leftGain
                gainNodeR.gain.value = rightGain

                Logger.log(Logger.Low, `[Sound Updated ${ambientSound.id}] L: ${leftGain} | R: ${rightGain} \\ Delta L: ${lDistance} | Delta R: ${rDistance} | W: ${width} | Delta W: ${deltaW}`);
                
            })
        }

        soundCtx.gainNode.dispatchEvent(new Event('sterioUpdate'))



    }


}