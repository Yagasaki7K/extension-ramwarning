const CHECK_INTERVAL_MS = 10_000;

function normalizeLimit(limit) {
    if (!Number.isFinite(limit)) return 1024;

    return limit < 50 ? limit * 1024 : limit;
}

async function fetchMemoryUsage(tabId) {
    try {
        const [result] = await chrome.scripting.executeScript({
            target: { tabId },
            func: () => performance?.memory?.usedJSHeapSize ?? null,
        });

        return result?.result ?? null;
    } catch (error) {
        console.warn("Memory Watcher: failed to read memory usage", error);
        return null;
    }
}

async function checkMemoryForActiveTab() {
    const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!activeTab) return;

    const { memoryLimit } = await chrome.storage.sync.get(["memoryLimit"]);
    const limitMB = normalizeLimit(memoryLimit);
    const usedBytes = await fetchMemoryUsage(activeTab.id);

    if (!usedBytes) return;

    const usedMB = usedBytes / 1024 / 1024;

    if (usedMB > limitMB) {
        chrome.tabs.sendMessage(activeTab.id, {
            type: "MEMORY_ALERT",
            value: usedMB,
        });
    }
}

setInterval(checkMemoryForActiveTab, CHECK_INTERVAL_MS);
