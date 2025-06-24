import React from "react";

type Props = {};

const FileUpload: React.FC<{
  label: string;
  helperText: string;
  uploadedFile: string | null;
  onFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
}> = ({ label, helperText, uploadedFile, onFileDrop, onFileChange, title }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className="my-10 py-14 p-6 bg-white shadow-lg rounded-lg border border-dashed border-gray-300 cursor-pointer"
      onDrop={onFileDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleFileUploadClick}
    >
      <label className="block text-center text-gray-700 font-medium">
        <p>{title}</p>
        <div className="flex flex-col justify-center items-center mb-2">
          {uploadedFile ? (
            <div className="w-[400px] mt-4 flex justify-center">
              <img
                src={uploadedFile}
                alt="Preview"
                className="max-w-full h-[200px] rounded-lg shadow-md"
              />
            </div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 10 12 15 7 10" />
            </svg>
          )}
        </div>
        <span className="block text-sm text-gray-600">{label}</span>
        <span className="block text-xs text-gray-500">{helperText}</span>
      </label>
      <input
        ref={fileInputRef} // Attach the ref to the input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
};

export default FileUpload;
