'use client'

import {useState} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation'
import axios from "axios"

export default function WelcomePage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const loginFormData = {
        'username': username,
        'password': password,
      }

      const loginResponse = await axios.post('http://localhost:8000/auth/token', loginFormData,
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          });

      axios.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.access_token}`;

      localStorage.setItem('token', loginResponse.data.access_token);
      sessionStorage.setItem('token', loginResponse.data.access_token);

      setUsername('');
      setPassword('');
      router.push("/authenticated/dashboard")

    } catch (error) {
      alert(error)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    try {
      const registerUserForm = {
        'username': username,
        'password': password,
      }

      await axios.post('http://localhost:8000/auth/register', registerUserForm, {
        headers: {'Content-Type': 'application/json'},
      })

      const loginResponse = await axios.post('http://localhost:8000/auth/token', registerUserForm,
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          });

      axios.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.access_token}`;

      localStorage.setItem('token', loginResponse.data.access_token);
      sessionStorage.setItem('token', loginResponse.data.access_token);

      setUsername('');
      setPassword('');
      setConfirmPassword('');

      router.push("/authenticated/dashboard")

    } catch (error) {
      alert(error)
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-purple-700">Welcome to Survivor Radar</CardTitle>
            <CardDescription className="text-center">Login or create an account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Login</Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleRegister}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reg-username">Username</Label>
                      <Input id="reg-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="reg-password">Password</Label>
                      <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Register</Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-center w-full">
              By logging in or registering, you agree to our <a href="/terms-and-conditions" className="text-purple-600 hover:underline">Terms and Conditions</a>.
            </p>
          </CardFooter>
        </Card>
      </div>
  )
}

