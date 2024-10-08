'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useGetResultsApiPracticeResultsPracticeIdGet } from '@/lib/default/default'
import { usePracticeContext } from '@/lib/hooks/usePractice'
import { Skeleton } from '@/components/ui/skeleton'

// This would typically come from an API or context

const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;

export default function Results() {
  const { practiceId } = usePracticeContext()
  const { data: result, isLoading } = useGetResultsApiPracticeResultsPracticeIdGet(practiceId ?? 0, {
    query: {
      retry: false,
      staleTime: Infinity,
    }
  })
  console.log({ result, isLoading })
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Your Results</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Total Score: <span className="inline-block">{isLoading ? <Skeleton className="w-20 h-4" /> : result?.total_score}</span>
          </h2>

          <h3 className="text-xl font-semibold mb-2">Individual Scores:</h3>
          <ul className="list-disc list-inside mb-4">
            {isLoading && <Skeleton className="w-full h-12" />}
            {!isLoading && result?.individual_scores.map((score, index) => (
              <li key={index}>Question {index + 1}: {score}</li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mb-2">AI Feedback:</h3>
          {isLoading && <Skeleton className="w-full h-28" />}
          <p>{!isLoading && result?.feedback}</p>
        </div>

        <Link href="/">
          <Button className="w-full" disabled={isLoading}>Practice Again</Button>
        </Link>
      </div>
    </div>
  )
}
