import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'

describe('Observability', () => {
  it('should return success application health', async () => {
    const res = await request(global.baseUrl)
      .get('/health')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.headers['content-type']).toEqual('application/json; charset=utf-8')
    expect(res.headers['cache-control']).toEqual('no-cache')
    expect(res.body).toEqual({ message: 'success' })
  })

  if (process.env.ENVIRONMENT) {
    it('should return the same trace id in response as given in request', async () => {
      const payload = {
        data: {
          main: {
            singleAnswer: 'A',
            multiAnswer: ['A']
          }
        }
      }

      const uuid = uuidv4().replace(/-/g, '').toLowerCase()

      const res = await request(global.baseUrl)
        .post('/scoring/api/v1/example-grant/score')
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-cdp-request-id', uuid)

      expect(res.status).toEqual(200)
      console.log(JSON.stringify(res))
      expect(res.header['x-cdp-request-id']).toBe(uuid)
    })
  }
})
