import os, base64
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
File.close()

rows = [[relation[i][j] if relation[i][j] is not None else "" for j in range(len(relation[i]))] for i in range(len(relation))]
for i in range(len(rows)):
    for j in range(len(rows[i])):
        if rows[i][j].find(",") != -1:
            rows[i][j] = '"' + rows[i][j] + '"'

files = os.listdir("images")
content = ",".join(header) + "\n"
for j in range(len(files)):
    with open("images/" + files[j], 'rb') as infile:
        f = infile.read()
        b = bytearray(f)
        base64_bytes = base64.b64encode(b)
        base64_string = base64_bytes.decode("ascii")
        rows[j][11] = '"' + base64_string + '"'

for i in range(len(rows)):
    row = rows[i]
    if i % 500 == 0:
        print(i)
    content = content + ",".join(row) + "\n"

with open("AppUser2.csv", 'w') as outfile:
    outfile.write(content.strip())