'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useSaveSettingsApiPracticeSettingsPost } from '@/lib/default/default'
import { usePracticeContext } from '@/lib/hooks/usePractice'

export default function Settings() {
  const router = useRouter()
  const [mode, setMode] = useState('writing')
  const [toeflScore, setToeflScore] = useState('80-90')
  const [questionCount, setQuestionCount] = useState(1)
  const [duration, setDuration] = useState(mode === 'speaking' ? 1 : 5)
  const { mutateAsync } = useSaveSettingsApiPracticeSettingsPost()
  const { setPracticeId } = usePracticeContext()
  const [isLoading, setIsLoading] = useState(false)
  const handleStart = async () => {
    // Here you would typically save the settings to a global state or context
    // For now, we'll just navigate to the questions page
    const settings = {
      mode,
      toefl_score: toeflScore,
      num_questions: questionCount,
      duration
    }
    console.log({ settings })
    setIsLoading(true)
    const res = await mutateAsync({ data: settings })
    console.log({ res })
    setPracticeId(res?.practice_id ?? null)
    setIsLoading(false)
    router.push('/questions')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Practice Settings</h1>

      <div className="w-full max-w-md space-y-6">
        <div>
          <Label>Mode</Label>
          <RadioGroup value={mode} onValueChange={setMode} className="flex space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="writing" id="writing" />
              <Label htmlFor="writing">Writing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="speaking" id="speaking" />
              <Label htmlFor="speaking">Speaking</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>TOEFL Score</Label>
          <Select value={toeflScore} onValueChange={setToeflScore}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select TOEFL Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-60">0-60</SelectItem>
              <SelectItem value="61-80">61-80</SelectItem>
              <SelectItem value="80-90">80-90</SelectItem>
              <SelectItem value="91-100">91-100</SelectItem>
              <SelectItem value="101-120">101-120</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Number of Questions</Label>
          <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select Question Count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 questions</SelectItem>
              <SelectItem value="3">3 questions</SelectItem>
              <SelectItem value="5">5 questions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Duration per Question</Label>
          <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select Duration" />
            </SelectTrigger>
            <SelectContent>
              {mode === 'writing' ? (
                <>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="3">3 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleStart} className="w-full" disabled={isLoading}>Start Practice</Button>
      </div>
    </div>
  )
}
