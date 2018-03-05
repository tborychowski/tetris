import blocks from './blocks';


const rand = (max, min = 0) => Math.floor(Math.random() * (max - min + 1) + min);

function getTemplate () {
	const cell = '<div class="bucket-cell"></div>';
	const row = Array(10).fill(cell).join('');
	const rows = Array(20).fill(row).join('');
	return `<div class="bucket">${rows}</div>`;
}


// map css-grid layout into 2d 10x20 array
function mapCells (cells, x = 10, y = 20) {
	if (cells.length !== x * y) throw new Error('Incorrect number of cells!');
	let i = 0, j = 0;
	const map = [];
	cells.forEach(c => {
		map[i] = map[i] || [];
		map[i][j] = c;
		if (j < x - 1) j++;
		else { j = 0; i++; }
	});
	return map;
}


function getRandomBlock () {
	const block = Object.assign({}, blocks[rand(blocks.length - 1)]);
	block.pattern = rand(block.patterns.length - 1);
	block.x = Math.floor((10 - block.patterns[block.pattern].length) / 2);
	block.y = -block.patterns[block.pattern].length;
	return block;
}



export default {
	rand,
	getTemplate,
	mapCells,
	getRandomBlock,
};
