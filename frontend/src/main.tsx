import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { CHAIN_CONFIG } from './contracts/config'
import App from './App.tsx'
import './index.css'

const arcChain = {
  id: CHAIN_CONFIG.id,
  name: CHAIN_CONFIG.name,
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [CHAIN_CONFIG.rpc] },
  },
} as const;

const config = getDefaultConfig({
  appName: 'AgentMesh',
  projectId: 'YOUR_PROJECT_ID', // Usually this would be an env var
  chains: [arcChain],
  transports: {
    [arcChain.id]: http(),
  },
});

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#00f2ff',
          accentColorForeground: 'black',
          borderRadius: 'none',
          fontStack: 'system',
        })}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)

