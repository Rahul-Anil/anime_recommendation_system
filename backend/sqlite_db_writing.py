"""
Formulate Initial Cleaned SQLite database and store in as DB
"""
#######################################################################################################################
################################################ Libraries and Set up #################################################
#######################################################################################################################

import datetime
import io
import json
import os
import re
import requests
import sqlite3
import sys
import glob

import pandas as pd
from flask import Flask, request, send_file
from flask_restx import fields, reqparse, Resource, Api
from pandas.io import sql

#######################################################################################################################
##################################################### Parameters ######################################################
#######################################################################################################################

# Get file path to current python script
current_dir_path = os.path.dirname(sys.argv[0])
# Output Dir Name
csv_dir = "anime_data"
# Anime Path
anime_data_path = current_dir_path + f"/{csv_dir}"

# Database Name
database_file = "backend.db"
# Database Path
database_path = current_dir_path + f"/{database_file}"

#######################################################################################################################
##################################################### Functions #######################################################
#######################################################################################################################


def csv_to_db(csv_dir_path, database_path):
    # Glob all CSVs
    csv_list = glob.glob(csv_dir_path + "/*.csv")

    # Connect
    connect = sqlite3.connect(database_path)

    # Iterate to generate datbase files
    for csv_path in csv_list:
        # Name
        table_name = os.path.basename(csv_path).split(".")[0]
        # Read
        operating_df = pd.read_csv(csv_path, low_memory=False)
        # Store
        print(
            "[{}]:[INFO] : Writing {} into {} ".format(
                datetime.datetime.now(), table_name, os.path.basename(database_path)
            )
        )
        sql.to_sql(
            operating_df, name=table_name, con=connect, index=False, if_exists="replace"
        )

    # Checking
    cursor = connect.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print(
        "[{}]:[INFO] : Database now contains {} Tables".format(
            datetime.datetime.now(), cursor.fetchall()
        )
    )

    # Close connection
    connect.close()
    # Message
    print(
        "[{}]:[INFO] : Completed Database Initialization, stored in {}".format(
            datetime.datetime.now(), database_path
        )
    )


#######################################################################################################################
################################################### Main Function #####################################################
#######################################################################################################################

if __name__ == "__main__":
    # Convert to db
    csv_to_db(anime_data_path, database_path)
