chrome.storage.sync.get(["toastPosition"], ({ toastPosition }) => {
    window.toastPosition = toastPosition || "bottom-right";
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "MEMORY_ALERT") {
        showMemoryToast(msg.value);
    }
});

function showMemoryToast(value) {
    const containerId = "memory-watcher-toast-container";
    let container = document.getElementById(containerId);

    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        container.className = `toast-container ${window.toastPosition}`;
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "memory-toast";

    const rounded = value.toFixed(2);

    toast.innerText = `⚠️ Memory usage: ${rounded}GB (exceeds limit)`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.remove(), 500);
    }, 5000);
}
