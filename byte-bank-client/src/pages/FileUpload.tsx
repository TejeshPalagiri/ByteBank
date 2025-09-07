import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Trash2, Folder, Eye, CloudUploadIcon } from "lucide-react";
import { IFile } from "@/interfaces/File";
import { IFolder } from "@/interfaces/Folder";

import * as FileService from "../services/rest/file.service";
import * as FolderService from "../services/rest/folder.service";
import UploadDialog from "./UploadDialog";

const placeHolderImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"

export default function FileUpload() {
    const [searchTerm, setSearchTerm] = useState("");
    const [files, setFiles] = useState<IFile[]>([]);
    const [folders, setFolders] = useState<IFolder[]>([]);
    const [, setCurrentPath] = useState<string>("");
    const [currentFolder, setCurrentFolder] = useState<string>("");
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        // Fetch files and folders from the server
        const fetchFilesAndFolders = async () => {
            try {
                const filesData = await FileService.getAllFiles(currentFolder);
                const foldersData = await FolderService.getAllFolders(currentFolder);
                setFiles(filesData?.data || []);
                setFolders(foldersData?.data || []);
            } catch (error) {
                console.error("Error fetching files and folders:", error);
            }
        };
        fetchFilesAndFolders();
    }, [currentFolder, refresh]);

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFolders = folders.filter((folder) =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteFile = async (fileId: string) => {
        try {
            await FileService.deleteFile(fileId);
            setRefresh((prev) => !prev); // Trigger a refresh after deletion
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    return (
        <div className="w-full p-6 bg-gray-900 text-white min-h-screen">
            <div className="flex items-center gap-4 mb-6">
                <Input
                    type="text"
                    placeholder="Search files and folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded"
                />
                <Button variant="outline" className="flex items-center gap-2" onClick={ () =>  setIsUploadOpen(true) }>
                    <CloudUploadIcon size={16} /> Upload
                </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredFolders.map((folder) => (
                    <div
                        key={folder._id}
                        onClick={() => {
                            setCurrentFolder(folder._id);
                            setCurrentPath((prev) => `${prev}/${folder.name}`);
                        }}
                        className="p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition cursor-pointer flex flex-col items-center justify-center"
                    >
                        <Folder className="w-12 h-12 text-yellow-400" />
                        <p className="mt-2 text-center text-sm truncate w-full">
                            {folder.name}
                        </p>
                    </div>
                ))}
                {filteredFiles.map((file) => (
                    <div
                        key={file._id}
                        className="p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition cursor-pointer flex flex-col items-center justify-center"
                    >
                        <div className=" flex items-center justify-center mt-2 text-center text-sm truncate w-full">
                            {file.mimeType.startsWith("image/") ? (
                                <img
                                    src={ placeHolderImage || file?.thumbnail || file?.signedUrl}
                                    alt={file.name}
                                    className="w-12 h-12 object-cover rounded"
                                    loading="lazy"
                                />
                            ) : (
                                <FileText className="w-12 h-12 text-blue-400" />
                            )}
                        </div>
                        <p className="mt-2 text-center text-sm truncate w-full">
                            {file.name}
                        </p>
                        <div className="flex space-x-2 mt-2">
                            <Button
                                size="icon"
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => deleteFile(file._id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                    window.open(file.signedUrl, "_blank");
                                }}
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                            {/* <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                    // download file logic here
                                    const link = document.createElement("a");
                                    link.href = file.signedUrl;
                                    link.setAttribute("download", file.name);
                                    document.body.appendChild(link);
                                    link.click();
                                    link.target = "_blank";
                                    document.body.removeChild(link);
                                }}
                            >
                                <DownloadCloud className="w-4 h-4" />
                            </Button> */}
                        </div>
                    </div>
                ))}
            </div>
            {filteredFiles.length === 0 && filteredFolders.length === 0 && (
                <p className="col-span-full text-center text-gray-500 mt-4">
                    No files or folders found
                </p>
            )}
            <div className="p-6">
                <UploadDialog open={isUploadOpen} setOpen={setIsUploadOpen} currentFolder={currentFolder} setRefresh={setRefresh} />
            </div>
        </div>
    );
}
