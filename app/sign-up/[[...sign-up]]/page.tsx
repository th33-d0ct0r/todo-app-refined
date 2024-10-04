'use client'

import * as React from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Input from '@/components/Input'
import Link from 'next/link'

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [fName, setFName] = React.useState('')
  const [lName, setLName] = React.useState('')
  const [error, setError] = React.useState<string | null>(null);
  const [verifying, setVerifying] = React.useState(false)
  const [code, setCode] = React.useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null);

    if (!isLoaded) return

    try {
      await signUp.create({
        emailAddress,
        password,
        username: fName + lName,
      })

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      setVerifying(true)
    } catch (err: any) {
      setError(err.errors[0].message);
      console.log("me gira hua banda", JSON.stringify(err, null, 2))
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })

        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailAddress,
                clerkId: signUpAttempt.createdUserId,
                name: fName + ' ' + lName,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
                
        router.push('/dashboard')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err: any) {
      console.error('Error:', JSON.stringify(err, null, 2))
    }
  }

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100vh]">
            <h1 className="text-3xl font-bold mb-9 text-[#FF5631]">Verify your email</h1>
            <form onSubmit={handleVerify} className="flex flex-col space-y-4">
          <Input name="Enter verification code" value={code} callback={(e) => setCode(e.target.value)} />
          <button type="submit" className="bg-[#FF5631] text-white p-2 rounded-md">Verify</button>
          </form>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[100vh]">
            <h1 className="text-3xl font-bold mb-2 text-[#FF5631]">Register</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <Input name="First Name" value={fName} callback={(e) => setFName(e.target.value)} />
                <Input name="Last Name" value={lName} callback={(e) => setLName(e.target.value)} />
                <Input name="email" value={emailAddress} callback={(e) => setEmailAddress(e.target.value)} />
                <Input name="password" value={password} callback={(e) => setPassword(e.target.value)} />
                <button type="submit" className="bg-[#FF5631] text-white p-2 rounded-md">Register</button>
                {error && <p className="text-red-500">{error}</p>}
                <p>Already have an account? <Link className="font-bold text-[#FF5631]" href={"/sign-in"}>Login</Link></p>
            </form>
        </div>
    </>
  )
}