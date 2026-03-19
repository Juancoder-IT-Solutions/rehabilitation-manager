'use client'

// import { jsPDF } from "jspdf";

import jsPDF from "jspdf/dist/jspdf.umd.min.js";
import QRCode from "qrcode";

export const generateCertificate = async (data: {
  rehabCenter: string;
  address: string;
  participant: string;
  startDate: string;
  endDate: string;
  programType: string;
  location: string;
  adminName: string;
  services?: string[];
  hash?: string;
}) => {
  const doc = new jsPDF('p', 'pt', 'a4');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const borderMargin = 40;
  doc.setLineWidth(2);
  doc.rect(
    borderMargin,
    borderMargin,
    pageWidth - borderMargin * 2,
    pageHeight - borderMargin * 2
  );

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

    const lineHeight = fontSize + 1;

    const lines = doc.splitTextToSize(text, pageWidth - 100);
    lines.forEach((line: any, i: any) => {
      doc.text(line, pageWidth / 2, y + i * lineHeight, { align: 'center' });
    });

    return y + lines.length * lineHeight;
  };

  let currentY = 120;

  // Header
  currentY = addCenteredText(data.rehabCenter, currentY, 24, 'bold');
  currentY = addCenteredText(data.address, currentY + 2, 12);

  // Title
  currentY = addCenteredText("CERTIFICATE OF AUTHENTICITY", currentY + 15, 20, 'bold');

  // Divider
  doc.setLineWidth(1);
  doc.line(80, currentY + 10, pageWidth - 80, currentY + 10);
  currentY += 25;

  // Body
  currentY = addCenteredText("This is to certify that", currentY);
  currentY = addCenteredText(data.participant, currentY + 14, 20, 'bold');
  currentY = addCenteredText(
    "has successfully completed the prescribed course of treatment and rehabilitation under the",
    currentY + 8
  );
  currentY = addCenteredText(data.rehabCenter, currentY + 5, 12, 'bold');
  currentY = addCenteredText(
    "in accordance with its mission to restore individuals to a healthy, productive, and drug-free life.",
    currentY + 8
  );
  currentY = addCenteredText(
    "This certificate affirms the authenticity of the participant’s achievement and serves as official recognition of their dedication, perseverance, and commitment to recovery.",
    currentY + 8
  );

  // Program
  currentY = addCenteredText(
    `Program Duration: ${data.startDate} – ${data.endDate}`,
    currentY + 15,
    12,
    'bold'
  );

  if (data.programType) {
    currentY = addCenteredText(
      `Program Type: ${data.programType}`,
      currentY + 4,
      12,
      'bold'
    );
  }

  // Services
  if (data.services && data.services.length > 0) {
    currentY += 15;
    currentY = addCenteredText("Services Availed:", currentY, 12, 'bold');

    data.services.forEach((service) => {
      currentY = addCenteredText(`• ${service}`, currentY + 4);
    });
  }

  // Issued Date
  const today = new Date();
  const issuedText = `Issued this ${today.getDate()} of ${today.toLocaleString(
    'default',
    { month: 'long' }
  )}, ${today.getFullYear()} at ${data.address}.`;

  currentY = addCenteredText(issuedText, currentY + 20, 12, 'bold');

  currentY += 40;
  const lineWidth = 200;
  doc.setLineWidth(0.8);
  doc.line(
    pageWidth / 2 - lineWidth / 2,
    currentY,
    pageWidth / 2 + lineWidth / 2,
    currentY
  );

  currentY = addCenteredText(data.adminName, currentY + 10, 12, 'bold');
  addCenteredText("Center Administrator", currentY + 5, 12);
  
  if (data.hash) {
    const verifyUrl = `https://sepolia.etherscan.io/tx/${data.hash}`;

    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    const qrSize = 110;

    // Center position
    const qrX = pageWidth / 2 - qrSize / 2;
    const qrY = pageHeight - 200;

    // QR Code (centered)
    doc.addImage(
      qrDataUrl,
      'PNG',
      qrX,
      qrY,
      qrSize,
      qrSize
    );

    // Label above QR
    doc.setFontSize(9);
    doc.text(
      "View in Blockchain",
      pageWidth / 2,
      qrY - 10,
      { align: "center" }
    );

    doc.setFontSize(8);
    doc.setTextColor("#555555");

    doc.text(
      `Transaction Hash: ${data.hash}`,
      pageWidth / 2,
      qrY + qrSize + 15,
      {
        align: "center",
        maxWidth: pageWidth - 120
      }
    );
  }

  // Print
  doc.autoPrint({ variant: 'non-conform' });
  window.open(doc.output('bloburl'), '_blank');
};