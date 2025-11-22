import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FileText,
    Trash2,
    Folder,
    Eye,
    CloudUploadIcon,
    SlashIcon,
} from "lucide-react";
import { IFile } from "@/interfaces/File";
import { IFolder } from "@/interfaces/Folder";

import * as FileService from "../services/rest/file.service";
import * as FolderService from "../services/rest/folder.service";
import UploadDialog from "./UploadDialog";
import { IBreadCrumbPath } from "@/interfaces/FilesPage";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import InfiniteScroll from "react-infinite-scroll-component";

const placeHolderImage =
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

export default function FileUpload() {
    const [searchTerm, setSearchTerm] = useState("");
    const [files, setFiles] = useState<IFile[]>([]);
    const [folders, setFolders] = useState<IFolder[]>([]);
    const [navStack, setNavStack] = useState<Array<IBreadCrumbPath>>([
        { title: "Home", value: "" },
    ]);
    const [currentFolder, setCurrentFolder] = useState<string>("");
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchFilesAndFolders = async () => {
        try {
            console.log("PAGE++++", page);
            const filesData = await FileService.getAllFiles(
                currentFolder,
                page
            );
            // As we're fetching all the folders at the beggining no need of fetching all the times when page changes
            if (page === 1) {
                const foldersData = await FolderService.getAllFolders(
                    currentFolder
                );
                setFolders(foldersData?.data || []);
            }
            if (filesData.data?.length < 50) {
                setHasMore(false);
            }
            setPage((prev) => prev + 1);
            setFiles((prev) => [...prev, ...filesData?.data, ...[]]);
        } catch (error) {
            console.error("Error fetching files and folders:", error);
        }
    };

    useEffect(() => {
        // Fetch files and folders from the server
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

    const resetStates = () => {
        setPage(1);
        setHasMore(true);
        setFiles([]);
        setFolders([]);
    };

    const handleOnNavigating = (crumb: IBreadCrumbPath, index: number) => {
        if (index === navStack.length - 1) return;
        resetStates();
        setCurrentFolder(crumb.value);
        setNavStack((prev) => {
            console.log(prev);
            let currentNavStack = [...prev];
            currentNavStack.splice(index + 1);
            return currentNavStack;
        });
    };

    return (
        <div className="w-full p-6 bg-gray-900 text-white min-h-screen">
            <div className="flex items-center gap-4 mb-2">
                <Input
                    type="text"
                    placeholder="Search files and folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded"
                />
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setIsUploadOpen(true)}
                >
                    <CloudUploadIcon size={16} /> Upload
                </Button>
            </div>
            <div className="p-4 mb-2">
                <Breadcrumb>
                    <BreadcrumbList>
                        {navStack.map((e, i) => (
                            <>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        className={
                                            currentFolder !== e.value
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed"
                                        }
                                        onClick={() => handleOnNavigating(e, i)}
                                    >
                                        {e.title}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {/* Show the slash icon only for the last item */}
                                {i != navStack?.length - 1 && (
                                    <BreadcrumbSeparator>
                                        <SlashIcon />
                                    </BreadcrumbSeparator>
                                )}
                            </>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <InfiniteScroll
                dataLength={files.length + folders.length}
                next={fetchFilesAndFolders}
                hasMore={hasMore}
                scrollThreshold={0.9}
                loader={<p className="text-center py-4 text-sm">Loading...</p>}
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredFolders.map((folder) => (
                        <div
                            key={folder._id}
                            onClick={() => {
                                resetStates();
                                setCurrentFolder(folder._id);
                                setNavStack((prev) => [
                                    ...prev,
                                    { title: folder?.name, value: folder._id },
                                ]);
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
                                        src={
                                            placeHolderImage ||
                                            file?.thumbnail ||
                                            file?.signedUrl
                                        }
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
                            </div>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
            {filteredFiles.length === 0 && filteredFolders.length === 0 && (
                <p className="col-span-full text-center text-gray-500 mt-4">
                    No files or folders found
                </p>
            )}
            <div className="p-6">
                <UploadDialog
                    open={isUploadOpen}
                    setOpen={setIsUploadOpen}
                    currentFolder={currentFolder}
                    setRefresh={setRefresh}
                />
            </div>
        </div>
    );
}
