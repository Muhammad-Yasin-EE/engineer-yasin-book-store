import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, BookOpen, GraduationCap, ArrowLeft, Target } from 'lucide-react'

// Enhanced Data for Categories matching exactly what user provided
const categoryData: Record<string, any> = {
  'armed-forces': {
    title: 'Armed Forces Preparation',
    description: 'Join Pak Army, Navy, or PAF. Select your specific commission exam below.',
    icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
    color: 'emerald',
    headerImageUrl: '/images/armed-forces-header.jpg',
    subgroups: [
      {
        name: 'Pakistan Army',
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Pakistan_Army_emblem.svg/150px-Pakistan_Army_emblem.svg.png',
        exams: [
          { id: 'pma-long-course', name: 'PMA Long Course', cardBgUrl: '/images/card-pma.jpg' },
          { id: 'lcc', name: 'LCC (Lady Cadet Course)', cardBgUrl: '/images/card-lcc.jpg' },
          { id: 'dssc', name: 'DSSC', cardBgUrl: '/images/card-dssc.jpg' },
          { id: 'tcc', name: 'TCC (Technical Cadet Course)', cardBgUrl: '/images/card-tcc.jpg' },
          { id: 'afns', name: 'AFNS', cardBgUrl: '/images/card-afns.jpg' },
          { id: 'soldier', name: 'Soldier', cardBgUrl: '/images/card-soldier.jpg' },
        ]
      },
      {
        name: 'Pakistan Air Force',
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Pakistan_Air_Force_emblem.svg/150px-Pakistan_Air_Force_emblem.svg.png',
        exams: [
          { id: 'gd-pilot', name: 'GD Pilot', cardBgUrl: '/images/card-gd-pilot.jpg' },
          { id: 'aeronautical-engineering', name: 'Aeronautical Engineering', cardBgUrl: '/images/card-aeronautical.jpg' },
          { id: 'air-defence', name: 'Air Defence', cardBgUrl: '/images/card-air-defence.jpg' },
          { id: 'admin', name: 'Admin', cardBgUrl: '/images/exam-paf-bg.jpg' },
          { id: 'accounts', name: 'Accounts', cardBgUrl: '/images/exam-paf-bg.jpg' },
        ]
      },
      {
        name: 'Pakistan Navy',
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Pakistan_Navy_emblem.svg/150px-Pakistan_Navy_emblem.svg.png',
        exams: [
          { id: 'pn-cadet', name: 'PN Cadet', cardBgUrl: '/images/card-pn-cadet.jpg' },
          { id: 'ssc', name: 'SSC', cardBgUrl: '/images/card-ssc-navy.jpg' },
          { id: 'marines', name: 'Marines', cardBgUrl: '/images/card-marines.jpg' },
          { id: 'sailor', name: 'Sailor', cardBgUrl: '/images/card-sailor.jpg' },
          { id: 'civilian', name: 'Civilian', cardBgUrl: '/images/card-civilian.jpg' },
        ]
      }
    ]
  },
  'public-service': {
    title: 'Public Service Commissions',
    description: 'Federal and Provincial Public Service Commission Preparation.',
    icon: <BookOpen className="w-8 h-8 text-blue-600" />,
    color: 'blue',
    headerImageUrl: '/images/public-service-header.jpg',
    subgroups: [
      {
        name: 'All Commissions',
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/State_emblem_of_Pakistan.svg/150px-State_emblem_of_Pakistan.svg.png',
        exams: [
          { id: 'fpsc', name: 'FPSC', cardBgUrl: '/images/card-fpsc.jpg' },
          { id: 'ppsc', name: 'PPSC', cardBgUrl: '/images/card-ppsc.jpg' },
          { id: 'bpsc', name: 'BPSC', cardBgUrl: '/images/card-bpsc.jpg' },
          { id: 'spsc', name: 'SPSC', cardBgUrl: '/images/card-spsc.jpg' },
          { id: 'kppsc', name: 'KPPSC', cardBgUrl: '/images/card-kppsc.jpg' },
          { id: 'ajkpsc', name: 'AJKPSC', cardBgUrl: '/images/card-ajkpsc.jpg' },
          { id: 'gbpsc', name: 'GBPSC', cardBgUrl: '/images/card-gbpsc.jpg' },
        ]
      }
    ]
  },
  'entry-tests': {
    title: 'University Entry Tests',
    description: 'Prepare for ECAT, MDCAT, NTS, and top university admissions.',
    icon: <GraduationCap className="w-8 h-8 text-amber-600" />,
    color: 'amber',
    headerImageUrl: '/images/entry-tests-header.jpg',
    subgroups: [
      {
        name: 'All Entry Tests',
        exams: [
          { id: 'ecat', name: 'ECAT', cardBgUrl: '/images/card-ecat.jpg' },
          { id: 'mdcat', name: 'MDCAT', cardBgUrl: '/images/card-mdcat.jpg' },
          { id: 'nts', name: 'NTS', cardBgUrl: '/images/card-nts.jpg' },
          { id: 'uet', name: 'UET', cardBgUrl: '/images/card-uet.jpg' },
          { id: 'nust', name: 'NUST', cardBgUrl: '/images/card-nust.jpg' },
          { id: 'pieas', name: 'PIEAS', cardBgUrl: '/images/card-pieas.jpg' },
          { id: 'giki', name: 'GIKI', cardBgUrl: '/images/card-giki.jpg' },
          { id: 'ots', name: 'OTS', cardBgUrl: '/images/card-ots.jpg' },
          { id: 'pts', name: 'PTS', cardBgUrl: '/images/card-pts.jpg' },
          { id: 'cts', name: 'CTS', cardBgUrl: '/images/card-cts.jpg' },
        ]
      }
    ]
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  
  const data = categoryData[category]
  
  if (!data) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Category not found</h2>
        <Link href="/prep" className="text-[#B8212E] hover:underline mt-4 inline-block">Return to Prep Hub</Link>
      </div>
    )
  }

  const colorClass = data.color === 'emerald' ? 'bg-emerald-50 border-emerald-200' : 
                     data.color === 'blue' ? 'bg-blue-50 border-blue-200' : 
                     'bg-amber-50 border-amber-200'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col gap-10 bg-white text-gray-800">
      <Link href="/prep" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#B8212E] w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Hub
      </Link>
      
      {/* Header */}
      {data.headerImageUrl ? (
        <div className="relative rounded-md overflow-hidden shadow-sm border border-gray-200 min-h-[250px] sm:min-h-[300px] flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0A192F]/80 z-10 mix-blend-multiply"></div>
          <Image src={data.headerImageUrl} alt={data.title} fill priority className="absolute inset-0 object-cover object-top" />
          <div className="relative z-20 flex flex-col items-center text-center p-8 sm:p-14 text-white w-full">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-lg text-white">
              {data.title}
            </h1>
            <p className="text-sm sm:text-base max-w-2xl mx-auto font-medium text-gray-200 drop-shadow-md">
              {data.description}
            </p>
          </div>
        </div>
      ) : (
        <div className={`flex flex-col items-center text-center p-6 sm:p-10 rounded-md border ${colorClass} shadow-sm relative overflow-hidden`}>
          <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center mb-6 shadow-sm border border-gray-100">
            {data.icon}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            {data.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-medium">
            {data.description}
          </p>
        </div>
      )}

      {/* Subgroups & Exams */}
      <div className="space-y-12">
        {data.subgroups.map((subgroup: any) => (
          <div key={subgroup.name}>
            <div className="flex items-center gap-3 mb-6 border-b border-gray-150 pb-3">
              {subgroup.iconUrl ? (
                <div className="w-10 h-10 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden p-1 relative">
                  <Image src={subgroup.iconUrl} alt={subgroup.name} fill sizes="40px" className="object-contain p-1" />
                </div>
              ) : (
                <Target className="w-6 h-6 text-[#B8212E]" />
              )}
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 uppercase tracking-widest">{subgroup.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subgroup.exams.map((exam: any) => (
                <Link 
                  key={exam.id}
                  href={`/prep/${category}/${exam.id}`}
                  className={`group border border-gray-200 rounded-md hover:border-[#B8212E] hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full min-h-[160px] relative overflow-hidden ${exam.cardBgUrl ? '' : 'p-5 bg-white'}`}
                >
                  {exam.cardBgUrl && (
                    <>
                      <Image src={exam.cardBgUrl} alt={exam.name} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                    </>
                  )}
                  {!exam.cardBgUrl && <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 group-hover:bg-[#B8212E] transition-colors"></div>}
                  
                  <div className={`relative z-20 ${exam.cardBgUrl ? 'p-5 flex flex-col h-full justify-end' : 'pl-2'}`}>
                    <h3 className={`font-bold text-base sm:text-lg transition-colors ${exam.cardBgUrl ? 'text-white drop-shadow-md' : 'text-gray-900 group-hover:text-[#B8212E]'}`}>{exam.name}</h3>
                    <div className={`mt-2 flex items-center justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${exam.cardBgUrl ? 'text-gray-300 group-hover:text-white' : 'text-gray-400 group-hover:text-[#B8212E] mt-6'}`}>
                      <span>View Materials</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
