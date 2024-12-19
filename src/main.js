import './style.css'


//const options = ["攻撃力%", "HP%", "防御力%", "元素熟知", "チャージ効率", "率ダメのみ"];
let scores = []; // スコア保存用

// 英語と日本語の対応表をオブジェクトで定義
const translationMap = {
    "flower": "花",
    "plume": "羽",
    "sands": "時計",
    "goblet": "杯",
    "circlet": "冠"
};

// 選択項目に応じて、スコア入力欄の表示を切り替える
function updateGlobalOption() {
    const selectedId = document.getElementById('global-OptionSelect');
    const selectedOption = selectedId.value;
    const parts = ["flower", "plume", "sands", "goblet", "circlet"];

    parts.forEach(part => {
        const input = document.getElementById(`thirdOption${capitalize(part)}`);
        input.disabled = (selectedOption === "率ダメのみ"); // 率ダメのみの場合、スコア入力欄を無効化
    });
}

// スコア計算のロジック
function calculateScore(critRate, critDmg, thirdValue) {
    const selectedId = document.getElementById('global-OptionSelect');
    const selectedOption = selectedId.value;
    let score = critRate * 2 + critDmg;

    if (selectedOption === "元素熟知") {
        thirdValue = thirdValue / 4; // 元素熟知は4分の1にする
    }

    if (selectedOption !== "率ダメのみ" && !isNaN(thirdValue)) {
        score += thirdValue; // 率ダメのみではない場合、第三の値を加算
    }
    return score;
}

// 全ての聖遺物のスコアを計算
function calculateAllScores() {
    const parts = ["flower", "plume", "sands", "goblet", "circlet"];
    let totalScore = 0;

    parts.forEach(part => {
        const critRate = parseFloat(document.getElementById(`critRate${capitalize(part)}`).value) || 0;
        const critDmg = parseFloat(document.getElementById(`critDmg${capitalize(part)}`).value) || 0;
        const thirdValue = parseFloat(document.getElementById(`thirdOption${capitalize(part)}`).value) || 0;

        const score = calculateScore(critRate, critDmg, thirdValue);
        totalScore += score;

        // 各聖遺物のスコアを表示
        document.getElementById(`${part}Score`).innerText = `${translateToJapanese(part)}のスコア: ${score.toFixed(2)}`;
    });

    //各聖遺物スコアの合計
    document.getElementById("totalScore").innerText = `合計スコア: ${totalScore.toFixed(2)}`;
    return totalScore;
}

// スコアを保存
function saveScore() {
    const totalScore = calculateAllScores();
    scores.push(totalScore);
    localStorage.setItem("artifactScores", JSON.stringify(scores)); // ローカルストレージに保存
    updateRanking();
}

// 最下位のスコアを削除
function removeScore() {
    const totalScore = calculateAllScores();
    scores.pop(totalScore);
    localStorage.setItem("artifactScores", JSON.stringify(scores)); // ローカルストレージから削除
    updateRanking();
}

// ランキングを表示
function updateRanking() {
    const rankingContainer = document.getElementById("ranking");
    rankingContainer.innerHTML = "";

    scores.sort((a, b) => b - a); // スコアを降順に並び替え
    scores.forEach((score, index) => {
        const rank = document.createElement("p");
        rank.innerText = `${index + 1}位: ${score.toFixed(2)}`;
        rankingContainer.appendChild(rank);
    });
}

// ローカルストレージから保存されたスコアを読み込む
function loadSavedScores() {
    const savedScores = JSON.parse(localStorage.getItem("artifactScores"));
    if (savedScores) {
        scores = savedScores;
        updateRanking();
    }
}

// 文字列の先頭を大文字にする
function capitalize(str) {
    // const A=str.charAt(0).toLowerCase() + str.slice(1);
    // const JP=translateToJapanese(A);
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 英語の文字列を日本語に変換する関数
function translateToJapanese(englishText) {
    const lowerCaseText = englishText.toLowerCase(); // 小文字に変換（大文字を統一）
    return translationMap[lowerCaseText] || "翻訳が見つかりません"; // 対応がない場合の処理
}

// 初期化時にデータを読み込む
window.onload = () => {
    loadSavedScores();
};

//ボタン処理
document.addEventListener('DOMContentLoaded',() =>{
  document.getElementById('global-OptionSelect').addEventListener('change',() => updateGlobalOption());
  document.getElementById('calculate-AllScores').addEventListener('click',() => calculateAllScores());
  document.getElementById('save-Score').addEventListener('click',() => saveScore());
  document.getElementById('remove-Score').addEventListener('click',() => removeScore());
});




// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
