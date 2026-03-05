'use client'
import { ethers } from "ethers"
import abi from "../../lib/RehabCertificate.json"
import { useState } from "react"

const verify = () => {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    // let certificate: {
    //     patientName: string;
    //     program: string;
    //     completionDate: bigint;
    //     dataHash: string;
    // } | null = null;

    const [certificate_id, setCertificateId] = useState("")
    const [certificate, setCertificate] = useState<any>({})

  const verify = async () => {
    console.log(process.env.NEXT_PUBLIC_RPC_URL)
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string, abi.abi, provider);

    try {
        const [patientName, program, completionDate, dataHash] = await contract.verifyCertificate(certificate_id);

        setCertificate({
          patientName,
          program,
          completionDate,
          dataHash
        })
        
    } catch (error) {
        // certificate = null;
        setCertificate({})
        console.log(error)
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <input type="text" onInput={(e: any) => setCertificateId(e.target.value)} value={certificate_id} />
      <button onClick={verify}>Verify</button>
      {certificate ? (
        <div>
          <h1>Certificate Verified</h1>
          <p>ID: {certificate_id}</p>
          <p>Patient: {certificate?.patientName}</p>
          <p>Program: {certificate?.program}</p>
          <p>
            Date:{" "}
            {new Date(
              Number(certificate?.completionDate) * 1000
            ).toLocaleDateString()}
          </p>
          <p>Hash: {certificate?.dataHash}</p>
        </div>
      ) : (
        <h1>Certificate Not Found</h1>
      )}
    </div>
  );
}

export default verify