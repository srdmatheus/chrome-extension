document.addEventListener("DOMContentLoaded", () => {
  const sendDataBtn = document.getElementById("send-data-btn");
  const saveUrlBtn = document.getElementById("save-url-btn");
  const urlInput = document.getElementById("url-input");
  const outputTable = document.querySelector("#output-table tbody");

  let savedUrl = "";

  // Recupera a URL salva no Chrome Storage
  chrome.storage.sync.get("savedUrl", (data) => {
    if (data.savedUrl) {
      savedUrl = data.savedUrl;
      urlInput.value = savedUrl;
    }
  });

  // Salvar URL no Chrome Storage
  saveUrlBtn.addEventListener("click", () => {
    savedUrl = urlInput.value.trim();
    if (savedUrl) {
      chrome.storage.sync.set({ savedUrl }, () => {
        showToast("✅ URL salva com sucesso!");
      });
    }
  });

  // Extrai os dados da página ativa e os envia ao servidor
  sendDataBtn.addEventListener("click", () => {
    if (!savedUrl) {
      showToast("⚠ Informe uma URL antes de enviar os dados.");
      return;
    }

    sendDataBtn.innerText = "⏳ Extraindo & Enviando...";
    sendDataBtn.disabled = true;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "extractTable" }, (response) => {
        outputTable.innerHTML = "";

        if (!response || !response.success || response.data.length === 0) {
          showToast("⚠ Nenhum dado encontrado para enviar.");
          sendDataBtn.innerText = "🚀 Extrair & Enviar Dados";
          sendDataBtn.disabled = false;
          return;
        }

        const extractedData = response.data;

        extractedData.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `<td>${item.invoiceNumber}</td><td>${item.transaction_id}</td>`;
          outputTable.appendChild(row);
        });

        showToast("📊 Dados extraídos com sucesso! Enviando...");

        fetch(savedUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: extractedData }),
        })
          .then((response) => response.json())
          .then((data) => {
            showToast("✅ Dados enviados com sucesso!");
            console.log("Resposta do servidor:", data);
          })
          .catch((error) => {
            showToast("❌ Erro ao enviar os dados.");
            console.error("Erro:", error);
          })
          .finally(() => {
            sendDataBtn.innerText = "🚀 Extrair & Enviar Dados";
            sendDataBtn.disabled = false;
          });
      });
    });
  });

  // Exibe notificações estilizadas
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }
});
