"use client";
import { useEffect, useState } from "react";
import type React from "react";

import { Github } from "lucide-react";

import { getUsernameFromUrl } from "@/lib/github";
import { Button } from "@/shadcn/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shadcn/components/ui/card";
import { Separator } from "@/shadcn/components/ui/separator";
import { Skeleton } from "@/shadcn/components/ui/skeleton";

interface GitHubUser {
    login: string;
    name: string;
    bio: string;
    avatar_url: string;
    html_url: string;
    followers: number;
    following: number;
    public_repos: number;
    created_at: string;
    company?: string;
    location?: string;
    blog?: string;
}

interface GitHubData {
    user: GitHubUser;
    contributions: number;
    role: {
        role: "maintainer" | "contributor" | "collaborator" | "member";
        permissions?: string[];
    };
}

interface AuthorCardProps {
    author: {
        name: string;
        url: string;
        image: string;
    };
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
    const [githubData, setGithubData] = useState<GitHubData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGitHubData = async () => {
            const username = getUsernameFromUrl(author.url);
            if (!username) {
                setError("Invalid GitHub URL");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `/api/github-user?username=${username}`,
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch GitHub data");
                }

                const data = await response.json();
                setGithubData(data);
            } catch (err) {
                setError("Failed to load GitHub data");
                console.error("Error fetching GitHub data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGitHubData();
    }, [author.url]);

    if (loading) {
        return (
            <>
                <h3 className="text-md font-semibold">
                    Who Developed This Component:
                </h3>
                <div className="flex flex-row items-center justify-between gap-4 py-2">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="w-32 h-4" />
                            <Skeleton className="w-24 h-3" />
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <Skeleton className="w-28 h-4" />
                        <Skeleton className="w-22 h-8" />
                    </div>
                </div>
            </>
        );
    }

    if (error || !githubData) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <picture>
                            <img
                                src={author.image}
                                alt={author.name}
                                className="h-12 w-12 rounded-full"
                            />
                        </picture>
                        <div>
                            <h3 className="font-semibold">{author.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                Author
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <a
                            href={author.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="mr-2 h-4 w-4" />
                            View on GitHub
                        </a>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <h3 className="text-md font-semibold">
                Who Developed This Component:
            </h3>
            <div className="flex flex-row items-center justify-between gap-4 py-2">
                {/* User Informations */}
                <div className="flex items-center gap-3">
                    <picture>
                        <img
                            src={githubData.user.avatar_url}
                            alt={githubData.user.name || githubData.user.login}
                            className="h-12 w-12 rounded-full"
                        />
                    </picture>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-sm">
                            {githubData.user.name || githubData.user.login}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                            @{githubData.user.login}
                        </span>
                    </div>
                </div>

                {/* User Contributions */}
                <div className="flex flex-row gap-2 items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                        {githubData.contributions} contributions
                    </span>
                    <Separator orientation="vertical" className="!h-6" />

                    <Button
                        asChild
                        className="flex-1"
                        variant={"secondary"}
                        size="sm"
                    >
                        <a
                            href={githubData.user.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="mr-2 h-4 w-4" />
                            Follow
                        </a>
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AuthorCard;
