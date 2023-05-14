import { useContext, useEffect, useState } from "react";
import LeftBar from "../LeftBar";
import Section from "../../../Section";
import Post from '../../../Post/Post'
import { getPosts } from "../../../../functions/posts";
import { TokenContext } from "../../../../contexts/TokenContext";
import { useParams } from "react-router-dom";

export default function Media(props) {
    const url = useParams()
    const tokenContext = useContext(TokenContext)
    

    return (
        <div className="group-section-wrapper">
            <Section>
                <h2 className="sub-title">Media</h2>
            </Section>
        </div>
    )
}