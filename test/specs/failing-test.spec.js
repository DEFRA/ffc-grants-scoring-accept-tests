import request from 'supertest'

describe('GET /fail', () => {
  it('should return success', async () => {
    const res = await request(global.baseUrl)
      .get('/fail')
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(200)
  })
})
