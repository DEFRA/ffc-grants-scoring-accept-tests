import request from 'supertest'

describe('Single Scoring', () => {
    it('should score a singleScore question', async () => {
        const res = await request(global.baseUrl)
            .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
            .send({
                data: {
                    main: {
                        manualLabourEquivalence: 'manualLabourAmount-A2'
                    }
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(res.status).toEqual(200)
        expect(res.body.answers.find((a) => a.questionId === 'manualLabourEquivalence').score.value).toBe(3.35)
        expect(res.body.answers.find((a) => a.questionId === 'manualLabourEquivalence').score.band).toBe('Average')
    })

    it('should return 400 when multiple answers are given to a singleScore question', async () => {
        const res = await request(global.baseUrl)
            .post('/scoring/api/v1/adding-value/score')
            .send({
                data: {
                    main: {
                        isProvidingServicesToOtherFarmers: 'true',
                        isBuildingFruitStorage: 'false',
                        processedProduceType: 'produceProcessed-A1',
                        valueAdditionMethod: 'howAddingValue-A1',
                        impactType: ['projectImpact-A1', 'projectImpact-A2'],
                        manualLabourEquivalence: ['manualLabourAmount-A1', 'manualLabourAmount-A2'],
                        futureCustomerTypes: ['futureCustomers-A1', 'futureCustomers-A2'],
                        collaboration: 'false',
                        environmentalImpactTypes: ['environmentalImpact-A1', 'environmentalImpact-A2']
                    }
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(res.status).toEqual(400)
    })

    it('should return 400 when no answer is given to a singleScore question', async () => {
        const res = await request(global.baseUrl)
            .post('/scoring/api/v1/adding-value/score?allowPartialScoring')
            .send({
                data: {
                    main: {
                        manualLabourEquivalence: null
                    }
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(res.status).toEqual(400)
    })
})
