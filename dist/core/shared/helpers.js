export function findElements(node, name) {
    const results = [];
    if (node.name === name) {
        results.push(node);
    }
    if (!Array.isArray(node.children)) {
        return results;
    }
    for (const child of node.children) {
        results.push(...findElements(child, name));
    }
    return results;
}
export function getText(node) {
    if (!node)
        return "";
    // XmlText
    if ("text" in node) {
        return node.text;
    }
    // XmlElement
    if (Array.isArray(node.children)) {
        return node.children
            .map(getText)
            .join("")
            .trim();
    }
    return "";
}
