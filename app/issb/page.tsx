import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight, Brain, Users, UserCheck, ChevronRight,
  CheckCircle2, AlertCircle, Lightbulb, Shield, Target, Clock, BookOpen,
  GraduationCap
} from 'lucide-react'

export const metadata = {
  title: 'ISSB Preparation | Engineer Yasin',
  description:
    'Complete ISSB (Inter Services Selection Board) preparation guide covering all 3 dimensions: Psychological Tests, GTO Tasks, and Deputy President Interview. Tips, techniques, and practice resources for Pakistan Armed Forces candidates.',
  keywords: [
    'ISSB', 'ISSB Pakistan', 'ISSB preparation', 'GTO tasks', 'ISSB psychology',
    'Deputy President interview', 'PMA Long Course ISSB', 'WAT SCT TAT',
    'Group testing officer', 'ISSB guide', 'ISSB tips',
  ],
}

// ─── Dimension Data ──────────────────────────────────────────────────────────
const dimensions = [
  {
    id: 'psychology',
    title: 'Psychology',
    subtitle: 'Psychological Assessment',
    icon: Brain,
    color: 'violet',
    bannerUrl: '/images/issb-psychology.jpg',
    tagline: 'Uncover your inner self through structured mental evaluations.',
    overview:
      'The Psychological dimension assesses your intellectual faculties, emotional stability, personality make-up, social adaptability, and potential for officer-like behaviour. A trained ISSB psychologist studies your written responses across multiple tests conducted over Day 1 of the selection process.',
    tests: [
      {
        name: 'Intelligence Test',
        desc: 'Evaluates mental alertness, reasoning ability, and clarity of thought. Includes verbal and non-verbal reasoning, number series, analogies, and figure matrices.',
        tips: ['Practice speed and accuracy equally.', 'Never skip a question – attempt all within time.'],
      },
      {
        name: 'Word Association Test (WAT)',
        desc: 'You are shown 100 stimulus words (1 per minute) and must form a meaningful sentence for each. Your responses reveal your thought patterns, values, and subconscious outlook.',
        tips: ['Write positive, action-oriented sentences.', 'Avoid negativity, violence, or pessimism.', 'First instinct is usually the best — do not over-think.'],
      },
      {
        name: 'Sentence Completion Test (SCT)',
        desc: 'Complete 75 unfinished sentences in English and Urdu within a time limit. This test measures your attitudes towards family, society, and authority.',
        tips: ['Be consistent across all completions.', 'Show leadership, responsibility, and positivity.'],
      },
      {
        name: 'Picture Story Writing (TAT)',
        desc: 'Write short stories inspired by ambiguous images shown for 30 seconds each. The stories reveal your aspirations, fears, and personality traits.',
        tips: ['Build stories with a clear problem → action → positive resolution arc.', 'Include a hero with leadership qualities.'],
      },
      {
        name: 'Bio-Data Form (PBOR/Officer)',
        desc: 'A detailed personal information form filled on Day 1. Every assessor (Psychologist, GTO, Deputy President) will cross-check your bio-data during their evaluation.',
        tips: ['Fill it with complete honesty.', 'Memorise what you write – contradictions are a major red flag.'],
      },
    ],
    keyQualities: ['Emotional Stability', 'Positive Outlook', 'Leadership Potential', 'Social Responsibility', 'Integrity'],
  },
  {
    id: 'gto',
    title: 'GTO',
    subtitle: 'Group Testing Officer Tasks',
    icon: Users,
    color: 'emerald',
    bannerUrl: '/images/issb-gto.jpg',
    tagline: 'Demonstrate leadership and teamwork under real pressure.',
    overview:
      'The Group Testing Officer (GTO) dimension is the practical, outdoor assessment that evaluates how you perform within a team under physical and mental pressure. It tests leadership, initiative, communication, resourcefulness, and team spirit across a series of indoor and outdoor tasks spanning Days 2 and 3.',
    tests: [
      {
        name: 'Group Discussion (GD)',
        desc: 'A leaderless discussion among 8–12 candidates on a given topic (usually national or social issues). The GTO observes your communication skills, ability to listen, and participation quality.',
        tips: ['Speak confidently and clearly.', 'Do not dominate – encourage quiet members.', 'Bring discussions to a consensus.'],
      },
      {
        name: 'Group Planning Exercise (GPE / Military Planning)',
        desc: 'Candidates are given a model or map and a scenario involving multiple problems that must be solved using available resources. You present your plan individually, then as a group.',
        tips: ['Use a systematic SMEAC approach.', 'Prioritise life-saving tasks first.', 'Allocate resources logically.'],
      },
      {
        name: 'Progressive Group Task (PGT)',
        desc: 'The entire group must cross a series of 4 progressively harder obstacles using limited helping materials (planks, ropes, drums) without touching the ground.',
        tips: ['Contribute ideas proactively.', 'Help teammates physically when needed.', 'Stay calm and focused when plans fail.'],
      },
      {
        name: 'Half Group Task (HGT)',
        desc: 'Similar to PGT but with half the original group, increasing individual visibility and responsibility.',
        tips: ['Every member is visible — take initiative.', 'Lead naturally, not forcefully.'],
      },
      {
        name: 'Command Task',
        desc: 'Each candidate is assigned as the "Commander" and must select 2–3 helpers to complete an obstacle. This is your dedicated leadership moment.',
        tips: ['Brief your team clearly before starting.', 'Adapt when your initial plan doesn\'t work.', 'Thank your team at the end.'],
      },
      {
        name: 'Individual Obstacles (IO)',
        desc: '9 individual physical obstacles completed within a time limit. Tests physical fitness, courage, and determination.',
        tips: ['Train physically before ISSB.', 'Attempt all obstacles — partial marks count.', 'Maintain composure even if you fall.'],
      },
      {
        name: 'Snake Race / Final Group Task (FGT)',
        desc: 'A final team competition that also serves as a social icebreaker observed by the GTO.',
        tips: ['Show team spirit and motivation.', 'Encourage your team loudly and positively.'],
      },
    ],
    keyQualities: ['Leadership', 'Team Spirit', 'Resourcefulness', 'Stamina', 'Decision Making', 'Communication'],
  },
  {
    id: 'deputy',
    title: 'Deputy President',
    subtitle: 'Personal Interview',
    icon: UserCheck,
    color: 'amber',
    bannerUrl: '/images/issb-deputy.jpg',
    tagline: 'Face-to-face with a senior officer — clarity, confidence & character.',
    overview:
      'The Deputy President (typically a Lieutenant Colonel or equivalent) conducts a personal interview lasting 15 to 45 minutes. This is the final and most personal assessment of your suitability for commissioned service. It integrates findings from all three dimensions and directly evaluates your character, motivations, and general knowledge.',
    tests: [
      {
        name: 'Personal & Family Background',
        desc: 'Questions about your upbringing, family members, their professions, your home district, and your personal life experiences.',
        tips: ['Know your bio-data inside out.', 'Speak warmly and proudly about your family.'],
      },
      {
        name: 'Academic & Professional History',
        desc: 'Discussion of your educational qualifications, favourite and least favourite subjects, extra-curricular achievements, and career plans.',
        tips: ['Be honest about your grades.', 'Highlight leadership roles in school/college.'],
      },
      {
        name: 'Motivation for Armed Forces',
        desc: 'Why do you want to join the Pakistan Army / Navy / PAF? What inspires you? Do you have family members in the forces?',
        tips: ['Have a clear, genuine, and specific reason.', 'Mention role models, not just salary or status.'],
      },
      {
        name: 'General Knowledge & Current Affairs',
        desc: 'Questions on Pakistan\'s history, geography, constitutional structure, famous battles, current political events, and defence issues.',
        tips: ['Read Dawn or The News daily.', 'Know the names of key COAS, CNS, CAS and current ministers.'],
      },
      {
        name: 'Situational Judgement Questions',
        desc: 'Hypothetical scenarios designed to test your ethical reasoning, composure, and leadership judgment.',
        tips: ['There is no single "right" answer — your reasoning matters most.', 'Remain calm and think aloud if needed.'],
      },
    ],
    keyQualities: ['Confidence', 'Clarity of Expression', 'Honesty', 'General Awareness', 'Emotional Maturity', 'Patriotism'],
  },
]

// ─── Overview Cards ──────────────────────────────────────────────────────────
const overviewCards = [
  {
    id: 'psychology',
    title: 'Psychologist',
    subtitle: 'Psychological Assessment',
    cardBgUrl: '/images/issb-psychology.jpg',
    tagline: 'Uncovers the subconscious of the candidate through carefully designed psychological tests and assessments.',
    href: '#psychology',
    btnBg: 'bg-[#009beb] hover:bg-[#0089d4]',
    btnText: 'Learn More'
  },
  {
    id: 'gto',
    title: 'GTO',
    subtitle: 'Group Testing Officer Tasks',
    cardBgUrl: '/images/issb-gto.jpg',
    tagline: 'Observes candidates\' behaviour in group settings through various situational tests and group activities.',
    href: '#gto',
    btnBg: 'bg-[#00bda6] hover:bg-[#00a894]',
    btnText: 'Learn More'
  },
  {
    id: 'deputy',
    title: 'Deputy President',
    subtitle: 'Personal Interview',
    cardBgUrl: '/images/issb-deputy.jpg',
    tagline: 'Analyzes candidates\' intellect, emotional pattern and social behaviour through comprehensive interviews.',
    href: '#deputy',
    btnBg: 'bg-[#00afd1] hover:bg-[#009bb8]',
    btnText: 'Learn More'
  },
  {
    id: 'coaching',
    title: 'ISSB Training',
    subtitle: 'Professional Coaching Program',
    cardBgUrl: '/images/real-forces-illustration.jpg',
    tagline: 'Want training or coaching of GTO, Psych, Deputy, or complete ISSB? Unlock our expert mentoring programs.',
    href: '/issb/coaching',
    btnBg: 'bg-[#B8212E] hover:bg-[#A31C28]',
    btnText: 'Explore Coaching'
  }
]

// ─── Color Helpers ────────────────────────────────────────────────────────────
const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; iconBg: string }> = {
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-700',
    iconBg: 'bg-violet-100',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    iconBg: 'bg-emerald-100',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    iconBg: 'bg-amber-100',
  },
}

export default function ISSBPage() {
  return (
    <div className="bg-white text-gray-800 pb-24">

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[320px] sm:min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/issb-header.jpg"
          alt="ISSB Pakistan Inter Services Selection Board"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/85 via-[#0A192F]/70 to-[#0A192F]/90 z-10" />
        <div className="relative z-20 text-center px-4 py-16 sm:py-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#D4AF37] text-[11px] font-extrabold uppercase tracking-widest mb-6">
            <Shield className="w-3.5 h-3.5" />
            Pakistan Armed Forces
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-xl">
            ISSB Preparation
          </h1>
          <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto font-medium leading-relaxed">
            Complete guide to the <span className="text-[#D4AF37] font-bold">Inter Services Selection Board</span> — master all three dimensions and maximise your chances of getting recommended.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {dimensions.map((d) => (
              <a
                key={d.id}
                href={`#${d.id}`}
                className="px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all"
              >
                {d.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Overview Cards ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">ISSB Dimensions & Coaching</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Learn about the three core testing dimensions or enroll in our professional training programs to prepare for your selection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewCards.map((card) => {
            const isExternal = card.href.startsWith('/')
            const Container = isExternal ? Link : 'a'
            const containerProps = isExternal ? { href: card.href } : { href: card.href }

            return (
              <Container
                key={card.id}
                {...containerProps}
                className="group rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full z-20 shadow-sm"
              >
                {/* Top Image Section */}
                {card.id === 'coaching' ? (
                  /* Mixed collage image for Training card */
                  <div className="relative h-48 w-full flex overflow-hidden border-b border-gray-100">
                    <div className="relative w-1/3 h-full">
                      <Image src="/images/issb-psychology.jpg" alt="Psychology" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="relative w-1/3 h-full border-l-2 border-white">
                      <Image src="/images/issb-gto.jpg" alt="GTO" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="relative w-1/3 h-full border-l-2 border-white">
                      <Image src="/images/issb-deputy.jpg" alt="Deputy" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                    
                    {/* Title overlay */}
                    <div className="absolute bottom-3 left-4 right-4 z-20">
                      <h3 className="text-lg font-extrabold text-white tracking-wide">{card.title}</h3>
                    </div>
                  </div>
                ) : (
                  /* Standard single image for dimensions */
                  <div className="relative h-48 w-full overflow-hidden border-b border-gray-100">
                    <Image
                      src={card.cardBgUrl}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                    
                    {/* Title overlay */}
                    <div className="absolute bottom-3 left-4 right-4 z-20">
                      <h3 className="text-lg font-extrabold text-white tracking-wide">{card.title}</h3>
                    </div>
                  </div>
                )}

                {/* Bottom Content Section */}
                <div className="p-5 flex flex-col justify-between flex-grow space-y-5 bg-white">
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                      {card.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium min-h-[60px]">
                      {card.tagline}
                    </p>
                  </div>

                  {/* Button style matching screenshot */}
                  <div className="pt-2">
                    <div className={`w-full py-2.5 rounded-lg text-white font-bold text-center text-xs tracking-wider transition-colors uppercase ${card.btnBg}`}>
                      {card.btnText}
                    </div>
                  </div>
                </div>
              </Container>
            )
          })}
        </div>
      </section>

      {/* ── Quick Facts Banner ───────────────────────────────────────────── */}
      <section className="bg-[#0A192F] py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: Clock, label: '4–5 Days', desc: 'Duration at ISSB' },
            { icon: Target, label: '3 Dimensions', desc: 'Psych · GTO · Interview' },
            { icon: Users, label: '8–12 Candidates', desc: 'Per group batch' },
            { icon: BookOpen, label: '100% Honest', desc: 'Key to success' },
          ].map((fact) => {
            const FIcon = fact.icon
            return (
              <div key={fact.label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <FIcon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-xl font-extrabold text-white">{fact.label}</div>
                <div className="text-xs text-gray-400 font-semibold">{fact.desc}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Dimension Sections ───────────────────────────────────────────── */}
      {dimensions.map((dim, idx) => {
        const clr = colorMap[dim.color]
        const Icon = dim.icon
        const isEven = idx % 2 === 0

        return (
          <section
            key={dim.id}
            id={dim.id}
            className={`py-16 scroll-mt-20 ${isEven ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

              {/* Dimension Header */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className={`order-2 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${clr.badge} text-[11px] font-extrabold uppercase tracking-wider mb-4`}>
                    <Icon className="w-3.5 h-3.5" />
                    Dimension {idx + 1}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                    {dim.title}
                    <span className="block text-base font-semibold text-gray-500 mt-1">{dim.subtitle}</span>
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6">{dim.overview}</p>

                  {/* Key Qualities */}
                  <div>
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Key Qualities Assessed</p>
                    <div className="flex flex-wrap gap-2">
                      {dim.keyQualities.map((q) => (
                        <span key={q} className={`px-3 py-1 rounded-full text-xs font-bold ${clr.badge}`}>
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Banner Image */}
                <div className={`order-1 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] border border-gray-200">
                    <Image
                      src={dim.bannerUrl}
                      alt={dim.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${clr.iconBg} ${clr.text} text-xs font-extrabold`}>
                        <Icon className="w-3.5 h-3.5" />
                        {dim.subtitle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tests / Tasks */}
              <div>
                <h3 className="text-lg font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                  <ChevronRight className={`w-5 h-5 ${clr.text}`} />
                  {dim.id === 'gto' ? 'Tasks & Exercises' : dim.id === 'deputy' ? 'Interview Topics' : 'Tests & Assessments'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {dim.tests.map((test) => (
                    <div
                      key={test.name}
                      className={`rounded-xl border ${clr.border} bg-white p-5 hover:shadow-md transition-shadow flex flex-col gap-3`}
                    >
                      <h4 className={`font-extrabold text-sm ${clr.text}`}>{test.name}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed flex-grow">{test.desc}</p>
                      <div className={`rounded-lg ${clr.bg} p-3 space-y-1.5`}>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" /> Tips
                        </p>
                        {test.tips.map((tip) => (
                          <div key={tip} className="flex items-start gap-1.5">
                            <CheckCircle2 className={`w-3 h-3 ${clr.text} shrink-0 mt-0.5`} />
                            <span className="text-[11px] text-gray-600 font-semibold leading-snug">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* ── General Tips Banner ──────────────────────────────────────────── */}
      <section className="bg-[#0A192F] py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              🎯 Golden Rules for ISSB
            </h2>
            <p className="text-gray-400 text-sm">Essential advice that applies across all three dimensions</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: CheckCircle2, color: 'text-emerald-400', tip: 'Be Authentic', desc: 'Assessors are trained to spot coached or artificial behaviour. Your natural personality is your strongest asset.' },
              { icon: CheckCircle2, color: 'text-emerald-400', tip: 'Stay Consistent', desc: 'Your answers in the psych tests, GTO tasks, and interview must align with each other and with your bio-data.' },
              { icon: AlertCircle, color: 'text-amber-400', tip: 'Avoid Bragging', desc: 'Confidence is valued; arrogance is penalised. Lead by action, not by claiming you are the best.' },
              { icon: CheckCircle2, color: 'text-emerald-400', tip: 'Be a Team Player', desc: 'Support quieter members during group tasks. Earning the respect of peers is observed and rewarded.' },
              { icon: CheckCircle2, color: 'text-emerald-400', tip: 'Prepare Physically', desc: 'GTO outdoor tasks require real fitness. Start a regular PT routine at least 2 months before your ISSB date.' },
              { icon: CheckCircle2, color: 'text-emerald-400', tip: 'Read the News', desc: 'Stay current on national and international affairs. The DP interview frequently touches on current events.' },
            ].map((rule) => {
              const RIcon = rule.icon
              return (
                <div key={rule.tip} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                  <RIcon className={`w-5 h-5 ${rule.color} shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-white font-bold text-sm">{rule.tip}</p>
                    <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{rule.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
          Ready to Practise for ISSB?
        </h2>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-8">
          Head to our Armed Forces prep section to take mock intelligence tests, verbal reasoning quizzes, and more resources designed specifically for ISSB candidates.
        </p>
        <Link
          href="/prep/armed-forces"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#B8212E] hover:bg-[#A31C28] text-white font-bold rounded-xl shadow-lg text-sm transition-all hover:shadow-xl hover:-translate-y-0.5 uppercase tracking-wider"
        >
          Go to Armed Forces Prep
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

    </div>
  )
}
