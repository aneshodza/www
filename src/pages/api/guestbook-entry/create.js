import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = 'aneshodza';
const repo = 'guestbook';
const ref = 'heads/main';

export default async function handler(req, res) {
  try {
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: ref,
    });
    const latestCommitSha = refData.object.sha;

    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSha,
    });
    const latestTreeSha = commitData.tree.sha;

    const { data: newCommitData } = await octokit.git.createCommit({
      owner,
      repo,
      message: req.body.message,
      tree: latestTreeSha,
      parents: [latestCommitSha],
      author: {
        name: req.body.name,
        email: `${req.body.name}@guest-on-aneshodza.ch`,
      },
    });

    await octokit.git.updateRef({
      owner,
      repo,
      ref: ref,
      sha: newCommitData.sha,
    });

    res.status(200).json({ message: 'Thanks for your entry!' });
  } catch (error) {
    console.error('Git operation failed:', error);
    res.status(500).json({ error: 'Something went wrong...' });
  }
}
