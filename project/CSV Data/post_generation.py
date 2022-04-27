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

d3 = datetime.strptime('1/1/2019 12:01 AM', '%m/%d/%Y %I:%M %p')
d4 = datetime.strptime(datetime.now().strftime("%m/%d/%Y %I:%M %p"), '%m/%d/%Y %I:%M %p')
File = open('AppUser.csv', newline='')
reader = csv.reader(File, quotechar='"', delimiter=',')
relation, header = get_data(reader)
for data in relation:
    signup_times.append(data[10])
File.close()

content = "Page_ID,User_ID,Content_Type,Content,Time,Validity\n"
File = open('Post_backup.csv', newline='')
reader = csv.reader(File, quotechar='"', delimiter=',')
relation, header = get_data(reader)
user_ids = {}
user_id_to_user_id_mapping = {}
n = 4039
for i in range(len(relation)):
    data = [relation[i][j] for j in range(len(relation[i]))]
    user_id = int(data[1])
    if user_id not in user_ids:
        user_ids[user_id] = 1
    else:
        user_ids[user_id] += 1
    # data[4] = random_date(datetime.strptime(signup_times[i], "%Y-%m-%d %H:%M:%S"), d4).strftime("%Y-%m-%d %H:%M:%S")
    # content += ",".join(data) + "\n"
File.close()

print(len(user_ids.keys()))
count = 1
for i in sorted(user_ids.items(), key = lambda kv : -kv[1]):
    user_id_to_user_id_mapping[i[0]] = count
    count += 1

File = open('Post_backup.csv', newline='')
reader = csv.reader(File, quotechar='"', delimiter=',')
relation, header = get_data(reader)
for i in range(len(relation)):
    data = [relation[i][j] for j in range(len(relation[i]))]
    user_id = int(data[1])
    data[1] = str(user_id_to_user_id_mapping[user_id])
    data[3] = "\"" + data[3].replace('"', '') + "\""
    data[4] = random_date(datetime.strptime(signup_times[user_id - 1], "%Y-%m-%d %H:%M:%S"), d4).strftime("%Y-%m-%d %H:%M:%S")
    content += ",".join(data) + "\n"
File.close()

with open("Post.csv", "w") as outfile:
    outfile.write(content.strip())