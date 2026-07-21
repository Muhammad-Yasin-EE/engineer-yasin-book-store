import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ISSB Preparation | Engineer Yasin',
  description:
    'Complete ISSB (Inter Services Selection Board) preparation guide covering all 3 dimensions: Psychological Tests, GTO Tasks, and Deputy President Interview. Tips, techniques, and practice resources for Pakistan Armed Forces candidates.',
  keywords: [
    'ISSB', 'ISSB Pakistan', 'ISSB preparation', 'GTO tasks', 'ISSB psychology',
    'Deputy President interview', 'PMA Long Course ISSB', 'WAT SCT TAT',
    'Group testing officer', 'ISSB guide', 'ISSB tips',
  ],
}

export default function ISSBLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
