import { useContext, useEffect, useState } from "react";
import { getCommentsCount, getPostFormatted } from "../../functions/posts";
import { TokenContext } from "../../contexts/TokenContext";

export default function Post(props) {
    const tokenObj = useContext(TokenContext)
    const [commentsCounts, setCommentsCount] = useState()

    useEffect(()=>{
        getCommentsCount(tokenObj.token, props._id).then(value=>{
            console.log(value)
            setCommentsCount(value)
        })
    })

    return (
        <div className="post">
            <div className="post-header">
                <div className="post-user">

                </div>
                <div className="post-subheader">
                    <div className="post-name">{props.user_id.first_name} {props.user_id.last_name}</div>
                    <div className="post-data">{getPostFormatted(props.create_date)}</div>
                </div>
            </div>
            <div className="post-content">
                {props.content}
            </div>
            <div className="post-media"></div>
            <div className="post-reactions">
                <div className="post-counts">
                    <div className="post-reactions-count"></div>
                    <span className="post-comments-count">{commentsCounts} comentarios</span>
                </div>
                <div className="post-options">
                    <div className="post-button">
                        <div className="post-button-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>thumb-up-outline</title><path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" /></svg>
                        </div>
                        <div className="post-button-text">Me gusta</div>
                    </div>
                    <div className="post-button">
                        <div className="post-button-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>message-outline</title><path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M20 16H5.2L4 17.2V4H20V16Z" /></svg>
                        </div>
                        <div className="post-button-text">Comentar</div>
                    </div>
                </div>
            </div>

        </div>
    )
}