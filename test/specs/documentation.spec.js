import request from 'supertest'

describe('Documentation', () => {
  it('should retrieve Swagger documentation', async () => {
    const res = await request(global.baseUrl)
      .get('/scoring/api/v1/documentation')

    expect(res.status).toEqual(200)
  })

  it('should retrieve OpenAPI JSON schema', async () => {
    const res = await request(global.baseUrl)
      .get('/scoring/api/v1/swagger.json')

    expect(res.status).toEqual(200)
  })
})
