const limitInput = document.getElementById("limit");
const positionInput = document.getElementById("position");
const saveBtn = document.getElementById("save");

chrome.storage.sync.get(["memoryLimit", "toastPosition"], ({ memoryLimit, toastPosition }) => {
    limitInput.value = memoryLimit || 1;
    positionInput.value = toastPosition || "bottom-right";
});

saveBtn.onclick = () => {
    chrome.storage.sync.set(
        {
            memoryLimit: parseFloat(limitInput.value),
            toastPosition: positionInput.value,
        },
        () => {
            alert("Settings saved!");
        },
    );
};
