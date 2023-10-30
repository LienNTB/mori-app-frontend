import HomePage from './homepage/page';
import * as bookRequest from "./redux/saga/requests/book"


async function generateStaticParams() {

  const res = await bookRequest.getAllBooksRequest()
  return ({
    books: res.books
  })

}
export default async function Home() {
  const books = await generateStaticParams()

  return <div>
    <HomePage books={books} />
  </div>;
}
