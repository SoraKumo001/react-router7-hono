import { useLoaderData } from "react-router";

export default function Index() {
  const value = useLoaderData<string>();
  return <pre>{value}</pre>;
}

// At the point of module execution, process.env is available.

export const loader = () => {
  const value = JSON.stringify(process.env.TEST, null, 2);
  return value;
};
