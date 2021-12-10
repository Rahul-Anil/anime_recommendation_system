"""draft program for cleaning data from anime.csv """

import pandas as pd
import numpy as np
import sys
from sklearn.preprocessing import MultiLabelBinarizer

"""importing data gets data from the anime_data directory"""


def importing_data(csv_path) -> "pd.core.frame.DataFrame":
    anime_data_path = csv_path
    anime_df = pd.read_csv(anime_data_path)
    return anime_df


def missing_val_unknown_to_nan(
    anime_df: "pd.core.frame.DataFrame",
) -> "pd.core.frame.DataFrame":
    anime_df.replace("Unknown", np.nan, inplace=True)
    return anime_df


def rename_cols(anime_df: "pd.core.frame.DataFrame") -> "pd.core.frame.DataFrame":
    replacement = "|".join([" ", "-"])
    anime_df.columns = anime_df.columns.str.replace(replacement, "_", regex=True)
    anime_df.columns = anime_df.columns.str.lower()
    return anime_df


def col_factorize(col: "pd.core.series.Series") -> "pd.core.frame.DataFrame":
    mlb = MultiLabelBinarizer()
    expanded_data = mlb.fit_transform(col)
    new_label = mlb.classes_
    new_genre_df = pd.DataFrame(expanded_data, columns=new_label)
    return new_genre_df


def genres_col_expansion(
    anime_df: "pd.core.frame.DataFrame",
) -> "pd.core.frame.DataFrame":
    """genre col has np.nan values will be
    converted to unknown_genre"""
    anime_df["genres"].fillna("unknown_genre", inplace=True)
    anime_df["genres"] = anime_df["genres"].str.lower()
    anime_df["genres"] = anime_df["genres"].str.split()
    anime_df["genres"] = anime_df["genres"].str.join("")
    anime_df["genres"] = anime_df["genres"].str.split(pat=",")
    genres_df = col_factorize(anime_df["genres"])
    # Getting geners for later use
    generes_columns = list(genres_df.columns)
    anime_genre_concat_df = pd.concat([anime_df, genres_df], axis=1)
    return anime_genre_concat_df, generes_columns


def remove_cols(
    anime_df: "pd.core.frame.DataFrame", cols_to_dropped: "list"
) -> "pd.core.frame.DataFrame":
    anime_df = anime_df.drop(cols_to_dropped, axis=1)
    return anime_df


def remove_row(
    index: "index_to_be_removed", anime_df: "pd.core.frame.DataFrame"
) -> "pd.core.frame.DataFrame":
    anime_df = anime_df.drop(index)
    return anime_df


"""fucntion will create a csv file of the provided df in the path provided"""


def aired_col_dataclean(
    anime_df: "pd.core.frame.DataFrame",
) -> "pd.core.frame.DataFrame":
    aired_col = anime_df["aired"]

    """ split into new starting and ending dates"""
    aired_col = aired_col.str.split(pat="to", expand=True)

    """rename the cols """
    aired_col.rename(columns={0: "start_date", 1: "end_date"}, inplace=True)

    """removing random values that came up when spliting"""
    aired_col.replace(" ?", np.nan, inplace=True)
    aired_col.fillna(np.nan, inplace=True)

    """ convert each col from string to date format"""

    """working with col start_date"""
    aired_col_start_date = aired_col["start_date"].str.split(
        pat=r"(\d+,)(?=\s)|,|^(?=\d)", expand=True
    )
    aired_col_start_date.drop([1], axis=1, inplace=True)
    aired_col_start_date.replace("", np.nan, inplace=True)
    aired_col_start_date.rename(
        columns={0: "start_date_month", 2: "start_date_year"}, inplace=True
    )
    aired_col_start_date["start_date_month"] = aired_col_start_date[
        "start_date_month"
    ].str.strip()
    aired_col_start_date["start_date_year"] = aired_col_start_date[
        "start_date_year"
    ].str.strip()

    """working with col end date"""
    aired_col["end_date"] = aired_col["end_date"].str.strip()
    aired_col_end_date = aired_col["end_date"].str.split(
        pat=r"(\d+,)(?=\s)|,|^(?=\d)", expand=True
    )
    aired_col_end_date.drop([1], axis=1, inplace=True)
    aired_col_end_date.replace("", np.nan, inplace=True)
    aired_col_end_date.rename(
        columns={0: "end_date_month", 2: "end_date_year"}, inplace=True
    )
    aired_col_end_date["end_date_month"] = aired_col_end_date[
        "end_date_month"
    ].str.strip()
    aired_col_end_date["end_date_year"] = aired_col_end_date[
        "end_date_year"
    ].str.strip()

    prem = {
        "Jan": "winter",
        "Feb": "winter",
        "Mar": "winter",
        "Apr": "spring",
        "May": "spring",
        "Jun": "spring",
        "Jul": "summer",
        "Aug": "summer",
        "Sep": "summer",
        "Oct": "fall",
        "Nov": "fall",
        "Dec": "fall",
    }

    """remove aired col form anime_df"""
    anime_df = remove_cols(anime_df, ["aired"])

    """adding the cleaned aired dates"""
    anime_df["aired_start_date_month"] = aired_col_start_date["start_date_month"]
    anime_df["aired_start_date_year"] = aired_col_start_date["start_date_year"]
    anime_df["aired_end_date_month"] = aired_col_end_date["end_date_month"]
    anime_df["aired_end_date_year"] = aired_col_end_date["end_date_year"]

    """data augmenting the premiered col"""
    anime_df["premiered"] = anime_df["aired_start_date_month"].map(prem)
    return anime_df


def score_concatenate(input_value):
    output_dict = {}
    for k, v in input_value.to_dict().items():
        if pd.isna(v):
            output_dict[k] = 0
        else:
            output_dict[k] = int(float(v))
    return output_dict


def aired_concatenate(input_value):
    output_dict = {}
    # Convert Year to int for easier query
    for k, v in input_value.to_dict().items():
        if "month" in k:
            if pd.isna(v):
                output_dict[k] = "unknown"
            else:
                output_dict[k] = v
        else:
            if pd.isna(v):
                output_dict[k] = 0
            else:
                output_dict[k] = int(float(v))
    return output_dict


def genre_concatenate(input_value):
    output_list = []
    for index, value in input_value.items():
        if value == 1:
            output_list.append(index)
    return output_list


def renaming(input_column_list):
    output_dict = {}
    for _ in input_column_list:
        # Lower for good practice
        tmp = _.lower()
        # NOTE: MAL_ID is anime_id
        if tmp == "mal_id":
            tmp = "anime_id"
        # Sypnopsis to description
        if tmp == "sypnopsis":
            tmp = "description"
        # NOTE: Check for space and replace with underscore
        if " " in tmp:
            tmp = tmp.replace(" ", "_")
        output_dict[_] = tmp
    return output_dict


def anime_csv_clean(csv_path):
    anime_df = importing_data(csv_path)
    anime_df_renamed_col = rename_cols(anime_df)
    anime_df_unknown_to_nan = missing_val_unknown_to_nan(anime_df_renamed_col)
    anime_df_gen_fac, genres_columns = genres_col_expansion(anime_df_unknown_to_nan)
    col_dropped_after_factorization_genres = ["genres"]
    anime_df_with_dropped_cols = remove_cols(
        anime_df_gen_fac, col_dropped_after_factorization_genres
    )
    """from basic data exploration it was found that the follwing MAL_ID was a 
    invalid duplicate and will be removed"""
    dup_mal_id = 39143
    anime_df_dup_remv = remove_row(
        anime_df_with_dropped_cols[
            anime_df_with_dropped_cols.mal_id == dup_mal_id
        ].index,
        anime_df_with_dropped_cols,
    )
    anime_df_aired_col_clean = aired_col_dataclean(anime_df_dup_remv)

    # Create a Genre Table
    genres_df = pd.DataFrame(columns=["genre", "anime_ids"])
    for _ in genres_columns:
        # Filter to 2 column
        filtered_df = anime_df_aired_col_clean[["mal_id", _]]
        # Select 1s
        mal_id_list = filtered_df.loc[filtered_df[_] == 1]["mal_id"].to_list()
        # Write to row
        genres_df.loc[len(genres_df)] = [_, mal_id_list]

    # Further Cleaning with Anime CSV
    # 1) Score
    score_columns = [_ for _ in anime_df_aired_col_clean.columns if "score_" in _]
    anime_df_aired_col_clean["score_info"] = anime_df_aired_col_clean[
        score_columns
    ].apply(lambda x: score_concatenate(x), axis=1)
    anime_df_aired_col_clean.drop(score_columns, inplace=True, axis=1)

    # 2) Aired Info
    aired_columns = [_ for _ in anime_df_aired_col_clean.columns if "aired" in _]
    anime_df_aired_col_clean["aired_info"] = anime_df_aired_col_clean[
        aired_columns
    ].apply(lambda x: aired_concatenate(x), axis=1)
    anime_df_aired_col_clean.drop(aired_columns, inplace=True, axis=1)

    # 3) Genres
    anime_df_aired_col_clean["genre"] = anime_df_aired_col_clean[genres_columns].apply(
        lambda x: genre_concatenate(x), axis=1
    )
    anime_df_aired_col_clean.drop(genres_columns, inplace=True, axis=1)

    # Renaming
    renamed_columns = renaming(anime_df_aired_col_clean.columns)
    anime_df_aired_col_clean.rename(columns=renamed_columns, inplace=True)

    return anime_df_aired_col_clean, genres_df
