"use client"
import { FormEvent, useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Todo from '@/components/Todo';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { PacmanLoader } from 'react-spinners';

interface Todo {
    completed: boolean;
    createdAt: string;
    todo: string;
}

interface User {
    name: string;
    email: string;
    todos: object[];
    clerkId: string;
}

async function fetchUser(clerkId: string): Promise<User | null> {
    try {
        const response = await fetch('/api/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clerkId }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.user;
        } else {
            console.error('Failed to fetch user data');
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default function Dashboard() {
    const { isLoaded, user } = useUser();
    const [mongoUser, setMongoUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [todo, setTodo] = useState('')
    const [todos, setTodos] = useState<Todo[]>([]);
    const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
    const notyf = new Notyf();
    const { signOut } = useClerk()

    useEffect(() => {
        if (!isLoaded) return;

        const getUserData = async () => {
            setLoading(true);
            setError(null);

            try {
                const userData = await fetchUser(user?.id || '');
                setMongoUser(userData);
                if (userData) {
                    setTodos(userData.todos as Todo[]);
                }
                if (userData) {
                    for (let i = 0; i < userData.todos.length; i++) {
                        // @ts-ignore
                        if (userData.todos[i].completed) {
                            setCompletedTodos((prev) => [...prev, userData.todos[i] as Todo]);
                        }
                    }
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        getUserData();
    }, [isLoaded, user]);

    if (!isLoaded) {
        return (
            <div className="flex flex-col w-[100%] h-[100vh] items-center justify-center">
                <PacmanLoader className="justify-center items-center" color='#FF5631' />
            </div>
    );
    }
    
    if (loading) {
        return( 
            <div className="flex flex-col w-[100%] h-[100vh] items-center justify-center">
                <PacmanLoader className="justify-center items-center" color='#FF5631' />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const email = mongoUser?.email || ''
        const res = await fetch('/api/addTodo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, todo }),
        });

        const data = await res.json();

        if (res.ok) {
            notyf.success('Todo added successfully');
        } else {
            notyf.error(data.message || 'An error occurred while adding todo');
        }

    }
    console.log(todos)
    return (
        <div>
            <div className="flex flex-row w-[100%] justify-between items-center">
                <h1 className="mt-10 ml-8 text-3xl font-bold">Hello, <span className="text-[#FF5631]">{mongoUser?.name}!</span></h1>
                <button onClick={() => signOut()} className="mt-5 mr-8 bg-[#FF5631] text-black font-semibold rounded-full py-2 px-4">Sign Out</button>
            </div>

            <div className="flex flex-col items-center justify-center w-100 mt-10">
                {/* Todo completed box */}
                <div className="flex flex-row w-[30vw] h-[30vh] border-[2px] border-[#565046] items-center justify-center gap-[5vw] rounded-[30px]">
                    <div className="">
                        <h1 className="text-4xl font-extrabold text-[#D1C0A5]">Todo Done</h1>
                        <p className="font-thin text-xl text-[#D1C0A5]">keep it up</p>
                    </div>
                    <div className="w-[8vw] aspect-square rounded-full bg-[#FF5631] flex flex-col items-center justify-center">
                        <h1 className="text-4xl font-black text-black">{completedTodos.length}/{todos.length}</h1>
                    </div>
                </div>

                {/* Bar */}

                <form className="flex flex-row w-[30vw] items-center justify-center gap-7 mt-7" onSubmit={handleSubmit}>
                    <input onChange={(e) => setTodo(e.target.value)} type="text" placeholder="write your todo here" className="w-[85%] h-[7vh] bg-[#1E1E1E] outline-none pl-4 rounded-2xl text-lg text-[#D1C0A5] placeholder-[#A19480]" />
                    <button className="w-[10%] aspect-square bg-[#FF5631] text-black text-2xl font-extrabold rounded-full">+</button>
                </form>

                {/* Todos */}

                <div className="w-[30vw] flex flex-col items-center justify-center mt-7 mb-7 gap-3">
                    {todos.map((todo, index) => (
                        todo && <Todo key={index} todo={todo} clerkId={mongoUser?.clerkId || ''} />
                    ))}
                </div>

            </div>
        </div>
    );
}