"use client";
import { updateTech } from '@/actions/techs/update-tech';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Techs } from '@prisma/client'
import { Loader2 } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import React, { useActionState } from 'react'

const EditTechPage = ({ tech }: { tech: Techs }) => {

    const [state,updateAction,isPending] = useActionState(updateTech.bind(null,tech.id),{
        success:false,
        error:undefined
    })
  return (
     <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Technology</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={updateAction} 
            className="space-y-4"
          >
              {/* Success Message */}
            {state.success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                Technology updated successfully! Redirecting...
              </div>
            )}
            
            {/* Error Message */}
            {state.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {state.error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                defaultValue={tech.name}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="path" className="block text-sm font-medium">
                Image URL
              </label>
              <Input
                type='file'
                id="path"
                name="path"
                defaultValue={tech.path}
                required
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10">
                <Image
                  src={tech.path}
                  alt={tech.name}
                  fill
                  className="object-contain bg-white"
                />
              </div>
              <span>{tech.name}</span>
            </div>
            <div className="flex gap-2">
              <Button disabled={isPending} type="submit"> {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Changes"}</Button>
              <Link href="/me/techs">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditTechPage