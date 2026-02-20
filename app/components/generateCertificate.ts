// app/components/generateCertificate.ts
import { jsPDF } from "jspdf";

export const generateCertificate = (data: {
  rehabCenter: string;
  address: string;
  participant: string;
  startDate: string;
  endDate: string;
  programType: string;
  location: string;
  adminName: string;
}) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Helper to center multi-line text
  const addCenteredText = (
    text: string | undefined,
    y: number,
    fontSize = 12,
    fontStyle: 'normal' | 'bold' = 'normal'
  ) => {
    if (!text) text = ''; // ensure string

    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);

    const lines = doc.splitTextToSize(text, pageWidth - 80) || [];

    lines.forEach((line : any, i: any) => {
      doc.text(line, pageWidth / 2, y + i * (fontSize + 2), { align: 'center' });
    });

    return y + lines.length * (fontSize + 4);
  };

  let currentY = 150;
  currentY = addCenteredText(data.rehabCenter, currentY, 20, 'bold');
  currentY = addCenteredText(data.address, currentY + 10, 12, 'normal');
  currentY = addCenteredText("CERTIFICATE OF AUTHENTICITY", currentY + 20, 18, 'bold');

  const bodyText = `This is to certify that
${data.participant}
has successfully completed the prescribed course of treatment and rehabilitation under the ${data.rehabCenter}, in accordance with its mission to restore individuals to a healthy, productive, and drug-free life.
This certificate affirms the authenticity of the participant’s achievement and serves as official recognition of their dedication, perseverance, and commitment to recovery.`;

  currentY = addCenteredText(bodyText, currentY + 20, 12, 'normal');

  currentY = addCenteredText(`Program Duration: ${data.startDate} – ${data.endDate}`, currentY + 20);
  // currentY = addCenteredText(`Program Type: ${data.programType}`, currentY + 10);

  const today = new Date();
  const issuedText = `Issued this ${today.getDate()} of ${today.toLocaleString('default', { month: 'long' })}, ${today.getFullYear()} at ${data.location}.`;
  currentY = addCenteredText(issuedText, currentY + 20);

  currentY = addCenteredText(data.adminName, currentY + 40);
  addCenteredText("Center Administrator", currentY + 10);

  // Print directly
  doc.autoPrint({ variant: 'non-conform' });
  window.open(doc.output('bloburl'), '_blank');
};