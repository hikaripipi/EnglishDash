'use client'

import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useGetQuestionApiPracticeQuestionPracticeIdGet, useStartPracticeApiPracticeStartGet, useSubmitAnswerApiPracticeAnswerQuestionIdPost } from '@/lib/default/default'
import { usePracticeContext } from '@/lib/hooks/usePractice'
import { useMutex } from '@/lib/hooks/useMutex'

export default function Questions() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const { practiceId } = usePracticeContext()
  const { data: questions, isLoading, error } = useGetQuestionApiPracticeQuestionPracticeIdGet(practiceId ?? 0)
  const { mutateAsync } = useSubmitAnswerApiPracticeAnswerQuestionIdPost()
  const { mutex, lock, unlock } = useMutex()
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestion])

  const handleNext = async () => {
    if (!questions || questions.length === 0) return
    setCurrentQuestion(currentQuestion + 1)
    lock()
    const res = await mutateAsync({ questionId: questions[currentQuestion].id, data: { answer: answer } })
    console.log({ res })
    setAnswer('')
    setTimeLeft(300) // Reset timer for next question
    unlock()
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error instanceof Error ? error.message : 'Unknown error occurred'}</div>
  if (!questions || questions.length === 0) return <div>No questions found</div>
  if (currentQuestion === questions.length) {
    redirect('/results')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Question {currentQuestion + 1}/{questions.length}</h2>
          <div className="text-xl font-semibold">Time left: {formatTime(timeLeft)}</div>
        </div>

        <p className="text-lg">{questions[currentQuestion]?.content}</p>

        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="min-h-[200px]"
        />

        <Button onClick={handleNext} className="w-full" disabled={mutex}>
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
        </Button>
      </div>
    </div>
  )
}
