'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import axios from "axios";

export default function AuthenticatedLayout({
                                                children,
                                            }: {
    children: React.ReactNode
}) {
    const [isAdmin, setIsAdmin] = useState(false)
    const pathname = usePathname()
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const loadLayout = async() => {
            try {
                 setToken(localStorage.getItem('token'))

                const userDetail = await axios.get(await axios.get('http://localhost:8000/auth/detail', {
                    headers: {Authorization: `Bearer ${token}`},
                }))

                if (userDetail.data.role == 'admin') {
                    setIsAdmin(true)
                }
            } catch (error) {
                console.log(error)
            }

        }
        loadLayout()
    }, [token])

    const menuItems = [
        { title: 'Dashboard', path: '/authenticated/dashboard', icon: '🏠' },
        { title: 'Upload Image', path: '/authenticated/upload', icon: '📷' },
        { title: 'History', path: '/authenticated/history', icon: '📅' },
        ...(isAdmin ? [{ title: 'All Uploads', path: '/authenticated/all-uploads', icon: '🖼️' }] : []),
        { title: 'Logout', path: '/', icon: '🚪' },
    ]

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-gray-100">
                <Sidebar>
                    <SidebarHeader>
                        <h2 className="text-xl font-bold text-purple-700 p-4">Survivor Radar</h2>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {menuItems.filter(item => item.title !== 'Logout').map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={pathname === item.path}>
                                                <Link href={item.path}>
                                                    <span className="mr-2">{item.icon}</span>
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <div className="mt-auto">
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/">
                                                <span className="mr-2">🚪</span>
                                                <span>Logout</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </div>
                    <SidebarRail />
                </Sidebar>
                <main className="flex-1 p-6 overflow-auto w-full">
                    <SidebarTrigger className="mb-4" />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}

