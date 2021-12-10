""" code return reccomended anime to users """
import pandas as pd
import numpy as np
import pickle
from scipy import sparse


class rec_sys_predict:
    """function takes in user id of existing user's in the system and returns
    the most reccomended anime for them"""

    def existing_user(self, user_id):
        """
        function takes in user id of existing user's in the system and returns
        the most reccomended anime for them

        Parameters
        ---------
            user_id: user_id of the user that we are going to make recommendations for

        returns
        --------
            top_10_anime: list of teh top 10 anime predicted for the user

        """

        (
            interaction,
            weights,
            item_features,
            item_id_map,
            item_feature_map,
            user_id_map,
            user_feature_map,
            features_col,
        ) = pickle.load(open("anime_rec_sys/eu_vat.sav", "rb"))
        model_name = "anime_rec_sys/rec_sys_eu.sav"
        model = pickle.load(open(model_name, "rb"))
        user_id_lfm = user_id_map[user_id]
        n_user, n_items = interaction.shape
        """ predict here finds the score for user: userid and all items given by np.arrange(n_items) """
        scores = pd.Series(
            model.predict(user_id_lfm, np.arange(n_items), item_features=item_features)
        )
        ind_item_id_map = {v: k for k, v in item_id_map.items()}
        scores.rename(index=ind_item_id_map, inplace=True)
        scores = scores.sort_values(axis=0, ascending=False)
        top_10_anime = scores.index.tolist()[:10]
        return top_10_anime

    """ helper function for new_user -> used for creating the feature_list for the new user """

    def feature_col_value(self, val, gen_list, features_col):
        result = []
        for x, y in zip(features_col, val):
            if x in gen_list:
                result.append(str(x) + ":" + str(1))
            else:
                result.append(str(x) + ":" + str(y))
        return result

    """ helper function used to generate the sparce matrix for new user features """

    def format_new_user_input(self, item_feature_list, user_feature_map):
        num_feattures = len(item_feature_list)
        normalised_val = 1.0
        target_indices = []
        for feature in item_feature_list:
            try:
                target_indices.append(user_feature_map[feature])
            except KeyError:
                # print("new item feature encountered '{}'".format(feature))
                pass
        new_item_features = np.zeros(len(user_feature_map.keys()))
        for ind in target_indices:
            new_item_features[ind] = normalised_val

        new_item_features = sparse.csr_matrix(new_item_features)
        return new_item_features

    def new_user(self, preferred_genres):
        """
        function takes in the genre preferences of the new user and
        returns top 10 recommended anime for that user

        Parameters
        ---------
            preferred_genres: list of genres preferred by the new user

        returns
        --------
            top_10_anime: list of teh top 10 anime predicted for the user

        """
        (
            interaction,
            weights,
            user_features,
            item_id_map,
            item_feature_map,
            user_id_map,
            user_feature_map,
            features_col,
        ) = pickle.load(open("anime_rec_sys/nu_vat.sav", "rb"))
        model_name = "anime_rec_sys/rec_sys_nu.sav"
        model = pickle.load(open(model_name, "rb"))
        preferred_genres = ["genres_" + gen for gen in preferred_genres]
        empty_val_col = [np.nan] * len(features_col)
        new_item_features_list = self.feature_col_value(
            empty_val_col, preferred_genres, features_col
        )
        new_user_features = self.format_new_user_input(
            new_item_features_list, user_feature_map
        )
        n_user, n_items = interaction.shape
        scores = pd.Series(
            model.predict(0, np.arange(n_items), user_features=new_user_features)
        )
        ind_item_id_map = {v: k for k, v in item_id_map.items()}
        scores.rename(index=ind_item_id_map, inplace=True)
        scores = scores.sort_values(axis=0, ascending=False)
        most_similar_user = scores.index.tolist()[0]
        top_10_anime = self.existing_user(most_similar_user)
        return top_10_anime


""" main funciton is used in testing of the program """
if __name__ == "__main__":
    rs = rec_sys_predict()
    p = rs.existing_user(1)
    pref = ["space", "horror", "romance"]
    np = rs.new_user(pref)
    print(p)
    print(np)
