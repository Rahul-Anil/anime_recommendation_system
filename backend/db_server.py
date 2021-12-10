#######################################################################################################################
################################################ Libraries and Set up #################################################
#######################################################################################################################

import datetime
import io
import json
import os
import re
from numpy import nextafter
import requests
import sqlite3
import sys
import glob
import pandas as pd
from flask import Flask, request, send_file
from flask_cors import CORS
from flask_restx import fields, reqparse, Resource, Api
from pandas.io import sql
import difflib
import random
import shutil
from urllib.parse import unquote
from werkzeug.wrappers import response
import uuid
import numpy as np
from anime_rec_sys.rec_sys_predict import rec_sys_predict

pd.options.mode.chained_assignment = None  # default='warn'
#######################################################################################################################
##################################################### Parameters ######################################################
#######################################################################################################################

# Current working directory
current_dir_path = os.path.dirname(sys.argv[0])

# Specify Database name
database_file = "backend.db"
# If running directly using python
database_path = current_dir_path + f"/{database_file}"

#######################################################################################################################
##################################################### Server Related###################################################
#######################################################################################################################

# Table names
# NOTE: Current the same, but incase in future we want to change
table_name_dict = {
    "anime": "anime",
    "user": "user",
    "genre": "genres",
    "watch": "watch",
}

# Create a flask-Restx application
app = Flask(__name__)
app.config.setdefault("RESTX_INCLUDE_ALL_MODELS", True)
api = Api(
    app,
    version="1.0",  # Versioning API
    title="COMP9900 Anime Recommender System",
    description="This is a sample server for COMP9900 Project (2021 t3). The team is to develop a Flask-"
    "Restx data service that allows a client to read and store Anime Shows, and allow the consumers to "
    "access the data through a REST API.",
)

# Define Endpoints
route_show = api.namespace(
    "show",  # Defining the highest hierarchical path
    description="Show route path to be access.",
)
route_users = api.namespace(
    "user",  # Defining the highest hierarchical path
    description="User route path to be access.",
)
route_login = api.namespace("login", description="Login an existing User into system.")
route_signup = api.namespace("signup", description="Sign Up a New User into system.")

# Specify address and port num for easier control
host_address = "0.0.0.0"
port_num = 8080

# Defining a Parser
# See https://flask-restful.readthedocs.io/en/latest/reqparse.html
anime_parser_import = reqparse.RequestParser()
anime_parser_lists = reqparse.RequestParser()
anime_parser_statistics = reqparse.RequestParser()

user_parser_import = reqparse.RequestParser()
user_parser_lists = reqparse.RequestParser()
user_parser_statistics = reqparse.RequestParser()

#######################################################################################################################
################################################# Utility Functions ###################################################
#######################################################################################################################


def sql_read(connection, table, cols="*"):
    """
    This function provides sql_reading
    :param connection: Connected DB
    :param table: Table Name
    :param cols: Column to be read, default = *
    :return: dataframe
    """
    # Read into Dataframe
    operating_df = sql.read_sql(f"select {cols} from " + table, con=connection)

    return operating_df


def sql_insert(connection, table, input_dict):
    """
    This function provides insertion of a given input dict to table based on the connect
    :param connection: Connected DB
    :param table: Table Name
    :param input_dict: Input Dicionary
    :return: None
    """
    # Write to database
    column_list = list(input_dict.keys())

    # Define column names
    query_columns = ", ".join(["`" + _ + "`" if "-" in _ else _ for _ in column_list])

    # Define place holders
    placeholders = ", ".join("?" * len(column_list))

    # Write SQL command
    sql = f"INSERT INTO {table} ({query_columns}) VALUES ({placeholders})"

    # List the values as str via json dumps
    raw_inserting_value_list = [input_dict[x] for x in column_list]
    updated_inserting_value_list = []
    for _ in raw_inserting_value_list:
        if isinstance(_, str) or isinstance(_,int):
            updated_inserting_value_list.append(_)
        else:
            updated_inserting_value_list.append(json.dumps(_))

    # Execute SQL command with binding values
    connection.cursor().execute(sql, updated_inserting_value_list)
    connection.commit()

    # Now we need to return only what is wanted
    """
    "id" : 123,  
    "last-update": "2021-04-08-12:34:40",
    "tvmaze-id" : 23542,
    "_links": {
        "self": {
          "href": "http://[HOST_NAME]:[PORT]/tv-shows/123"
        }
    } 
    """
    # Returning for response
    return input_dict


def sql_update(connection, table, input_dict, input_id, input_id_column_name):
    # Update Using SQL Command
    """
    Command Format:
    UPDATE table_name
    SET column1 = value1, column2 = value2, ...
    WHERE condition;
    """

    # Define column names
    update_string = ", ".join(
        [
            f"`{attribute}` = ? " if "-" in attribute else f"{attribute} = ? "
            for attribute in input_dict.keys()
        ]
    )

    # Sql command
    update_sql = (
        "UPDATE "
        + table
        + " SET "
        + update_string
        + f" WHERE {input_id_column_name}="
        + str(input_id)
    )

    # List the values as str via json dumps
    raw_inserting_value_list = [input_dict[x] for x in input_dict.keys()]
    updated_inserting_value_list = []
    for _ in raw_inserting_value_list:
        if isinstance(_, str) or isinstance(_,int):
            updated_inserting_value_list.append(_)
        else:
            updated_inserting_value_list.append(json.dumps(_))

    # Execution
    connection.execute(update_sql, updated_inserting_value_list)
    connection.commit()

    # To prepare response, we first read from the table
    updated_df = sql_read(connection=connection, table=table)

    # Retrieve details
    output_dict = updated_df.loc[updated_df[input_id_column_name] == input_id].to_dict(
        "records"
    )[0]

    # Return responses
    return output_dict


def sql_delete(connection, table, input_id, input_id_column_name):
    # sql = "DELETE FROM Customers WHERE CustomerName='Alfreds Futterkiste'"
    connection.execute(f"DELETE FROM {table} WHERE {input_id_column_name}={input_id}")
    connection.commit()
    # Prepare output response
    # Return Response Message
    output_dict = {
        "message": f"The {input_id_column_name}={input_id} was removed from the database!",
        "id": input_id,
    }
    return output_dict


# TODO: RAHUL ADD FUNCTION FOR RECOMMENDER

#######################################################################################################################
################################################# Schema Definition ###################################################
#######################################################################################################################

sch_score = api.model(
    "Score",
    {
        "score_10": fields.Integer,
        "score_9": fields.Integer,
        "score_8": fields.Integer,
        "score_7": fields.Integer,
        "score_6": fields.Integer,
        "score_5": fields.Integer,
        "score_4": fields.Integer,
        "score_3": fields.Integer,
        "score_2": fields.Integer,
        "score_1": fields.Integer,
    },
)
sch_aired = api.model(
    "Aired",
    {
        "aired_start_date_month": fields.String,
        "aired_start_date_year": fields.Integer,
        "aired_end_date_month": fields.String,
        "aired_end_date_year": fields.Integer,
    },
)

sch_show = api.model(
    "Show",
    {
        "anime_id": fields.Integer,
        "name": fields.String,
        "score": fields.Integer,
        "english_name": fields.String,
        "japanese_name": fields.String,
        "genre": fields.List(fields.String),
        "sypnopsis": fields.String,
        "type": fields.String,
        "episodes": fields.Integer,
        "premiered": fields.String,
        "producers": fields.String,
        "licensors": fields.String,
        "studios": fields.String,
        "source": fields.String,
        "duration": fields.String,
        "rating": fields.String,
        "ranked": fields.Integer,
        "popularity": fields.Integer,
        "members": fields.Integer,
        "favorites": fields.Integer,
        "watching": fields.Integer,
        "completed": fields.Integer,
        "on_hold": fields.Integer,
        "dropped": fields.Integer,
        "plan_to_watch": fields.Integer,
        "score_info": fields.Nested(sch_score),
        "aired_info": fields.Nested(sch_aired),
        "image_list": fields.List(fields.String),
    },
)

sch_create_show = api.model(
    "Show",
    {
        "name": fields.String,
        "score": fields.Integer,
        "english_name": fields.String,
        "japanese_name": fields.String,
        "genre": fields.List(fields.String),
        "sypnopsis": fields.String,
        "type": fields.String,
        "episodes": fields.Integer,
        "premiered": fields.String,
        "producers": fields.String,
        "licensors": fields.String,
        "studios": fields.String,
        "source": fields.String,
        "duration": fields.String,
        "rating": fields.String,
        "ranked": fields.Integer,
        "popularity": fields.Integer,
        "members": fields.Integer,
        "favorites": fields.Integer,
        "watching": fields.Integer,
        "completed": fields.Integer,
        "on_hold": fields.Integer,
        "dropped": fields.Integer,
        "plan_to_watch": fields.Integer,
        "score_info": fields.Nested(sch_score),
        "aired_info": fields.Nested(sch_aired),
    },
)

sch_anime_info = api.model(
    "Anime Info",
    {
        "anime_id": fields.Integer,
        "rating": fields.Integer,
        "watched_episodes": fields.Integer,
    },
)
sch_genre = api.model(
    "Genre",
    {
        "genre": fields.String,
        "anime_ids": fields.List(fields.String),
    },
)
sch_watch = api.model(
    "Watching",
    {
        "user_id": fields.Integer,
        "watching_status": fields.String,
        "anime_info": fields.Nested(sch_anime_info),
    },
)

sch_login = api.model(
    "Login",
    {
        "username": fields.String,
        "password": fields.String,
    },
)

sch_signup = api.model(
    "Signup",
    {
        "username": fields.String,
        "firstname": fields.String,
        "lastname": fields.String,
        "email": fields.String,
        "dob": fields.String,
        "password": fields.String,
    },
)

sch_user = api.model(
    "User",
    {
        "user_id": fields.Integer,
        "username": fields.String,
        "firstname": fields.String,
        "lastname": fields.String,
        "email": fields.String,
        "dob": fields.String,
        "user_type": fields.String,
        "password": fields.String,
        "token": fields.String,
        "preferred_genre": fields.List(fields.String),
        "recommended": fields.List(fields.Integer),
    },
)


#######################################################################################################################
################################################ Resource Definition ##################################################
#######################################################################################################################

# Access Server Resources =============================================================================================
@route_show.route(
    "",
    methods=["GET", "POST"],  # ONLY Three METHODs
)
class AnimeShowsQueryAPI(Resource):
    # Define Parser Arguments =========================================================================================
    anime_parser_lists.add_argument(
        "name",
        type=str,
        default=None,
        help="A string value to query the database based on the given criteria - Name.",
    )
    anime_parser_lists.add_argument(
        "year",
        type=str,
        default=None,
        help="A string value to query the database based on the given criteria - Aired Year.",
    )
    anime_parser_lists.add_argument(
        "genre",
        type=str,
        default=None,
        help="A string value to query the database based on the given criteria - Genre.",
    )
    anime_parser_lists.add_argument(
        "studio",
        type=str,
        default=None,
        help="A string value to query the database based on the given criteria - Studio.",
    )
    anime_parser_lists.add_argument(
        "score",
        type=int,
        default=None,
        help="A integer value to query the database based on the given criteria - Score.",
    )
    anime_parser_lists.add_argument(
        "order_by",
        type=str,
        default="anime_id",
        help="A comma separated string value to sort the list based on the given criteria {anime_id,"
        "name,premiered,rating-average}.",
    )
    anime_parser_lists.add_argument(
        "random_list",
        type=bool,
        default="false",
        help="Randomly generate a list of ids.",
    )
    anime_parser_lists.add_argument("page", type=int, default=1, help="Page number.")
    anime_parser_lists.add_argument(
        "page_size",
        type=int,
        default=30,
        help="Shows the number of Anime shows per page.",
    )
    # GET =============================================================================================================
    @api.doc(
        description="Queries Database for given",
        responses={
            200: "Query was retrieved from server database successfully",
            400: "Input is invalid.",  # This is removed as id is set to be Required with integer, not other is needed
            404: "Query resulted in Error on server database.",
            412: "Pre-condition failed, database is empty, please import a show before performing this action.",
            503: f"{database_file} is missing from the directory, please re-run server script.",
        },
    )
    @api.expect(anime_parser_lists)
    def get(self):
        # In Case database was removed
        if not os.path.isfile(database_path):
            return {
                "message": f"Can not find {database_file} in directory, please re-run the api server. Current file list is {glob.glob(os.getcwd()+'/*')}."
            }, 503
        # Fetch Args
        args = anime_parser_lists.parse_args()

        # Retrieve the parameters
        parameters_dict = {}
        for arg in anime_parser_lists.args:
            parameters_dict[arg.name] = args.get(arg.name)

        # If None replaced via default
        for arg in parameters_dict.keys():
            # Strip the space
            if type(parameters_dict[arg]) == str:
                parameters_dict[arg] = parameters_dict[arg].replace(" ", "").lower()

        # For Debugging
        print(f"Entered Anime Query: {parameters_dict}")
        # Open Database
        with sqlite3.connect(database_path) as connect:
            # Read database as dataframe
            anime_df = sql_read(connection=connect, table=table_name_dict["anime"])

            # Force fix page size
            if parameters_dict["page_size"] > len(anime_df):
                parameters_dict["page_size"] = len(anime_df)

            # Prepare output
            output_dict = {}

            # Random List returns random IDs
            if parameters_dict["random_list"] == True:
                # TODO: Replace here with randomly generated list from existing anime ID
                list_of_random_items = random.sample(
                    anime_df["anime_id"].tolist(), parameters_dict["page_size"]
                )
                random_df = anime_df.loc[
                    anime_df["anime_id"].isin(list_of_random_items)
                ]
                # Sort by
                random_df.sort_values(parameters_dict["order_by"], inplace=True)
                # Write to result
                output_dict["results"] = random_df.to_dict("records")
                # Returning
                return output_dict, 200

            # If there is query, we sort the dataframe by query
            if parameters_dict["name"]:
                # querying the dataframe
                close_matches = difflib.get_close_matches(
                    parameters_dict["name"],
                    anime_df["name"],
                    n=parameters_dict["page_size"],
                    cutoff=0.3,
                )
                anime_df = anime_df.loc[anime_df["name"].isin(close_matches) == True]

            # If there is query, we sort the dataframe by query
            if parameters_dict["year"]:
                # NOTE: Temporarily Solution
                tmp_df = anime_df[["anime_id", "aired_info"]]
                tmp_df["year"] = tmp_df["aired_info"].apply(
                    lambda x: int(
                        json.loads(x.replace("'", '"'))["aired_start_date_year"]
                    )
                    if x
                    else "unknown"
                )
                # Drop Strings
                tmp_df = tmp_df[
                    pd.to_numeric(tmp_df["year"], errors="coerce").notnull()
                ]
                tmp_df = tmp_df.loc[tmp_df["year"] >= int(parameters_dict["year"])]
                # Get
                anime_df = anime_df.loc[
                    anime_df["anime_id"].isin(tmp_df["anime_id"]) == True
                ]

            # If there is query, we sort the dataframe by query
            if parameters_dict["genre"]:
                # querying the dataframe
                tmp_df = anime_df[["anime_id", "genre"]]
                tmp_df["queried"] = tmp_df["genre"].apply(
                    lambda x: True
                    if parameters_dict["genre"] in json.loads(x.replace("'", '"'))
                    else False
                )
                tmp_df = tmp_df.loc[tmp_df["queried"] == True]
                # Get
                anime_df = anime_df.loc[
                    anime_df["anime_id"].isin(tmp_df["anime_id"]) == True
                ]

            # If there is query, we sort the dataframe by query
            if parameters_dict["studio"]:
                # querying the dataframe
                close_matches = difflib.get_close_matches(
                    parameters_dict["studio"],
                    anime_df["studio"],
                    n=parameters_dict["page_size"],
                    cutoff=0.3,
                )
                anime_df = anime_df.loc[anime_df["name"].isin(close_matches) == True]

            # If there is query, we sort the dataframe by query
            if parameters_dict["score"]:
                # querying the dataframe
                anime_df = anime_df.loc[anime_df["score"] >= parameters_dict["score"]]

            # TODO: Check empty page
            if anime_df.empty:
                return {"message": "No close matches were found."}, 404

            # Sort by
            anime_df.sort_values(parameters_dict["order_by"], inplace=True)

            # Given page size
            start_index = (parameters_dict["page"] - 1) * parameters_dict["page_size"]
            end_index = parameters_dict["page"] * parameters_dict["page_size"]

            # TODO: Check empty page
            if start_index > len(anime_df):
                return {
                    "message": "The given page is out of Index of current database"
                }, 404

            # Preparing based on page
            anime_df = anime_df.iloc[start_index:end_index]
            # Write output
            output_dict["results"] = anime_df.to_dict("records")

            # Prepare next page lin
            next_page_list = []
            for key, value in parameters_dict.items():
                if key == "page":
                    next_page_list.append(f"{key}={value+1}")
                    continue
                if value:
                    next_page_list.append(f"{key}={value}")
            # NOTE: change to none hardcoded 8080
            output_dict["next_page"] = "http://localhost:8080/show?" + "&".join(
                next_page_list
            )
            # Returning
            return output_dict, 200

    # POST =============================================================================================================
    @api.doc(
        description="Create a Anime Show via id from local database.",
        responses={
            200: "Anime show was created from server database successfully",
            400: "Input is invalid.",  # This is removed as id is set to be Required with integer, not other is needed
            404: "Anime Show was not able to be created on server database.",
            412: "Pre-condition failed, database is empty, please import a show before performing this action.",
            503: f"{database_file} is missing from the directory, please re-run server script.",
        },
    )
    @api.expect(sch_create_show, validate=True)
    def post(self):
        # In Case database was removed
        if not os.path.isfile(database_path):
            return {
                "message": f"Can not find {database_file} in directory, please re-run the api server. Current file list is {glob.glob(os.getcwd()+'/*')}."
            }, 503

        # First check if there is any missing
        response_dict = json.loads(request.data)
        for key in sch_create_show:
            if key not in response_dict.keys():
                return {"message": f"Missing {key} in payload."}, 400

        # Open Database
        with sqlite3.connect(database_path) as connect:
            # Read database as dataframe
            anime_df = sql_read(connection=connect, table=table_name_dict["anime"])

            # Brute force cut off
            response_dict["anime_id"] = int(anime_df["anime_id"].max() + 1)

            # Update Image lise
            response_dict["image_list"] = ["001.png", "002.png", "003.png"]

            # If all passed then add into database
            output_dict = sql_insert(
                connection=connect,
                table=table_name_dict["anime"],
                input_dict=response_dict,
            )

            # Copy template image
            image_dir_path = database_path.replace(
                "backend.db", f'anime_data/images/{response_dict["anime_id"]}'
            )
            # Create if not exists
            if not os.path.exists(image_dir_path):
                os.mkdir(image_dir_path)

            # Iterate to gnerate
            dummy_image_path = database_path.replace("backend.db", "template_image.png")
            for _ in response_dict["image_list"]:
                image_path = image_dir_path + "/" + _
                shutil.copy(dummy_image_path, image_path)

            return output_dict, 200


# Access Server Resources =============================================================================================
@route_show.route(
    "/<int:id>",
    methods=["GET", "POST", "PUT", "DELETE"],  # ONLY Three METHODs
)
@route_show.route(
    "/<int:id>/images/<string:filename>",
    methods=["GET"],  # ONLY Three METHODs
)
@route_show.doc(
    params={"id": "A anime show identification number used in server database."}
)
class AnimeShowAPI(Resource):
    # GET =============================================================================================================
    @api.doc(
        description="Retrieve a Anime Show via id from local database.",
        responses={
            200: "Anime show was retrieved from server database successfully",
            400: "Input is invalid.",  # This is removed as id is set to be Required with integer, not other is needed
            404: "Anime Show was not found on server database.",
            412: "Pre-condition failed, database is empty, please import a show before performing this action.",
            503: f"{database_file} is missing from the directory, please re-run server script.",
        },
    )
    def get(self, **kwargs):
        input_request_dict = kwargs

        # In Case database was removed
        if not os.path.isfile(database_path):
            return {
                "message": f"Can not find {database_file} in directory, please re-run the api server. Current file list is {glob.glob(os.getcwd()+'/*')}."
            }, 503
        # Open Database
        with sqlite3.connect(database_path) as connect:

            # Read database as dataframe
            anime_df = sql_read(connection=connect, table=table_name_dict["anime"])

            # Check if any tv show is stored database
            if anime_df.empty:
                return {
                    "message": "Empty server database, please import at least a tv show."
                }, 412

            # Check if within dataframe
            if input_request_dict["id"] not in anime_df.anime_id.values.tolist():
                return {
                    "message": f"Anime show with id={input_request_dict['id']} does not exists within server database."
                }, 404
            # Else
            output_dict = anime_df.loc[
                anime_df.anime_id == input_request_dict["id"]
            ].to_dict("records")[0]

            # If not asking for file:
            if "filename" not in input_request_dict.keys():
                return output_dict, 200

            # Check if filename is within
            if input_request_dict["filename"] not in output_dict["image_list"]:
                return {
                    "message": f"Anime show with id={input_request_dict['id']} does not have filename={input_request_dict['filename']} within server database."
                }, 404

            # Returning image
            image_path = database_path.replace(
                "backend.db",
                f"anime_data/images/{input_request_dict['id']}/{input_request_dict['filename']}",
            )

            return send_file(image_path, mimetype="image/PNG", cache_timeout=0)

    # PUT ==============================================================================================================
    @api.doc(
        description="Update a Anime Show via id from local database.",
        responses={
            200: "Anime show was updated from server database successfully",
            400: "Input is invalid.",  # This is removed as id is set to be Required with integer, not other is needed
            404: "Anime Show was not able to be updated server database.",
            412: "Pre-condition failed, database is empty, please import a show before performing this action.",
            503: f"{database_file} is missing from the directory, please re-run server script.",
        },
    )
    @api.expect(sch_show, validate=True)
    def put(self, **kwargs):
        input_request_dict = kwargs

        # In Case database was removed
        if not os.path.isfile(database_path):
            return {
                "message": f"Can not find {database_file} in directory, please re-run the api server. Current file list is {glob.glob(os.getcwd()+'/*')}."
            }, 503

        # First check if there is any missing
        response_dict = json.loads(request.data)

        # Check if anime id in
        if 'anime_id' not in response_dict.keys():
            return {
                "message": f"Missing anime_id field. Please ensure to have anime id field in payload."
            }, 400

        # Not allowing id change
        if response_dict["anime_id"] != input_request_dict["id"]:
            return {
                "message": f"Miss match between input ID, {input_request_dict['id']}, and given payload anime ID, {response_dict['anime_id']}. Can not change anime id."
            }, 400

        # Open Database
        with sqlite3.connect(database_path) as connect:
            # Read database as dataframe
            anime_df = sql_read(connection=connect, table=table_name_dict["anime"])

            # If attempting to update non existing
            if input_request_dict["id"] not in anime_df["anime_id"].to_list():
                return {
                    "message": f"Attempting to update non existing anime id, {response_dict['anime_id']}. Please use Post for creating new."
                }, 400
            # If attempting to update image list
            if "image_list" in response_dict:
                return {
                    "message": f"Can not update image list, currently self generated."
                }, 400

            # Prepare output
            output_dict = sql_update(
                connect,
                table_name_dict["anime"],
                response_dict,
                input_request_dict["id"],
                "anime_id",
            )
            return output_dict, 200

    # DELETE ===========================================================================================================
    @api.doc(
        description="Delete a Anime Show via id from local database.",
        responses={
            200: "Anime show was deleted from server database successfully",
            400: "Input is invalid.",  # This is removed as id is set to be Required with integer, not other is needed
            404: "Anime Show was not able to be deleted server database.",
            412: "Pre-condition failed, database is empty, please import a show before performing this action.",
            503: f"{database_file} is missing from the directory, please re-run server script.",
        },
    )
    def delete(self, **kwargs):
        input_request_dict = kwargs

        # In Case database was removed
        if not os.path.isfile(database_path):
            return {
                "message": f"Can not find {database_file} in directory, please re-run the api server. Current file list is {glob.glob(os.getcwd()+'/*')}."
            }, 503

        # Open Database
        with sqlite3.connect(database_path) as connect:
            # Read database as dataframe
            anime_df = sql_read(connection=connect, table=table_name_dict["anime"])

            # If attempting to update non existing
            if input_request_dict["id"] not in anime_df["anime_id"].to_list():
                return {
                    "message": f"Attempting to delete non existing anime id, {input_request_dict['id']}."
                }, 400

            # Performing deletion of the tv show
            output_dict = sql_delete(
                connect, table_name_dict["anime"], input_request_dict["id"], "anime_id"
            )

            # Removing images:
            image_dir_path = database_path.replace(
                "backend.db", f'anime_data/images/{input_request_dict["id"]}'
            )
            shutil.rmtree(image_dir_path)

            return output_dict, 200


# Access Server Resources =============================================================================================
@route_users.route(
    "",
    methods=["GET"],  # ONLY Three METHODs
)
class UsersQueryAPI(Resource):
    # Define Parser Arguments =========================================================================================
    user_parser_lists.add_argument(
        "username",
        type=str,
        default=None,
        help="A string value to query the database based on the given criteria - username.",
    )
    user_parser_lists.add_argument(
        "firstname",
        type=str,
        default=None,
        help="A string value to query the database based on the given criteria - firstname.",
    )
    user_parser_lists.add_argument(
        "lastname",
        type=str,
        default=None,
        help="A string value to query the database based on the given criteria - lastname.",
    )
    user_parser_lists.add_argument(
        "dob",
        type=str,
        default=None,
        help="A string value to query the database based on the given criteria - Date of Bith 'YYYY-MM-DD'.",
    )
    user_parser_lists.add_argument(
        "email",
        type=str,
        default=None,
        help="A integer value to query the database based on the given criteria - email.",
    )
    user_parser_lists.add_argument(
        "user_type",
        type=str,
        default=None,
        help="A integer value to query the database based on the given criteria - user type.",
    )
    user_parser_lists.add_argument(
        "order_by",
        type=str,
        default="user_id",
        help="A comma separated string value to sort the list based on the given criteria {user_id,"
        "username,firstname,lastname,user_type}.",
    )
    user_parser_lists.add_argument("page", type=int, default=1, help="Page number.")
    user_parser_lists.add_argument(
        "page_size",
        type=int,
        default=30,
        help="Shows the number of Anime shows per page.",
    )
    # GET =============================================================================================================
    @api.doc(
        description="Queries Database for given",
        responses={
            200: "Query was retrieved from server database successfully",
            400: "Input is invalid.",  # This is removed as id is set to be Required with integer, not other is needed
            404: "Query resulted in Error on server database.",
            412: "Pre-condition failed, database is empty, please import a show before performing this action.",
            503: f"{database_file} is missing from the directory, please re-run server script.",
        },
    )
    @api.expect(user_parser_lists)
    def get(self):
        # In Case database was removed
        if not os.path.isfile(database_path):
            return {
                "message": f"Can not find {database_file} in directory, please re-run the api server. Current file list is {glob.glob(os.getcwd()+'/*')}."
            }, 503
        # Fetch Args
        args = user_parser_lists.parse_args()

        # Retrieve the parameters
        parameters_dict = {}
        for arg in user_parser_lists.args:
            parameters_dict[arg.name] = args.get(arg.name)

        # For Debugging
        print(f"Entered User Query: {parameters_dict}")
        # Open Database
        with sqlite3.connect(database_path) as connect:
            # Read database as dataframe
            user_df = sql_read(connection=connect, table=table_name_dict["user"])

            # Force fix page size
            if parameters_dict["page_size"] > len(user_df):
                parameters_dict["page_size"] = len(user_df)

            # Prepare output
            output_dict = {}

            # If there is query, we sort the dataframe by query
            if parameters_dict["username"]:
                # querying the dataframe
                close_matches = difflib.get_close_matches(
                    parameters_dict["username"],
                    user_df["username"],
                    n=parameters_dict["page_size"],
                    cutoff=0.1,
                )
                user_df = user_df.loc[user_df["username"].isin(close_matches) == True]

            # If there is query, we sort the dataframe by query
            if parameters_dict["firstname"]:
                # querying the dataframe
                close_matches = difflib.get_close_matches(
                    parameters_dict["firstname"],
                    user_df["firstname"],
                    n=parameters_dict["page_size"],
                    cutoff=0.1,
                )
                user_df = user_df.loc[user_df["firstname"].isin(close_matches) == True]

            # If there is query, we sort the dataframe by query
            if parameters_dict["lastname"]:
                # querying the dataframe
                close_matches = difflib.get_close_matches(
                    parameters_dict["lastname"],
                    user_df["lastname"],
                    n=parameters_dict["page_size"],
                    cutoff=0.1,
                )
                user_df = user_df.loc[user_df["lastname"].isin(close_matches) == True]

            # If there is query, we sort the dataframe by query
            if parameters_dict["dob"]:
                # querying the dataframe
                close_matches = difflib.get_close_matches(
                    parameters_dict["dob"],
                    user_df["dob"],
                    n=parameters_dict["page_size"],
                    cutoff=0.1,
                )
                user_df = user_df.loc[user_df["dob"].isin(close_matches) == True]

            # If there is query, we sort the dataframe by query
            if parameters_dict["email"]:
                # querying the dataframe
                close_matches = difflib.get_close_matches(
                    parameters_dict["email"],
                    user_df["email"],
                    n=parameters_dict["page_size"],
                    cutoff=0.1,
                )
                user_df = user_df.loc[user_df["email"].isin(close_matches) == True]

            # If there is query, we sort the dataframe by query
            if parameters_dict["user_type"]:
                # querying the dataframe
                close_matches = difflib.get_close_matches(
                    parameters_dict["user_type"],
                    user_df["user_type"],
                    n=parameters_dict["page_size"],
                    cutoff=0.1,
                )
                user_df = user_df.loc[user_df["user_type"].isin(close_matches) == True]

            # TODO: Check empty page
            if user_df.empty:
                return {"message": "No close matches were found."}, 404

            # Sort by
            user_df.sort_values(parameters_dict["order_by"], inplace=True)

            # Given page size
            start_index = (parameters_dict["page"] - 1) * parameters_dict["page_size"]
            end_index = parameters_dict["page"] * parameters_dict["page_size"]

            # TODO: Check empty page
            if start_index > len(user_df):
                return {
                    "message": "The given page is out of Index of current database"
                }, 404

            # Preparing based on page
            user_df = user_df.iloc[start_index:end_index]
            # Write output
            output_dict["results"] = user_df.to_dict("records")

            # Prepare next page lin
            next_page_list = []
            for key, value in parameters_dict.items():
                if key == "page":
                    next_page_list.append(f"{key}={value+1}")
                    continue
                if value:
                    next_page_list.append(f"{key}={value}")
            # NOTE: change to none hardcoded 8080
            output_dict["next_page"] = "http://localhost:8080/user?" + "&".join(
                next_page_list
            )
            # Returning
            return output_dict, 200


# Access Server Resources =============================================================================================
@route_users.route(
    "/<int:id>",
    endpoint="user",
    methods=["GET", "PUT", "DELETE"],  # ONLY Three METHODs
)
@route_users.doc(params={"id": "A user identification number used in server database."})
class UsersAPI(Resource):
    # GET =============================================================================================================
    @api.doc(
        description="Retrieve a User via id from local database.",
        responses={
            200: "User was retrieved from server database successfully",
            400: "Input is invalid.",  # This is removed as id is set to be Required with integer, not other is needed
            404: "User was not found on server database.",
            412: "Pre-condition failed, database is empty, please import a show before performing this action.",
            503: f"{database_file} is missing from the directory, please re-run server script.",
        },
    )
    def get(self, id):
        # In Case database was removed
        if not os.path.isfile(database_path):
            return {
                "message": f"Can not find {database_file} in directory, please re-run the api server. Current file list is {glob.glob(os.getcwd()+'/*')}."
            }, 503
        # Open Database
        with sqlite3.connect(database_path) as connect:

            # Read database as dataframe
            user_df = sql_read(connection=connect, table=table_name_dict["user"])

            # Check if any tv show is stored database
            if user_df.empty:
                return {
                    "message": "Empty server database, please import at least a user info."
                }, 412

            # Check if within dataframe
            if id not in user_df.user_id.values.tolist():
                return {
                    "message": f"User with id={id} does not exists within server database."
                }, 404
            # Else
            output_dict = user_df.loc[user_df.user_id == id].to_dict("records")[0]
            return output_dict, 200

    # PUT ==============================================================================================================
    @api.doc(
        description="Update a User via id from local database.",
        responses={
            200: "User was updated from server database successfully",
            400: "Input is invalid.",  # This is removed as id is set to be Required with integer, not other is needed
            404: "User was not able to be updated server database.",
            412: "Pre-condition failed, database is empty, please import a show before performing this action.",
            503: f"{database_file} is missing from the directory, please re-run server script.",
        },
    )
    @api.expect(sch_user, validate=True)
    def put(self, **kwargs):
        # We can assume here that when it is called, we will update
        # Take Arguments
        input_request_dict = kwargs

        # In Case database was removed
        if not os.path.isfile(database_path):
            return {
                "message": f"Can not find {database_file} in directory, please re-run the api server. Current file list is {glob.glob(os.getcwd()+'/*')}."
            }, 503

        # First check if there is any missing
        response_dict = json.loads(request.data)

        # Not allowing id change
        if response_dict["user_id"] != input_request_dict["id"]:
            return {
                "message": f"Miss match between input ID, {input_request_dict['id']}, and given payload user ID, {response_dict['user_id']}. Can not change user id."
            }, 400

        # Open Database
        with sqlite3.connect(database_path) as connect:
            # Read database as dataframe
            user_df = sql_read(connection=connect, table=table_name_dict["user"])
            anime_df = sql_read(connection=connect, table=table_name_dict["anime"])
            genre_df = sql_read(connection=connect, table=table_name_dict["genre"])

            # If attempting to update non existing
            if input_request_dict["id"] not in user_df["user_id"].to_list():
                return {
                    "message": f"Attempting to update non existing user id, {response_dict['user_id']}. Please use Post for creating new."
                }, 400
            # Remove Token from list if it exists, as it cant be change
            if "token" in input_request_dict.keys():
                return {
                    "message": f"Can not update token, currently self generated."
                }, 400

            # Sanity Check for preferred genre
            if "preferred_genre" not in response_dict.keys():
                tmp_list = random.sample(genre_df['genre'].to_list(), 10 - len(response_dict["preferred_genre"]))
            elif "preferred_genre" in response_dict.keys():
                # Check if inputted genre is in total list
                response_dict["preferred_genre"] = [_ for _ in response_dict["preferred_genre"] if _ in genre_df['genre'].to_list()]
                # Randomly Generate if you dont select 10
                response_dict["preferred_genre"] = list(set(response_dict["preferred_genre"]))
                if len(response_dict["preferred_genre"]) < 10:
                    unincluded_genres = list(set(genre_df['genre'].to_list()) - set(response_dict["preferred_genre"]))
                    tmp_list = random.sample(unincluded_genres, 10 - len(response_dict["preferred_genre"]))
                    response_dict["preferred_genre"] = response_dict["preferred_genre"] + tmp_list

            # Recommendation
            # Safety Net for preferred Genre
            if (
                "preferred_genre" not in response_dict.keys()
                or response_dict["preferred_genre"] == []
            ):
                response_dict["recommended"] = random.sample(
                    anime_df["anime_id"].to_list(), 10
                )
            else:
                # Predict Recommendation
                try:
                    rs = rec_sys_predict()
                    response_dict["recommended"] = rs.new_user(
                        response_dict["preferred_genre"]
                    )
                except Exception as e:
                    print("Error occured when generating recommended list {}".format(e))
                    response_dict["recommended"] = random.sample(
                        anime_df["anime_id"].to_list(), 10
                    )
            # Add Preferred genre percentage
            response_dict["preferred_genre_percentage"] = {_: 10 for _ in response_dict['preferred_genre']}
            # Prepare output
            output_dict = sql_update(
                connect,
                table_name_dict["user"],
                response_dict,
                input_request_dict["id"],
                "user_id",
            )
            return output_dict, 200

    # DELETE ===========================================================================================================
    @api.doc(
        description="Delete a User via id from local database.",
        responses={
            200: "User was deleted from server database successfully",
            400: "Input is invalid.",  # This is removed as id is set to be Required with integer, not other is needed
            404: "User was not able to be deleted server database.",
            412: "Pre-condition failed, database is empty, please import a show before performing this action.",
            503: f"{database_file} is missing from the directory, please re-run server script.",
        },
    )
    def delete(self, **kwargs):
        input_request_dict = kwargs

        # In Case database was removed
        if not os.path.isfile(database_path):
            return {
                "message": f"Can not find {database_file} in directory, please re-run the api server. Current file list is {glob.glob(os.getcwd()+'/*')}."
            }, 503

        # Open Database
        with sqlite3.connect(database_path) as connect:
            # Read database as dataframe
            user_df = sql_read(connection=connect, table=table_name_dict["user"])

            # If attempting to update non existing
            if input_request_dict["id"] not in user_df["user_id"].to_list():
                return {
                    "message": f"Attempting to delete non existing user id, {input_request_dict['id']}."
                }, 400

            # Performing deletion of the tv show
            output_dict = sql_delete(
                connect, table_name_dict["user"], input_request_dict["id"], "user_id"
            )

            return output_dict, 200


# Sign Up Resources =============================================================================================
@route_signup.route(
    "",
    methods=["POST"],  # ONLY Three METHODs
)
class SignUpAPI(Resource):
    @api.doc(
        description="Sign up a new user to the database.",
        responses={
            200: "User was created in server database successfully",
            400: "Input is invalid.",  # This is removed as id is set to be Required with integer, not other is needed
            404: "User was unable to be created server database.",
            412: "Pre-condition failed, database is empty, please import a show before performing this action.",
            503: f"{database_file} is missing from the directory, please re-run server script.",
        },
    )
    @api.expect(sch_signup, validate=True)
    def post(self):
        # In Case database was removed
        if not os.path.isfile(database_path):
            return {
                "message": f"Can not find {database_file} in directory, please re-run the api server. Current file list is {glob.glob(os.getcwd()+'/*')}."
            }, 503
        # First check if there is any missing
        response_dict = json.loads(request.data)
        # Check data structure
        for key in sch_signup:
            if key not in response_dict.keys():
                return {"message": f"Missing {key} in payload."}, 400

        # Check if username or email already exists already exists
        # Open Database
        with sqlite3.connect(database_path) as connect:
            # Read database as dataframe
            user_df = sql_read(connection=connect, table=table_name_dict["user"])

            # Check Username
            if response_dict["username"] in user_df["username"].to_list():
                return {
                    "message": f"Username {response_dict['username']} alread exists in database."
                }, 400
            # Check Email
            if response_dict["email"] in user_df["email"].to_list():
                return {
                    "message": f"Email {response_dict['email']} alread exists in database."
                }, 400
            # Generate:
            response_dict["user_id"] = int(user_df["user_id"].max() + 1)
            response_dict["token"] = uuid.uuid4().hex
            response_dict["user_type"] = "-"
            response_dict["preferred_genre"] = []
            response_dict["recommended"] = []

            # If all passed - Insert the new user
            output_dict = sql_insert(
                connection=connect,
                table=table_name_dict["user"],
                input_dict=response_dict,
            )

            return output_dict, 200


# Login Resources =============================================================================================
@route_login.route(
    "",
    methods=["POST"],  # ONLY Three METHODs
)
class LoginAPI(Resource):
    @api.expect(sch_login, validate=True)
    def post(self):
        # First check if there is any missing
        response_dict = json.loads(request.data)
        # Check data structure
        for key in sch_login:
            if key not in response_dict.keys():
                return {"message": f"Missing {key} in payload."}, 400
                # Open Database
        with sqlite3.connect(database_path) as connect:
            # Read database as dataframe
            user_df = sql_read(connection=connect, table=table_name_dict["user"])

            # Find
            tmp_df = user_df.loc[
                (user_df["username"] == response_dict["username"])
                & (user_df["password"] == response_dict["password"])
            ]

            # If Empty
            if tmp_df.empty:
                return {
                    "message": f"The username and password combination is incorrect, please try again."
                }, 404

            output_dict = {}
            for key, value in tmp_df.iloc[0].to_dict().items():
                if isinstance(value, np.int64):
                    value = int(value)
                output_dict[key] = value

            # If not
            return output_dict, 200


#######################################################################################################################
################################################### Main Function #####################################################
#######################################################################################################################

if __name__ == "__main__":
    # run the application
    CORS(app)
    app.run(host=host_address, port=port_num, debug=True)
