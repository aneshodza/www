export default function DownArrows(params) {
    return (
        <a href={params.href} className={params.givenClass.concat(" arrows-container")}>
            <span className="arrows-text">Show me more</span>
            <svg className="top-arrow" xmlns="http://www.w3.org/2000/svg" fill="#FFF" height="48" width="48">
                <path d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z" />
            </svg>
            <svg className="bottom-arrow" xmlns="http://www.w3.org/2000/svg" fill="#FFF" height="48" width="48">
                <path d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z" />
            </svg>
        </a>
    )
}
