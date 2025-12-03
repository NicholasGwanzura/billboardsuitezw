import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice, Contract, Client } from '../types';

// Helper to safely execute autoTable regardless of import structure
const runAutoTable = (doc: any, options: any) => {
    try {
        // 1. Try direct function call (CommonJS/ESM default)
        if (typeof autoTable === 'function') {
            autoTable(doc, options);
            return;
        } 
        
        // 2. Try attached to doc (Prototype mutation)
        if (typeof (doc as any).autoTable === 'function') {
            (doc as any).autoTable(options);
            return;
        }

        // 3. Try default property (ESM namespace import)
        if ((autoTable as any)?.default && typeof (autoTable as any).default === 'function') {
            (autoTable as any).default(doc, options);
            return;
        }
        
        console.warn('autoTable function not found in any expected location. Skipping table generation.');
    } catch (e) {
        console.error('Error running autoTable:', e);
    }
};

export const generateInvoicePDF = (invoice: Invoice, client: Client) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text(invoice.type === 'Quotation' ? 'QUOTATION' : invoice.type === 'Receipt' ? 'RECEIPT' : 'INVOICE', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`ID: ${invoice.id}`, 14, 28);
    doc.text(`Date: ${invoice.date}`, 14, 33);
    doc.text(`Status: ${invoice.status}`, 14, 38);

    // Client Info
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Bill To:', 14, 50);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(client.companyName || 'Unknown Company', 14, 56);
    doc.text(client.contactPerson || 'Unknown Contact', 14, 61);
    doc.text(client.email || 'No Email', 14, 66);
    doc.text(client.phone || 'No Phone', 14, 71);

    // Table Data
    const tableColumn = ["Description", "Amount ($)"];
    const tableRows = (invoice.items || []).map(item => [item.description, item.amount.toFixed(2)]);

    if (tableRows.length > 0) {
        runAutoTable(doc, {
            startY: 80,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] },
        });
    }

    // Totals
    const finalY = (doc as any).lastAutoTable?.finalY || 80;
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Subtotal: $${(invoice.subtotal || 0).toFixed(2)}`, 140, finalY + 10);
    doc.text(`VAT (15%): $${(invoice.vatAmount || 0).toFixed(2)}`, 140, finalY + 15);
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${(invoice.total || 0).toFixed(2)}`, 140, finalY + 22);

    doc.save(`${invoice.type}_${invoice.id}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Failed to generate PDF. Please check console for details.");
  }
};

export const generateContractPDF = (contract: Contract, client: Client, billboardName: string) => {
  try {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42);
    doc.text('RENTAL AGREEMENT', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Contract ID: ${contract.id}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text('Parties', 14, 45);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`This agreement is made between Spiritus Systems (Lessor) and ${client.companyName} (Lessee).`, 14, 52);

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text('Asset Details', 14, 65);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`Billboard: ${billboardName}`, 14, 72);
    doc.text(`Unit/Side: ${contract.details}`, 14, 77);
    doc.text(`Duration: ${contract.startDate} to ${contract.endDate}`, 14, 82);

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text('Financial Terms', 14, 95);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`Monthly Rental: $${contract.monthlyRate.toFixed(2)}`, 14, 102);
    if(contract.installationCost > 0) doc.text(`Installation Fee: $${contract.installationCost.toFixed(2)}`, 14, 107);
    if(contract.printingCost > 0) doc.text(`Printing Costs: $${contract.printingCost.toFixed(2)}`, 14, 112);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Contract Value: $${contract.totalContractValue.toFixed(2)}`, 14, 125);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Generated by Billboard Management System', 105, 280, { align: 'center' });

    doc.save(`Contract_${contract.id}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Failed to generate Contract PDF.");
  }
};

export const generateStatementPDF = (client: Client, transactions: Invoice[], activeRentals: Contract[], billboardNameGetter: (id: string) => string) => {
    try {
        const doc = new jsPDF();

        // Branding & Header
        doc.setFontSize(20);
        doc.setTextColor(15, 23, 42);
        doc.text('STATEMENT OF ACCOUNT', 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Client: ${client.companyName}`, 14, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
        doc.text(`Email: ${client.email}`, 14, 40);

        // Calculate Summary
        const totalBilled = transactions.filter(t => t.type === 'Invoice').reduce((acc, t) => acc + t.total, 0);
        const totalPaid = transactions.filter(t => t.type === 'Receipt').reduce((acc, t) => acc + t.total, 0);
        const balance = totalBilled - totalPaid;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(`Balance Due: $${balance.toFixed(2)}`, 140, 30);
        
        // Active Rentals Section
        doc.text("Active Rentals", 14, 55);
        const rentalRows = activeRentals.map(r => [
            billboardNameGetter(r.billboardId),
            r.details,
            `$${r.monthlyRate}/mo`,
            `${r.startDate} to ${r.endDate}`
        ]);
        
        runAutoTable(doc, {
            startY: 60,
            head: [['Billboard', 'Side/Slot', 'Rate', 'Duration']],
            body: rentalRows,
            theme: 'grid',
            headStyles: { fillColor: [71, 85, 105] },
            styles: { fontSize: 8 }
        });

        // Transactions Table
        const finalY = (doc as any).lastAutoTable?.finalY || 60;
        doc.setFontSize(12);
        doc.text("Transaction History", 14, finalY + 15);

        const transactionRows = transactions.map(t => [
            t.date,
            t.type.toUpperCase(),
            t.id,
            t.type === 'Invoice' ? `$${t.total.toFixed(2)}` : '-',
            t.type === 'Receipt' ? `$${t.total.toFixed(2)}` : '-'
        ]);

        runAutoTable(doc, {
            startY: finalY + 20,
            head: [['Date', 'Type', 'Reference', 'Billed', 'Paid']],
            body: transactionRows,
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] }
        });

        doc.save(`Statement_${client.companyName.replace(/\s/g, '_')}.pdf`);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate Statement PDF.");
    }
};