import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Army & Exam Prep Quizzes - Engineer Yasin',
  description: 'Practice interactive MCQs for PMA Long Course, MDCAT, ECAT, NTS, and CSS. Check your score instantly with our free online preparation tests.',
  openGraph: {
    title: 'Army & Exam Prep Quizzes - Engineer Yasin',
    description: 'Practice interactive MCQs for PMA Long Course, MDCAT, ECAT, NTS, and CSS. Check your score instantly with our free online preparation tests.',
    type: 'website',
  }
}

export default function PrepLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
