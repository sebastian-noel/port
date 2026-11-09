import { execFileSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const { GITHUB_SHA, VERCEL_TOKEN, VERCEL_AUTOMATION_BYPASS_SECRET } =
  process.env;
const teamId = "team_TxTSxeGthy7LfQyxFezxTUCG";
const projectId = "prj_ed3pe2gKchWMJyvwf7E3RSSHaJ81";
const domain = "snoel.dev";

function isCurrentMain() {
  const head = execFileSync(
    "git",
    ["ls-remote", "--exit-code", "origin", "refs/heads/main"],
    { encoding: "utf8" },
  ).split("\t")[0];
  if (head === GITHUB_SHA) return true;
  console.log("This commit is no longer at the tip of main. Skipping release.");
  return false;
}

async function vercel(path, params = {}, method = "GET") {
  const url = new URL(path, "https://api.vercel.com");
  url.search = new URLSearchParams({ teamId, ...params }).toString();
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: method === "POST" ? "{}" : undefined,
    redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(
      `Vercel ${method} ${path} failed (HTTP ${response.status})`,
    );
  }
  if (method === "GET") return response.json();
}

async function waitFor(description, timeout, check) {
  const deadline = Date.now() + timeout;
  do {
    const result = await check();
    if (result) return result;
    await sleep(3000);
  } while (Date.now() < deadline);
  throw new Error(`Timed out waiting for ${description}`);
}

function matchesMain(deployment) {
  return (
    deployment.target === "production" &&
    deployment.meta?.githubCommitRef === "main" &&
    deployment.meta.githubCommitSha === GITHUB_SHA
  );
}

async function stagedBuild() {
  const listing = await vercel("/v7/deployments", {
    projectId,
    target: "production",
    branch: "main",
    sha: GITHUB_SHA,
    limit: "10",
  });
  const candidate = listing.deployments.find(matchesMain);
  if (!candidate) return;
  const state = candidate.readyState ?? candidate.state;
  if (["ERROR", "CANCELED", "BLOCKED"].includes(state)) {
    throw new Error(`The Vercel build for this commit is ${state}`);
  }
  if (state !== "READY") return;
  if (!/^port-[a-z0-9]+-sebastian-noel\.vercel\.app$/.test(candidate.url)) {
    throw new Error("Unexpected production deployment hostname");
  }
  const deployment = await vercel(`/v13/deployments/${candidate.url}`);
  if (
    deployment.projectId !== projectId ||
    deployment.url !== candidate.url ||
    deployment.readyState !== "READY" ||
    !matchesMain(deployment) ||
    !/^dpl_[a-zA-Z0-9]+$/.test(deployment.id)
  ) {
    throw new Error("Deployment does not match the verified main build");
  }
  return deployment;
}

async function smoke(origin, headers = {}) {
  const checks = [
    ["/", "text/html", "Sebastian Noel"],
    ["/projects/permanence", "text/html", "Permanence"],
    ["/experiences", "text/html", "Experiences"],
    ["/resume.pdf", "application/pdf", "%PDF-"],
  ];
  for (const [path, type, expected] of checks) {
    const url = new URL(path, origin);
    const response = await fetch(url, {
      headers,
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    if (
      response.status !== 200 ||
      !response.headers.get("content-type")?.startsWith(type) ||
      !(await response.text()).includes(expected)
    ) {
      throw new Error(
        `Smoke check failed for ${url} (HTTP ${response.status})`,
      );
    }
    console.log(`Passed ${url}`);
  }
}

async function currentDeploymentId() {
  const alias = await vercel(`/v4/aliases/${domain}`, { projectId });
  if (alias.projectId !== projectId) {
    throw new Error("The production domain belongs to a different project");
  }
  return alias.deploymentId;
}

async function release() {
  if (!isCurrentMain()) return;
  if (!VERCEL_TOKEN || !VERCEL_AUTOMATION_BYPASS_SECRET) {
    throw new Error("Add both Vercel secrets to the production environment");
  }
  const deployment = await waitFor(
    "the staged main build",
    300000,
    stagedBuild,
  );
  await smoke(`https://${deployment.url}`, {
    "x-vercel-protection-bypass": VERCEL_AUTOMATION_BYPASS_SECRET,
  });
  if ((await currentDeploymentId()) !== deployment.id) {
    if (!isCurrentMain()) return;
    await vercel(
      `/v10/projects/${projectId}/promote/${deployment.id}`,
      {},
      "POST",
    );
    await waitFor("the production domain to switch", 90000, async () => {
      return (await currentDeploymentId()) === deployment.id;
    });
  }
  await smoke(`https://${domain}`);
  console.log(`${domain} serves ${GITHUB_SHA} on ${deployment.id}`);
}

await release();
