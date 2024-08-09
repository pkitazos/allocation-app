"use client";
import { JSX } from "react";
import MDEditor, { MDEditorProps } from "@uiw/react-md-editor";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkMath from "remark-math";

export function Editor(props: JSX.IntrinsicAttributes & MDEditorProps) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
      />
      <MDEditor
        {...props}
        commands={[]}
        previewOptions={{
          remarkPlugins: [[remarkMath]],
          rehypePlugins: [[rehypeSanitize], [rehypeKatex]],
        }}
      />
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Renderer({ source }: { source: string }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
      />
      <MDEditor.Markdown
        source={source}
        remarkPlugins={[[remarkMath]]}
        rehypePlugins={[[rehypeSanitize], [rehypeKatex]]}
      />
    </>
  );
}
