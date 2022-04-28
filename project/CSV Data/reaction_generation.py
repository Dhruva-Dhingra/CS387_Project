# importing csv module
import csv
import numpy
import random, time, datetime
from sqlite3 import Timestamp
from random import randrange
from datetime import timedelta, datetime

def random_date(start, end):
    """
    This function will return a random datetime between two datetime 
    objects.
    """
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    return start + timedelta(seconds=random_second)
# csv file name
filename = "Post.csv"

# initializing the titles and rows list
fields = []
rows = []

# reading csv file
with open(filename, 'r') as csvfile:
	# creating a csv reader object
    csvreader = csv.reader(csvfile)
	
	# extracting field names through first row
    fields = next(csvreader)
    for row in csvreader:
        rows.append(row)
# printing first 5 rows
content = "User_ID,Post_ID,Reaction,timestamp\n"
post_id = 1
for row in rows:
    user_id = row[2]
    time_stamp = row[-2]
    # time_stamp = datetime.strptime(row[-2], '%m/%d/%Y %I:%M %p')
    # time_stamp = random_date(time_stamp, (time_stamp+timedelta(days=4)).strftime("%m/%d/%Y %I:%M %p") )
    reaction_type = random.randint(0,1)
    if reaction_type == 1:
        reaction_type = 'null'
    arr = [ str(user_id), str(post_id), str(reaction_type), str(time_stamp)]
    post_id +=1 
    content = content + ",".join(arr) + "\n"


with open("Reaction.csv", "w") as outfile:
    outfile.write(content.strip())

