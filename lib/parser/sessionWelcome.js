class sessionWelcomeMessage {
    metadata = {
        messageID: String(),
        messageType: "session_welcome",
        messageTimestamp: String()
    };

    payload = {
        session: {
            id: String(),
            status: String(),
            connectedAt: String(),
            keepaliveTimeoutSeconds: Number(),
            reconnectUrl: String() || null
        }
    };

    constructor(sym, wsNum, response) {
        if (!response) throw Error("response is undefined");

        this.metadata = {
            messageID: response.metadata.message_id,
            messageType: response.metadata.message_type,
            messageTimestamp: response.metadata.message_timestamp
        };

        this.payload = {
            session: {
                id: response.payload.session.id,
                status: response.payload.session.status,
                connectedAt: response.payload.session.connected_at,
                keepaliveTimeoutSeconds: response.payload.session.keepalive_timeout_seconds,
                reconnectUrl: response.payload.session.reconnect_url
            }
        };
    };
};

module.exports = sessionWelcomeMessage;