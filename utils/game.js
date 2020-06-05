import { generateWord as generateWordMethod, updateWord } from '/imports/api/rounds';

export const generateAccessCode = () => {
    let code = '';
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 4; i++) {
        code += letters[Math.floor(Math.random() * 26)];
    }

    return code;
};

/**
 * Since the Meteor validated-methods run twice?(once for optimisitic update,
 * and again for database update), this util generates a word once, and then
 * passes it to the meteor method
 */
export const generateWord = (round, category = round.category) => {
    const word = generateWordMethod(category);

    updateWord.call({ _id: round._id, word, category });
};
