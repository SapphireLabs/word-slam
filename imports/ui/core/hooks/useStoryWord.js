import { useEffect, useState } from 'react';

import { stories } from '/utils/fixtures';

const toOption = (val) => ({ label: val, value: val });
const options = Object.keys(stories).map(toOption);
const randomOption = { label: 'Random', value: 'Random' };
const allWords = Object.keys(stories).reduce((acc, category) => [...acc, ...stories[category]], []);
const getCategory = (word) =>
    toOption(Object.keys(stories).find((category) => stories[category].includes(word)));

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
        category: category,
        trueCategory: category === randomOption ? getCategory(word) : category,
        setCategory,
        word,
        generateWord,
    };
};
