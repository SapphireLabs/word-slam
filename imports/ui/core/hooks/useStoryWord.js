import { useEffect, useState } from 'react';

import { stories } from '/utils/fixtures';

const options = Object.keys(stories).map((category) => ({ label: category, value: category }));
const randomOption = { label: 'Random', value: 'Random' };
const allWords = Object.keys(stories).reduce((acc, category) => [...acc, ...stories[category]], []);

export const useStoryWord = () => {
    const [category, setCategory] = useState(randomOption);
    const [word, setWord] = useState(null);
    const wordBank = category === randomOption ? allWords : stories[category.value];

    const generateWord = () => {
        setWord(wordBank[Math.floor(Math.random() * wordBank.length)]);
    };

    useEffect(() => {
        generateWord();
    }, [category]);

    return {
        options: [...options, randomOption],
        category,
        setCategory,
        word,
        generateWord,
    };
};
