import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default function MarkdownBody({ source }: { source: string }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ]}
        components={{
          h2: ({ children, ...props }) => (
            <h2
              {...props}
              className="text-3xl font-bold mt-12 mb-4 text-foreground scroll-mt-24"
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              {...props}
              className="text-2xl font-bold mt-8 mb-3 text-foreground scroll-mt-24"
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-muted leading-relaxed mb-5 text-lg">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 mb-6 pl-6 list-disc text-muted text-lg">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 mb-6 pl-6 list-decimal text-muted text-lg">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-primary hover:text-primary-light underline underline-offset-2"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-6 italic text-muted my-6 text-lg">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block bg-background border border-surface-light rounded-lg p-4 overflow-x-auto text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-background px-1.5 py-0.5 rounded text-sm font-mono text-primary">
                {children}
              </code>
            );
          },
          hr: () => <hr className="my-10 border-surface-light" />,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
