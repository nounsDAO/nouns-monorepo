"use client";

import config from "@/config";
import ClaudeLogo from "@/public/images/ai/claude.svg?react";
import ChatGPTLogo from "@/public/images/ai/openai.svg?react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon, ClipboardCheckIcon, CopyIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "nextra/components";
import { FC, useState } from "react";

export interface AskAIProps {
  prompt?: string;
}

export const AskAI: FC<AskAIProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const plaintextUri = `${config.baseUri}${pathname}.txt`;

  const handleCopyPageContent = async () => {
    try {
      const currentPath = window.location.pathname;
      const txtUrl = `${currentPath}.txt`;

      const response = await fetch(txtUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status}`);
      }

      const content = await response.text();
      await navigator.clipboard.writeText(content);

      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error("Failed to copy page content:", error);
    }
  };

  return (
    <div className="flex">
      <a
        href={`https://chatgpt.com/?q=${encodeURIComponent(
          prompt ??
            `Please research and analyze this page: ${plaintextUri} so I can ask you questions about it. Once you have read it, prompt me with any questions I have. Do not post content from the page in your response. Any of my follow up questions must be answered by referencing the site I provided (including other pages from the same website).`,
        )}`}
        target="_blank"
        rel="noopener"
        className={
          "border-border rounded-l-full px-2 !no-underline flex items-center justify-center gap-1.5 text-xs border"
        }
      >
        <ChatGPTLogo className="size-6 align-middle -m-1" /> Ask ChatGPT
      </a>
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          className="!rounded-r-full h-full !border-l-0 !pr-2"
        >
          {copied ? (
            <ClipboardCheckIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </MenuButton>
        <MenuItems
          anchor="bottom"
          className="border border-border rounded-sm mt-1 divide-y divide-divide"
        >
          <MenuItem
            as="a"
            target="_blank"
            rel="noopener"
            href={`https://claude.ai/new?q=${encodeURIComponent(
              prompt ??
                `Please use this page to answer my questions: ${plaintextUri}. You must read it before you answer me.

`,
            )}`}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left data-focus:bg-blue-100"
          >
            <ClaudeLogo className="w-4 h-4" />
            Ask Claude
          </MenuItem>
          <MenuItem
            as={"button"}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left data-focus:bg-blue-100"
            onClick={handleCopyPageContent}
          >
            <CopyIcon className="w-4 h-4" />
            Copy page for LLMs
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};
