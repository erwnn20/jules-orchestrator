// @ts-check
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const exePath = path.join(root, 'release', 'win-unpacked', 'Jules Orchestrator.exe');
const shortcutPath = path.join(root, 'Jules Orchestrator.lnk');

if (!fs.existsSync(exePath)) {
  console.error(`Executable not found: ${exePath}`);
  process.exit(1);
}

const psScript = [
  `$ws = New-Object -ComObject WScript.Shell`,
  `$sc = $ws.CreateShortcut('${shortcutPath}')`,
  `$sc.TargetPath = '${exePath}'`,
  `$sc.WorkingDirectory = '${path.dirname(exePath)}'`,
  `$sc.Save()`,
].join('; ');

execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', psScript], {
  stdio: 'inherit',
});

console.log(`Shortcut created: ${shortcutPath}`);
