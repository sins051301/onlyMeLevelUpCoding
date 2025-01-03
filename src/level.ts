import * as vscode from "vscode";
import { panel } from "./status";
import { getLevelEmoji } from "./skillEffect";
import * as os from "os";
export let levelBar: vscode.StatusBarItem;
export let timerProgressBar: vscode.StatusBarItem;

export function initializeLevelBar(context: vscode.ExtensionContext) {
  let experience = context.globalState.get<number>("experience") || 0;
  let level = context.globalState.get<number>("level") || 1;
  let experienceLimit =
    context.globalState.get<number>("experienceLimit") || 30;
  let attack = context.globalState.get<number>("attack") || 1;
  let penaltyDecrease = context.globalState.get<number>("penalty") || 1;


  levelBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  const levelEmoji = getLevelEmoji(level);
  levelBar.text = `${levelEmoji} Level: ${level} | EXP: ${experience}/${experienceLimit} `;
  levelBar.color = "yellow";
  levelBar.show();

 
  timerProgressBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    99
  );
  let progress = 100; 
  timerProgressBar.text = `⏳ Penalty: ${progress}%`;
  timerProgressBar.color = "red";
  timerProgressBar.show();

  
  setInterval(() => {
    progress -= penaltyDecrease;
    syncState();
    if (progress <= 0) {
      progress = 100;
      const penalty =
        Math.floor(Math.random() * (Math.floor(level / 2) || 1)) + 1;
      level = Math.max(1, level - penalty);
      attack = 1;
      penaltyDecrease += 0.5;
      experienceLimit = (level - 1) * 10 + 30;
      vscode.window.showWarningMessage(
        `Penalty Applied: Your level has decreased by ${penalty}.`
      );
      vscode.window.showWarningMessage(
        `Penalty Applied: Your Attack: ${attack} Your Penalty Level: ${penaltyDecrease}`
      );
      if (penaltyDecrease >= 10) {
        vscode.window.showWarningMessage(`TOO MANY PENALTY!!!`);
        vscode.window.showWarningMessage(`GAME OVER... RESET ALL...`);
        resetAll();
      }
    }
    timerProgressBar.text = `⏳ Penalty: ${progress.toFixed(1)}%`;
  }, 1000);

  function resetAll() {
    experience = 0;
    level = 1;
    experienceLimit = 30;
    attack = 1;
    penaltyDecrease = 1;
  }

  function handleLevelUp(effort?: boolean) {
    if (experience >= experienceLimit || effort) {
      level += 1;
      experience = 0;
      experienceLimit += 10;
      vscode.window.showInformationMessage(`INFO: Reached Level ${level} 🎉`);
      let count = 0;
      const interval = setInterval(() => {
        levelBar.text =
          count % 2 === 0 ? `INFO: Reached Level ${level} 🎉` : "";
        count += 1;
        if (count > 4) {
          clearInterval(interval);
        }
      }, 300);
    }
    if (level >= 10 * attack) {
      attack += 1;
      penaltyDecrease = 1;
      vscode.window.showInformationMessage(`INFO: Attack +0.1 / Penalty Reset`);
      vscode.window.showInformationMessage(`INFO: skill changed!!`);
    }

  

    levelBar.text = `${levelEmoji} Level: ${level} | EXP: ${experience}/${experienceLimit}`;
  }

  function syncState(area?: string) {
    context.globalState.update("experience", experience);
    context.globalState.update("level", level);
    context.globalState.update("attack", attack);
    context.globalState.update("penaltyDecrease", penaltyDecrease);
    context.globalState.update("experienceLimit", experienceLimit);
    context.globalState.update("emoji", levelEmoji);
    levelBar.text = `${levelEmoji} Level: ${level} | EXP: ${experience}/${experienceLimit}`;
    const userName = os.userInfo().username;
    if (panel) {
      panel.webview.postMessage({
        level: level,
        experience: experience,
        experienceLimit: experienceLimit,
        penalty: progress,
        area: area,
        attack: attack,
        penaltyDecrease: penaltyDecrease,
        emoji: levelEmoji,
        userName: userName,
      });
    }
    context.subscriptions.push(
      levelBar,
      timerProgressBar,
      fileCreateDisposable,
      fileDeleteDisposable,
      fileDebuggingDisposable,
      fileOpenDisposable,
      fileDiscloseDisposable,
      disposable,
      fileReNameDisposable,
      fileSaveDisposable,
      workspaceChangeDisposable
    );
  }

  const fileCreateDisposable = vscode.workspace.onDidCreateFiles(() => {
    experience += 30;
    vscode.window.showInformationMessage(
      `INFO: Gain +30 EXP for Creating a Document`
    );
    handleLevelUp();
    syncState();
  });

  const fileDeleteDisposable = vscode.workspace.onDidDeleteFiles(() => {
    vscode.window.showInformationMessage(
      `INFO: Level Up! +1 Level for Deleting`
    );
    handleLevelUp(true);
    syncState();
  });

  const fileOpenDisposable = vscode.workspace.onDidOpenTextDocument(() => {
    experience += 10;
    vscode.window.showInformationMessage(
      `INFO: Gain +10 EXP for Opening a Document`
    );
    handleLevelUp();
    syncState();
  });

  const fileDiscloseDisposable = vscode.workspace.onDidCloseTextDocument(() => {
    experience += 20;
    vscode.window.showInformationMessage(
      `INFO: Gain +20 EXP for Closing a Document`
    );
    handleLevelUp();
    syncState();
  });

  const fileReNameDisposable = vscode.workspace.onDidRenameFiles(() => {
    experience += 20;
    vscode.window.showInformationMessage(
      `INFO: Gain +80 EXP for Moving a Document`
    );
    handleLevelUp();
    syncState();
  });

  const fileDebuggingDisposable = vscode.debug.onDidStartDebugSession(() => {
    vscode.window.showInformationMessage(
      `INFO: Level Up! +1 Level for Debugging`
    );
    handleLevelUp(true);
    syncState();
  });

  const fileSaveDisposable = vscode.workspace.onDidSaveTextDocument(() => {
    experience += 5;
    vscode.window.showInformationMessage(`INFO: Gain +5 EXP for Saving File`);
    handleLevelUp();
    syncState();
  });

  const workspaceChangeDisposable =
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      experience += 15;
      vscode.window.showInformationMessage(
        `INFO: Gain +15 EXP for Changing Workspace Folders`
      );
      handleLevelUp();
      syncState();
    });

 
  const disposable = vscode.workspace.onDidChangeTextDocument((event) => {
    const decorationType = vscode.window.createTextEditorDecorationType({
      textDecoration: "none",
      after: {
        contentText: getLevelEmoji(level), 
        color: "rgba(255, 165, 0, 1)",
        fontWeight: "bold",
      },
    });
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const lastChange = event.contentChanges[0];
    if (!lastChange) {
      return;
    }

    const range = new vscode.Range(
      editor.selection.start.line,
      editor.selection.start.character,
      editor.selection.start.line,
      editor.selection.start.character + lastChange.text.length
    );

    editor.setDecorations(decorationType, [range]);

    setTimeout(() => {
      editor.setDecorations(decorationType, []);
    }, 200);

    
    const areaName = event.document.fileName; 
    const relativeAreaName = vscode.workspace.asRelativePath(areaName); 

    experience += attack;
    handleLevelUp();
    
    progress = Math.min(progress + attack, 100);
    syncState(relativeAreaName);
  });
}

export function disposeLevelBar() {
  if (levelBar) {
    levelBar.dispose();
  }
  if (timerProgressBar) {
    timerProgressBar.dispose();
  }
}
