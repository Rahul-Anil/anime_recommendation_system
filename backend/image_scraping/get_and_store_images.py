""" module to fetch data from My Anime List and save them """

from bs4 import BeautifulSoup
import re
import requests
import urllib.request
from pathlib import Path
from tqdm import tqdm
import datetime


def make_dir_for_images(folder_path: "string") -> "creates a dir":
    Path(folder_path).mkdir(parents=True, exist_ok=True)


def get_images_from_website(
    site: "string", anime_path: "string", anime_id: "string"
) -> "create a folder containing images from a website":
    make_dir_for_images(anime_path)
    # Mask Headers
    headers = requests.utils.default_headers()
    headers.update(
        {
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0",
        }
    )

    response = requests.get(site, headers)
    soup = BeautifulSoup(response.content, "html.parser")
    urls = []
    for raw_link in soup.find_all("img"):
        try:
            urls.append(raw_link.attrs["data-src"])
        except KeyError:
            pass

    # Image Counter
    image_counter = 1
    for url in urls:
        filename = re.search(r"/([\w_-]+[.](jpg|gif|png))$", url)
        if not filename:
            # print("Regex didn't match with the url: {}".format(url))
            continue
        img_path = (
            anime_path + "/" + f"{image_counter:03d}." + filename.group(1).split(".")[1]
        )
        with open(img_path, "wb") as f:
            if "http" not in url:
                # sometimes an image source can be relative
                # if it is provide the base url which also happens
                # to be the site variable atm.
                url = "{}{}".format(site, url)

            response = requests.get(url, headers)
            f.write(response.content)
        image_counter += 1


def get_image(url_list: "list", path_file: "string"):
    make_dir_for_images(path_file)
    print(
        "[{}]:[INFO] : Begin Scrapping Images from Animelist".format(
            datetime.datetime.now()
        )
    )
    for url in tqdm(url_list):
        # print(url)
        anime_id = url.split("/")[4]
        # print("anime ID is : ", anime_id)
        anime_path = path_file + "/" + anime_id
        site = url
        try:
            get_images_from_website(site, anime_path, anime_id)
        except Exception:
            pass
