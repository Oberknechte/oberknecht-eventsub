let i = require("..");

/** @param {Symbol} sym @param {Boolean?} cachedOnly @param {Number?} wsNum */
function getSubscriptions(sym, cachedOnly, wsNum) {
    return new Promise((resolve, reject) => {
        if (cachedOnly) {
            if (wsNum) return resolve((i.websocketData[sym][wsNum]?.subscriptions ?? []));
            return resolve((i.eventsubClientData[sym].subscriptions ?? []));
        };

        i.OberknechtAPI[sym].getEventsubSubscriptions()
            .then(resolve)
            .catch(e => {
                return reject(Error("Could not get eventsub subscriptions from API", { "cause": e }));
            });
    });
};

module.exports = getSubscriptions;