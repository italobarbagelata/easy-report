"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Inspection } from "@/interfaces/inspection";
import { createInspection, fetchInspections } from "@/store/inspection/actions";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUsers } from "@/store/user/actions";
import { FilePlus, Save } from "lucide-react";
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
    dispatch(fetchInspections());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleNew = () => {
    dispatch(createInspection(user.id)).then((inspection) => {
      console.log(inspection);
      router.push('/inspection/' + inspection);
    });
  };

  return (
    <div className="flex flex-col relative overflow-scroll max-h-screen bg-muted/40">
      <div className="flex items-center sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg border-b">
        <div className="text-sm md:text-4xl">INSPECTIONS</div>
        <Button
          variant="outline"
          size="lg"
          className="ml-auto"
          onClick={handleNew}
          aria-label="Save"
        >
          <FilePlus className="h-6 w-6 mr-2" />
          <div className="text-xl hidden md:block">New</div>
        </Button>
      </div>
      <div className="flex flex-col gap-4 m-4 mb-40">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID / Status</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Dispatch / Package</TableHead>
                  <TableHead>Types</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.map((inspection: Inspection) => (
                  <TableRow
                    key={inspection.id}
                    onClick={() =>
                      navigate.push(`/inspection/${inspection.id}`)
                    }
                    className="cursor-pointer transition-colors duration-200 ease-in-out"
                  >
                    <TableCell className="p-1">
                      <div className="flex flex-row items-center">
                        <p className="whitespace-no-wrap mr-3">
                          {inspection.id}
                        </p>
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                            inspection.status_email
                              ? "text-green-900 bg-green-200"
                              : "text-red-900 bg-red-200"
                          }`}
                        >
                          <span
                            aria-hidden
                            className="absolute inset-0 opacity-50 rounded-full"
                          ></span>
                          <span className="relative">
                            {inspection.status_email ? "Sender" : "Not Sender"}
                          </span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="p-1">
                      <p className="whitespace-no-wrap">
                        {inspection.label?.description || "No Label"}
                      </p>
                      <p className="whitespace-no-wrap">
                        {inspection.exporter?.description || "No Exporter"}
                      </p>
                      <p className="whitespace-no-wrap">
                        {inspection.phyto_china?.description ||
                          "No Phyto China"}
                      </p>
                    </TableCell>
                    <TableCell className="p-1">
                      <p className="whitespace-no-wrap">
                        {inspection.dispatch?.description || "No Dispatch"}
                      </p>
                      <p className="whitespace-no-wrap">
                        {inspection.package?.description || "No Package"}
                      </p>
                    </TableCell>
                    <TableCell className="p-1">
                      <p className="whitespace-no-wrap">
                        {inspection.weight?.description || "No Weight"}
                      </p>
                      <p className="whitespace-no-wrap">
                        {inspection.color?.description || "No Color"}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InspectionPage;
