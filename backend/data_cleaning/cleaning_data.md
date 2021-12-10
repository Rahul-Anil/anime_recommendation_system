# Title: cleaning_data
_ _ _ _
Date: 08-10-2021:
_ _ _ _

**Tags**: #unsw 
_ _ _ _

### cleaning data things done 

#### Dependencies 
1. data is imported from the anime_data file 
	1. idealy download data from kaggle and place it in a directory called anime_data in the home folder of the project 
2. dependencies of python;
	1.  python version used: 3.9.5
	2.  python packages used 
		1.  pandas 
			1.  pip install pandas
		2.  numpy 
			1.  pip install numpy
		3.  sklearn 
			1.  pip install scikit-learn


#### Program explanation

importing_data() -> function imports data from path and returns a pandas Dataframe containing the dataset 

missing_values_to_nan() -> All nan dataset in teh dataset was changed to the string "Unknown" and for consistency in the program  was changed to np.nan (np:numpy)

rename_cols() -> function that removes spaces in the col names in the anime_df dataset and also makes all the strings into lowercase

geners_col_expansion() -> function that is used to factorize the geners col after fixing some formatting inconsistencies in the data 

col_factorize() -> helper function for geners_col_expansion that performs sklearn MultiLabelBinarizer function 

remove_col() -> function that is used to remove unnecessary cols from the dataset (currently just used for removing the geners col) 

***if you dont want the original geners col dropped comment out this line***

#### writing to csv
to write the file to csv please use the pd.DataFrame.to_csv() command as seen in the pandas documentation https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_csv.html

#### mprovements to be made later on 
- address how some unknwon data is used 
- try to fill in some on the null data using some data augmentation 

the list below shows how many null values are present in each col so use some on the cols with care 
[('mal_id', 0),
 ('name', 0),
 ('score', 5141),
 ('genres', 0),
 ('english_name', 10565),
 ('japanese_name', 48),
 ('type', 37),
 ('episodes', 516),
 ('aired', 309),
 ('premiered', 12817),
 ('producers', 7794),
 ('licensors', 13616),
 ('studios', 7079),
 ('source', 3567),
 ('duration', 555),
 ('rating', 688),
 ('ranked', 1762),
 ('popularity', 0),
 ('members', 0),
 ('favorites', 0),
 ('watching', 0),
 ('completed', 0),
 ('on_hold', 0),
 ('dropped', 0),
 ('plan_to_watch', 0),
 ('score_10', 437),
 ('score_9', 3167),
 ('score_8', 1371),
 ('score_7', 503),
 ('score_6', 511),
 ('score_5', 584),
 ('score_4', 977),
 ('score_3', 1307),
 ('score_2', 1597),
 ('score_1', 459),
 ('action', 0),
 ('adventure', 0),
 ('cars', 0),
 ('comedy', 0),
 ('dementia', 0),
 ('demons', 0),
 ('drama', 0),
 ('ecchi', 0),
 ('fantasy', 0),
 ('game', 0),
 ('harem', 0),
 ('hentai', 0),
 ('historical', 0),
 ('horror', 0),
 ('josei', 0),
 ('kids', 0),
 ('magic', 0),
 ('martialarts', 0),
 ('mecha', 0),
 ('military', 0),
 ('music', 0),
 ('mystery', 0),
 ('parody', 0),
 ('police', 0),
 ('psychological', 0),
 ('romance', 0),
 ('samurai', 0),
 ('school', 0),
 ('sci-fi', 0),
 ('seinen', 0),
 ('shoujo', 0),
 ('shoujoai', 0),
 ('shounen', 0),
 ('shounenai', 0),
 ('sliceoflife', 0),
 ('space', 0),
 ('sports', 0),
 ('supernatural', 0),
 ('superpower', 0),
 ('thriller', 0),
 ('unknown_genre', 0),
 ('vampire', 0),
 ('yaoi', 0),
 ('yuri', 0)]