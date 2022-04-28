# importing csv module
import csv
import numpy
import random, time, datetime
from sqlite3 import Timestamp
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

d4 = datetime.strptime(datetime.now().strftime("%m/%d/%Y %I:%M %p"), '%m/%d/%Y %I:%M %p')
posting_times = []
post_ids = []
File = open('Post.csv', newline='')
reader = csv.reader(File, quotechar='"', delimiter=',')
relation, header = get_data(reader)
for data in relation:
    posting_times.append(data[5])
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
content = "User_ID,Post_ID,Reaction,timestamp\n"
post_id = 1
n = 4039
arr = [i + 1 for i in range(n)]
total = 0
for i in range(len(rows)):
    row = rows[i]
    num_reacts = random.choices(arr, k = random.randint(0, 10))
    total += len(num_reacts)
    print(total)
    for user_id in num_reacts:
        # user_id = row[2]
        # time_stamp = row[-2]
        # time_stamp = datetime.strptime(row[-2], '%m/%d/%Y %I:%M %p')
        # time_stamp = random_date(time_stamp, (time_stamp+timedelta(days=4)).strftime("%m/%d/%Y %I:%M %p") )
        time_stamp = random_date(datetime.strptime(posting_times[i], "%Y-%m-%d %H:%M:%S"), d4).strftime("%Y-%m-%d %H:%M:%S")
        reaction_type = 0
        if reaction_type == 1:
            reaction_type = 'null'
        arr = [ str(user_id), str(post_id), str(reaction_type), str(time_stamp)]
        content = content + ",".join(arr) + "\n"
    post_id +=1 


with open("Reaction.csv", "w") as outfile:
    outfile.write(content.strip())

