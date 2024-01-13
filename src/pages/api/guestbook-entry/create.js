import simpleGit from "simple-git";
import path from "path";

const git = simpleGit(path.join(global.__basedir, 'guestbook'));

export default async function handler(req, res) {
  try {
    await git.commit(req.body.message, [], {'--allow-empty': true, '--author': `${req.body.name} <am@az.ing>`});
    await git.push('origin', 'main');
    res.status(200).json({ message: 'Thanks for your entry!' });
  } catch (error) {
    console.error('Git operation failed:', error);
    res.status(500).json({ error: 'Something went wrong...' });
  }
}
