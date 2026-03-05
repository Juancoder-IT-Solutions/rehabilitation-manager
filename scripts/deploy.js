async function main() {
  const RehabCertificate = await ethers.getContractFactory("RehabCertificate");
  const contract = await RehabCertificate.deploy();
  await contract.waitForDeployment();

  console.log("=================================");
  console.log("CONTRACT DEPLOYED TO:");
  console.log(await contract.getAddress());
  console.log("=================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});