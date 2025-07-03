import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useCallback } from 'react'

// Tiptap Extensions
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'

// Lowlight and highlight.js for Code Block Syntax Highlighting
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';

// Custom Components & Icons
import CodeBlockComponent from './CodeBlockComponent'
import { 
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, CodeSquare, 
    Highlighter, List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight, 
    Link2, Link2Off, Subscript as SubscriptIcon, Superscript as SuperscriptIcon, 
    Image as ImageIcon, Undo, Redo 
} from 'lucide-react'
import '../prose-styles.css'; // Import the shared styles

// Configure the syntax highlighter
const lowlight = createLowlight();
lowlight.register('javascript', javascript);
lowlight.register('css', css);
lowlight.register('html', html);

const MenuBar = ({ editor }) => {
  if (!editor) return null

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])
  
  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    color: '#333',
    background: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };
  
  const activeButtonStyle = {
    ...buttonStyle,
    color: '#007bff',
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
  };
  
  const dividerStyle = { width: '1px', backgroundColor: '#ccc', alignSelf: 'stretch', margin: '4px 0.5rem' };

  return (
    <div className="menu-bar" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', border: '1px solid #ccc', padding: '0.5rem', gap: '0.25rem' }}>
        <button type="button" style={buttonStyle} onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={18} /></button>
        <button type="button" style={buttonStyle} onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={18} /></button>
        
        <div style={dividerStyle}></div>

        <select onChange={e => {
            const value = e.target.value;
            if (value == 0) editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: parseInt(value) }).run();
        }} style={{border: '1px solid #ccc', borderRadius: '4px', padding: '0.25rem'}}>
            <option value="0">Paragraph</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
        </select>
        
        <div style={dividerStyle}></div>
        
        <button type="button" style={editor.isActive('bold') ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold size={18} /></button>
        <button type="button" style={editor.isActive('italic') ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic size={18} /></button>
        <button type="button" style={editor.isActive('underline') ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><UnderlineIcon size={18} /></button>
        <button type="button" style={editor.isActive('strike') ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough"><Strikethrough size={18} /></button>
        <button type="button" style={editor.isActive('code') ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline Code"><Code size={18} /></button>
        <button type="button" style={editor.isActive('codeBlock') ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code Block"><CodeSquare size={18} /></button>
        <button type="button" style={editor.isActive('highlight') ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight"><Highlighter size={18} /></button>
        <button type="button" style={editor.isActive('subscript') ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().toggleSubscript().run()} title="Subscript"><SubscriptIcon size={18} /></button>
        <button type="button" style={editor.isActive('superscript') ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().toggleSuperscript().run()} title="Superscript"><SuperscriptIcon size={18} /></button>
        
        <div style={dividerStyle}></div>

        <button type="button" style={editor.isActive('bulletList') ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List"><List size={18} /></button>
        <button type="button" style={editor.isActive('orderedList') ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List"><ListOrdered size={18} /></button>
        <button type="button" style={editor.isActive('blockquote') ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote"><Quote size={18} /></button>
        
        <div style={dividerStyle}></div>

        <button type="button" style={editor.isActive({ textAlign: 'left' }) ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft size={18} /></button>
        <button type="button" style={editor.isActive({ textAlign: 'center' }) ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter size={18} /></button>
        <button type="button" style={editor.isActive({ textAlign: 'right' }) ? activeButtonStyle : buttonStyle} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight size={18} /></button>
        
        <div style={dividerStyle}></div>

        <button type="button" style={editor.isActive('link') ? activeButtonStyle : buttonStyle} onClick={setLink}><Link2 size={18} /></button>
        <button type="button" style={buttonStyle} onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')}><Link2Off size={18} /></button>
        <button type="button" style={buttonStyle} onClick={addImage}><ImageIcon size={18} /></button>
    </div>
  )
}

const TiptapEditor = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent)
        },
      }).configure({ lowlight }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Subscript,
      Superscript,
      Image,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
        attributes: {
          class: 'ProseMirror',
        },
    },
  })

  return (
    <div>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor;