import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import request from 'supertest'

describe('Schema Validation', () => {
    it('response should validate against own schema', async () => {
        const scoringResponse = await request(global.baseUrl)
            .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
            .send({
                data: {
                    main: {
                        isProvidingServicesToOtherFarmers: 'false',
                        isBuildingFruitStorage: 'true',
                        valueAdditionMethod: "howAddingValue-A1",
                        impactType: ["projectImpact-A1", "projectImpact-A2"],
                        manualLabourEquivalence: "manualLabourAmount-A1",
                        futureCustomerTypes: ["futureCustomers-A1", "futureCustomers-A2"],
                        collaboration: "false",
                        environmentalImpactTypes: ["environmentalImpact-A1", "environmentalImpact-A2"]
                    }
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')            
        expect(scoringResponse.status).toEqual(200)

        const validate = await getSchemaValidationFunction()
        const isValid = validate(scoringResponse.body)
        if (!isValid) {
            console.log(`VALIDATION ERRORS: ${JSON.stringify(validate.errors)}`)
        }
        expect(isValid).toBe(true)
    })

    async function getSchemaValidationFunction() {
        const ajv = new Ajv({
            allErrors: true,
            strict: false
        })
        addFormats(ajv)

        const openApiResponse = await request(global.baseUrl)
            .get('/scoring/api/v1/swagger.json')
        expect(openApiResponse.status).toEqual(200)

        const openApiSpec = openApiResponse.body
        for (const schemaName in openApiSpec.components.schemas) {
            const schemaObject = openApiSpec.components.schemas[schemaName]
            const schemaId = `#/components/schemas/${schemaName}`
            if (!ajv.getSchema(schemaId)) {
                ajv.addSchema(schemaObject, schemaId)
            }
        }

        const schemaToValidate = openApiSpec.components.schemas['scoring-response']
        const validationFunction = ajv.compile(schemaToValidate)

        return validationFunction
    }
})
