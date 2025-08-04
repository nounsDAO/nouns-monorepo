'use client';

import { FC, useCallback, useState } from 'react';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon, ClipboardCheckIcon, CopyIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from 'nextra/components';

import config from '@/config';
import ClaudeLogo from '@/public/images/ai/claude.svg?react';
import ChatGPTLogo from '@/public/images/ai/openai.svg?react';

export interface AskAIProps {
  markdownUri?: string;
}

export const AskAI: FC<AskAIProps> = ({ markdownUri }) => {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const plaintextUri = markdownUri ?? `${config.baseUri}${pathname}.txt`;

  const handleCopyPageContent = useCallback(async () => {
    try {
      const txtUrl = plaintextUri ?? `${window.location.pathname}.txt`;

      const response = await fetch(txtUrl);
      if (!response.ok) {
        console.error(`Failed to fetch content from ${txtUrl}: ${response.status}`);
        return;
      }

      const content = await response.text();
      await navigator.clipboard.writeText(content);

      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error('Failed to copy page content:', error);
    }
  }, [pathname, plaintextUri]);

  return (
    <div className="flex">
      <a
        href={`https://chatgpt.com/?q=${encodeURIComponent(
          `Please research and analyze this page: ${plaintextUri} so I can ask you questions about it. Once you have read it, prompt me with any questions I have. Do not post content from the page in your response. Any of my follow up questions must be answered by referencing the site I provided (including other pages from the same website).`,
        )}`}
        target="_blank"
        rel="noopener"
        className={
          'border-border flex items-center justify-center gap-1.5 rounded-l-full border px-2 text-xs !no-underline'
        }
      >
        <ChatGPTLogo className="-m-1 size-6 align-middle" /> Ask ChatGPT
      </a>
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          className="h-full !rounded-r-full !border-l-0 !pr-2"
        >
          {copied ? (
            <ClipboardCheckIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </MenuButton>
        <MenuItems
          anchor="bottom"
          className="border-border divide-divide x:bg-nextra-bg z-30 mt-1 divide-y rounded-sm border shadow"
        >
          <MenuItem
            as="a"
            target="_blank"
            rel="noopener"
            href={`https://claude.ai/new?q=${encodeURIComponent(
              `Please use this page to answer my questions: ${plaintextUri}. You must read it before you answer me.\n\n`,
            )}`}
            className="data-focus:bg-blue-100 flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
          >
            <ClaudeLogo className="h-4 w-4" />
            Ask Claude
          </MenuItem>
          <MenuItem
            as={'button'}
            className="data-focus:bg-blue-100 flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
            onClick={handleCopyPageContent}
          >
            <CopyIcon className="h-4 w-4" />
            Copy page for LLMs
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};
