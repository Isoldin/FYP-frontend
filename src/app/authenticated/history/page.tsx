'use client'

import {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import axios from "axios";

interface uploadedImagesData {
    image_id: number,
    uploaded_date: string,
    type_of_disaster: string
}

export default function HistoryPage() {
    const [dataList, setdataList] = useState<uploadedImagesData[]>([])
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [token, setToken] = useState<string | null>(null)


    useEffect(() => {
        const fetchData = async() => {
            try {
                setToken(localStorage.getItem("token"))
                setIsLoading(true)
                const userDetail = await axios.get('http://localhost:8000/auth/detail', {
                    headers: {Authorization: `Bearer ${token}`},
                })

                const response = await axios.get(`http://localhost:8000/pagination/uploaded_image?search_user_id=${userDetail.data.user_id}`, {
                    headers: {Authorization: `Bearer ${token}`}
                })

                setdataList(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }

    const handleViewDetails = (id: number) => {
        router.push(`/authenticated/upload-detail/${id}`)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Upload History</CardTitle>
                <CardDescription>View your past uploads and their status</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Upload Date</TableHead>
                            <TableHead>Possible Type of Disaster</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataList.map((item) => (
                            <TableRow key={item.image_id}>
                                <TableCell>{item.uploaded_date}</TableCell>
                                <TableCell>{item.type_of_disaster}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleViewDetails(item.image_id)}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

