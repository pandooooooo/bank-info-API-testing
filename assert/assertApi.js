const expect = require('chai').expect;

function validateParam(parameters, executor, validator){
    parameters.forEach(param => {
        it(param != null ? `${param.length} characters : ${param}` : 'null', async () =>{
            const response = await executor(param);
            if(validator(param))
                expect(response.status).equal(200, response.message);
            else
                expect(response.status).equal(400, response.message);
        });
    })
}

module.exports = validateParam;