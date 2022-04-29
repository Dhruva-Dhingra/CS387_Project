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

parser = argparse.ArgumentParser()
parser.add_argument("--name")
parser.add_argument("--user")
parser.add_argument("--pswd")
parser.add_argument("--host")
parser.add_argument("--port")
parser.add_argument("--ddl")
parser.add_argument("--data")

args = parser.parse_args()

database = "dbname=" + args.name +" user=" + args.user + " host=" + args.host + " password="+args.pswd+ " port="+args.port
database = "dbname=" + args.name +" user=" + args.user + " password="+args.pswd+ " port="+args.port
# conn = psycopg2.connect(database)
conn =psycopg2.connect(database)
c = conn.cursor()

ddl_file = open(args.ddl)
ddl_data = ddl_file.read()
ddl_file.close()

c.execute(ddl_data)

tables = {}

q1 = "INSERT INTO "
q2 = " VALUES %s;"

order = ["Hobby.csv", "AppUser.csv", "Website_Admin.csv", "Friend.csv", "Post.csv", "Message.csv", "Private_Chat.csv", "Reaction.csv"]
bytea_fields = [('Post', 'Content_Picture')]

for file in order:
    print(file)
    File = open(args.data+"/"+file, newline='')
    reader = csv.reader(File, quotechar='"', delimiter=',')
    relation, header = get_data(reader)
    print(header)
    _relation = []
    for data in relation:
        temp = []
        if len(data) > len(header):
            # print(data)
            print(len(data), len(header))
        for j in range(len(data)):
            entry = data[j]
            if entry is None or len(entry) == 0:
                temp.append(None)
            elif (file[:-4], header[j]) in bytea_fields:
                temp.append(bytes(entry, "utf8"))
                # temp.append(entry.encode('utf-8'))
                # byte_array = bytearray(entry, "utf8")
                # byte_list = []
                # for byte in byte_array:
                #     binary_representation = bin(byte)
                #     byte_list.append(binary_representation)
                # temp.append(byte_list)
            else:
                temp.append(entry)
        _relation.append(temp)

    header = ", ".join(header)
    query = q1 + file[:-4] + " ("+ header +")" + q2
    extras.execute_values(c, query, _relation)
    File.close()

c.close()
conn.commit()