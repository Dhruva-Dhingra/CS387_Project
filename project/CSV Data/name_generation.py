from names_dataset import NameDataset
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

nd = NameDataset()

n = 4039
first_names_list = []
last_names_list = []
country_alpha_2_code = 'IN'

for list in nd.get_top_names(n = 2 * n, country_alpha2 = country_alpha_2_code, use_first_names = True)[country_alpha_2_code].values():
    for item in list:
        if item not in first_names_list and item.isalpha():
            first_names_list.append(item)

for item in nd.get_top_names(n = 2 * n, country_alpha2 = country_alpha_2_code, use_first_names = False)[country_alpha_2_code]:
    if item not in last_names_list and item.isalpha():
        last_names_list.append(item)

names_list = [(first_names_list[i], last_names_list[i]) for i in range(n)]
d1 = datetime.strptime('1/1/1995 12:01 AM', '%m/%d/%Y %I:%M %p')
d2 = datetime.strptime('12/31/2005 11:59 PM', '%m/%d/%Y %I:%M %p')
d3 = datetime.strptime('1/1/2019 12:01 AM', '%m/%d/%Y %I:%M %p')
d4 = datetime.strptime(datetime.now().strftime("%m/%d/%Y %I:%M %p"), '%m/%d/%Y %I:%M %p')

content = "First_Name,Last_Name,Roll_Number,Branch,Degree,Batch,Email,Hash_of_Password,Residence,Birthday,SignUp_Date,Profile_Picture,Private,AutoAdd_to_Groups\n"
roll_numbers_start = ['15', '16', '17', '18', '19', '20', '21']
branches = ['CSE', 'EE', 'ME', 'AE', 'CH', 'EN', 'HS']
degrees = ['B Tech', 'M Tech', 'PhD']
rolls = []
for i in range(n):
    rand_roll = str(random.randint(1, 9999999))
    rand_roll = roll_numbers_start[random.randint(0, len(roll_numbers_start) - 1)] + ("0" * (7 - len(rand_roll))) + rand_roll
    while rand_roll in rolls:
        rand_roll = str(random.randint(1, 9999999))
        rand_roll = roll_numbers_start[random.randint(0, len(roll_numbers_start) - 1)] + ("0" * (7 - len(rand_roll))) + rand_roll
    rolls.append(rand_roll)
    branch = branches[random.randint(0, len(branches) - 1)]
    degree = degrees[random.randint(0, len(degrees) - 1)]
    batch = '20' + rand_roll[:2]
    email = rand_roll + "@iitb.ac.in"
    hash_of_password = "1234567890"
    residence = "\"IIT Bombay, Powai\""
    birthday = random_date(d1, d2).strftime("%Y-%m-%d")
    signup_date = random_date(d3, d4).strftime("%Y-%m-%d %H:%M:%S")
    profile_picture = ''
    private = 'false'
    add_to_group = 'true'
    data = [first_names_list[i], last_names_list[i], rand_roll, branch, degree, batch, email, hash_of_password, residence, birthday, signup_date, profile_picture, private, add_to_group]
    content = content + ",".join(data)
    if i != n - 1:
        content = content + "\n"

with open("AppUser copy.csv", 'w', encoding="utf-8") as outfile:
    outfile.write(content)