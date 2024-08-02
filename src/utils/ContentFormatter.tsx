import DOMPurify from "dompurify";

export const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
    if (!highlight) return <span>{text}</span>;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <span>
            {parts.map((part, index) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={index} className="bg-yellow-300 dark:bg-orange-500">{part}</span>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </span>
    );
};

export const renderBioWithLinksAndBreaks = (bio: string | undefined) => {
    // Sanitize the bio using DOMPurify
    const sanitizedBio = DOMPurify.sanitize(bio || "");

    // Convert URLs into anchor tags
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const linkStyle = "text-blue-500 hover:underline cursor-pointer";
    const withLinks = sanitizedBio.replace(urlRegex, (url) => {
        return `<a href="${url}" class="${linkStyle}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // Convert newlines to <br>
    const withLineBreaks = withLinks.replace(/\n/g, '<br>');

    // Return as dangerouslySetInnerHTML safe string
    return { __html: withLineBreaks };
}


const highlightText = (text: string, highlight: string) => {
    if (!highlight) return `<span>${text}</span>`;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

    return (
        `<span>${parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ?
                `<span key=${index} class="bg-yellow-300 dark:bg-teal-900">${part}</span>`
                :
                `<span key=${index}>${part}</span>`
        ).join('')}</span>`
    );
};

export const renderBioWithLinksAndBreaksAndHighlights = (bio: string | undefined, highlight: string) => {
    // Sanitize the bio using DOMPurify
    const sanitizedBio = DOMPurify.sanitize(bio || "");

    // Convert URLs into anchor tags
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const linkStyle = "text-blue-500 hover:underline cursor-pointer";

    const withLinks = sanitizedBio.split(urlRegex).map((part, index) => {
        if (urlRegex.test(part)) {
            const hightLightResult = highlightText(part, highlight);
            return `<a href="${part}" class="${linkStyle}" target="_blank" rel="noopener noreferrer">${hightLightResult}</a>`;
        } else {
            // 对未被urlRegex匹配的字符串进行处理
            const hightLightResult = highlightText(part, highlight);
            return hightLightResult;
        }
    }).join('');
    // Convert newlines to <br>
    const withLineBreaks = withLinks.replace(/\n/g, '<br>');
    // Return as dangerouslySetInnerHTML safe string
    return { __html: withLineBreaks };
};