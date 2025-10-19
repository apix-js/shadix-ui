// lib/github-roles.ts
export interface GitHubRole {
    role: "maintainer" | "contributor" | "collaborator" | "member";
    permissions?: string[];
}

export async function detectUserRole(
    username: string,
    repoOwner: string,
    repoName: string,
): Promise<GitHubRole> {
    try {
        // Check if user is a collaborator
        const collaboratorResponse = await fetch(
            `https://api.github.com/repos/${repoOwner}/${repoName}/collaborators/${username}`,
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json",
                    "User-Agent": "shadix-ui/1.0",
                },
            },
        );

        if (collaboratorResponse.ok) {
            const collaboratorData = await collaboratorResponse.json();
            return {
                role: "collaborator",
                permissions: collaboratorData.permissions,
            };
        }

        // Check if user is a member of the organization
        const memberResponse = await fetch(
            `https://api.github.com/orgs/${repoOwner}/members/${username}`,
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json",
                    "User-Agent": "shadix-ui/1.0",
                },
            },
        );

        if (memberResponse.ok) {
            return { role: "member" };
        }

        // Check contribution count to determine if they're a significant contributor
        const contributionsResponse = await fetch(
            `https://api.github.com/search/issues?q=author:${username}+repo:${repoOwner}/${repoName}+type:pr`,
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json",
                    "User-Agent": "shadix-ui/1.0",
                },
            },
        );

        if (contributionsResponse.ok) {
            const contributionsData = await contributionsResponse.json();
            if (contributionsData.total_count > 10) {
                return { role: "contributor" };
            }
        }

        return { role: "contributor" };
    } catch (error) {
        console.error("Error detecting user role:", error);
        return { role: "contributor" };
    }
}

export const getUsernameFromUrl = (url: string): string | null => {
    const match = url.match(/github\.com\/([^/]+)/);
    return match ? match[1] : null;
};

export const getRoleBadgeColor = (role: string) => {
    switch (role) {
        case "maintainer":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
        case "collaborator":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case "member":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
};
