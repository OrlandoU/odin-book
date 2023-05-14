import { Route, Routes } from "react-router-dom";
import Section from "../../Section";
import { NavLink } from "react-router-dom";
import Overview from "../AboutRoutes/Overview";
import Work from "../AboutRoutes/Work";
import Education from "../AboutRoutes/Education";
import Places from "../AboutRoutes/Places";

export default function About() {
    return (
        <div className="user-about">
            <Section noTitle className="details">
                <div className="user-section-left">
                    <h2 className="sub-title">Details</h2>
                    <NavLink to={'./'} className={'sub-route-link'}>Overview</NavLink>
                    <NavLink to={'./work'} className={'sub-route-link'}>Work</NavLink>
                    <NavLink to={'./education'} className={'sub-route-link'}>Education</NavLink>
                    <NavLink to={'./places'} className={'sub-route-link'}>Places lived</NavLink>
                    <NavLink to={'./contact'} className={'sub-route-link'}>Contact info</NavLink>
                </div>
                <div className="user-section-right">
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/work" element={<Work />}/>
                        <Route path="/education" element={<Education />} />
                        <Route path="/places" element={<Places />} />                        
                    </Routes>
                </div>
            </Section>
            <Section title={'Photos'} />
        </div>
    )
}