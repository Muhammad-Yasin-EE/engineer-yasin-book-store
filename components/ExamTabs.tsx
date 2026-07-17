'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, CheckCircle2, ExternalLink,
  Users, Calendar, Clock, UserCheck,
  ChevronRight, Zap, FileText, BookOpen,
  ListChecks, Info, GraduationCap
} from 'lucide-react'

interface SelectionStep {
  step: number
  title: string
  desc: string
}

interface QuickFact {
  label: string
  value: string
}

interface Quiz {
  id: string
  title: string
  description?: string
  category?: string
}

interface ExamTabsProps {
  info: {
    title: string
    branch: string
    branchSlug: string
    commissionType: string
    overview: string
    quickFacts: QuickFact[]
    eligibility: string[]
    selectionProcess: SelectionStep[]
    training: string
    commission: string
    officialUrl: string
  }
  quizzes: Quiz[]
  clr: {
    primary: string
    bg: string
    badge: string
    border: string
  }
}

export default function ExamTabs({ info, quizzes, clr }: ExamTabsProps) {
  const [activeTab, setActiveTab] = useState<'information' | 'preparation'>('information')

  const tabs = [
    { id: 'information' as const, label: 'Information', icon: Info },
    { id: 'preparation' as const, label: 'Preparation', icon: GraduationCap },
  ]

  return (
    <div>
      {/* ── Tab Bar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all duration-200 cursor-pointer border-b-2 ${
                    isActive
                      ? 'text-[#B8212E] border-[#B8212E]'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'preparation' && quizzes.length > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#B8212E] text-white text-[10px] font-extrabold">
                      {quizzes.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ════ INFORMATION TAB ════════════════════════════════════════════ */}
        {activeTab === 'information' && (
          <div className="space-y-12 animate-fadeIn">

            {/* Overview */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <ChevronRight className="w-5 h-5" style={{ color: clr.primary }} />
                <h2 className="text-xl font-extrabold text-gray-900">Overview</h2>
              </div>
              <p
                className="text-gray-600 leading-relaxed text-sm sm:text-base border-l-4 pl-4 py-1"
                style={{ borderColor: clr.primary }}
              >
                {info.overview}
              </p>
            </section>

            {/* Two-column: Eligibility + Side Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Eligibility Criteria */}
              <section className={`lg:col-span-2 rounded-2xl border ${clr.border} ${clr.bg} p-6`}>
                <div className="flex items-center gap-2 mb-5">
                  <ListChecks className="w-5 h-5" style={{ color: clr.primary }} />
                  <h2 className="text-lg font-extrabold text-gray-900">Eligibility Criteria</h2>
                </div>
                <ul className="space-y-3">
                  {info.eligibility.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: clr.primary }}
                      />
                      <span className="text-sm text-gray-700 leading-snug font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Side Info Card */}
              <section className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <UserCheck className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-extrabold text-gray-800">Commission & Training</h3>
                  </div>
                  <div className="space-y-4 text-xs">
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        Commissioned As
                      </p>
                      <p className="text-gray-800 font-bold mt-1">{info.commission}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        Training Duration
                      </p>
                      <p className="text-gray-700 font-semibold mt-1">{info.training}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        Commission Type
                      </p>
                      <p className="text-gray-700 font-semibold mt-1">{info.commissionType}</p>
                    </div>
                  </div>
                </div>

                <a
                  href={info.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 w-full px-5 py-3.5 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90 shadow-md"
                  style={{ backgroundColor: clr.primary }}
                >
                  <span>Visit Official Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </section>
            </div>

            {/* Selection Process */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5" style={{ color: clr.primary }} />
                <h2 className="text-xl font-extrabold text-gray-900">Selection Process</h2>
              </div>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100 hidden sm:block" />
                <div className="space-y-4">
                  {info.selectionProcess.map((step, i) => (
                    <div key={step.step} className="flex gap-4 sm:gap-6 items-start">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md z-10"
                        style={{ backgroundColor: clr.primary }}
                      >
                        {step.step}
                      </div>
                      <div
                        className={`flex-1 rounded-xl border p-4 hover:shadow-sm transition-shadow ${
                          i === 0
                            ? clr.bg + ' ' + clr.border
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <h3 className="font-extrabold text-gray-900 text-sm mb-1">{step.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ════ PREPARATION TAB ════════════════════════════════════════════ */}
        {activeTab === 'preparation' && (
          <div className="animate-fadeIn">

            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5" style={{ color: clr.primary }} />
              <h2 className="text-xl font-extrabold text-gray-900">Practice Tests</h2>
              {quizzes.length > 0 && (
                <span className="ml-2 text-xs font-bold text-gray-400">
                  {quizzes.length} test{quizzes.length > 1 ? 's' : ''} available
                </span>
              )}
            </div>

            {quizzes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {quizzes.map((quiz, i) => (
                  <div
                    key={quiz.id}
                    className="group border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-[#B8212E] transition-all duration-200 bg-white flex flex-col gap-4 relative overflow-hidden"
                  >
                    {/* Left accent bar */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-gray-100 group-hover:bg-[#B8212E] transition-colors rounded-l-xl" />

                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                        Test {i + 1}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${clr.badge}`}>
                        {info.title}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#B8212E] transition-colors line-clamp-2 flex-grow">
                      {quiz.title}
                    </h3>

                    {quiz.description && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {quiz.description}
                      </p>
                    )}

                    <Link
                      href={`/prep/quiz/${quiz.id}`}
                      className="w-full py-2.5 bg-[#B8212E] hover:bg-[#A31C28] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors uppercase tracking-wider mt-auto"
                    >
                      Start Test <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 border border-gray-100">
                  <BookOpen className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-base font-bold text-gray-700">Practice Tests Coming Soon</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
                  We are preparing mock tests specifically for <strong>{info.title}</strong>. Check back soon!
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
