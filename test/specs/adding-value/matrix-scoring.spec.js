import request from 'supertest'

describe('Matrix Scoring', () => {
  it('should score a matrixScore question', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
      .send({
        data: {
          main: {
            processedProduceType: 'produceProcessed-A5',
            valueAdditionMethod: 'howAddingValue-A1'
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.body.answers.find((a) => a.questionId === 'processedProduceType').score.value).toBe(15)
    expect(res.body.answers.find((a) => a.questionId === 'processedProduceType').score.band).toBe('Average')
  })

  it('should return a zero score for the scoreDependency question and the same score band as the dependee', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
      .send({
        data: {
          main: {
            processedProduceType: 'produceProcessed-A5',
            valueAdditionMethod: 'howAddingValue-A1'
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.body.answers.find((a) => a.questionId === 'valueAdditionMethod').score.value).toBe(0)
    expect(res.body.answers.find((a) => a.questionId === 'valueAdditionMethod').score.band).toBe('Average')
  })

  it('should return 400 when matrixScore question is sent without dependency', async () => {
    const res = await request(global.baseUrl)
      .post('/scoring/api/v1/adding-value/score?allowPartialScoring=true')
      .send({
        data: {
          main: {
            processedProduceType: 'produceProcessed-A3'
          }
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })
})
