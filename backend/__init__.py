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

import pandas as pd
from flask import Flask, request, send_file
from flask_restx import fields, reqparse, Resource, Api
from pandas.io import sql

from database_pull import *
from post_processing import *
from sqlite_db_writing import *


#######################################################################################################################
##################################################### Parameters ######################################################
#######################################################################################################################

# Current working directory
current_dir_path = os.path.dirname(sys.argv[0])

# Output Dir Name
csv_dir = "anime_data"
# Anime Path
anime_data_path = current_dir_path + f"/{csv_dir}"

# Specify Database name
database_file = "backend.db"
database_path = current_dir_path + f"/{database_file}"

if os.path.basename(database_path) == database_path[1:]:
    database_path = database_file
#######################################################################################################################
##################################################### Initialize ######################################################
#######################################################################################################################

# 1) Download Dataset
download_database(anime_data_path)

# 2) Post Processing
post_processing(anime_data_path)

# 3) Convert to DB
csv_to_db(anime_data_path, database_path)