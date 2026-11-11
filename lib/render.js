import React from 'react';

// Minimal article renderer. Blank line = new block. "## " heading, "### " subheading, "- " list.
export function renderBody(text = '') {
  return text.split(/\n{2,}/).map((blk, i) => {
    const t = blk.trim();
    if (!t) return null;
    if (t.startsWith('### ')) return <h3 key={i}>{t.slice(4)}</h3>;
    if (t.startsWith('## ')) return <h2 key={i}>{t.slice(3)}</h2>;
    if (t.split('\n').every((l) => l.startsWith('- ')))
      return <ul key={i}>{t.split('\n').map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>;
    return <p key={i}>{t}</p>;
  });
}
