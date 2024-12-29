/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSetState } from "ahooks"
import { useRef, useState } from "react"

const usePagination = (service: (v: any) => Promise<any>, { defaultPageSize = 20, defaultPageNo = 1 }: any = {}) => {
  const [pageInfo, setPageInfo] = useSetState({
    pageNo: defaultPageNo,
    pageSize: defaultPageSize,
    total: 0
  })
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>()
  const requestNumRef = useRef(0)

  const onPageChange = async (pageSize: number, pageNo: number) => {
    try {
      // 确保最后返回的数据
      requestNumRef.current += 1
      const preFlagNum = requestNumRef.current
      setLoading(true)
      const { page, data } = await service({ pageSize, pageNo })
      if (preFlagNum !== requestNumRef.current) {
        return
      }
      setPageInfo({ pageSize, pageNo, total: page.total })
      setData(data)
    } catch (error) {
      console.log('usePagintion fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    pagination: {
      ...pageInfo,
      onchange: onPageChange
    },
    data
  }
}

export default usePagination
