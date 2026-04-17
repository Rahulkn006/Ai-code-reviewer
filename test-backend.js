const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function testGithubApi() {
  console.log("Testing GitHub API...");
  const res = await fetch("http://localhost:3000/api/github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://github.com/shadcn-ui/ui" })
  });
  const data = await res.json();
  console.log("GitHub API Status:", res.status);
  console.log("GitHub API returned", data.code ? `${data.code.length} chars` : data.error);
}

const prisma = new PrismaClient();

async function main() {
  await testGithubApi();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
