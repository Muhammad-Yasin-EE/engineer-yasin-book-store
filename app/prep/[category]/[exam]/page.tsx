import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { armedForcesData, branchColors, branchImages } from '@/lib/data/armedForcesData'
import ExamTabs from '@/components/ExamTabs'
import {
  ArrowLeft, Shield, Calendar, GraduationCap, Clock, Users,
  BookOpen, ArrowRight, FileText
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
  const supabase = await createClient()

  // ── Fallback for non-armed-forces or unknown exams ─────────────────────────
  if (category !== 'armed-forces' || !info) {
    const title = formatTitle(exam)
    let headerBg = '/images/armed-forces-header.jpg'
    if (['pma-long-course', 'lcc', 'dssc', 'tcc', 'afns', 'soldier'].includes(exam))
      headerBg = '/images/exam-army-bg.jpg'
    else if (['gd-pilot', 'aeronautical-engineering', 'air-defence', 'admin', 'accounts'].includes(exam))
      headerBg = '/images/exam-paf-bg.jpg'
    else if (['pn-cadet', 'ssc', 'marines', 'sailor', 'civilian'].includes(exam))
      headerBg = '/images/exam-navy-bg.jpg'
    else if (category === 'public-service') headerBg = '/images/public-service-header.jpg'
    else if (category === 'entry-tests') headerBg = '/images/entry-tests-header.jpg'

    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('*')
      .ilike('title', `${title}%`)
      .order('created_at', { ascending: true })

    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col gap-10 bg-white text-gray-800">
        <Link
          href={`/prep/${category}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#B8212E] w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {formatTitle(category)}
        </Link>
        <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 min-h-[240px] flex items-center p-8">
          <div className="absolute inset-0 bg-[#0A192F]/80 z-10" />
          <Image src={headerBg} alt={title} fill priority className="absolute inset-0 object-cover object-center" />
          <div className="relative z-20">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{title}</h1>
            <p className="text-gray-200 mt-2 text-sm font-medium">
              Practice with real mock tests designed for {title}.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {quizzes && quizzes.length > 0 ? (
            quizzes.map((quiz, i) => (
              <div
                key={quiz.id}
                className="border border-gray-200 rounded-xl p-5 hover:border-[#B8212E] hover:shadow-md transition-all bg-white flex flex-col gap-4"
              >
                <span className="text-xs font-bold text-gray-400">Test {i + 1}</span>
                <h3 className="font-bold text-gray-900 text-base">{quiz.title}</h3>
                <Link
                  href={`/prep/quiz/${quiz.id}`}
                  className="mt-auto w-full py-2 bg-[#B8212E] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#A31C28] transition-colors uppercase tracking-wider"
                >
                  Start Test <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-16 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold">Practice tests coming soon for {title}.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Full armed-forces detail page ──────────────────────────────────────────
  const clr = branchColors[info.branchSlug]
  const bgImg = branchImages[info.branchSlug]

  // Fetch matching quizzes (combining all relevant search terms)
  let quizzes: any[] = []
  const seenIds = new Set<string>()
  for (const term of info.quizSearchTerms) {
    const { data } = await supabase
      .from('quizzes')
      .select('*')
      .ilike('title', `%${term}%`)
      .eq('category', info.quizCategory)
      .order('created_at', { ascending: true })
      .limit(20)
    if (data && data.length > 0) {
      for (const q of data) {
        // Exclude Verbal/Intelligence quizzes from soldier, sailor, civilian cards
        const isVerbalOrIntel = q.title.toLowerCase().includes('verbal') || q.title.toLowerCase().includes('intelligence')
        if (isVerbalOrIntel && ['soldier', 'sailor', 'civilian'].includes(exam)) {
          continue
        }
        if (!seenIds.has(q.id)) {
          seenIds.add(q.id)
          quizzes.push(q)
        }
      }
    }
  }

  const quickIcons = [Calendar, GraduationCap, Clock, Users]

  return (
    <div className="bg-white text-gray-800 pb-20">

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[280px] sm:min-h-[360px] flex flex-col overflow-hidden">
        <Image
          src={bgImg}
          alt={info.title}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/55 to-transparent z-10" />

        {/* Top row: back arrow left, branch badge right */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between">
          <Link
            href={`/prep/${category}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Armed Forces
          </Link>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest ${clr.badge}`}
          >
            <Shield className="w-3.5 h-3.5" />
            {info.branch}
          </div>
        </div>

        {/* Bottom: title + commission type */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 mt-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xl">
            {info.title}
          </h1>
          <p className="text-sm text-white/75 mt-2 font-semibold">{info.commissionType}</p>
        </div>
      </section>


      {/* ── Quick Facts Strip ────────────────────────────────────────────── */}
      <section className="bg-[#0A192F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {info.quickFacts.map((fact, i) => {
              const Icon = quickIcons[i] || Shield
              return (
                <div
                  key={fact.label}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {fact.label}
                    </p>
                    <p className="text-white text-xs font-extrabold leading-snug mt-0.5">
                      {fact.value}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Tabbed Content (client component) ───────────────────────────── */}
      <ExamTabs
        info={info}
        quizzes={quizzes}
        clr={clr}
      />

    </div>
  )
}
