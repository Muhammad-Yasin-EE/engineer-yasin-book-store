'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft, Lock, MessageCircle, Mail, Phone, 
  ShieldAlert, Check, Sparkles, Brain, Users, 
  UserCheck, GraduationCap, X 
} from 'lucide-react'

interface CoachingProgram {
  id: string
  title: string
  subtitle: string
  price: string
  tagline: string
  image: string
  icon: React.ComponentType<any>
  details: string[]
  badge?: string
  whatsappText: string
}

const COACHING_PROGRAMS: CoachingProgram[] = [
  {
    id: 'psychology',
    title: 'Psychology Coaching',
    subtitle: 'Written & Mental Assessment Guidance',
    price: 'Rs. 2,500',
    tagline: 'Get expert evaluation and feedback on your psychological tests.',
    image: '/images/issb-psychology.jpg',
    icon: Brain,
    details: [
      'Personal evaluation of WAT (Word Association Test) response sheet',
      'Urdu & English SCT (Sentence Completion) review and optimization',
      'Creative guidance for TAT (Picture Stories) writing',
      'Exclusive intelligence mock exams with performance reports'
    ],
    whatsappText: 'Hello Sir, I want to get details and enroll in the ISSB Psychology Coaching program. Please guide me on the registration process.'
  },
  {
    id: 'gto',
    title: 'GTO Tasks Coaching',
    subtitle: 'Outdoor & Indoor Team Tasks Mastery',
    price: 'Rs. 3,500',
    tagline: 'Learn obstacle-crossing tricks and military mapping strategies.',
    image: '/images/issb-gto.jpg',
    icon: Users,
    details: [
      'Military Planning / GPE (Group Planning Exercise) scenario training',
      'Obstacle crossing logic (plank, rope, drum placement guidelines)',
      'Leadership behavior coaching for Command Tasks',
      'Team consensus strategies for Group Discussions (GD)'
    ],
    whatsappText: 'Hello Sir, I want to get details and enroll in the ISSB GTO Coaching program. Please guide me on the next batch timings.'
  },
  {
    id: 'deputy',
    title: 'Deputy President Interview Prep',
    subtitle: '1-on-1 Mock Interviews & Evaluation',
    price: 'Rs. 2,000',
    tagline: 'Simulate the actual ISSB interview with expert retired officers.',
    image: '/images/issb-deputy.jpg',
    icon: UserCheck,
    details: [
      'Two mock interviews simulating the actual Board environment',
      'Bio-Data form review and identification of red flags',
      'Coaching for situational judgment & pressure handling questions',
      'Comprehensive feedback on body language and confidence level'
    ],
    whatsappText: 'Hello Sir, I want to get details and enroll in the ISSB Deputy President Interview Prep. Please guide me.'
  },
  {
    id: 'complete',
    title: 'Complete ISSB Premium Prep',
    subtitle: 'All-in-One Elite Board Coaching',
    price: 'Rs. 7,500',
    badge: 'Highly Recommended',
    tagline: 'Full preparation plan covering all three ISSB assessment dimensions.',
    image: '/images/real-forces-illustration.jpg',
    icon: GraduationCap,
    details: [
      'Full coverage of GTO Tasks, Psychological Tests, and DP Interview',
      'Expert review of filled Bio-Data forms',
      'Mock interview + detailed psychological evaluation report',
      'Lifetime membership with free query support and past papers updates'
    ],
    whatsappText: 'Hello Sir, I want to enroll in the Complete ISSB Premium Coaching program. Please share the pricing and registration details.'
  }
]

export default function IssbCoachingPage() {
  const [selectedProgram, setSelectedProgram] = useState<CoachingProgram | null>(null)

  const handleOpenModal = (program: CoachingProgram) => {
    setSelectedProgram(program)
  }

  const handleCloseModal = () => {
    setSelectedProgram(null)
  }

  return (
    <div className="bg-slate-50 min-h-screen text-gray-800 pb-24 font-sans">
      
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#0A192F] py-16 text-white border-b border-[#112240]">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#B8212E]/10 to-[#D4AF37]/10 opacity-30 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/issb" className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-[#D4AF37] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to ISSB Hub
          </Link>
          
          <div className="text-center lg:text-left max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-white/10 border border-white/20 text-[#D4AF37] text-[10px] uppercase tracking-wider font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Elite Preparation Programs
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              ISSB Training & <span className="text-[#D4AF37]">Coaching</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed">
              Step up your preparation with individual or comprehensive coaching bundles. Learn directly from specialists and retired officers to guarantee your recommendation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COACHING_PROGRAMS.map((program) => {
            const Icon = program.icon
            return (
              <div 
                key={program.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-150 flex flex-col justify-between hover:shadow-xl hover:border-gray-300 transition-all duration-300 group"
              >
                {/* Image Section */}
                <div className="relative h-60 w-full overflow-hidden">
                  <Image 
                    src={program.image} 
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Badges and tags */}
                  {program.badge && (
                    <span className="absolute top-4 right-4 bg-[#D4AF37] text-[#0A192F] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {program.badge}
                    </span>
                  )}

                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest">{program.subtitle}</span>
                      <h2 className="text-xl font-bold text-white mt-0.5">{program.title}</h2>
                    </div>
                    <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shrink-0">
                      {program.price}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {program.tagline}
                    </p>
                    
                    {/* Details checklist */}
                    <div className="space-y-2.5 pt-2">
                      {program.details.map((detail, index) => (
                        <div key={index} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-gray-700 font-medium leading-snug">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enroll button */}
                  <button 
                    onClick={() => handleOpenModal(program)}
                    className="w-full py-3.5 bg-[#0A192F] hover:bg-[#B8212E] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 group-hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#D4AF37]" />
                    Unlock Enrollment
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Lock Access Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform scale-100 transition-all duration-300 animate-slide-up">
            
            {/* Header Lock Banner */}
            <div className="bg-[#B8212E] px-8 py-8 text-white relative">
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shrink-0 border border-white/20">
                  <Lock className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-white/70">Coaching Program Locked</span>
                  <h3 className="text-2xl font-black">{selectedProgram.title}</h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                  Enrollment in coaching batches is strictly managed directly by the administrator to maintain premium training quality and limited group slots.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Contact Administration to Unlock:</h4>
                
                {/* Contact list options */}
                <div className="grid grid-cols-1 gap-3">
                  
                  {/* WhatsApp Option */}
                  <a 
                    href={`https://wa.me/923342806970?text=${encodeURIComponent(selectedProgram.whatsappText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all group/contact"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Fastest Response</p>
                        <p className="text-sm font-bold text-gray-800">Message on WhatsApp</p>
                      </div>
                    </div>
                    <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg group-hover/contact:scale-103 transition-transform">
                      CHAT NOW
                    </span>
                  </a>

                  {/* Phone Call Option */}
                  <a 
                    href="tel:+923098158572"
                    className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all group/contact"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Direct Voice Support</p>
                        <p className="text-sm font-bold text-gray-800">Call Support Centre</p>
                      </div>
                    </div>
                    <span className="bg-blue-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg group-hover/contact:scale-103 transition-transform">
                      CALL NOW
                    </span>
                  </a>

                  {/* Email Option */}
                  <a 
                    href={`mailto:yasinofficial03098158572@gmail.com?subject=Enrollment%20Request:%20${encodeURIComponent(selectedProgram.title)}&body=${encodeURIComponent(selectedProgram.whatsappText)}`}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group/contact"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-500 flex items-center justify-center text-white">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Official Query</p>
                        <p className="text-sm font-bold text-gray-800">Email Administrator</p>
                      </div>
                    </div>
                    <span className="bg-slate-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg group-hover/contact:scale-103 transition-transform">
                      SEND EMAIL
                    </span>
                  </a>

                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={handleCloseModal}
                  className="text-xs text-gray-400 hover:text-gray-600 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel & Return
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}
