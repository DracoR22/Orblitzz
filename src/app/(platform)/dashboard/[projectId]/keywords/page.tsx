import Heading from "@/components/global/heading"
import KeywordsContainer from "@/components/keywords/keywords-container"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/db"
import { keywords } from "@/lib/db/schema/keyword"
import { eq } from "drizzle-orm"

const columns = [
  {
    id: '1',
    title: 'Chosen Keywords',
    isAdded: true
  },
  {
    id: '2',
    title: 'Suggested Keywords',
    isAdded: false,
  }
]

// const keywords = [
//   {
//     id: '1',
//     content: 'This one is added',
//     order: 1,
//     columnId: '1'
//   },
//   {
//     id: '2',
//     content: 'This one is not added',
//     order: 1,
//     columnId: '2'
//   },
//   {
//     id: '3',
//     content: 'This one is added as well',
//     order: 2,
//     columnId: '1'
//   },
// ]

const KeywordsPage = async ({ params }: { params: { projectId: string }}) => {

  //  const serverKeywords = await db.select({
  //    id: keywords.id,
  //    order: keywords.order,
  //    content: keywords.content,
  //    columnId: keywords.columnId
  //  }).from(keywords).where(eq(keywords.redditCampaignId, params.projectId)).orderBy(keywords.order.asc())

   const serverKeywords = await db.query.keywords.findMany({
    columns: {
      id: true,
      columnId: true,
      order: true,
      content: true
    },
    where: eq(keywords.redditCampaignId, params.projectId),
    orderBy: (keywords, { asc }) => [asc(keywords.order)]
   })

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
           <Heading title='Keywords' description="Drag and drop the AI generated keywords to
            the 'Chosen Keywords' column to add the into your project. We will search for posts
            based on the keywords you chose"/>
        </div>
        <Separator/>
      </div>
      {/* DRAG AND DROP */}
      <div className="flex justify-center dark:bg-neutral-800 bg-neutral-100 mx-10 rounded-md py-6">
        <KeywordsContainer columns={columns} keywords={serverKeywords} projectId={params.projectId}/>
      </div>
    </>
  )
}

export default KeywordsPage