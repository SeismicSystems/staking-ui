import { createConfig } from "ponder";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { DEPOSIT_CONTRACT_ADDRESS } from "seismic-viem";

import { depositContractAbi } from "@/indexer/abis/DepositContractAbi";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });


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
