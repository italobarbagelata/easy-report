"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Car, Save } from "lucide-react";

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
import QualityCardContainer from "@/components/app/quality-card-container";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchInspection,
  updateInspection,
  updateInspectionSuccess,
} from "@/store/inspection/actions";
import { Inspection, InspectionElement } from "@/interfaces/inspection";
import {
  fetchQualityCommentsById,
  saveQualityComments,
  updateQualityCommentsById,
} from "@/store/quality/actions";
import { fetchUsers } from "@/store/user/actions";
import { jsPDF } from "jspdf";

interface Props {
  params: {
    inspection_id: number;
  };
}

const DashboardPage = ({ params }: Props) => {
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

  const user = useSelector((state: RootState) => state.user.users);

  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    dispatch(fetchInspection(inspection_id));
    dispatch(fetchQualityCommentsById(inspection_id));
    dispatch(fetchUsers());
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
    if (inspection) {
      dispatch(updateInspection(inspection_id, inspection));
    }
    dispatch(saveQualityComments(user.id, quality_comments));
  };

  const generateJSPDF = () => {
    const doc = new jsPDF();
    //add img jspdf
    doc.addImage("../kingo_pdf.png", "PNG", 17, 3, 42, 22);
    doc.setFontSize(16);
    doc.text("Inspection Quality Report", 75, 10);
    doc.setFontSize(12);
    //Report date 2024-06-12 Inspected By Juan Pablo Carrasco
    doc.text("Report date: " + date?.toLocaleDateString(), 75, 20);
    doc.text("Inspected By: " + "italo", 125, 20);

    doc.setFontSize(16);
    doc.rect(10, 28, 190, 10);
    doc.text("Preliminary Information", 75, 35);

    doc.setFontSize(12);
    doc.text("Exporter: ", 15, 45);
    doc.text(inspection?.exporter?.description ?? "", 55, 45);
    doc.text("Label: ", 15, 55);
    doc.text(inspection?.label?.description ?? "", 55, 55);
    doc.text("Place: ", 15, 65);
    doc.text(inspection?.place ?? "", 55, 65);
    doc.text("Phyto China: ", 15, 75);
    doc.text(inspection?.phyto_china?.description ?? "", 55, 75);
    doc.text("Dispatch: ", 15, 85);
    doc.text(inspection?.dispatch?.description ?? "", 55, 85);

    doc.setFontSize(16);
    doc.rect(10, 93, 190, 10);
    doc.text("Packaging Format", 75, 100);

    doc.setFontSize(12);
    doc.text("Package: ", 15, 110);
    doc.text(inspection?.package?.description ?? "", 55, 110);
    doc.text("Weight (format): ", 15, 120);
    doc.text(inspection?.weight?.description ?? "", 55, 120);

    doc.setFontSize(16);
    doc.rect(10, 128, 190, 10);
    doc.text("Detailed Information (Sticker)", 75, 135);

    doc.setFontSize(12);

    doc.text("Species: ", 15, 145);
    doc.text(inspection?.species?.description ?? "", 55, 145);
    doc.text("Variety: ", 15, 155);
    doc.text(inspection?.variety?.description ?? "", 55, 155);
    doc.text("Grower: ", 15, 165);
    doc.text(inspection?.grower ?? "", 55, 165);
    doc.text("Color: ", 15, 175);
    doc.text(inspection?.color?.description ?? "", 55, 175);

    doc.setFontSize(16);
    doc.rect(10, 183, 190, 10);
    doc.text("Observations", 75, 190);

    doc.setFontSize(12);
    doc.text("Condition Observations", 15, 200);
    doc.text(inspection?.observations ?? "", 15, 210);
    doc.text("Final Recommendations", 15, 220);
    doc.text(inspection?.final_recomendations ?? "", 15, 230);

    //paguina nueva

    doc.addPage();

    doc.setFontSize(16);
    doc.rect(10, 10, 190, 10);
    doc.text("Quality Comments", 75, 17);

    doc.setFontSize(12);

    quality_comments.map((item, index) => {
      doc.rect(10, 25 + index * 70, 190, 10);
      doc.text("Quality Comment " + (index + 1), 75, 32 + index * 70);

      doc.text("Color: ", 15, 42 + index * 70);
      doc.text(item.color_description, 55, 42 + index * 70);
      doc.text("Size: ", 15, 52 + index * 70);
      doc.text(item.size_description, 55, 52 + index * 70);
      doc.text("Minor: ", 15, 62 + index * 70);
      doc.text(item.minor_description, 55, 62 + index * 70);
      doc.text("Firmness: ", 15, 72 + index * 70);
      doc.text(item.firmness_description, 55, 72 + index * 70);
      doc.text("Others: ", 15, 82 + index * 70);
      doc.text(item.others_description, 55, 82 + index * 70);
    });

    doc.output("datauristring", {
      filename: "inspection.pdf",
    });
    setPdfUrl(doc.output("datauristring"));
  };

  return (
    <div className="flex flex-col relative  bg-muted/40 mx-auto h-full overflow-scroll">
      <div className="flex items-center sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg border-b">
        <div className="text-sm">Inspection date</div>
        <Separator orientation="vertical" className="h-6 mx-2" />
        <div className="text-sm mr-2">
          {date &&
            date.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <CalendarIcon className="mr-2 h-4 w-4  cursor-pointer" />
          </PopoverTrigger>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={es}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <div className="text-sm">N°</div>
        <Separator orientation="vertical" className="h-6 mx-2" />
        <div className="text-sm">#{inspection_id}</div>
        <Button
          variant="outline"
          size="lg"
          className="ml-auto"
          onClick={handleSubmit}
          aria-label="Save"
        >
          <Save className="h-6 w-6 mr-2" />
          <div className="text-xl hidden md:block">Save</div>
        </Button>
        <Button onClick={generateJSPDF}>Generar PDF</Button>
      </div>
      <div className="flex flex-row m-4 gap-4  w-1/2 mx-auto">
        <div className="flex flex-col flex-1 gap-4">
        <div className="flex flex-row flex-1 gap-4">
          <Card>
            <CardContent>
              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-row gap-4 items-center">
                  <div className="text-md">Inspection date</div>
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  <div className="text-md mr-2">
                    {date &&
                      date.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <CalendarIcon className="mr-2 h-4 w-4  cursor-pointer" />
                    </PopoverTrigger>
                    <Separator orientation="vertical" className="h-6 mx-2" />
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={es}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="text-md">N°</div>
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  <div className="text-md">#{inspection_id}</div>
                </div>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col flex-1 gap-1">
                    <div className="text-md text-primary"> Grower</div>
                    <Input
                      placeholder="Grower"
                      onChange={(e) => handleChange("grower", e.target.value)}
                      value={inspection?.grower ?? ""}
                    />
                  </div>
                  <Separator orientation="vertical" className="h-22 mx-2" />
                  <div className="flex flex-col flex-1 gap-1">
                    <div className="text-md text-primary"> Package</div>
                    <Select
                      onValueChange={(value) => handleChange("package", value)}
                      value={inspection?.package?.id}
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
                </div>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <div className="text-md text-primary">Label</div>
                    <Select
                      onValueChange={(value) => handleChange("label", value)}
                      value={inspection?.label?.id}
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
                    <div className="text-md text-primary"> Weight</div>
                    <Select
                      onValueChange={(value) => handleChange("weight", value)}
                      value={inspection?.weight?.id}
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
                    <div className="text-md text-primary"> Grower</div>
                    <Input
                      placeholder="Grower"
                      onChange={(e) => handleChange("grower", e.target.value)}
                      value={inspection?.grower ?? ""}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <div className="text-md text-primary"> Dispatch</div>
                    <Select
                      onValueChange={(value) => handleChange("dispatch", value)}
                      value={inspection?.dispatch?.id}
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
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex flex-col gap-4 p-4">
          
  
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <div className="text-md text-primary">Label</div>
                    <Select
                      onValueChange={(value) => handleChange("label", value)}
                      value={inspection?.label?.id}
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
                    <div className="text-md text-primary"> Weight</div>
                    <Select
                      onValueChange={(value) => handleChange("weight", value)}
                      value={inspection?.weight?.id}
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
                    <div className="text-md text-primary"> Grower</div>
                    <Input
                      placeholder="Grower"
                      onChange={(e) => handleChange("grower", e.target.value)}
                      value={inspection?.grower ?? ""}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <div className="text-md text-primary"> Dispatch</div>
                    <Select
                      onValueChange={(value) => handleChange("dispatch", value)}
                      value={inspection?.dispatch?.id}
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
            </CardContent>
          </Card>
          </div>
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
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex flex-col gap-4 p-4">
                <div className="text-md text-primary pb-2">
                  Evaluated parameters
                </div>
                <div className="grid grid-row-2 gap-4">
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-md text-primary pb-2">Color</div>
                    <Input
                      placeholder="Color"
                      onChange={(e) => handleChange("color", e.target.value)}
                      value={inspection?.color?.description ?? ""}
                    />
                    <Input
                      placeholder="%"
                      onChange={(e) => handleChange("color", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-md text-primary pb-2">Size</div>
                    <Input
                      placeholder="Size"
                      onChange={(e) => handleChange("size", e.target.value)}
                    />
                    <Input
                      placeholder="%"
                      onChange={(e) => handleChange("color", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-md text-primary pb-2">Brix</div>
                    <Input
                      placeholder="Size"
                      onChange={(e) => handleChange("size", e.target.value)}
                    />
                    <Input
                      placeholder="%"
                      onChange={(e) => handleChange("color", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-md text-primary pb-2">Flavor</div>
                    <Input
                      placeholder="Size"
                      onChange={(e) => handleChange("size", e.target.value)}
                    />
                    <Input
                      placeholder="%"
                      onChange={(e) => handleChange("color", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-md text-primary pb-2">Skin defects</div>
                    <Input
                      placeholder="Size"
                      onChange={(e) => handleChange("size", e.target.value)}
                    />
                    <Input
                      placeholder="%"
                      onChange={(e) => handleChange("color", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-md text-primary pb-2">Firmness</div>
                    <Input
                      placeholder="Size"
                      onChange={(e) => handleChange("size", e.target.value)}
                    />
                    <Input
                      placeholder="%"
                      onChange={(e) => handleChange("color", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-md text-primary pb-2">Decay</div>
                    <Input
                      placeholder="Size"
                      onChange={(e) => handleChange("size", e.target.value)}
                    />
                    <Input
                      placeholder="%"
                      onChange={(e) => handleChange("color", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
