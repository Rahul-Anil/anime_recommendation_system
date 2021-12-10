""" module to get MAL_ID and anime names """

import pandas as pd


def load_data(anime_data_path: "string") -> "Pandas_DataFrame":
    data = pd.read_csv((anime_data_path))
    return data


def extract_anime_id_and_name(df: "Pandas_DataFrame") -> "dict":

    # check if the col's has any null value
    if df.isnull().values.any():
        df.dropna()
        print("Null value present in Name col will be dropped")

    # check if there are duplicated rows
    if df.duplicated().values.any():
        df = df.drop_duplicates(subset=["anime_id"])

    mal_id_name_dict = {}

    for _, row in df.iterrows():
        mal_id_name_dict[row["anime_id"]] = row["name"]

    return mal_id_name_dict


def get_anime_dict(anime_data_path: "string") -> "dict":
    anime_data = load_data(anime_data_path)
    mal_id_name_dict = extract_anime_id_and_name(anime_data[["anime_id", "name"]])
    return mal_id_name_dict
