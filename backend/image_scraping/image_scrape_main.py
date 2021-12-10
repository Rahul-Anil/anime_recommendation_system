""" Run this to get the images """

""" please give the path for anime.csv
as well as the path where the images are going to be stored """

from get_animeID_anime import get_anime_dict
from get_urls import get_url
from get_and_store_images import get_image

""" anime_data_path -> give path that anime.csv is stored """
anime_data_path = "/home/rahul/COMP_9900/my_repo/COMP_9900_RA/data/anime.csv"
anime_dict = get_anime_dict(anime_data_path)

list_of_urls = get_url(anime_dict)

""" give path where images are to be stored """
get_image(
    list_of_urls,
    "/home/rahul/COMP_9900/my_repo/COMP_9900_RA/image_scrapeing/anime_images",
)
