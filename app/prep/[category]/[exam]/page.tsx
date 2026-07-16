import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { armedForcesData, branchColors, branchImages } from '@/lib/data/armedForcesData'
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock, ExternalLink,
  GraduationCap, Users, Calendar, UserCheck, FileText, ChevronRight,
  Shield, Zap, BookOpen, ListChecks
} from 'lucide-react'

export const revalidate = 3600

const formatTitle = (slug: string) =>
  slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

export default async function ExamPage({
  params,
}: {
  params: Promise<{ category: string; exam: string }>
}) {
  const { category, exam } = await params
  const info = armedForcesData[exam]

  // ── Fallback: exam not in our data yet ─────────────────────────────────────
  if (category !== 'armed-forces' || !info) {
    const supabase = await createClient()
    const title = formatTitle(exam)
    let headerBg = '/images/armed-forces-header.jpg'
    if (['pma-long-course','lcc','dssc','tcc','afns','soldier'].includes(exam)) headerBg = '/images/exam-army-bg.jpg'
    else if (['gd-pilot','aeronautical-engineering','air-defence','admin','accounts'].includes(exam)) headerBg = '/images/exam-paf-bg.jpg'
    else if (['pn-cadet','ssc','marines','sailor','civilian'].includes(exam)) headerBg = '/images/exam-navy-bg.jpg'
    else if (category === 'public-service') headerBg = '/images/public-service-header.jpg'
    else if (category === 'entry-tests') headerBg = '/images/entry-tests-header.jpg'

    const { data: quizzes } = await supabase
      .from('quizzes').select('*')
      .ilike('title', `${title}%`)
      .order('created_at', { ascending: true })

    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col gap-10 bg-white text-gray-800">
        <Link href={`/prep/${category}`} className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#B8212E] w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to {formatTitle(category)}
        </Link>
        <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 min-h-[240px] flex items-center p-8">
          <div className="absolute inset-0 bg-[#0A192F]/80 z-10" />
          <Image src={headerBg} alt={title} fill priority className="absolute inset-0 object-cover object-center" />
          <div className="relative z-20">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{title}</h1>
            <p className="text-gray-200 mt-2 text-sm font-medium">Practice with real mock tests designed for {title}.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {quizzes && quizzes.length > 0 ? quizzes.map((quiz, i) => (
            <div key={quiz.id} className="border border-gray-200 rounded-xl p-5 hover:border-[#B8212E] hover:shadow-md transition-all bg-white flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">Test {i + 1}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">{quiz.title}</h3>
              <Link href={`/prep/quiz/${quiz.id}`} className="mt-auto w-full py-2 bg-[#B8212E] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#A31C28] transition-colors uppercase tracking-wider">
                Start Test <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )) : (
            <div className="col-span-3 py-16 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold">Practice tests coming soon for {title}.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Full detail page for armed-forces exams ────────────────────────────────
  const clr = branchColors[info.branchSlug]
  const bgImg = branchImages[info.branchSlug]

  // Fetch quizzes from Supabase
  const supabase = await createClient()
  let quizzes: any[] = []
  for (const term of info.quizSearchTerms) {
    const { data } = await supabase
      .from('quizzes').select('*')
      .ilike('title', `%${term}%`)
      .eq('category', info.quizCategory)
      .order('created_at', { ascending: true })
      .limit(6)
    if (data && data.length > 0) { quizzes = data; break }
  }

  return (
    <div className="bg-white text-gray-800 pb-20">

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[280px] sm:min-h-[360px] flex items-end overflow-hidden">
        <Image src={bgImg} alt={info.title} fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/60 to-transparent z-10" />
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-6">
          <Link
            href={`/prep/${category}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Armed Forces
          </Link>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest mb-3 ${clr.badge}`}>
            <Shield className="w-3.5 h-3.5" />
            {info.branch}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xl">
            {info.title}
          </h1>
          <p className="text-sm text-white/80 mt-2 font-semibold">{info.commissionType}</p>
        </div>
      </section>

      {/* ── Quick Facts ──────────────────────────────────────────────────── */}
      <section className="bg-[#0A192F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {info.quickFacts.map((fact, i) => {
              const icons = [Calendar, GraduationCap, Clock, Users]
              const Icon = icons[i] || Zap
              return (
                <div key={fact.label} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{fact.label}</p>
                    <p className="text-white text-xs font-extrabold leading-snug">{fact.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-12">

        {/* ── Overview ────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ChevronRight className={`w-5 h-5`} style={{ color: clr.primary }} />
            <h2 className="text-xl font-extrabold text-gray-900">Overview</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base border-l-4 pl-4" style={{ borderColor: clr.primary }}>
            {info.overview}
          </p>
        </section>

        {/* ── Two-column: Eligibility + Commission/Training ────────────────── */}
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
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: clr.primary }} />
                  <span className="text-sm text-gray-700 leading-snug font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Side Info */}
          <section className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-extrabold text-gray-800">Commission & Training</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Commissioned As</p>
                  <p className="text-gray-800 font-bold mt-0.5">{info.commission}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Training Duration</p>
                  <p className="text-gray-800 font-semibold mt-0.5">{info.training}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Commission Type</p>
                  <p className="text-gray-800 font-semibold mt-0.5">{info.commissionType}</p>
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
              <span>Official Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </section>
        </div>

        {/* ── Selection Process ────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5" style={{ color: clr.primary }} />
            <h2 className="text-xl font-extrabold text-gray-900">Selection Process</h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
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
                  <div className={`flex-1 rounded-xl border p-4 hover:shadow-sm transition-shadow ${i === 0 ? clr.bg + ' ' + clr.border : 'bg-white border-gray-200'}`}>
                    <h3 className="font-extrabold text-gray-900 text-sm mb-1">{step.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Practice Tests ───────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" style={{ color: clr.primary }} />
              <h2 className="text-xl font-extrabold text-gray-900">Practice Tests</h2>
            </div>
          </div>

          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {quizzes.map((quiz, i) => (
                <div
                  key={quiz.id}
                  className="group border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-[#B8212E] transition-all bg-white flex flex-col gap-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gray-100 group-hover:bg-[#B8212E] transition-colors rounded-l-xl" />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Test {i + 1}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${clr.badge}`}>
                      {quiz.category || 'General'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#B8212E] transition-colors line-clamp-2 flex-grow">
                    {quiz.title}
                  </h3>
                  {quiz.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{quiz.description}</p>
                  )}
                  <Link
                    href={`/prep/quiz/${quiz.id}`}
                    className="w-full py-2.5 bg-[#B8212E] hover:bg-[#A31C28] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
                  >
                    Start Test <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 border border-gray-100">
                <BookOpen className="w-7 h-7 text-gray-300" />
              </div>
              <h3 className="text-base font-bold text-gray-700">Practice Tests Coming Soon</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">
                We are preparing mock tests specifically for {info.title}. Check back soon!
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
