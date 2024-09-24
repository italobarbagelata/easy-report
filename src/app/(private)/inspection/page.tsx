"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Inspection } from "@/interfaces/inspection";
import { createInspection, fetchInspections } from "@/store/inspection/actions";
import { AppDispatch, RootState } from "@/store/store";
import { FileEdit, FilePlus, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const InspectionPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useRouter();
  const router = useRouter();
  const inspections = useSelector(
    (state: RootState) => state.inspection.inspections
  );

  const user = useSelector((state: RootState) => state.user.users);

  useEffect(() => {
    if (user.id !== "0") {
      console.log(user);
      dispatch(fetchInspections(user.id));
    }
  }, [dispatch, user.id]);

  const handleNew = () => {
    dispatch(createInspection(user.id)).then((inspection) => {
      console.log(inspection);
      router.push("/inspection/" + inspection);
    });
  };

  return (
    <div className="flex flex-col relative overflow-scroll max-h-screen">
      <div className="flex items-center sticky top-0 z-[10] p-3 bg-background/50 backdrop-blur-lg border-b">
        <div className="text-sm md:text-2xl">Inspections</div>
        <Button
          variant="secondary"
          className="ml-8"
          onClick={handleNew}
          aria-label="Save"
        >
          <FilePlus className="h-6 w-6 mr-2" />
          <div className="">Add inspection</div>
        </Button>
      </div>
      <div className="flex flex-col p-4 bg-muted/40 m-4">
        <Table>
          <TableBody>
            {inspections.map((inspection: Inspection) => (
              <TableRow
                key={inspection.id}
                onClick={() => navigate.push(`/inspection/${inspection.id}`)}
                className="cursor-pointer transition-colors duration-200 ease-in-out"
              >
                <TableCell className="p-1">
                  <div className="flex flex-row gap-1">
                    <p className="whitespace-no-wrap mr-3 text-xl">
                      #{inspection.id}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Badge
                        variant={
                          inspection.status_email ? "default" : "destructive"
                        }
                      >
                        {inspection.status_email ? "Sender" : "Not Sender"}
                      </Badge>
                      <Badge variant="outline">
                        Photos #{inspection.images || 0}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="p-1">
                  <div className="flex flex-row items-baseline justify-end">
                    <p className="text-xs mr-1">Label</p>
                  </div>
                  <div className="flex flex-row items-baseline justify-end">
                    <p className="text-xs mr-1">Exporter</p>
                  </div>
                  <div className="flex flex-row items-baseline justify-end">
                    <p className="text-xs mr-1">Phyto China</p>
                  </div>
                </TableCell>
                <TableCell className="p-1">
                  <div className="flex flex-row items-baseline">
                    <p className="font-bold">
                      {inspection.label?.description || "No Label"}
                    </p>
                  </div>
                  <div className="flex flex-row items-baseline">
                    <p className="font-bold">
                      {inspection.exporter?.description || "No Exporter"}
                    </p>
                  </div>
                  <div className="flex flex-row items-baseline">
                    <p className="font-bold">
                      {inspection.phyto_china?.description || "No Phyto China"}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="p-1">
                  <div className="flex flex-row items-baseline justify-end">
                    <p className="text-xs mr-1">Dispatch</p>
                  </div>
                  <div className="flex flex-row items-baseline justify-end">
                    <p className="text-xs mr-1">Package</p>
                  </div>
                  <div className="flex flex-row items-baseline justify-end">
                    <p className="text-xs mr-1">Weight</p>
                  </div>
                  <div className="flex flex-row items-baseline justify-end">
                    <p className="text-xs mr-1">Color</p>
                  </div>
                </TableCell>
                <TableCell className="p-1">
                  <p className="whitespace-no-wrap font-bold">
                    {inspection.dispatch?.description || "No Dispatch"}
                  </p>
                  <p className="whitespace-no-wrap font-bold">
                    {inspection.package?.description || "No Package"}
                  </p>
                  <p className="whitespace-no-wrap font-bold">
                    {inspection.weight?.description || "No Weight"}
                  </p>
                  <p className="whitespace-no-wrap font-bold">
                    {inspection.color?.description || "No Color"}
                  </p>
                </TableCell>
                <TableCell className="p-1">
                  <Link href={`/inspection/${inspection.id}`}>
                    <Button
                      variant="secondary"
                      className="mr-2"
                      aria-label="Save"
                      disabled={inspection.status_email}
                    >
                      <FileEdit className="mr-2 h-4 w-4" />
                      <div className="">Edit</div>
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {inspections.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="flex flex-col items-center justify-center"> 
                    <div className="text-xl font-bold">No inspections found</div>
                    <div className="text-sm text-muted-foreground">
                      Click the button above to add a new inspection
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InspectionPage;
