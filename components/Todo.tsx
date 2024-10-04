import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


type TodoProps = {
    todo: {
        completed: boolean;
        createdAt: string;
        todo: string;
    };
    clerkId: string;
};

async function handleDelete(clerkId: string, createdAt: string) {
    const notyf = new Notyf();
    try {
        const response = await fetch('/api/deleteTodo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clerkId, createdAt }),
        });

        const data = await response.json();
        console.log("This is data: ", data);
        notyf.success(data.message);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function completeTodo(clerkId: string, createdAt: string) {
    const notyf = new Notyf();
    try {
        const response = await fetch('/api/completeTodo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clerkId, createdAt }),
        });

        const data = await response.json();
        console.log("This is data: ", data);
        notyf.success(data.message);
    } catch (error) {
        console.error('Error:', error);
    }
}

export default function Todo({ todo, clerkId }: TodoProps) {
    console.log("This is todo: ", todo);
    return (
        <div className="w-[100%] h-[9vh] border-2 border-[#565046] flex flex-row bg-[#1E1E1E] rounded-lg pl-7 pr-7 items-center justify-between">
            <div className="flex flex-row items-center justify-center gap-[0.75vw]">
                {todo.completed ? (
                    <div className="rounded-full bg-[#16e16e] w-[2vw] aspect-square cursor-pointer" />
                ) : (
                    <div onClick={() => completeTodo(clerkId, todo.createdAt)} className="rounded-full border-[#FF5631] border-2 w-[2vw] aspect-square cursor-pointer" />
                )}
                {todo.completed ? (
                    <h1 className="text-xl font-semibold text-[#D1C0A5] line-through">{todo.todo}</h1>
                ) : (
                    <h1 className="text-xl font-semibold text-[#D1C0A5]">{todo.todo}</h1>
                )}
            </div>
            <div className="flex flex-row gap-[0.75vw]">
                <FontAwesomeIcon onClick={() => handleDelete(clerkId, todo.createdAt)} className="text-[#D1C0A5] text-xl cursor-pointer" icon={faTrashCan} />
            </div>
        </div>
    );
}