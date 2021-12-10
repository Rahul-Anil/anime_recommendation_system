""" Module to get the urls that we need to scrape images from """

import re


def urlify(t: "string") -> "string":
    s = re.sub(r"[^\w\s:_\-]", "", t)
    s = re.sub(r"[\s:]", "_", s)
    return s


def name_alterations(id_name_dict: "dict") -> "dict":
    for key in id_name_dict:
        id_name_dict[key] = urlify(id_name_dict[key])
    return id_name_dict


def create_url(id_name: "dict") -> "list":
    list_of_urls = []
    for key in id_name:
        list_of_urls.append(
            "https://myanimelist.net/anime/" + str(key) + "/" + id_name[key] + "/pics"
        )

    return list_of_urls


def get_url(id_name_dict: "dict") -> "list":
    altered_mal_id_name_dict = name_alterations(id_name_dict)
    list_of_urls = create_url(altered_mal_id_name_dict)
    return list_of_urls
