import { useLoaderData } from "react-router";
import { useRootContext } from "remix-provider";

export default function Index() {
  const server = useLoaderData<string>();
  const client = useRootContext();
  return (
    <div>
      <div>Client:</div>
      <pre>{JSON.stringify(client, null, 2)}</pre>
      <hr />
      <div>Server:</div>
      <pre>{server}</pre>
    </div>
  );
}

// At the point of module execution, process.env is available.

export const loader = () => {
  const value = JSON.stringify(process.env, null, 2);
  return value;
};
