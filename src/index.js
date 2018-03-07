import utils from './utils';

const BOARD_W = 10;
const BOARD_H = 20;

export default class Tetris {

	constructor (target) {
		if (!target) throw new Error('Invalid target container!');
		target.innerHTML = utils.getHtml(BOARD_W, BOARD_H);

		this.el = target.querySelector('.bucket');


		// this.flatCells = this.el.querySelectorAll('.bucket-cell');
		// this.flatMap = Array(BOARD_W * BOARD_H).fill(null);

		this.cells = utils.mapCells(this.flatCells);
		this.currentBlock = utils.getRandomBlock();
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
			this.currentBlock = utils.getRandomBlock();
			this.checkFullRows();
			delay += 300;
		}
		if (this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(() => this.tick(), delay);
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
