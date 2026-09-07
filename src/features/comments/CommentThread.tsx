import { useState } from 'react';
import type { CommentNode } from '../../types';
import { CommentItem } from './CommentItem';

interface CommentThreadProps {
  postId: string;
  node: CommentNode;
  depth?: number;
}

export function CommentThread({
  postId,
  node,
  depth = 0,
}: CommentThreadProps) {
  const [expanded, setExpanded] = useState(node.children.length <= 2);
  const visibleChildren = expanded ? node.children : [];

  return (
    <div
      className={
        depth === 0
          ? 'px-2 py-2'
          : 'ml-2 border-l-2 border-line pl-2 sm:ml-4 sm:pl-4'
      }
      data-depth={depth}
    >
      <CommentItem postId={postId} node={node} />
      {node.children.length > 0 && !expanded ? (
        <button
          type="button"
          className="mt-1 cursor-pointer text-xs font-bold text-brand-text hover:underline"
          onClick={() => setExpanded(true)}
          aria-expanded="false"
        >
          Ver {node.children.length}{' '}
          {node.children.length === 1 ? 'respuesta' : 'respuestas'}
        </button>
      ) : null}
      {visibleChildren.map((child) => (
        <CommentThread
          key={child.id}
          postId={postId}
          node={child}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
