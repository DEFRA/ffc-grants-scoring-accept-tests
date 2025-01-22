import request from 'supertest'

describe('POST /score', () => {
  it('should score a singleScore question', async () => {
    const payload = {
      answers: [{ questionId: 'singleAnswer', answers: ['B'] }]
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(200)

    expect(
      res.body.answers.find((a) => a.questionId === 'singleAnswer').score.value
    ).toBe(8)
    expect(
      res.body.answers.find((a) => a.questionId === 'singleAnswer').score.band
    ).toBe('Strong')
  })

  it('should score a multiScore question', async () => {
    const payload = {
      answers: [{ questionId: 'multiAnswer', answers: ['B', 'C', 'E'] }]
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(200)

    expect(
      res.body.answers.find((a) => a.questionId === 'multiAnswer').score.value
    ).toBe(6)
    expect(
      res.body.answers.find((a) => a.questionId === 'multiAnswer').score.band
    ).toBe('Medium')
  })

  it('should score a set of questions and answers', async () => {
    const payload = {
      answers: [
        { questionId: 'singleAnswer', answers: ['B'] },
        { questionId: 'multiAnswer', answers: ['A', 'B'] }
      ]
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(200)

    expect(res.body.score).toBe(16)
    expect(res.body.status).toBe('eligible')
    expect(res.body.scoreBand).toBe('Strong')
  })

  it('should receive expected headers and response', async () => {
    const payload = {
      answers: [
        { questionId: 'singleAnswer', answers: ['B'] },
        { questionId: 'multiAnswer', answers: ['A', 'B'] }
      ]
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(200)
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    )
    expect(res.headers['cache-control']).toEqual('no-cache')

    expect(res.body).toEqual({
      answers: [
        {
          questionId: 'singleAnswer',
          score: { value: 8, band: 'Strong' }
        },
        {
          questionId: 'multiAnswer',
          score: { value: 8, band: 'Medium' }
        }
      ],
      score: 16,
      status: 'eligible',
      scoreBand: 'Strong'
    })
  })
})
