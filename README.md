# sniffer

A simple CLI tool to scan your package.json and flag suspicious dependencies before you install or run a project.

## Why sniffer?

Most developers install dependencies without thinking twice. Attackers are now using fake repositories, job interview assignments, and social engineering to introduce malicious or suspicious packages. sniffer helps you review dependencies before executing a project.

## Features

- Scans dependencies and devDependencies  
- Flags low-trust packages (low downloads or few maintainers)  
- Detects unusual or unnecessary packages  
- Lightweight and fast  

## Installation

npm install -g pkg-sniffer-cli

or

npx pkg-sniffer-cli

## Usage

pkg-sniffer-cli scan

## Example Output

Scanning dependencies...

Suspicious packages detected — please review them before proceeding.

1. lodas@1.0.0  
   - Downloads: 42  
   - Maintainers: 1  

2. fs@0.0.1-security  
   - Built-in module — no need to install  

## Commands

pkg-sniffer-cli scan      scan dependencies  
pkg-sniffer-cli help      show help  

## How it works

sniffer checks weekly downloads, maintainer count, and unusual or unnecessary packages. It does not replace npm audit. It highlights packages that may require manual review.

## Disclaimer

sniffer does not guarantee that a package is malicious. It highlights packages that may require closer inspection. Always verify dependencies before installing them.

## Contributing

Contributions are welcome.

## License

MIT
