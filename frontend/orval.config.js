module.exports = {
  fastapi: {
    output: {
      mode: 'tags-split',
      target: './src/lib',
      schemas: './src/scheme/models',
      client: 'react-query',
      mock: true,
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      override: {
        mutator: {
          path: './src/lib/axios.ts',
          name: 'customInstance',
        },
      },
    },
    input: {
      target: './src/scheme/openapi.json',
    },
  },
}
