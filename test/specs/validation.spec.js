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

  it('should return 400 when invalid query string parameter is given', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'A',
          multiAnswer: ['A', 'A']
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/invalid-grant/score?invalid=true')
      .send(payload).set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })

  it('should score not a single question if allowPartialScoring parameter is false', async () => {
    const payload = {
      data: {
        main: {
          singleAnswer: 'B'
        }
      }
    }

    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/example-grant/score?allowPartialScoring=false')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

      expect(res.status).toEqual(400)
  })
})
