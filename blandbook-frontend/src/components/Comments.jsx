
// some issues:
// refresh
// sequence
// todo delete
// todo if not login, hide the comment label
import React from "react";
import axios from "axios";

import NewComment from "./NewComment";

const BASE_URL_SINGLE_POST = 'http://localhost:3000/posts/'


class Comments extends React.Component {



    state = {
        postId: null,
        commentDetails: null,
        postDetails: {
            title: null,
            postUser: null
        },



    }

    componentDidMount() {
        // console.log('componentDidMount', this.props.match.params.postId) // for test

        // this.setState({
        //     postId: this.props.match.params.postId,
        // })
        // console.log('componentDidMount state', this.state.postId) //null
        this.getCommentDetails()
    }

    getCommentDetails = async() => {
        try{
            const res = await axios.get(BASE_URL_SINGLE_POST + this.props.match.params.postId + '.json')
            // console.log('getCommentDetails', res.data); // for test
            this.setState({
                commentDetails: res.data.comments.reverse(),
                postDetails: {
                    title: res.data.title,
                    postUser: res.data.user.screen_name
                }
            })

        }catch(err){
            console.log('There was an error', err)
        }
    }

    // fetchCommentAgain = async() => {
    //     const res = await axios.get(BASE_URL_SINGLE_POST + this.state.postId + '.json')

    //     this.setState({
    //         commentDetails: res.data.comments.reverse()
    //     })
    // }





    render() {
        return (
            <div>
                <p><strong>Post: </strong></p>
                <p>{this.state.postDetails.title}</p>
                <p>by {this.state.postDetails.postUser}</p>
                <br />

                <NewComment currentUser = {this.props.currentUser} currentPostId = {this.props.match.params.postId} createNewComment = {this.getCommentDetails} />
                <br />

                <p><strong>Comments History</strong></p>
                <ul>
                {this.state.commentDetails
                &&
                this.state.commentDetails.map((comment, index) => 
                <li key={comment.id}>
                    <p>
                        {comment.user.screen_name} says: 
                        <em>{comment.content}</em> 
                    </p>

                    <p>
                        like:{comment.like}
                        |
                        dislike:{comment.dislike}
                    </p>

                    <p>create time:{comment.created_at}</p>

                    <br />
                </li>)}
                </ul>
            </div>
        );
    }
}

export default Comments


