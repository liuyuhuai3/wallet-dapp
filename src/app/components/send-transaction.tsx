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
            const to=formData.get('address') as `0x${string}`
            const value=formData.get('value') as string
            sendTransaction({to,value:parseEther(value)})
    }

    const {isLoading:isConfirming,isSuccess:isConfirmed}=
        useWaitForTransactionReceipt({
            hash,
        })

    return(
        <div className="space-y-4">
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        接收地址
                    </label>
                    <input 
                        name="address" 
                        placeholder="0x..." 
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        金额 (ETH)
                    </label>
                    <input 
                        name="value" 
                        placeholder="0.01" 
                        required
                        type="number"
                        step="0.001"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>
                
                <button 
                    disabled={isPending}
                    type="submit"
                    className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                        isPending 
                            ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    {isPending ? '发送中...' : '发送交易'}
                </button>
            </form>

            {/* 交易状态 */}
            {hash && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-900">交易哈希:</p>
                    <p className="text-xs text-blue-700 break-all font-mono">{hash}</p>
                    <a 
                        href={`https://sepolia.etherscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs underline"
                    >
                        在区块链浏览器中查看 →
                    </a>
                </div>
            )}
            
            {isConfirming && (
                <div className="p-3 bg-yellow-50 rounded-md">
                    <p className="text-sm text-yellow-800">⏳ 等待交易确认...</p>
                </div>
            )}
            
            {isConfirmed && (
                <div className="p-3 bg-green-50 rounded-md">
                    <p className="text-sm text-green-800">✅ 交易已确认！</p>
                </div>
            )}
            
            {error && (
                <div className="p-3 bg-red-50 rounded-md">
                    <p className="text-sm font-medium text-red-900">交易失败:</p>
                    <p className="text-xs text-red-700">
                        {(error as BaseError).shortMessage || error.message}
                    </p>
                </div>
            )}
        </div>
    )
}