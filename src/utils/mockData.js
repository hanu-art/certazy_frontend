// 🔴 TESTING DATA - Mock course data for development
export const mockCourseData = {
    sections: [
        {
            id: 1,
            title: "Getting Started",
            order_num: 1,
            lessons: [
                {
                    id: 1,
                    section_id: 1,
                    title: "Introduction to Course",
                    type: "video",
                    content: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    duration: 300,
                    order_num: 1,
                    is_free: 1
                },
                {
                    id: 2,
                    section_id: 1,
                    title: "Course Overview",
                    type: "text",
                    content: `# Welcome to the Course!

## Getting Started

This is a **sample text lesson** to test the EnhancedTextLesson component.

### Features Included:
- **Font size controls** (A-, A, A+)
- **Fullscreen reading mode**
- **Reading progress tracking**
- **Markdown support**

### Code Example:
\`\`\`javascript
console.log("Hello, World!");
\`\`\`

### Lists:
- Item 1
- Item 2
- Item 3

1. Numbered item 1
2. Numbered item 2
3. Numbered item 3

> **Note:** This is a testing environment

**Enjoy the learning experience! 🚀**`,
                    duration: 0,
                    order_num: 2,
                    is_free: 1
                }
            ]
        },
        {
            id: 2,
            title: "Advanced Topics",
            order_num: 2,
            lessons: [
                {
                    id: 3,
                    section_id: 2,
                    title: "Advanced Concepts",
                    type: "video",
                    content: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                    duration: 600,
                    order_num: 1,
                    is_free: 0
                }
            ]
        }
    ],
    exams: [
        {
            id: 1,
            title: "Final Assessment",
            description: "Test your knowledge",
            duration_minutes: 30,
            questions_count: 5,
            passing_percentage: 70
        }
    ]
};

// Mock questions for testing
export const mockQuestions = [
    {
        id: 1,
        test_id: 1,
        question: "What is React?",
        type: "single",
        explanation: "React is a JavaScript library for building user interfaces.",
        difficulty: "easy",
        topic_tag: "React Basics",
        order_num: 1,
        options: [
            { id: 1, option_text: "A database system", order_num: 1, is_correct: false },
            { id: 2, option_text: "A JavaScript library for UI", order_num: 2, is_correct: true },
            { id: 3, option_text: "A CSS framework", order_num: 3, is_correct: false },
            { id: 4, option_text: "A backend framework", order_num: 4, is_correct: false }
        ]
    },
    {
        id: 2,
        test_id: 1,
        question: "Which of the following are React hooks? (Select all that apply)",
        type: "multiple",
        explanation: "useState, useEffect, and useContext are all React hooks.",
        difficulty: "medium",
        topic_tag: "React Hooks",
        order_num: 2,
        options: [
            { id: 5, option_text: "useState", order_num: 1, is_correct: true },
            { id: 6, option_text: "useEffect", order_num: 2, is_correct: true },
            { id: 7, option_text: "useContext", order_num: 3, is_correct: true },
            { id: 8, option_text: "useDatabase", order_num: 4, is_correct: false }
        ]
    }
];
