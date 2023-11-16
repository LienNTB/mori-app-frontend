import BookCategory from '@/components/BookCategory/BookCategory'
import * as bookRequest from "../../redux/saga/requests/book"

async function generateStaticParams(category) {
  const bookRes = await bookRequest.findBookByCategoryRequest(category)

  return ({
    books: bookRes,
  })
}



const Page = async (params) => {

  const { books } = await generateStaticParams(params.params.slug)

  return (
    <>
      <BookCategory params={params.params.slug} books={books.books} />
    </>
  )
}


export default Page
