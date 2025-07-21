import * as React from 'react'
import {
    useSendTransaction,
    useWaitForTransactionReceipt,
    type BaseError} from 'wagmi'
import {parseEther} from 'viem'


export function SendTransaction(){
    const {data:hash,
        error,
        isPending,
        sendTransaction} = useSendTransaction()

    async function submit(e: React.FormEvent<HTMLFormElement>){
            e.preventDefault()
            const formData=new FormData(e.target as HTMLFormElement)
            const to=formData.get('address') as `0x&{string}`
            const value=formData.get('value') as string
            sendTransaction({to,value:parseEther(value)})
    }

    const {isLoading:isConfirming,isSuccess:isConfirmed}=
        useWaitForTransactionReceipt({
            hash,
        })

    return(
        <form onSubmit={submit}>
            <input name="address" placeholder = " " required />
            <input name="value" placeholder="0.05" required />
            <button 
            disabled={isPending}
            type = "submit">
            Send
            {isPending?`Confirming...`:`Send`}
            </button>
            {hash && <div> Transaction Hash:{hash}</div>}
            {isConfirmed && <div> Waiting for confirmation...</div>}
            {isConfirmed && <div> Transaction confirmed.</div>}
            {error&&(
                <div>Error:{(error as BaseError).shortMessage || error.message}</div>
            )}
        </form>
    )
}