import Logger from "./util/Logger"

export const APP_NAME = 'token-directional-sound'
export const VERSION = '0.0.1'
/** Target for end users */
export const RELEASE = {
    threshold: Logger.High,
    name: "Release"
}
/** Target for running in foundry as a developer */
export const DEVEL = {
    threshold: Logger.Low,
    name: "Devel"
}