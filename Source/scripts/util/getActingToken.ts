/**
 * This is a "Way too complex" function to get acting token or user-owned token
 * 
 * credits to: https://github.com/SebaSOFT/walls-have-ears
 *
 * @param {*} options
 * @returns {object|null} the token object or null
 */
function getActingToken(actor: any, limitActorTokensToControlledIfHaveSome = true, warn = true, linked = false): Token | null {
    if (!(game instanceof Game)) return
    const tokens = [];
    const character = game.user!.character;
    if (actor) {
        if (limitActorTokensToControlledIfHaveSome && canvas!.tokens!.controlled.length > 0) {
            tokens.push(
                ...canvas.tokens!.controlled.filter(t => {
                    if (!(t instanceof Token)) return false;
                    //@ts-ignore
                    if (linked) return t.data.actorLink && t.data.actorId === this.id;
                    //@ts-ignore
                    return t.data.actorId === this.id;
                })
            );
            tokens.push(
                ...actor
                    .getActiveTokens()
                    .filter(t => canvas.tokens.controlled.some(tc => tc.id === t.id))
            );
        } else {
            tokens.push(...actor.getActiveTokens());
        }
    } else {
        tokens.push(...canvas.tokens.controlled);
        if (tokens.length === 0 && character) {
            tokens.push(...character.getActiveTokens());
        }
    }
    if (tokens.length > 1) {
        if (warn) ui.notifications.error("Too many tokens selected or too many tokens of actor in current scene.");
        return null;
    } else {
        return tokens[0] ? tokens[0] : null;
    }
}