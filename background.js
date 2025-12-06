const CHECK_INTERVAL = 3000;

async function checkMemory() {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tabs.length) return;

    const tab = tabs[0];

    chrome.storage.sync.get(["memoryLimit"], async ({ memoryLimit }) => {
        const limit = memoryLimit || 1; // 1GB default

        chrome.system.memory.getInfo((info) => {
            // performance.memory is enabled
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    func: () => (performance.memory ? performance.memory.usedJSHeapSize : null),
                },
                (result) => {
                    const usedBytes = result?.[0]?.result;

                    if (!usedBytes) return;

                    const usedGB = usedBytes / 1024 / 1024 / 1024;

                    if (usedGB > limit) {
                        chrome.tabs.sendMessage(tab.id, {
                            type: "MEMORY_ALERT",
                            value: usedGB,
                        });
                    }
                },
            );
        });
    });
}

setInterval(checkMemory, CHECK_INTERVAL);
