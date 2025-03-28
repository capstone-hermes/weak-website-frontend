import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "../components/Layout";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [downloadPath, setDownloadPath] = useState<string>("");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file first",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/file/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
        
        setFileUrl(`http://localhost:8080/file/download/${data.filename}`);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to upload file",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during upload",
      });
    }
  };

  const handleDownload = async () => {
    if (!downloadPath) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a file path",
      });
      return;
    }

    try {
      window.open(`http://localhost:8080/file/retrieve?path=${downloadPath}`, '_blank');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during download",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">File Sharing</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload File</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="file" className="block mb-1">Select File:</label>
                <input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full border p-2"
                />
              </div>
              <button
                onClick={handleUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Upload
              </button>
              {fileUrl && (
                <div className="mt-4">
                  <p className="mb-2">File uploaded successfully!</p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Download Uploaded File
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* File Download Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Download File</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="downloadPath" className="block mb-1">File Path:</label>
                <input
                  id="downloadPath"
                  type="text"
                  value={downloadPath}
                  onChange={(e) => setDownloadPath(e.target.value)}
                  placeholder="Enter file path"
                  className="w-full border p-2"
                />
              </div>
              <button
                onClick={handleDownload}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FileUpload;