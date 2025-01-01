import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import type { SelectProps } from "@radix-ui/react-select"

interface PageSizeSelectProps extends Omit<SelectProps, 'onValueChange' | 'value'>{
  onChange: (v: number) => void
  options: Array<number | string>
  value: number | string
}

/**
 * 包裹器
 */
export const PaginationWrapper = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size" | "disabled"> &
  React.ComponentProps<"a">

export const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  disabled,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      'cursor-pointer',
      disabled ? 'pointer-events-none opacity-50' : '',
      className
    )}
    {...props}
  />
)

export const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)

export const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)

export const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)

/**
 * 页数选择器
 */
export const PageSizeSelect: React.FC<PageSizeSelectProps> = ({ disabled, onChange, value, options, ...restProps }) => {
  return (<div className="flex items-center gap-2">
      <p className="text-sm font-medium">每页多少条</p>
      <Select
        value={value + ''}
        onValueChange={(value) => {
          onChange(Number(value))
        }}
        disabled={disabled}
        {...restProps}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent side="top">
          {options.map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
  </div>)
}

/**
 * 快速跳转
 */
export const QuickJumper: React.FC<{ disabled?: boolean, onChange: (pageNo: number) => void }> = ({ disabled, onChange }) => {
  const [value, setValue] = React.useState<string | number>('')

  return (
    <div className="flex items-center gap-2">
      <span className="text-nowrap">跳转至</span>
      <Input onChange={(e) => {
        const v = e.target.value.replace(/[^0-9]/g, '')
        setValue(v)
      }} value={value} onBlur={() => {
        if (value) {
          onChange(Number(value))
          setValue('')
        }
      }} onKeyDown={(e) => {
        if (e.key === 'Enter' && value) {
          onChange(Number(value))
          setValue('')
        }
      }} disabled={disabled} className="w-[60px] h-[32px]" />
      <span>页</span>
    </div>
  )
}

export const PageTotalInfo: React.FC<{
  total: number
  pageNo: number
  pageSize: number
}> = ({ total, pageNo, pageSize }) => {
  const minDataCount = (pageNo - 1) * pageSize
  const maxDataCount = (minDataCount + pageSize) < total ? (minDataCount + pageSize) : total
  return (
    <div>
      总共{total}条数据，当前是{minDataCount}-{maxDataCount}条数据
    </div>
  )
}