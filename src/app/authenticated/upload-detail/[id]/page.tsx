'use client'

import { useState, useEffect } from 'react'
import {useParams} from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface UploadDetails {
    image_id: string
    img_name: string
    geolocation: { "longitude": number; "latitude": number }
    type_of_disaster: string
    uploaded_by: string
    uploaded_date: string
}

export default function UploadDetailsPage() {
    const { id } = useParams()
    const [details, setDetails] = useState<UploadDetails | null>(null)
    const [oriImgUrl, setOriImgUrl] = useState('')
    const [processedImgUrl, setProcessedImgUrl] = useState('')
    // const [token, setToken] = useState<string | null>(null)
    const token = localStorage.getItem('token')

    useEffect(() => {
        // setToken(sessionStorage.getItem('token'))
        const fetchDetails = async () => {
            if (!token) {
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8000/upload/detail?id=${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setDetails(response.data)

                setOriImgUrl(`http://localhost:8000/uploads/${response.data.img_name}`)

                setProcessedImgUrl(`http://localhost:8000/prediction_results/${response.data.img_name}`)
            } catch (error) {
                console.error(error)
            }
        }
        fetchDetails()
    }, [id, token])

    if (!details) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Original Image</h3>
                            <Image src={oriImgUrl} alt="Original" width={1000} height={900} className="rounded-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Processed Image</h3>
                            <Image src={processedImgUrl} alt="Processed" width={1000} height={900} className="rounded-lg" />
                        </div>
                    </div>
                    <div className="h-64 rounded-lg overflow-hidden">
                        <MapContainer center={[details.geolocation.latitude, details.geolocation.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[details.geolocation.latitude, details.geolocation.longitude]}>
                                <Popup>
                                    Disaster location
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">Disaster Type</h3>
                            <p>{details.type_of_disaster}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Uploaded By</h3>
                            <p>{details.uploaded_by}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Uploaded On</h3>
                            <p>{details.uploaded_date}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Location</h3>
                            <p>Longitude: {details.geolocation.longitude}, Latitude: {details.geolocation.latitude}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

