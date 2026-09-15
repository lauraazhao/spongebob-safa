# Safa's 24th Birthday Page

A mobile-first, dependency-free birthday page ready to host on GitHub Pages.

## Preview locally

Open `index.html` in a browser, or run a simple local server from this folder:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Add the real audio messages

1. Create an `assets/audio` folder.
2. Add your audio files (MP3 is the most broadly supported format).
3. In `script.js`, replace each character's `audioSrc: null` with its relative file path, for example:

```js
audioSrc: "assets/audio/momo.mp3",
```

Until real files are configured, the browser's built-in speech feature reads each placeholder message aloud. The visible `message` text in `script.js` can also be changed at any time.

## Publish free with GitHub Pages

1. Push this folder to a GitHub repository.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your main branch and the `/ (root)` folder, then click **Save**.

GitHub will show the public URL after deployment finishes. No build command is required.