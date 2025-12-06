function createToastContainer() {
    if (document.getElementById("memory-toast-container")) return;

    const container = document.createElement("div");
    container.id = "memory-toast-container";

    chrome.storage.sync.get(["toastPosition"], ({ toastPosition }) => {
        container.classList.add(toastPosition || "bottom-right");
    });

    document.body.appendChild(container);
}

function showMemoryToast(value) {
    createToastContainer();

    const container = document.getElementById("memory-toast-container");
    const toast = document.createElement("div");

    toast.className = "memory-toast";
    toast.innerHTML = `⚠️ <strong>Memory usage:</strong> ${value.toFixed(2)}GB (exceeds limit)`;

    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 6000);
}

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "MEMORY_ALERT") {
        showMemoryToast(msg.value);
    }
});
