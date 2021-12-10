""" this program is used to reduce the size of rh anime.csv and animelist.csv 
dataset from over 17k anime id's to 150 anime id's to allow the model to be trained in reasonable time """
import pandas as pd

""" function is used to reduce the number of anime's i.e. anime_id's to 150 

inputs:
--------
    features_df_path: path of anime.csv
    ratings_df_path: path of animelist.csv

output:
--------
    writes 2 csv's in the anime_data directory
    anime_150_redux.csv: reduced form of anime.csv
    animelist_150_redux.csv: reduced form of animelist.csv """ 


def data_reduction(features_df_path, ratings_df_path):
    dff = pd.read_csv(features_df_path)
    dfr = pd.read_csv(ratings_df_path)
    size = 150
    dff = dff.iloc[:size, :].copy()
    anime_id_unq = dff["MAL_ID"].unique().tolist()
    dfr = dfr.loc[dfr["anime_id"].isin(anime_id_unq)]
    dff.reset_index(inplace=True, drop=True)
    dfr.reset_index(inplace=True, drop=True)
    print(dff.head())
    print(dfr.head())
    print(dff.index)
    dff.to_csv("../../anime_data/anime_150_redux.csv", index=False)
    dfr.to_csv("../../anime_data/animelist_150_redux.csv", index=False)

