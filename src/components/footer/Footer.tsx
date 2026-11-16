import React from "react";

import ModelSelector from "../model-selector";
import NoticeChip from "./NoticeChip";
import TranscriptionStatus from "./TranscriptionStatus";

interface FooterProps {
  onShowHistory: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowHistory }) => {
  return (
    <div className="mt-3 flex flex-col rounded-xl border border-border bg-background text-[11.5px] text-muted-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.03)]">
      <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-2.5">
        <ModelSelector />
        <NoticeChip />
      </div>
      <div className="border-t border-border px-3 py-2 empty:hidden">
        <TranscriptionStatus onShowHistory={onShowHistory} />
      </div>
    </div>
  );
};

export default Footer;
