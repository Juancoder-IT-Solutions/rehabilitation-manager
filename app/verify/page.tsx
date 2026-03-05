'use client'
import { ethers } from "ethers"
import abi from "../../lib/RehabCertificate.json"
import { useState } from "react"
import admissionController from "../controllers/Admission"
import { BiCheckCircle, BiInfoCircle, BiXCircle } from "react-icons/bi"
import alerts from "../components/Alerts"

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

  const [isVerifying, setIsVerifying] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const verify = async () => {
    if (hash_transaction === "") {
      alerts.warning("Please provide reference number or certificate code to verify.");
      return
    }

    setIsVerifying(true)
    setHasSearched(false)

    try {
      const data: any = await admissionController.get_certificate(hash_transaction)

      if (data?.certificate_id) {
        const certificateId = data.certificate_id.toString()
        setCertificateId(certificateId)

        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
          abi.abi,
          provider
        )

        const [patientName, program, completionDate, dataHash] =
          await contract.verifyCertificate(certificateId)

        setCertificate({ patientName, program, completionDate, dataHash })
      } else {
        setCertificate({})
        setCertificateId("")
      }
    } catch (error) {
      console.log(error)
      setCertificate({})
      setCertificateId("")
    } finally {
      setIsVerifying(false)
      setHasSearched(true)
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

              {isVerifying && (
                <>
                  <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
                  <h2>Verifying certificate on blockchain...</h2>
                </>
              )}
              {!hasSearched && !isVerifying && (
                <div className="text-left">
                  <h3 className="text-muted mb-2"><BiInfoCircle size={20} color="#0158ae" /> Enter your certificate code to verify it on the blockchain.</h3>
                </div>
              )}

              {!isVerifying && hasSearched && certificate_id !== "" && (
                <div>
                  <h1 className="text-success"><BiCheckCircle size={30} color="success" /> Certificate Verified</h1>
                  <p><strong>ID:</strong> {certificate_id}</p>
                  <p><strong>Patient:</strong> {certificate?.patientName}</p>
                  <p><strong>Program:</strong> {certificate?.program}</p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(Number(certificate?.completionDate) * 1000).toLocaleDateString()}
                  </p>
                  <p><strong>Hash:</strong> {certificate?.dataHash}</p>
                </div>
              )}

              {!isVerifying && hasSearched && certificate_id == "" && (
                <h1 className="text-danger"><BiXCircle size={30} color="danger" /> Certificate Not Found</h1>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default verify