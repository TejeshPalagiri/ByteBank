import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    DownloadCloud,
    Eye,
    FileText,
    Folder,
    Trash2,
    UploadCloud,
    UploadCloudIcon,
} from "lucide-react";
import * as FileService from "../services/rest/file.service";
import * as UserService from "../services/rest/user.service";
import { IFile } from "@/interfaces/File";
import _, { set } from "lodash";
import PreviewFile from "./PreviewFile";
function FileGrid({
    files,
    onDelete,
    onNavigate,
    currentPath,
    onNavigateBack,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [fileterdFiles, setFilteredFiles] = useState<Array<IFile>>([]);
    const [preview, setPreview] = useState({
        url: "",
        title: "",
        isOpen: false,
        onClose: () => {},
    });
    useEffect(() => {
        if (!_.isEmpty(searchTerm)) {
            setFilteredFiles(
                _.filter(files, (file) => {
                    return file.name.includes(searchTerm);
                })
            );
        } else {
            setFilteredFiles(files);
        }
    }, [searchTerm, files]);
    return (
        <div className="w-full p-6 bg-gray-900 text-white min-h-screen">
            <h2 className="text-2xl font-semibold mb-6">Files & Folders</h2>
            <Input
                type="text"
                placeholder="Search files and folders..."
                className="mb-4 p-2 w-full bg-gray-800 text-white border border-gray-700 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {currentPath.length > 0 && (
                <Button className="mb-4" onClick={onNavigateBack}>
                    ⬅ Go Back
                </Button>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {fileterdFiles.length > 0 ? (
                    fileterdFiles.map((file, index) => (
                        <div
                            key={file._id}
                            className="p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition cursor-pointer flex flex-col items-center justify-center"
                            // onClick={() =>
                            //     file.type === "folder" && onNavigate(file._id)
                            // }
                        >
                            {/* {file.type === "folder" ? (
                                <Folder className="w-12 h-12 text-yellow-400" />
                            ) : ( */}
                            <FileText className="w-12 h-12 text-blue-400" />
                            {/* )} */}
                            <p className="mt-2 text-center text-sm truncate w-full">
                                {file.name}
                            </p>
                            <div className="flex space-x-2 mt-2">
                                <Button
                                    size="icon"
                                    onClick={() => onDelete(index)}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                {/* {file.type !== "folder" && ( */}
                                {/* <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() =>
                                        setPreview({
                                            url: file.signedUrl,
                                            title: file.name,
                                            isOpen: true,
                                            onClose: () => {}
                                        })
                                    }
                                >
                                    <Eye className="w-4 h-4" />
                                </Button> */}
                                {/* )} */}
                                <Button size="icon" variant="outline" onClick={() => {
                                    window.open(file.signedUrl, "_blank");
                                }}>
                                    <DownloadCloud className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No files or folders found
                    </p>
                )}
            </div>
            <PreviewFile
                url={preview.url}
                title={preview.title}
                isOpen={preview.isOpen}
                onClose={() => setPreview({ url: "", title: "", isOpen: false, onClose: () => {} })}
            />
        </div>
    );
}

export default function FileUpload() {
    const [files, setFiles] = useState<Array<IFile>>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);

    const { getRootProps, getInputProps } = useDropzone({
        // accept: "image/*,application/pdf",
        onDrop: (acceptedFiles) => {
            // setFiles((prevFiles) => [
            //     ...prevFiles,
            //     ...acceptedFiles
            // ]);
        },
    });

    useEffect(() => {
        const init = async () => {
            try {
                const userDetails = await UserService.getCurrentUserDetails();
            } catch (error) {
                console.error(error);
            }
        };
    }, []);

    // Get all the files and folders
    useEffect(() => {
        const init = async () => {
            try {
                const files = (await FileService.getAllFiles()).data || [];
                setFiles(files);
            } catch (error) {
                console.error(error);
            }
        };
        init();
    }, []);

    const handleDelete = async (index: number) => {
        try {
            const file = files[index];
            if(file) {
                await FileService.deleteFile(file._id);
            }
            setFiles(files.splice(index, 1));
        } catch (error) {
            console.error(error);
        }
    };

    const handleNavigate = (folderName) => {
        setCurrentPath([...currentPath, folderName]);
    };

    const handleNavigateBack = () => {
        setCurrentPath(currentPath.slice(0, -1));
    };

    return (
        <div className="relative">
            <Button
                className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
                onClick={() => setIsDialogOpen(true)}
            >
                <UploadCloudIcon />
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Files</DialogTitle>
                    </DialogHeader>
                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-gray-500 p-6 rounded-lg cursor-pointer text-center hover:bg-gray-800"
                    >
                        <input {...getInputProps()} />
                        <p>
                            Drag & drop some files here, or click to select
                            files
                        </p>
                    </div>
                    <DialogFooter>
                        <Button type="submit">
                            Upload <UploadCloud />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Full-page File Grid */}
            <FileGrid
                files={files}
                onDelete={handleDelete}
                onNavigate={handleNavigate}
                currentPath={currentPath}
                onNavigateBack={handleNavigateBack}
            />
        </div>
    );
}
