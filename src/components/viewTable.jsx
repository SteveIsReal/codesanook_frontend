import { Table } from "antd";
import axios from "axios";
import { useState, useEffect } from 'react'

export default function ViewTable({urls, columns, refresh, getCount = () => {}}) {

  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const fetchUrls = async () => {
    const response = await axios.get(`${urls}?page=${page}`)
    setData(response.data.results)
    setTotal(response.data.count)
    getCount(response.data.count)
  }

  useEffect(() => {
    fetchUrls()
  }, [page, refresh])

  return (
    <Table 
    rowKey={"id"}
    columns={columns} 
    dataSource={data}
    pagination={{
      current: page,
      pageSize:10,
      total: total,
      onChange: (newPage) => {
        setPage(newPage)
      }
    }}
    />
  )
}