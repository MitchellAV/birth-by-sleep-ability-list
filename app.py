import marimo

__generated_with = "0.7.11"
app = marimo.App(width="full")


@app.cell
def __():
    import pandas as pd
    from typing import Any, cast
    import json
    import marimo as mo
    return Any, cast, json, mo, pd


@app.cell
def __(mo):
    mo.md("""# Kingdom Heart: Birth by Sleep - Command Melding Search""")
    return


@app.cell
def __():
    data_folder = "./json"
    outcome_file = "outcomes.json"
    data_files = [
        "action.json",
        "attack.json",
        "magic.json",
        "shotlock.json",
    ]
    return data_files, data_folder, outcome_file


@app.cell
def __(cast, data_folder, json, outcome_file, pd):
    def load_json(file: str):
        loaded_dict = {}
        with open(f"{data_folder}/{file}", "r") as f:
            loaded_dict = json.load(f)
        return loaded_dict

    def create_outcomes_df(outcomes_dict: dict[str, str]) -> pd.DataFrame:
        crystals = cast(list[str], outcomes_dict.get("Crystals", []))
        outcomes_dict.pop("Crystals")
        outcomes_df = pd.DataFrame.from_dict(
            outcomes_dict, columns=crystals, orient="index"
        )
        return outcomes_df

    outcomes_dict: dict[str, str] = load_json(outcome_file)
    outcome_df = create_outcomes_df(outcomes_dict)
    return create_outcomes_df, load_json, outcome_df, outcomes_dict


@app.cell
def __(Any, data_files, load_json, pd):
    def create_recipe_df(recipe_list: list[dict[str, str]], columns) -> pd.DataFrame:
        recipe_df = pd.DataFrame.from_records(recipe_list)
        recipe_df.columns = columns

        characters = ["terra", "ventus", "aqua"]

        def filter_characters(x: list[str], char: str) -> bool:
            return char in x

        for character in characters:
            recipe_df[character] = recipe_df["Used By"].apply(
                filter_characters, char=character
            )

        recipe_df.drop("Used By", axis=1, inplace=True)

        return recipe_df

    def create_recipe_dfs():
        recipe_dfs: dict[str, pd.DataFrame] = {}
        for file in data_files:
            filename = file.split(".")[0]

            data_dict: dict[str, Any] = load_json(file)

            header: dict[str, str] | None = data_dict.get("header")
            if not header:
                raise ValueError(f"No header found in {file}")

            columns = list(header.values())

            recipes: list[dict[str, str]] | None = data_dict.get("recipes")
            if not recipes:
                raise ValueError(f"No recipes found in {file}")

            recipe_df = create_recipe_df(recipes, columns)
            recipe_dfs[filename] = recipe_df
        return recipe_dfs

    recipe_dfs = create_recipe_dfs()
    return create_recipe_df, create_recipe_dfs, recipe_dfs


@app.cell
def __(recipe_dfs):
    attack_df = recipe_dfs["attack"]
    action_df = recipe_dfs["action"]
    shotlock_df = recipe_dfs["shotlock"]
    magic_df = recipe_dfs["magic"]
    return action_df, attack_df, magic_df, shotlock_df


@app.cell
def __(mo):
    input_char = mo.ui.dropdown(
        options=["terra", "ventus", "aqua"], value="terra", label="Select a character:"
    )
    input_char
    return input_char,


@app.cell
def __(mo):
    input_ingredient = mo.ui.text(label="Search Ingredients:")
    input_ingredient
    return input_ingredient,


@app.cell
def __(mo):
    input_exact_match = mo.ui.checkbox(label='Exact match')
    input_exact_match
    return input_exact_match,


@app.cell
def __(input_char, input_exact_match, input_ingredient):
    selected_char = input_char.value
    search_command = input_ingredient.value
    exact_match = input_exact_match.value

    def search_df(df, character: str, command: str):

        char_cols = ["terra", "aqua", "ventus"]

        regex_str = ''
        if exact_match:
            regex_str = f'^{command}$'
        else:
            regex_str = f'{command}'
        
        df = df[df[f"{character}"] == True]
        df = df[
            df["1st Ingredient"].str.match(regex_str, case=False)
            | df["2nd Ingredient"].str.match(regex_str, case=False)
        ]

        for char in char_cols:
            df.drop(char, axis=1, inplace=True)

        return df
    return exact_match, search_command, search_df, selected_char


@app.cell
def __(attack_df, search_command, search_df, selected_char):
    filtered_attack_df = search_df(attack_df, selected_char, search_command)
    # filtered_attack_df
    return filtered_attack_df,


@app.cell
def __(magic_df, search_command, search_df, selected_char):
    filtered_magic_df = search_df(magic_df, selected_char, search_command)
    # filtered_magic_df
    return filtered_magic_df,


@app.cell
def __(search_command, search_df, selected_char, shotlock_df):
    filtered_shotlock_df = search_df(shotlock_df, selected_char, search_command)
    # filtered_shotlock_df
    return filtered_shotlock_df,


@app.cell
def __(action_df, search_command, search_df, selected_char):
    filtered_action_df = search_df(action_df, selected_char, search_command)
    # filtered_action_df
    return filtered_action_df,


@app.cell
def __(
    filtered_action_df,
    filtered_attack_df,
    filtered_magic_df,
    filtered_shotlock_df,
    pd,
):
    combined_df = pd.concat(
        [
            filtered_attack_df,
            filtered_magic_df,
            filtered_action_df,
            filtered_shotlock_df,
        ]
    )

    unique_types = sorted(combined_df["Type"].unique())
    unique_types = [x for x in unique_types if x != "-"]
    return combined_df, unique_types


@app.cell
def __(mo):
    mo.md("""## Search Results""")
    return


@app.cell
def __(combined_df):
    combined_df
    return


@app.cell
def __(mo):
    mo.md("""## Crystal Melding Outcomes""")
    return


@app.cell
def __(outcome_df, unique_types):
    filtered_outcome_df = outcome_df.loc[unique_types]
    filtered_outcome_df
    return filtered_outcome_df,


if __name__ == "__main__":
    app.run()
