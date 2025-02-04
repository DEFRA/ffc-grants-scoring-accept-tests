import request from 'supertest'

describe('POST /score validation', () => {
  it('should return 400 when input does not conform to expected JSON format', async () => {
    const payload = {
      invalid: 'invalid'
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual(
      '"answers" is required. "invalid" is not allowed'
    )
  })

  it('should return 400 when questions do not match the scoring config', async () => {
    const payload = {
      answers: [{ questionId: 'X', answers: ['A'] }]
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(400)
    expect(res.text).toEqual('Question with id X not found in scoringData.')
  })

  it('should return 400 when answers do not match the scoring config', async () => {
    const payload = {
      answers: [{ questionId: 'singleAnswer', answers: ['X'] }]
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(400)
    expect(res.text).toEqual('Answer "X" not found in question scores.')
  })

  it('should return 400 when answers are not of type string', async () => {
    const payload = {
      answers: [{ questionId: 'singleAnswer', answers: [100] }]
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual('"answers[0].answers[0]" must be a string')
  })

  it('should return 400 when multiple answers are given to a singleScore question', async () => {
    const payload = {
      answers: [{ questionId: 'singleAnswer', answers: ['A', 'B'] }]
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(400)
    expect(res.text).toEqual(
      'Multiple answers provided for single-answer question: singleAnswer'
    )
  })

  it('should return 400 if no answer is provided to a question', async () => {
    const payload = {
      answers: [{ questionId: 'singleAnswer', answers: [] }]
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual(
      '"answers[0].answers" must contain at least 1 items'
    )
  })
})
