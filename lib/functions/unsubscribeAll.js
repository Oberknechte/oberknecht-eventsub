let i = require("..");
const getSubscriptions = require("./getSubscriptions");
const unsubscribe = require("./unsubscribe");

/** @param {Symbol} sym */
function unsubscribeAll(sym) {
    return new Promise((resolve, reject) => {
        getSubscriptions(sym)
            .then(async subscriptions => {
                await Promise.all(subscriptions.data.filter(a => a.status === "enabled").map(subscription => {
                    return new Promise((resolve2) => {
                        unsubscribe(sym, subscription.id)
                            .then(resolve2)
                            .catch(resolve2);
                    })
                }))
                    .then(() => {
                        resolve();
                    });
            })
            .catch(e => {
                return reject(Error("Could not get subscriptions from API", { "cause": e }));
            });
    });
};

module.exports = unsubscribeAll;