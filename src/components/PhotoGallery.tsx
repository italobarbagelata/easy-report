"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import Link from "next/link";
import { TrashIcon, UploadIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "./ui/progress";

interface Props {
    inspection_id: number;
}

export default function PhotoGallery({inspection_id }: Props) {
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const { data, error } = await supabase.storage
      .from("easy-report")
      .list(`photos/${inspection_id}`, {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("Error fetching photos:", error);
      return;
    }

    const photoPaths = data.map(
      (file) =>
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/easy-report/photos/${inspection_id}/${file.name}`
    );
    setPhotos(photoPaths);
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated for photo upload");
      }

      let uploadedFiles = 0;
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `photos/${inspection_id}/${fileName}`;
        const { error } = await supabase.storage
          .from("easy-report")
          .upload(filePath, file);

        if (error) {
          throw error;
        }

        const { data, error: insertError } = await supabase
          .from("images")
          .insert([{ uri: filePath, name: fileName, inspection_id: inspection_id , user_id: user.id }]);
        if (insertError) {
          console.error("Error inserting image:", insertError);
          return;
        }
        

        uploadedFiles += 1;
        setProgress((uploadedFiles / files.length) * 100);
      }

      await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: "/photos" }),
      });

      fetchPhotos();
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      //save uri and name file in table images 
      setUploading(false);
      setProgress(0);
    }
  }

  async function handleDeletePhoto(photoUrl: string) {
    console.log("Deleting photo:", photoUrl);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const fileName = photoUrl.split('/').pop();
    const { error } = await supabase.storage
      .from("easy-report")
      .remove([`photos/${inspection_id}/${fileName}`]);

    if (error) {
      console.error("Error deleting photo:", error);
      return;
    }

    //delete table images supabase
    console.log("Deleting photo from table images:", fileName);
    const { data, error: deleteError } = await supabase
      .from("images")
      .delete()
      .eq("name", fileName);

      console.log("Data:", deleteError);

    setPhotos(photos.filter((photo) => photo !== photoUrl));
  }

  return (
    <div className="flex flex-row">
      <div className="">
        <div className="py-2 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Photos</CardTitle>
              <p className="text-sm text-gray-600">
                Upload photos of the inspection site. You can upload multiple
                photos at once.
              </p>
            </CardHeader>
            <CardContent>
              <Label
                htmlFor="photo-upload"
                className="flex items-center justify-center space-x-2 w-56 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2 px-4 rounded-lg "
              >
                <UploadIcon className="h-5 w-5 mr-5" />
                {uploading ? "Uploading..." : "Upload Photos"}
                
                <input
                  type="file"
                  id="photo-upload"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  multiple  
                />
              </Label>
              {uploading && <Progress className="mt-8" value={progress} />}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:p-6">
        {photos.map((photo, index) => (
          <div
            className="relative group  rounded-lg"
            key={index}
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="object-cover w-full h-25 group-hover:scale-105 transition-transform duration-300"
              style={{
                aspectRatio: "200/100",
                objectFit: "cover",
              }}
            />
            <div
              className="absolute top-2 right-2 bg-gray-900 text-gray-50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={() => handleDeletePhoto(photo)}
            >
              <TrashIcon className="w-4 h-4" />
              <span className="sr-only">Delete</span>
            </div>
          </div>
        ))}
      </div>

      </div>


    </div>
  );
}
