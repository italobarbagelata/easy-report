"use client";
import React, { useState, useEffect } from "react";
import { createActionsForTable } from "@/actions"; // Asegúrate de importar createActionsForTable
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  User,
  Truck,
  Package,
  Image,
  Tag,
  List,
  Globe,
  Camera,
  Shield,
  PieChart,
  BookOpen,
  Box,
  Anchor,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Item {
  name: string;
  table: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const items: Item[] = [
  { name: "Color", table: "color", Icon: Home },
  { name: "Dispatch", table: "dispatch", Icon: Truck },
  { name: "Exporter", table: "exporter", Icon: Package },
  { name: "Final Overall", table: "final_overall", Icon: Image },
  { name: "Label", table: "label", Icon: List },
  { name: "List Sizes", table: "list_sizes", Icon: Globe },
  { name: "Package", table: "package", Icon: Camera },
  { name: "Phyto China", table: "phyto_china", Icon: Shield },
  { name: "Quality", table: "quality", Icon: BookOpen },
  { name: "Sizes", table: "sizes", Icon: Box },
  { name: "Specie", table: "specie", Icon: Anchor },
  { name: "Variety", table: "variety", Icon: Home },
  { name: "Weight", table: "weight", Icon: User },
];

interface ListNavProps {
  onSelect: (table: string) => void;
}

function ListNav({ onSelect }: ListNavProps) {
  return (
    <div>
      {items.map((item, index) => (
        <Link
          key={index}
          className="flex items-center gap-4 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          href="#"
          onClick={() => onSelect(item.table)}
        >
          <item.Icon className="h-5 w-5" />
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
}

interface DataItem {
  id: string;
  description: string;
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [newDescription, setNewDescription] = useState("");
  const [currentTable, setCurrentTable] = useState("color");
  const [actions, setActions] = useState(() => createActionsForTable("color"));
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setActions(createActionsForTable(currentTable));
  }, [currentTable]);

  useEffect(() => {
    fetchData();
  }, [actions, page]);

  const fetchData = async () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage - 1;
    const result = await actions.read(startIndex, endIndex);
    console.log(result);
    setData(result || []);
  };

  const handleAddItem = async () => {
    if (newDescription) {
      await actions.create({ description: newDescription });
      setNewDescription("");
      fetchData();
    }
  };

  const handleDeleteItem = async (id: string) => {
    await actions.deleteById(id);
    fetchData();
  };

  const handlePreviousPage = () => setPage(Math.max(1, page - 1));
  const handleNextPage = () => setPage(page + 1);

  return (
    <div className="flex flex-col gap-4 relative">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        Data
      </h1>
      <main className="flex flex-col gap-4 p-4 md:flex-row md:gap-8 md:p-8 w-full">
        <div className="grid gap-4">
          <div className="">
            <Card className="xl:col-span-2">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-4">
                  <CardTitle>Tablas</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ListNav onSelect={setCurrentTable} />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="grid gap-4">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-4">
                <CardTitle>
                  {currentTable.charAt(0).toUpperCase() + currentTable.slice(1)}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder={`Add a new ${currentTable}`}
                  className="p-2 border"
                />
                <Button onClick={handleAddItem}>Add</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 flex-grow">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-4">
                <CardTitle>
                  {currentTable.charAt(0).toUpperCase() + currentTable.slice(1)}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination className="pt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={handlePreviousPage} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" onClick={handleNextPage} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
