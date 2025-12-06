const limitInput = document.getElementById("limit");
const positionInput = document.getElementById("position");
const saveBtn = document.getElementById("save");
const previewBtn = document.getElementById("preview");

// Load existing settings
chrome.storage.sync.get(["memoryLimit", "toastPosition"], ({ memoryLimit, toastPosition }) => {
    let normalizedLimit = memoryLimit || 1024;

    if (memoryLimit && memoryLimit < 50) {
        normalizedLimit = memoryLimit * 1024;
        chrome.storage.sync.set({ memoryLimit: normalizedLimit });
    }

    const formattedLimit = Number(normalizedLimit);

    limitInput.value = Number.isFinite(formattedLimit) ? formattedLimit.toString() : "";
    positionInput.value = toastPosition || "bottom-right";
});

// Save settings
saveBtn.onclick = () => {
    const parsedLimit = Number.parseFloat(limitInput.value);
    const sanitizedLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 1024;

    chrome.storage.sync.set({
        memoryLimit: sanitizedLimit,
        toastPosition: positionInput.value,
    });

    limitInput.value = sanitizedLimit;
    showLocalToast("Settings saved!");
};

previewBtn.onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "MEMORY_ALERT",
            value: 1100, // Fake preview in MB
        });
    });

    showLocalToast("Preview sent to active tab");
};

function showLocalToast(msg) {
    let box = document.createElement("div");
    box.className = "options-toast";
    box.innerText = msg;

    document.body.appendChild(box);

    setTimeout(() => box.classList.add("show"), 10);
    setTimeout(() => {
        box.classList.remove("show");
        setTimeout(() => box.remove(), 400);
    }, 2500);
}
