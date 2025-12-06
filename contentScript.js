const CHECK_INTERVAL = 3000;

let memoryLimitMB = 1024;
let toastPosition = "bottom-right";

function createToastContainer() {
    const existing = document.getElementById("memory-toast-container");

    if (existing) {
        existing.className = toastPosition;
        return existing;
    }

    const container = document.createElement("div");
    container.id = "memory-toast-container";
    container.className = toastPosition;

    document.body.appendChild(container);

    return container;
}

function showMemoryToast(value) {
    const container = createToastContainer();
    const toast = document.createElement("div");

    toast.className = "memory-toast";
    toast.innerHTML = `⚠️ <strong>Memory usage:</strong> ${value.toFixed(0)}MB (exceeds limit)`;

    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 6000);
}

function normalizeLimit(limit) {
    if (!Number.isFinite(limit)) return 1024;

    return limit < 50 ? limit * 1024 : limit;
}

function loadSettings() {
    chrome.storage.sync.get(["memoryLimit", "toastPosition"], ({ memoryLimit, toastPosition: storedPosition }) => {
        memoryLimitMB = normalizeLimit(memoryLimit);
        toastPosition = storedPosition || "bottom-right";
    });
}

async function getMemoryUsageMB() {
    // Try the modern API first
    if (performance.measureUserAgentSpecificMemory) {
        try {
            const result = await performance.measureUserAgentSpecificMemory();

            if (result?.bytes) return result.bytes / 1024 / 1024;
        } catch (err) {
            // Fallback below
            console.warn("Memory Watcher: measureUserAgentSpecificMemory failed", err);
        }
    }

    if (!performance.memory || !performance.memory.usedJSHeapSize) return null;

    return performance.memory.usedJSHeapSize / 1024 / 1024;
}

async function checkMemoryUsage() {
    const usedMB = await getMemoryUsageMB();

    if (!usedMB) return;

    if (usedMB > memoryLimitMB) {
        showMemoryToast(usedMB);
    }
}

function startMonitoring() {
    loadSettings();
    setInterval(checkMemoryUsage, CHECK_INTERVAL);
}

chrome.storage.onChanged.addListener((changes) => {
    if (changes.memoryLimit) {
        memoryLimitMB = normalizeLimit(changes.memoryLimit.newValue);
    }

    if (changes.toastPosition) {
        toastPosition = changes.toastPosition.newValue || "bottom-right";
        createToastContainer();
    }
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "MEMORY_ALERT") {
        showMemoryToast(msg.value);
    }
});

startMonitoring();
