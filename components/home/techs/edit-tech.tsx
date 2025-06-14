"use client";
import { updateTech } from '@/actions/techs/update-tech';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Techs } from '@prisma/client'
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
              <Button type="submit">Save Changes</Button>
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