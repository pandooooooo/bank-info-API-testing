const axios = require('axios');

class BankClient {
    constructor() {
        const pos = process.argv.findIndex((arg) => arg === '--endpoint') || 0;
        this.endpoint = process.argv[pos + 1];
        if (!this.endpoint) {
            throw new Error('Endpoint must not be empty. Use \'npm test -- --endpoint <Your endpoint>\' to execute the tests.');
        }
    }

    async execute(payment_method, bank_country_code, account_name, account_number, swift_code, bsb = '123456', aba = '123456789') {
        const payload = {payment_method, bank_country_code, account_name, account_number, swift_code, bsb, aba};
        try {
            const response = await axios.post(this.endpoint, payload);
            return {
                status: response.status,
                data: response.data,
                payload,
                message: `${response.statusText}: ${JSON.stringify(payload)}`
            };
        } catch (err) {
            return {
                status: err.response.status,
                data: err.response.data,
                payload,
                message: `${err.response.data.error}: ${JSON.stringify(payload)}`
            };
        }
    }
}

module.exports = BankClient;