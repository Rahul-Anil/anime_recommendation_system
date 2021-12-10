""" program is used for augmenting the anime_list data to improve the ratings col """
import pandas as pd
from anime_rec_sys.features_df_clean import features_df_rec_sys
from anime_rec_sys.ratings_df_clean import ratings_df_clean


""" combines episodes from features df to ratings df and then creates 
the percent_watched col using watched episodes col and episodes col 

input
-----
    dff: pd.Dataframe of featues dataset
    dfr: pd.Dataframe of ratings dataset

returns
------
    dd: pd.DataFrame

"""


def episode_augmentation(dff, dfr):
    dff = dff[["anime_id", "episodes"]]
    dd = pd.merge(dff, dfr, on="anime_id", how="outer")
    dd["percent_watched"] = dd["watched_episodes"] / dd["episodes"]
    dd.drop(columns=["watched_episodes", "episodes"], inplace=True)
    return dd


""" changes the ratings/ weights depending upon the percent watched col 

input
-----
    df: pd.Dataframe

returns 
-------
    df: pd.Dataframe

"""


def ratings_weight_change(df):
    df = df[df.percent_watched != 0].copy()
    df.reset_index()
    df["rating"] = df["rating"] * df["percent_watched"]
    df.drop(columns=["percent_watched"], inplace=True)
    return df


def augmentation_df(features_path, ratings_path):
    dff = features_df_rec_sys(features_path)
    dfr = ratings_df_clean(ratings_path)
    dfr = episode_augmentation(dff, dfr)
    dfr = ratings_weight_change(dfr)
    dfr = dfr[dfr.anime_id != 39143].copy()
    return dfr


if __name__ == "__main__":
    ratings_df_path = "../../anime_data/animelist_150_redux.csv"
    features_df_path = "../../anime_data/anime_150_redux.csv"
    dfr = augmentation_df(features_df_path, ratings_df_path)
    print(dfr.head())
