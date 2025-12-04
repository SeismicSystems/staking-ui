import { createConfig } from "ponder";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { depositContractAbi } from "./abis/DepositContractAbi";
import { Address } from "viem";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

const DEPOSIT_CONTRACT_ADDRESS: Address =
  "0x00000000219ab540356cBB839Cbe05303d7705Fa";

console.log("rpc url", process.env.VITE_RPC_URL);

export default createConfig({
  chains: {
    seismic: {
      // TODO: decide on better naming
      id: 5124,
      rpc: process.env.PROXY_SERVER_URL, // url for the `seismic-reth` proxy server
    },
  },
  database: {
    kind: "postgres",
    connectionString: process.env.INDEXER_DATABASE_URL,
    poolConfig: {
      max: 60,
    },
  },
  contracts: {
    DepositContract: {
      chain: "seismic",
      abi: depositContractAbi,
      address: DEPOSIT_CONTRACT_ADDRESS,
      startBlock: 0,
    },
  },
});
