require('./index.less');
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




export default class Bucket {

	constructor (target) {
		if (!target) throw new Error('Invalid target container!');
		target.innerHTML = getTemplate();

		this.el = target.querySelector('.bucket');
		this.cells = mapCells(this.el.querySelectorAll('.bucket-cell'));
		this.currentBlock = this.getRandomBlock();
		this.onKey = this.onKey.bind(this);
		document.addEventListener('keydown', this.onKey);
	}


	onKey (e) {
		const keyMap = {
			ArrowRight: 'right',
			ArrowLeft: 'left',
			ArrowUp: 'rotate',
			ArrowDown: 'slide',
		};
		const fn = keyMap[e.key];
		if (fn && this[fn]) this[fn]();
	}

	right () {
		this.drawBlock(false);
		if (this.canGo('right')) this.currentBlock.x++;
		this.drawBlock(true);
	}

	left () {
		this.drawBlock(false);
		if (this.canGo('left')) this.currentBlock.x--;
		this.drawBlock(true);
	}


	rotate () {
		this.drawBlock(false);
		if (this.currentBlock.pattern + 1 < this.currentBlock.patterns.length) {
			this.currentBlock.pattern++;
		}
		else this.currentBlock.pattern = 0;
		if (!this.canGo()) {
			if (this.canGo('right')) this.currentBlock.x += 1;
			else if (this.canGo('left')) this.currentBlock.x -= 1;
			else if (this.canGo('left', 2)) this.currentBlock.x -= 2;
			else if (this.canGo('left', 3)) this.currentBlock.x -= 3;
		}
		this.drawBlock(true);
	}


	slide () {
		this.tick(100);
	}


	tick (delay = 500) {
		this.drawBlock(false);
		if (this.currentBlock && this.canGo('down')) {
			this.currentBlock.y++;
			this.drawBlock(true);
		}
		else {
			this.drawBlock(true);
			this.currentBlock = this.getRandomBlock();
			this.checkFullRows();
		}
		if (this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(() => this.tick(), delay);
	}


	getRandomBlock () {
		const block = Object.assign({}, blocks[rand(blocks.length - 1)]);
		block.pattern = rand(block.patterns.length - 1);
		block.x = Math.floor((10 - block.patterns[block.pattern].length) / 2);
		block.y = -block.patterns[block.pattern].length;
		return block;
	}



	getBlockCells (offsetX, offsetY) {
		const cells = [];
		this.currentBlock.patterns[this.currentBlock.pattern].forEach((row, i) => {
			row.forEach((c, j) => {
				if (!c) return;					// block bit is set
				let cell;
				if (i + offsetY < 0) return;

				if (i + offsetY >= this.cells.length) cell = null;						// bottom edge
				else if (j + offsetX < 0) cell = null;									// left edge
				else if (j + offsetX >= this.cells[i + offsetY].length) cell = null;	// right edge
				else cell = this.cells[i + offsetY][j + offsetX];
				cells.push(cell);
			});
		});
		return cells;
	}


	drawBlock (draw = true) {
		const cells = this.getBlockCells(this.currentBlock.x, this.currentBlock.y);
		cells.forEach(c => {
			if (c) c.style.backgroundColor = draw ? this.currentBlock.color : '';
		});
	}


	canGo (dir, steps = 1) {
		let x = this.currentBlock.x, y = this.currentBlock.y;

		if (dir === 'down') y += steps;
		else if (dir === 'left') x -= steps;
		else if (dir === 'right') x += steps;

		const cells = this.getBlockCells(x, y);
		for (let i = 0; i < cells.length; i++) {
			if (!cells[i] || cells[i].style.backgroundColor) return false;

		}
		return true;
	}


	checkFullRows () {
		this.cells.forEach((r, i) => {
			if (this.isFullRow(r)) this.clearFullRow(i);
		});
	}

	isFullRow (row) {
		let haveBlocks = 0;
		row.forEach(c => {
			if (c.style.backgroundColor) haveBlocks++;
		});
		return row.length === haveBlocks;
	}

	clearFullRow (row) {
		this.drawBlock(false);

		while (row > 0) {
			const prevRow = this.cells[row - 1];
			this.cells[row].forEach((c, i) => {
				c.style.backgroundColor = prevRow[i].style.backgroundColor;
			});
			row--;
		}

		this.drawBlock(true);
	}


}
