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

<p align="center">
  <a href="https://yap-speech.vercel.app"><strong>yap-speech.vercel.app</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/itxahmaddev/yap/releases/latest">Download</a>
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

1. Download the latest release from the [website](https://yap-speech.vercel.app) or the [releases page](https://github.com/itxahmaddev/yap/releases)
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

For detailed build instructions including platform-specific requirements, see [BUILD.md](docs/BUILD.md).

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

## Troubleshooting

Known issues, Linux/Wayland notes, manual model installation, and platform-specific fixes are in [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

## Contributing

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
