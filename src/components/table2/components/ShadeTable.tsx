import * as React from 'react'

import { cn } from '@src/lib/utils'

/**
 * 重写shade ui，调整ref
 */
const ShadeTable = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className="relative w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
)
ShadeTable.displayName = 'Table'

export default ShadeTable
