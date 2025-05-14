import request from 'supertest'

describe('Scoring', () => {
  it('should score a singleScore question', async () => {
    const payload = {
      data: {
        main: {
          futureCustomersRadiosField: 'futureCustomers-A3'
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.body.answers.find((a) => a.questionId === 'futureCustomersRadiosField').score.value).toBe(7)
    expect(res.body.answers.find((a) => a.questionId === 'futureCustomersRadiosField').score.band).toBe('Medium')
  })

  it('should score a multiScore question', async () => {
    const payload = {
      data: {
        main: {
          projectImpactCheckboxesField: ['projectImpact-A1', 'projectImpact-A2', 'projectImpact-A4']
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.body.answers.find((a) => a.questionId === 'projectImpactCheckboxesField').score.value).toBe(17)
    expect(res.body.answers.find((a) => a.questionId === 'projectImpactCheckboxesField').score.band).toBe('Strong')
  })

  it('should score a matrixScore question', async () => {
    const payload = {
      data: {
        main: {
          produceProcessedRadiosField: 'produceProcessed-A3',
          howAddingValueRadiosField: 'howAddingValue-A2'
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.body.answers.find((a) => a.questionId === 'produceProcessedRadiosField').score.value).toBe(18)
    expect(res.body.answers.find((a) => a.questionId === 'produceProcessedRadiosField').score.band).toBe('Medium')
  });

  it('should score a full set of questions and answers', async () => {
    const payload = {
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
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    //expect(res.score).toEqual(66) // or maybe 48?
    //expect(res.status).toEqual('Ineligible') // 48 is ineligible, but 60 is eligible
    //expect(res.scoreBand).toEqual('Medium') // is this correct?
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
    const payload = {
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
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.headers['content-type']).toEqual('application/json; charset=utf-8')
    expect(res.headers['cache-control']).toEqual('no-cache')
    // validate response against schema?
  })

  it('should not score a single question if allowPartialScoring parameter is not set', async () => {
    const payload = {
      data: {
        main: {
          futureCustomersRadiosField: 'futureCustomers-A3'
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })
})
