'use client'
import {ChangeEvent} from "react";

type InputProps = {
    name: string,
    classes?: string,
    callback?: (e: ChangeEvent<HTMLInputElement>) => void,
    value?: string
}

export default function Input(props: InputProps) {
    return (
        <>
            <label htmlFor={props.name} className="capitalize">{props.name}</label>
            <input value={props.value} type={props.name} name={props.name} id={props.name} placeholder={props.name}
                   className={`border-2 border-gray-300 rounded-md p-2 bg-transparent outline-0 ${props.classes}`} onChange={props.callback}/>
        </>
    );
}