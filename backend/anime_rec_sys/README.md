# Recommendation System README 
<br>

## Description
This section of code is used to generate the the Recommendation system  as well
as the code for predicting the anime's to the users, the project it uses LightFM 
to create a Hybrid recommendation system that is a combination of Collaborative 
filtering and Content Filtering which allows us to solve the cold start problem that 
is associated with Collaborative filtering based recommendation systems.

<br>

## Prerequisites
#### Python Libraries
- pandas
- pickle 
- lightfm
- itertools
- numpy
- logging
- scipy

<br>

#### Dataset 
The dataset used in this project is from Kaggle use the link below to download it 
https://www.kaggle.com/hernan4444/anime-recommendation-database-2020

<br>

## Installation and Usage
- Install all pre-requisite python libraries 
- Download the dataset from Kaggle 
- run the lightfm_model.py to create the model, pass the path for anime.csv and animelist.csv respectively to the lightfm_model class to generate the models and perform hypertunning for the recommendation model.
	- **NOTE**: running the hypertunning program will take a lot of time.
- run the rec_sys_predict.py program after the lightfm_model.py has finished running to start performing prediction's pass the user_id to the existing_user() function to predict the top 10 recommended anime for predicting anime's for a existing user in the system 
- for a new user pass the list of preferred genres to the new_user() function to get the top 10 anime recommendation for a new user in the system.


<br>

## Citation 
- Kula, M., Welcome to LIGHTFM's documentation!¶. _Welcome to LightFM's documentation! - LightFM 2.15 documentation_. Available at: https://making.lyst.com/lightfm/docs/index.html [Accessed November 15, 2021].
- Valdivieso, H., 2021. Anime recommendation database 2020. _Kaggle_. Available at: https://www.kaggle.com/hernan4444/anime-recommendation-database-2020 [Accessed November 15, 2021].


