import React from "react";
import { Card} from "../ui/card";
import { SquarePlus } from "lucide-react";

interface NewQualityComponentProps {
  onClick: () => void;
}

const NewQualityComponent: React.FC<NewQualityComponentProps> = ({
  onClick,
}) => {
  return (
    <Card onClick={onClick} className="cursor-pointer w-full h-[562px] md:w-[445px]" >
        <div className="flex justify-center items-center h-full">
          <div className="flex items-center space-x-4">
            <SquarePlus />
            <div className="text-sm">New</div>
          </div>
        </div>
    </Card>
  );
};

export default NewQualityComponent;
