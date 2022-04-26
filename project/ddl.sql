create table appuser (
  user_id  bigint primary key,
  first_name  text,
  last_name  text,
  roll_number  text,
  branch  text,
  degree  text,
  batch  int,
  email  text,
  hash_of_password  text,
  residence  text,
  birthday  date,
  signup_date  timestamp,
  profile_picture   oid,
  private  bit,
  autoadd_to_groups  bit
);

create table website_admin (
  admin_id int primary key,
  email text,
  hash_of_password text
);

create table hobby (
hobby_id  int primary key,
	name  text,
	category  text,
	description  text
);

create table post (
	post_id bigint primary key ,
	page_id bigint,
	user_id bigint,
	content_type int,
	content  oid,
	time  timestamp,
	validity  int
 );


create table status (
  status_id bigint primary key,  
  user_id bigint,
  content_type int,
  content  oid,
  time timestamp
 );

create table page (
page_id  bigint  primary key,
	name  text,
	profile_picture   oid,
	description  text,
	created_on  timestamp 
);

create table page_keyword (
  page_id bigint,  
  keyword text,
  primary key (page_id, keyword)
);

create table usergroup (
group_id  bigint primary key,  
	name  text,
	profile_picture   oid,
	description  text,
	created_on  timestamp
);

create table message (
message_id  int primary key ,
content  text,
time  timestamp,
view_once  bit,
deleted  bit,
invitation  bit,
group_id  bigint

);

create table about (
  page_id bigint,  
  hobby_id bigint, 
  primary key (page_id, hobby_id)
);

create table tags (
  post_id bigint, 
  user_id bigint,
  primary key (post_id, user_id)
);

create table follower (
  page_id bigint, 
  user_id bigint,
  timestamp timestamp,
  primary key (page_id, user_id)
);

create table comment (
  post_id bigint,
  user_id bigint,
  comment_id bigint,  
  content text,
  time_posted timestamp,
  last_edited timestamp,
  deleted bit,
  primary key (post_id, user_id, comment_id)
);

create table reaction (
  user_id bigint,
  post_id bigint,
  reaction int,
  timestamp timestamp,
  primary key (user_id, post_id)
);

create table friend (
  sender bigint,  
  acceptor bigint,  
  sending_time timestamp,
  accept_time timestamp,
  status bit,
  primary key (sender, acceptor) 
);

create table likes (
  hobby_id bigint, 
  user_id bigint,
  primary key (hobby_id, user_id)
);

create table private_chat (
  message_id bigint primary key,  
  sender_id bigint ,
  receiver_id bigint
);

create table group_chat (
  message_id bigint primary key, 
  sender_id bigint ,
  group_id bigint
);

create table member (
  group_id bigint,  
  user_id bigint,
  privilege bigint,
  joining_time timestamp,
  primary key (group_id, user_id)
);

create table page_admin (
  page_id bigint,
  user_id bigint,
  primary key (page_id, user_id)
);

create table group_admin (
  group_id bigint,
  user_id bigint,
  primary key (group_id, user_id)
);

create materialized view homepage
as
with actual_friends as (
        (select friend.sender a, friend.acceptor b from friend where friend.accept_time is not null)
        union
        (select friend.acceptor a, friend.sender b from friend where friend.accept_time is not null)
    )
select post.post_id, post.page_id, post.user_id, post.content_type, post.content, post.time
    from post, appuser where 
        (
            post.user_id is not null and
            post.user_id in 
                (select actual_friends.b from actual_friends where actual_friends.a = appuser.user_id)
        )
        or
        (
            post.post_id is not null and
            post.post_id in 
                (select follower.page_id from follower where follower.user_id = appuser.user_id)
        )
    order by post.time desc limit 20
;

create materialized view timeline
as
with actual_friends as (
        (select friend.sender a, friend.acceptor b from friend where friend.accept_time is not null)
        union
        (select friend.acceptor a, friend.sender b from friend where friend.accept_time is not null)
    )
select post.post_id, post.page_id, post.user_id, post.content_type, post.content, post.time
    from post, appuser where 
        (
            post.user_id is not null and
            post.user_id in 
                (select actual_friends.b from actual_friends where actual_friends.a = appuser.user_id)
        )