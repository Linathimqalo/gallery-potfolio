import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ContentBlock } from '@/content/archive';
export function Block({ block }: { block: ContentBlock }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { element.classList.add('revealed'); observer.disconnect(); } }, { threshold: 0.08 });
    element.classList.add('reveal-ready'); observer.observe(element);
    return () => observer.disconnect();
  }, []);
  let content;
  switch (block.type) {
    case 'paragraph': content = <p>{block.text}</p>; break;
    case 'heading': content = <h3>{block.text}</h3>; break;
    case 'list': content = <ul>{block.items.map(item => <li key={item}>{item}</li>)}</ul>; break;
    case 'numberedList': content = <ol>{block.items.map(item => <li key={item}>{item}</li>)}</ol>; break;
    case 'table': content = <figure className="table-block"><table><thead><tr>{block.headers.map((header, i) => <th key={i}>{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></figure>; break;
    case 'quote': content = <blockquote><span className="mono block-label">Excerpt</span><p>{block.text}</p></blockquote>; break;
    case 'code': content = <CodeBlock code={block.code} language={block.language} />; break;
    case 'diagram': content = <figure className="diagram"><figcaption className="mono block-label">Architecture / schematic</figcaption><pre tabIndex={0}>{block.code}</pre></figure>; break;
    case 'callout': content = <aside className="lesson"><span className="mono block-label">Key lesson</span><p>{block.text}</p></aside>; break;
    case 'image': content = <figure><img className="content-image" src={block.src} alt={block.alt} loading="lazy" />{block.caption && <figcaption className="image-caption">{block.caption}</figcaption>}</figure>; break;
  }
  return <div ref={ref} className="content-block">{content}</div>;
}
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [state, setState] = useState('Copy');
  useEffect(() => { if (state === 'Copy') return; const timer = setTimeout(() => setState('Copy'), 2000); return () => clearTimeout(timer); }, [state]);
  return <div className="code-block"><div className="code-toolbar"><span className="mono">{language}</span><Button variant="archive" className="copy-button" aria-label="Copy code" onClick={async () => { try { await navigator.clipboard.writeText(code); setState('Copied'); } catch { setState('Unavailable'); } }}>{state}</Button><span className="sr-only" role="status">{state === 'Copied' ? 'Code copied to clipboard' : ''}</span></div><pre tabIndex={0}><code>{code}</code></pre></div>;
}
