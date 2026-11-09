<p align="center">
  <img src="branding/yap-logo-black.png#gh-light-mode-only" alt="Yap" width="140">
  <img src="branding/yap-logo-white.png#gh-dark-mode-only" alt="Yap" width="140">
</p>

<h1 align="center">Yap</h1>

<p align="center">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-black.svg"></a>
  <a href="https://github.com/itxahmaddev/yap/releases"><img alt="Release" src="https://img.shields.io/github/v/release/itxahmaddev/yap?include_prereleases&color=black"></a>
  <a href="https://github.com/itxahmaddev/yap/actions"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/itxahmaddev/yap/code-quality.yml?branch=main&color=black"></a>
  <img alt="Platforms" src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-black">
  <a href="CONTRIBUTING.md"><img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-black.svg"></a>
</p>

**A free, open source, and extensible speech-to-text application that works completely offline.**

Yap is a cross-platform desktop application that provides simple, privacy-focused speech transcription. Press a shortcut, speak, and have your words appear in any text field. This happens on your own computer without sending any information to the cloud.

## Why Yap?

Yap was created to fill the gap for a truly open source, extensible speech-to-text tool. Yap's principles:

- **Free**: Accessibility tooling belongs in everyone's hands, not behind a paywall
- **Open Source**: Together we can build further. Extend Yap for yourself and contribute to something bigger
- **Private**: Your voice stays on your computer. Get transcriptions without sending audio to the cloud
- **Simple**: One tool, one job. Transcribe what you say and put it into a text box

## How It Works

1. **Press** a configurable keyboard shortcut: hold it to record and release to stop, or tap it to toggle recording on and off (Hold-only and Toggle-only modes are also available)
2. **Speak** your words while the shortcut is active
3. **Release** and Yap processes your speech using Whisper
4. **Get** your transcribed text pasted directly into whatever app you're using

The process is entirely local:

- Silence is filtered using VAD (Voice Activity Detection) with Silero
- Transcription uses your choice of models:
  - **Whisper models** (Small/Medium/Turbo/Large) with GPU acceleration when available
  - **Parakeet V3** - CPU-optimized model with excellent performance and automatic language detection
- Works on Windows, macOS, and Linux

## Quick Start

### Installation

1. Download the latest release from the [releases page](https://github.com/itxahmaddev/yap/releases)
   - **Debian/Ubuntu**: Install the downloaded `.deb` with APT so required dependencies are installed automatically:
     ```bash
     sudo apt install ./Yap_*.deb
     ```
     Do not use `dpkg -i` unless the dependencies are already installed. If you already used it, run `sudo apt --fix-broken install`.
2. Install the application
3. Launch Yap and grant necessary system permissions (microphone, accessibility)
4. Configure your preferred keyboard shortcuts in Settings
5. Start transcribing!

### Development Setup

For detailed build instructions including platform-specific requirements, see [BUILD.md](BUILD.md).

### Debug Mode

Yap includes an advanced debug mode for development and troubleshooting. Access it by pressing:

- **macOS**: `Cmd+Shift+D`
- **Windows/Linux**: `Ctrl+Shift+D`

### CLI Parameters

Yap supports command-line flags for controlling a running instance and customizing startup behavior. These work on all platforms (macOS, Windows, Linux). Largely this is a beta feature.

**Remote control flags** (sent to an already-running instance via the single-instance plugin):

```bash
yap --toggle-transcription    # Toggle recording on/off
yap --toggle-post-process     # Toggle recording with post-processing on/off
yap --cancel                  # Cancel the current operation
```

**Startup flags:**

```bash
yap --start-hidden            # Start without showing the main window
yap --no-tray                 # Start without the system tray icon
yap --debug                   # Enable debug mode with verbose logging
yap --help                    # Show all available flags
```

Flags can be combined for autostart scenarios:

```bash
yap --start-hidden --no-tray
```

> **macOS tip:** When Yap is installed as an app bundle, invoke the binary directly:
>
> ```bash
> /Applications/Yap.app/Contents/MacOS/Yap --toggle-transcription
> ```

### Transcription hook

Advanced users on macOS and Linux can rewrite text right before Yap pastes it. Put an executable at `hooks/transcription` in Yap's app data folder (`~/Library/Application Support/com.itxahmaddev.yap/` on macOS, `~/.local/share/com.itxahmaddev.yap/` on Linux). Yap writes the text to its stdin, after any LLM post-processing, and pastes its stdout. One trailing newline is removed, and empty output pastes nothing. If the hook fails or runs longer than 30 seconds, the original text is pasted.

The hook doesn't get your shell's `PATH`: on macOS, Yap started from the Dock or Finder only sees `/usr/bin:/bin:/usr/sbin:/sbin`. Use absolute paths for anything else, such as `/opt/homebrew/bin/opencc`.

Example that prefixes `#` when Terminal is the frontmost app (macOS):

```bash
mkdir -p ~/Library/Application\ Support/com.itxahmaddev.yap/hooks
cd ~/Library/Application\ Support/com.itxahmaddev.yap/hooks
cat > transcription << 'EOF'
#!/bin/bash
app=$(osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true')
if [ "$app" = "Terminal" ]; then echo "# $(cat)"; else cat; fi
EOF
chmod +x transcription
```

## Known Issues & Current Limitations

This project is actively being developed and has some [known issues](https://github.com/itxahmaddev/yap/issues). We believe in transparency about the current state:

### Bluetooth Headset Microphones (macOS)

Using a Bluetooth headset microphone on macOS may temporarily reduce playback quality or volume while recording because Bluetooth switches to bidirectional audio. Keep your headphones as the output device and select your Mac's built-in or an external microphone in Yap to avoid this.

### fn and Globe Key Shortcuts (macOS)

Shortcuts that include the `fn` (Globe) key **only work on Apple keyboards** — your Mac's built-in keyboard or an Apple external keyboard. They will never trigger on a third-party keyboard, even while it is connected to the same Mac.

This is a hardware limitation rather than a Yap bug. `fn` is not part of the standard USB HID keyboard specification: Apple reports it through a vendor-specific usage that macOS honors only from Apple devices, while third-party keyboards handle their `Fn` key entirely in firmware and send nothing to the computer. There is no event for Yap to listen for.

If you switch between a MacBook keyboard and an external one, pick a shortcut built from standard modifiers (`ctrl`, `option`, `shift`, `command`) or a regular key instead.

### Linux Notes

**Text Input Tools:**

For reliable text input on Linux, install the appropriate tool for your display server:

| Display Server | Recommended Tool | Install Command                                    |
| -------------- | ---------------- | -------------------------------------------------- |
| X11            | `xdotool`        | `sudo apt install xdotool`                         |
| Wayland        | `wtype`          | `sudo apt install wtype`                           |
| Both           | `dotool`         | `sudo apt install dotool` (requires `input` group) |

- **X11**: Install `xdotool` for both direct typing and clipboard paste shortcuts
- **Ubuntu 26.04**: Has Wayland display server by default. `wtype` does not work, you need to install `ydotool` and configure systemd as described [here](https://github.com/itxahmaddev/yap/pull/557#issuecomment-3781249267).
- **Wayland**: Install `wtype` (preferred) or `dotool` for text input to work correctly
- **dotool setup**: Requires adding your user to the `input` group: `sudo usermod -aG input $USER` (then log out and back in)

Without these tools, Yap falls back to enigo which may have limited compatibility, especially on Wayland.

**Wayland Support (Linux):**

- Limited support for Wayland display server
- Requires [`wtype`](https://github.com/atx/wtype) or [`dotool`](https://sr.ht/~geb/dotool/) for text input to work correctly (see [Linux Notes](#linux-notes) below for installation)

**Other Notes:**

- **Runtime library dependency (`libgtk-layer-shell.so.0`)**:
  - Yap links `gtk-layer-shell` on Linux. If startup fails with `error while loading shared libraries: libgtk-layer-shell.so.0`, install the runtime package for your distro:

    | Distro        | Package to install    | Example command                        |
    | ------------- | --------------------- | -------------------------------------- |
    | Ubuntu/Debian | `libgtk-layer-shell0` | `sudo apt install libgtk-layer-shell0` |
    | Fedora/RHEL   | `gtk-layer-shell`     | `sudo dnf install gtk-layer-shell`     |
    | Arch Linux    | `gtk-layer-shell`     | `sudo pacman -S gtk-layer-shell`       |

  - For building from source on Ubuntu/Debian, you may also need `libgtk-layer-shell-dev`.

- The recording overlay is disabled by default on Linux (`Overlay Position: None`) because certain compositors treat it as the active window. When the overlay is visible it can steal focus, which prevents Yap from pasting back into the application that triggered transcription. If you enable the overlay anyway, be aware that clipboard-based pasting might fail or end up in the wrong window.
- Yap picks the WebKit renderer on Linux from the linked WebKitGTK version: 2.54 and newer keep the compositor on shared memory (`WEBKIT_DMABUF_RENDERER_FORCE_SHM=1`), older releases disable DMA-BUF rendering (`WEBKIT_DISABLE_DMABUF_RENDERER=1`). Explicit values for either variable are preserved. For rendering workarounds, see [Troubleshooting → Configure the WebKit renderer](#3-configure-the-webkit-renderer).
- If Yap fails to start reliably on Linux, see [Troubleshooting → Linux Startup Crashes or Instability](#linux-startup-crashes-or-instability).
- **Global keyboard shortcuts (Wayland):** On Wayland, system-level shortcuts must be configured through your desktop environment or window manager. Use the [CLI flags](#cli-parameters) as the command for your custom shortcut.

  **GNOME:**
  1. Open **Settings > Keyboard > Keyboard Shortcuts > Custom Shortcuts**
  2. Click the **+** button to add a new shortcut
  3. Set the **Name** to `Toggle Yap Transcription`
  4. Set the **Command** to `yap --toggle-transcription`
  5. Click **Set Shortcut** and press your desired key combination (e.g., `Super+O`)

  **KDE Plasma:**
  1. Open **System Settings > Shortcuts > Custom Shortcuts**
  2. Click **Edit > New > Global Shortcut > Command/URL**
  3. Name it `Toggle Yap Transcription`
  4. In the **Trigger** tab, set your desired key combination
  5. In the **Action** tab, set the command to `yap --toggle-transcription`

  **Sway / i3:**

  Add to your config file (`~/.config/sway/config` or `~/.config/i3/config`):

  ```ini
  bindsym $mod+o exec yap --toggle-transcription
  ```

  **Hyprland:**

  Add to your config file (`~/.config/hypr/hyprland.conf`):

  ```ini
  bind = $mainMod, O, exec, yap --toggle-transcription
  ```

- You can also trigger Yap externally via Unix signals or the CLI flags, which lets Wayland window managers or other hotkey daemons keep ownership of keybindings:

  | Action                                    | Trigger                                              |
  | ----------------------------------------- | ---------------------------------------------------- |
  | Toggle transcription                      | `pkill -USR2 -n yap` or `yap --toggle-transcription` |
  | Toggle transcription with post-processing | `yap --toggle-post-process`                          |

  Example Sway config:

  ```ini
  bindsym $mod+o exec pkill -USR2 -n yap
  bindsym $mod+p exec yap --toggle-post-process
  ```

  `pkill` here simply delivers the signal—it does not terminate the process.

  > **Behavior change:** older releases also accepted `SIGUSR1` for toggling transcription with post-processing. WebKitGTK — the webview engine embedded in Yap on Linux — uses SIGUSR1 internally to coordinate JavaScript garbage collection, so listening for it caused phantom recordings and interrupted dictations every few minutes ([#1660](https://github.com/itxahmaddev/yap/issues/1660)). Yap no longer listens for SIGUSR1 on Linux; the post-processing toggle is still available via `yap --toggle-post-process`. **Remove any `pkill -USR1` bindings**: the signal is now delivered straight to WebKit's internal handler and can crash the app.

**Overlay & Pasting Issues (Linux):**

- The recording overlay window can interfere with pasting transcribed text into target applications on Linux (X11)
- **Solution:** Open **Settings > Advanced** and set **"Overlay Position"** to **"None"** to disable the overlay
- Enable **"Audio Feedback"** (also in Advanced) if you still want audible confirmation of recording state
- Users who upgrade from older versions or import settings from other platforms may need to manually apply this change

## Troubleshooting

### Previous Clipboard Content Is Pasted Instead of the Transcription

If the transcription is correct in **History** but Yap inserts text you copied earlier, this is a clipboard timing issue. With the standard clipboard paste method, Yap restores your previous clipboard after a fixed delay. Under load, the receiving application may read the clipboard only after that restoration.

1. Open Yap's settings window and press `Cmd+Shift+D` (macOS) or `Ctrl+Shift+D` (Windows/Linux) to reveal **Debug**.
2. On **macOS and Windows**, try **Reliable Paste (Beta)** in Debug with a clipboard paste method selected. It uses clipboard read notifications to delay restoration instead of relying on the standard fixed delay. Test it in the application where the problem occurs; it is still experimental.
3. If Reliable Paste is disabled or unavailable, increase **Paste Delay (After)** in Debug and test again. This controls the wait before restoring your previous clipboard. **Paste Delay (Before)** controls the wait before sending the paste keystroke and addresses a different part of the operation. These delay settings apply to the standard paste path, not Reliable Paste.

If the problem persists, add your Yap version, operating system, receiving application, paste method, Reliable Paste setting, and before/after delays to the existing issue. Redact private dictated text before sharing logs.

### Manual Model Installation (For Proxy Users or Network Restrictions)

If you're behind a proxy, firewall, or in a restricted network environment where Yap cannot download models automatically, you can manually download and install them. The URLs are publicly accessible from any browser.

#### Step 1: Find Your App Data Directory

1. Open Yap settings
2. Navigate to the **About** section
3. Copy the "App Data Directory" path shown there, or use the shortcuts:
   - **macOS**: `Cmd+Shift+D` to open debug menu
   - **Windows/Linux**: `Ctrl+Shift+D` to open debug menu

The typical paths are:

- **macOS**: `~/Library/Application Support/com.itxahmaddev.yap/`
- **Windows**: `C:\Users\{username}\AppData\Roaming\com.itxahmaddev.yap\`
- **Linux**: `~/.config/com.itxahmaddev.yap/`

#### Step 2: Create Models Directory

Inside your app data directory, create a `models` folder if it doesn't already exist:

```bash
# macOS/Linux
mkdir -p ~/Library/Application\ Support/com.itxahmaddev.yap/models

# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "$env:APPDATA\com.itxahmaddev.yap\models"
```

#### Step 3: Download Model Files

Download the models you want from below

**Whisper Models (single .bin files):**

- Small (487 MB): `https://blob.handy.computer/ggml-small.bin`
- Medium (492 MB): `https://blob.handy.computer/whisper-medium-q4_1.bin`
- Turbo (1600 MB): `https://blob.handy.computer/ggml-large-v3-turbo.bin`
- Large (1100 MB): `https://blob.handy.computer/ggml-large-v3-q5_0.bin`

**Parakeet Unified EN 0.6B (single `.gguf` file, recommended):**

- Q8_0 (731 MB): `https://huggingface.co/handy-computer/parakeet-unified-en-0.6b-gguf/resolve/main/parakeet-unified-en-0.6b-Q8_0.gguf`

#### Step 4: Install Models

**For Whisper Models (.bin files):**

Simply place the `.bin` file directly into the `models` directory:

```
{app_data_dir}/models/
├── ggml-small.bin
├── whisper-medium-q4_1.bin
├── ggml-large-v3-turbo.bin
└── ggml-large-v3-q5_0.bin
```

**For GGUF Models (.gguf files):**

Place the `.gguf` file directly into the `models` directory, exactly like the Whisper `.bin` files above. Yap also picks up models already present in the shared Hugging Face cache (`~/.cache/huggingface/hub`), so a copy downloaded by another tool works without being moved.

**Important Notes:**

- Do not rename the `.bin` or `.gguf` files—use the exact filenames from the download URLs
- After placing the files, restart Yap to detect the new models

#### Step 5: Verify Installation

1. Restart Yap
2. Open Settings → Models
3. Your manually installed models should now appear as "Downloaded"
4. Select the model you want to use and test transcription

### Custom Whisper Models

Yap can auto-discover custom Whisper GGML models placed in the `models` directory. This is useful for users who want to use fine-tuned or community models not included in the default model list.

**How to use:**

1. Obtain a Whisper model in GGML `.bin` format (e.g., from [Hugging Face](https://huggingface.co/models?search=whisper%20ggml))
2. Place the `.bin` file in your `models` directory (see paths above)
3. Restart Yap to discover the new model
4. The model will appear in the "Custom Models" section of the Models settings page

**Important:**

- Community models are user-provided and may not receive troubleshooting assistance
- The model must be a valid Whisper GGML format (`.bin` file)
- Model name is derived from the filename (e.g., `my-custom-model.bin` → "My Custom Model")

### Linux Startup Crashes or Instability

If Yap fails to start reliably on Linux — for example, it crashes shortly after launch, never shows its window, or reports a Wayland protocol error — try the steps below in order.

**1. Install (or reinstall) `gtk-layer-shell`**

Yap uses `gtk-layer-shell` for its recording overlay and links against it at runtime. A missing or broken installation is the most common cause of startup failures and can manifest as a crash or a hang well before any window is shown. Make sure the runtime package is installed for your distro:

| Distro        | Package to install    | Example command                        |
| ------------- | --------------------- | -------------------------------------- |
| Ubuntu/Debian | `libgtk-layer-shell0` | `sudo apt install libgtk-layer-shell0` |
| Fedora/RHEL   | `gtk-layer-shell`     | `sudo dnf install gtk-layer-shell`     |
| Arch Linux    | `gtk-layer-shell`     | `sudo pacman -S gtk-layer-shell`       |

If it is already installed and you still see startup problems, try reinstalling it (e.g. `sudo pacman -S gtk-layer-shell` again) in case the library files were corrupted by a partial upgrade.

**2. Disable the GTK layer shell overlay (`YAP_NO_GTK_LAYER_SHELL`)**

If installing the library does not help, you can skip `gtk-layer-shell` initialization entirely as a workaround. On some compositors (notably KDE Plasma under Wayland) it has been reported to interact poorly with the recording overlay. With this variable set, the overlay falls back to a regular always-on-top window:

```bash
YAP_NO_GTK_LAYER_SHELL=1 yap
```

**3. Configure the WebKit renderer (`WEBKIT_DISABLE_DMABUF_RENDERER` / `WEBKIT_DMABUF_RENDERER_FORCE_SHM`)**

Yap picks the renderer at startup from the WebKitGTK build it links, because the DMA-BUF renderer crashes on some GPU/driver combinations but the non-composited fallback loses pixels on the 2.54 series:

- **WebKitGTK 2.54 and newer:** the compositor stays enabled and is forced onto shared memory with `WEBKIT_DMABUF_RENDERER_FORCE_SHM=1`. 2.54 composites only the damaged region of every frame, so the previous workaround (`WEBKIT_DISABLE_DMABUF_RENDERER=1`) left transparent windows — such as the recording overlay — showing only their animated parts ([#2166](https://github.com/itxahmaddev/yap/issues/2166)).
- **Older releases:** DMA-BUF rendering is disabled with `WEBKIT_DISABLE_DMABUF_RENDERER=1`, which can cause blank windows but matches the previous behavior.

Explicit environment-variable values are preserved:

```bash
# Force the legacy non-composited renderer (2.54: partial frames may reappear)
WEBKIT_DISABLE_DMABUF_RENDERER=1 yap

# Keep the compositor on shared memory (the 2.54 default below)
WEBKIT_DMABUF_RENDERER_FORCE_SHM=1 yap

# Let WebKit use DMA-BUF when supported (may reintroduce the GPU/driver crashes)
WEBKIT_DISABLE_DMABUF_RENDERER=0 yap
```

Fully quit Yap, including its tray instance, before testing a value. Running a second instance with `--toggle-transcription` does not change the running process's environment.

**Making a workaround permanent**

Set the variable in the environment of the launcher that actually starts Yap. Shell profile exports may not apply to desktop-menu or autostart launches. If you launch Yap from a `.desktop` file, you can prefix the `Exec=` line, e.g.:

```ini
Exec=env YAP_NO_GTK_LAYER_SHELL=1 yap
```

Yap's built-in autostart rewrites its generated desktop entry, so editing that entry is not a durable workaround. For autostart, use an appropriate session/service environment, or disable Yap's built-in autostart and manage your own startup entry with the required variable.

If a workaround helps you, please [open an issue](https://github.com/itxahmaddev/yap/issues) describing your distro, desktop environment, and session type — that information helps us narrow down the underlying bug.

### Empty recording overlay on Hyprland / Omarchy

If the recording overlay is empty or bordered, fully quit Yap and launch a
[native installation](BUILD.md#linux-install-from-source) with Wayland enabled:

```bash
env -u YAP_NO_GTK_LAYER_SHELL GDK_BACKEND=wayland yap
```

If this works, apply `GDK_BACKEND=wayland` only to Yap's launcher. This
workaround does not work with the 0.9.6 AppImage, which forces X11.

### Vulkan Overlays and Capture Tools on Windows (`YAP_KEEP_VULKAN_IMPLICIT_LAYERS`)

On Windows, Yap asks the Vulkan loader to skip implicit layers to avoid crashes caused by overlay and capture hooks ([#2049](https://github.com/itxahmaddev/yap/issues/2049)). GPU acceleration remains enabled; this does not change system-wide settings.

To opt out for GPU selection or debugging tools, fully quit Yap (including the tray icon), then run both commands in the same PowerShell window:

```powershell
$env:YAP_KEEP_VULKAN_IMPLICIT_LAYERS = "1"
& "$env:ProgramFiles\Yap\yap.exe"
```

Adjust the executable path if needed. This override only applies to apps launched from that PowerShell session, not the Start menu. Yap also preserves any existing `VK_LOADER_LAYERS_DISABLE` value.

### How to Contribute

1. **Check existing issues** at [github.com/itxahmaddev/yap/issues](https://github.com/itxahmaddev/yap/issues)
2. **Fork the repository** and create a feature branch
3. **Test thoroughly** on your target platform
4. **Submit a pull request** with clear description of changes
5. **Join the discussion** - reach out at [itxahmad.dev@gmail.com](mailto:itxahmad.dev@gmail.com)

The goal is to create both a useful tool and a foundation for others to build upon—a well-patterned, simple codebase that serves the community.

## License

MIT License - see [LICENSE](LICENSE) file for details.

Yap is open-source software, but the Yap name, logo, icon, and brand assets are not open-source. Unofficial forks, rewrites, and redistributions must use their own branding and must not imply endorsement or affiliation.

## Acknowledgments

- **Whisper** by OpenAI for the speech recognition model
- **ggml** for an amazing cross-platform tensor library
- **Silero** for great lightweight VAD
- **Tauri** team for the excellent Rust-based app framework
- **Community contributors** helping make Yap better
- **[Handy](https://github.com/cjpais/Handy)** by CJ Pais, the MIT-licensed project Yap is based on
