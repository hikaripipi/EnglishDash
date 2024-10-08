/**
 * Generated by orval v7.1.1 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import {
  faker
} from '@faker-js/faker'
import {
  HttpResponse,
  delay,
  http
} from 'msw'
import type {
  AnswerResponse,
  PracticeResult,
  PracticeSettingsResponse,
  QuestionResponse
} from '../../scheme/models'

export const getSaveSettingsApiPracticeSettingsPostResponseMock = (overrideResponse: Partial< PracticeSettingsResponse > = {}): PracticeSettingsResponse => ({message: faker.word.sample(), practice_id: faker.number.int({min: undefined, max: undefined}), ...overrideResponse})

export const getGetQuestionApiPracticeQuestionPracticeIdGetResponseMock = (): QuestionResponse[] => (Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({content: faker.word.sample(), id: faker.number.int({min: undefined, max: undefined})})))

export const getSubmitAnswerApiPracticeAnswerQuestionIdPostResponseMock = (overrideResponse: Partial< AnswerResponse > = {}): AnswerResponse => ({feedback: faker.word.sample(), score: faker.number.int({min: undefined, max: undefined}), ...overrideResponse})

export const getGetResultsApiPracticeResultsPracticeIdGetResponseMock = (overrideResponse: Partial< PracticeResult > = {}): PracticeResult => ({feedback: faker.word.sample(), individual_scores: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.number.int({min: undefined, max: undefined}))), total_score: faker.number.int({min: undefined, max: undefined}), ...overrideResponse})


export const getTestDbConnectionApiDbTestGetMockHandler = (overrideResponse?: unknown | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<unknown> | unknown)) => {
  return http.get('*/api/db-test', async (info) => {await delay(1000);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }
    return new HttpResponse(null,
      { status: 200,
        
      })
  })
}

export const getStartPracticeApiPracticeStartGetMockHandler = (overrideResponse?: unknown | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<unknown> | unknown)) => {
  return http.get('*/api/practice/start', async (info) => {await delay(1000);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }
    return new HttpResponse(null,
      { status: 200,
        
      })
  })
}

export const getSaveSettingsApiPracticeSettingsPostMockHandler = (overrideResponse?: PracticeSettingsResponse | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<PracticeSettingsResponse> | PracticeSettingsResponse)) => {
  return http.post('*/api/practice/settings', async (info) => {await delay(1000);
  
    return new HttpResponse(JSON.stringify(overrideResponse !== undefined 
            ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse) 
            : getSaveSettingsApiPracticeSettingsPostResponseMock()),
      { status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
  })
}

export const getGetQuestionApiPracticeQuestionPracticeIdGetMockHandler = (overrideResponse?: QuestionResponse[] | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<QuestionResponse[]> | QuestionResponse[])) => {
  return http.get('*/api/practice/question/:practiceId', async (info) => {await delay(1000);
  
    return new HttpResponse(JSON.stringify(overrideResponse !== undefined 
            ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse) 
            : getGetQuestionApiPracticeQuestionPracticeIdGetResponseMock()),
      { status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
  })
}

export const getSubmitAnswerApiPracticeAnswerQuestionIdPostMockHandler = (overrideResponse?: AnswerResponse | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<AnswerResponse> | AnswerResponse)) => {
  return http.post('*/api/practice/answer/:questionId', async (info) => {await delay(1000);
  
    return new HttpResponse(JSON.stringify(overrideResponse !== undefined 
            ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse) 
            : getSubmitAnswerApiPracticeAnswerQuestionIdPostResponseMock()),
      { status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
  })
}

export const getGetResultsApiPracticeResultsPracticeIdGetMockHandler = (overrideResponse?: PracticeResult | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<PracticeResult> | PracticeResult)) => {
  return http.get('*/api/practice/results/:practiceId', async (info) => {await delay(1000);
  
    return new HttpResponse(JSON.stringify(overrideResponse !== undefined 
            ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse) 
            : getGetResultsApiPracticeResultsPracticeIdGetResponseMock()),
      { status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
  })
}
export const getDefaultMock = () => [
  getTestDbConnectionApiDbTestGetMockHandler(),
  getStartPracticeApiPracticeStartGetMockHandler(),
  getSaveSettingsApiPracticeSettingsPostMockHandler(),
  getGetQuestionApiPracticeQuestionPracticeIdGetMockHandler(),
  getSubmitAnswerApiPracticeAnswerQuestionIdPostMockHandler(),
  getGetResultsApiPracticeResultsPracticeIdGetMockHandler()
]
