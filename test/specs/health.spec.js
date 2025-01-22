import request from 'supertest'

describe('GET /health', () => {
  it('should return success', async () => {
    const res = await request(global.baseUrl)
      .get('/health')
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(200)
    expect(res.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    )
    expect(res.headers['cache-control']).toEqual('no-cache')
    expect(res.body).toEqual({ message: 'success' })
  })
})
