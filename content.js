chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractTable") {
    const rows = document.querySelectorAll("#invoices-listing-table");
    const extractedData = [];

    rows.forEach((row) => {
      const notaElement = row.querySelector(".nfe");
      const orderIdElement = row.querySelector(".transaction_id");

      if (notaElement && orderIdElement) {
        extractedData.push({
          nota: notaElement.innerText.trim(),
          order: orderIdElement.innerText.trim(),
        });
      }
    });

    sendResponse({ success: true, data: extractedData });
  }
});
