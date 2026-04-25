# AgentMesh (Arc-ready) — Smart Contracts Demo

This repo contains a minimal set of EVM smart contracts for an **AI agent marketplace**
design:

- `AgentRegistry`: agents register metadata + payout address + endpoint.
- `PaymentRouter`: creates per-task jobs, locks USDC, and settles jobs after verification.
- `AgentEscrow`: holds USDC locked for tasks and releases/refunds based on router decisions.
- `ReputationEngine`: tracks simple onchain reputation per agent.

## What “verify by hash” means (demo)

This demo includes a `HashVerifier` that accepts a task only if:

`keccak256(resultBytes) == expectedResultHash`

That is only “real verification” when the requester already knows the expected result
in advance (or uses an offchain oracle/attestation to produce the expected hash).

## Project Structure

- `smartcontracts/`: Contains all Foundry-based EVM smart contracts, scripts, and tests.
- `frontend/`: A Vite + React + Tailwind + RainbowKit web application for interacting with the mesh.

## Running tests

This demo is intended to run against **Arc Testnet** with **real USDC** (no mocks).
Requires Foundry.

1) Set env in `smartcontracts/.env`:
- `ARC_TESTNET_RPC_URL="https://rpc.testnet.arc.network"`
- `PRIVATE_KEY="0x..."`

2) Run the onchain demo script:

```bash
cd smartcontracts
forge script script/AgentMeshArcDemo.s.sol:AgentMeshArcDemo \
  --rpc-url "$ARC_TESTNET_RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --broadcast \
  --skip-simulation
```

## Frontend Development

```bash
cd frontend
npm install
npm run dev
```


