'use client'

import { useCreateManualKeywordModal } from "@/hooks/modals/use-create-manual-keyword-modal"
import { Dialog, DialogContent } from "../ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { useForm } from "react-hook-form"
import { ZodError, z } from "zod"
import { CreateManualKeywordSchema } from "@/lib/validations/campaign-keywords-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { trpc } from "@/server/trpc/client"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2Icon } from "lucide-react"

const CreateManualKeywordModal = () => {

  const { isOpen, onClose, onOpen, data } = useCreateManualKeywordModal()

  const { setOrderedData } = data

  const params = useParams()
  const router = useRouter()

  const { mutate, isPending } = trpc.keyword.createManualKeyword.useMutation({
    onError: (err) => {
       if (err.data?.code === "UNAUTHORIZED") {
         return toast.error('Please Login to do this action')
       }

       if (err.data?.code === "TOO_MANY_REQUESTS") {
        return toast.error('You can only create up to 5 keywords')
      }

       if (err instanceof ZodError) {
         return toast.error(err.issues[0].message)
       }

      toast.error('Something went wrong while updating your project. Please try again later.')
  },
  onSuccess: ({ allKeywords }) => {
     setOrderedData(allKeywords)
     toast.success('Keyword Created!')
  }
 })

  const form = useForm<z.infer<typeof CreateManualKeywordSchema>>({
    mode: 'onChange',
    resolver: zodResolver(CreateManualKeywordSchema),
    defaultValues: {
      content: '',
      projectId: ''
    },
  })

 const handleSubmit = (values: z.infer<typeof CreateManualKeywordSchema>) => {
    mutate({ content: values.content, projectId: params.projectId as string })
 }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-[#1e1e1e] max-w-lg">
        <Card>
         <CardHeader>
           <CardTitle>Create A Keyword</CardTitle>
           <CardDescription className="dark:text-neutral-400">
             Here you can create your own keywords to have a more personalized post seaching.
           </CardDescription>
         </CardHeader>
         <CardContent>
           <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField disabled={isPending} control={form.control} name='content' render={({ field }) => (
                <FormItem className='flex-1'>
                    <FormLabel>
                      Your Keyword
                    </FormLabel>
                    <FormControl>
                         <Input placeholder='Write your keyword' {...field}/>
                    </FormControl>
                    <FormMessage/>
                 </FormItem>
                )}/>
                  <Button type='submit' disabled={isPending} className='text-white w-full'>
                      {isPending && <Loader2Icon className='mr-2 h-4 w-4 animate-spin'/>}
                      Create
                  </Button>
            </form>
          </Form>
           </div>
         </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default CreateManualKeywordModal
