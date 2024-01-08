import { FormEventHandler, useContext, useState } from "react"
import { Token, TokenContext } from "../../contexts/TokenContext"
import { createComment } from "../../functions/posts"
import { Mention, MentionsInput } from "react-mentions"
import { queryUser } from "../../functions/user"
import { UserContext } from "../../contexts/UserContext"
import User from "../../interfaces/User"

interface Props {
    post: string,
    comment?: string,
    end?: boolean
}

export default function CommentForm({ post, comment = '', end }: Props): JSX.Element {
    const [file, setFile] = useState<File>()
    const [mentions, setMentions] = useState<string[]>()
    const [content, setContent] = useState<string>('')

    const user = useContext(UserContext) as User
    const { token } = useContext(TokenContext) as Token


    const handleFile = (e: any) => {
        setFile(prev => e.target.files)
    }

    const handleContent = (e: any, i: any, j: any, y: {id: string, display: string}[]) => {
        setMentions(y.map((mention: { id: string, display: string }) => mention.id))
        setContent(e.target.value)
    }

    const handleSuggestion = (entry: User, newValue: string, newEntry: User, mentions: string[]) => {
        return (
            <div className="post-header mention">
                <div className="post-user">
                    <img src={entry.profile} alt="" />
                </div>
                <div className="post-subheader">
                    <div className="post-name">{entry.first_name} {entry.last_name}</div>
                </div>
            </div>
        )
    }

    const markup = `<a href="/__id__/">__display__</a>`;

    const handleData = async (search: string, cb: (val: User[]) => void) => {
        if (search.length) {
            const q = await queryUser(token, search)
            if (!q) {
                return null
            }
            cb(q.filter(el => el._id !== user._id).map(queriedUser => {
                return { id: queriedUser._id, ...queriedUser, display: `${queriedUser.first_name} ${queriedUser.last_name}` }
            }))
        }
    }

    const displayTransform = (id: string, display: string) => {
        return display
    }

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault()
        if (content.length || file) {
            const response = await createComment(token, post, comment, content, file, mentions)
            console.log(response)
        }
    }

    if (!user._id) {
        return <></>
    }

    return (
        <form onSubmit={handleSubmit} className="comment-form" style={{ boxShadow: (!end && !comment) ? '0px 0px 6px rgba(0, 0, 0, 0.151)' : 'none' }}>
            <div className="comment-user">
                <img src={user.profile} alt="User profile" />
            </div>
            <div className="comment-content">
                <MentionsInput singleLine value={content} onChange={handleContent} className="post-content-input" placeholder={"Write a comment..."}>
                    <Mention
                        trigger="@"
                        data={handleData}
                        renderSuggestion={handleSuggestion}
                        markup={markup}
                        displayTransform={displayTransform}
                    />
                </MentionsInput>
                <button>
                    <svg fill={content.length > 0 ? '#1379FF' : 'gray'} height="20px" viewBox="0 0 24 24" width="20px"><path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"></path></svg>
                </button>
            </div>
        </form>
    )
}
