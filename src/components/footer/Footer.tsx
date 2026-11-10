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
    <div className="mt-2 flex flex-col gap-2 rounded-[14px] border border-line bg-surface p-3 text-[11.5px] text-ink-2">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <ModelSelector />
        <NoticeChip />
      </div>
      <div className="flex min-w-0 items-center justify-between gap-2 border-t border-line pt-2">
        <TranscriptionStatus onShowHistory={onShowHistory} />
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <span className="shrink-0 font-mono text-[10.5px] text-ink-3">
          v{version}
        </span>
      </div>
      <UpdateChecker className="min-w-0 text-[11px]" />
    </div>
  );
};

export default Footer;
