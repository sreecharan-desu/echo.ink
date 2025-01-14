import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, Code, Quote, Link as LinkIcon, Heading1, Heading2, Type } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2]
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px]',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const MenuButton = ({ 
    isActive, 
    onClick, 
    children,
    tooltip
  }: { 
    isActive: boolean; 
    onClick: () => void; 
    children: React.ReactNode;
    tooltip: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      className={`p-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-black text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <div className="flex items-center gap-1 pr-2 border-r">
          <MenuButton
            isActive={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            tooltip="Heading 1"
          >
            <Heading1 size={18} />
          </MenuButton>
          <MenuButton
            isActive={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            tooltip="Heading 2"
          >
            <Heading2 size={18} />
          </MenuButton>
          <MenuButton
            isActive={editor.isActive('paragraph')}
            onClick={() => editor.chain().focus().setParagraph().run()}
            tooltip="Normal Text"
          >
            <Type size={18} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r">
          <MenuButton
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            tooltip="Bold"
          >
            <Bold size={18} />
          </MenuButton>
          <MenuButton
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            tooltip="Italic"
          >
            <Italic size={18} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r">
          <MenuButton
            isActive={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            tooltip="Bullet List"
          >
            <List size={18} />
          </MenuButton>
          <MenuButton
            isActive={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            tooltip="Quote"
          >
            <Quote size={18} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1">
          <MenuButton
            isActive={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
            tooltip="Code"
          >
            <Code size={18} />
          </MenuButton>
          <MenuButton
            isActive={editor.isActive('link')}
            onClick={() => {
              const url = window.prompt('Enter URL');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            tooltip="Add Link"
          >
            <LinkIcon size={18} />
          </MenuButton>
        </div>
      </div>

      <EditorContent editor={editor} />

      <style>{`
        .ProseMirror {
          padding: 1rem;
        }
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 1em 0 0.5em;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 1em 0 0.5em;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #e2e8f0;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
        }
        .ProseMirror code {
          background-color: #f1f5f9;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor; 