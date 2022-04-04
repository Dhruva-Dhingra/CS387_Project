Create Table User {
  User_ID  bigint PRIMARY KEY ,
  First_Name  text NOT NULL,
  Last_Name  text,
  Roll_Number  text NOT NULL,
  Branch  text NOT NULL,
  Degree  text NOT NULL,
  Batch  int NOT NULL,
  Email  text NOT NULL,
  Hash_of_Password  text NOT NULL,
  Residence  text,
  Birthday  date,
  SignUp_Date  timestamp NOT NULL,
  Profile_Picture   oid,
  Private  bit NOT NULL,
  AutoAdd_to_Groups  bit NOT NULL
};

Create Table Website_Admin {
  Admin_ID int PRIMARY KEY,
  Email text NOT NULL,
  Hash_of_Password text NOT NULL
};

Create Table Hobby {
  Hobby_ID  int PRIMARY KEY NOT NULL,
  Name  text NOT NULL,
  Category  text,
  Description  text
};

Create Table Post {
	Post_ID bigint PRIMARY KEY ,
	Page_ID bigint,
	User_ID bigint,
	Content_Type int NOT NULL,
	Content  oid NOT NULL,
	Time  timestamp NOT NULL,
	Validity  int NOT NULL,
  FOREIGN KEY (User_ID) REFERENCES User (User_ID),
  FOREIGN KEY (Page_ID) REFERENCES Page (Page_ID)
 };


Create Table Status {
  Status_ID bigint PRIMARY KEY,  
  User_ID bigint NOT NULL,
  Content_Type int NOT NULL,
  Content  oid NOT NULL,
  Time timestamp NOT NULL,
  FOREIGN KEY (User_ID) REFERENCES User (User_ID)
 };

Create Table Page {
  Page_ID  bigint  PRIMARY KEY,
  Name  text NOT NULL,
  Profile_Picture   oid,
  Description  text,
  Created_On  timestamp NOT NULL
};

Create Table Page_Keyword {
  Page_ID bigint PRIMARY KEY,  
  Keyword text PRIMARY KEY ,
  FOREIGN KEY (Page_ID) REFERENCES Page (Page_ID)
};

Create Table Group {
Group_ID  bigint PRIMARY KEY,  
	Name  text NOT NULL,
	Profile_Picture   oid,
	Description  text,
	Created_on  timestamp NOT NULL
};

Create Table Message {
  Message_ID  int PRIMARY KEY ,
  Content  text NOT NULL,
  Time  timestamp NOT NULL,
  View_Once  bit NOT NULL,
  Deleted  bit NOT NULL,
  Invitation  bit,
  Group_ID  bigint

};

Create Table About {
  Page_ID bigint PRIMARY KEY,  
  Hobby_ID bigint PRIMARY KEY ,
  FOREIGN KEY (Page_ID) REFERENCES Page (Page_ID),
  FOREIGN KEY (Hobby_ID) REFERENCES Hobby (Hobby_ID)
};

Create Table Tags {
  Post_ID bigint PRIMARY KEY, 
  User_ID bigint  PRIMARY KEY,
  FOREIGN KEY (User_ID) REFERENCES User (User_ID),
  FOREIGN KEY (Post_ID) REFERENCES Post (Post_ID)
};

Create Table Follower {
  Page_ID bigint PRIMARY KEY, 
  User_ID bigint  PRIMARY KEY,
  TimeStamp timestamp,
  FOREIGN KEY (User_ID) REFERENCES User (User_ID),
  FOREIGN KEY (Page_ID) REFERENCES Page (Page_ID)
};

Create Table Comment {
  Post_ID bigint PRIMARY KEY ,
  User_ID bigint  PRIMARY KEY,
  Comment_ID bigint PRIMARY KEY,  
  Content text NOT NULL,
  Time_Posted timestamp NOT NULL,
  Last_Edited timestamp NOT NULL,
  Deleted bit NOT NULL,
  FOREIGN KEY (User_ID) REFERENCES User (User_ID),
  FOREIGN KEY (Post_ID) REFERENCES Post (Post_ID)
};

Create Table Reaction {
  User_ID bigint PRIMARY KEY,  
  Post_ID bigint PRIMARY KEY,
  Reaction int NOT NULL,
  Timestamp timestamp NOT NULL,
  FOREIGN KEY (User_ID) REFERENCES User (User_ID),
  FOREIGN KEY (Post_ID) REFERENCES Post (Post_ID)
};

Create Table Friend {
  Sender bigint PRIMARY KEY,  
  Acceptor bigint PRIMARY KEY,  
  Sending_Time Timestamp NOT NULL,
  Accept_Time Timestamp,
  Status bit NOT NULL,
  FOREIGN KEY (Acceptor) REFERENCES User (User_ID),
  FOREIGN KEY (Sender) REFERENCES User (User_ID)
};

Create Table Likes {
  Hobby_ID bigint PRIMARY KEY, 
  User_ID bigint PRIMARY KEY,
  FOREIGN KEY (Hobby_ID) REFERENCES Hobby (Hobby_ID),
  FOREIGN KEY (User_ID) REFERENCES User (User_ID)
};

Create Table Private_Chat {
  Message_ID bigint PRIMARY KEY,  
  Sender_ID bigint NOT NULL,
  Receiver_ID bigint NOT NULL,
  FOREIGN KEY (Message_ID) REFERENCES Message (Message_ID)
};

Create Table Group_Chat {
  Message_ID bigint PRIMARY KEY, 
  Sender_ID bigint NOT NULL,
  Group_ID bigint NOT NULL,
  FOREIGN KEY (Message_ID) REFERENCES Message (Message_ID)
};

Create Table Member {
  Group_ID bigint PRIMARY KEY,  
  User_ID bigint  PRIMARY KEY,
  Privilege bigint NOT NULL,
  Joining_Time timestamp NOT NULL,
  FOREIGN KEY (Group_ID) REFERENCES Group (Group_ID),
  FOREIGN KEY (User_ID) REFERENCES User (User_ID)
};

Create Table Page_Admin {
  Page_ID bigint PRIMARY KEY ,
  User_ID bigint  PRIMARY KEY,
  FOREIGN KEY (User_ID) REFERENCES User (User_ID),
  FOREIGN KEY (Page_ID) REFERENCES Page (Page_ID)
};

Create Table Group_Admin {
  Group_ID bigint  PRIMARY KEY,
  User_ID bigint  PRIMARY KEY
  FOREIGN KEY (User_ID) REFERENCES User (User_ID),
  FOREIGN KEY (Group_ID) REFERENCES Group (Group_ID)
};