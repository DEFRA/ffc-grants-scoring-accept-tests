global.baseUrl = process.env.ENVIRONMENT ?
  `https://ffc-grants-scoring.${process.env.ENVIRONMENT}.cdp-int.defra.cloud` : `https://ffc-grants-scoring.test.cdp-int.defra.cloud`
