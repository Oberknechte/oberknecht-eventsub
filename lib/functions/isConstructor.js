/** @param {Object} f */
function isConstructor(f) {
    try {
        new f()
    } catch (e) {
        if (e.message && e.message === "response is undefined") return true;
        return false;
    };

    return true;
};

module.exports = isConstructor;