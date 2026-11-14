import React, { useState, useEffect } from "react";
import { getVersion } from "@tauri-apps/api/app";

import ModelSelector from "../model-selector";
import UpdateChecker from "../update-checker";
import NoticeChip from "./NoticeChip";
import TranscriptionStatus from "./TranscriptionStatus";

interface FooterProps {
  onShowHistory: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowHistory }) => {
  const [version, setVersion] = useState("");

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const appVersion = await getVersion();
        setVersion(appVersion);
      } catch (error) {
        console.error("Failed to get app version:", error);
        setVersion("0.1.2");
      }
    };

    fetchVersion();
  }, []);

  return (
    <div className="mt-3 flex flex-col overflow-hidden rounded-xl border border-border bg-background text-[11.5px] text-muted-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.03)]">
      <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-2.5">
        <ModelSelector />
        <NoticeChip />
      </div>
      <div className="border-t border-border px-3 py-2 empty:hidden">
        <TranscriptionStatus onShowHistory={onShowHistory} />
      </div>
      <div className="flex min-w-0 items-center justify-between gap-2 border-t border-border px-3 py-2">
        <UpdateChecker className="min-w-0 font-mono text-[10.5px]" />
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <span className="ms-auto shrink-0 rounded-[5px] border border-border bg-muted px-1 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
          v{version}
        </span>
      </div>
    </div>
  );
};

export default Footer;
