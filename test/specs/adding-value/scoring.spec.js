import request from 'supertest'

describe('Scoring', () => {
  it('should score a valid full combination of questions and answers', async () => {
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
            manualLabourEquivalence: 'manualLabourAmount-A1',
            futureCustomerTypes: ['futureCustomers-A1', 'futureCustomers-A2'],
            collaboration: 'false',
            environmentalImpactTypes: ['environmentalImpact-A1', 'environmentalImpact-A2']
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.body.score.value).toEqual(69.95)
    expect(res.body.score.band).toEqual('Average')
    expect(res.body.answers.length).toBe(7)
    expect(res.body.answers.find((a) => a.questionId === 'processedProduceType').score.value).toBe(24)
    expect(res.body.answers.find((a) => a.questionId === 'processedProduceType').score.band).toBe('Strong')
    expect(res.body.answers.find((a) => a.questionId === 'valueAdditionMethod').score.value).toBe(0)
    expect(res.body.answers.find((a) => a.questionId === 'valueAdditionMethod').score.band).toBe('Strong')
    expect(res.body.answers.find((a) => a.questionId === 'impactType').score.value).toBe(10)
    expect(res.body.answers.find((a) => a.questionId === 'impactType').score.band).toBe('Average')
    expect(res.body.answers.find((a) => a.questionId === 'manualLabourEquivalence').score.value).toBe(1.65)
    expect(res.body.answers.find((a) => a.questionId === 'manualLabourEquivalence').score.band).toBe('Average')
    expect(res.body.answers.find((a) => a.questionId === 'futureCustomerTypes').score.value).toBe(2)
    expect(res.body.answers.find((a) => a.questionId === 'futureCustomerTypes').score.band).toBe('Weak')
    expect(res.body.answers.find((a) => a.questionId === 'collaboration').score.value).toBe(0)
    expect(res.body.answers.find((a) => a.questionId === 'collaboration').score.band).toBe('Weak')
    expect(res.body.answers.find((a) => a.questionId === 'environmentalImpactTypes').score.value).toBe(12.3)
    expect(res.body.answers.find((a) => a.questionId === 'environmentalImpactTypes').score.band).toBe('Strong')
  })

  it('should receive expected headers', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
      .send({
        data: {
          main: {
            isProvidingServicesToOtherFarmers: 'true'
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.headers['content-type']).toEqual('application/json; charset=utf-8')
    expect(res.headers['cache-control']).toEqual('no-cache')
  })

  it('should return 400 when input does not conform to expected JSON format', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
      .send({
        invalid: 'invalid'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })

  it('should return 400 when all scoring questions are not supplied', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score')
      .send({
        data: {
          main: {
            futureCustomerTypes: 'futureCustomers-A3'
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })

  it('should return 400 when answers do not match the scoring config', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
      .send({
        data: {
          main: {
            manualLabourEquivalence: 'invalid'
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })

  it('should return 400 when invalid grant type given in URL', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/invalid-grant/score?allowPartialScoring=true')
      .send({
        data: {
          main: {
            futureCustomerTypes: 'futureCustomers-A3'
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })

  it('should return 400 when invalid query string parameter is given', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score?invalid=true')
      .send({
        data: {
          main: {
            futureCustomerTypes: 'futureCustomers-A3'
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })

  it('should return 400 when lone question is sent and allowPartialScoring parameter is false', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score?allowPartialScoring=false')
      .send({
        data: {
          main: {
            futureCustomerTypes: 'futureCustomers-A3'
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })

  it('should not return an isScoreOnly question in the response', async () => {
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
            manualLabourEquivalence: 'manualLabourAmount-A1',
            futureCustomerTypes: ['futureCustomers-A1', 'futureCustomers-A2'],
            collaboration: 'false',
            environmentalImpactTypes: ['environmentalImpact-A1', 'environmentalImpact-A2']
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.body.answers.length).toBe(7)
    expect(res.body.answers.find((a) => a.questionId === 'isProvidingServicesToOtherFarmers')).toBe(undefined)
    expect(res.body.answers.find((a) => a.questionId === 'isBuildingFruitStorage')).toBe(undefined)
  })
})
