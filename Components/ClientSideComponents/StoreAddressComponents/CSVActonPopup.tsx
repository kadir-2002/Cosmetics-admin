import React, { useRef } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  onClose: () => void;
  selectedFileName: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCsvFileUpload: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectFiledownload: string;
}

const CSVActionPopup: React.FC<Props> = ({
  onClose,
  selectedFileName,
  handleFileChange,
  handleCsvFileUpload,
  fileInputRef,
  selectFiledownload,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <AiOutlineClose size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">CSV Actions</h2>

        <div className="border-2 border-dashed border-blue-500 p-6 rounded-lg text-center bg-blue-50">
          <FiUpload size={36} className="mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600 mb-2">Drag & Drop your files here</p>
          <p className="text-gray-500 mb-4">or</p>

          <label className="inline-block bg-[#61BAB0] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#61BAB0]transition">
            Browse Files
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </label>

          {selectedFileName && (
            <div className="mt-4 bg-green-100 p-2 rounded text-sm text-green-800 flex items-center justify-between">
              <span>{selectedFileName}</span>
              <FiX
                className="cursor-pointer text-red-500"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  handleFileChange({ target: { files: null } } as any); 
                }}
              />

            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {selectedFileName && (
            <button
              onClick={handleCsvFileUpload}
              className="bg-[#61BAB0] text-white py-2 rounded hover:bg-[#61BAB0]"
            >
              Submit
            </button>
          )}


          {selectFiledownload ? (
            <a
              href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${selectFiledownload}`}
              download="stores-sample.xlsx"
              className="bg-red-600 text-white text-center py-2 rounded hover:bg-red-700"
            >
              Download Error File
            </a>
          ) : (
            <a
              href="/stores-sample.xlsx"
              download="stores-sample.xlsx"
              className="bg-[#61BAB0] text-white text-center py-2 rounded hover:bg-[#83bdb6]"
            >
              Download File Format
            </a>
          )}


        </div>
      </div>
    </div>
  );
}

export default CSVActionPopup;
