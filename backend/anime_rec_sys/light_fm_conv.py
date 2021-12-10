""" lightfm_conc is used to convert the dataset to a form that can be used by 
lightfm for creaign the model """
from lightfm.data import Dataset
import pickle
from anime_rec_sys.augmentataion_data import augmentation_df
from anime_rec_sys.features_df_clean import features_df_rec_sys

""" class takes in features_df_path and ratings_df_path and ahs function 
that will convert the data to variables that can be used by the light fm model 

input 
------
    features_df_path: path to anime.csv data 
    ratings_df_path: path to animelist.csv data
"""


class lightfm_conv:
    def __init__(self, features_df_path, ratings_df_path):
        self.dff = features_df_rec_sys(features_df_path)
        self.dfr = augmentation_df(features_df_path, ratings_df_path)

    def item_features_unq(self):
        """
        used to get the list of unique features for each col which is used as the list of item features_col

        returns
        -------
        itemf: list of all unique elemenst in all the cols in the dataframe
        """
        itemf = []
        df_col_list = self.dff.columns.tolist()[1:]
        unq_features_col = []
        unq_features = []
        for col_name in df_col_list:
            unq_features_col += [col_name] * len(self.dff[col_name].unique())
            unq_features += list(self.dff[col_name].unique())
        for cols, unqf in zip(unq_features_col, unq_features):
            itemf.append(str(cols) + ":" + str(unqf))
        return itemf

    def feature_col_value(self, df, features_col):
        """
        combines values with colnames as a string of {colname: values}

        Parameters
        ---------
            df: pd.DataFrame
            features_col: the col names of all col's that are to be treated as features
                          for the reccomendation model.

        returns
        -------
            result: list
        """
        result = []
        for x, y in zip(features_col, df):
            result.append(str(x) + ":" + str(y))
        return result

    def light_fm_df_conv_existing_user(self):
        """
        used to create the variables and inputs for the existing users model,
        saves the variable as a pickle file so that it can be used easily the model function

        returns
        ------
            interaction: a (num_users, num_items) COO matrix with interactions
            weights: a (num_user, num_items) COO matrix with the corresponding weights
            item_features: a matrix of item features
            item_id_map: id map of all items
            user_id_map: id map all users
            user_feature_map: interal map of all user features
            item_feature_map: internal map of all item features
            features_col: list of all cols in the features datatset that is going
            to be used in the reccomendation system
        """
        itemf = self.item_features_unq()
        tdf = Dataset()
        tdf.fit(
            self.dfr["user_id"].unique(),
            self.dff["anime_id"].unique(),
            item_features=itemf,
        )
        (interaction, weights) = tdf.build_interactions(
            [(x[1], x[0], x[2]) for x in self.dfr.values]
        )
        features_col = self.dff.columns.tolist()[1:]
        features_subset = self.dff[features_col]
        features_list_light_fm = []
        for x in features_subset.values:
            features_list_light_fm.append(self.feature_col_value(x, features_col))
        item_tuple = list(zip(self.dff.anime_id, features_list_light_fm))
        item_features = tdf.build_item_features(item_tuple, normalize=False)
        user_id_map, user_feature_map, item_id_map, item_feature_map = tdf.mapping()
        print(" Preprocessing for existign users done")
        eu_var_sav = (
            interaction,
            weights,
            item_features,
            item_id_map,
            item_feature_map,
            user_id_map,
            user_feature_map,
            features_col,
        )
        eu_var_sav_filename = "eu_vat.sav"
        with open(eu_var_sav_filename, "wb") as f:
            pickle.dump(eu_var_sav, f)

        return (
            interaction,
            weights,
            item_features,
            item_id_map,
            item_feature_map,
            user_id_map,
            user_feature_map,
            features_col,
        )

    """ used to create the variables and inputs for the new users model,
    saves the variable as a pickle file so that it can be used easily the model function """

    def light_fm_df_conv_new_user(self):
        """
        used to create the variables and inputs for the new users model,
        saves the variable as a pickle file so that it can be used easily the model function

        returns
        -------
            interaction: a (num_users, num_items) COO matrix with interactions
            weights: a (num_user, num_items) COO matrix with the corresponding weights
            user_features: a matrix of user features
            item_id_map: id map of all items
            user_id_map: id map all users
            user_feature_map: interal map of all user features
            item_feature_map: internal map of all item features
            features_col: list of all cols in the features datatset that is going
            to be used in the reccomendation system
        """
        userf = self.item_features_unq()
        tdf = Dataset()
        tdf.fit(
            self.dff["anime_id"].unique(),
            self.dfr["user_id"].unique(),
            user_features=userf,
        )
        (interaction, weights) = tdf.build_interactions(
            [(x[0], x[1], x[2]) for x in self.dfr.values]
        )
        features_col = self.dff.columns.tolist()[1:]
        features_subset = self.dff[features_col]
        features_list_light_fm = []
        for x in features_subset.values:
            features_list_light_fm.append(self.feature_col_value(x, features_col))
        user_tuple = list(zip(self.dff.anime_id, features_list_light_fm))
        user_features = tdf.build_user_features(user_tuple, normalize=False)
        user_id_map, user_feature_map, item_id_map, item_feature_map = tdf.mapping()
        print(" Preprocessing for new users done")
        nu_var_sav = (
            interaction,
            weights,
            user_features,
            item_id_map,
            item_feature_map,
            user_id_map,
            user_feature_map,
            features_col,
        )
        nu_var_sav_filename = "nu_vat.sav"
        with open(nu_var_sav_filename, "wb") as f:
            pickle.dump(nu_var_sav, f)
        return (
            interaction,
            weights,
            user_features,
            item_id_map,
            item_feature_map,
            user_id_map,
            user_feature_map,
            features_col,
        )


if __name__ == "__main__":
    ratings_df_path = "../../anime_data/animelist_150_redux.csv"
    features_df_path = "../../anime_data/anime_150_redux.csv"
    lightfmconv = lightfm_conv(features_df_path, ratings_df_path)
    lightfmconv.light_fm_df_conv_existing_user()
    lightfmconv.light_fm_df_conv_new_user()
