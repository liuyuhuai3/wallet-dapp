import * as React from 'react'
import {
    useWaitForTransactionReceipt,
    useWriteContract} from 'wagmi'
import {abi} from './abi'

export function MintNFT() {
    const { 
        data:hash,
        isPending,
        writeContract } = useWriteContract();

    async function submit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const tokenId = formData.get('tokenId') as string;
        writeContract({
            address: '0xd9145CCE52D386f254917e481eB44e9943F39138',
            abi,
            functionName: 'mint',
            args: [parseInt(tokenId)],
        });
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({
            hash,
        });

    return (
        <form onSubmit={submit}>
            <input name="tokenId" placeholder="69420" required />
            <button 
            disabled={isPending}
            type='submit'>
            {isPending ? 'Confirming...' : 'Mint'}
            </button>
            {hash && <div> Transaction Hash:{hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div> Transaction confirmed.</div>}
        </form>
    )
}