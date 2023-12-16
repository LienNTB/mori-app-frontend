import ToastContainerWrapper from '@/components/ToastContainerWrapper/ToastContainerWrapper';
import HomePage from './homepage/page';
import * as bookRequest from "./redux/saga/requests/book"
import * as tagRequest from './redux/saga/requests/tag'
import { getBookCategoryRequest } from './redux/saga/requests/category';

export async function getStaticProps() {

  const bookRes = await bookRequest.getAllBooksRequest()
  const tagRes = await tagRequest.getAllTagsRequest()
  return ({
    books: bookRes.books,
    tags: tagRes.allTags,
  })
}

export default async function Home(props) {
  const { books, tags } = props;

  return <div>
    <HomePage books={books} tags={tags} />
    <ToastContainerWrapper />
  </div>;
}
