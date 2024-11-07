
# 🌙 NoSleep Svelte App

A simple and user-friendly Svelte app designed to prevent your device from sleeping. The NoSleep app uses the Wake Lock API to keep the screen awake, with notifications to alert users if the wake lock is released due to system constraints. Built with Svelte and TailwindCSS, it offers a smooth, responsive experience with dark mode support.

## 🚀 Features

- **Enable NoSleep™**: Activate wake lock to prevent your device from sleeping.
- **Notification Alerts**: Receive alerts when wake lock is disabled, allowing you to re-enable it quickly.
- **Popup Messages**: Informative popups guide the user through permissions and status changes.
- **Dark Mode Support**: Optimized for light and dark themes with TailwindCSS.
- **Progressive Enhancement**: Detects and handles unsupported Wake Lock API cases gracefully.

## 🎯 Live Demo

Check out the live demo here: [NoSleep Svelte App Demo](https://nosleep.skript.zip/)

## 🛠️ Usage

1. Click "Enable NoSleep™" to keep the device awake.
2. Allow notifications if prompted, so you’re alerted if wake lock is released.
3. View status updates and popup messages as the app keeps your device awake.

## 📦 Installation

Clone the Repository:

```bash
git clone https://github.com/CodeskStudio/nosleep-svelte-app.git
cd nosleep-svelte-app
```

Install Dependencies:

```bash
npm install
```

Run the App:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## 📦 Building and Deploying

Follow these steps to build and deploy this Svelte + Vite application.

- Configure the Base Path (if needed)

  If your app will be hosted on a subpath (e.g., `https://example.com/myapp/`), update the `base` property in `vite.config.js`:

  ```js
  // vite.config.js
  import { defineConfig } from 'vite';
  import { svelte } from '@sveltejs/vite-plugin-svelte';

  export default defineConfig({
    plugins: [svelte()],
    base: '/myapp/'  // Replace '/myapp/' with your subpath or '/' if hosting at root
  });
  ```

  If hosting at the root (e.g., `https://example.com/`), you can skip this step.

- Build the Project

  Run the following command to build the app:

  ```bash
  npm run build
  ```

  This will generate an optimized, production-ready version of your app in a folder called `dist`.


## 📁 Project Structure

```
nosleep-svelte-app/
├── public/
│   ├── favicon.ico
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── Footer.svelte
│   │   ├── NotificationButton.svelte
│   │   ├── Popup.svelte
│   │   └── WakeLockButton.svelte
│   ├── App.svelte
│   ├── index.css
│   └── main.js
├── .gitignore
├── index.html
├── package.json
├── svelte.config.js
├── tailwind.config.js
└── vite.config.js
```

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Make your changes and commit: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-branch-name`.
5. Open a pull request.

## 📜 License

This project is licensed under the MIT License.

## 📝 Acknowledgments

Special thanks to all contributors aka. ChatGPT and to Svelte & TailwindCSS for making development straightforward and enjoyable!