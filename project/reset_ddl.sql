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


drop sequence if exists inc;