import request from 'supertest'

describe('Validation', () => {
  it('should return 400 when input does not conform to expected JSON format', async () => {
    const payload = {
      invalid: 'invalid'
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
    expect(res.body.message).toEqual('Validation failed: [data]: Expected an object with \"data\", but received something else | [invalid]: \"invalid\" is not allowed')
  })

  it('should return 400 when all scoring questions are not supplied', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'A'
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
    expect(res.body.message).toEqual("Questions with id(s) multiAnswer not found in user's answers.")
  })

  it('should return 400 when answers do not match the scoring config', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'X',
          multiAnswer: ['A']
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
    expect(res.body.message).toEqual('Answer "X" not found in question scores.')
  })

  it('should return 400 when multiple answers are given to a singleScore question', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: ['A', 'B'],
          multiAnswer: ['A']
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
    expect(res.body.message).toEqual('Multiple answers provided for single-answer question: singleAnswer')
  })

  it('should return 400 when no answer is given to a singleScore question', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: null,
          multiAnswer: ['A']
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
    expect(res.body.message).toEqual('Validation failed: [data.main.singleAnswer]: \"data.main.singleAnswer\" must be one of [string, number, array]')
  })

  it('should return 400 when no answers are given to a multiScore question', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'A',
          multiAnswer: []
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })

  it('should return 400 when duplicate answers given to a multiScore question', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'A',
          multiAnswer: ['A', 'A']
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
    expect(res.body.message).toEqual('Validation failed: [data.main.multiAnswer.1]: \"data.main.multiAnswer[1]\" contains a duplicate value')
  })

  it('should return 400 when invalid grant type given in URL', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'A',
          multiAnswer: ['A', 'B']
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/invalid-grant/score')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
    expect(JSON.parse(res.text).error).toEqual('Invalid grant type')
  })


  it('should return 400 when invalid grant type given in URL alongside duplicate answers', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'A',
          multiAnswer: ['A', 'A']
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/invalid-grant/score')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })  
})
