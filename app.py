import marimo

__generated_with = "0.7.11"
app = marimo.App()


@app.cell
def __():
    import pandas as pd
    from typing import Any, cast
    import json
    import marimo as mo
    return Any, cast, json, mo, pd


@app.cell
def __():
    data_folder = "./json"
    outcome_file = 'outcomes.json'
    data_files = [
        "action.json",
        "attack.json",
        "magic.json",
        "shotlock.json",
    ]
    return data_files, data_folder, outcome_file


@app.cell
def __(cast, data_folder, json, outcome_file, pd):
    def load_json(file:str):
        loaded_dict = {}
        with open(f'{data_folder}/{file}', 'r') as f:
            loaded_dict  = json.load(f)
        return loaded_dict

    def create_outcomes_df(outcomes_dict:dict[str, str]) -> pd.DataFrame:
        crystals = cast(list[str], outcomes_dict.get('Crystals', []))
        outcomes_dict.pop('Crystals')
        outcomes_df = pd.DataFrame.from_dict(outcomes_dict, columns=crystals, orient='index')
        return outcomes_df


    outcomes_dict: dict[str,str] = load_json(outcome_file)
    outcome_df = create_outcomes_df(outcomes_dict)
    return create_outcomes_df, load_json, outcome_df, outcomes_dict


@app.cell
def __(Any, data_files, load_json, pd):
    def create_recipe_df(recipe_list: list[dict[str,str]], columns) -> pd.DataFrame:
        recipe_df = pd.DataFrame.from_records(recipe_list)
        recipe_df.columns = columns

        characters = ['terra', 'ventus', 'aqua']


        def filter_characters(x:list[str], char: str) -> bool:
            return char in x

        for character in characters:
            recipe_df[character] = recipe_df['Used By'].apply(filter_characters, char=character)

        recipe_df.drop('Used By', axis=1, inplace=True)


        return recipe_df

    def create_recipe_dfs():
        recipe_dfs: dict[str, pd.DataFrame] = {}
        for file in data_files:
            filename = file.split('.')[0]

            data_dict: dict[str, Any] = load_json(file)

            header: dict[str,str] | None = data_dict.get('header')
            if not header:
                raise ValueError(f'No header found in {file}')

            columns = list(header.values())

            recipes: list[dict[str,str]] | None = data_dict.get('recipes')
            if not recipes:
                raise ValueError(f'No recipes found in {file}')

            recipe_df = create_recipe_df(recipes, columns)
            recipe_dfs[filename] = recipe_df
        return recipe_dfs

    recipe_dfs = create_recipe_dfs()


    return create_recipe_df, create_recipe_dfs, recipe_dfs


@app.cell
def __(recipe_dfs):
    attack_df = recipe_dfs['attack']
    action_df = recipe_dfs['action']
    shotlock_df = recipe_dfs['shotlock']
    magic_df = recipe_dfs['magic']
    return action_df, attack_df, magic_df, shotlock_df


@app.cell
def __():
    return


@app.cell
def __(mo):
    input_char = mo.ui.dropdown(options=['terra', 'ventus', 'aqua'], value='terra', label='Select a character:')
    input_char


    return input_char,


@app.cell
def __(mo):
    input_command = mo.ui.text(label='Search Command:')
    input_command
    return input_command,


@app.cell
def __(attack_df, input_char, input_command):
    selected_char = input_char.value
    search_command = input_command.value

    def search_attack_df(df, character:str, command:str):

        char_cols = ['terra', 'aqua', 'ventus']
        
        df = df[df[f'{character}'] == True]
        df = df[df['Command'].str.contains(f'{command}', case=False)]
        
        for char in char_cols:
            df.drop(char, axis=1, inplace=True)
        
        return df
            
    filtered_attack_df = search_attack_df(attack_df, selected_char, search_command)
    return (
        filtered_attack_df,
        search_attack_df,
        search_command,
        selected_char,
    )


@app.cell
def __(selected_char):
    selected_char
    return


@app.cell
def __():
    def filter_crystals():
        pass
    return filter_crystals,


@app.cell
def __(filtered_attack_df):
    filtered_attack_df
    return


if __name__ == "__main__":
    app.run()
