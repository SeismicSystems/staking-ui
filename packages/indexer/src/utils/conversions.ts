import type { Hex } from "viem";

export function timestampToDate(timestamp: bigint): Date {
    return new Date(Number(timestamp) * 1000);
  }
  
  export function littleEndianToBigInt(bytes: string): bigint {
    const hex = bytes.startsWith("0x") ? bytes.slice(2) : bytes;
  
    let reversed = "";
    for (let i = hex.length - 2; i >= 0; i -= 2) {
      reversed += hex.slice(i, i + 2);
    }
  
    return BigInt("0x" + reversed);
  }
  
  export function extractDepositor(withdrawalCredentials: string): Hex {
    if (withdrawalCredentials.startsWith("0x01")) {
      return ("0x" + withdrawalCredentials.slice(-40)) as Hex;
    }
    return withdrawalCredentials as Hex;
  }