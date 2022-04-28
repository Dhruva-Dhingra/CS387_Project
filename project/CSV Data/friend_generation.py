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
    
signup_times = []
File = open('AppUser.csv', newline='')
reader = csv.reader(File, quotechar='"', delimiter=',')
relation, header = get_data(reader)
for data in relation:
    signup_times.append(datetime.strptime(data[10], "%Y-%m-%d %H:%M:%S"))
File.close()

d1 = datetime.strptime('1/1/1995 12:01 AM', '%m/%d/%Y %I:%M %p')
d2 = datetime.strptime('12/31/2005 11:59 PM', '%m/%d/%Y %I:%M %p')
d3 = datetime.strptime('1/1/2019 12:01 AM', '%m/%d/%Y %I:%M %p')
d4 = datetime.strptime(datetime.now().strftime("%m/%d/%Y %I:%M %p"), '%m/%d/%Y %I:%M %p')
content = "Sender,Acceptor,Sending_Time,Accept_Time,Status\n"

with open("facebook_combined.txt", "r") as infile:
    for line in infile:
        data = [str(int(x) + 1) for x in line.strip().split()]
        join_dates = [signup_times[int(data[i]) - 1] for i in range(len(data))]
        send_date = random_date(min(join_dates[0], join_dates[1]), d4)
        accept_date = random_date(send_date, d4).strftime("%Y-%m-%d %H:%M:%S")
        arr = [data[0], data[1], send_date.strftime("%Y-%m-%d %H:%M:%S"), accept_date, 'true']
        content = content + ",".join(arr) + "\n"

with open("Friend.csv", "w") as outfile:
    outfile.write(content.strip())