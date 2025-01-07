import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsAndConditionsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-purple-700">Terms and Conditions</CardTitle>
                    <CardDescription className="text-center">Please read these terms carefully before using Survivor Radar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
                    <p>
                        By using Survivor Radar, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.
                    </p>

                    <h2 className="text-xl font-semibold">2. Use of Uploaded Images</h2>
                    <p>
                        By uploading images to Survivor Radar, you grant us permission to store, process, and use these images for the purpose of disaster detection and survivor location. You understand and agree that:
                    </p>
                    <ul className="list-disc list-inside">
                        <li>Your uploaded images will be saved in our system for future use and analysis.</li>
                        <li>We may use your images to improve our disaster detection algorithms and services.</li>
                        <li>Your images may be viewed by authorized personnel for the purpose of disaster response and management.</li>
                    </ul>

                    <h2 className="text-xl font-semibold">3. Privacy and Data Protection</h2>
                    <p>
                        We are committed to protecting your privacy. Please refer to our Privacy Policy for details on how we collect, use, and protect your personal information.
                    </p>

                    <h2 className="text-xl font-semibold">4. Limitation of Liability</h2>
                    <p>
                        Survivor Radar is provided "as is" without any warranties, expressed or implied. We do not guarantee the accuracy or reliability of disaster detection results.
                    </p>

                    <h2 className="text-xl font-semibold">5. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these terms at any time. Your continued use of Survivor Radar after changes are made constitutes your acceptance of the new terms.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

