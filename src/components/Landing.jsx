import React from "react";
import CssBox from "./CssBox";
import DownArrows from "./DownArrows";
import UnderConstruction from "./UnderConstruction";

let fullName = 'anes-hodza'; let minDelay = 120;

export default function Landing(props) {
    const [name, setName] = React.useState('');
    const [downArrows, setDownArrows] = React.useState(null);
    const [css, setCss] = React.useState(`display: flex;\nflex-direction: column;\njustify-content: center;\nalign-items: center;`);
    const caret = React.useRef(null);
    const mainBody = React.useRef(null);
    const titleWrapper = React.useRef(null);

    const appendName = (idx) => {
        if (fullName.length === idx-1) {
            afterName()
            return;
        } else {
            setName(fullName.slice(0, idx))
        }

        if (fullName[idx] === 'd') {
            setTimeout(() => {
                setName(fullName.slice(0, idx) + 'z')
                setTimeout(() => {
                    setName(fullName.slice(0, idx) + 'zd')
                    setTimeout(() => {
                        setName(fullName.slice(0, idx) + 'z')
                        setTimeout(() => {
                            setName(fullName.slice(0, idx))
                            setTimeout(() => {
                                appendName(idx + 1)
                            }, minDelay + Math.random() * 100)
                        }, minDelay + Math.random() * 100)
                    }, minDelay + 200 + Math.random() * 100)
                }, minDelay + Math.random() * 100)
            }, minDelay + Math.random() * 100)

        } else {
            setTimeout(() => {
                appendName(idx+1)
            }, minDelay + Math.random() * 100)
        }
    }

    const afterName = () => {
        titleWrapper.current.style.setProperty('--from-top',
            titleWrapper.current.offsetTop * -1 + 'px')
        titleWrapper.current.style.setProperty('--from-left',
            titleWrapper.current.offsetLeft * -1 + 'px')
        titleWrapper.current.classList.add('move-top-left')
        setTimeout(() => {
            titleWrapper.current.classList.add('stay')
            caret.current.classList.add('blinking')
            mainBody.current.classList.add('fade-in')
            props.appRef.current.classList.add('expand')
            setDownArrows(  
                <DownArrows href={'#about'} givenClass={"jump-in float landing-arrows"}/>)
        }, 600)
    }

    const parseCss = (css) => {
      const cssArray = css.replace(/(\r\n|\n|\r)/gm, '').split(';');
      console.log(cssArray)
      cssArray.forEach(property => {
        const [key, value] = property.split(':');
        if (key && value) {
          console.log(key, value)
          mainBody.current.style.setProperty(key, value, 'important')
        }
      })
    }
    
    React.useEffect(() => {
      console.log('css changed')
      parseCss(css)
    }, [css]);

    React.useEffect(() => {
        setTimeout(() => {
            appendName(0)
        }, minDelay*1.5)
    }, []);

    return (
        <div className="first-section" ref={mainBody}>
            <div className="center" ref={titleWrapper}>
                <h1>{name}<span ref={caret}>_</span></h1>
                <div className="main-body">
                    <h2>Just another Software Engineer</h2>
                    <div className="about">
                    </div>
                </div>
                <CssBox css={css} setCss={setCss} />
            </div>
            {/* { downArrows } */}
        </div>
    );
}
