class Recipe {
	constructor(data) {
		this.product = data.b;
		this.firstIng = data.a1;
		this.secondIng = data.a2;
		this.chars = data.chars;
		this.chance = data.chance;
		this.children = [];
		this.crystalOutcome = data.type;
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

class Node {
	constructor(product) {
		this.product = product;
		this.recipes = [];
		this.parents = [];
	}

	getProduct() {
		return this.product;
	}
	isSameProduct(newRecipe) {
		let counted = false;
		if (newRecipe.getProduct() === this.product) {
			counted = true;
		}

		return counted;
	}
	addRecipe(newRecipe) {
		this.recipes.push(newRecipe);
	}

	getRecipes() {
		return this.recipes;
	}

	isRecipeCounted(recipe) {
		let counted = false;
		for (let i = 0; i < this.recipes.length; i++) {
			if (recipe.getProduct() === this.recipes[i].getProduct()) {
				counted = true;
				break;
			}
		}
		return counted;
	}
	addParent(newParent) {
		this.parents.push(newParent);
	}
	getParents() {
		return this.parents;
	}
	isParentCounted(parent) {
		let counted = false;
		for (let i = 0; i < this.parents.length; i++) {
			if (
				parent.getFirstIng() === this.parents[i].getFirstIng() &&
				parent.getSecondIng() === this.parents[i].getSecondIng()
			) {
				counted = true;
				break;
			}
		}
		return counted;
	}
}
