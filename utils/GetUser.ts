export default async function GetUser(clerkId: string) {
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