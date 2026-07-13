import Link from 'next/link'
import { BookOpen } from 'lucide-react'

interface CategoryCardProps {
  name: string
  count?: number
}

export default function CategoryCard({ name, count }: CategoryCardProps) {
  // Generate a random gradient color based on the string length for distinct looks
  const getGradient = (str: string) => {
    const sum = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = sum % 5;
    const gradients = [
      'from-purple-500/10 to-indigo-500/10 hover:border-purple-500/40 text-purple-400',
      'from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/40 text-emerald-400',
      'from-blue-500/10 to-cyan-500/10 hover:border-blue-500/40 text-blue-400',
      'from-rose-500/10 to-pink-500/10 hover:border-rose-500/40 text-rose-400',
      'from-amber-500/10 to-orange-500/10 hover:border-amber-500/40 text-amber-400'
    ];
    return gradients[index];
  };

  const gradientClass = getGradient(name);

  return (
    <Link 
      href={`/books?category=${encodeURIComponent(name)}`}
      className={`group flex items-center justify-between p-5 bg-gradient-to-r ${gradientClass.split(' hover:')[0]} border border-slate-800/80 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-950/20 hover:bg-slate-900/40 border-r border-b`}
      style={{ borderColor: 'rgba(30, 41, 59, 0.8)' }}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-current group-hover:scale-110 transition-transform`}>
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors text-sm sm:text-base">
            {name}
          </h4>
          <span className="text-[10px] text-slate-500 font-medium font-mono uppercase">
            Browse Category
          </span>
        </div>
      </div>
      
      {count !== undefined && (
        <span className="text-xs font-mono font-bold bg-slate-950/50 px-2.5 py-1 rounded-lg text-slate-400 group-hover:text-white border border-slate-800">
          {count}
        </span>
      )}
    </Link>
  )
}
