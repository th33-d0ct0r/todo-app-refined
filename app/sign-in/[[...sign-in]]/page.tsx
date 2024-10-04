'use client'

import * as React from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Input from '@/components/Input'
import Link from 'next/link'
import { PacmanLoader } from 'react-spinners'

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null);
    setLoading(true);

    try {
      //@ts-ignore
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      })

      if (signInAttempt.status === 'complete') {
        // @ts-ignore
        await setActive({ session: signInAttempt.createdSessionId })
        router.push('/dashboard')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      setError(err.errors[0].message);
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
      return (
          <div className="flex flex-col w-[100%] h-[100vh] items-center justify-center">
              <PacmanLoader className="justify-center items-center" color='#FF5631' />
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh]">
            <h1 className="text-3xl font-bold mb-2 text-[#FF5631]">Login</h1>
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
                <button type="submit" className="bg-[#FF5631] text-white p-2 rounded-md">
                    Login
                </button>
                {error && <p className="text-red-500">{error}</p>}
                <p>
                    Don&#39;t have an account?
                    <Link className="font-bold text-[#FF5631]" href={"/sign-up"}>
                    &nbsp;Register
                    </Link>
                </p>
            </form>
        </div>
  )
}