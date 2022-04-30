import hashlib
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

import sys
import csv
from numpy import binary_repr
import psycopg2, csv, sys, argparse
import psycopg2.extensions
from psycopg2 import extras

maxInt = sys.maxsize
print(maxInt)

while True:
    # decrease the maxInt value by factor 10 
    # as long as the OverflowError occurs.

    try:
        csv.field_size_limit(maxInt)
        break
    except OverflowError:
        maxInt = int(maxInt//2)
print(maxInt)
csv.field_size_limit(maxInt)

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
File = open('AppUser.csv', newline='')
reader = csv.reader(File, quotechar='"', delimiter=',')
relation, header = get_data(reader)
File.close()

# csv file name
filename = "AppUser.csv"

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
content = "First_Name,Last_Name,Roll_Number,Branch,Degree,Batch,Email,Hash_of_Password,Residence,Birthday,SignUp_Date,Profile_Picture,Private,AutoAdd_to_Groups\n"

post_id = 1
total = 0
for row in rows:
    temp_row = [x for x in row]
    temp_row[7] = hashlib.sha256(temp_row[7].encode('utf-8')).hexdigest()        
    for i in range(len(temp_row)):
        if temp_row[i] is None:
            temp_row[i] = ""
        elif temp_row[i].find(",") != -1:
            temp_row[i] = '"' + temp_row[i] + '"'
    if temp_row[7][0] != '"':
        temp_row[7] = '"' + temp_row[7] + '"'
    if len(temp_row[11]) > 0 and temp_row[11][0] != '"':
        temp_row[11] = '"' + temp_row[11] + '"'
    content = content + ",".join(temp_row) + "\n"


with open("AppUser.csv", "w") as outfile:
    outfile.write(content.strip())

