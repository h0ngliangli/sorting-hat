"use client"

import { useMemo, useState } from "react"

type SchoolId = "sandpiper" | "nesbit" | "ralston"

type Answer = {
  label: string
  scores: Record<SchoolId, number>
  reason: string
}

type Question = {
  id: string
  title: string
  prompt: string
  answers: Answer[]
  video: string
}

type SchoolProfile = {
  name: string
  vibe: string
  summary: string
}

const schools: Record<SchoolId, SchoolProfile> = {
  sandpiper: {
    name: "Sandpiper Middle School",
    vibe: "active and hands-on",
    summary:
      "A match for students who light up around movement, making, and energetic school life.",
  },
  nesbit: {
    name: "Nesbit Middle School",
    vibe: "creative and close-knit",
    summary:
      "A fit for students who want space for arts, expression, and a more personal-feeling community.",
  },
  ralston: {
    name: "Ralston Middle School",
    vibe: "curious and balanced",
    summary:
      "A strong fit for students who enjoy ideas, discussion, and a steady mix of academics and connection.",
  },
}

const questions: Question[] = [
  {
    id: "learning-style",
    title: "Question 1",
    prompt: "How do you prefer to learn?",
    video: "/videos/sh-1.mp4",
    answers: [
      {
        label: "I love hands-on activities and experiments.",
        scores: { sandpiper: 3, nesbit: 1, ralston: 1 },
        reason: "you enjoy learning by doing and jumping into activities",
      },
      {
        label: "I enjoy reading and writing.",
        scores: { sandpiper: 0, nesbit: 2, ralston: 3 },
        reason:
          "you are drawn to reflection, reading, and independent thinking",
      },
      {
        label: "I like to listen and discuss ideas with others.",
        scores: { sandpiper: 1, nesbit: 1, ralston: 3 },
        reason:
          "you thrive when learning includes conversation and shared ideas",
      },
    ],
  },
  {
    id: "activities",
    title: "Question 2",
    prompt: "What extracurricular activities are you interested in?",
    video: "/videos/sh-2.mp4",
    answers: [
      {
        label: "I want to join sports teams and be active.",
        scores: { sandpiper: 3, nesbit: 0, ralston: 1 },
        reason:
          "you want a school experience with motion, teamwork, and school spirit",
      },
      {
        label: "I am interested in clubs like drama, music, or art.",
        scores: { sandpiper: 1, nesbit: 3, ralston: 1 },
        reason: "creative spaces and expressive clubs matter to you",
      },
      {
        label: "I want to participate in academic clubs and competitions.",
        scores: { sandpiper: 0, nesbit: 1, ralston: 3 },
        reason:
          "you are excited by challenge, inquiry, and academic exploration",
      },
    ],
  },
  {
    id: "social-environment",
    title: "Question 3",
    prompt: "What kind of social environment do you prefer?",
    video: "/videos/sh-3.mp4",
    answers: [
      {
        label:
          "I like being in a large, bustling school with lots of students.",
        scores: { sandpiper: 3, nesbit: 0, ralston: 1 },
        reason: "you are energized by a lively environment with lots happening",
      },
      {
        label: "I prefer a smaller school where I can get to know everyone.",
        scores: { sandpiper: 0, nesbit: 3, ralston: 1 },
        reason:
          "a tight-knit community and familiar faces help you feel at home",
      },
      {
        label:
          "I want a school that has a good balance of social activities and quiet spaces.",
        scores: { sandpiper: 1, nesbit: 1, ralston: 3 },
        reason: "you value a thoughtful balance between connection and calm",
      },
    ],
  },
]

const introVideo = "/videos/sh-intro.mp4"
const resultVideo = "/videos/sh-ending.mp4"

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const currentQuestion = questions[currentStep - 1]
  const isIntro = currentStep === 0
  const isComplete = currentStep > questions.length

  const result = useMemo(() => {
    if (!isComplete) {
      return null
    }

    const totals: Record<SchoolId, number> = {
      sandpiper: 0,
      nesbit: 0,
      ralston: 0,
    }

    const reasons: string[] = []

    questions.forEach((question, index) => {
      const answerIndex = selectedAnswers[index]
      const answer = question.answers[answerIndex]

      if (!answer) {
        return
      }

      ;(Object.keys(answer.scores) as SchoolId[]).forEach((schoolId) => {
        totals[schoolId] += answer.scores[schoolId]
      })

      reasons.push(answer.reason)
    })

    const ranked = (Object.entries(totals) as [SchoolId, number][]).sort(
      (left, right) => right[1] - left[1],
    )

    const winner = ranked[0][0]
    const profile = schools[winner]
    const explanation = reasons.slice(0, 2).join(", and ")

    return {
      school: profile.name,
      summary: profile.summary,
      explanation: `The hat sensed that ${explanation}. That points toward a ${profile.vibe} school experience.`,
    }
  }, [isComplete, selectedAnswers])

  const chooseAnswer = (answerIndex: number) => {
    const nextAnswers = [...selectedAnswers]
    nextAnswers[currentStep - 1] = answerIndex
    setSelectedAnswers(nextAnswers)
  }

  const goNext = () => {
    if (isIntro) {
      setCurrentStep(1)
      return
    }

    if (typeof selectedAnswers[currentStep - 1] !== "number") {
      return
    }

    setCurrentStep((step) => step + 1)
  }

  const restart = () => {
    setSelectedAnswers([])
    setCurrentStep(0)
  }

  const sceneVideo = isIntro
    ? introVideo
    : isComplete
      ? resultVideo
      : currentQuestion.video

  return (
    <main className="page-shell">
      <section className="experience-card">
        <div className="media-panel">
          <video
            key={sceneVideo}
            className="scene-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={sceneVideo} type="video/mp4" />
          </video>
          <div className="media-overlay" />
          <div className="media-copy">
            <p className="eyebrow">BRSSD 2026-2027 Middle School Guide</p>
            <h1>The Sorting Hat Has Opinions</h1>
            <p>
              This interactive guide is for fun and exploration only. It does
              not affect the actual school selection process.
            </p>
          </div>
        </div>

        <div className="content-panel">
          <div className="progress-row">
            <span>
              Scene {Math.min(currentStep + 1, questions.length + 2)} of{" "}
              {questions.length + 2}
            </span>
            <div className="progress-track" aria-hidden="true">
              <span
                className="progress-fill"
                style={{
                  width: `${(Math.min(currentStep, questions.length + 1) / (questions.length + 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {isIntro ? (
            <div className="scene-body">
              <p className="scene-label">Introduction</p>
              <h2>Welcome, young wizards and witches.</h2>
              <p className="scene-text">
                I am the Sorting Hat, and I am here to help you discover which
                middle school in the BRSSD district feels like the best fit for
                your personality and preferences. Answer honestly, trust your
                instincts, and let the magic begin.
              </p>
              <button className="primary-button" onClick={goNext}>
                Start
              </button>
            </div>
          ) : isComplete && result ? (
            <div className="scene-body">
              <p className="scene-label">Sorting Results</p>
              <h2>{result.school}</h2>
              <p className="scene-text">{result.summary}</p>
              <p className="result-callout">{result.explanation}</p>
              <p className="footnote">
                Congratulations. Now explore the real BRSSD school options with
                your family for the full picture.
              </p>
              <div className="button-row">
                <button className="primary-button" onClick={restart}>
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="scene-body">
              <p className="scene-label">{currentQuestion.title}</p>
              <h2>{currentQuestion.prompt}</h2>
              <div className="answer-list">
                {currentQuestion.answers.map((answer, answerIndex) => {
                  const isSelected =
                    selectedAnswers[currentStep - 1] === answerIndex

                  return (
                    <button
                      key={answer.label}
                      className={`answer-card${isSelected ? " selected" : ""}`}
                      onClick={() => chooseAnswer(answerIndex)}
                    >
                      <span>{answer.label}</span>
                    </button>
                  )
                })}
              </div>
              <div className="button-row">
                <button
                  className="primary-button"
                  onClick={goNext}
                  disabled={
                    typeof selectedAnswers[currentStep - 1] !== "number"
                  }
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
