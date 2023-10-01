
"use client";
import { useRouter } from "next/navigation";
function DemoComponent() {
  const router = useRouter();

  return (<>

    <li>
      <div onClick={() => {
        router.push(`/book/1`);
      }}>
        Dynamic nested Route
      </div>
    </li></>);
}

export default DemoComponent;