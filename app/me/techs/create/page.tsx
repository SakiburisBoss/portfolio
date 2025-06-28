"use client";
import { createTech } from "@/actions/techs/create-tech";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useActionState } from "react";

const CreateTechPage = () => {
  const [state, createAction, isPending] = useActionState(createTech, {
    success: false,
    error: undefined,
  });
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Create Tech</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createAction} className="space-y-6">
          <div className="space-y-2">
            <Label>Tech Name</Label>
            <Input type="text" name="name" placeholder="Tech Name" />
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <Input type="file" name="path" />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <span className="animate-pulse">Creating...</span>
            ) : (
              "Create"
            )}
          </Button>
          {state.error && <p className="text-red-500">{state.error}</p>}
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTechPage;
