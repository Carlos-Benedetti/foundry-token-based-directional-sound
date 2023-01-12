import { APP_NAME, DEVEL, RELEASE, VERSION } from "./constants";
import { DirectionalAmbientSound } from "./util/DirectionalAmbientSound";
import Logger from "./util/Logger"

const Target = RELEASE;

const activeAmbientSounds: { [id: string]: DirectionalAmbientSound } = {}

export let listenerToken: Token | null

async function ready() {

    Logger.log(Logger.Low, "ready");

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

function init() {
    Logger.init(APP_NAME, Target.threshold);

    if (Target == DEVEL) {
        CONFIG.debug.hooks = true;
    }

    Logger.log(Logger.High, `Version ${VERSION} is initialized (${Target.name} target)`);
}

function devModeReadyHandler({ registerPackageDebugFlag }) {
    registerPackageDebugFlag('benettest');
}

/* ------------------------------------ */
// When token is about to be moved
/* ------------------------------------ */
function updateTokenHandler(_token, _updateData, _options, _userId) {
    Logger.log(Logger.Low, "updateToken called");

    if (listenerToken) {
        doTheSterio();
    }
}

/* ------------------------------------ */
// When ambient sound is about to be moved
/* ------------------------------------ */
function updateAmbientSoundHandler(_ambientSound, _updateData, _options, _userId) {
    Logger.log(Logger.Low, "updateAmbientSound called");

    if (listenerToken) {
        doTheSterio();
    }
}

/* ------------------------------------ */
// When the user starts controlling a token
/* ------------------------------------ */
async function controlTokenHandler(token, selected) {

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
}


function renderPlayerListHandler(_, html) {
    if (Target != DEVEL) return
    if (!(game instanceof Game)) return

    const loggedInUserListItem = html.find(`[data-user-id="${game.userId}"]`)
    loggedInUserListItem.append(
        "<div><p>TDS Count: </p><b class='tds-listeners'></b></div>"
    );
}

function doTheSterio() {

    if (!(game instanceof Game)) return
    if (game.audio.locked) return;
    if (!listenerToken) return;

    //prepare ambientSound
    const ambientSounds = game.canvas.sounds.placeables;
    const updateTime = new Date()


    for (const ambientSound of ambientSounds) {
        if (!ambientSound.isAudible) {
            Logger.log(Logger.Medium, "Sound not Audible for (probably is just turned off)");
            continue;
        }
        if (!ambientSound.sound.soundCtx) {
            Logger.log(Logger.Medium, "No Audio Context, waiting for user interaction");
            continue;
        }

        if (!activeAmbientSounds[ambientSound.id]) {
            activeAmbientSounds[ambientSound.id] = new DirectionalAmbientSound(ambientSound)
            activeAmbientSounds[ambientSound.id].connect()
        }

        activeAmbientSounds[ambientSound.id].lastUpdate = updateTime

    }

    for (const [key, ambientSound] of Object.entries(activeAmbientSounds)) {

        if (ambientSound.lastUpdate != updateTime) {
            ambientSound.disconnect()
            delete activeAmbientSounds[key]
            continue
        }

        ambientSound.listenerUpdateHandler(listenerToken)

    }

    if (Target != DEVEL) return
    //[debug]show amount of active soundLayers
    const tdsListenersEle = document.querySelector('.tds-listeners')
    if (!tdsListenersEle) {
        Logger.log(Logger.Medium, ".tds-listeners not found");
        return
    }
    tdsListenersEle.innerHTML = `${Object.entries(activeAmbientSounds).length}`

}

Hooks.on("init", init);
Hooks.on("ready", ready);
Hooks.on("updateScene", onSceneUpdate);
Hooks.on("updateToken", updateTokenHandler);
Hooks.on("updateAmbientSound", updateAmbientSoundHandler);
Hooks.on("controlToken", controlTokenHandler);
Hooks.on('renderPlayerList', renderPlayerListHandler);

Hooks.once('devModeReady', devModeReadyHandler);