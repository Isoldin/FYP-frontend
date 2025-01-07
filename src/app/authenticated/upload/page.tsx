'use client'

import {useState, useRef, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import axios from "axios";

export default function UploadPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    // const [token, setToken] = useState<string | null>(null)
    const token = localStorage.getItem('token')


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.type != "image/jpeg" && file.type != "image/png") {
                alert("Please upload an image file of jpeg or png!")
                return
            }
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        // setToken(sessionStorage.getItem('token'))
    },[])

    const handleUpload = async () => {
        if (selectedFile) {
            setIsUploading(true)

            try {
                //uploading image to storage system
                const fileData = new FormData();
                fileData.append('file', selectedFile);
                const imgName = await axios.post('http://localhost:8000/upload/upload',
                    fileData, { headers: {
                        Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data'
                    }
                });

                //perform disaster prediction
                const disasterPredictionResult = await axios.post(`http://localhost:8000/prediction/predict_disaster?img_name=${imgName.data.file_name}`,
                    { headers: {
                        Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'
                    }
                });

                //perform human detection
                await axios.post(`http://localhost:8000/prediction/detect_human?img_name=${imgName.data.file_name}`,
                    { headers: {
                        Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'
                    }
                });

                //grabbing current location of user
                const geolocationPromise = new Promise((resolve, reject) => {
                    if (!navigator.geolocation) {
                        alert("Geolocation is not supported by your browser");
                        return reject(new Error("Geolocation not supported"));
                    }

                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            });
                        },
                        (err) => {
                            console.error(err);
                            reject(err);
                        }
                    );
                });

                const location = await geolocationPromise;

                //compiling all data and save to database
                const uploadForm = {
                    'img_name': imgName.data.file_name,
                    'geolocation': location,
                    'type_of_disaster': disasterPredictionResult.data.predicted_class,
                }

                const response = await axios.post('http://localhost:8000/upload/save_to_db',
                    uploadForm, { headers : {
                        Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'
                    }
                });

                setIsUploading(false)
                alert("Done")
                router.push(`/authenticated/upload-detail/${response.data.image_id}`)
            } catch (error) {
                setIsUploading(false)
                console.log(error)
            }
        }
    }

    const handleCapture = () => {
        fileInputRef.current?.click()
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>Upload an image or capture one with your device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-center">
                    {previewUrl && (
                        <Image src={previewUrl} alt="Preview" width={400} height={300} className="max-w-full h-auto" />
                    )}
                </div>
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                />
                <Button onClick={handleCapture} className="w-full">
                    {previewUrl ? 'Retake Image' : 'Capture Image'}
                </Button>
            </CardContent>
            <CardFooter>
                <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full bg-purple-600 hover:bg-purple-700">
                    {isUploading ? 'Processing...' : 'Upload Image'}
                </Button>
            </CardFooter>
            <Dialog open={isUploading}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Processing Your Image</DialogTitle>
                        <DialogDescription>
                            Please wait while we analyze your image. This may take a few moments.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center items-center h-24">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

