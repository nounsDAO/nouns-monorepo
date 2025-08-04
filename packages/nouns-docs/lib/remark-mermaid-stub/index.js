// No-op remark plugin to replace remark-mermaid
export function remarkMermaid() {
  return () => {
    // Do nothing - this disables mermaid processing
  };
}
