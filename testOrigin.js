const utils = require('./utils');
const BankClient = require('./client');
const expect = require('chai').expect;
const chai = require('chai');

const client = new BankClient();

const PAYMENT_METHODS = {
    SWIFT: 'SWIFT',
    LOCAL: 'LOCAL'
};

const COUNTRY_CODES = {
    US: 'US',
    AU: 'AU',
    CN: 'CN'
};

const ACCOUNT_NUMBER_VALIDATORS = {
    [COUNTRY_CODES.US]: (number) => number && number.length >= 1 && number.length <= 17,
    [COUNTRY_CODES.AU]: (number) => number && number.length >= 6 && number.length <= 9,
    [COUNTRY_CODES.CN]: (number) => number && number.length >= 8 && number.length <= 20
};

function validateParamLength(parameters, executor, validator) {
    parameters.forEach(param => {
        it(param !== null ? `${param.length} characters: ${param}` : 'null', async () => {
            const response = await executor(param);
            if (validator(param)) {
                expect(response.status).equal(200, response.message);
            } else {
                expect(response.status).equal(400, response.message);
            }
        });
    });
}

it('should get 400 if the payment_method is invalid', async () => {
    const response = await client.execute('DUMMY', COUNTRY_CODES.CN, 'lkx', "testing", `ICBCCNBJ`);
    expect(response.status).equal(400, response.message);
});

it('should get 400 if the country_code is invalid', async () => {
    const response = await client.execute(PAYMENT_METHODS.LOCAL, 'DUMMY', 'lkx', "testing", `ICBCCNBJ`);
    expect(response.status).equal(400, response.message);
});

Object.values(PAYMENT_METHODS).forEach(paymentMethod => {
    Object.values(COUNTRY_CODES).forEach(countryCode => {
        describe(`POST /bank with payment_method=${paymentMethod}, country_code=${countryCode}`, () => {
            describe(`save account_name in different length.`, () => {
                const accountNames = [null, ...[0, 1, 2, 5, 8, 10, 12, 15].map(len => utils.randomString(len))];
                validateParamLength(
                    accountNames,
                    (name) => client.execute(paymentMethod, countryCode, name, "testing", `ICBC${countryCode}BJ`),
                    (name) => name && name.length >= 2 && name.length <= 10
                );
            });

            describe(`should save account_number in different length`, () => {
                validateParamLength(
                    [null, ...[0, 1, 4, 6, 7, 8, 9, 15, 17, 18, 20, 25].map(len => utils.randomString(len))],
                    (number) => client.execute(paymentMethod, countryCode, "lkx", number, `ICBC${countryCode}BJ`),
                    (number) => number && ACCOUNT_NUMBER_VALIDATORS[countryCode](number)
                );
            });

            describe(`validate swift_code.`, () => {
                describe(`in different length.`, () => {
                    validateParamLength(
                        [null, ...[0, 5, 8, 10, 11, 15].map(len => utils.makeSwiftCode(len, countryCode))],
                        (swiftCode) => client.execute(paymentMethod, countryCode, "lkx", "testing", swiftCode),
                        (swiftCode) => paymentMethod !== PAYMENT_METHODS.SWIFT || (swiftCode && (swiftCode.length === 8 || swiftCode.length === 11))
                    );
                });

                describe(`country_code starting at different positions.`, () => {
                    const startingPositions = [0, 4, 9, 20];
                    startingPositions.forEach(starting => {
                        const swiftCode = utils.makeSwiftCode(11, countryCode, starting);
                        it(`starting from position ${starting + 1}: ${swiftCode}`, async () => {
                            const response = await client.execute(paymentMethod, countryCode, 'lkx', 'testing', swiftCode);
                            expect(response.status).equal(paymentMethod !== PAYMENT_METHODS.SWIFT || starting === 4 ? 200 : 400, response.message);
                        });
                    });
                });
            });

            describe('validate bsb in different length.', () => {
                validateParamLength(
                    [null, ...[0, 3, 6, 9, 12].map(len => utils.randomString(len))],
                    (bsb) => client.execute(paymentMethod, countryCode, "lkx", "testing", `ICBC${countryCode}BJ`, bsb),
                    (bsb) => countryCode !== COUNTRY_CODES.AU || (bsb && (bsb.length === 6))
                );
            });

            describe('validate aba in different length.', () => {
                validateParamLength(
                    [null, ...[0, 3, 6, 9, 12].map(len => utils.randomString(len))],
                    (aba) => client.execute(paymentMethod, countryCode, "lkx", "testing", `ICBC${countryCode}BJ`, '123456', aba),
                    (aba) => countryCode !== COUNTRY_CODES.US || (aba && (aba.length === 9))
                );
            });
        });
    });
});