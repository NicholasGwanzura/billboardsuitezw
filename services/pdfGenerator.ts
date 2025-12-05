
import { Invoice, Contract, Client } from '../types';
import { getCompanyProfile, getCompanyLogo } from './mockData';

// Safe dynamic import helper
const loadJsPDF = async () => {
    try {
        const jsPDFModule = await import('jspdf');
        const autoTableModule = await import('jspdf-autotable');
        const jsPDF = jsPDFModule.jsPDF || (jsPDFModule as any).default;
        
        // Handle autoTable default export weirdness
        const autoTable = autoTableModule.default || autoTableModule;
        
        return { jsPDF, autoTable };
    } catch (e) {
        console.error("Failed to load PDF libraries", e);
        throw new Error("PDF generation libraries could not be loaded.");
    }
};

const addCompanyHeader = (doc: any, profile: any, logo: any): number => {
    const pageWidth = doc.internal.pageSize.width;
    let startY = 15;

    // Logo (Top Left)
    if (logo && logo.startsWith('data:image')) {
        try {
            doc.addImage(logo, 'JPEG', 14, 10, 25, 25);
        } catch (e) {
            try {
                 doc.addImage(logo, 'PNG', 14, 10, 25, 25);
            } catch (err) {
                console.warn("Could not add logo to PDF", err);
            }
        }
    }

    // Company Details (Top Right aligned)
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text(profile.name, pageWidth - 14, startY, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    
    const lineHeight = 4;
    startY += 6;
    
    doc.text(profile.address, pageWidth - 14, startY, { align: 'right' });
    startY += lineHeight;
    
    doc.text(`${profile.city}, ${profile.country}`, pageWidth - 14, startY, { align: 'right' });
    startY += lineHeight;
    
    doc.text(profile.phone, pageWidth - 14, startY, { align: 'right' });
    startY += lineHeight;
    
    doc.text(profile.email, pageWidth - 14, startY, { align: 'right' });
    startY += lineHeight;

    if(profile.vatNumber) {
        doc.text(`VAT: ${profile.vatNumber}`, pageWidth - 14, startY, { align: 'right' });
        startY += lineHeight;
    }
    
    // Draw a divider line
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.line(14, startY + 5, pageWidth - 14, startY + 5);

    return startY + 15; // Return Y position for next elements
};

export const generateInvoicePDF = async (invoice: Invoice, client: Client) => {
  try {
    const { jsPDF, autoTable } = await loadJsPDF();
    const doc = new jsPDF();
    
    // Add Company Header
    let currentY = addCompanyHeader(doc, getCompanyProfile(), getCompanyLogo());
    
    // Document Title & Info
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(invoice.type === 'Quotation' ? 'QUOTATION' : invoice.type === 'Receipt' ? 'RECEIPT' : 'INVOICE', 14, currentY);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`#${invoice.id}`, 14, currentY + 6);
    
    // Metadata Grid
    const metaY = currentY + 15;
    
    // Left Col: Bill To
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150); // Slate 400
    doc.text('BILL TO', 14, metaY);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(client.companyName || 'Unknown Company', 14, metaY + 6);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(client.contactPerson || '', 14, metaY + 11);
    doc.text(client.email || '', 14, metaY + 16);
    doc.text(client.phone || '', 14, metaY + 21);

    // Right Col: Invoice Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150);
    doc.text('DETAILS', 120, metaY);

    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.setFont("helvetica", "normal");
    
    doc.text('Date Issued:', 120, metaY + 6);
    doc.text(invoice.date, 160, metaY + 6, { align: 'right' });
    
    doc.text('Status:', 120, metaY + 11);
    doc.setTextColor(invoice.status === 'Paid' ? 'green' : invoice.status === 'Overdue' ? 'red' : 'black');
    doc.text(invoice.status, 160, metaY + 11, { align: 'right' });
    doc.setTextColor(50);

    if (invoice.contractId) {
        doc.text('Contract Ref:', 120, metaY + 16);
        doc.text(invoice.contractId, 160, metaY + 16, { align: 'right' });
    }

    // Table Data
    const tableColumn = ["Description", "Amount ($)"];
    const tableRows = (invoice.items || []).map(item => [item.description, item.amount.toFixed(2)]);
    
    const tableStartY = metaY + 30;

    if (tableRows.length > 0) {
        autoTable(doc, {
            startY: tableStartY,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42], fontSize: 10, fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 4 },
            columnStyles: {
                1: { halign: 'right' }
            }
        });
    }

    // Totals
    const finalY = (doc as any).lastAutoTable?.finalY || tableStartY + 20;
    const totalsX = 140;
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Subtotal:`, totalsX, finalY + 10);
    doc.text(`$${(invoice.subtotal || 0).toFixed(2)}`, 195, finalY + 10, { align: 'right' });
    
    doc.text(`VAT (15%):`, totalsX, finalY + 15);
    doc.text(`$${(invoice.vatAmount || 0).toFixed(2)}`, 195, finalY + 15, { align: 'right' });
    
    doc.setDrawColor(200);
    doc.line(totalsX, finalY + 18, 195, finalY + 18);

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(`Total:`, totalsX, finalY + 26);
    doc.text(`$${(invoice.total || 0).toFixed(2)}`, 195, finalY + 26, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    const footerText = `Generated by ${getCompanyProfile().name} Management System`;
    doc.text(footerText, 105, 290, { align: 'center' });

    doc.save(`${invoice.type}_${invoice.id}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Failed to generate PDF. Please reload and try again.");
  }
};

export const generateContractPDF = async (contract: Contract, client: Client, billboardName: string) => {
  try {
    const { jsPDF } = await loadJsPDF();
    const doc = new jsPDF();
    const profile = getCompanyProfile();

    let currentY = addCompanyHeader(doc, profile, getCompanyLogo());

    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text('RENTAL AGREEMENT', 105, currentY, { align: 'center' });
    
    currentY += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Contract ID: ${contract.id}`, 105, currentY, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, currentY + 5, { align: 'center' });

    currentY += 15;

    // Parties Box
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.rect(14, currentY, 182, 35, 'FD');

    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text('Parties Involved', 20, currentY + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50);
    
    // Lessor
    doc.text(`Lessor: ${profile.name}`, 20, currentY + 20);
    doc.text(`Address: ${profile.address}, ${profile.city}`, 20, currentY + 25);
    
    // Lessee
    doc.text(`Lessee: ${client.companyName}`, 110, currentY + 20);
    doc.text(`Contact: ${client.contactPerson}`, 110, currentY + 25);

    currentY += 45;

    // Asset Details
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text('1. Asset Details', 14, currentY);
    
    currentY += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50);
    const assetInfo = [
        `Billboard Location: ${billboardName}`,
        `Specific Unit/Side: ${contract.details}`,
        `Contract Duration: ${contract.startDate} to ${contract.endDate}`,
    ];
    assetInfo.forEach(line => {
        doc.text(`• ${line}`, 20, currentY);
        currentY += 6;
    });

    currentY += 10;

    // Financial Terms
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text('2. Financial Terms', 14, currentY);
    
    currentY += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`Monthly Rental Rate: $${contract.monthlyRate.toFixed(2)}`, 20, currentY);
    currentY += 6;
    if(contract.installationCost > 0) {
        doc.text(`Installation Fee (One-time): $${contract.installationCost.toFixed(2)}`, 20, currentY);
        currentY += 6;
    }
    if(contract.printingCost > 0) {
        doc.text(`Printing/Production Cost: $${contract.printingCost.toFixed(2)}`, 20, currentY);
        currentY += 6;
    }
    
    currentY += 4;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Contract Value: $${contract.totalContractValue.toFixed(2)}`, 20, currentY);
    
    currentY += 15;

    // Terms
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text('3. Terms and Conditions', 14, currentY);
    
    currentY += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(50);
    
    const terms = [
        "1. PAYMENT: All rental payments are due in advance on the 1st of each month unless otherwise specified.",
        "2. ARTWORK: The Lessee is responsible for providing artwork in the required format. Printing costs are separate.",
        "3. MAINTENANCE: The Lessor shall maintain the structure in good repair.",
        "4. INDEMNITY: The Lessee indemnifies the Lessor against claims arising from the content of the advertisement.",
        "5. TERMINATION: Either party may terminate this agreement with 30 days written notice.",
        "6. JURISDICTION: This agreement is governed by the laws of Zimbabwe."
    ];
    
    terms.forEach(term => {
        doc.text(term, 20, currentY);
        currentY += 5;
    });
    
    currentY += 15;
    
    // Signatures
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("4. Signatures", 14, currentY);
    
    currentY += 15;
    
    const boxY = currentY;
    
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.rect(14, boxY, 80, 30);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Signed for and on behalf of Lessor:", 16, boxY + 5);
    doc.line(20, boxY + 22, 80, boxY + 22);
    doc.text(profile.name, 20, boxY + 27);

    doc.rect(110, boxY, 80, 30);
    doc.text("Signed for and on behalf of Lessee:", 112, boxY + 5);
    doc.line(116, boxY + 22, 176, boxY + 22);
    doc.text(client.companyName, 116, boxY + 27);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated by ${profile.name} System`, 105, 290, { align: 'center' });

    doc.save(`Contract_${contract.id}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Failed to generate Contract PDF.");
  }
};

export const generateStatementPDF = async (client: Client, transactions: Invoice[], activeRentals: Contract[], billboardNameGetter: (id: string) => string) => {
    try {
        const { jsPDF, autoTable } = await loadJsPDF();
        const doc = new jsPDF();
        const profile = getCompanyProfile();
        
        let currentY = addCompanyHeader(doc, profile, getCompanyLogo());

        doc.setFontSize(20);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.text('STATEMENT OF ACCOUNT', 14, currentY);
        
        currentY += 8;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, currentY);
        
        currentY += 15;

        doc.setFillColor(241, 245, 249);
        doc.rect(14, currentY, 90, 25, 'F');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.text(client.companyName, 18, currentY + 6);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50);
        doc.text(client.contactPerson, 18, currentY + 12);
        doc.text(client.email, 18, currentY + 18);

        const totalBilled = transactions.filter(t => t.type === 'Invoice').reduce((acc, t) => acc + t.total, 0);
        const totalPaid = transactions.filter(t => t.type === 'Receipt').reduce((acc, t) => acc + t.total, 0);
        const balance = totalBilled - totalPaid;

        doc.setFillColor(balance > 0 ? 254 : 240, balance > 0 ? 242 : 253, balance > 0 ? 242 : 244);
        doc.rect(120, currentY, 76, 25, 'F');
        doc.setTextColor(100);
        doc.text("Amount Due:", 125, currentY + 8);
        doc.setFontSize(16);
        doc.setTextColor(balance > 0 ? 220 : 22, balance > 0 ? 38 : 163, balance > 0 ? 38 : 74);
        doc.setFont("helvetica", "bold");
        doc.text(`$${balance.toFixed(2)}`, 190, currentY + 18, { align: 'right' });

        currentY += 35;

        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("Active Services", 14, currentY);
        
        const rentalRows = activeRentals.map(r => [
            billboardNameGetter(r.billboardId),
            r.details,
            `$${r.monthlyRate}/mo`,
            `${r.startDate} to ${r.endDate}`
        ]);
        
        autoTable(doc, {
            startY: currentY + 5,
            head: [['Billboard', 'Side/Slot', 'Rate', 'Duration']],
            body: rentalRows,
            theme: 'striped',
            headStyles: { fillColor: [71, 85, 105] },
            styles: { fontSize: 9 }
        });

        const finalY = (doc as any).lastAutoTable?.finalY || currentY + 20;
        doc.text("Transaction History", 14, finalY + 15);

        const transactionRows = transactions.map(t => [
            t.date,
            t.type.toUpperCase(),
            t.id,
            t.type === 'Invoice' ? `$${t.total.toFixed(2)}` : '-',
            t.type === 'Receipt' ? `$${t.total.toFixed(2)}` : '-'
        ]);
        transactionRows.push(['', 'TOTALS', '', `$${totalBilled.toFixed(2)}`, `$${totalPaid.toFixed(2)}`]);

        autoTable(doc, {
            startY: finalY + 20,
            head: [['Date', 'Type', 'Reference', 'Billed', 'Paid']],
            body: transactionRows,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42] },
            styles: { fontSize: 9, halign: 'right' },
            columnStyles: {
                0: { halign: 'left' },
                1: { halign: 'left' },
                2: { halign: 'left' }
            }
        });

        doc.save(`Statement_${client.companyName.replace(/\s/g, '_')}.pdf`);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate Statement PDF.");
    }
};
