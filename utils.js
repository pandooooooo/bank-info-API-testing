const randomString = (length) => {
    const candidates = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*(){}[];.,/\\\'\" ';
    return Array(length).fill(1).map(() => candidates.charAt(Math.floor(Math.random() * candidates.length))).join('');
};

const makeSwiftCode = (length, countryCode, startingPos = 4) => {
    const template = randomString(length);
    if (countryCode && startingPos < length - 1) {
        return `${template.substr(0, startingPos)}${countryCode}${template.substr(startingPos + 2)}`;
    }
    return template;
}

module.exports = {
    randomString,
    makeSwiftCode
}