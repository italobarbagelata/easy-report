import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { QualityComments } from "@/interfaces/inspection";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchQualityCommentsSuccess, setQualityCommentsStore, updateQualityCommentsById } from "@/store/quality/actions";


const QualityComponent: React.FC<{ id: number }> = ({ id }) => {
  const [qualityComments, setQualityComments] = useState<QualityComments | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const quality_comments = useSelector(
    (state: RootState) => state.quailty.quality_comments
  );

  useEffect(() => {
    const currentComment = quality_comments.find((comment: QualityComments) => comment.id === id);
    if (currentComment) {
      setQualityComments(currentComment);
    }
  }, [id, quality_comments]);



  const handleSelectChange = (value: string, field: keyof QualityComments) => {
    if (qualityComments) {
      const updatedComment = { ...qualityComments, [field]: value };
      setQualityComments(updatedComment);
      dispatch(setQualityCommentsStore(updatedComment));
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    field: keyof QualityComments
  ) => {
    if (qualityComments) {
      const updatedComment = { ...qualityComments, [field]: event.target.value };
      console.log(updatedComment);
      setQualityComments(updatedComment);
      dispatch(setQualityCommentsStore(updatedComment));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <div className="w-44">
          <Select
            onValueChange={(e) => handleSelectChange(e, "color")}
            value={qualityComments?.color}
          >
            <SelectTrigger>
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="1" value="ok">
                Ok
              </SelectItem>
              <SelectItem key="2" value="not">
                Not
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea
          placeholder="Color description"
          value={qualityComments?.color_description}
          onChange={(e) => handleInputChange(e, "color_description")}
        />
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-44">
          <Select
            onValueChange={(e) => handleSelectChange(e, "size")}
            value={qualityComments?.size}
          >
            <SelectTrigger>
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="1" value="ok">
                Ok
              </SelectItem>
              <SelectItem key="2" value="not">
                Not
                </SelectItem>
              </SelectContent>
          </Select>
        </div>
        <Textarea
          placeholder="Size Description"
          value={qualityComments?.size_description}
          onChange={(e) => handleInputChange(e, "size_description")}
        />
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-44">
          <Select
            onValueChange={(e) => handleSelectChange(e, "minor")}
            value={qualityComments?.minor}
          >
            <SelectTrigger>
              <SelectValue placeholder="Minor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="1" value="ok">
                Ok
              </SelectItem>
              <SelectItem key="2" value="not">
                Not
                </SelectItem>
              </SelectContent>
          </Select>
        </div>
        <Textarea
          placeholder="Minor Description"
          value={qualityComments?.minor_description}
          onChange={(e) => handleInputChange(e, "minor_description")}
        />
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-44">
          <Select
            onValueChange={(e) => handleSelectChange(e, "firmness")}
            value={qualityComments?.firmness}
          >
            <SelectTrigger>
              <SelectValue placeholder="Firmness" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="1" value="ok">
                Ok
              </SelectItem>
              <SelectItem key="2" value="not">
                Not
                </SelectItem>
              </SelectContent>
          </Select>
        </div>
        <Textarea
          placeholder="Firmness Description"
          value={qualityComments?.firmness_description}
          onChange={(e) => handleInputChange(e, "firmness_description")}
        />
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-44">
          <Select
            onValueChange={(e) => handleSelectChange(e, "others")}
            value={qualityComments?.others}
          >
            <SelectTrigger>
              <SelectValue placeholder="Others" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="1" value="ok">
                Ok
              </SelectItem>
              <SelectItem key="2" value="not">
                Not
                </SelectItem>
              </SelectContent>
          </Select>
        </div>
        <Textarea
          placeholder="Others Description"
          value={qualityComments?.others_description}
          onChange={(e) => handleInputChange(e, "others_description")}
        />
      </div>
    </div>
  );
};

export default QualityComponent;
