import { Table, ConfigProvider } from "antd";
import axios from "axios";
import { useState, useEffect, useCallback } from 'react'

export default function ViewTable({urls, columns, refresh, resetPage, getCount = () => {}, search = false}) {

  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchUrls = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${urls}${search ? "&" : "?"}page=${page}`)
      setData(response.data.results)
      setTotal(response.data.count)
      getCount(response.data.count)
    } catch (err) {
      if (err.response.data.detail == "Invalid page."){
        setPage(page-1)
      } else {
        console.error(err.response.data)
      }
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    setPage(1)
  }, [resetPage])
  
  useEffect(() => {
    fetchUrls()
  }, [page, refresh, urls, search])

  const totalPage = Math.ceil(total / 10)

  const getPageNumbers = (page, total) => {
    if (total <= 7) {
      return Array.from({length: total}, (_, i) => (i + 1))
    }
    
    if (page <= 4) {
      return [1,2,3,4,5,'next-jump',total]
    }
    if (page >= total - 3) {
      return [1, 'prev-jump',total-4, total-3, total-2, total -1, total]
    }
    return [1, 'prev-jump', page -1, page, page+1, 'next-jump', total]
  }

  const visiblePages = getPageNumbers(page, totalPage);

  return (
    <ConfigProvider 
    theme={{
      components: {
        Table:{
          borderRadius: 16,
          headerBg: '#eff3ff',
          borderColor: '#d4dfff',
          headerSplitColor: '#d4dfff'
          
        }
      }
    }}
    >
    <Table 
    rowKey={"id"}
    columns={columns} 
    dataSource={data}
    pagination={{
      showSizeChanger: false,
      current: page,
      pageSize:10,
      total: total,
      onChange: (newPage) => {
        setPage(newPage)
      },
      itemRender: (page, type, originalElement) => {
        if (type === 'page') {
            return visiblePages.includes(page) ? originalElement : null;
          }
          if (type === 'prev-5') {
            return visiblePages.includes('prev-jump') ? originalElement : null;
          }
          if (type === 'next-5') {
            return visiblePages.includes('next-jump') ? originalElement : null;
          }
          return originalElement
      }
    }}
    loading={loading}

    />
    </ConfigProvider>
  )
}