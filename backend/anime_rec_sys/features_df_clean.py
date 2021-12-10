""" program is used to clean the features dataset (anime.csv data) """
import pandas as pd
import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer

""" helper functions """

""" function uses mlb to factorize a col 

input
-----
    col: pd.Series col that needs to be factorized 
    col_name: name of the col that is being factorized

returns
-------
    factorized_genres: pd.Series containing the factorized gneres

"""


def col_factorize(col, col_name):
    mlb = MultiLabelBinarizer()
    expanded_data = mlb.fit_transform(col)
    mlb_classes = mlb.classes_
    new_label = []
    for c in mlb_classes:
        new_label.append(col_name + "_" + c)
    factorized_genres = pd.DataFrame(expanded_data, columns=new_label)
    return factorized_genres


""" data cleaning """

""" normalize_col_names(): function is used to normalize col names of the dataset 

input 
-----
    df: pd.DataFrame

returns
-------
    df: pd.Dataframe-> input dataframe will all colnames normalized 
"""


def normalize_col_names(df):
    replacemnt = "|".join([" ", "-"])
    df.columns = df.columns.str.replace(replacemnt, "_", regex=True)
    df.columns = df.columns.str.lower()
    return df


""" unknown_to_nan(): function is used to convert all "Unknown" strings in the dataframe to np.nan

input
-----
    df: pd.DataFrame

returns
-------
    df: pd.Dataframe

"""


def unknown_to_nan(df):
    df.replace("Unknown", np.nan, inplace=True)
    return df


""" factorize_genres(): function used to factorize a col that contains a list into individual cols

input
-----
    df: pd.Dataframe

returns
-------
    df: pd.Dataframe

"""


def factorize_genres(df):
    df["genres"].fillna("unknown_genre", inplace=True)
    df["genres"] = df["genres"].str.lower()
    df["genres"] = df["genres"].str.split(pat=", ")
    genres_df = col_factorize(df["genres"], "genres")
    df = pd.concat([df, genres_df], axis=1)
    df.drop(["genres"], axis=1, inplace=True)
    return df


""" aired_clean(): used to clean the aired col in the dataframe

input
-----
    df: pd.DataFrame

returns
-------
    df.pd.DataFrame

"""


def aired_clean(df):
    aired_df = df["aired"]
    """ aired col cleaning """
    aired_df = aired_df.str.split(pat="to", expand=True)
    aired_df.rename(columns={0: "start_date", 1: "end_date"}, inplace=True)
    aired_df.replace(" ?", np.nan, inplace=True)
    aired_df.fillna(np.nan, inplace=True)

    """ converting string to date and removing of day from date """
    aired_sd = aired_df["start_date"].str.split(
        pat=r"(\d+,)(?=\s)|,|^(?=\d)", expand=True
    )
    aired_sd.drop([1], axis=1, inplace=True)
    aired_sd.replace("", np.nan, inplace=True)
    aired_sd.rename(columns={0: "start_date_month", 2: "start_date_year"}, inplace=True)
    aired_sd["start_date_month"] = aired_sd["start_date_month"].str.strip()
    aired_sd["start_date_year"] = aired_sd["start_date_year"].str.strip()

    aired_df["end_date"] = aired_df["end_date"].str.strip()
    aired_ed = aired_df["end_date"].str.split(
        pat=r"(\d+,)(?=\s)|,|^(?=\d)", expand=True
    )
    aired_ed.drop([1], axis=1, inplace=True)
    aired_ed.replace("", np.nan, inplace=True)
    aired_ed.rename(columns={0: "end_date_month", 2: "end_date_year"}, inplace=True)
    aired_ed["end_date_month"] = aired_ed["end_date_month"].str.strip()
    aired_ed["end_date_year"] = aired_ed["end_date_year"].str.strip()

    """ removing old aired col """
    df.drop(["aired"], axis=1, inplace=True)

    """ adding altered aired cols into df """
    df["aired_start_date_month"] = aired_sd["start_date_month"]
    df["aired_start_date_year"] = aired_sd["start_date_year"]
    df["aired_end_date_month"] = aired_ed["end_date_month"]
    df["aired_end_date_year"] = aired_ed["end_date_year"]
    return df


""" prem_clean(): used to clean the premiered col in the dataframe

input
-----
    df: pd.DataFrame

returns
-------
    df.pd.DataFrame

"""


def prem_clean(df):
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
    df["premiered"] = df["aired_start_date_month"].map(prem)
    return df


""" remv_duplicates(): used to remove a duplicate anime that was found during data exploration

input
-----
    df: pd.DataFrame

returns
-------
    df.pd.DataFrame

"""


def remv_duplicates(df):
    """from some data exploration duplicate id was found to be"""
    dup_id = 39143
    df.drop(df[df.mal_id == dup_id].index, inplace=True)
    return df


""" features_df_rec_sys(): this function creates the features df for the recommendation system 

input
-----
    csv_path: path of anime.csv

returns
-------
    df: pd.DataFrame

"""


def features_df_rec_sys(csv_path):
    """this program first calls the initial function then does the rest of the cleaning"""
    df = features_df_clean(csv_path)

    """removing unwanted cols"""
    cols_to_remove = [
        "name",
        "english_name",
        "japanese_name",
        "watching",
        "completed",
        "on_hold",
        "dropped",
        "plan_to_watch",
        "score_10",
        "score_9",
        "score_8",
        "score_7",
        "score_6",
        "score_5",
        "score_4",
        "score_3",
        "score_2",
        "score_1",
        "licensors",
    ]
    df.drop(columns=cols_to_remove, inplace=True)

    """ producers col clean """
    df["producers"].fillna("Unknown_producer", inplace=True)
    df["producers"] = df["producers"].str.split(", ")
    df_producers = col_factorize(df["producers"], "producers")
    df = pd.concat([df, df_producers], axis=1)
    df.drop(columns=["producers"], inplace=True)

    """ studios col clean """
    pd.set_option("max_rows", None)
    df["studios"].fillna("Unknown_studio", inplace=True)
    df["studios"] = df["studios"].str.split(r",\s")
    df_studios = col_factorize(df["studios"], "studios")
    df = pd.concat([df, df_studios], axis=1)
    df.drop(columns=["studios"], inplace=True)

    """ duration """
    # complicated split need to do later (col temp dropped)
    df.drop(columns=["duration"], inplace=True)
    # print(df["duration"].head())

    """anime id col clean """
    df["anime_id"] = df["anime_id"].astype("int")

    """ score col clean """
    df["score"] = df["score"].astype("float")

    """ episodes col clean """
    df["episodes"] = df["episodes"].astype("float").astype("Int64")

    """ ranked col clean """
    df["ranked"] = df["ranked"].astype("float").astype("Int64")

    """ popularity col clean """
    df["popularity"] = df["popularity"].astype("float").astype("Int64")

    """ memebres col clean """
    df["members"] = df["members"].astype("float").astype("Int64")

    """ favourites col clean """
    df["favorites"] = df["favorites"].astype("float").astype("Int64")

    replacemnt = "|".join([" ", "-"])
    df.columns = df.columns.str.replace(replacemnt, "_", regex=True)
    return df


def features_df_clean(csv_path):
    df = pd.read_csv(csv_path)
    df = normalize_col_names(df)
    df = unknown_to_nan(df)
    df = factorize_genres(df)
    df = aired_clean(df)
    df = prem_clean(df)
    df = remv_duplicates(df)
    df.rename(columns={"mal_id": "anime_id"}, inplace=True)
    return df


if __name__ == "__main__":
    csv_path = "../../anime_data/anime_150_redux.csv"
    df = features_df_clean(csv_path)
    features_df_rec_sys(csv_path)
