""" This program is used for training the recommendation model as well as 
finding the hyperparameters for it """

import pickle
import itertools
import numpy as np
import logging
from lightfm import LightFM
from lightfm.evaluation import auc_score, precision_at_k, recall_at_k
from light_fm_conv import lightfm_conv
from lightfm.cross_validation import random_train_test_split

""" logging function to store the results of the hyperparamter tunning """
logging.basicConfig(filename="model_tunning.log", encoding="utf-8", level=logging.DEBUG)

""" contains functions for training the model that is used for new users as 
well as existing user, also contains function for hyperparameter tunning these models """


class lightfm_model:
    def __init__(self, features_df_path, ratings_df_path):
        self.lfmconv = lightfm_conv(features_df_path, ratings_df_path)

    def lightfm_model_existing_user(self, num_threads=1):
        """
        function is used for making the lightfm model for existing users

        parameters
        ----------
            num_threads: num_of threads used for training the model, should not be more the no available on the machine
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
        ) = self.lfmconv.light_fm_df_conv_existing_user()

        """ hyperparameters generated for new user hybrid model """
        hyperparam = {
            "learning_schedule": "adadelta",
            "loss": "warp",
            "learning_rate": 0.02071566024085057,
            "item_alpha": 5.177178379341112e-09,
            "user_alpha": 2.3534337506487532e-08,
            "max_sampled": 7,
            "num_epochs": 11,
        }
        num_epochs = hyperparam.pop("num_epochs")
        eu_model = LightFM(**hyperparam)
        eu_model.fit(
            interaction,
            item_features=item_features,
            sample_weight=weights,
            epochs=num_epochs,
            verbose=True,
            num_threads=num_threads,
        )
        train_auc = auc_score(
            eu_model, interaction, item_features=item_features, num_threads=num_threads
        ).mean()
        train_percision = precision_at_k(
            eu_model,
            interaction,
            item_features=item_features,
            num_threads=num_threads,
            k=10,
        ).mean()
        train_recall = recall_at_k(
            eu_model,
            interaction,
            item_features=item_features,
            num_threads=num_threads,
            k=10,
        ).mean()
        print("hybrid auc_score existing user: ", train_auc)
        print("hybrid precision existing user: ", train_percision)
        print("hybrid recall existing user: ", train_recall)

        """ the trained model is saved to a pickle file so it can be easily acessed for predicting """
        model_name = "rec_sys_eu.sav"
        pickle.dump(eu_model, open(model_name, "wb"))

    def lightfm_model_new_user(self, num_threads=1):
        """
        function is used for making the lightfm model for new users

        parameters
        ----------
            num_threads: num_of threads used for training the model, should not be more the no available on the machine
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
        ) = self.lfmconv.light_fm_df_conv_new_user()
        nu_model = LightFM(loss="warp")
        nu_model.fit(
            interaction,
            user_features=user_features,
            sample_weight=weights,
            epochs=5,
            verbose=True,
            num_threads=num_threads,
        )
        train_auc = auc_score(
            nu_model, interaction, user_features=user_features, num_threads=num_threads
        ).mean()
        train_percision = precision_at_k(
            nu_model, interaction, user_features=user_features, num_threads=num_threads
        ).mean()
        train_recall = recall_at_k(
            nu_model, interaction, user_features=user_features, num_threads=num_threads
        ).mean()
        print("hybrid auc score new user: ", train_auc)
        print("hybrid precision new user: ", train_percision)
        print("hybrid recall new user: ", train_recall)
        model_name = "rec_sys_nu.sav"
        pickle.dump(nu_model, open(model_name, "wb"))

    def sample_hyperparameters(self):
        """
        function generates the set of hyperparameters that are used in the
        random search hyperparameter tunning
        """
        while True:
            yield {
                "learning_schedule": np.random.choice(["adagrad", "adadelta"]),
                "loss": np.random.choice(["bpr", "warp", "warp-kos"]),
                "learning_rate": np.random.exponential(0.05),
                "item_alpha": np.random.exponential(1e-8),
                "user_alpha": np.random.exponential(1e-8),
                "max_sampled": np.random.randint(5, 15),
                "num_epochs": np.random.randint(5, 20),
            }

    """ hyperparameter tunning through random search """

    def random_search_eu(
        self,
        train,
        test,
        item_features=None,
        user_features=None,
        num_samples=2,
        num_threads=1,
    ):
        """
        hyperparameter tunning through random search

        paramaeters
        ----------
            train: train df
            test: test df
            item_features: required for existing user model
            user_features: requires for new user model
            num_samples: num of sample parametres that need to be considered
            num_threads: no of threads that need to be used in training the model
            cannot be higher than the number of actual threads on the computer
        """
        for hyperparams in itertools.islice(self.sample_hyperparameters(), num_samples):
            num_epochs = hyperparams.pop("num_epochs")
            model = LightFM(**hyperparams)
            model.fit(
                train,
                epochs=num_epochs,
                num_threads=num_threads,
                item_features=item_features,
                user_features=user_features,
                verbose=True,
            )
            score = auc_score(
                model,
                test,
                train_interactions=train,
                item_features=item_features,
                num_threads=num_threads,
            ).mean()
            per = precision_at_k(
                model,
                test,
                train_interactions=train,
                item_features=item_features,
                num_threads=num_threads,
                k=10,
            ).mean()
            recall = recall_at_k(
                model,
                test,
                train_interactions=train,
                item_features=item_features,
                num_threads=num_threads,
                k=10,
            ).mean()
            hyperparams["num_epochs"] = num_epochs
            yield (score, per, recall, hyperparams, model)

    def hyperparameter_tunning_eu(
        self, test_percentage=0.2, random_state=None, num_threads=1
    ):
        """
        fucntion that performs the hyperparameter tunning for existing user's

        parameters
        ---------
            test_percentage: the percentage of the data that is considered for the testing df
            random_state: the random_state value for the random_train_test_split model
            num_threads: the num of threads that is used for trainig the model.
        """
        hyperparams_and_score_list = []
        (
            interaction,
            weights,
            item_features,
            item_id_map,
            item_feature_map,
            user_id_map,
            user_feature_map,
            features_col,
        ) = self.lfmconv.light_fm_df_conv_existing_user()
        (train, test) = random_train_test_split(
            interaction, test_percentage=test_percentage, random_state=random_state
        )
        gg = self.random_search_eu(
            train,
            test,
            item_features=item_features,
            num_threads=num_threads,
            num_samples=20,
        )

        for i in gg:
            hyperparams_and_score_list.append(str(i))

        hyper_tune_list = "eu_hyper_tune_list.sav"
        pickle.dump(hyperparams_and_score_list, open(hyper_tune_list, "wb"))

        logging_sample_tracker = 0
        for i in hyperparams_and_score_list:
            print(i)
            logging.info("sample at: %s" % logging_sample_tracker)
            logging.info(i)
            logging_sample_tracker += 1

    def hyperparameter_tunning_nu(
        self, test_percentage=0.2, random_state=None, num_threads=1
    ):
        """
        fucntion that performs the hyperparameter tunning for new user's

        parameters
        ---------
            test_percentage: the percentage of the data that is considered for the testing df
            random_state: the random_state value for the random_train_test_split model
            num_threads: the num of threads that is used for trainig the model.
        """
        hyperparams_and_score_list = []
        (
            interaction,
            weights,
            user_features,
            item_id_map,
            item_feature_map,
            user_id_map,
            user_feature_map,
            features_col,
        ) = self.lfmconv.light_fm_df_conv_new_user()
        (train, test) = random_train_test_split(
            interaction, test_percentage=test_percentage, random_state=random_state
        )
        gg = self.random_search_eu(
            train,
            test,
            user_features=user_features,
            num_threads=num_threads,
            num_samples=20,
        )

        for i in gg:
            hyperparams_and_score_list.append(str(i))

        hyper_tune_list = "nu_hyper_tune_list.sav"
        pickle.dump(hyperparams_and_score_list, open(hyper_tune_list, "wb"))

        logging_sample_tracker = 0
        for i in hyperparams_and_score_list:
            print(i)
            logging.info("sample at: %s" % logging_sample_tracker)
            logging.info(i)
            logging_sample_tracker += 1


if __name__ == "__main__":

    """NOTE: this program takes a long time to run only uncomment if necessary"""

    ratings_df_path = "../../anime_data/animelist_150_redux.csv"
    features_df_path = "../../anime_data/anime_150_redux.csv"
    num_threads = 8
    lm = lightfm_model(features_df_path, ratings_df_path)
    # lm.lightfm_model_existing_user(num_threads=num_threads)
    # lm.lightfm_model_new_user(num_threads=num_threads)
    """ logging.info("\n\nexisting user hyper parameter tunning")
    lm.hyperparameter_tunning_eu(
        test_percentage=0.2, random_state=1, num_threads=num_threads
    ) """
    """logging.info("new user hyper parameter tunnig")
    lm.hyperparameter_tunning_nu(
        test_percentage=0.2, random_state=1, num_threads=num_threads
    ) """
