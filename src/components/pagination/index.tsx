import {
  PaginationWrapper,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PageSizeSelect,
  QuickJumper,
  PageTotalInfo
} from "./Components"


interface PaginationProps {
  pageNo: number
  pageSize: number
  showQuickJumper: boolean
  showTotal: boolean
  total: number
  pageSizeOptions: number[] | null
  simple?: boolean
  onlyPreAndNext?: boolean
  disabled?: boolean
  defaultPageNo: number
  defaultPageSize: number
  /**
   * 最多显示的页码数量，除去 前进/后退 item
   */
  maxItem?: number
  onChange: (pageNo: number, pageSize: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  pageNo,
  pageSize,
  total
}) => {
  const isActive = false
  const size = 'icon'

  return (
    <PaginationWrapper>
      <PaginationContent>
        <PaginationItem>
          <PageTotalInfo />
        </PaginationItem>
        <PaginationItem>
          <PageSizeSelect />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">122</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
        <PaginationItem>
          <QuickJumper />
        </PaginationItem>
      </PaginationContent>
  </PaginationWrapper>
  )
}

export default Pagination
