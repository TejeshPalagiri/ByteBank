import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { useCallback, useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { IFile } from "@/interfaces/File";
import { Textarea } from "@/components/ui/textarea";
import * as FileService from "@/services/rest/file.service";
import { OpenToast } from "@/services/shared.service";
import { Button } from "@/components/ui/button";
import HttpClient from "@/services/axioxHttp";

export default function UploadDialog({
    open,
    setOpen,
    currentFolder,
    setRefresh
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
    currentFolder: string;
    setRefresh: (value: any) => void;
}) {
    useEffect(() => {
        if (open) {
            setFile(null);
        }
    }, [open]);
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>("");

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) setFile(dropped);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) setFile(selected);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const onUploadFile = async () => {
        try {
            if (file) {
                const filePayload: IFile = {
                    name: file.name,
                    mimeType: file.type,
                    size: file.size,
                    description: description || "",
                    parent: currentFolder || undefined,
                }

                const fileRecordResponse: any = await FileService.createFile(filePayload);
                if (fileRecordResponse?.success) {
                    const fileRecord = fileRecordResponse?.data;
                    const key = fileRecord[0].key;
                    const fileId = fileRecord[0].id;
                    try {
                        const presignedUrlResponse: any = await FileService.fetchPresignedUploadURL(key, filePayload?.mimeType);
                        if (presignedUrlResponse?.success) {
                            const presignedUrl = presignedUrlResponse?.data?.url;
                            if (presignedUrl) {
                                const uploadResponse = await HttpClient.put(presignedUrl, file, {
                                    headers: {
                                        "Content-Type": filePayload?.mimeType || "application/octet-stream", // Default if MIME type is not found
                                    },
                                });
                                if(uploadResponse.status === 200 || uploadResponse.status === 201) {
                                    OpenToast("SUCCESS", "File uploaded successfully.");
                                    setRefresh((prev) => !prev);
                                    return;
                                }
                                throw new Error("File Upload Failed")
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
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                </DialogHeader>

                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className={cn(
                        "mt-4 flex flex-col items-center justify-center border-2 border-dashed border-zinc-600 rounded-xl p-8 cursor-pointer hover:border-blue-400 transition",
                        file && "border-green-500"
                    )}
                >
                    <UploadCloud className="w-10 h-10 mb-2 text-zinc-400" />
                    <p className="text-sm text-zinc-400">
                        {file ? file.name : "Click or drag a file to upload"}
                    </p>
                    <input
                        id="fileInput"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
                <div className="mt-4">
                    <Textarea placeholder="Describe the file here." onInput={handleDescriptionChange} />
                </div>

                <DialogClose asChild>
                    <Button onClick={onUploadFile} className="mt-4 w-full">
                        Upload
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
