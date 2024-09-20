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
  fetchQualityCommentsById,
  saveQualityComments,
  updateQualityCommentsById,
} from "@/store/quality/actions";
import { jsPDF } from "jspdf";
import { InspectionElement } from "@/interfaces/inspection";
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

interface Props {
  params: {
    inspection_id: number;
  };
}

const InspectionIdPage = ({ params }: Props) => {
  const inspection_id = params.inspection_id;
  const dispatch: AppDispatch = useDispatch();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [exportersKingo, setExportersKingo] = useState<InspectionElement[]>([]);
  const [labelKingo, setLabelKingo] = useState<InspectionElement[]>([]);
  const [phytoChinaKingo, setPhytoChinaKingo] = useState<InspectionElement[]>(
    []
  );
  const [dispatchKingo, setDispatchKingo] = useState<InspectionElement[]>([]);
  const [packageKingo, setPackageKingo] = useState<InspectionElement[]>([]);
  const [weightKingo, setWeightKingo] = useState<InspectionElement[]>([]);
  const [speciesKingo, setSpeciesKingo] = useState<InspectionElement[]>([]);
  const [varietyKingo, setVarietyKingo] = useState<InspectionElement[]>([]);
  const [colorKingo, setColorKingo] = useState<InspectionElement[]>([]);
  const [finalOverallKingo, setFinalOverallKingo] = useState<
    InspectionElement[]
  >([]);

  const router = useRouter();

  const inspection = useSelector(
    (state: RootState) => state.inspection.inspection
  );

  const quality_comments = useSelector(
    (state: RootState) => state.quailty.quality_comments
  );

  const photos = useSelector((state: RootState) => state.photos.photos);

  const user = useSelector((state: RootState) => state.user.users);

  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    dispatch(fetchInspection(inspection_id));
    dispatch(fetchQualityCommentsById(inspection_id));
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

  async function fetchDataVariety(speciesId: number) {
    let { data: varieties, error } = await supabase
      .from("variety")
      .select("*")
      .eq("id_specie", speciesId)
      .order("id", { ascending: true });

    if (error) console.log("Error: ", error);
    else setVarietyKingo(varieties || []);
  }

  useEffect(() => {
    const fetchData = async (
      entity: string,
      setter: React.Dispatch<React.SetStateAction<InspectionElement[]>>
    ) => {
      const data = createActionsForTable(entity);
      const result = await data.read(0, 100);
      setter(result);
    };

    fetchData("exporter", setExportersKingo);
    fetchData("label", setLabelKingo);
    fetchData("phyto_china", setPhytoChinaKingo);
    fetchData("dispatch", setDispatchKingo);
    fetchData("package", setPackageKingo);
    fetchData("weight", setWeightKingo);
    fetchData("specie", setSpeciesKingo);
    fetchData("color", setColorKingo);
    fetchData("final_overall", setFinalOverallKingo);
  }, []);

  const handleChange = (field: string, value: any): void => {
    if (field === "species") {
      fetchDataVariety(value);
      dispatch(
        updateInspectionSuccess({
          ...inspection,
          [field]: { id: value, description: "" },
        })
      );
    }
    if (
      field === "place" ||
      field === "grower" ||
      field === "observations" ||
      field === "final_recomendations" ||
      field === "extra_details"
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
        const varie = varietyKingo.find((item) => item.id === value);
        if (varie) {
          dispatch(
            updateInspectionSuccess({
              ...inspection,
              [field]: { id: value, description: varie.description },
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
    }
  };

  const handleSubmit = () => {
    if (inspection.id !== undefined) {
      dispatch(updateInspection(inspection_id, inspection));
    }
    dispatch(saveQualityComments(user.id, quality_comments));
  };

  const generateJSPDF = () => {
    const doc = new jsPDF();
    
    // Add logo
    doc.addImage("../kingo_pdf.png", "PNG", 17, 3, 42, 22);
    
    doc.setFontSize(16);
    doc.text("Inspection Quality Report", 75, 10);
    
    // Inspection and date section
    doc.setFontSize(12);
    doc.text("Inspection/Date: " + date?.toLocaleDateString(), 75, 20);
    doc.text("Inspected By: " + "italo", 125, 20);
    
    // Preliminary Info Section
    doc.setFontSize(16);
    doc.rect(10, 28, 190, 10); // Border for the "Preliminary Information" section
    doc.text("Logistics", 15, 35);
    doc.setFontSize(12);
    
    doc.text("Shipper/Grower: ", 15, 45);
    doc.text("Label/Brand: ", 15, 55);
    doc.text("Packaging Format: ", 15, 65);
    doc.text("Weight: ", 15, 75);
    doc.text("Grown Case(s): ", 15, 85);
    doc.text("Available Sizes: ", 15, 95);

    // Product Info Section
    doc.setFontSize(16);
    doc.rect(10, 105, 190, 10);
    doc.text("Product Info", 15, 112);
    
    doc.setFontSize(12);
    doc.text("Species: ", 15, 122);
    doc.text("Variety: ", 15, 132);
    doc.text("Packing Date: ", 15, 142);
    
    // Quality Comments Section
    doc.setFontSize(16);
    doc.rect(10, 150, 190, 10); 
    doc.text("Quality/Condition Comments", 15, 157);
    doc.setFontSize(12);
    doc.text("Comments: ", 15, 170);
    
    // Evaluated Parameters Section
    doc.setFontSize(16);
    doc.rect(10, 185, 90, 10); 
    doc.text("Evaluated Parameters", 15, 192);
    doc.setFontSize(12);
    
    doc.text("Color: ", 15, 202);
    doc.text("Size: ", 15, 212);
    doc.text("Brix: ", 15, 222);
    doc.text("Flavor: ", 15, 232);
    doc.text("Skin defects: ", 15, 242);
    doc.text("Firmness: ", 15, 252);
    doc.text("Decay: ", 15, 262);

    // Final Conclusion Section
    doc.setFontSize(16);
    doc.rect(105, 185, 95, 10);
    doc.text("Final Conclusion", 125, 192);
    doc.setFontSize(12);
    doc.text("Conclusion/Observations: ", 110, 202);

    doc.addPage();

    // Ordenar fotos según el order, dejando las de order 0 al final
    const sortedPhotos = photos.sort(
      (a, b) => (a.order === 0 ? 1 : a.order) - (b.order === 0 ? 1 : b.order)
    );

    //add photos grid 2 x 6 photos
    let x = 10;
    let y = 10;
    let width = 90;
    let height = 60;
    let count = 0;

    sortedPhotos.map((photo, index) => {
      if (count === 8) { // Cambiar a 8 imágenes por página
        doc.addPage(); // Agregar nueva página
        x = 10; // Reiniciar posición x
        y = 10; // Reiniciar posición y
        count = 0; // Reiniciar contador
      }
      doc.addImage(photo.url, "PNG", x, y, width, height);
      x += 100; // Mover posición x para la siguiente imagen
      count++;
      if (count % 2 === 0) { // Cambiar a nueva fila después de 2 imágenes
        x = 10; // Reiniciar posición x
        y += 70; // Mover posición y hacia abajo
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
              {date ? (
                date.toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="h-4 w-4 ml-2 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
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
            <AlertDialogTrigger>
              {" "}
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
      <div className="flex flex-row m-4 gap-4 w-8/12">
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
                        <p className="text-sm">Grower</p>
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
                    </div>
                  </div>
                </Card>
                <Card className="w-full">
                  <div className="flex flex-col gap-4 p-4">
                    <div className="grid grid-rows-6 items-center gap-4">
                      <div className="grid grid-cols-2 gap-2 items-center">
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
                      <div className="grid grid-cols-2 gap-2 items-center">
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
                      <div className="grid grid-cols-2 gap-2 items-center">
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
                      <div className="grid grid-cols-2 gap-2 items-center">
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
              </Card>
              <div className="flex flex-row flex-1 gap-2">
                <div className="flex flex-col flex-1 gap-2">
                  <Card>
                    <div className="flex flex-col gap-4 p-4">
                      <div className="text-md text-primary pb-2">
                        Evaluated parameters
                      </div>
                      <div className="grid grid-row-2 gap-4">
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="text-md text-primary pb-2">Color</div>
                          <Input
                            placeholder="Color"
                            onChange={(e) =>
                              handleChange("color", e.target.value)
                            }
                            value={inspection?.color?.description ?? ""}
                            disabled={inspection.status_email}
                          />
                          <Input
                            placeholder="%"
                            onChange={(e) =>
                              handleChange("color", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="text-md text-primary pb-2">Size</div>
                          <Input
                            placeholder="Size"
                            onChange={(e) =>
                              handleChange("size", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                          <Input
                            placeholder="%"
                            onChange={(e) =>
                              handleChange("color", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="text-md text-primary pb-2">Brix</div>
                          <Input
                            placeholder="Size"
                            onChange={(e) =>
                              handleChange("size", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                          <Input
                            placeholder="%"
                            onChange={(e) =>
                              handleChange("color", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="text-md text-primary pb-2">
                            Flavor
                          </div>
                          <Input
                            placeholder="Size"
                            onChange={(e) =>
                              handleChange("size", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                          <Input
                            placeholder="%"
                            onChange={(e) =>
                              handleChange("color", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="text-md text-primary pb-2">
                            Skin defects
                          </div>
                          <Input
                            placeholder="Size"
                            onChange={(e) =>
                              handleChange("size", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                          <Input
                            placeholder="%"
                            onChange={(e) =>
                              handleChange("color", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="text-md text-primary pb-2">
                            Firmness
                          </div>
                          <Input
                            placeholder="Size"
                            onChange={(e) =>
                              handleChange("size", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                          <Input
                            placeholder="%"
                            onChange={(e) =>
                              handleChange("color", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="text-md text-primary pb-2">Decay</div>
                          <Input
                            placeholder="Size"
                            onChange={(e) =>
                              handleChange("size", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                          <Input
                            placeholder="%"
                            onChange={(e) =>
                              handleChange("color", e.target.value)
                            }
                            disabled={inspection.status_email}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="flex flex-col flex-1 gap-2">
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
                              handleChange("observations", e.target.value)
                            }
                            value={inspection?.observations ?? ""}
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
                            Quality conditions coments
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
