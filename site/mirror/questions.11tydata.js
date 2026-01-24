const questions = require('../_data/mirror_questions.json');

module.exports = {
  eleventyComputed: {
    pathId: "mirror",
    pathName: "The Inverse Mirror",
    totalQuestions: () => questions.length,
    questionNum: data => data.question?.id || "",
    questionText: data => data.question?.text || "",
    options: data => data.question?.options || [],
    reveal: data => data.question?.inversion || null,
    context: data => data.question?.context || null,
    pairName: data => data.question?.pairName || null,
    quote: data => data.question?.quote || null,
    isLast: data => data.question?.id === questions.length
  }
};
