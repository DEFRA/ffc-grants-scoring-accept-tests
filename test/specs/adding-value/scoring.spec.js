import request from 'supertest'

describe('Scoring', () => {
  it('should score a full set of questions and answers', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score')
      .send({
        data: {
          main: {
            produceProcessedRadiosField: 'produceProcessed-A3',
            howAddingValueRadiosField: 'howAddingValue-A2',
            projectImpactCheckboxesField: ['projectImpact-A2', 'projectImpact-A3'],
            futureCustomersRadiosField: 'futureCustomers-A1',
            collaborationRadiosField: 'collaboration-A2',
            environmentalImpactCheckboxesField: ['environmentalImpact-A6', 'environmentalImpact-A7']
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.body.score).toEqual(48)
    expect(res.body.status).toEqual('Ineligible')
    expect(res.body.scoreBand).toEqual('Weak')
    expect(res.body.answers.find((a) => a.questionId === 'produceProcessedRadiosField').score.value).toBe(18)
    expect(res.body.answers.find((a) => a.questionId === 'produceProcessedRadiosField').score.band).toBe('Medium')
    expect(res.body.answers.find((a) => a.questionId === 'projectImpactCheckboxesField').score.value).toBe(11)
    expect(res.body.answers.find((a) => a.questionId === 'projectImpactCheckboxesField').score.band).toBe('Medium')
    expect(res.body.answers.find((a) => a.questionId === 'futureCustomersRadiosField').score.value).toBe(11)
    expect(res.body.answers.find((a) => a.questionId === 'futureCustomersRadiosField').score.band).toBe('Strong')
    expect(res.body.answers.find((a) => a.questionId === 'collaborationRadiosField').score.value).toBe(2)
    expect(res.body.answers.find((a) => a.questionId === 'collaborationRadiosField').score.band).toBe('Medium')
    expect(res.body.answers.find((a) => a.questionId === 'environmentalImpactCheckboxesField').score.value).toBe(6)
    expect(res.body.answers.find((a) => a.questionId === 'environmentalImpactCheckboxesField').score.band).toBe('Weak')
  })

  it('should receive expected headers', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score')
      .send({
        data: {
          main: {
            produceProcessedRadiosField: 'produceProcessed-A3',
            howAddingValueRadiosField: 'howAddingValue-A2',
            projectImpactCheckboxesField: ['projectImpact-A2', 'projectImpact-A3'],
            futureCustomersRadiosField: 'futureCustomers-A1',
            collaborationRadiosField: 'collaboration-A2',
            environmentalImpactCheckboxesField: ['environmentalImpact-A6', 'environmentalImpact-A7']
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
      .post('/scoring/api/v1/adding-value/score')
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
            futureCustomersRadiosField: 'futureCustomers-A3'
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })

  it('should return 400 when answers do not match the scoring config', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score')
      .send({
        data: {
          main: {
            produceProcessedRadiosField: 'produceProcessed-A50',
            howAddingValueRadiosField: 'howAddingValue-A2',
            projectImpactCheckboxesField: ['projectImpact-A2', 'projectImpact-A3'],
            futureCustomersRadiosField: 'futureCustomers-A1',
            collaborationRadiosField: 'collaboration-A2',
            environmentalImpactCheckboxesField: ['environmentalImpact-A6', 'environmentalImpact-A7']
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })

  it('should return 400 when invalid grant type given in URL', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/invalid-grant/score')
      .send({
        data: {
          main: {
            produceProcessedRadiosField: 'produceProcessed-A3',
            howAddingValueRadiosField: 'howAddingValue-A2',
            projectImpactCheckboxesField: ['projectImpact-A1', 'projectImpact-A2'],
            futureCustomersRadiosField: 'futureCustomers-A1',
            collaborationRadiosField: 'collaboration-A2',
            environmentalImpactCheckboxesField: ['environmentalImpact-A6', 'environmentalImpact-A7']
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })

  it('should return 400 when invalid grant type given in URL alongside duplicate answers', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/invalid-grant/score')
      .send({
        data: {
          main: {
            produceProcessedRadiosField: 'produceProcessed-A3',
            howAddingValueRadiosField: 'howAddingValue-A2',
            projectImpactCheckboxesField: ['projectImpact-A1', 'projectImpact-A1'],
            futureCustomersRadiosField: 'futureCustomers-A1',
            collaborationRadiosField: 'collaboration-A2',
            environmentalImpactCheckboxesField: ['environmentalImpact-A6', 'environmentalImpact-A7']
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
            produceProcessedRadiosField: 'produceProcessed-A3',
            howAddingValueRadiosField: 'howAddingValue-A2',
            projectImpactCheckboxesField: ['projectImpact-A2', 'projectImpact-A3'],
            futureCustomersRadiosField: 'futureCustomers-A1',
            collaborationRadiosField: 'collaboration-A2',
            environmentalImpactCheckboxesField: ['environmentalImpact-A6', 'environmentalImpact-A7']
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })

  it('should return 400 when lone question is sent and allowPartialScoring parameter is not set', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score')
      .send({
        data: {
          main: {
            futureCustomersRadiosField: 'futureCustomers-A3'
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
            futureCustomersRadiosField: 'futureCustomers-A3'
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })
})
