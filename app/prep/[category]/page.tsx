import Link from 'next/link'
import { ArrowRight, ShieldCheck, BookOpen, GraduationCap, ArrowLeft } from 'lucide-react'

// Mock Data for Categories - Can be moved to DB later
const categoryData: Record<string, any> = {
  'armed-forces': {
    title: 'Armed Forces Preparation',
    description: 'Join Pak Army, Navy, or PAF. Select your specific commission exam below.',
    icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
    color: 'emerald',
    exams: [
      { id: 'pma-long-course', name: 'PMA Long Course', tag: 'Army' },
      { id: 'lcc', name: 'Lady Cadet Course (LCC)', tag: 'Army' },
      { id: 'dssc', name: 'Direct Short Service Commission', tag: 'Army' },
      { id: 'gd-pilot', name: 'GD Pilot', tag: 'PAF' },
      { id: 'aeronautical-engineering', name: 'Aeronautical Engineering', tag: 'PAF' },
      { id: 'pn-cadet', name: 'PN Cadet', tag: 'Navy' },
    ]
  },
  'public-service': {
    title: 'Public Service Commissions',
    description: 'Federal and Provincial Public Service Commission Preparation.',
    icon: <BookOpen className="w-8 h-8 text-blue-600" />,
    color: 'blue',
    exams: [
      { id: 'fpsc', name: 'FPSC (Federal)', tag: 'Federal' },
      { id: 'ppsc', name: 'PPSC (Punjab)', tag: 'Provincial' },
      { id: 'spsc', name: 'SPSC (Sindh)', tag: 'Provincial' },
      { id: 'kppsc', name: 'KPPSC (KPK)', tag: 'Provincial' },
      { id: 'bpsc', name: 'BPSC (Balochistan)', tag: 'Provincial' },
    ]
  },
  'entry-tests': {
    title: 'University Entry Tests',
    description: 'Prepare for ECAT, MDCAT, NTS, and top university admissions.',
    icon: <GraduationCap className="w-8 h-8 text-amber-600" />,
    color: 'amber',
    exams: [
      { id: 'ecat', name: 'ECAT (Engineering)', tag: 'UET' },
      { id: 'mdcat', name: 'MDCAT (Medical)', tag: 'PMDC' },
      { id: 'nts', name: 'NTS NAT/GAT', tag: 'NTS' },
      { id: 'nust', name: 'NUST NET', tag: 'NUST' },
      { id: 'pieas', name: 'PIEAS Entry Test', tag: 'PIEAS' },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col gap-10 bg-white text-[#222222]">
      <Link href="/prep" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#B8212E] w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Prep Hub
      </Link>
      
      {/* Header */}
      <div className={`flex flex-col items-center text-center p-10 rounded-3xl border ${colorClass}`}>
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
          {data.icon}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          {data.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-medium">
          {data.description}
        </p>
      </div>

      {/* Exams Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Available Exams & Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.exams.map((exam: any) => (
            <Link 
              key={exam.id}
              href={`/prep/${category}/${exam.id}`}
              className="group p-5 border border-gray-200 rounded-xl hover:border-[#B8212E]/40 hover:shadow-lg transition-all bg-white flex flex-col justify-between h-full"
            >
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full mb-3 inline-block">
                  {exam.tag}
                </span>
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-[#B8212E] transition-colors">{exam.name}</h3>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-[#B8212E]">
                <span>View Materials</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
