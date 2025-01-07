'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"


export default function DashboardPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    // const [token, setToken] = useState<string | null>(null)
    const token = localStorage.getItem('token')


    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const userDetail = await axios.get('http://localhost:8000/auth/detail', {
                    headers: {Authorization: `Bearer ${token}`},
                })
                console.log(userDetail)
                setUsername(userDetail.data.username)
                if (userDetail.data.role == 'admin') {
                    setIsAdmin(true)
                }
            } catch (error) {
                console.log(error)
            }
        }
        loadDashboard();
    }, [token])

    const handleNavigation = (path: string) => {
        router.push(path)
    }

    return (
        <div className="w-full px-4 py-8 relative z-10">
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-purple-700">Welcome to Survivor Radar</CardTitle>
                    <CardDescription>Hello, {username}! We're glad you're here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        Survivor Radar is a powerful tool designed to assist in disaster detection and response.
                        Your role is crucial in our mission to save lives and mitigate the impact of disasters.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            onClick={() => handleNavigation('/authenticated/upload')}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                            Upload New Image
                        </Button>
                        <Button
                            onClick={() => handleNavigation('/authenticated/history')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                            View Upload History
                        </Button>
                        {isAdmin && (
                            <Button
                                onClick={() => handleNavigation('/authenticated/all-uploads')}
                                className="w-full bg-blue-600 hover:bg-blue-700 md:col-span-2"
                            >
                                Manage All Uploads
                            </Button>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-gray-600">
                        Remember, your contributions help us respond faster and more effectively to disasters.
                        Thank you for being part of Survivor Radar.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

