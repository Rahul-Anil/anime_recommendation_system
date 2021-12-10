"""
This Script mainly pulls raw data from Kaggle and store into output dir, unzipped
"""

#######################################################################################################################
################################################ Libraries and Set up #################################################
#######################################################################################################################

import os
import sys
import shutil
import zipfile
import datetime

#######################################################################################################################
##################################################### Parameters ######################################################
#######################################################################################################################

# Kaggle Details
os.environ["KAGGLE_USERNAME"] = "forcomp9900"
os.environ["KAGGLE_KEY"] = "74b668c430382c349ca41164cb9d0812"

# Kaggle Dataset Location
kaggle_dataset_location = " -d hernan4444/anime-recommendation-database-2020"
dataset_name = kaggle_dataset_location.split("/")[1]

# Get file path to current python script
current_dir_path = os.path.dirname(sys.argv[0])

# Output Dir Name
csv_dir = "anime_data"

# Anime Path
anime_data_path = current_dir_path + f"/{csv_dir}"

#######################################################################################################################
##################################################### Function ########################################################
#######################################################################################################################


def download_database(output_dir):
    # Check if anime_data exists
    anime_data_path = output_dir

    # Clear the folder if it already exists
    if os.path.exists(anime_data_path):
        shutil.rmtree(anime_data_path)

    # Create a clean folder
    os.mkdir(anime_data_path)

    # Change CWD to anime path
    # 1) Save for latter returning to original
    original_cwd = os.getcwd()

    # 2) Change working directory
    os.chdir(anime_data_path)

    # 3) Download
    commandline = f"kaggle datasets download {kaggle_dataset_location}"
    print(
        "[{}]:[INFO] : Downloading {} into {} ".format(
            datetime.datetime.now(), dataset_name, os.path.basename(anime_data_path)
        )
    )
    os.system(commandline)

    # 4) Unzip
    zip_location = anime_data_path + f"/{dataset_name}.zip"
    print("[{}]:[INFO] : Unzipping {}".format(datetime.datetime.now(), zip_location))
    with zipfile.ZipFile(zip_location, "r") as zip_ref:
        zip_ref.extractall(anime_data_path)
    os.remove(zip_location)

    # 5) Change working directory back
    os.chdir(original_cwd)


#######################################################################################################################
####################################################### Main ##########################################################
#######################################################################################################################

if __name__ == "__main__":
    # run the application
    download_database(anime_data_path)
