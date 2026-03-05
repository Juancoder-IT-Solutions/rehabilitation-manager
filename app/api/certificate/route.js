import { ethers } from "ethers";
import abi from "../../../lib/RehabCertificate.json";

export async function POST(req) {
  try {
    const { certificateId, patientName, program, completionDate } =
      await req.json();

    if (!certificateId || !patientName || !program)
      return Response.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      abi.abi,
      wallet
    );

    const dataString = `${certificateId}|${patientName}|${program}|${completionDate}`;
    const dataHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

    const tx = await contract.issueCertificate(
      certificateId,
      patientName,
      program,
      completionDate,
      dataHash
    );
    await tx.wait();

    return Response.json({ success: true, certificateId, txHash: tx.hash });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}