const PAYMENT_METHODS = {
    SWIFT : 'SWIFT',
    LOCAL : 'LOCAL'
};

const COUNTRY_CODE = {
    US : "US",
    AU : "AU",
    CN : "CN"
};

const ACCOUNT_NUMBER_VALIDATORS = {
    [COUNTRY_CODE.US] : (number) => number && number.length >= 1 && number.length <= 17,
    [COUNTRY_CODES.AU]: (number) => number && number.length >= 6 && number.length <= 9,
    [COUNTRY_CODES.CN]: (number) => number && number.length >= 8 && number.length <= 20
};