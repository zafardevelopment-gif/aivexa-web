"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import {
  Card,
  TextArea,
  TabGroup,
  CopyButton,
  ResultBox,
  ResultRow,
} from "@/components/tools/ToolUI";
import FileDropzone from "@/components/tools/FileDropzone";
import { formatBytes } from "@/components/tools/imageUtils";

export default function ToBase64Tool() {
  const [dataUrl, setDataUrl] = useState("");
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [variant, setVariant] = useState("raw");
  const [error, setError] = useState("");

  function onFiles(files: File[]) {
    const f = files[0];
    setError("");
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDataUrl(String(reader.result));
      setFileInfo({ name: f.name, size: f.size });
    };
    reader.onerror = () => setError("Could not read the file.");
    reader.readAsDataURL(f);
  }

  const output =
    variant === "css"
      ? `background-image: url("${dataUrl}");`
      : variant === "html"
        ? `<img src="${dataUrl}" alt="" />`
        : dataUrl;

  return (
    <ToolPageLayout
      title="Image to Base64"
      description="Turn any image into a Base64 data URL, CSS rule or HTML tag — right in your browser."
      categoryHref="/tools/image"
      categoryName="Image Tools"
    >
      <Card>
        <FileDropzone accept="image/*" onFiles={onFiles} />

        {error && (
          <p style={{ color: "#b91c1c", marginTop: ".5rem", fontSize: ".9rem" }}>{error}</p>
        )}

        {dataUrl && fileInfo && (
          <>
            <TabGroup
              options={[
                { value: "raw", label: "Data URL" },
                { value: "css", label: "CSS background" },
                { value: "html", label: "HTML <img>" },
              ]}
              value={variant}
              onChange={setVariant}
            />
            <TextArea readOnly value={output} style={{ minHeight: 180, fontSize: ".8rem" }} />
            <div style={{ display: "flex", gap: ".6rem", marginTop: ".8rem" }}>
              <CopyButton text={output} label="Copy to clipboard" />
            </div>

            <ResultBox>
              <ResultRow label="File" value={fileInfo.name} />
              <ResultRow label="Original size" value={formatBytes(fileInfo.size)} />
              <ResultRow label="Base64 length" value={`${dataUrl.length.toLocaleString()} chars`} />
              <ResultRow
                label="Base64 size"
                value={formatBytes(new Blob([dataUrl]).size)}
              />
            </ResultBox>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt="Preview"
              style={{
                maxWidth: "220px",
                maxHeight: "220px",
                marginTop: "1.2rem",
                borderRadius: "10px",
                border: "1px solid var(--border)",
              }}
            />
          </>
        )}
      </Card>
    </ToolPageLayout>
  );
}
