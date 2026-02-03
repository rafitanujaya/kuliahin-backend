export const generateInitials = (name) => {
        const parts = name.trim().split(/\s+/)

        if(parts.length === 0) {
            return ""
        }

        if(parts.length === 1) {
            const word = parts[0];

            if(word.length === 1) {
                return word[0].toUpperCase();
            }
            return (word[0] + word[1]).toUpperCase()
        }

        const first = parts[0][0];
        const last = parts[parts.length - 1][0];

        return (first+last).toUpperCase()
}