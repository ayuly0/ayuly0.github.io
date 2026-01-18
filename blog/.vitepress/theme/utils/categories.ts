import { Post } from "../types";

export function getCategories(posts: Post[]): Map<string, Post[]> {
    const categoriesMap = new Map<string, Post[]>();

    posts.forEach((post) => {
        const category = post.data.category;
        if (category) {
            if (!categoriesMap.has(category)) {
                categoriesMap.set(category, []);
            }
            categoriesMap.get(category)?.push(post);
        }
    });

    return categoriesMap;
}
