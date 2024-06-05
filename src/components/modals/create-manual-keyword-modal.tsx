'use client'

import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
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
import { Loader2Icon, PlusIcon, TrashIcon } from "lucide-react"
import { KeywordType } from "@/lib/db/schema/keyword"
import { ScrollArea } from "../ui/scroll-area"
import { cn } from "@/lib/utils"
import { getUserSubscriptionPlan } from "@/lib/stripe/stripe"
import PredictiveInput from "../global/predictive-input"

interface Props {
  orderedData: any
  setOrderedData: any
  secondary?: boolean
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>> 
}

const CreateManualKeywordModal = ({ orderedData, setOrderedData, secondary, subscriptionPlan }: Props) => {

  // const { isOpen, onClose, onOpen, data } = useCreateManualKeywordModal()

  // const { setOrderedData, orderedData } = data

  const params = useParams()
  const router = useRouter()

  const { mutate: deleteMutation, isPending: isDeletePending } = trpc.keyword.deleteManualKeyword.useMutation({
    onError: (err) => {
      toast.error('Something went wrong while deleting the keyword. Please try again later.')
    },
    onSuccess: ({ allKeywords }) => {
      setOrderedData(allKeywords)
    }
  })

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

      toast.error('Something went wrong while creating the keyword. Please try again later.')
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

 const handleDelete = (keywordId: string) => {
    deleteMutation({ projectId: params.projectId as string, keywordId })
 }

 const manualKeywords = orderedData.filter((keyword: Pick<KeywordType, 'id' | 'content' | 'order' | 'columnId' | 'manual' | 'originalColumnId'>) => keyword.originalColumnId === '3');

  return (
    <Dialog>
      <DialogTrigger>
       {!secondary ? (
         <Button variant={'outline'} size={'sm'} className='bg-transparent mb-2 ml-3 hover:bg-neutral-700'>
          <PlusIcon/>
        </Button>
       ) : (
        <Button  variant={'outline'} className='bg-transparent mb-2 ml-3 hover:bg-neutral-700 mt-4'>
            Create your own Keyword <PlusIcon className='ml-2'/>
       </Button>
       )}
      </DialogTrigger>
      <DialogContent className="dark:bg-[#1e1e1e] max-w-lg">
        <Card>
         <CardHeader>
           <CardTitle>Create A Keyword</CardTitle>
           <CardDescription className="dark:text-neutral-400">
             Here you can create your own keywords to have a more personalized post seaching.
             {/* <span className="text-sx text-muted-foreground">
              (You can only create up to 5 keywords)
             </span> */}
           </CardDescription>
         </CardHeader>
         <CardContent>
         
          <div>
         <div className="flex items-center justify-between">
          <small className=' bg-green-400/20 text-green-500 p-1 font-medium rounded-md'>
            Keywords
          </small>
          <small className="font-medium text-xs text-muted-foreground">
            {orderedData.length} / {subscriptionPlan.keywords}
          </small>
         </div>
          <ScrollArea className={cn("h-[135px] mt-2", manualKeywords.length <= 1 && 'h-[80px]')}>
            {manualKeywords.length > 0 ? manualKeywords.map((k: Pick<KeywordType, 'id' | 'content' | 'order' | 'columnId' | 'originalColumnId' | 'manual'>, index: number) => (
                <div key={index} className="truncate border-2 dark:border-transparent border-neutral-200 py-2 mt-3 px-4 text-sm bg-white dark:bg-[#363636] rounded-md shadow-sm font-medium">
                 <div className="flex items-center justify-between">
                   {k.content}
                   <Button disabled={isDeletePending} onClick={() => handleDelete(k.id as string)} size={'sm'} className="bg-red-400/20 text-red-500 border-2 border-red-500 hover:bg-red-400/40"><TrashIcon className='w-5 h-5'/></Button>
                 </div>
              </div>
            )) : (
              <div>

              </div>
            )}
            </ScrollArea>
          </div>
           <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 mt-4'>
            <FormField disabled={isPending} control={form.control} name='content' render={({ field }) => (
                <FormItem className='flex-1'>
                    <FormLabel>
                      Your Keyword
                    </FormLabel>
                    <FormControl>
                         {/* <Input placeholder='Write your keyword' {...field}/> */}
                         <PredictiveInput/>
                         {/* <PredictiveInput2/> */}
                    </FormControl>
                    <FormMessage/>
                 </FormItem>
                )}/>
                  <Button type='submit' disabled={isPending || orderedData.length >= subscriptionPlan.keywords!} className='text-white w-full'>
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
