let i = require("../..");

class streamOnlineMessage {
    #sym;
    #wsNum;

    broadcasterID = String();
    broadcasterLogin = String();
    broadcasterUserName = String();
    streamStart = String();
    streamType = String();

    metadata = {
        messageID: String(),
        messageType: 'notification',
        messageTimestamp: String(),
        subscriptionType: 'stream.online',
        subscriptionVersion: '1'
    };

    payload = {
        subscription: {
            id: String(),
            status: String(),
            type: 'stream.online',
            version: '1',
            condition: {
                broadcasterUserID: String()
            },
            transport: {
                sessionID: String()
            },
            createdAt: String(),
            cost: Number()
        },
        event: {
            id: String(),
            broadcasterUserID: String(),
            broadcasterUserLogin: String(),
            broadcasterUserName: String(),
            type: String(),
            startedAt: String()
        }
    };

    async getStreamInformation() {
        return i.OberknechtAPI[this.#sym].getStreams({
            user_id: this.broadcasterID
        });
    };

    constructor(sym, wsNum, response) {
        this.#sym = sym;
        this.#wsNum = wsNum;

        if (!response) throw Error("response is undefined");

        this.broadcasterID = response.payload.event.broadcaster_user_id;
        this.broadcasterLogin = response.payload.event.broadcaster_user_login;
        this.broadcasterUserName = response.payload.event.broadcaster_user_name;
        this.streamStart = response.payload.event.started_at;
        this.streamType = response.payload.event.type;

        this.metadata = {
            messageId: response.metadata.message_id,
            messageType: response.metadata.message_type,
            messageTimestamp: response.metadata.message_timestamp,
            subscriptionType: response.metadata.subscription_type,
            subscriptionVersion: response.metadata.subscription_version
        };

        this.payload = {
            subscription: {
                id: response.payload.subscription.id,
                status: response.payload.subscription.status,
                type: response.payload.subscription.type,
                version: response.payload.subscription.version,
                condition: response.payload.subscription.condition,
                transport: response.payload.subscription.transport,
                createdAt: response.payload.subscription.created_at,
                cost: response.payload.subscription.cost
            },
            event: {
                id: response.payload.event.id,
                broadcasterUserID: response.payload.event.broadcaster_user_id,
                broadcasterUserLogin: response.payload.event.broadcaster_user_login,
                broadcasterUserName: response.payload.event.broadcaster_user_name,
                type: response.payload.event.type,
                startedAt: response.payload.event.started_at
            }
        };
    };
};

module.exports = streamOnlineMessage;