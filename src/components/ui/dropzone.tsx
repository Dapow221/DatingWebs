import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface FileWithPreview extends File {
  preview: string;
}

const Test: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { getRootProps:getRootfileProps, getInputProps:getInputfileProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles: File[]) => {
      const filesWithPreview = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles(filesWithPreview);
    },
  });

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <>
      <div
        {...getRootfileProps()}
        className={`flex flex-col items-center p-5 border-2 border-dashed bg-gray-100 text-gray-500 outline-none transition-border duration-150 ease-in-out`}
      >
        <input {...getInputfileProps()} />
        <span className="text-sm">Drop hero image here, or click to select file</span>
      </div>

      {files.map((file, index) => (
        <div key={index} className="my-2">
          <img
            className="w-full h-auto max-w-xl"
            src={file.preview}
          />
        </div>
      ))}
    </>
  );
};

export default Test;
