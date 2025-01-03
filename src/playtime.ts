import * as vscode from "vscode";

let playTimeBar: vscode.StatusBarItem;
let playSeconds = 0;
let playTimeTimer: NodeJS.Timeout | null = null;

export function initializePlayTimeBar(context: vscode.ExtensionContext) {
  playTimeBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    99
  );
  playTimeBar.text = `🕒 Playtime: 00:00:00`;
  playTimeBar.color = "#32CD32";
  playTimeBar.show();

  playTimeTimer = setInterval(() => {
    playSeconds += 1;
    const hours = Math.floor(playSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((playSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (playSeconds % 60).toString().padStart(2, "0");
    playTimeBar.text = `🕒 Playtime: ${hours}:${minutes}:${seconds}`;
  }, 1000);


  context.subscriptions.push(playTimeBar);
}

export function disposePlayTimeBar() {
  if (playTimeBar) {
    playTimeBar.dispose();
  }
  if (playTimeTimer) {
    clearInterval(playTimeTimer);
  }
}
