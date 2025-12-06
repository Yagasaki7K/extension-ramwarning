const limitInput = document.getElementById("limit");
const positionInput = document.getElementById("position");
const saveBtn = document.getElementById("save");
const previewBtn = document.getElementById("preview");

// Load existing settings
chrome.storage.sync.get(["memoryLimit", "toastPosition"], ({ memoryLimit, toastPosition }) => {
    limitInput.value = memoryLimit || 1;
    positionInput.value = toastPosition || "bottom-right";
});

// Save settings
saveBtn.onclick = () => {
    chrome.storage.sync.set({
        memoryLimit: parseFloat(limitInput.value),
        toastPosition: positionInput.value,
    });

    showLocalToast("Settings saved!");
};

previewBtn.onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "MEMORY_ALERT",
            value: 1.07, // Fake preview
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
