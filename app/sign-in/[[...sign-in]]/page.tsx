'use client'

import * as React from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Input from '@/components/Input'
import Link from 'next/link'

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.push('/dashboard')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh]">
            <h1 className="text-3xl font-bold mb-2">Login</h1>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                <Input
                    name="email"
                    value={email}
                    callback={(e) => setEmail(e.target.value)}
                />
                <Input
                    name="password"
                    value={password}
                    callback={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="bg-green-600 text-white p-2 rounded-md">
                    Login
                </button>
                <p>
                    Don&#39;t have an account?
                    <Link className="font-bold text-green-500" href={"/register"}>
                        Register
                    </Link>
                </p>
            </form>
        </div>
  )
}