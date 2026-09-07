import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  active?: boolean;
  label: string;
  name: string;
  onClick: () => void;
}

function ToolbarButton({ active, label, name, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={name}
      aria-pressed={active}
      className={`cursor-pointer rounded px-2 py-1 text-xs font-bold ${
        active
          ? 'bg-sage text-ink'
          : 'text-muted hover:bg-sage hover:text-ink'
      }`}
    >
      {label}
    </button>
  );
}

export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Escribí el contenido del post…',
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        defaultProtocol: 'https',
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor: next }) => {
      onChange(next.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'rich-text min-h-36 px-3 py-2 text-sm text-copy outline-none',
        'aria-label': label,
        role: 'textbox',
        'aria-multiline': 'true',
      },
    },
  });

  function setLink(): void {
    if (!editor) {
      return;
    }

    const previous = String(editor.getAttributes('link').href ?? '');
    const next = window.prompt('URL del enlace', previous);

    if (next === null) {
      return;
    }

    if (next.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: next.trim() })
      .run();
  }

  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-1 border-0 p-0">
      <legend className="px-0 text-xs font-bold uppercase tracking-wide text-muted">
        {label}
      </legend>
      <div className="overflow-hidden rounded border border-line bg-white focus-within:border-brand-text focus-within:ring-1 focus-within:ring-brand-text">
        <div
          role="toolbar"
          aria-label="Formato del contenido"
          className="flex flex-wrap gap-0.5 border-b border-line bg-sage px-1 py-1"
        >
          <ToolbarButton
            label="B"
            name="Negrita"
            active={editor?.isActive('bold')}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            label="I"
            name="Cursiva"
            active={editor?.isActive('italic')}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            label="U"
            name="Subrayado"
            active={editor?.isActive('underline')}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          />
          <ToolbarButton
            label="S"
            name="Tachado"
            active={editor?.isActive('strike')}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          />
          <ToolbarButton
            label="H2"
            name="Título"
            active={editor?.isActive('heading', { level: 2 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          />
          <ToolbarButton
            label="Lista"
            name="Lista con viñetas"
            active={editor?.isActive('bulletList')}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            label="1."
            name="Lista numerada"
            active={editor?.isActive('orderedList')}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            label="Cita"
            name="Cita"
            active={editor?.isActive('blockquote')}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            label="Código"
            name="Código"
            active={editor?.isActive('code')}
            onClick={() => editor?.chain().focus().toggleCode().run()}
          />
          <ToolbarButton
            label="Link"
            name="Enlace"
            active={editor?.isActive('link')}
            onClick={setLink}
          />
        </div>
        <EditorContent editor={editor} />
      </div>
    </fieldset>
  );
}
