"use client"

import {X} from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";
import { useEffect } from "react";
// import "@uploadthing/react/styles.css"

interface FileUploadProps {
    onChange:(url?: string)=> void;
    value: string;
    endpoint:"messageFile"| "serverImage"
}

export const FileUpload=({
    onChange,
    value,
    endpoint
}: FileUploadProps)=>{
    useEffect(() => {
        import("@uploadthing/react/styles.css")
          .then(() => {
            console.log("Styles imported successfully.");
          })
          .catch((error) => {
            console.error("Failed to import styles:", error);
          });
      }, []);

    const fileType= value?.split(".").pop();
    if(value&& fileType!=="pdf"){
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="Uplaod"
                    className="rounded-full"
                />
                <button onClick={()=>onChange("")}
                    className="bg-rose-500 text-whtie p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                    >
                    <X className="h-4 w-4"/>
                </button>
            </div>
        )
    }
    return(
        <UploadDropzone 
        endpoint={endpoint}
        onClientUploadComplete={(res)=>{
            onChange(res?.[0].url)
        }}
        onUploadError={(error:Error)=>{
            console.log(error);
        }}
        />
    )
}