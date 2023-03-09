import { useRef, useEffect } from 'react';

export default function LanguagesList() {
    const languages = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            languages.current.classList.add('scroll-languages')
        }, 1000)
    }, [])

    return (
        <h3 className="languages-wrapper">
            knowledgeable in
            <div ref={languages} className="languages">
                <div className="top-fade"></div>
                <span className="js">JavaScript</span>
                <span className="rb">Ruby</span>
                <span className="py">Python</span>
                <span className="java">Java</span>
                <span className="rs">Rust</span>
            </div>
            <div className="circle"></div>
        </h3>
    )
}
