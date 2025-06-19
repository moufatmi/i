import jsPDF from 'jspdf';
import { Invoice } from '../types';
import { formatCurrency, formatDate } from './helpers';

export const generateInvoicePDF = (invoice: Invoice): void => {
  const pdf = new jsPDF();
  
  // Set up colors using the new primary color #03989e
  const primaryColor = [3, 152, 158]; // #03989e
  const textColor = [31, 41, 55]; // Gray-800
  const lightGray = [156, 163, 175]; // Gray-400
  
  // Header
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, 210, 40, 'F');
  
  // Company name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Agence de Voyage', 20, 25);
  
  // Invoice title
  pdf.setTextColor(...textColor);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE', 20, 60);
  
  // Invoice details
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, 75);
  pdf.text(`Date: ${formatDate(invoice.createdAt)}`, 20, 85);
  pdf.text(`Due Date: ${formatDate(invoice.dueDate)}`, 20, 95);
  
  // Company details (right side)
  pdf.setFontSize(10);
  pdf.setTextColor(...lightGray);
  pdf.text('123 Travel Street', 140, 60);
  pdf.text('New York, NY 10001', 140, 70);
  pdf.text('Phone: (555) 123-4567', 140, 80);
  pdf.text('Email: info@agencedevoyage.com', 140, 90);
  
  // Status badge
  const statusColors = {
    draft: [156, 163, 175],
    sent: [3, 152, 158], // Using our primary color
    paid: [34, 197, 94],
    overdue: [239, 68, 68]
  };
  
  pdf.setFillColor(...(statusColors[invoice.status] || statusColors.draft));
  pdf.roundedRect(140, 95, 30, 8, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text(invoice.status.toUpperCase(), 142, 100);
  
  // Client information
  pdf.setTextColor(...textColor);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bill To:', 20, 120);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(invoice.client.name, 20, 135);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(invoice.client.email, 20, 145);
  if (invoice.client.phone) {
    pdf.text(invoice.client.phone, 20, 155);
  }
  if (invoice.client.address) {
    const addressLines = pdf.splitTextToSize(invoice.client.address, 80);
    pdf.text(addressLines, 20, 165);
  }
  
  // Agent information
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Agent:', 110, 120);
  
  pdf.setFontSize(12);
  pdf.text(invoice.agentName, 110, 135);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Travel Agent', 110, 145);
  
  // Items table
  let yPosition = 190;
  
  // Table header
  pdf.setFillColor(249, 250, 251); // Gray-50
  pdf.rect(20, yPosition - 10, 170, 15, 'F');
  
  pdf.setTextColor(...textColor);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Description', 25, yPosition - 2);
  pdf.text('Qty', 120, yPosition - 2);
  pdf.text('Unit Price', 140, yPosition - 2);
  pdf.text('Total', 170, yPosition - 2);
  
  // Table items
  pdf.setFont('helvetica', 'normal');
  yPosition += 10;
  
  invoice.items.forEach((item, index) => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 30;
    }
    
    // Alternate row colors
    if (index % 2 === 0) {
      pdf.setFillColor(249, 250, 251);
      pdf.rect(20, yPosition - 8, 170, 12, 'F');
    }
    
    pdf.setTextColor(...textColor);
    
    // Description (with text wrapping)
    const descriptionLines = pdf.splitTextToSize(item.description, 90);
    pdf.text(descriptionLines, 25, yPosition);
    
    // Quantity
    pdf.text(item.quantity.toString(), 125, yPosition);
    
    // Unit Price
    pdf.text(formatCurrency(item.unitPrice), 145, yPosition);
    
    // Total
    pdf.text(formatCurrency(item.total), 175, yPosition);
    
    yPosition += Math.max(12, descriptionLines.length * 5);
  });
  
  // Summary section
  yPosition += 20;
  if (yPosition > 230) {
    pdf.addPage();
    yPosition = 30;
  }
  
  const summaryX = 130;
  
  // Summary box
  pdf.setFillColor(249, 250, 251);
  pdf.rect(summaryX - 10, yPosition - 10, 70, 50, 'F');
  
  pdf.setTextColor(...textColor);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  pdf.text('Subtotal:', summaryX, yPosition);
  pdf.text(formatCurrency(invoice.subtotal), summaryX + 40, yPosition);
  
  pdf.text('Tax:', summaryX, yPosition + 12);
  pdf.text(formatCurrency(invoice.tax), summaryX + 40, yPosition + 12);
  
  // Total line
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('Total:', summaryX, yPosition + 28);
  pdf.setTextColor(...primaryColor);
  pdf.text(formatCurrency(invoice.total), summaryX + 40, yPosition + 28);
  
  // Notes section
  if (invoice.notes) {
    yPosition += 60;
    if (yPosition > 240) {
      pdf.addPage();
      yPosition = 30;
    }
    
    pdf.setTextColor(...textColor);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Notes:', 20, yPosition);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const notesLines = pdf.splitTextToSize(invoice.notes, 170);
    pdf.text(notesLines, 20, yPosition + 10);
  }
  
  // Footer
  const pageHeight = pdf.internal.pageSize.height;
  pdf.setTextColor(...lightGray);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Thank you for choosing Agence de Voyage!', 20, pageHeight - 30);
  pdf.text('For questions about this invoice, please contact us at billing@agencedevoyage.com', 20, pageHeight - 20);
  
  // Generate filename and download
  const filename = `Invoice_${invoice.invoiceNumber}_${invoice.client.name.replace(/\s+/g, '_')}.pdf`;
  pdf.save(filename);
};