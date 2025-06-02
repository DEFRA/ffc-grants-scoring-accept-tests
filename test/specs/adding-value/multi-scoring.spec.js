import request from 'supertest'

describe('Multi Scoring', () => {
    it('should score a multiScore question', async () => {
        const res = await request(global.baseUrl)
            .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
            .send({
                data: {
                    main: {
                        impactType: ['projectImpact-A1', 'projectImpact-A2', 'projectImpact-A4']
                    }
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(res.status).toEqual(200)
        expect(res.body.answers.find((a) => a.questionId === 'impactType').score.value).toBe(12)
        expect(res.body.answers.find((a) => a.questionId === 'impactType').score.band).toBe('Strong')
    })

    it('should return 400 when no answers are given to a multiScore question', async () => {
        const res = await request(global.baseUrl)
            .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
            .send({
                data: {
                    main: {
                        projectImpactCheckboxesField: null
                    }
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(res.status).toEqual(400)
    })

    it('should return 400 when duplicate answers given to a multiScore question', async () => {
        const res = await request(global.baseUrl)
            .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
            .send({
                data: {
                    main: {
                        projectImpactCheckboxesField: ['projectImpact-A1', 'projectImpact-A1']
                    }
                }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(res.status).toEqual(400)
    })
})
