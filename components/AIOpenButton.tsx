import type React from "react";

import { ChevronDown, MessageCircleIcon } from "lucide-react";

import { Icons } from "@/components/Icons";
import { Button } from "@/shadcn/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";

const getPromptUrl = (baseUrl: string, url: string) => {
    return `${baseUrl}?q=${encodeURIComponent(`Help me use this Shadix UI component: ${url}. Explain, show examples, and debug if needed.
`)}`;
};

const menuItems = {
    v0: (url: string) => (
        <a
            href={getPromptUrl("https://v0.dev", url)}
            target="_blank"
            rel="noopener noreferrer"
        >
            <Icons.v0 />
            <span>Open in v0</span>
        </a>
    ),
    claude: (url: string) => (
        <a
            href={getPromptUrl("https://claude.ai/new", url)}
            target="_blank"
            rel="noopener noreferrer"
        >
            <Icons.claude />
            <span>Open in Claude</span>
        </a>
    ),
    chatgpt: (url: string) => (
        <a
            href={getPromptUrl("https://chatgpt.com", url)}
            target="_blank"
            rel="noopener noreferrer"
        >
            <Icons.chatgpt />
            <span>Open in ChatGPT</span>
        </a>
    ),
    scira: (url: string) => (
        <a
            href={getPromptUrl("https://scira.ai", url)}
            target="_blank"
            rel="noopener noreferrer"
        >
            <Icons.scira />
            <span>Open in Scira AI</span>
        </a>
    ),
    t3: (url: string) => (
        <a
            href={getPromptUrl("https://t3.ai", url)}
            target="_blank"
            rel="noopener noreferrer"
        >
            <MessageCircleIcon />
            <span>Open in T3 Chat</span>
        </a>
    ),
};

const AIOpenButton: React.FC<AIOpenButtonProps> = ({ url }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size={"sm"}
                    variant={"secondary"}
                    className="extend-touch-target ml-auto shadow-none h-8 md:h-7"
                >
                    Open
                    <ChevronDown />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuGroup>
                    {Object.entries(menuItems).map(([key, value]) => (
                        <DropdownMenuItem key={key} asChild>
                            {value(url)}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

interface AIOpenButtonProps {
    url: string;
}

export { AIOpenButton };
