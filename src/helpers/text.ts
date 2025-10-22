

export const truncateText = (text: string | number, limit: number) => {
    const textStr = String(text);

    if (textStr.length > limit) {
        return textStr.substring(0, limit) + '...';
    }

    return textStr;
};