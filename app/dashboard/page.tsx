"use client"
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

async function GetUser(clerkId: string) {
    try {
        const response = await fetch('/api/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clerkId }),
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error(error);
    }
}

export default function Dashboard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    
    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    const mongoUser = GetUser(user?.id || '');
    console.log(user);
    console.log("This is mongo user", mongoUser);
    return (
        <div>
            Hello {mongoUser?.name} welcome to Clerk
        </div>
    );
}