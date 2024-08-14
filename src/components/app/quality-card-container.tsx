import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Copy, SquarePlus, Trash } from "lucide-react";
import QualityComponent from "./quality-comment";
import NewQualityComponent from "./new-quality-comment";
import { QualityComments } from "@/interfaces/inspection";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { addNewQualityCommentStore, deleteQualityComment, deleteQualityCommentsStore } from "@/store/quality/actions";


const QualityCardContainer: React.FC<{ id: number }> = ({ id }) => {
  const [qualityComponents, setQualityComponents] = useState<QualityComments[]>(
    [
      {
        id: Math.floor(Math.random() * 1000000000),
        color: "",
        color_description: "",
        size: "",
        size_description: "",
        minor: "",
        minor_description: "",
        firmness: "",
        firmness_description: "",
        others: "",
        others_description: "",
        id_inspection: id,
      },
    ]
  );
  const quality_comments = useSelector(
    (state: RootState) => state.quailty.quality_comments
  );
  const dispatch: AppDispatch = useDispatch();

  const handleNewCard = () => {
    dispatch(addNewQualityCommentStore(qualityComponents[0]));
  };

  const handleDeleteCard = (id: number) => {
    console.log(id);  
    dispatch(deleteQualityComment(id));
  };

  return (
    <div className="flex flex-col py-2 gap-4 md:flex-row md:flex-wrap md:gap-8">
      {quality_comments?.map((quality_comment) => (
        <Card key={quality_comment.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quality Comments</CardTitle>
              <div className="flex items-center space-x-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => handleDeleteCard(quality_comment.id)}
                    >
                      <Trash />
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger onClick={handleNewCard}>
                      <SquarePlus />
                    </TooltipTrigger>
                    <TooltipContent>New</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <QualityComponent id={quality_comment.id} />
          </CardContent>
        </Card>
      ))}
      {quality_comments.length === 0 && (
        <NewQualityComponent onClick={handleNewCard} />
      )}
    </div>
  );
};

export default QualityCardContainer;
