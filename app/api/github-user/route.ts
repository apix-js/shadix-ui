// app/api/github-user/route.ts
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
        return NextResponse.json(
            { error: "Username is required" },
            { status: 400 },
        );
    }

    try {
        // Fetch user data
        const userResponse = await fetch(
            `https://api.github.com/users/${username}`,
            {
                headers: {
                    Authorization: `token ${process.env.NEXT_GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json",
                    "User-Agent": "shadix-ui/1.0",
                },
            },
        );

        if (!userResponse.ok) {
            return NextResponse.json(
                { error: "Failed to fetch user data" },
                { status: userResponse.status },
            );
        }

        const userData = await userResponse.json();

        // Fetch contribution data (commits, PRs, issues)
        const [commitsResponse, prsResponse, issuesResponse, reposResponse] =
            await Promise.all([
                // Count commits by searching for commits authored by the user
                fetch(
                    `https://api.github.com/search/commits?q=author:${username}+repo:apix-js/shadix-ui`,
                    {
                        headers: {
                            Authorization: `token ${process.env.NEXT_GITHUB_TOKEN}`,
                            Accept: "application/vnd.github.v3+json",
                            "User-Agent": "shadix-ui/1.0",
                        },
                    },
                ),
                // Count Pull Requests
                fetch(
                    `https://api.github.com/search/issues?q=author:${username}+repo:apix-js/shadix-ui+type:pr`,
                    {
                        headers: {
                            Authorization: `token ${process.env.NEXT_GITHUB_TOKEN}`,
                            Accept: "application/vnd.github.v3+json",
                            "User-Agent": "shadix-ui/1.0",
                        },
                    },
                ),
                // Count Issues
                fetch(
                    `https://api.github.com/search/issues?q=author:${username}+repo:apix-js/shadix-ui+type:issue`,
                    {
                        headers: {
                            Authorization: `token ${process.env.NEXT_GITHUB_TOKEN}`,
                            Accept: "application/vnd.github.v3+json",
                            "User-Agent": "shadix-ui/1.0",
                        },
                    },
                ),
                fetch(
                    `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`,
                    {
                        headers: {
                            Authorization: `token ${process.env.NEXT_GITHUB_TOKEN}`,
                            Accept: "application/vnd.github.v3+json",
                            "User-Agent": "shadix-ui/1.0",
                        },
                    },
                ),
            ]);

        const commitsData = commitsResponse.ok
            ? await commitsResponse.json()
            : { total_count: 0 };
        const prsData = prsResponse.ok
            ? await prsResponse.json()
            : { total_count: 0 };
        const issuesData = issuesResponse.ok
            ? await issuesResponse.json()
            : { total_count: 0 };
        const reposData = reposResponse.ok ? await reposResponse.json() : [];

        // Calculate total contributions (commits + PRs + issues)
        const totalContributions =
            commitsData.total_count +
            prsData.total_count +
            issuesData.total_count;

        return NextResponse.json({
            user: userData,
            contributions: totalContributions,
            commits: commitsData.total_count,
            pullRequests: prsData.total_count,
            issues: issuesData.total_count,
            recentRepos: reposData.slice(0, 3),
        });
    } catch (error) {
        console.error("GitHub API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
