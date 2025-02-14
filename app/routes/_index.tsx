import { useLoaderData } from "react-router";
import { useRootContext } from "remix-provider";
import styled from "../css/test.module.css";

export default function Index() {
  const server = useLoaderData<string>();
  const client = useRootContext();
  return (
    <div className={styled.test}>
      <div className="text-blue-600">Client:</div>
      <pre>{JSON.stringify(client, null, 2)}</pre>
      <hr />
      <div className="text-red-600">Server:</div>
      <pre>{server}</pre>
    </div>
  );
}

// At the point of module execution, process.env is available.

export const loader = () => {
  const value = JSON.stringify(process.env, null, 2);
  return value;
};
