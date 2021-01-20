class Recipe {
	constructor(data) {
		this.product = data.b;
		this.firstIng = data.a1;
		this.secondIng = data.a2;
		this.chars = data.chars;
		this.chance = data.chance;
		this.children = [];
		this.crystalOutcome = data.type;
		this.url = this.product.replace(" ", "-").toLowerCase();

		this.printName = `${this.crystalOutcome}: ${this.firstIng} + ${this.secondIng}`;
	}

	addChild(child) {
		this.children.push(child);
	}
	getChildren() {
		return this.children;
	}
	isChild(child) {
		let counted = false;
		for (let i = 0; i < this.children.length; i++) {
			if (child.getProduct() === this.children[i].getProduct()) {
				counted = true;
				break;
			}
		}
		return counted;
	}

	getProduct() {
		return this.product;
	}
	getFirstIng() {
		return this.firstIng;
	}
	getSecondIng() {
		return this.secondIng;
	}
	getChars() {
		return this.chars;
	}
	geChance() {
		return this.chance;
	}
	canBeUsedBy(char) {
		let counted = false;
		for (let i = 0; i < this.chars.length; i++) {
			if (char.includes(this.chars[i])) {
				counted = true;
				break;
			}
		}
		return counted;
	}
	getOutcome() {
		return this.type;
	}
	crystalLetter(char) {
		return this.crystalOutcome == char;
	}
}

module.exports = Recipe;
