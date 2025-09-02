export const sortCategories = (categories) => {
    return Array.from(categories).sort((a, b) => {
        if (!a.parent_id) return -1;
        if (a.parent_id == b.id) {
            return 1;
        }
        if (!b.parent_id) return 1;
        if (b.parent_id == a.id) {
            return -1;
        }
        return 0;
    });
};
