export default function Section({children, title, noTitle, className}){
    if(noTitle){
        return (
            <section className={"user-section " + className}>
                {children}
            </section>
        )
    }
    return (
        <section className={"user-section " + className}>
            <h2 className="sub-title">{title}</h2>
            {children}
        </section>
    )
}