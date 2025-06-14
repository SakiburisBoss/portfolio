"use client";
import React, { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { deleteTech } from "@/actions/techs/delete-tech";

type Tech = {
  id: number;
  name: string;
  path: string;
};

type TechsProps = {
  techs: Tech[];
};

const Techs: React.FC<TechsProps> = ({ techs }) => {
  return (
    <div className="p-6">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manage Technologies</CardTitle>
            <Link href="/me/techs/create">
              <Button variant="default" size="sm">
                Add New Tech
              </Button>
            </Link>
          </div>
        </CardHeader>

        {!techs.length ? (
          <CardContent>No technologies found.</CardContent>
        ) : (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {techs.map((tech) => (
                  <TableRow key={tech.id}>
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell>
                      <div className="relative h-10 w-10">
                        <Image
                          src={tech.path}
                          alt={tech.name}
                          fill
                          className="object-contain bg-white"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                       <EditButton techId={tech.id} />
                        <DeleteButton techId={tech.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Techs;

type EditButtonProps = {
  techId: number;
};

const EditButton: React.FC<EditButtonProps> = ({ techId }) => {
  return (
    <Link href={`/me/techs/${techId}/edit`}>
      <Button variant="default" size="icon">
        <Edit className="h-4 w-4" />
      </Button>
    </Link>
  );
};

type DeleteButtonProps = {
  techId: number;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ techId }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={() =>
        startTransition(async () => {
          await deleteTech(techId);
        })
      }
    >
      <Button
        disabled={isPending}
        variant="destructive"
        size="icon"
        type="submit"
      >
        {isPending ? (
          <span className="animate-pulse">...</span>
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};
