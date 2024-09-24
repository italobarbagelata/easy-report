"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  CircleCheckBig,
  FileText,
  Save,
  Send,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { createActionsForTable } from "@/actions";
import PhotoGallery from "@/components/PhotoGallery";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchInspection,
  updateInspection,
  updateInspectionSuccess,
} from "@/store/inspection/actions";
import {
  addNewQualityCommentStore,
  fetchQualityCommentsById,
  saveQualityComments,
  setQualityCommentsStore,
  updateQualityCommentsById,
} from "@/store/quality/actions";
import { jsPDF } from "jspdf";
import {
  InspectionElement,
  Photo,
  QualityComments,
} from "@/interfaces/inspection";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { addPhotoSuccess, savePhotoOrder, updatePhotoOrder } from "@/store/photos/actions";

interface Props {
  params: {
    inspection_id: number;
  };
}

const InspectionIdPage = ({ params }: Props) => {
  const inspection_id = params.inspection_id;
  const dispatch: AppDispatch = useDispatch();

  const [date, setDate] = useState<Date>(new Date());
  const [packingDate, setPackingDate] = useState<Date>(new Date());
  const [exportersKingo, setExportersKingo] = useState<InspectionElement[]>([]);
  const [labelKingo, setLabelKingo] = useState<InspectionElement[]>([]);
  const [dispatchKingo, setDispatchKingo] = useState<InspectionElement[]>([]);
  const [packageKingo, setPackageKingo] = useState<InspectionElement[]>([]);
  const [weightKingo, setWeightKingo] = useState<InspectionElement[]>([]);
  const [speciesKingo, setSpeciesKingo] = useState<InspectionElement[]>([]);
  const [varietyKingo, setVarietyKingo] = useState<InspectionElement[]>([]);
  const [colorKingo, setColorKingo] = useState<InspectionElement[]>([]);
  const [sizesKingo, setSizesKingo] = useState<InspectionElement[]>([]);
  const [finalOverallKingo, setFinalOverallKingo] = useState<
    InspectionElement[]
  >([]);
  const [phytoChinaKingo, setPhytoChinaKingo] = useState<InspectionElement[]>(
    []
  );

  const router = useRouter();

  const inspection = useSelector(
    (state: RootState) => state.inspection.inspection
  );

  const photos = useSelector((state: RootState) => state.photos.photos);

  const user = useSelector((state: RootState) => state.user.users);

  const [pdfUrl, setPdfUrl] = useState("");

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

  useEffect(() => {
    dispatch(fetchInspection(inspection_id));

    fetchPhotos();
  }, [inspection_id]);

  useEffect(() => {
    const checkAuthState = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
    };

    checkAuthState();
  }, [router]);

  const fetchDataVariety = async (speciesId: number) => {
    let { data: varieties, error } = await supabase
      .from("variety")
      .select("*")
      .eq("id_specie", speciesId)
      .order("id", { ascending: true });

    if (error) console.log("Error: ", error);
    else setVarietyKingo(varieties || []);
  };

  useEffect(() => {
    const fetchData = async (entity: string) => {
      const data = createActionsForTable(entity);
      const result = await data.read(0, 100);
      return result;
    };

    const fetchAllData = async () => {
      try {
        const [
          exporters,
          labels,
          phyto,
          dispatches,
          packages,
          weights,
          species,
          colors,
          finalOveralls,
          sizes,
        ] = await Promise.all([
          fetchData("exporter"),
          fetchData("label"),
          fetchData("phyto_china"),
          fetchData("dispatch"),
          fetchData("package"),
          fetchData("weight"),
          fetchData("specie"),
          fetchData("color"),
          fetchData("final_overall"),
          fetchData("sizes"),
        ]);

        setExportersKingo(exporters);
        setLabelKingo(labels);
        setPhytoChinaKingo(phyto);
        setDispatchKingo(dispatches);
        setPackageKingo(packages);
        setWeightKingo(weights);
        setSpeciesKingo(species);
        setColorKingo(colors);
        setFinalOverallKingo(finalOveralls);
        setSizesKingo(sizes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  const handleChange = (field: string, value: any): void => {
    if (field === "species") {
      fetchDataVariety(value);
      dispatch(
        updateInspectionSuccess({
          ...inspection,
          species: {
            id: value,
            description:
              speciesKingo.find((item) => item.id === value)?.description || "",
          },
        })
      );
    }
    if (
      field === "place" ||
      field === "grower" ||
      field === "observations" ||
      field === "final_recomendations" ||
      field === "extra_details" ||
      field === "quality_conditions" ||
      field === "qc_size" ||
      field === "qc_size_description" ||
      field === "qc_color" ||
      field === "qc_color_description" ||
      field === "qc_brix" ||
      field === "qc_brix_description" ||
      field === "qc_flavor" ||
      field === "qc_flavor_description" ||
      field === "qc_firmness" ||
      field === "qc_firmness_description" ||
      field === "qc_decay" ||
      field === "qc_decay_description" ||
      field === "qc_skin_defects" ||
      field === "qc_skin_defects_description"
    ) {
      dispatch(updateInspectionSuccess({ ...inspection, [field]: value }));
    } else {
      if (field === "label") {
        const label = labelKingo.find((item) => item.id === value);
        if (label) {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: label.description },
            })
          );
        } else {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: "" },
            })
          );
        }
      }

      if (field === "exporter") {
        const exporter = exportersKingo.find((item) => item.id === value);
        if (exporter) {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: exporter.description },
            })
          );
        } else {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: "" },
            })
          );
        }
      }

      if (field === "phyto_china") {
        const phyto = phytoChinaKingo.find((item) => item.id === value);
        if (phyto) {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: phyto.description },
            })
          );
        } else {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: "" },
            })
          );
        }
      }

      if (field === "dispatch") {
        const dis = dispatchKingo.find((item) => item.id === value);
        if (dis) {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: dis.description },
            })
          );
        } else {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: "" },
            })
          );
        }
      }

      if (field === "package") {
        const pack = packageKingo.find((item) => item.id === value);
        if (pack) {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: pack.description },
            })
          );
        } else {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: "" },
            })
          );
        }
      }

      if (field === "weight") {
        const w = weightKingo.find((item) => item.id === value);
        if (w) {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: w.description },
            })
          );
        } else {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: "" },
            })
          );
        }
      }

      if (field === "species") {
        const spec = speciesKingo.find((item) => item.id === value);
        if (spec) {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: spec.description },
            })
          );
        } else {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: "" },
            })
          );
        }
      }

      if (field === "variety") {
        dispatch(
          updateInspectionSuccess({
            ...inspection,
            variety: {
              id: value,
              description:
                varietyKingo.find((item) => item.id === value)?.description ||
                "",
            },
          })
        );
      }

      if (field === "color") {
        const col = colorKingo.find((item) => item.id === value);
        if (col) {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: col.description },
            })
          );
        } else {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: "" },
            })
          );
        }
      }

      if (field === "final_overall") {
        const final = finalOverallKingo.find((item) => item.id === value);
        if (final) {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: final.description },
            })
          );
        } else {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: "" },
            })
          );
        }
      }

      if (field === "size") {
        dispatch(
          updateInspectionSuccess({
            ...inspection,
            sizes: {
              id: value,
              description:
                sizesKingo.find((item) => item.id === value)?.description || "",
            },
          })
        );
      }
    }
  };

  const handleSubmit = () => {
    if (inspection.id !== undefined) {
      dispatch(updateInspection(inspection_id, inspection));
      dispatch(savePhotoOrder(inspection_id, photos));
    }
  };

  const generateJSPDF = () => {
    const doc = new jsPDF();

    // Logo
    doc.addImage("../kingo_pdf.png", "PNG", 15, 5, 42, 24);

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Inspection Quality Report", 75, 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal", "normal");
    doc.text("Date: " + inspection?.inspection_date, 95, 16);

    // Sección de Logística
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Shipper/Grower/Packaging", 15, 45);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Shipper name:", 15, 55);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(inspection?.grower ?? "", 50, 55);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Label/Brand:", 15, 65);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(inspection?.label?.description ?? "", 50, 65);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Packaging Format:", 15, 75);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(inspection?.package?.description ?? "", 50, 75);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Weight:", 15, 85);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(inspection?.weight?.description ?? "", 50, 85);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Grower code(S):", 15, 95);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(inspection?.grower ?? "", 50, 95);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Available Sizes:", 15, 105);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(inspection?.sizes?.description ?? "", 50, 105);

    // Sección de Producto
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Product Info", 115, 75);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Species:", 115, 85);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(`${inspection?.species?.description ?? ""}`, 145, 85);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Variety:", 115, 95);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(`${inspection?.variety?.description ?? ""}`, 145, 95);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Packing Date:", 115, 105);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(`${inspection?.packing_date ?? ""}`, 145, 105);

    // Sección de Color
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal", "bold");
    doc.text(`${inspection?.final_overall?.description ?? ""}`, 115, 45);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(`${inspection?.color?.description ?? ""}`, 115, 55);

    // Comentarios de calidad
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Quality Condition Comments", 15, 120);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal", "normal");

    const qualityConditionsText = `${
      inspection?.quality_conditions ?? "No comments provided"
    }`;
    const splitText = doc.splitTextToSize(qualityConditionsText, 180);

    const startY = 130;
    const lineHeight = 8;

    splitText.forEach((line: any, index: any) => {
      doc.text(line, 15, startY + index * lineHeight);
    });

    // Parámetros Evaluados
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Evaluated Parameters", 15, 175);
    doc.setFontSize(12);

    doc.setFont("helvetica", "normal", "bold");
    doc.text("Color:", 15, 190);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(`${inspection?.qc_color ?? ""}`, 50, 190);
    doc.text(`${inspection?.qc_color_description ?? ""}`, 65, 190);

    doc.setFont("helvetica", "normal", "bold");
    doc.text("Size:", 15, 200);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(`${inspection?.qc_size ?? ""}`, 50, 200);
    doc.text(`${inspection?.qc_size_description ?? ""}`, 65, 200);

    doc.setFont("helvetica", "normal", "bold");
    doc.text("Brix:", 15, 210);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(`${inspection?.qc_brix ?? ""}`, 50, 210);
    doc.text(`${inspection?.qc_brix_description ?? ""}`, 65, 210);

    doc.setFont("helvetica", "normal", "bold");
    doc.text("Flavor:", 15, 220);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(`${inspection?.qc_flavor ?? ""}`, 50, 220);
    doc.text(`${inspection?.qc_flavor_description ?? ""}`, 65, 220);

    doc.setFont("helvetica", "normal", "bold");
    doc.text("Skin defects:", 15, 230);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(`${inspection?.qc_skin_defects ?? ""}`, 50, 230);
    doc.text(`${inspection?.qc_skin_defects_description ?? ""}`, 65, 230);

    doc.setFont("helvetica", "normal", "bold");
    doc.text("Firmness:", 15, 240);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(`${inspection?.qc_firmness ?? ""}`, 50, 240);
    doc.text(`${inspection?.qc_firmness_description ?? ""}`, 65, 240);

    doc.setFont("helvetica", "normal", "bold");
    doc.text("Decay:", 15, 250);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(`${inspection?.qc_decay ?? ""}`, 50, 250);
    doc.text(`${inspection?.qc_decay_description ?? ""}`, 65, 250);

    // Conclusión final
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Final Conclusion", 105, 175);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal", "normal");

    const additionalCommentsText = `${
      inspection?.final_recomendations ?? "No final recommendations"
    }`;
    const splitAdditionalComments = doc.splitTextToSize(
      additionalCommentsText,
      80
    );

    const startYfinal_recomendations = 185;
    const lineHeightfinal_recomendations = 8;

    splitAdditionalComments.forEach((line: any, index: any) => {
      doc.text(
        line,
        105,
        startYfinal_recomendations + index * lineHeightfinal_recomendations
      );
    });

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal", "bold");
    doc.text("Observations", 105, 210);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal", "normal");

    const observationsText = `${
      inspection?.observations ?? "No observations provided"
    }`;
    const splitObservations = doc.splitTextToSize(observationsText, 85);

    const startYobservations = 220;
    const lineHeightobservations = 7;

    splitObservations.forEach((line: any, index: any) => {
      doc.text(line, 105, startYobservations + index * lineHeightobservations);
    });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(
      "This inspection report is for private use only. The information is confidential and may not be shared, disclosed, or distributed without permission.",
      20,
      285
    );

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal", "normal");
    doc.text("Kingo 2024", 97, 290);

    // Agregar fotos en la segunda página
    doc.addPage();
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal", "normal");
    doc.text(
      "This inspection report is for private use only. The information is confidential and may not be shared, disclosed, or distributed without permission.",
      20,
      285
    );

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal", "normal");
    doc.text("Kingo 2024", 97, 290);

    const sortedPhotos = photos.sort(
      (a, b) => (a.order === 0 ? 1 : a.order) - (b.order === 0 ? 1 : b.order)
    );

    let x = 10;
    let y = 10;
    let width = 90;
    let height = 60;
    let count = 0;

    sortedPhotos.map((photo, index) => {
      if (count === 8) {
        doc.addPage(); // Nueva página después de 8 imágenes
        x = 10;
        y = 10;
        count = 0;
      }
      doc.addImage(photo.url, "PNG", x, y, width, height);
      x += 100; // Mover la posición en x para la siguiente imagen
      count++;
      if (count % 2 === 0) {
        x = 10; // Reiniciar la posición en x
        y += 70; // Mover la posición en y hacia abajo
      }
    });

    // Generar el PDF como un Blob
    const pdfBlob = doc.output("blob");

    // Crear una URL para el Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Abrir una nueva ventana con la URL del Blob
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="flex flex-col relative  mx-auto h-full overflow-scroll  bg-muted/40">
      <div className="flex items-center sticky top-0 z-[10] p-3 bg-background/50 backdrop-blur-lg border-b">
        <div className="text-sm md:text-2xl">Inspection</div>
        <div className="text-sm md:text-2xl mx-4"># {inspection_id}</div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "px-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={inspection.status_email}
            >
              {inspection.inspection_date ? (
                new Date(
                  inspection.inspection_date + "T00:00:00"
                ).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              ) : (
                <span>Select date</span>
              )}
              <CalendarIcon className="h-4 w-4 ml-2 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                  const formattedDate = selectedDate
                    .toISOString()
                    .split("T")[0];
                  dispatch(
                    updateInspectionSuccess({
                      ...inspection,
                      inspection_date: formattedDate,
                    })
                  );
                }
              }}
              locale={es}
            />
          </PopoverContent>
        </Popover>

        <div className="flex flex-row gap-4 ml-4 items-center">
          <Button
            variant="secondary"
            className="ml-auto"
            onClick={handleSubmit}
            aria-label="Save"
            disabled={inspection.status_email}
          >
            <Save className="h-6 w-6 mr-2" />
            <span>Save</span>
          </Button>
          <Button onClick={generateJSPDF}>
            <FileText className="h-6 w-6 mr-2" />
            <span>Preview PDF</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => console.log(inspection)}
                disabled={inspection.status_email}
              >
                {inspection.status_email ? (
                  <CircleCheckBig className="h-6 w-6 mr-2" />
                ) : (
                  <Send className="h-6 w-6 mr-2" />
                )}
                {inspection.status_email
                  ? "Inspection sent"
                  : "Send inspection"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Send email to the customer with
                  the inspection report.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Badge variant={inspection.status_email ? "default" : "destructive"}>
            {inspection.status_email ? "Sender" : "Not Sender"}
          </Badge>
        </div>
      </div>
      <div className="flex flex-row m-4 gap-4 w-12/12 md:w-10/12 xl:w-9/12">
        <Tabs defaultValue="inspection" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inspection">Inspection</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          <TabsContent value="inspection">
            <div className="flex flex-col flex-1 gap-2">
              <div className="flex flex-row flex-1 gap-2">
                <Card className="w-full">
                  <div className="flex flex-col gap-4 p-4">
                    <div className="grid grid-rows-6 items-center gap-4">
                      <div className="grid grid-cols-2 items-center">
                        <p className="text-sm">Exporter</p>
                        <Select
                          onValueChange={(value) =>
                            handleChange("exporter", value)
                          }
                          value={inspection?.exporter?.id}
                          disabled={inspection.status_email}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Exporter" />
                          </SelectTrigger>
                          <SelectContent>
                            {exportersKingo.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <div className="text-sm">Label</div>
                        <Select
                          onValueChange={(value) =>
                            handleChange("label", value)
                          }
                          value={inspection?.label?.id}
                          disabled={inspection.status_email}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select label" />
                          </SelectTrigger>
                          <SelectContent>
                            {labelKingo.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 items-center">
                        <p className="text-sm">Package</p>
                        <Select
                          onValueChange={(value) =>
                            handleChange("package", value)
                          }
                          value={inspection?.package?.id}
                          disabled={inspection.status_email}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select package" />
                          </SelectTrigger>
                          <SelectContent>
                            {packageKingo.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 items-center">
                        <div className="text-sm"> Weight</div>
                        <Select
                          onValueChange={(value) =>
                            handleChange("weight", value)
                          }
                          value={inspection?.weight?.id}
                          disabled={inspection.status_email}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select weight" />
                          </SelectTrigger>
                          <SelectContent>
                            {weightKingo.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2  items-center">
                        <div className="text-sm"> Grower</div>
                        <Input
                          placeholder="Grower"
                          onChange={(e) =>
                            handleChange("grower", e.target.value)
                          }
                          value={inspection?.grower ?? ""}
                          disabled={inspection.status_email}
                        />
                      </div>

                      <div className="grid grid-cols-2 items-center">
                        <div className="text-sm"> Dispatch</div>
                        <Select
                          onValueChange={(value) =>
                            handleChange("dispatch", value)
                          }
                          value={inspection?.dispatch?.id}
                          disabled={inspection.status_email}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select dispatch" />
                          </SelectTrigger>
                          <SelectContent>
                            {dispatchKingo.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 items-center">
                        <div className="text-sm">Size</div>
                        <Select
                          onValueChange={(value) => handleChange("size", value)} // Manejar cambio de tamaño
                          value={inspection?.sizes?.id}
                          disabled={inspection.status_email}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Size" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizesKingo.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="w-full">
                  <div className="flex flex-col gap-4 p-4">
                    <div className="grid grid-rows-6 items-center gap-4">
                      <div className="grid grid-cols-2 items-center">
                        <div className="text-sm">Final Overall</div>
                        <Select
                          onValueChange={(value) =>
                            handleChange("final_overall", value)
                          }
                          value={inspection?.final_overall?.id}
                          disabled={inspection.status_email}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Final Overall" />
                          </SelectTrigger>
                          <SelectContent>
                            {finalOverallKingo.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <div className="text-sm">Color</div>
                        <Select
                          onValueChange={(value) =>
                            handleChange("color", value)
                          }
                          value={inspection?.color?.id}
                          disabled={inspection.status_email}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Color" />
                          </SelectTrigger>
                          <SelectContent>
                            {colorKingo.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <div className="text-sm">Species</div>
                        <Select
                          onValueChange={(value) =>
                            handleChange("species", value)
                          }
                          value={inspection?.species?.id}
                          disabled={inspection.status_email}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Species" />
                          </SelectTrigger>
                          <SelectContent>
                            {speciesKingo.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 items-center">
                        <div className="text-sm">Variety</div>
                        <Select
                          onValueChange={(value) =>
                            handleChange("variety", value)
                          }
                          value={inspection?.variety?.id}
                          disabled={inspection.status_email}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Variety" />
                          </SelectTrigger>
                          <SelectContent>
                            {varietyKingo.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 items-center">
                        <div className="text-sm">Packing date</div>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "px-3 text-left font-normal",
                                !packingDate && "text-muted-foreground"
                              )}
                              disabled={inspection.status_email}
                            >
                              {inspection.packing_date ? (
                                new Date(
                                  inspection.packing_date + "T00:00:00"
                                ).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="h-4 w-4 ml-2 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(selectedDate) => {
                                if (selectedDate) {
                                  setPackingDate(selectedDate);
                                  const formattedDate = selectedDate
                                    .toISOString()
                                    .split("T")[0];
                                  dispatch(
                                    updateInspectionSuccess({
                                      ...inspection,
                                      packing_date: formattedDate,
                                    })
                                  );
                                }
                              }}
                              locale={es}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              <Card>
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm pb-2">
                      Quality conditions coments
                    </div>
                    <Textarea
                      placeholder="Quality conditions coments"
                      className="h-32"
                      onChange={(e) =>
                        handleChange("quality_conditions", e.target.value)
                      }
                      value={inspection?.quality_conditions ?? ""}
                      disabled={inspection.status_email}
                    />
                  </div>
                </div>
              </Card>
              <div className="grid grid-cols-2 gap-2">
                <Card>
                  <div className="flex flex-col gap-4 p-4">
                    <div className="text-md text-primary pb-2">
                      Evaluated parameters
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <div className="text-md text-primary pb-2">Color</div>
                        <Input
                          placeholder="Color"
                          onChange={(e) =>
                            handleChange(
                              `qc_color`, // Cambiado a campo de inspección
                              e.target.value
                            )
                          }
                          value={inspection.qc_color ?? ""} // Cambiado a campo de inspección
                          disabled={inspection.status_email}
                        />
                        <div className="flex items-center">
                          <Input
                            placeholder="%"
                            type="number"
                            min={0}
                            max={100}
                            onChange={(e) =>
                              handleChange(
                                `qc_color_description`, // Cambiado a campo de inspección
                                e.target.value
                              )
                            }
                            value={inspection.qc_color_description ?? ""} // Cambiado a campo de inspección
                            disabled={inspection.status_email}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <div className="text-md text-primary pb-2">Size</div>
                        <Input
                          placeholder="Size"
                          onChange={(e) =>
                            handleChange(
                              `qc_size`, // Cambiado a campo de inspección
                              e.target.value
                            )
                          }
                          value={inspection.qc_size ?? ""} // Cambiado a campo de inspección
                          disabled={inspection.status_email}
                        />
                        <div className="flex items-center">
                          <Input
                            placeholder="%"
                            type="number"
                            min={0}
                            max={100}
                            onChange={(e) =>
                              handleChange(
                                `qc_size_description`, // Cambiado a campo de inspección
                                e.target.value
                              )
                            }
                            value={inspection.qc_size_description ?? ""} // Cambiado a campo de inspección
                            disabled={inspection.status_email}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <div className="text-md text-primary pb-2">Brix</div>
                        <Input
                          placeholder="Brix"
                          onChange={(e) =>
                            handleChange(
                              `qc_brix`, // Cambiado a campo de inspección
                              e.target.value
                            )
                          }
                          value={inspection.qc_brix ?? ""} // Cambiado a campo de inspección
                          disabled={inspection.status_email}
                        />
                        <div className="flex items-center">
                          <Input
                            placeholder="%"
                            type="number"
                            min={0}
                            max={100}
                            onChange={(e) =>
                              handleChange(
                                `qc_brix_description`, // Cambiado a campo de inspección
                                e.target.value
                              )
                            }
                            value={inspection.qc_brix_description ?? ""} // Cambiado a campo de inspección
                            disabled={inspection.status_email}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <div className="text-md text-primary pb-2">Flavor</div>
                        <Input
                          placeholder="Flavor"
                          onChange={(e) =>
                            handleChange(
                              `qc_flavor`, // Cambiado a campo de inspección
                              e.target.value
                            )
                          }
                          value={inspection.qc_flavor ?? ""} // Cambiado a campo de inspección
                          disabled={inspection.status_email}
                        />
                        <div className="flex items-center">
                          <Input
                            placeholder="%"
                            type="number"
                            min={0}
                            max={100}
                            onChange={(e) =>
                              handleChange(
                                `qc_flavor_description`, // Cambiado a campo de inspección
                                e.target.value
                              )
                            }
                            value={inspection.qc_flavor_description ?? ""} // Cambiado a campo de inspección
                            disabled={inspection.status_email}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <div className="text-md text-primary pb-2">
                          Skin defects
                        </div>
                        <Input
                          placeholder="Skin defects"
                          onChange={(e) =>
                            handleChange(
                              `qc_skin_defects`, // Cambiado a campo de inspección
                              e.target.value
                            )
                          }
                          value={inspection.qc_skin_defects ?? ""} // Cambiado a campo de inspección
                          disabled={inspection.status_email}
                        />
                        <div className="flex items-center">
                          <Input
                            placeholder="%"
                            type="number"
                            min={0}
                            max={100}
                            onChange={(e) =>
                              handleChange(
                                `qc_skin_defects_description`, // Cambiado a campo de inspección
                                e.target.value
                              )
                            }
                            value={inspection.qc_skin_defects_description ?? ""} // Cambiado a campo de inspección
                            disabled={inspection.status_email}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <div className="text-md text-primary pb-2">
                          Firmness
                        </div>
                        <Input
                          placeholder="Firmness"
                          onChange={(e) =>
                            handleChange(
                              `qc_firmness`, // Cambiado a campo de inspección
                              e.target.value
                            )
                          }
                          value={inspection.qc_firmness ?? ""} // Cambiado a campo de inspección
                          disabled={inspection.status_email}
                        />
                        <div className="flex items-center">
                          <Input
                            placeholder="%"
                            type="number"
                            min={0}
                            max={100}
                            onChange={(e) =>
                              handleChange(
                                `qc_firmness_description`, // Cambiado a campo de inspección
                                e.target.value
                              )
                            }
                            value={inspection.qc_firmness_description ?? ""} // Cambiado a campo de inspección
                            disabled={inspection.status_email}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <div className="text-md text-primary pb-2">Decay</div>
                        <Input
                          placeholder="Decay"
                          onChange={(e) =>
                            handleChange(
                              `qc_decay`, // Cambiado a campo de inspección
                              e.target.value
                            )
                          }
                          value={inspection.qc_decay ?? ""} // Cambiado a campo de inspección
                          disabled={inspection.status_email}
                        />
                        <div className="flex items-center">
                          <Input
                            placeholder="%"
                            type="number"
                            min={0}
                            max={100}
                            onChange={(e) =>
                              handleChange(
                                `qc_decay_description`, // Cambiado a campo de inspección
                                e.target.value
                              )
                            }
                            value={inspection.qc_decay_description ?? ""} // Cambiado a campo de inspección
                            disabled={inspection.status_email}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                <div className="flex flex-col gap-2">
                  <Card>
                    <CardContent>
                      <div className="flex flex-col gap-4 p-4">
                        <div className="flex flex-col gap-1">
                          <div className="text-md text-primary pb-2">
                            Final Recomendations
                          </div>
                          <Textarea
                            placeholder="Final Recomendations"
                            className="h-32"
                            onChange={(e) =>
                              handleChange(
                                "final_recomendations",
                                e.target.value
                              )
                            }
                            value={inspection?.final_recomendations ?? ""}
                            disabled={inspection.status_email}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <div className="flex flex-col gap-4 p-4">
                        <div className="flex flex-col gap-1">
                          <div className="text-md text-primary pb-2">
                            Observations
                          </div>
                          <Textarea
                            placeholder="Observations"
                            className="h-32"
                            onChange={(e) =>
                              handleChange("observations", e.target.value)
                            }
                            value={inspection?.observations ?? ""}
                            disabled={inspection.status_email}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="photos">
            <PhotoGallery
              inspection_id={inspection_id}
              disabled={inspection.status_email || false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InspectionIdPage;
