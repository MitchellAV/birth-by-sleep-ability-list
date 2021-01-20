class Node {
	constructor(product) {
		this.product = product;
		this.url = this.product.replace(" ", "-").toLowerCase();
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

module.exports = Node;
