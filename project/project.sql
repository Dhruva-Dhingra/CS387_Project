drop materialized view if exists Last_Time_Conversation_User;
drop materialized view if exists Group_Cached_Messages;
drop materialized view if exists DM_Cached_Messages;
drop materialized view if exists Invitations;
drop materialized view if exists Top_Comments;
drop materialized view if exists Reaction_Count;
drop materialized view if exists Timeline;
drop materialized view if exists Homepage;

drop table if exists Group_Admin;
drop table if exists Page_Admin;
drop table if exists Member;
drop table if exists Group_Chat;
drop table if exists Private_Chat;
drop table if exists Likes;
drop table if exists Friend;
drop table if exists Reaction;
drop table if exists Comment;
drop table if exists Follower;
drop table if exists Tags;
drop table if exists About;
drop table if exists Message;
drop table if exists UserGroup;
drop table if exists Page_Keyword;
drop table if exists Status;
drop table if exists Post;
drop table if exists Page;
drop table if exists Hobby;
drop table if exists Website_Admin;
drop table if exists AppUser;


drop sequence if exists seq_user_id;
drop sequence if exists seq_admin_id;
drop sequence if exists seq_hobby_id;
drop sequence if exists seq_page_id;
drop sequence if exists seq_post_id;
drop sequence if exists seq_status_id;
drop sequence if exists seq_group_id;
drop sequence if exists seq_message_id;
drop sequence if exists seq_comment_id;
drop sequence if exists inc;

create Table AppUser (
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
  Profile_Picture   bytea,
  Private  boolean NOT NULL,
  AutoAdd_to_Groups  boolean NOT NULL
);

Create Table Website_Admin (
  Admin_ID int PRIMARY KEY,
  Email text NOT NULL,
  Hash_of_Password text NOT NULL
);

Create Table Hobby (
  Hobby_ID  int PRIMARY KEY NOT NULL,
  Name  text NOT NULL,
  Category  text,
  Description  text
);

Create Table Page (
  Page_ID  bigint  PRIMARY KEY,
  Name  text NOT NULL,
  Profile_Picture   bytea,
  Description  text,
  Created_On  timestamp NOT NULL
);

Create Table Post (
	Post_ID bigint PRIMARY KEY ,
	Page_ID bigint,
	User_ID bigint,
	Content_Type int NOT NULL,
	Content  text,
  Content_Picture bytea,
	Time  timestamp NOT NULL,
	Validity  int NOT NULL,
  FOREIGN KEY (User_ID) REFERENCES AppUser (User_ID),
  FOREIGN KEY (Page_ID) REFERENCES Page (Page_ID)
 );


Create Table Status (
  Status_ID bigint PRIMARY KEY,  
  User_ID bigint NOT NULL,
  Content_Type int NOT NULL,
  Content  bytea NOT NULL,
  Time timestamp NOT NULL,
  FOREIGN KEY (User_ID) REFERENCES AppUser (User_ID)
 );

Create Table Page_Keyword (
  Page_ID bigint,  
  Keyword text,
  PRIMARY KEY (Page_ID, Keyword),
  FOREIGN KEY (Page_ID) REFERENCES Page (Page_ID)
);

Create Table UserGroup (
Group_ID  bigint PRIMARY KEY,  
	Name  text NOT NULL,
	Profile_Picture   bytea,
	Description  text,
	Created_on  timestamp NOT NULL
);

Create Table Message (
  Message_ID  int PRIMARY KEY ,
  Content  text NOT NULL,
  Time  timestamp NOT NULL,
  View_Once  boolean NOT NULL,
  Deleted  boolean NOT NULL,
  Invitation  boolean,
  Group_ID  bigint

);

Create Table About (
  Page_ID bigint,  
  Hobby_ID bigint,
  PRIMARY KEY (Page_ID, Hobby_ID),
  FOREIGN KEY (Page_ID) REFERENCES Page (Page_ID),
  FOREIGN KEY (Hobby_ID) REFERENCES Hobby (Hobby_ID)
);

Create Table Tags (
  Post_ID bigint, 
  User_ID bigint,
  PRIMARY KEY (Post_ID, User_ID),
  FOREIGN KEY (User_ID) REFERENCES AppUser (User_ID),
  FOREIGN KEY (Post_ID) REFERENCES Post (Post_ID)
);

Create Table Follower (
  Page_ID bigint, 
  User_ID bigint,
  TimeStamp timestamp,
  PRIMARY KEY (Page_ID, User_ID),
  FOREIGN KEY (User_ID) REFERENCES AppUser (User_ID),
  FOREIGN KEY (Page_ID) REFERENCES Page (Page_ID)
);

Create Table Comment (
  Post_ID bigint,
  User_ID bigint,
  Comment_ID bigint,  
  Content text NOT NULL,
  Time_Posted timestamp NOT NULL,
  Last_Edited timestamp NOT NULL,
  Deleted boolean NOT NULL,
  PRIMARY KEY (Post_ID, User_ID, Comment_ID),
  FOREIGN KEY (User_ID) REFERENCES AppUser (User_ID),
  FOREIGN KEY (Post_ID) REFERENCES Post (Post_ID)
);

Create Table Reaction (
  User_ID bigint,  
  Post_ID bigint,
  Reaction int NOT NULL,
  PRIMARY KEY (User_ID, Post_ID),
  Timestamp timestamp,
  FOREIGN KEY (User_ID) REFERENCES AppUser (User_ID),
  FOREIGN KEY (Post_ID) REFERENCES Post (Post_ID)
);

Create Table Friend (
  Sender bigint,  
  Acceptor bigint,  
  Sending_Time Timestamp NOT NULL,
  Accept_Time Timestamp,
  Status boolean NOT NULL,
  PRIMARY KEY (Sender, Acceptor),
  FOREIGN KEY (Acceptor) REFERENCES AppUser (User_ID),
  FOREIGN KEY (Sender) REFERENCES AppUser (User_ID)
);

Create Table Likes (
  Hobby_ID bigint, 
  User_ID bigint,
  PRIMARY KEY (Hobby_ID, User_ID),
  FOREIGN KEY (Hobby_ID) REFERENCES Hobby (Hobby_ID),
  FOREIGN KEY (User_ID) REFERENCES AppUser (User_ID)
);

Create Table Private_Chat (
  Message_ID bigint PRIMARY KEY,  
  Sender_ID bigint NOT NULL,
  Receiver_ID bigint NOT NULL,
  FOREIGN KEY (Message_ID) REFERENCES Message (Message_ID)
);

Create Table Group_Chat (
  Message_ID bigint PRIMARY KEY, 
  Sender_ID bigint NOT NULL,
  Group_ID bigint NOT NULL,
  FOREIGN KEY (Message_ID) REFERENCES Message (Message_ID)
);

Create Table Member (
  Group_ID bigint,  
  User_ID bigint,
  Privilege bigint NOT NULL,
  Joining_Time timestamp NOT NULL,
  PRIMARY KEY (Group_ID, User_ID),
  FOREIGN KEY (Group_ID) REFERENCES UserGroup (Group_ID),
  FOREIGN KEY (User_ID) REFERENCES AppUser (User_ID)
);

Create Table Page_Admin (
  Page_ID bigint,
  User_ID bigint,
  PRIMARY KEY (Page_ID, User_ID),
  FOREIGN KEY (User_ID) REFERENCES AppUser (User_ID),
  FOREIGN KEY (Page_ID) REFERENCES Page (Page_ID)
);

Create Table Group_Admin (
  Group_ID bigint,
  User_ID bigint,
  PRIMARY KEY (Group_ID, User_ID),
  FOREIGN KEY (User_ID) REFERENCES AppUser (User_ID),
  FOREIGN KEY (Group_ID) REFERENCES UserGroup (Group_ID)
);

Create Materialized View Homepage
as
with actual_friends as (
        (select Friend.Sender a, Friend.Acceptor b from Friend where Friend.Accept_Time is not null)
        union
        (select Friend.Acceptor a, Friend.Sender b from Friend where Friend.Accept_Time is not null)
    )
select AppUser.User_ID as homepage_user, Post.Post_ID as post_id, Post.Page_ID as poster_page_id, Post.User_ID as poster_user_id , Post.Content_Type as content_type, Post.Content as content, Post.Time as time
    from Post, AppUser where 
        (
            Post.User_ID is not null and
            Post.User_ID in 
                (select actual_friends.b from actual_friends where actual_friends.a = AppUser.User_ID)
        )
        or
        (
            Post.Post_ID is not null and
            Post.Post_ID in 
                (select Follower.Page_ID from Follower where Follower.User_ID = AppUser.User_ID)
        )
    order by Post.Time desc limit 20
;

Create Materialized View Timeline
as
select * 
from 
(select Post.Post_id, Post.Page_ID, Post.User_ID, Post.Content_Type, Post.Content, Post.Time, rank() over (Partition By Post.User_ID order by Post.Time desc) as Post_Rank
    from Post
) as intermediate
where Post_Rank <= 50
;

Create Materialized View Reaction_Count
as
	select Post_ID, Reaction, count(Reaction) as Reaction_Count
	from Reaction
	group by (Post_ID, Reaction)
;

Create Materialized View Top_Comments
as
	select *
  from 
  (select Post_ID, Comment_ID, Content, Time_Posted, rank() over (Partition By Post_ID order by Time_Posted desc) as Comment_Rank
	from Comment) as intermediate
	where Comment_Rank <= 10
;

Create Materialized View Invitations
as
	select *
  from
  (select Sender, Acceptor, rank() over (Partition By Acceptor order by Sending_Time asc) as Invitation_Rank 
	from Friend
	where not Status) as intermediate
	where Invitation_Rank <= 20
;
create unique index on Invitations (Sender, Acceptor);
refresh materialized view concurrently Invitations;

Create Materialized View DM_Cached_Messages
as
	select * 
  from 
  (select Message.Message_ID, Message.Content, Message.Time, Private_Chat.Sender_ID, Private_Chat.Receiver_ID, 
		rank() over (Partition by (Private_Chat.Sender_ID, Private_Chat.Receiver_ID) order by Message.Time desc) as Message_rank
	from Message, Private_Chat
		where Message.Message_ID = Private_Chat.Message_ID) as intermediate
    where Message_rank <= 50
;

Create Materialized View Group_Cached_Messages
as
	select *
  from
  (select Message.Message_ID, Message.Content, Message.Time, Group_Chat.Sender_ID, Group_Chat.Group_ID, 
		rank() over (Partition by (Group_Chat.Sender_ID, Group_Chat.Group_ID) order by Message.Time desc) as Message_rank
	from Message, Group_Chat
		where Message.Message_ID = Group_Chat.Message_ID) as intermediate
    where Message_rank <= 50
;

create Materialized View Last_Time_Conversation_User
as
  with single_directional_view as
    (select Content, Time, user_1, user_2
    from (
      select Message.Content as content, Message.Time as time, Private_Chat.Sender_ID as user_1, Private_Chat.Receiver_ID as user_2, 
			rank() over (Partition by (Sender_ID, Receiver_ID) order by (Message.Time, Sender_ID, Receiver_ID)) as message_rank
      from Message, Private_Chat
    ) as intermediate
    where
    message_rank <= 1
    )
  (select content, time, user_1, user_2 from single_directional_view)
  union
  (select content, time, user_2, user_1 from single_directional_view)
;

create sequence if not exists seq_user_id
start with 1
increment by 1;
alter table AppUser
alter column User_ID
set default nextval('seq_user_id');

create sequence if not exists seq_admin_id
start with 1
increment by 1;
alter table Website_Admin
alter column Admin_ID
set default nextval('seq_admin_id');

create sequence if not exists seq_hobby_id
start with 1
increment by 1;
alter table Hobby
alter column Hobby_ID
set default nextval('seq_hobby_id');

create sequence if not exists seq_page_id
start with 1
increment by 1;
alter table Page
alter column page_ID
set default nextval('seq_page_id');

create sequence if not exists seq_post_id
start with 1
increment by 1;
alter table Post
alter column Post_ID
set default nextval('seq_post_id');

create sequence if not exists seq_status_id
start with 1
increment by 1;
alter table Status
alter column Status_ID
set default nextval('seq_status_id');

create sequence if not exists seq_group_id
start with 1
increment by 1;
alter table UserGroup
alter column Group_ID
set default nextval('seq_group_id');

create sequence if not exists seq_message_id
start with 1
increment by 1;
alter table message
alter column message_id
set default nextval('seq_message_id');

create sequence if not exists seq_comment_id
start with 1
increment by 1;
alter table Comment
alter column Comment_ID
set default nextval('seq_comment_id');
