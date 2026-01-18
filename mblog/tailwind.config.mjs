/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './blog/.vitepress/**/*.{js,ts,vue}',
        './blog/**/*.md',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // zinc is default in tailwind v3, but ensuring it's available if needed or extending
            }
        },
    },
    plugins: [],
}
