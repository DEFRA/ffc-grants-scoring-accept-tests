import request from 'supertest'

describe('Single Scoring', () => {
    it('should score a singleScore question', async () => {
        const res = await request(global.baseUrl)
            .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
            .send({
                data: {
                    main: {
                        futureCustomersRadiosField: 'futureCustomers-A3'
                    }
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(res.status).toEqual(200)
        expect(res.body.answers.find((a) => a.questionId === 'futureCustomersRadiosField').score.value).toBe(7)
        expect(res.body.answers.find((a) => a.questionId === 'futureCustomersRadiosField').score.band).toBe('Medium')
    })

    it('should return 400 when multiple answers are given to a singleScore question', async () => {
        const res = await request(global.baseUrl)
            .post('/scoring/api/v1/adding-value/score')
            .send({
                data: {
                    main: {
                        produceProcessedRadiosField: 'produceProcessed-A3',
                        howAddingValueRadiosField: 'howAddingValue-A2',
                        projectImpactCheckboxesField: ['projectImpact-A2', 'projectImpact-A3'],
                        futureCustomersRadiosField: ['futureCustomers-A1', 'futureCustomers-A2'],
                        collaborationRadiosField: 'collaboration-A2',
                        environmentalImpactCheckboxesField: ['environmentalImpact-A6', 'environmentalImpact-A7']
                    }
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(res.status).toEqual(400)
    })

    it('should return 400 when no answer is given to a singleScore question', async () => {
        const res = await request(global.baseUrl)
            .post('/scoring/api/v1/adding-value/score')
            .send({
                data: {
                    main: {
                        produceProcessedRadiosField: 'produceProcessed-A3',
                        howAddingValueRadiosField: 'howAddingValue-A2',
                        projectImpactCheckboxesField: ['projectImpact-A2', 'projectImpact-A3'],
                        futureCustomersRadiosField: null,
                        collaborationRadiosField: 'collaboration-A2',
                        environmentalImpactCheckboxesField: ['environmentalImpact-A6', 'environmentalImpact-A7']
                    }
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(res.status).toEqual(400)
    })
})
