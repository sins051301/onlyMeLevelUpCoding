import * as vscode from "vscode";
import * as os from "os";
export let panel: vscode.WebviewPanel | undefined;

export function initializeStatusPanel(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.showStatusPanel",
    () => {
      const userName = os.userInfo().username;

      if (panel) {
        panel.reveal(vscode.ViewColumn.One);
      } else {
        panel = vscode.window.createWebviewPanel(
          "levelPanel",
          "Level & Playtime",
          vscode.ViewColumn.One,
          { enableScripts: true }
        );

        panel.webview.html = getWebviewContent();
        if (panel) {
          panel.webview.postMessage({
            level: context.globalState.get("level") || 1,
            attack: context.globalState.get("attack") || 1,
            penaltyDecrease: context.globalState.get("penaltyDecrease") || 1,
            experience: context.globalState.get("experience") || 0,
            experienceLimit: context.globalState.get("experienceLimit") || 30,
            userName: userName,
          });
        }

        panel.onDidDispose(() => {
          panel = undefined;
        });
      }
    }
  );
  context.subscriptions.push(disposable);
}

function getWebviewContent() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Level & Playtime</title>
      <style>
        @font-face {
          font-family: 'Danjo-bold-Regular';
          src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2307-1@1.1/Danjo-bold-Regular.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
        }
        body {
          font-family: 'Danjo-bold-Regular', "Arial", sans-serif;
          padding: 20px;
          background: transparent;
          color: #ffffff;
        }
        .level-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: radial-gradient(#111a32, #142748, #2b417d, #3d619b);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          max-width: 400px;
          margin: auto;
          padding: 10px;
          height: 450px;
          transition: background 0.5s ease; /* 배경색 전환 효과 */
        }
          
        .level-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #3d619b;
          width: 95%;
          height: 95%;
        }
        .level-title {
          width: 80%;
          text-align: center;
          color: white;
          font-size: 20px;
          font-weight: bold;
          border-bottom: 1px solid #3d619b;
          border-top: 1px solid #3d619b;
          padding: 2%;
          margin-bottom: 15px;
        }
        .level-info, .skill-info {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
          color: white;
        }
        .exp-bar, .penalty-bar {
          width: 80%;
          height: 10px;
          background-color: #44475a;
          border-radius: 12.5px;
          overflow: hidden;
          position: relative;
          margin-bottom: 10px;
        }
        .exp-bar-fill, .penalty-bar-fill {
          height: 100%;
          width: 0%;
          transition: width 0.5s ease-in-out;
        }
        .exp-bar-fill {
          background: linear-gradient(#0b3d7a, rgb(0, 114, 255), rgb(0, 183, 255), rgb(16, 131, 225));
        }
        .penalty-bar-fill {
          background: linear-gradient(#4d0b0b, #b20000, #ff3d3d, #ff6a6a);
        }
        .skill-item {
          font-size: 16px;
          margin: 5px 0;
          padding: 5px 10px;
          border-bottom: 1px solid #3d619b;
          background: none;
          border-radius: 5px;
          width: 80%;
          text-align: left;
          color:#d5dbe9;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          transition: background 0.3s ease;
        }
        .skill-item:hover {
          color: black;
        }
        .buttons {
          display: flex;
          width: 100%;
          justify-content: space-between;
          margin: 10px 0;
        }
        .button {
          padding: 5px;
          font-size: 10px;
          background: none;
          border: none;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }
        .button:hover {
          background: #2d4f7c;
        }
        .hidden {
          display: none;
        }
      </style>
    </head>
    <body>
      <div class="level-container" id="levelContainer">
        <div id="statusView" class="level-inner">
          <div class="buttons">
            <button class="button" data-view="status">status</button>
            <button class="button" data-view="skill">skill</button>
          </div>
          <div class="level-title">Status Panel</div>
         <div class="level-info"><span id="userName"></span></div>
          <div class="exp-bar">
            <div class="exp-bar-fill" id="exp-bar-fill"></div>
          </div>
          <div class="penalty-bar">
            <div class="penalty-bar-fill" id="penalty-bar-fill"></div>
          </div>
           <div class="level-info">Level: <span id="level">1</span> | EXP: <span id="exp">0</span>/<span id="expLimit">30</span></div>
           <div class="level-info">Area: <span id="area"></span> </div>
           <div class="level-info">Penalty Level: <span id="penaltyLv"></span></div>
           <div class="level-info">Attack: <span id="attack"></span><span id="emoji"></span> </div>
        </div>
    
        <div id="skillView" class="level-inner hidden">
          <div class="buttons">
            <button class="button" data-view="status">status</button>
            <button class="button" data-view="skill">skill</button>
          </div>
          <div class="level-title">skill</div>
          <div class="skill-item"><span>CreateFile</span> <span>+30EXP</span></div>
          <div class="skill-item"><span>DeleteFile</span> <span>+1Level</span></div>
          <div class="skill-item"><span>OpenFile</span> <span>+10EXP</span></div>
          <div class="skill-item"><span>CloseFile</span> <span>+20EXP</span></div>
          <div class="skill-item"><span>RenameFile</span> <span>+80EXP</span></div>
          <div class="skill-item"><span>ChangingWorkSpace</span> <span>+15EXP</span></div>
          <div class="skill-item"><span>SavingFile</span> <span>+5EXP</span></div>
          <div class="skill-item"><span>DebuggingFile</span> <span>+1Level</span></div>
        </div>
      </div>

      <script>
        const vscode = acquireVsCodeApi();
        const levelContainer = document.getElementById('levelContainer');

         const buttons = document.querySelectorAll('.button');
          const statusView = document.getElementById('statusView');
          const skillView = document.getElementById('skillView');

          
          buttons.forEach(button => {
            button.addEventListener('click', () => {
              const targetView = button.getAttribute('data-view');
              if (targetView === 'status') {
                statusView.classList.remove('hidden');
                skillView.classList.add('hidden');
              } else if (targetView === 'skill') {
                skillView.classList.remove('hidden');
                statusView.classList.add('hidden');
              }
            });
          });
        
        window.addEventListener('message', (event) => {
          const message = event.data;
          document.getElementById('level').innerText = message.level;
          document.getElementById('penaltyLv').innerText = message.penaltyDecrease;
          document.getElementById('attack').innerText = message.attack;
          document.getElementById('exp').innerText = message.experience;
          document.getElementById('emoji').innerText = message.emoji;
          document.getElementById('expLimit').innerText = message.experienceLimit;
          if(message.userName !== undefined) document.getElementById('userName').innerText = message.userName;
          if(message.area !== undefined) document.getElementById('area').innerText = message.area;
          
          const expPercentage = (message.experience / message.experienceLimit) * 100;
          document.getElementById('exp-bar-fill').style.width = expPercentage + '%';
          document.getElementById('penalty-bar-fill').style.width = message.penalty + '%';

          const penaltyValue = message.penalty;
          const userNameElement = document.getElementById('userName');
          const redIntensity = Math.min(255, Math.max(0, Math.floor(penaltyValue * 2.55)));
          if (userNameElement) {
           userNameElement.style.color = "rgb(" + redIntensity + ", " + redIntensity + ", " + redIntensity + ")";
            }
        });

      </script>
    </body>
    </html>
  `;
}
