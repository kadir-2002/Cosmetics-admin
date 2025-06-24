import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (care_instruction: string) => void;
  height?: string; 
  backgroundColor?: string; 
  borderColor?: string; 
  borderRadius?: string; 
  borderWidth?: string;
  fontFamily?: string; 
  fontSize?: string; 
}

const CareInstructionReatchTextComponent: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  height = "130px",
  backgroundColor = "#fff",
  borderColor = "#ccc",
  borderRadius = "4px",
  borderWidth = "2px",
  fontFamily = "sans-serif",
  fontSize = "16px",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
            [{ color: [] }]
          ],
        },
        placeholder: "Write Care Instruction...",
      });

      // Set initial care_instruction
      quillRef.current.clipboard.dangerouslyPasteHTML(value);

      // Listen for text changes
      quillRef.current.on("text-change", () => {
        const htmlcare_instruction = quillRef.current?.root.innerHTML || "";
        onChange(htmlcare_instruction);
      });

      // Apply custom styles to the editor's root element
      if (quillRef.current.root) {
        quillRef.current.root.style.fontFamily = fontFamily;
        quillRef.current.root.style.fontSize = fontSize;
      }
    }
  }, [fontFamily, fontSize]);

  // Sync editor when `value` changes externally
  useEffect(() => {
    if (quillRef.current) {
      const editorcare_instruction = quillRef.current.root.innerHTML;
      if (editorcare_instruction !== value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      style={{
        height: height,
        background: backgroundColor,
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius: borderRadius,
      }}
    />
  );
};

export default CareInstructionReatchTextComponent;