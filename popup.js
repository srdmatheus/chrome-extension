document.getElementById("extract-btn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extractTable" }, (response) => {
      const outputDiv = document.getElementById("output");
      outputDiv.innerHTML = "";

      if (!response || !response.success) {
        outputDiv.innerText = "Erro ao extrair os dados.";
        return;
      }

      response.data.forEach((item) => {
        const p = document.createElement("p");
        p.innerText = `Nota: ${item.nota}, Order ID: ${item.order}`;
        outputDiv.appendChild(p);
      });
    });
  });
});
