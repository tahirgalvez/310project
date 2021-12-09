# Based on source code from https://github.com/dlwhittenbury/MySQL_IMDb_Project/blob/master/imdb_converter.py)

# Imports
# -------
import numpy as np
import pandas as pd
import os
import gzip
import shutil

# Helper functions
#------------------

# Used to unzip IMDb data files
def unzip_files(folder):
    """
    Unzip all gzipped files in folder.
    """
    out_files = []
    # For each file in folder
    for file in os.listdir(folder):
        # If it is gzipped unzip it
        if file.endswith(".gz"):
            in_file_path = os.path.join(folder, file)
            out_file_path = os.path.join(folder,file.replace('.gz',''))
            out_files.append(out_file_path)
            print('\tUnzipping ',in_file_path,' to ',out_file_path)
            # Unzip current file
            with gzip.open(in_file_path, 'rb') as f_in:
                with open(out_file_path, 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
    return out_files

#-------------------------------------------------------------------------------

# Functions to process IMDb data
#-------------------------------

# Create episode table
def make_episode(title_episode):
    # title.episode.tsv
    # FORMAT: ['tconst', 'parentTconst', 'seasonNumber', 'episodeNumber']

    print("\tMaking 'episode' table")

    # No change other than column names

    # Rename columns
    episode = title_episode.rename(columns={
    'tconst':'t_const',
    'parentTconst':'parent_t_const',
    'seasonNumber':'season_number',
    'episodeNumber':'episode_number'
    })

    # Output to file
    episode.to_csv('episode.tsv',index=False,header=False,na_rep=r'\N',sep='\t')

#-------------------------------------------------------------------------------

# Create person table
def make_person(name_basics):
    # name.basics.tsv has columns:
    # FORMAT: ['nconst', 'primaryName', 'birthYear', 'deathYear',
    # 'primaryProfession', 'knownForTitles']

    print("\tMaking 'person' table")

    # Extract columns from name_basics for person table
    person = name_basics[['nconst','primaryName','birthYear','deathYear', 'primaryProfession', 'knownForTitles']]

    # Rename columns
    person= person.rename(columns={
    'nconst':'n_const',
    'primaryName':'primary_name',
    'birthYear':'birth_year',
    'deathYear':'death_year',
    'primaryProfession':'primary_profession',
    'knownForTitles':'known_for_titles',
    })

    person['primary_profession'] = "{" + person['primary_profession'].astype(str) + "}"
    person['known_for_titles'] = "{" + person['known_for_titles'].astype(str) + "}"

    # Output to file
    person.to_csv('person.tsv',index=False,header=False,na_rep=r'\N',sep='\t')

#-------------------------------------------------------------------------------

# Create cast table
def make_cast(title_principals):
    # title.principals.tsv
    # FORMAT: ['tconst', 'ordering', 'nconst', 'category', 'job', 'characters']

    print("\tMaking 'cast' table")

    # Extract columnns
    cast = title_principals[['tconst','ordering','nconst','category','job','characters']]

    # Rename columns
    cast = cast.rename(columns={
    'tconst':'t_const',
    'nconst':'n_const',
    'category':'category',
    'characters':'characters',
    })

    # Output to file
    cast.to_csv('cast.tsv',index=False,header=False,na_rep=r'\N',sep='\t')

#-------------------------------------------------------------------------------
# Create titles table
def make_titles(title_basics):
    # title.basics.tsv
    # FORMAT: ['tconst', 'titleType', 'primaryTitle', 'originalTitle',
    # 'isAdult', 'startYear', 'endYear', 'runtimeMinutes', 'genres']

    print("\tMaking 'titles' table")

    # Extract columns from title_basics for titles table
    titles = title_basics[['tconst','titleType','primaryTitle',
    'originalTitle', 'isAdult', 'startYear', 'endYear', 'runtimeMinutes', 'genres']]

    # Rename columns
    titles = titles.rename(columns={
    'tconst':'t_const',
    'titleType':'title_type',
    'primaryTitle':'primary_title',
    'originalTitle':'original_title',
    'isAdult':'is_adult',
    'startYear':'start_year',
    'endYear':'end_year',
    'runtimeMinutes':'runtime_minutes',
    'genres':'genres',
    })

    titles = titles.dropna()

    titles['genres'] = "{" + titles['genres'].astype(str) + "}"

    # Output to file
    titles.to_csv('titles.tsv',index=False,header=False,na_rep=r'\N',sep='\t')

#-------------------------------------------------------------------------------

# Create rating (just renaming columns)
def make_rating(title_ratings):
    # title.ratings.tsv
    # FORMAT: ['tconst', 'averageRating', 'numVotes']

    print("\tMaking 'rating' table")

    # Rename columns
    rating = title_ratings.rename(columns={
    'tconst':'t_const',
    'averageRating':'average_rating',
    'numVotes':'num_votes'
    })

    # Output to file
    rating.to_csv('rating.tsv',index=False,header=False,na_rep=r'\N',sep='\t')

#------------------------ END OF FUNCTION DEFINITIONS --------------------------



# Set path to IMDb data
# ---------------------
data_path = 'G:/School/College/SEM8/CSCE310/project/imdb_data'
print('Looking for IMDb data in: ',data_path,'\n')


# Unzip IMDb data files
#----------------------
data_files = unzip_files(data_path)


# Read in and process all IMDb data files
# ---------------------------------------

# title.episode.tsv
#------------------
# FORMAT: ['tconst', 'parentTconst', 'seasonNumber', 'episodeNumber']
print('\n','Reading title.episode.tsv ...','\n')
# Read title.episode
title_episode = pd.read_csv(os.path.join(data_path,'title.episode.tsv'),
    dtype = {'tconst':'str', 'parentTconst':'str', 'seasonNumber':'Int64',
    'episodeNumber':'Int64'},
    sep='\t',na_values='\\N')
# Make table
make_episode(title_episode)
# Delete title_episode
del title_episode

# name.basics.tsv
#-----------------
# FORMAT:  ['nconst', 'primaryName', 'birthYear', 'deathYear',
# 'primaryProfession', 'knownForTitles']
print('\n','Reading name.basics.tsv ...','\n')
# Read name.basics
name_basics  = pd.read_csv(os.path.join(data_path,'name.basics.tsv'),
    dtype = {'nconst':'str', 'primaryName':'str', 'birthYear':'Int64',
    'deathYear':'Int64', 'primaryProfession':'str', 'knownForTitles':'str'},
    sep='\t',na_values='\\N')
# Make tables
make_person(name_basics)
# Delete name_basics
del name_basics

# title.principals.tsv
#---------------------
# FORMAT: ['tconst', 'ordering', 'nconst', 'category', 'job', 'characters']
print('\n','Reading title.principals.tsv ...','\n')
# Read title.principals
title_principals = pd.read_csv(os.path.join(data_path,'title.principals.tsv'),sep='\t',na_values='\\N')
# Make tables
make_cast(title_principals)
# Delete title_principals
del title_principals

# title.basics.tsv
#------------------
# FORMAT: ['tconst', 'titleType', 'primaryTitle', 'originalTitle', 'isAdult',
# 'startYear', 'endYear', 'runtimeMinutes', 'genres']
# quoting = 3 used to ignore quotation marks, done because in some cases the was
# one missing, e.g., primaryTitle was "Rolling in the Deep Dish
print('\n','Reading title.basics.tsv ...','\n')
# Read title.basics
title_basics = pd.read_csv(os.path.join(data_path,'title.basics.tsv'),
    dtype = {'tconst':'str', 'titleType':'str', 'primaryTitle':'str',
    'originalTitle':'str', 'isAdult':'int', 'startYear':'Int64',
    'endYear':'Int64', 'runtimeMinutes':'Int64', 'genres':'str'},
    sep='\t',na_values='\\N',quoting=3)
# Make tables
make_titles(title_basics)
# Delete title_basics
del title_basics

# title.ratings.tsv
#-------------------
# FORMAT: ['tconst', 'averageRating', 'numVotes']
print('\n','Reading title.ratings.tsv ...','\n')
# Read title.ratings
title_ratings = pd.read_csv(os.path.join(data_path,'title.ratings.tsv'),sep='\t',na_values='\\N')
# Make table
make_rating(title_ratings)
# Delete title_ratings
del title_ratings
