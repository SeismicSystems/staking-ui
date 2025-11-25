import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { type ByteArrayResponse } from "../hooks/useBytesToHex";
// import { useBytesToHex } from "../hooks/useBytesToHex";
// import { DepositSignatureDataDisplay } from "./DepositSignatureDataDisplay";
export const Home = () => {
  const [consensusPublicKeys, setConsensusPublicKeys] = useState<string[]>([]);
  const [nodePublicKeys, setNodePublicKeys] = useState<string[]>([]);
  const [depositSignatureData, setDepositSignatureData] =
    useState<ByteArrayResponse | null>(null);

  useEffect(() => {
    const fetchPublicKeys = async () => {
      const response = await fetch("/get_public_keys");
      const data = await response.json();
      setConsensusPublicKeys(data.consensus);
      setNodePublicKeys(data.node);
    };
    fetchPublicKeys();
  }, []);

  useEffect(() => {
    const getDepositSignature = async () => {
      const response = await fetch(
        "/get_deposit_signature?amount=32&address=0xaa1cd3f5bcd5aeea5f419c6c49a05f9e8abc104b"
      );
      const data = await response.json();
      setDepositSignatureData(data);
    };
    getDepositSignature();
  }, [consensusPublicKeys, nodePublicKeys]);
  console.log(depositSignatureData, "depositSignatureData");
  console.log(consensusPublicKeys, "consensusPublicKeys");
  return (
    <div>
      <ConnectButton />
      {/* <DepositSignatureDataDisplay
        depositSignatureData={depositSignatureData || null}
      /> */}
    </div>
  );
};
