"use client";
import React, { useEffect } from "react";
import { Card } from "@/components/ui";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { fetchInspections } from "@/store/inspection/actions";
import Bar7Days from "@/components/echart/Bar7Days";
import BarPhythoChina from "@/components/echart/BarPhythoChina";

const DashboardPage = () => {
  const dispatch: AppDispatch = useDispatch();

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

  return (
    <div className="flex flex-col overflow-scroll">
      <div className="flex items-center sticky top-0 z-[10] h-[65px] px-4 bg-background/50 backdrop-blur-lg border-b">
        <div className="text-sm md:text-2xl">Dashboard</div>
      </div>
      <div className="flex flex-col p-4 bg-muted/40 gap-4 h-screen">
        <div className="flex flex-row gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Inspections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{inspections.length}</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-row gap-4">
        <Card className="w-8/12">
          <p className="text-2xl font-bold px-8 pt-4">
            Last 7 days inspections
          </p>
          <Bar7Days inspections={inspections} />
        </Card>
        <Card className="w-8/12">   
          <p className="text-2xl font-bold px-8 pt-4">
            Phyto China inspections
          </p>
          <BarPhythoChina inspections={inspections} />
        </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
