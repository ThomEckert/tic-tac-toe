let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "circle"; // Startspieler (kann auch 'cross' sein)
const WINNING_COMBINATIONS = [
  [0, 1, 2], // horizontal
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], //vertical
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], //diagonal
  [2, 4, 6],
];

function init() {
  render();
}

function render() {
  const contentDiv = document.getElementById("content");
  // Generate table HTML
  let tableHtml = "<table>";
  for (let i = 0; i < 3; i++) {
    tableHtml += "<tr>";
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let symbol = "";
      if (fields[index] === "circle") {
        symbol = generateCircleSVG();
      } else if (fields[index] === "cross") {
        symbol = generateCrossSVG();
      }
      tableHtml += `<td onclick="handleClick(this, ${index})">${symbol}</td>`;
    }
    tableHtml += "</tr>";
  }
  tableHtml += "</table>";
  // Set table HTML to contentDiv
  contentDiv.innerHTML = tableHtml;
}

function generateCircleSVG() {
  const width = 70;
  const height = 70;
  const color = "#00b0ef";

  const svgCode = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${width / 2}" cy="${height / 2}" r="${
    width / 2
  }" fill="none" stroke="${color}" stroke-width="5">
                <animate attributeName="r" from="0" to="${
                  (width - 5) / 2
                }" dur="200ms" fill="freeze" />
            </circle>
        </svg>
    `;

  return svgCode;
}

function generateCrossSVG() {
  const width = 70;
  const height = 70;
  const color = "#fec000";

  const svgCode = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="${color}" stroke-width="5">
                <animate attributeName="x2" from="0" to="${width}" dur="200ms" fill="freeze" />
            </line>
            <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="${color}" stroke-width="5">
                <animate attributeName="x2" from="${width}" to="0" dur="200ms" fill="freeze" />
            </line>
        </svg>
    `;

  return svgCode;
}

// Funktion, die beim Klicken auf ein <td>-Element aufgerufen wird
function handleClick(cell, index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.onclick = null;
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        if (isGameFinished()) {
            const winCombination = getWinningCombination();
            drawWinningLine(winCombination);
        }
    }
}

function isGameFinished() {
  return (
    fields.every((field) => field !== null) || getWinningCombination() !== null
  );
}

function getWinningCombination() {
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    if (
      fields[a] === fields[b] &&
      fields[b] === fields[c] &&
      fields[a] !== null
    ) {
      return WINNING_COMBINATIONS[i];
    }
  }
  return null;
}

function drawWinningLine(combination) {
  const lineColor = "#ffffff";
  const lineWidth = 5;

  const startCell = document.querySelectorAll(`td`)[combination[0]];
  const endCell = document.querySelectorAll(`td`)[combination[2]];
  const startRect = startCell.getBoundingClientRect();
  const endRect = endCell.getBoundingClientRect();

  const contentRect = document
    .getElementById("content")
    .getBoundingClientRect();

  const lineLength = Math.sqrt(
    Math.pow(endRect.left - startRect.left, 2) +
      Math.pow(endRect.top - startRect.top, 2)
  );
  const lineAngle = Math.atan2(
    endRect.top - startRect.top,
    endRect.left - startRect.left
  );

  const line = document.createElement("div");
  line.style.position = "absolute";
  line.style.width = `${lineLength}px`;
  line.style.height = `${lineWidth}px`;
  line.style.backgroundColor = lineColor;
  line.style.top = `${
    startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top
  }px`;
  line.style.left = `${
    startRect.left + startRect.width / 2 - contentRect.left
  }px`;
  line.style.transform = `rotate(${lineAngle}rad)`;
  line.style.transformOrigin = `top left`;
  document.getElementById("content").appendChild(line);
}

function restartGame() {
  fields = [null, null, null, null, null, null, null, null, null];
  render();
}
