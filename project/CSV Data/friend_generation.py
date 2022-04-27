import random, time, datetime
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
    
d1 = datetime.strptime('1/1/1995 12:01 AM', '%m/%d/%Y %I:%M %p')
d2 = datetime.strptime('12/31/2005 11:59 PM', '%m/%d/%Y %I:%M %p')
d3 = datetime.strptime('1/1/2019 12:01 AM', '%m/%d/%Y %I:%M %p')
d4 = datetime.strptime(datetime.now().strftime("%m/%d/%Y %I:%M %p"), '%m/%d/%Y %I:%M %p')
content = "Sender,Acceptor,Sending_Time,Accept_Time"

with open("facebook_combined.txt", "r") as infile:
    for line in infile:
        data = [str(int(x) + 1) for x in line.strip().split()]
        send_date = random_date(d3, d4)
        accept_date = random_date(send_date, d4).strftime("%Y-%M-%D %H:%M:%S")
        arr = [data[0], data[1], send_date.strftime("%Y-%M-%D %H:%M:%S"), accept_date]
        content = content + ",".join(arr) + "\n"

with open("Friend.csv", "w") as outfile:
    outfile.write(content.strip())