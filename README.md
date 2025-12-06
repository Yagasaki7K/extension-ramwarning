<p align="center"><img width="1915" height="959" alt="image" src="https://github.com/user-attachments/assets/9d8cfa0b-9a6d-4677-8ee5-1001b5f45571" /></p>

# **Memory Watcher – Chrome Extension**

Memory Watcher is a lightweight Google Chrome extension that monitors the **JavaScript heap memory usage** of the active tab and alerts the user when usage exceeds a configurable threshold.
It displays a **toast-style notification**, inspired by **Sonner**, with a red background and white text.

Perfect for developers, power users, or anyone who needs to monitor memory leaks or heavy web applications in real time.

---

## 🚀 **Features**

- Monitors memory usage of the current browser tab
- Toast notification when memory exceeds the configured limit
- Customizable settings:
- Memory limit (in MB)
    - Toast position (bottom-right, bottom-left, top-right, top-left)

- Uses Chrome’s `performance.memory` API when available
- Clean UI with red (#ff4444) background alerts
- Zero external dependencies

---

## 📦 **How to Install (Development Mode)**

1. Clone the repository:

    ```sh
    git clone https://github.com/Yagasaki7K/extension-ramwarning.git
    cd extension-ramwarning
    ```

2. Open Google Chrome and go to:

    ```
    chrome://extensions/
    ```

3. Enable **Developer Mode** (top-right corner).

4. Click **Load unpacked**.

5. Select the folder:

    ```
    extension-ramwarning/
    ```

6. The extension will appear in your extensions list and is now active.

---

## ⚙️ **How to Use**

### 1. Configure the Extension

Open the extension settings:

- Go to `chrome://extensions/`
- Find **Memory Watcher**
- Click **Details**
- Click **Extension options**

From there you can:

- Set memory threshold (default: **1024 MB (1 GB)**)
- Choose toast notification position

### 2. View Memory Alerts

Simply browse any website.
When the heap memory of the current tab exceeds your defined limit, you’ll see a toast like:

```
⚠️ Memory usage: 1100MB (exceeds limit)
```

<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/0ba582b1-20f0-4a92-a130-9ea8c02accc8" 
    alt="Preview of Memory Watcher Extension"
    width="521"
    height="428"
  />
</p>

This toast has:

- Red background (#ff4444)
- White text
- Auto fade-out

---

## 🧪 **How It Works**

A background script monitors memory usage periodically and sends a message to the content script whenever the threshold is exceeded.

The content script then injects a minimal toast container into the page and renders the alert UI.

The extension uses:

- `performance.memory.usedJSHeapSize`
- `chrome.system.memory` as fallback
- `chrome.storage.sync` for settings persistence

---

## 🤝 **Contributing**

Pull requests are welcome!
Here’s how you can contribute:

### 1. Fork the project

Click the “Fork” button on GitHub to create your own copy.

### 2. Create a new branch

```sh
git checkout -b feature/my-new-feature
```

### 3. Make your changes

Add improvements, fix bugs, or extend functionality.

### 4. Commit your changes

```sh
git commit -m "Add feature: my new feature"
```

### 5. Push to your fork

```sh
git push origin feature/my-new-feature
```

### 6. Open a Pull Request

Go to the original repository and submit a PR describing:

- What you changed
- Why the change is useful
- Any details needed for review

## 📄 License

MIT License — feel free to use, modify, and distribute.
