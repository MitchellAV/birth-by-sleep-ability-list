import marimo

__generated_with = "0.7.14"
app = marimo.App(width="full")


@app.cell
def __():
    import marimo as mo
    import pandas as pd
    import json
    from typing import Any, cast
    return Any, cast, json, mo, pd


@app.cell
def __():
    # import time

    # def debounce(timeout: float):
    #     def decorator(func):
    #         @wraps(func)
    #         def wrapper(*args, **kwargs):
    #             wrapper.func.cancel()
    #             wrapper.func = Timer(timeout, func, args, kwargs)
    #             wrapper.func.start()

    #         wrapper.func = Timer(timeout, lambda: None)
    #         return wrapper

    #     return decorator

    # def simple_debounce(timeout: float):
    #     def decorator(func):
    #         @wraps(func)
    #         def wrapper(*args, **kwargs):
    #             time.sleep(timeout)

    #         return wrapper

    #     return decorator
    return


@app.cell
def __(mo):
    mo.md("""# Kingdom Hearts Birth by Sleep - Command Melding Reference""")
    return


@app.cell
def __():
    data_folder = "./data"
    outcome_file = "outcomes.json"
    data_files = [
        "action.json",
        "attack.json",
        "magic.json",
        "shotlock.json",
    ]

    default_types = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "-",
    ]
    return data_files, data_folder, default_types, outcome_file


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
def __(default_types, mo):
    get_command, set_command = mo.state("")
    get_ingredient_1, set_ingredient_1 = mo.state("")
    get_ingredient_2, set_ingredient_2 = mo.state("")
    get_type_list, set_type_list = mo.state(default_types)
    get_type, set_type = mo.state(None)
    get_clear, set_clear = mo.state(False)
    return (
        get_clear,
        get_command,
        get_ingredient_1,
        get_ingredient_2,
        get_type,
        get_type_list,
        set_clear,
        set_command,
        set_ingredient_1,
        set_ingredient_2,
        set_type,
        set_type_list,
    )


@app.cell
def __(mo):
    input_char = mo.ui.dropdown(
        options={"Terra": "terra", "Ventus": "ventus", "Aqua": "aqua"},
        value="Terra",
        label="Select character:",
    )
    input_char
    return input_char,


@app.cell
def __(
    Any,
    default_types,
    mo,
    set_clear,
    set_command,
    set_ingredient_1,
    set_ingredient_2,
    set_type,
    set_type_list,
):
    def handle_clear(input: Any):
        set_command("")
        set_ingredient_1("")
        set_ingredient_2("")
        set_type_list(default_types)
        set_type(None)
        set_clear(True)

    input_clear_button = mo.ui.button(label="Clear", on_click=handle_clear)
    input_clear_button
    return handle_clear, input_clear_button


@app.cell
def __(get_clear, get_command, mo, set_command):
    get_clear()

    input_command = mo.ui.text(
        label="Search Command:", on_change=set_command, value=get_command()
    )
    input_command
    return input_command,


@app.cell
def __(
    get_clear,
    get_ingredient_1,
    get_ingredient_2,
    mo,
    set_ingredient_1,
    set_ingredient_2,
):
    get_clear()

    input_ingredient_1 = mo.ui.text(
        label="Search Ingredient 1:",
        value=get_ingredient_1(),
        on_change=set_ingredient_1,
    )
    input_ingredient_2 = mo.ui.text(
        label="Search Ingredient 2:",
        value=get_ingredient_2(),
        on_change=set_ingredient_2,
    )
    mo.hstack([input_ingredient_1, input_ingredient_2], justify="start")
    return input_ingredient_1, input_ingredient_2


@app.cell
def __(mo):
    input_exact_match = mo.ui.checkbox(label="Exact match")
    input_exact_match
    return input_exact_match,


@app.cell
def __(get_clear, get_type, get_type_list, mo, set_type):
    get_clear()

    input_type = mo.ui.dropdown(
        label="Search Crystal Melding Type:",
        value=get_type(),
        options=get_type_list(),
        on_change=set_type,
        allow_select_none=True
    )
    input_type
    return input_type,


@app.cell
def __(
    get_command,
    get_ingredient_1,
    get_ingredient_2,
    get_type,
    input_char,
    input_exact_match,
):
    search_ingredient_1 = get_ingredient_1()
    search_ingredient_2 = get_ingredient_2()
    search_command = get_command()
    search_type = get_type()
    selected_char = input_char.value
    exact_match = input_exact_match.value
    return (
        exact_match,
        search_command,
        search_ingredient_1,
        search_ingredient_2,
        search_type,
        selected_char,
    )


@app.cell
def __(exact_match, pd, search_command):
    def search_df(
        df,
        character: str,
        ingredient_1: str,
        ingredient_2: str,
        command: str,
    ):
        char_cols = ["terra", "aqua", "ventus"]

        def exact_match_text(text: str, is_exact_match: bool):
            results = ""
            if is_exact_match:
                results = f"^{text}$"
            else:
                results = f"{text}"
            return results

        regex_ing_1 = exact_match_text(ingredient_1, exact_match)
        regex_ing_2 = exact_match_text(ingredient_2, exact_match)
        regex_command = exact_match_text(command, exact_match)

        df = df[df[f"{character}"] == True]

        if search_command:
            df = df[df["Command"].str.match(regex_command, case=False)]

        if ingredient_1 and not ingredient_2:
            df = df[
                df["1st Ingredient"].str.match(regex_ing_1, case=False)
                | df["2nd Ingredient"].str.match(regex_ing_1, case=False)
            ]

        if ingredient_2 and not ingredient_1:
            df = df[
                df["1st Ingredient"].str.match(regex_ing_2, case=False)
                | df["2nd Ingredient"].str.match(regex_ing_2, case=False)
            ]

        if ingredient_1 and ingredient_2:
            mask_1 = df["1st Ingredient"].str.match(regex_ing_1, case=False)
            mask_2 = df["2nd Ingredient"].str.match(regex_ing_2, case=False)
            df_1 = df[(mask_1 & mask_2)]

            mask_3 = df["1st Ingredient"].str.match(regex_ing_2, case=False)
            mask_4 = df["2nd Ingredient"].str.match(regex_ing_1, case=False)

            df_2 = df[(mask_3 & mask_4)]

            df = pd.concat([df_1, df_2])

        for char in char_cols:
            df = df.drop(char, axis=1)

        return df
    return search_df,


@app.cell
def __(
    action_df,
    attack_df,
    magic_df,
    pd,
    search_command,
    search_df,
    search_ingredient_1,
    search_ingredient_2,
    selected_char,
    shotlock_df,
):
    def search_all_dfs(
        selected_char: str,
        search_ingredient_1: str,
        search_ingredient_2: str,
        search_command: str,
    ):
        filtered_attack_df = search_df(
            attack_df,
            selected_char,
            search_ingredient_1,
            search_ingredient_2,
            search_command,
            
        )
        filtered_magic_df = search_df(
            magic_df,
            selected_char,
            search_ingredient_1,
            search_ingredient_2,
            search_command,
            
        )
        filtered_shotlock_df = search_df(
            shotlock_df,
            selected_char,
            search_ingredient_1,
            search_ingredient_2,
            search_command,
            
        )
        filtered_action_df = search_df(
            action_df,
            selected_char,
            search_ingredient_1,
            search_ingredient_2,
            search_command,
            
        )

        combined_df = pd.concat(
            [
                filtered_attack_df,
                filtered_magic_df,
                filtered_action_df,
                filtered_shotlock_df,
            ],
            ignore_index=True,
        )

        combined_df = combined_df.drop_duplicates(ignore_index=True)
        return combined_df

    combined_df = search_all_dfs(
        selected_char,
        search_ingredient_1,
        search_ingredient_2,
        search_command
    )
    return combined_df, search_all_dfs


@app.cell
def __(pd):
    def search_meld_type(df:pd.DataFrame, meld_type:str):

        if meld_type:
            df = df[df["Type"] == meld_type]
        return df
    return search_meld_type,


@app.cell
def __(combined_df, search_meld_type, search_type, set_type_list):
    unique_types = sorted(combined_df["Type"].unique())
    set_type_list(unique_types)

    results_df = search_meld_type(combined_df, search_type)
    return results_df, unique_types


@app.cell
def __():
    # def create_graph_nx(df: pd.DataFrame):
    #     G = nx.DiGraph()
    #     for index, row in df.iterrows():
    #         recipe = f'{row["1st Ingredient"]} + {row["2nd Ingredient"]}'
    #         G.add_node(row["1st Ingredient"], node_type="ingredient")
    #         G.add_node(row["2nd Ingredient"], node_type="ingredient")
    #         G.add_node(row["Command"], node_type="ingredient")
    #         G.add_node(recipe, node_type="recipe")
    #         G.add_edge(row["1st Ingredient"], recipe)
    #         G.add_edge(row["2nd Ingredient"], recipe)
    #         G.add_edge(recipe, row["Command"])
    #     return G

    # def show_graph():
    #     G = create_graph_nx(combined_df)

    #     pos = nx.spring_layout(G, k=10, iterations=1000)

    #     # Create a Matplotlib figure and axis
    #     fig, ax = plt.subplots(figsize=(8, 8))

    #     color_map = []
    #     for node in G:
    #         if G.nodes[node]["node_type"] == "ingredient":
    #             color_map.append("blue")
    #         elif G.nodes[node]["node_type"] == "recipe":
    #             color_map.append("red")

    #     # Draw the graph on the axis
    #     nx.draw_networkx(
    #         G,
    #         with_labels=True,
    #         ax=ax,
    #         pos=pos,
    #         node_color=color_map,
    #         font_color="green",
    #         node_size=50,
    #         font_size=8,
    #     )

    #     # Return the figure
    #     return fig
    return


@app.cell
def __():
    # fig = show_graph()
    # mo.mpl.interactive(fig)
    return


@app.cell
def __(mo):
    mo.md("""## Search Results""")
    return


@app.cell
def __(results_df):
    results_df
    return


@app.cell
def __(mo):
    mo.md("""## Crystal Melding Outcomes""")
    return


@app.cell
def __(get_type_list, outcome_df):
    filter_types = [x for x in get_type_list() if x != "-"]
    filtered_outcome_df = outcome_df.loc[filter_types]
    filtered_outcome_df
    return filter_types, filtered_outcome_df


if __name__ == "__main__":
    app.run()
