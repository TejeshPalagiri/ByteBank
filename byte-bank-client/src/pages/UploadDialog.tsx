import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { IFile } from "@/interfaces/File";
import { Textarea } from "@/components/ui/textarea";
import * as FileService from "@/services/rest/file.service";
import { OpenToast } from "@/services/shared.service";
import { Button } from "@/components/ui/button";
import HttpClient from "@/services/axioxHttp";
import _ from "lodash";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IFolder } from "@/interfaces/Folder";
import * as FolderService from "../services/rest/folder.service";

export default function UploadDialog({
    open,
    setOpen,
    currentFolder,
    setRefresh,
    isFolderCreate,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
    currentFolder: string;
    setRefresh: (value: any) => void;
    isFolderCreate: boolean;
}) {
    useEffect(() => {
        if (open) {
            setFiles(null);
        }
    }, [open]);

    const [files, setFiles] = useState<File | File[] | FileList | null>();
    const [description, setDescription] = useState<string>("");
    const [filesList, setFilesList] = useState<string>("");
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files;
        if (dropped) {
            setFiles(dropped);
            setFilesList(_.map(dropped, (f) => f.name).join(", "));
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (selected) {
            setFiles(selected);
            setFilesList(_.map(selected, (f) => f.name).join(", "));
        }
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setDescription(e.target.value);
    };

    const handleOnUpload = async () => {
        if (isFolderCreate) {
            await onCreateFolder();
            return;
        }
        if (!_.isNull(files)) {
            let promises: Array<Promise<void>> = [];
            _.forEach(files, (f) => {
                promises.push(onUploadFile(f));
            });
            await Promise.all(promises);
        }
        setFilesList("");
    };

    const onCreateFolder = async (): Promise<void> => {
        if (folderInputRef?.current?.value?.length) {
            const folderCreatePaylaod: IFolder = {
                name: folderInputRef?.current?.value,
                description: description || "",
                parent: currentFolder || undefined,
            };

            await FolderService.createFolder(folderCreatePaylaod);
            setRefresh((prev) => !prev);
        }
    };

    const onUploadFile = async (file: File): Promise<void> => {
        try {
            if (file) {
                const filePayload: IFile = {
                    name: file.name,
                    mimeType: file.type,
                    size: file.size,
                    description: description || "",
                    parent: currentFolder || undefined,
                };

                const fileRecordResponse: any = await FileService.createFile(
                    filePayload
                );
                if (fileRecordResponse?.success) {
                    const fileRecord = fileRecordResponse?.data;
                    const key = fileRecord[0].key;
                    const fileId = fileRecord[0].id;
                    try {
                        const presignedUrlResponse: any =
                            await FileService.fetchPresignedUploadURL(
                                key,
                                filePayload?.mimeType
                            );
                        if (presignedUrlResponse?.success) {
                            const presignedUrl =
                                presignedUrlResponse?.data?.url;
                            if (presignedUrl) {
                                const uploadResponse = await HttpClient.put(
                                    presignedUrl,
                                    file,
                                    {
                                        headers: {
                                            "Content-Type":
                                                filePayload?.mimeType ||
                                                "application/octet-stream", // Default if MIME type is not found
                                        },
                                    }
                                );
                                if (
                                    uploadResponse.status === 200 ||
                                    uploadResponse.status === 201
                                ) {
                                    OpenToast(
                                        "SUCCESS",
                                        "File uploaded successfully."
                                    );
                                    setRefresh((prev) => !prev);
                                    return;
                                }
                                throw new Error("File Upload Failed");
                            }
                        }
                    } catch (error) {
                        await FileService.deleteFile(fileId);
                        OpenToast("ERROR", "File upload failed");
                    }
                }
            }
        } catch (error) {
            OpenToast("ERROR", "File upload failed");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isFolderCreate ? "Create Folder" : "Upload File"}
                    </DialogTitle>
                </DialogHeader>
                {isFolderCreate ? (
                    <div className="mt-4">
                        <Label htmlFor="folder-title">Folder Title</Label>
                        <Input
                            id="folder-title"
                            type="text"
                            ref={folderInputRef}
                            placeholder="Example Folder"
                            required
                        />
                    </div>
                ) : (
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() =>
                            document.getElementById("fileInput")?.click()
                        }
                        className={cn(
                            "mt-4 flex flex-col items-center justify-center border-2 border-dashed border-zinc-600 rounded-xl p-8 cursor-pointer hover:border-blue-400 transition",
                            filesList?.length && "border-green-500"
                        )}
                    >
                        <UploadCloud className="w-10 h-10 mb-2 text-zinc-400" />
                        <p className="text-sm text-zinc-400">
                            {files
                                ? filesList
                                : "Click or drag a file to upload"}
                        </p>
                        <input
                            id="fileInput"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            ref={fileUploadRef}
                            multiple
                        />
                    </div>
                )}
                <div className="mt-4">
                    <Textarea
                        placeholder="Describe the file here."
                        onInput={handleDescriptionChange}
                    />
                </div>

                <DialogClose asChild>
                    <Button onClick={handleOnUpload} className="mt-4 w-full">
                        {isFolderCreate ? "Create Folder" : "Upload"}
                    </Button>
                    {/* <button
                        className="mt-4 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        onClick={onUploadFile}
                    >
                        
                    </button> */}
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
