import {type Abi} from 'abitype';

export const wagmiContractConfig={
    address:`0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2` as `0x${string}`,
    abi:[
        //函数描述
        {
            type:'function',
            name:'balanceOf',
            stateMutability:'view',
            inputs:[{name:'account',type:'address'}],
            outputs:[{type:'uint256'}],
        },
        //调用描述
        {
            type:'function',
            name:'totalSupply',
            stateMutability:'view',
            inputs:[],
            outputs:[{name:'supply',type:'uint256'}],
        },
        {
            type: 'function',
            name: 'ownerOf',
            stateMutability: 'view',
            inputs: [{ name: 'tokenId', type: 'uint256' }],
            outputs: [{ type: 'address' }],
        },
    ]as const satisfies Abi,
} ;