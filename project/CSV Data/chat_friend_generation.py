from os import PRIO_PGRP
import random, time, datetime
from random import randrange
from datetime import timedelta, datetime
import json
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
content = "Sender,Acceptor,Sending_Time,Accept_Time,Status\n"
message_csv_content = "Content,Time,View_Once,Deleted,Invitation,Group_ID\n"
private_chat = "Message_ID,Sender_ID,Receiver_ID\n"

f = open('../msg_db/conversations/train.json')
json_data = json.load(f)
chat = []
senders = []
for x in json_data:
    chat_messages = json_data[x]['content']
    l1 = []
    l2 = []
    for c in chat_messages:
        chat_message = c['message']
        sender = c['agent']
        if sender == 'agent_1':
            sender = 0
        else :
            sender = 1
        l1.append(chat_message)
        l2.append(sender)
        
    chat.append(l1)
    senders.append(l2)
f.close()

message_id = 1

ind = 1
with open("facebook_combined.txt", "r") as infile:
    
    for line in infile:
        data = [str(int(x) + 1) for x in line.strip().split()]
        send_date = random_date(d3, d4)
        accept_date = random_date(send_date, d4)
        arr = [data[0], data[1], send_date.strftime("%Y-%m-%d %H:%M:%S"), accept_date.strftime("%Y-%m-%d %H:%M:%S"), 'true']
        num_conv =  random.randint(0,8)
        l = range(0,len(chat))
        l = random.sample(l,num_conv)
        time_stamp = accept_date
        ind +=1
        content = content + ",".join(arr) + "\n"
        if ind >1000:
            continue
        for x in l:
            time_stamp = random_date(time_stamp, time_stamp + timedelta(days=10))
            for i in range(len(chat[x])):
                time_stamp = random_date(time_stamp,  time_stamp + timedelta(hours=16))
                message_arr = [ "\"" +chat[x][i]+ "\"", time_stamp.strftime("%Y-%m-%d %H:%M:%S"), 'false' , 'false', 'false', 'null']
                message_csv_content =  message_csv_content +  ",".join(message_arr) + "\n"
                # print(senders[x])
                private_chat_arr= [str(message_id), data[senders[x][i]], data[1-senders[x][i]]]
                private_chat =private_chat + ",".join(private_chat_arr) + "\n"
                message_id = message_id +1
        content = content + ",".join(arr) + "\n"
with open("Friend.csv", "w") as outfile:
    outfile.write(content.strip())
with open("Message.csv", "w") as outfile:
    outfile.write(message_csv_content.strip())
with open("Private_Chat.csv", "w") as outfile:
    outfile.write(private_chat.strip())
