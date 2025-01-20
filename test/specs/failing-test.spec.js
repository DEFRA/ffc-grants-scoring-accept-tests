import request from 'supertest'

describe('GET /fail', () => {
  it('should return success', async () => {
    await request(global.baseUrl)
      .get('/fail')
      .set('Accept', 'application/json')
      .expect(200)
  })
})
