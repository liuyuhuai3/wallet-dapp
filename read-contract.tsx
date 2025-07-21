import { type BaseError, useReadContracts } from 'wagmi'
import { wagmiContractConfig } from './contracts'

function ReadContract() {
  const { 
    data,
    error,
    isPending
  } = useReadContracts({ 
    contracts: [{ 
      ...wagmiContractConfig,
      functionName: 'balanceOf',
      args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
    }, { 
      ...wagmiContractConfig, 
      functionName: 'ownerOf', 
      args: [69n], 
    }, { 
      ...wagmiContractConfig, 
      functionName: 'totalSupply', 
    }] 
  }) 
  const [balance, ownerOf, totalSupply] = data || [] 

  if (isPending) return <div>Loading...</div>

  if (error)
    return (
      <div>
        Error: {(error as BaseError).shortMessage || error.message}
      </div>
    ) 

  return (
    <>
      <div>Balance: {balance?.toString()}</div>
      <div>Owner of Token 69: {ownerOf?.toString()}</div> 
      <div>Total Supply: {totalSupply?.toString()}</div> 
    </>
  )
}