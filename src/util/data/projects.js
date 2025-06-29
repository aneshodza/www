const projects = [
  {
    name: 'http-server',
    repo: 'https://github.com/aneshodza/rust-http-server',
    description: 'An HTTP-Server written in Rust',
    tags: ['rust', 'http', 'server', 'low-level'],
    language: 'rust',
    pinned: 0,
    status: 'finished'
  },
  {
    name: 'http.c',
    repo: 'https://github.com/aneshodza/http.c',
    description: 'An HTTP-Server written in C',
    tags: ['c', 'http', 'server', 'low-level'],
    language: 'c',
    pinned: 0,
    status: 'in development'
  },
  {
    name: 'www',
    repo: 'https://github.com/aneshodza/www',
    description: 'The website powering aneshodza.ch',
    tags: ['nextjs', 'javascript', 'fullstack'],
    language: 'nextjs',
    pinned: 1,
    status: 'in development'
  },
  {
    name: 'Universal Turing Machine',
    website: 'https://universal-turing-machine.ch/',
    description: 'A tool used in THIN at the ZHAW to simulate Turing machines',
    tags: ['theoretical computer science', 'typescript', 'vuejs'],
    language: 'vuejs',
    pinned: 4,
    status: 'maintenance'
  },
  {
    name: 'pushdown-automaton',
    npm: 'https://www.npmjs.com/package/pushdown-automaton',
    description: 'An npm library for creating pushdown automata',
    tags: ['typescript', 'tcs', 'npm', 'theoretical computer science'],
    language: 'typescript',
    pinned: 3,
    status: 'maintenance'
  },
  {
    name: 'studyweek',
    website: 'https://www.studyweek.ch/',
    description: 'A SwiftUI app for University students to see what week of the semester they are currently in',
    tags: ['swift', 'ios', 'app', 'univeristy'],
    language: 'swift',
    pinned: 2,
    status: 'in development'
  },
  {
    name: 'blank-package.ts',
    repo: 'https://github.com/aneshodza/blank-package.ts',
    description: 'A template for creating npm packages in TypeScript. It comes with a full CI/CD pipeline, a linter, a formatter, a test suite and automated web-publishment of the language docs.',
    tags: ['typescript', 'npm', 'template', 'ci/cd'],
    language: 'typescript',
    pinned: 0,
    status: 'maintenance'
  },
  {
    name: 'abstract.ts',
    npm: 'https://www.npmjs.com/package/abstract.ts',
    description: 'An npm package that implements and offers ADTs like binary trees, linked lists and more.',
    tags: ['typescript', 'npm', 'adt', 'data structure'],
    language: 'typescript',
    pinned: 0,
    status: 'finished'
  },
  {
    name: 'translator',
    repo: 'https://github.com/aneshodza/translator',
    description: 'A translation game, which was my submission to the Andeo Coding Cotest, winning me 1st place and a 150CHF digitec voucher.',
    tags: ['java', 'sql', 'game'],
    language: 'java',
    pinned: 0,
    status: 'finished'
  },
  {
    name: 'ananke',
    repo: 'https://github.com/aneshodza/ananke',
    description: 'An all-around project management software written in Ruby. It has WYSIWYG editors, image uploads to an AWS-Bucket and full test coverage with a working CI/CD pipeline.',
    tags: ['ruby', 'rails', 'fullstack', 'ci/cd', 'aws'],
    language: 'ruby',
    pinned: 0,
    status: 'finished'
  }
];

export default projects;
