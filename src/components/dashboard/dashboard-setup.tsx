'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { AlertDialog } from '../ui/alert-dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { RedditCampaignSchema } from '@/lib/validations/reddit-campaign-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodError, z } from 'zod'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Loader2Icon } from 'lucide-react'
import { trpc } from "@/server/trpc/client"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { RedditCampaignType } from '@/lib/db/schema/reddit'
import { Slider } from '../ui/slider'
import { cn } from '@/lib/utils'
import { getUserSubscriptionPlan } from '@/lib/stripe/stripe'

interface Props {
   data?: Partial<RedditCampaignType>
   projectId?: string
   subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const DashboardSetup = ({ data, projectId, subscriptionPlan }: Props) => {

   const router = useRouter()

   const { mutate: keywordMutation } = trpc.keyword.createKeywords.useMutation({
      onError: (err) => {
         if (err.data?.code === "UNAUTHORIZED") {
           return toast.error('Please Login to do this action')
         }

         if (err instanceof ZodError) {
           return toast.error(err.issues[0].message)
         }

        toast.error('Something went wrong while generating keywords. Please try again later.')
    },
    onSuccess: ({ projectId }) => {
      // Redirect or perform other actions as needed
     router.push(`/dashboard/${projectId}/keywords`);
     toast.success('Your project has been created')
     router.refresh()
    }
   })

   const handleCreateKeywordSuccess = async ({ projectId, projectDescription }: { projectId: string, projectDescription: string }) => {
         // Call the keyword mutation here with the projectId
        return await keywordMutation({ projectId, projectDescription });
    };

   const { mutate: createMutation, isPending: isCreatePending } = trpc.reddit.createRedditProject.useMutation({
        onError: (err) => {
             if (err.data?.code === "UNAUTHORIZED") {
               return toast.error('Please Login to do this action')
             }

             if (err instanceof ZodError) {
               return toast.error(err.issues[0].message)
             }

            toast.error('Something went wrong while creating your project. Please try again later.')
        },
        onSuccess: ({ projectId, projectDescription }) => {
           return handleCreateKeywordSuccess({ projectId, projectDescription })
        }
   })

   const { mutate: updateMutation, isPending: isUpdatePending } = trpc.reddit.updateRedditProject.useMutation({
      onError: (err) => {
         if (err.data?.code === "UNAUTHORIZED") {
           return toast.error('Please Login to do this action')
         }

         if (err instanceof ZodError) {
           return toast.error(err.issues[0].message)
         }

        toast.error('Something went wrong while updating your project. Please try again later.')
    },
    onSuccess: () => {
       router.refresh()
       toast.success('Project updated!')
    }
   })

  const form = useForm<z.infer<typeof RedditCampaignSchema>>({
    mode: 'onChange',
    resolver: zodResolver(RedditCampaignSchema),
    defaultValues: {
        image: data?.image || '',
        title: data?.title || '',
        description: data?.description || '',
        url: data?.url || '',
        tone: data?.tone || '',
        autoReply: data?.autoReply || false,
        autoReplyLimit: data?.autoReplyLimit || 1
    },
  })

  const isLoading = form.formState.isSubmitting

  const handleSubmit = (values: z.infer<typeof RedditCampaignSchema>) => {
     if (data && projectId) {
      return updateMutation({ id: projectId, autoReply: values.autoReply, autoReplyLimit: values.autoReplyLimit, description: values.description, title: values.title, tone: values.tone, url: values.url, image: values.image })
     } else {
      return createMutation(values)
     } 
  }

  return (
    <AlertDialog>
        <Card>
        <CardHeader>
          <CardTitle>Create A Project</CardTitle>
           <CardDescription className="dark:text-neutral-400">
            Lets create a project to get you started. You can create
            more projects later on.
           </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>           
                  {/* PROJECT TITLE */}
                  <div className='flex md:flex-row gap-4'>
                     <FormField disabled={isLoading} control={form.control} name='title' render={({ field }) => (
                        <FormItem className='flex-1'>
                           <FormLabel>
                              Project Name  <span className='text-xs text-red-500'> *</span>
                            </FormLabel>
                            <FormControl>
                               <Input placeholder='Your project name' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                     )}/>
                     {/* PROJECT URL */}
                     <FormField disabled={isLoading} control={form.control} name='url' render={({ field }) => (
                        <FormItem className='flex-1'>
                           <FormLabel>
                              URL  <span className='text-xs text-red-500'> *</span>
                            </FormLabel>
                            <FormControl>
                               <Input placeholder='Your project url' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                     )}/>
                  </div>
                   {/* PROJECT DESCRIPTION */}
                   <div className='flex md:flex-row gap-4'>
                     <FormField disabled={isLoading} control={form.control} name='description' render={({ field }) => (
                        <FormItem className='flex-1 flex flex-col'>
                           <FormLabel>
                              Project Description  <span className='text-xs text-red-500'> *</span>
                            </FormLabel>
                            <small className='text-xs text-muted-foreground'>
                              We will generate some keywords based on the description you provided
                            </small>
                            <FormControl>
                               <Textarea readOnly={!!data} placeholder='Type a short description of your project' {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                     )}/>
                  </div>
                  <FormField disabled={isLoading} control={form.control} name='autoReply' render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border gap-4 p-4'>
                       <div>
                         <FormLabel>Auto Replies</FormLabel>
                         <FormDescription>
                            If you turn on autoreplies mode, you can go to the settings tab
                            to limit the amount of the daily replies the AI can make.
                         </FormDescription>
                         <FormControl className='mt-4'>
                          <Switch checked={field.value} onCheckedChange={field.onChange}/>
                         </FormControl>
                         <FormMessage/>
                       </div>
                    </FormItem>
                  )}/>
                  {/* AUTO REPLY LIMIT */}
                   <FormField disabled={isLoading} control={form.control} name='autoReplyLimit' render={({ field }) => (
                     <FormItem className='flex-1 rounded-lg border p-4'>
                        <FormLabel>Auto Reply Daily Limit</FormLabel>
                        <div>
                           <div className='mb-4'>
                             <FormDescription>
                                {field.value} Daily AI Replies
                             </FormDescription>
                           </div>
                           <Slider disabled={!form.watch('autoReply')}
                            onValueChange={(value: number[]) => field.onChange(value[0])} 
                            defaultValue={[field.value]} step={1} 
                            max={subscriptionPlan.repliesPerMonth}/>
                        </div>
                        <FormMessage/>
                     </FormItem>
                   )}/>
                  <FormField disabled={isLoading} control={form.control} name='tone' render={({ field }) => (
                    <FormItem className='flex-1'>
                       <FormLabel>Pick the tone AI replies will have</FormLabel>
                       <Select onValueChange={(value: string) => field.onChange(value)} defaultValue={field.value}>
                          <FormControl>
                             <SelectTrigger>
                                <SelectValue placeholder="Pick AI tone"/>
                             </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="formal">
                                Formal
                            </SelectItem>
                            <SelectItem value="humorous">
                                Humorous
                            </SelectItem>
                            <SelectItem value="inspirational">
                                Inspirational
                            </SelectItem>
                            <SelectItem value="casual">
                                Casual
                            </SelectItem>
                          </SelectContent>
                       </Select>
                       <div className='pt-2 px-2 text-xs bg-green-400/20 text-green-500 p-1 font-medium rounded-md'>
                         {field.value === 'formal' && 'Professional and business-like language. Suitable for serious or formal contexts.'}
                         {field.value === 'humorous' && 'Light-hearted and funny language. Adds a touch of humor to the replies.'}
                         {field.value === 'inspirational' && 'Motivational and uplifting language. Suitable for encouraging users to try new things.'}
                         {field.value === 'casual' && 'Relaxed and friendly language. Ideal for more casual or personal interactions.'}
                       </div>
                    </FormItem>
                  )}/>
                  <Button type='submit' disabled={isLoading || isCreatePending || isUpdatePending} className='text-white w-full'>
                      {isLoading || isCreatePending || isUpdatePending && <Loader2Icon className='mr-2 h-4 w-4 animate-spin'/>}
                       {data ? 'Update' : 'Create'}
                  </Button>
               </form>
            </Form>
        </CardContent>
    </Card>
    </AlertDialog>
  )
}

export default DashboardSetup