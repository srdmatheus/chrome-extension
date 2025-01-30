function extractTableData() {
  const rows = document.querySelectorAll("kat-table-row");
  const data = [];

  rows.forEach((row) => {
    const invoiceNumberElement = row.querySelector("kat-table-cell.nfe");
    const transactionIdElement = row.querySelector("kat-table-cell.amazon_order_id");


    if (invoiceNumberElement && transactionIdElement) {
      const invoiceNumber = invoiceNumberElement.textContent.trim();
      const transactionId = transactionIdElement.textContent.trim();

      data.push({
        invoiceNumber: String(invoiceNumber),
        transaction_id: String(transactionId),
      });
    }
  });

  return data;
}

// Listener para mensagens vindas do popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractTable") {
    const extractedData = extractTableData();
    sendResponse({ success: true, data: extractedData });
  }
});