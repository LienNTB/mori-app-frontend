import ToastContainerWrapper from '@/components/ToastContainerWrapper/ToastContainerWrapper';
import HomePage from './homepage/page';
import * as bookRequest from "./redux/saga/requests/book"
import * as tagRequest from './redux/saga/requests/tag'

async function generateStaticParams() {

  const bookRes = await bookRequest.getAllBooksRequest()
  const tagRes = await tagRequest.getAllTagsRequest()
  return ({
    books: bookRes.books,
    tags: tagRes.allTags
  })

}
export default async function Home() {
  const { books, tags } = await generateStaticParams()

  return <div>
    <HomePage books={books} tags={tags} />
    <ToastContainerWrapper />
  </div>;
}
