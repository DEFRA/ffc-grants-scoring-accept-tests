import request from 'supertest'

describe('Matrix Scoring', () => {
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
    expect(res.body.score).toEqual(18)
    expect(res.body.answers.find((a) => a.questionId === 'produceProcessedRadiosField').score.value).toBe(18)
    expect(res.body.answers.find((a) => a.questionId === 'produceProcessedRadiosField').score.band).toBe('Medium')
  })

    it('should return 400 when matrixScore question is sent without dependency', async () => {
    const payload = {
      data: {
        main: {
          produceProcessedRadiosField: 'produceProcessed-A3'
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })
})
