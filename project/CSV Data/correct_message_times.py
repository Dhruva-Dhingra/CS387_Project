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
File = open('Message.csv', newline='')
reader = csv.reader(File, quotechar='"', delimiter=',')
relation, header = get_data(reader)
File.close()

# csv file name
filename = "Message.csv"

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
content = "Content,Time,View_Once,Deleted,Invitation,Group_ID\n"

post_id = 1
total = 0
for row in rows:
    temp_row = [x for x in row]
    temp_row[0] = '"' + temp_row[0] + '"'
    if (datetime.strptime(temp_row[1], "%Y-%m-%d %H:%M:%S") > d4):
        temp_row[1] = d4.strftime("%Y-%m-%d %H:%M:%S")
    content = content + ",".join(temp_row) + "\n"


with open("Message.csv", "w") as outfile:
    outfile.write(content.strip())

