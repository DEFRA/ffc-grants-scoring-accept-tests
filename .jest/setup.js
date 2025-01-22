global.baseUrl = process.env.ENVIRONMENT
  ? `https://ffc-grants-scoring.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`
  : 'http://localhost:3555'
