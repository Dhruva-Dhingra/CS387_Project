# importing csv module
import csv
import numpy
import random, time, datetime
from sqlite3 import Timestamp
from random import randrange
from datetime import timedelta, datetime
import psycopg2, csv, sys, argparse
import psycopg2.extensions
from psycopg2 import extras
import random, time, datetime
from random import randrange
from datetime import timedelta, datetime

def san(i):
    if i.lower().strip() == "null":
        return None
    else:
        return i

def get_data(reader):
    data = []
    for row in reader:
        data.append(tuple([san(i) for i in row]))
    
    return data[1:], data[0]

def random_date(start, end):
    """
    This function will return a random datetime between two datetime 
    objects.
    """
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    return start + timedelta(seconds=random_second)
    
posting_times = []
File = open('Post.csv', newline='')
reader = csv.reader(File, quotechar='"', delimiter=',')
relation, header = get_data(reader)
for data in relation:
    posting_times.append(datetime.strptime(data[5], "%Y-%m-%d %H:%M:%S"))
File.close()

n = 4039
n_arr = [i + 1 for i in range(n)]
total_friends = [0 for i in range(n)]
# friends = {i : [] for i in range(n)}
File = open('Friend.csv', newline='')
reader = csv.reader(File, quotechar='"', delimiter=',')
relation, header = get_data(reader)
for data in relation:
    total_friends[int(data[0]) - 1] += 1
    # friends[int(data[0] - 1)].append(int(data[1]) - 1)
    total_friends[int(data[1]) - 1] += 1
    # friends[int(data[1] - 1)].append(int(data[0]) - 1)
File.close()

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
d1 = datetime.strptime('1/1/1995 12:01 AM', '%m/%d/%Y %I:%M %p')
d2 = datetime.strptime('12/31/2005 11:59 PM', '%m/%d/%Y %I:%M %p')
d3 = datetime.strptime('1/1/2019 12:01 AM', '%m/%d/%Y %I:%M %p')
d4 = datetime.strptime(datetime.now().strftime("%m/%d/%Y %I:%M %p"), '%m/%d/%Y %I:%M %p')
content = "User_ID,Post_ID,Reaction,timestamp\n"

post_id = 1
total = 0
for row in rows:
    posted_by = int(row[1])
    users = random.sample(n_arr, random.randint(0, total_friends[posted_by] // 2))
    total += len(users)
    print(post_id, total)
    for user_id in users:
        # time_stamp = row[-2]
        # time_stamp = datetime.strptime(row[-2], '%m/%d/%Y %I:%M %p')
        # time_stamp = random_date(time_stamp, (time_stamp+timedelta(days=4)).strftime("%m/%d/%Y %I:%M %p") )
        time_stamp = random_date(posting_times[post_id - 1], d4).strftime("%Y-%m-%d %H:%M:%S")
        reaction_type = 0
        arr = [ str(user_id), str(post_id), str(reaction_type), str(time_stamp)]
        content = content + ",".join(arr) + "\n"
    post_id +=1 


with open("Reaction.csv", "w") as outfile:
    outfile.write(content.strip())

