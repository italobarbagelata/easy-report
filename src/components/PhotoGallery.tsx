"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import Link from "next/link";
import {
  CircleX,
  EyeIcon,
  ListOrdered,
  Loader,
  ShieldCloseIcon,
  TrashIcon,
  UploadIcon,
  X,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "./ui/progress";
import imageCompression from "browser-image-compression";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import {
  addPhotoSuccess,
  deletePhoto,
  updatePhotoOrder,
} from "@/store/photos/actions";
import { Input } from "./ui";
import { Photo } from "@/interfaces/inspection";

interface Props {
  inspection_id: number;
  disabled: boolean;
}

export default function PhotoGallery({ inspection_id, disabled }: Props) {
  const dispatch: AppDispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const photos = useSelector((state: RootState) => state.photos.photos);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderCounter, setOrderCounter] = useState(1);
  const [orderedPhotos, setOrderedPhotos] = useState<{ [key: string]: number }>(
    {}
  );
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if (photos.length === 0) {
      fetchPhotos();
    }
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
    dispatch(
      addPhotoSuccess(
        photoPaths.map((path) => ({ url: path, order: 0 } as Photo))
      )
    );
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
        const options = {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        try {
          const compressedFile = await imageCompression(file, options);

          const fileExt = compressedFile.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `photos/${inspection_id}/${fileName}`;
          const { error } = await supabase.storage
            .from("easy-report")
            .upload(filePath, compressedFile);

          if (error) {
            throw error;
          }

          const { data, error: insertError } = await supabase
            .from("images")
            .insert([
              {
                uri: filePath,
                name: fileName,
                inspection_id: inspection_id,
                user_id: user.id,
              },
            ]);
          if (insertError) {
            console.error("Error inserting image:", insertError);
            return;
          }

          uploadedFiles += 1;
          setProgress((uploadedFiles / files.length) * 100);
        } catch (error) {
          console.error("Error compressing or uploading image:", error);
        }
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
      setUploading(false);
      setProgress(0);
    }
  }

  async function handleDeletePhoto(photoUrl: string) {
    setLoadingDelete(true);
    console.log("Deleting photo:", photoUrl);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const fileName = photoUrl.split("/").pop();
    const { error } = await supabase.storage
      .from("easy-report")
      .remove([`photos/${inspection_id}/${fileName}`]);

    if (error) {
      setLoadingDelete(false);
      console.error("Error deleting photo:", error);
      return;
    }

    //delete table images supabase
    console.log("Deleting photo from table images:", fileName);
    const { data, error: deleteError } = await supabase
      .from("images")
      .delete()
      .eq("name", fileName);

    dispatch(deletePhoto(photoUrl));
    setLoadingDelete(false);
  }

  function handlePhotoClick(photo: string) {
    if (!isOrdering) return;

    setOrderedPhotos((prev) => {
      const currentOrder = prev[photo];
      const newOrder = currentOrder ? undefined : orderCounter;

      if (newOrder) {
        setOrderCounter(orderCounter + 1);
      } else {
        setOrderCounter(orderCounter - 1);
      }

      dispatch(
        updatePhotoOrder({ url: photo, order: newOrder ?? 0 }, newOrder ?? 0)
      );

      return {
        ...prev,
        [photo]: newOrder,
      };
    });
  }

  return (
    <div className="flex flex-col w-full">
      <div className="py-2 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Inspection Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <p className="text-sm text-gray-600">
                Upload photos of the inspection site. <br /> You can upload
                multiple photos at once.
              </p>
              <Label
                htmlFor="photo-upload"
                className="flex items-center justify-center py-2 px-4 h-10 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-medium  rounded-lg "
              >
                <UploadIcon className="h-5 w-5 mr-5" />
                {uploading ? "Uploading..." : "Upload Photos"}

                <Input
                  type="file"
                  id="photo-upload"
                  onChange={handleFileUpload}
                  disabled={uploading || disabled}
                  className="hidden"
                  multiple
                />
              </Label>
              <Button
                className="cursor-pointer"
                onClick={() => setIsOrdering(!isOrdering)}
                variant={isOrdering ? "default" : "secondary"}
                disabled={disabled}
              >
                <ListOrdered className="w-4 h-4 mr-2" />
                {isOrdering ? "Disable Ordering" : "Enable Ordering"}
              </Button>
            </div>
            {uploading && <Progress className="mt-8" value={progress} />}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
              {photos.map((photo, index) => (
                <div
                  className="relative group rounded-lg"
                  key={index}
                  onClick={() => handlePhotoClick(photo.url)}
                >
                  <img
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="object-cover w-full h-25 group-hover:scale-105 transition-transform duration-300"
                  />
                  {photo.order !== 0 ? (
                    <div className="absolute bottom-2 left-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center">
                      {photo.order}
                    </div>
                  ) : (
                    orderedPhotos[photo.url] && (
                      <div className="absolute bottom-2 left-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center">
                        {orderedPhotos[photo.url]}
                      </div>
                    )
                  )}
                  <div
                    className="absolute top-2 right-2 bg-gray-900 text-gray-50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => handleDeletePhoto(photo.url)}
                  >
                    {loadingDelete ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <TrashIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className="absolute top-2 left-2 bg-gray-900 text-gray-50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => setSelectedPhoto(photo.url)}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog
        open={!!selectedPhoto}
        onOpenChange={() => setSelectedPhoto(null)}
      >
        <DialogTrigger asChild>
          <div></div>
        </DialogTrigger>
        <DialogContent>
          <img src={selectedPhoto} alt="Selected" style={{ width: "100%" }} />
          <DialogClose asChild>
            <button className="absolute top-2 right-2 bg-gray-900 text-gray-50 rounded-full p-2">
              <span className="sr-only">Close</span>
              <X className="w-4 h-4" />
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
