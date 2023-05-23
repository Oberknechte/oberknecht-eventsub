let i = require("..");

/** @param {Symbol} sym @param {string} id */
function unsubscribe(sym, id) {
    return new Promise((resolve, reject) => {
        let wsSubscription = i.eventsubClientData[sym].subscriptions?.filter(a => a.id === id)?.[0];
        let wsNum = wsSubscription?.wsNum;

        i.OberknechtAPI[sym].deleteEventsubSubscription(id)
            .then(() => {
                if (wsNum) {
                    i.eventsubClientData[sym].subscriptions.splice(i.eventsubClientData[sym].subscriptions.indexOf(wsSubscription), 1);

                    if (i.websocketData[sym][wsNum].subscriptions) i.websocketData[sym][wsNum].subscriptions.splice(i.websocketData[sym][wsNum].subscriptions.indexOf(wsSubscription), 1);
                };

                return resolve();
            })
            .catch(e => {
                return reject(Error("Could not unsubscribe from event", { "cause": e }));
            });
    });
};

module.exports = unsubscribe;