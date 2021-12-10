""" Program is used to clean the ratings data (animelist.csv) """
import pandas as pd


""" ratings_df_clean(): fcuntion is used to clean the ratings dataset 

input
-----
    csv_path: path to the animelist.csv dataset

returns
-------
    df: pd.DataFrame

"""


def ratings_df_clean(csv_path):
    df = pd.read_csv(csv_path)
    df.drop(columns=["watching_status"], inplace=True)
    return df
