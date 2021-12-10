"""
Post processing the CSVs
Now simply bruteforcelly cut down to first 500
Need to implement Rahul's scripts
"""
#######################################################################################################################
################################################ Libraries and Set up #################################################
#######################################################################################################################

from data_cleaning.dc_anime_csv import anime_csv_clean
import datetime
import os
import sys
import glob
import names
import random
import pandas as pd
import numpy as np
import cv2
from tqdm import tqdm
import shutil
import uuid

from image_scraping.get_animeID_anime import get_anime_dict
from image_scraping.get_urls import get_url
from image_scraping.get_and_store_images import get_image

from anime_rec_sys.rec_sys_predict import rec_sys_predict

#######################################################################################################################
##################################################### Parameters ######################################################
#######################################################################################################################

# Get file path to current python script
current_dir_path = os.path.dirname(sys.argv[0])

# Output Dir Name
csv_dir = "anime_data"
# Anime Path
anime_data_path = current_dir_path + f"/{csv_dir}"

# Max Row
max_anime_id_rows = 150
max_anime_list_rows = 50000

#######################################################################################################################
##################################################### Functions #######################################################
#######################################################################################################################


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

def anime_csv_processing(basepath, anime_file_name, synoposis_file_name):
    # Clean anime csv
    anime_df, genres_df = anime_csv_clean(basepath + "/" + anime_file_name)

    # synoposis file name
    synoposis_df = pd.read_csv(basepath + "/" + synoposis_file_name)[['MAL_ID', 'sypnopsis']]

    # Left Join with anime df
    anime_df = pd.merge(left=anime_df, right=synoposis_df, left_on='anime_id', right_on='MAL_ID')
    # Drop MAL ID
    anime_df.drop('MAL_ID', inplace=True, axis=1)
    
    # NOTE: Temporary Reduction
    # Reducer - Reduce to first 500 Rows 
    anime_df = anime_df.head(max_anime_id_rows)
    # Find the IDs
    selected_id_list = anime_df['anime_id'].to_list()

    # Filter the Genres to the anime_id within
    genres_df['anime_ids'] = genres_df['anime_ids'].apply(lambda x: [_ for _ in x if _ in selected_id_list])

    return anime_df, genres_df, selected_id_list

def user_detail_generator(input_user_id, input_genre_list, existing_anime_list):
    if int(input_user_id) % 2 == 0:
        full_name = names.get_full_name(gender='male')
    else:
        full_name = names.get_full_name(gender='female')
    # First Name
    first = full_name.split(" ")[0]
    # Last Name
    last = full_name.split(" ")[1]
    # email
    email = full_name.replace(" ", "").lower() + "@startroopers.com.au"
    # UserName
    username = full_name.replace(" ", "").lower() + str(len(email))
    # Date of Birth
    # Inspire - https://www.kite.com/python/answers/how-to-generate-a-random-date-between-two-dates-in-python
    start_date = datetime.date(1970, 1, 1)
    end_date = datetime.date(2000, 1, 1)
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    dob = start_date + datetime.timedelta(days=random_number_of_days)
    token = uuid.uuid4().hex
    password = uuid.uuid4().hex[:6]

    # Generate 10 preferred Genre
    preferred_genre = random.sample(input_genre_list, 10)
    # Empty Recommended List for later run
    try:
        rs = rec_sys_predict()
        recommended = rs.existing_user(input_user_id)
    except Exception as e:
        recommended = random.sample(existing_anime_list, 10)

    # Generate Preferred Genre Percentage
    dummy_generator = [random.random() for i in range(0,10)]
    dummy_sum = sum(dummy_generator)
    random_percentage = [ int((i/dummy_sum)*100) for i in dummy_generator ]

    # Assigning
    preferred_genre_percentage_dict = {preferred_genre[_]: random_percentage[_] for _ in range(0, len(preferred_genre))}

    # Type
    user_type = random.choice(['admin', 'free', 'premium', 'ultra'])
    return pd.Series([username, first, last, email, dob, token, user_type, password, preferred_genre, recommended, preferred_genre_percentage_dict])

def user_csv_processing(basepath, animelist_file_name, watch_file_name, input_id_list, genre_list, existing_anime_list):
    # Keeping only the first 500k Users
    animelist_df = pd.read_csv(basepath+"/"+animelist_file_name, nrows=max_anime_list_rows)
    # Read watching status
    watch_df = pd.read_csv(basepath+"/"+watch_file_name)
    # Note the extra space in description
    watch_mapper = dict(zip(watch_df['status'], watch_df[' description']))

    # Replace watching status
    animelist_df['watching_status'] = animelist_df['watching_status'].map(watch_mapper)
    # Convert anime_id and rating to dict
    animelist_df['anime_info'] = animelist_df[['anime_id', 'rating', 'watched_episodes']].apply(lambda x: [x.to_dict()], axis=1)
    animelist_df.drop(['anime_id', 'rating', 'watched_episodes'], axis=1, inplace=True)

    # Grouping
    animelist_df = animelist_df.groupby(["user_id",'watching_status']).sum().reset_index()

    # Generate User df
    user_df = pd.DataFrame(columns=['user_id'])
    user_df['user_id'] = animelist_df['user_id']
    # Drop duplicates
    user_df.drop_duplicates('user_id', inplace=True)
    user_df[['username', 'firstname', 'lastname', 'email', 'dob', 'token', 'user_type', 'password', 'preferred_genre', 'recommended', 'preferred_genre_percentage']] = user_df['user_id'].apply(lambda x: user_detail_generator(x, genre_list, existing_anime_list))

    # Generate Hard Coded Details for Demo purpose
    name_to_generate = ['tatjana', 'startroopers']
    index_counter = 0
    for _ in name_to_generate:
        for leave_me_alone in range(0,2):
            adjust_series = user_df.iloc[index_counter]
            # Change username and password
            adjust_series['password'] = 'comp9900'
            adjust_series['user_type'] = 'admin' if index_counter%2 == 0 else 'free'
            adjust_series['username'] = f'{_}.{adjust_series["user_type"]}'
            adjust_series['user_id'] = index_counter
            # Override
            user_df.iloc[index_counter] = adjust_series
            # Increment index_counter
            index_counter += 1

    # NOTE: Temporary Reduction
    # Reducer - Reduce to selected_id_list for anime_list dataframe
    animelist_df['anime_info'] = animelist_df['anime_info'].apply(lambda x: [_ for _ in x if _['anime_id'] in input_id_list])
    
    return animelist_df, user_df

def resizing(input_image, dim):
    output_image = cv2.resize(input_image, dim, interpolation=cv2.INTER_AREA)
    return output_image

def post_process_iamges(images_dir_path, dummy_image_path):
    # Read sample image
    template_image = cv2.imread(dummy_image_path)
    # Get height and Width
    template_height = template_image.shape[0]
    template_width = template_image.shape[1]
    template_dim = (template_width, template_height)

    # Glob
    for image_dir in tqdm(glob.glob(images_dir_path+"/*")):
        # Within Each image_dir there should be at least 3 images
        image_list = glob.glob(image_dir+"/*")
        # Check if it is empty
        if len(image_list) == 0:
            for _ in range(1,4):
                replicate_image_path = f"{image_dir}/{_:03d}.png"
                shutil.copy(dummy_image_path, replicate_image_path)
            continue

        # If not
        counter = 1
        for image_path in image_list:
            # Read and resize
            operating_img = resizing(cv2.imread(image_path), template_dim)
            # Delete Original to avoid conflict
            os.remove(image_path)
            # Save as jpg
            output_image_path = image_path.replace(os.path.basename(image_path).split(".")[1], "png")
            cv2.imwrite(output_image_path, operating_img)
            counter += 1
        while counter < 4:
            counter += 1
            replicate_image_path = image_path.replace(os.path.basename(image_path).split(".")[0], f"{counter:03d}")
            shutil.copy(dummy_image_path, replicate_image_path)


def post_processing(anime_data_path):
    
    # Post Processing
    # 1) Anime CSV + Anime Synopsis
    print("[{}]:[INFO] : Post Processing Anime CSV with Anime Synopsis CSV".format(datetime.datetime.now()))  
    # NOTE: Slight risky to hardcode
    anime_df, genres_df, selected_id_list = anime_csv_processing(anime_data_path, 'anime.csv', 'anime_with_synopsis.csv')

    # 2) Rating_complete + animelist + Watching Status
    print("[{}]:[INFO] : Post Processing Animelist CSV with Watching Status CSV".format(datetime.datetime.now()))  
    watch_df, user_df = user_csv_processing(anime_data_path, 'animelist.csv', 'watching_status.csv', selected_id_list, genres_df['genre'].to_list(), anime_df['anime_id'].to_list())

    # Iterate and delete old
    for csv_path in glob.glob(anime_data_path + "/*.csv"):
        # Clear all old csvs
        os.remove(csv_path)

    # Storing
    # 1) Anime
    anime_csv_path = anime_data_path + "/" +"anime.csv"
    # Store
    print("[{}]:[INFO] : Writing processed anime dataframe into {}".format(datetime.datetime.now(),anime_csv_path))
    anime_df.to_csv(anime_csv_path, index=False)
    # 2) genres
    genres_csv_path = anime_data_path + "/" +"genres.csv"
    # Store
    print("[{}]:[INFO] : Writing processed genres dataframe into {}".format(datetime.datetime.now(),genres_csv_path))
    genres_df.to_csv(genres_csv_path, index=False)
    # 3) watch
    watch_csv_path = anime_data_path + "/" +"watch.csv"

    # Store
    print("[{}]:[INFO] : Writing processed watch dataframe into {}".format(datetime.datetime.now(),watch_csv_path))
    watch_df.to_csv(watch_csv_path, index=False)
    # 4) user
    user_csv_path = anime_data_path + "/" +"user.csv"
    # Store
    print("[{}]:[INFO] : Writing processed user dataframe into {}".format(datetime.datetime.now(),user_csv_path))
    user_df.to_csv(user_csv_path, index=False)
    
    # Image Related Work =======================================================================
    # anime_data_path -> give path that anime.csv is stored
    anime_csv_path = anime_data_path + "/" +"anime.csv"
    anime_dict = get_anime_dict(anime_csv_path)
    list_of_urls = get_url(anime_dict)

    # give path where images are to be stored
    image_output_path = anime_data_path + "/" + "images"
    if not os.path.exists(image_output_path):
        os.mkdir(image_output_path)

    # Get images
    get_image(list_of_urls, image_output_path)

    # Post Process images and resize + fill if none
    print("[{}]:[INFO] : Post Processing images".format(datetime.datetime.now()))  
    image_output_path = anime_data_path + "/" + "images"
    # Post Processing 
    sample_image_path = anime_data_path.replace('anime_data', 'template_image.png')
    if os.path.basename(sample_image_path) == sample_image_path[1:]:
        sample_image_path = 'template_image.png'
    post_process_iamges(image_output_path, sample_image_path)

    
    # Append image list onto anime_csv
    print("[{}]:[INFO] : Adding Image List to anime csv".format(datetime.datetime.now())) 
    anime_df = pd.read_csv(anime_csv_path)
    anime_df['image_list'] = anime_df['anime_id'].apply(lambda x: [os.path.basename(_) for _ in glob.glob(f"{image_output_path}/{x}/*.png")])

    # Force Fixing NaN values
    for column in anime_df.columns:
        if 'name' in column:
            anime_df[column].fillna('unknown', inplace=True)
        else:
            anime_df[column].fillna(lambda x: random.choice(anime_df[anime_df[column] != np.nan][column]), inplace =True)
    anime_df.to_csv(anime_csv_path, index=False)
    

#######################################################################################################################
################################################### Main Function #####################################################
#######################################################################################################################

if __name__ == "__main__":
    # Convert to db
    post_processing(anime_data_path)
