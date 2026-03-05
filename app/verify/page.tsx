'use client'
import { ethers } from "ethers"
import abi from "../../lib/RehabCertificate.json"
import { useState } from "react"
import admissionController from "../controllers/Admission"

const verify = () => {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    // let certificate: {
    //     patientName: string;
    //     program: string;
    //     completionDate: bigint;
    //     dataHash: string;
    // } | null = null;

    const [certificate_id, setCertificateId] = useState("")
    const [hash_transaction, setHashTransaction] = useState("")
    const [certificate, setCertificate] = useState<any>({})
  
    const verify = async () => {
      
      if(hash_transaction == ""){
        alert("Please provide reference number")
      }else{
        const data: any = await admissionController.get_certificate(hash_transaction)

        if(data.certificate_id){
          const certificateId = (data.certificate_id).toString()
          setCertificateId(certificateId)
          const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string, abi.abi, provider);
          try {
            const [patientName, program, completionDate, dataHash] = await contract.verifyCertificate(certificateId);
            
              setCertificate({patientName, program, completionDate, dataHash })
              
            } catch (error) {
                setCertificate({})
                setCertificateId("")
                console.log(error)
            }
          }else{
            setCertificate({})
            setCertificateId("")
            // alert("Cannot find certificate")
          }
      }
    }

  return (
      <div className="page-wrapper">
        <div className="page-header d-print-none">
            <div className="container-xl">
                <div className="row g-2 align-items-center">
                    <div className="col">
                        <h2 className="page-title">
                          Verify Certificate
                        </h2>
                    </div>
                </div>
            </div>
        </div>
        <div className="page-body">
            <div className="container-xl">
              <div className="row">
                <div className="col-sm-8">
                  <input type="text" className="form-control" onInput={(e: any) => setHashTransaction(e.target.value)} value={hash_transaction} placeholder="Input hash transaction reference or certificate code printed on your rehabilitation document ..." />
                </div>
                <div className="col-sm-4">
                  <button className="btn btn-primary" onClick={verify}>Verify</button>
                </div>
              </div>
              <br />

                <div className="card">
                    <div className="card-body">
                      {certificate && certificate_id !== "" ? (
                        <div>
                          <h1 className="text-success">Certificate Verified</h1>
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
                        <h1 className="text-danger">Certificate Not Found</h1>
                      )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default verify