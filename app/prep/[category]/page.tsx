import Link from 'next/link'
import { ArrowRight, ShieldCheck, BookOpen, GraduationCap, ArrowLeft, Target } from 'lucide-react'

// Enhanced Data for Categories matching exactly what user provided
const categoryData: Record<string, any> = {
  'armed-forces': {
    title: 'Armed Forces Preparation',
    description: 'Join Pak Army, Navy, or PAF. Select your specific commission exam below.',
    icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
    color: 'emerald',
    subgroups: [
      {
        name: 'Pakistan Army',
        exams: [
          { id: 'pma-long-course', name: 'PMA Long Course' },
          { id: 'lcc', name: 'LCC (Lady Cadet Course)' },
          { id: 'dssc', name: 'DSSC' },
          { id: 'tcc', name: 'TCC (Technical Cadet Course)' },
          { id: 'afns', name: 'AFNS' },
          { id: 'soldier', name: 'Soldier' },
        ]
      },
      {
        name: 'Pakistan Air Force',
        exams: [
          { id: 'gd-pilot', name: 'GD Pilot' },
          { id: 'aeronautical-engineering', name: 'Aeronautical Engineering' },
          { id: 'air-defence', name: 'Air Defence' },
          { id: 'admin', name: 'Admin' },
          { id: 'accounts', name: 'Accounts' },
        ]
      },
      {
        name: 'Pakistan Navy',
        exams: [
          { id: 'pn-cadet', name: 'PN Cadet' },
          { id: 'ssc', name: 'SSC' },
          { id: 'marines', name: 'Marines' },
          { id: 'sailor', name: 'Sailor' },
          { id: 'civilian', name: 'Civilian' },
        ]
      }
    ]
  },
  'public-service': {
    title: 'Public Service Commissions',
    description: 'Federal and Provincial Public Service Commission Preparation.',
    icon: <BookOpen className="w-8 h-8 text-blue-600" />,
    color: 'blue',
    subgroups: [
      {
        name: 'All Commissions',
        exams: [
          { id: 'fpsc', name: 'FPSC' },
          { id: 'ppsc', name: 'PPSC' },
          { id: 'bpsc', name: 'BPSC' },
          { id: 'spsc', name: 'SPSC' },
          { id: 'kppsc', name: 'KPPSC' },
          { id: 'ajkpsc', name: 'AJKPSC' },
          { id: 'gbpsc', name: 'GBPSC' },
        ]
      }
    ]
  },
  'entry-tests': {
    title: 'University Entry Tests',
    description: 'Prepare for ECAT, MDCAT, NTS, and top university admissions.',
    icon: <GraduationCap className="w-8 h-8 text-amber-600" />,
    color: 'amber',
    subgroups: [
      {
        name: 'All Entry Tests',
        exams: [
          { id: 'ecat', name: 'ECAT' },
          { id: 'mdcat', name: 'MDCAT' },
          { id: 'nts', name: 'NTS' },
          { id: 'uet', name: 'UET' },
          { id: 'nust', name: 'NUST' },
          { id: 'pieas', name: 'PIEAS' },
          { id: 'giki', name: 'GIKI' },
          { id: 'ots', name: 'OTS' },
          { id: 'pts', name: 'PTS' },
          { id: 'cts', name: 'CTS' },
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
        <ArrowLeft className="w-4 h-4" /> Back to Prep Hub
      </Link>
      
      {/* Header */}
      <div className={`flex flex-col items-center text-center p-6 sm:p-10 rounded-3xl border ${colorClass} shadow-sm relative overflow-hidden`}>
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
          {data.icon}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-4">
          {data.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-medium">
          {data.description}
        </p>
      </div>

      {/* Subgroups & Exams */}
      <div className="space-y-12">
        {data.subgroups.map((subgroup: any) => (
          <div key={subgroup.name}>
            <div className="flex items-center gap-2 mb-6 border-b border-gray-150 pb-2">
              <Target className="w-5 h-5 text-[#B8212E]" />
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">{subgroup.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subgroup.exams.map((exam: any) => (
                <Link 
                  key={exam.id}
                  href={`/prep/${category}/${exam.id}`}
                  className="group p-5 border border-gray-150 rounded-2xl hover:border-[#B8212E]/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col justify-between h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 group-hover:bg-[#B8212E] transition-colors"></div>
                  <div className="pl-2">
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg group-hover:text-[#B8212E] transition-colors">{exam.name}</h3>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-[10px] sm:text-xs font-bold text-gray-400 group-hover:text-[#B8212E] pl-2">
                    <span>View Materials</span>
                    <ArrowRight className="w-4 h-4" />
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
