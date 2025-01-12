import InteralPagination from './Pagination'
import usePagination from './usePagination'
export { type PaginationProps } from './Pagination'

export type TPagination = typeof InteralPagination & {
  usePagination: typeof usePagination
}

const Pagination = InteralPagination as TPagination
Pagination.usePagination = usePagination

export default Pagination
