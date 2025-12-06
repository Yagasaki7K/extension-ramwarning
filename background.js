const CHECK_INTERVAL = 3000;

async function checkMemory() {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tabs.length) return;

    const tab = tabs[0];

    chrome.storage.sync.get(["memoryLimit"], async ({ memoryLimit }) => {
        let limit = memoryLimit || 1024; // Default to 1024MB (1GB)
        const isLegacyGBValue = memoryLimit && memoryLimit < 50;

        if (isLegacyGBValue) {
            limit = memoryLimit * 1024;

            chrome.storage.sync.set({ memoryLimit: limit });
        }

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

                    const usedMB = usedBytes / 1024 / 1024;

                    if (usedMB > limit) {
                        chrome.tabs.sendMessage(tab.id, {
                            type: "MEMORY_ALERT",
                            value: usedMB,
                        });
                    }
                },
            );
        });
    });
}

setInterval(checkMemory, CHECK_INTERVAL);
