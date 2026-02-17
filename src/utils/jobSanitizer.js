const sanitizeHtml = require("sanitize-html");
const striptags = require("striptags");

const config = {
    allowedTags: [
        "p", "br", "ul", "ol", "li", "strong", "b", "em", "i", "h2", "a"
    ],
    allowedAttributes: {
        a: ["href", "target", "rel"]
    },
    transformTags: {
        a: sanitizeHtml.simpleTransform("a", {
            rel: "nofollow noopener noreferrer",
            target: "_blank"
        })
    }
};

exports.clean = (html) => {
    const sanitized = sanitizeHtml(html || "", config);

    return {
        html: sanitized,
        text: striptags(sanitized)
            .replace(/\s+/g, " ")
            .trim()
    };
}
