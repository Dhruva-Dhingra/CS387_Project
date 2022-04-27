const get_homepage_posts = async (req, res) => {
    try {
        res = {'result' : null};
        let user_id = req.body.user_id;
        let start = req.body.start;
        let end = req.body.end;
        let materialised_view_start = max(start, 21);
        let materialised_view_end = min(20, end);
        
        let materialised_view_ans = pool.query(
            `select homepage_user, post_id, poster_page_id, poster_user_id, content_type, content, time
            from (
                select homepage_user, post_id, poster_page_id, poster_user_id, content_type, content, time, rank() over (order by time asc) as post_rank
                from Homepage
                where homepage_user = $1
            )
            where post_rank between $2 and $3`
            [user_id, materialised_view_start, materialised_view_end]
        );

        if(start > 20){        
        ans = pool.query(
            `with actual_friends as (
                (select Friend.Sender a, Friend.Acceptor b from Friend where Friend.Accept_Time is not null and Friend.Sender = $1)
                union
                (select Friend.Acceptor a, Friend.Sender b from Friend where Friend.Accept_Time is not null and Friend.Acceptor = $1)
            )
            select homepage_user, post_id, poster_page_id, poster_user_id, content_type, content, time
            from (
                select AppUser.User_ID as homepage_user, Post.Post_ID as post_id, Post.Page_ID as poster_page_id, Post.User_ID as poster_user_id , Post.Content_Type as content_type, Post.Content as content, Post.Time as time, rank() over (order by Post.Time asc) as post_rank
                from Post where 
                (
                    Post.User_ID is not null and
                    Post.User_ID in 
                        (select actual_friends.b from actual_friends where actual_friends.a = $1)
                )
                or
                (
                    Post.Post_ID is not null and
                    Post.Post_ID in 
                        (select Follower.Page_ID from Follower where Follower.User_ID = $1)
                )
                order by Post.Time desc limit $3
            )
            where post_rank between $2 and $3`,
            [user_id, start, end]
        )
        res.result = ((await materialised_view_ans).rows).concat((await ans).rows);
        }
        else{
            res.result = (await materialised_view_ans).rows;
        }
        console.log(res);
        return res;
    }
    catch (err) {
		return err.stack;
    }
}


			
module.exports = {
    get_homepage_posts,
}
