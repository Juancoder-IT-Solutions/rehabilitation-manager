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
  services?: string[]; // Services availed
  hash?: string;       // Blockchain hash
}) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  const addCenteredText = (
    text: string,
    y: number,
    fontSize = 12,
    fontStyle: 'normal' | 'bold' = 'normal',
    color = '#000000'
  ) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color);

    const lines = doc.splitTextToSize(text, pageWidth - 100);
    lines.forEach((line: any, i: any) => {
      doc.text(line, pageWidth / 2, y + i * (fontSize + 4), { align: 'center' });
    });

    return y + lines.length * (fontSize + 6);
  };

  let currentY = 120;

  currentY = addCenteredText(data.rehabCenter, currentY, 24, 'bold');
  currentY = addCenteredText(data.address, currentY + 2, 12, 'normal');

  currentY = addCenteredText("CERTIFICATE OF AUTHENTICITY", currentY + 15, 20, 'bold');

  // Line
  doc.setLineWidth(1);
  doc.line(80, currentY + 10, pageWidth - 80, currentY + 10);
  currentY += 30;

  // Body: split text for bold parts
  currentY = addCenteredText("This is to certify that", currentY, 12, 'normal');
  currentY = addCenteredText(data.participant, currentY + 10, 12, 'bold');
  currentY = addCenteredText("has successfully completed the prescribed course of treatment and rehabilitation under the", currentY + 10, 12, 'normal');
  currentY = addCenteredText(data.rehabCenter, currentY + 5, 12, 'bold');
  currentY = addCenteredText("in accordance with its mission to restore individuals to a healthy, productive, and drug-free life.", currentY + 10, 12, 'normal');
  currentY = addCenteredText("This certificate affirms the authenticity of the participant’s achievement and serves as official recognition of their dedication, perseverance, and commitment to recovery.", currentY + 10, 12, 'normal');

  // Program Duration
  currentY = addCenteredText(`Program Duration: ${data.startDate} – ${data.endDate}`, currentY + 20, 12, 'bold');

  // Program Type
  if (data.programType) {
    currentY = addCenteredText(`Program Type: ${data.programType}`, currentY + 5, 12, 'bold');
  }

  // Services Availed
  if (data.services && data.services.length > 0) {
    currentY += 20;
    currentY = addCenteredText("Services Availed:", currentY, 12, 'bold');

    data.services.forEach((service) => {
      currentY = addCenteredText(`• ${service}`, currentY + 6, 12, 'normal');
    });
  }

  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const issuedText = `Issued this ${day} of ${month}, ${year} at ${data.location}.`;
  currentY = addCenteredText(issuedText, currentY + 30, 12, 'bold');

  // Admin
  currentY = addCenteredText(data.adminName, currentY + 40, 12, 'bold');
  addCenteredText("Center Administrator", currentY + 10, 12, 'normal');

  if (data.hash) {
    currentY += 30;
    doc.setFontSize(10);
    doc.setTextColor("#555555");
    doc.text(`Blockchain Hash: ${data.hash}`, 60, currentY, { maxWidth: pageWidth - 120 });
  }

  // Print
  doc.autoPrint({ variant: 'non-conform' });
  window.open(doc.output('bloburl'), '_blank');
};