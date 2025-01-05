import { useLoaderData } from "react-router";
import { useRootContext } from "remix-provider";

export default function Index() {
  const value = useLoaderData<string>();
  const value2 = useRootContext();
  console.log(value2);
  return (
    <div>
      <pre>{value}</pre>
    </div>
  );
}

// At the point of module execution, process.env is available.

export const loader = () => {
  const value = JSON.stringify(process.env.TEST, null, 2);
  return value;
};
