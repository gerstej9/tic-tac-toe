'use strict';
const {prompt} = require ('enquirer');

const question = [
  {
    type: 'input',
    name: 'username',
    message: 'What is your username?'
  },
  {
    type: 'password',
    name: 'password',
    message: 'What is your password?'
  }
];
 

async function getAnswers(question){
  return await prompt(question);
}

let answers = getAnswers()

console.log(answers);