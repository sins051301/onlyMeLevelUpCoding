import * as vscode from "vscode";
import { initializeLevelBar, disposeLevelBar } from "./level";
import { initializePlayTimeBar, disposePlayTimeBar } from "./playtime";
import { initializeStatusPanel } from "./status";

export function activate(context: vscode.ExtensionContext) {
  initializeLevelBar(context);
  initializePlayTimeBar(context);
  initializeStatusPanel(context);
}

export function deactivate() {
  disposeLevelBar();
  disposePlayTimeBar();
}
