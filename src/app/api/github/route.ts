import { NextResponse } from "next/server";
import { Octokit } from "octokit";

// Helper to filter relevant code files
const isCodeFile = (path: string) => {
  const codeExtensions = [".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".cpp", ".c", ".go", ".rs", ".rb", ".php", ".cs", ".swift", ".kt", ".json"];
  return codeExtensions.some(ext => path.endsWith(ext));
};

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes("github.com")) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    // Extract owner and repo from URL
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      return NextResponse.json({ error: "Could not parse owner and repository" }, { status: 400 });
    }

    const owner = match[1];
    let repo = match[2];
    
    // Remove .git if present
    if (repo.endsWith(".git")) repo = repo.slice(0, -4);

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN || process.env.GITHUB_SECRET, // optional but helps with rate limits
    });

    // 1. Get the default branch
    const { data: repoData } = await octokit.rest.repos.get({
      owner,
      repo,
    });
    
    const defaultBranch = repoData.default_branch;

    // 2. Get the tree of the default branch recursively
    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: defaultBranch,
      recursive: "true",
    });

    // 3. Filter for code files and limit to prevent massive payloads
    const files = treeData.tree
      .filter((file) => file.type === "blob" && file.path && !file.path.includes("node_modules") && !file.path.includes("dist") && isCodeFile(file.path))
      .slice(0, 15);

    if (files.length === 0) {
      return NextResponse.json({ error: "No relevant code files found in the repository" }, { status: 404 });
    }

    // 4. Fetch content for each file sequentially or in batches (use Promise.all for speed)
    let concatenatedCode = "";

    await Promise.all(
      files.map(async (file) => {
        try {
          const { data: fileData } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: file.path!,
          });

          if (!Array.isArray(fileData) && fileData.type === "file" && "content" in fileData) {
            const content = Buffer.from(fileData.content, "base64").toString("utf8");
            concatenatedCode += `\n\n--- File: ${file.path} ---\n\n${content}`;
          }
        } catch (err) {
          console.error(`Failed to fetch ${file.path}`, err);
        }
      })
    );

    // Limit the overall size of concatenated code if necessary (OpenAI tokens limit)
    // Roughly 4 chars = 1 token. GPT-4o supports 128k context, but let's limit safely to 100k chars for now.
    if (concatenatedCode.length > 100000) {
      concatenatedCode = concatenatedCode.slice(0, 100000) + "\n\n... [TRUNCATED DUE TO SIZE]";
    }

    return NextResponse.json({ code: concatenatedCode.trim() });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("GitHub API error:", error);
    return NextResponse.json({ error: "Failed to fetch repository data or rate limit exceeded: " + errorMessage }, { status: 500 });
  }
}
