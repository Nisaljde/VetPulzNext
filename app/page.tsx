'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PawPrint } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { authenticateUser } from '@/lib/auth'
import { useAuth } from '@/contexts/auth-context'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { toast } = useToast()
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = authenticateUser(email, password)
    
    if (user) {
      login(user)
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name}!`,
      })
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <PawPrint className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Welcome to VetCare</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full" type="submit">Sign In</Button>
            </div>
          </form>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Test credentials:</p>
            <ul className="list-disc list-inside">
              <li>admin@vetcare.com</li>
              <li>doctor@vetcare.com</li>
              <li>staff@vetcare.com</li>
            </ul>
            <p className="mt-1">(Any password will work)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}