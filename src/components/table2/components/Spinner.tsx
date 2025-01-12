import { cn } from '@src/lib/utils'
import { FC } from 'react'

interface SpinnerProps {
  loading?: boolean
  children: React.ReactNode
}

const Spinner: FC<SpinnerProps> = ({ children, loading }) => (
  <div className={cn('block', !!loading ? 'relative' : undefined)}>
    {children}
    {!!loading && (
      <div className="absolute z-50 w-full h-full opacity-30 left-0 top-0 text-center pt-60 bg-slate-500">
        <span className="text-white">loading...</span>
      </div>
    )}
  </div>
)

export default Spinner
