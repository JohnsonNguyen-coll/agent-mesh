import { createPublicClient, http, formatUnits } from 'viem';
import { CONTRACTS, CHAIN_CONFIG, AGENT_REGISTRY_ABI, REPUTATION_ENGINE_ABI } from '../contracts/config';

export const publicClient = createPublicClient({
  chain: {
    id: CHAIN_CONFIG.id,
    name: CHAIN_CONFIG.name,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: [CHAIN_CONFIG.rpc] },
      public: { http: [CHAIN_CONFIG.rpc] },
    },
  },
  transport: http(),
});

export const getAgents = async () => {
  try {
    // Check if contract has code
    const code = await publicClient.getBytecode({
      address: CONTRACTS.AGENT_REGISTRY as `0x${string}`
    });
    
    if (!code || code === '0x') {
      console.error('CRITICAL: No contract code found at address:', CONTRACTS.AGENT_REGISTRY);
      return [];
    }

    const agents = await (publicClient as any).readContract({
      address: CONTRACTS.AGENT_REGISTRY as `0x${string}`,
      abi: AGENT_REGISTRY_ABI,
      functionName: 'listAgents',
      args: [0n, 100n],
    } as any) as any[];

    const agentsWithScores = await Promise.all(
      agents.map(async (agent: any, index: number) => {
        let score = 0n;
        try {
          score = await (publicClient as any).readContract({
            address: CONTRACTS.REPUTATION_ENGINE as `0x${string}`,
            abi: REPUTATION_ENGINE_ABI,
            functionName: 'getScore',
            args: [BigInt(index + 1)],
          }) as bigint;
        } catch (e) {
          console.warn(`Reputation not found for agent ${index + 1}, using default 0`);
        }
        
        return {
          id: (index + 1).toString(),
          ...agent,
          reputation: Number(score) / 100,
          price: formatUnits(agent.pricePerCall, 6) + ' USDC',
          status: agent.active ? 'Active' : 'Inactive'
        };
      })
    );

    return agentsWithScores;
  } catch (error) {
    console.error('Error fetching agents from blockchain:', error);
    return [];
  }
};

export const getAgentDetails = async (id: string) => {
  try {
    const agent = await (publicClient as any).readContract({
      address: CONTRACTS.AGENT_REGISTRY as `0x${string}`,
      abi: AGENT_REGISTRY_ABI,
      functionName: 'getAgent',
      args: [BigInt(id)],
    } as any) as any;

    const score = await (publicClient as any).readContract({
      address: CONTRACTS.REPUTATION_ENGINE as `0x${string}`,
      abi: REPUTATION_ENGINE_ABI,
      functionName: 'getScore',
      args: [BigInt(id)],
    } as any) as bigint;

    return {
      ...agent,
      reputation: Number(score) / 100,
      price: formatUnits(agent.pricePerCall, 6) + ' USDC',
      status: agent.active ? 'Active' : 'Inactive'
    };
  } catch (error) {
    console.error('Error fetching agent details:', error);
    return null;
  }
};
