import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Trophy, Clock, Medal, Award, ChevronLeft, Target } from 'lucide-react'

export const revalidate = 0

export default async function LeaderboardPage() {
  const supabase = await createClient()

  let topScores: any[] = []
  let errorMsg = null

  try {
    const { data, error } = await supabase
      .from('user_scores')
      .select('*, profiles(name, avatar_url), quizzes!fk_user_scores_quizzes(title)')
      .order('percentage', { ascending: false })
      .order('time_taken_seconds', { ascending: true })
      .limit(50)

    if (error) throw error
    topScores = data || []
  } catch (err: any) {
    console.error('Leaderboard fetch error:', err)
    errorMsg = 'Could not load leaderboard data. Please try again later.'
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow bg-white text-gray-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-150 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            Global Rankings
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
            Quiz Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Top performing candidates across all mock exams and tests.
          </p>
        </div>
        <Link 
          href="/account"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:text-[#B8212E] hover:border-[#B8212E]/30 transition-colors bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="mt-8">
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-none mb-6">
            {errorMsg}
          </div>
        )}

        {topScores.length === 0 && !errorMsg ? (
          <div className="py-20 bg-gray-50 border border-gray-200 rounded-none flex flex-col items-center justify-center text-gray-400 text-center">
            <Target className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-700">No Scores Recorded</h3>
            <p className="text-xs text-gray-400 max-w-sm mt-1">Be the first to take a mock exam and claim the top spot!</p>
            <Link href="/prep" className="mt-4 px-6 py-2 bg-[#B8212E] hover:bg-[#D62636] text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm transition-all">
              Go to Prep Hub
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-500 font-extrabold">
                    <th className="px-6 py-4 w-16 text-center">Rank</th>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Subject / Quiz</th>
                    <th className="px-6 py-4 text-center">Score</th>
                    <th className="px-6 py-4 text-right">Time Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topScores.map((score, index) => {
                    const isTop3 = index < 3;
                    const rankColor = 
                      index === 0 ? 'text-amber-500 bg-amber-50 border border-amber-200' :
                      index === 1 ? 'text-slate-400 bg-slate-50 border border-slate-200' :
                      index === 2 ? 'text-orange-700 bg-orange-50 border border-orange-200' : 
                      'text-gray-500 font-semibold';

                    return (
                      <tr key={score.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${rankColor}`}>
                            {index === 0 ? <Trophy className="w-4 h-4" /> : 
                             index === 1 ? <Medal className="w-4 h-4" /> : 
                             index === 2 ? <Award className="w-4 h-4" /> : 
                             `#${index + 1}`}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                              {score.profiles?.avatar_url ? (
                                <img src={score.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                                  {(score.profiles?.name?.[0] || 'A')}
                                </div>
                              )}
                            </div>
                            <span className={`text-xs font-bold ${isTop3 ? 'text-gray-900' : 'text-gray-700'}`}>
                              {score.profiles?.name || 'Anonymous Candidate'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                          {score.quizzes?.title || 'Unknown Exam'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-black ${
                            score.percentage >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                            score.percentage >= 50 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                            'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {score.percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-gray-500 font-mono">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {Math.floor(score.time_taken_seconds / 60)}m {score.time_taken_seconds % 60}s
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
