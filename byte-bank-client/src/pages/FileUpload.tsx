import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Eye, FileText, Folder, Trash2 } from "lucide-react";

function FileGrid({
    files,
    onDelete,
    onNavigate,
    currentPath,
    onNavigateBack,
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFiles = files;
    // files.filter(
    //     (file) =>
    //         file.path.join("/") === currentPath.join("/") &&
    //         file.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );

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
                {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                        <div
                            key={file.name}
                            className="p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition cursor-pointer flex flex-col items-center justify-center"
                            onClick={() =>
                                file.type === "folder" && onNavigate(file.name)
                            }
                        >
                            {file.type === "folder" ? (
                                <Folder className="w-12 h-12 text-yellow-400" />
                            ) : (
                                <FileText className="w-12 h-12 text-blue-400" />
                            )}
                            <p className="mt-2 text-center text-sm truncate w-full">
                                {file.name}
                            </p>
                            <div className="flex space-x-2 mt-2">
                                <Button
                                    size="icon"
                                    onClick={() => onDelete(file.name)}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                {file.type !== "folder" && (
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() =>
                                            window.open(file.preview, "_blank")
                                        }
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No files or folders found
                    </p>
                )}
            </div>
        </div>
    );
}

export default function FileUpload() {
    const [files, setFiles] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);

    const { getRootProps, getInputProps } = useDropzone({
        // accept: "image/*,application/pdf",
        onDrop: (acceptedFiles) => {
            setFiles((prevFiles) => [
                ...prevFiles,
                ...acceptedFiles
            ]);
        },
    });

    const handleDelete = (fileName) => {
        setFiles(
            files
            // files.filter(
            //     (file) =>
            //         !(
            //             file.name === fileName &&
            //             file.path.join("/") === currentPath.join("/")
            //         )
            // )
        );
    };

    const handleNavigate = (folderName) => {
        setCurrentPath([...currentPath, folderName]);
    };

    const handleNavigateBack = () => {
        setCurrentPath(currentPath.slice(0, -1));
    };

    return (
        <div className="relative">
            <Button className="m-4" onClick={() => setIsDialogOpen(true)}>
                Upload Files
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
