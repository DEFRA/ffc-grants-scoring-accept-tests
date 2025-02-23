import request from 'supertest'

describe('Scoring', () => {
  it('should score a singleScore question', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'B',
          multiAnswer: ['A']
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.body.answers.find((a) => a.questionId === 'singleAnswer').score.value).toBe(8)
    expect(res.body.answers.find((a) => a.questionId === 'singleAnswer').score.band).toBe('Strong')
  })

  it('should score a multiScore question', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'A',
          multiAnswer: ['B', 'C', 'E']
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.body.answers.find((a) => a.questionId === 'multiAnswer').score.value).toBe(6)
    expect(res.body.answers.find((a) => a.questionId === 'multiAnswer').score.band).toBe('Medium')
  })

  it('should score a set of questions and answers', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'B',
          multiAnswer: ['A', 'B']
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.body.score).toBe(16)
    expect(res.body.status).toBe('Eligible')
    expect(res.body.scoreBand).toBe('Strong')
  })

  it('should receive expected headers and response', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'B',
          multiAnswer: ['A', 'B']
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.headers['content-type']).toEqual('application/json; charset=utf-8')
    expect(res.headers['cache-control']).toEqual('no-cache')
    expect(res.body).toEqual({
      answers: [
        {
          questionId: 'singleAnswer',
          category: 'Single answer',
          fundingPriorities: ['This question is a single answer question', `It's funding priorities are undefined`],
          score: {
            value: 8,
            band: 'Strong'
          }
        },
        {
          questionId: 'multiAnswer',
          category: 'Multi answer',
          fundingPriorities: ['This question is a multi answer question', `It's funding priorities are well defined`],
          score: {
            value: 8,
            band: 'Medium'
          }
        }
      ],
      score: 16,
      status: 'Eligible',
      scoreBand: 'Strong'
    })
  })

  it('should score a single question if allowPartialScoring parameter is true', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'B'
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score?allowPartialScoring=true')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

      expect(res.status).toEqual(200)

      expect(res.body.answers.find((a) => a.questionId === 'singleAnswer').score.value).toBe(8)
      expect(res.body.answers.find((a) => a.questionId === 'singleAnswer').score.band).toBe('Strong')
      expect(res.body.score).toBe(8)
      expect(res.body.status).toBe('Ineligible')
      expect(res.body.scoreBand).toBe('Weak')
      })
})
