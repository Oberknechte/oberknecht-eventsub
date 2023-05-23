let i = require("..");
const getSubscriptions = require("./getSubscriptions");
const unsubscribe = require("./unsubscribe");

/** @param {Symbol} sym */
function unsubscribeAll(sym) {
    return new Promise((resolve, reject) => {
        getSubscriptions(sym)
            .then(async subscriptions => {
                await Promise.all(subscriptions.data.map(subscription => {
                    return unsubscribe(sym, subscription.id)
                }))
                    .then(() => {
                        resolve();
                    })
                    .catch(e => {
                        reject(e);
                    });
            })
            .catch(e => {
                return reject(Error("Could not get subscriptions from API", { "cause": e }));
            });
    });
};

module.exports = unsubscribeAll;