import { Fragment } from "react";
import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

export default function Status() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <Dependencies />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data: status } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Loading...";

  if (!isLoading && status) {
    updatedAtText = new Date(status?.updated_at).toLocaleString("pt-BR");
  }

  return <div>Last update: {updatedAtText}</div>;
}

function Dependencies() {
  const { isLoading, data: status } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    // dedupingInterval: 2000 // -> valor padrão,
  });

  if (isLoading) {
    return undefined;
  }

  return (
    <>
      {/* <pre>{JSON.stringify(status?.dependencies, null, 2)}</pre> */}
      {Object.entries(status?.dependencies).map(([name, args]) => (
        <Dependency key={name} name={name} {...args} />
      ))}
    </>
  );
}

function capitalizeText(text) {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

function formatKey(key) {
  if (typeof key === "string") {
    return key.split("_").map(capitalizeText).join(" ");
  }
}

function Dependency({ name, ...args }) {
  return (
    <div>
      <h2>{capitalizeText(name)}</h2>
      <div>
        {Object.entries(args).map(([key, value]) => (
          <pre key={key}>
            <b>{formatKey(key)}</b>: {value}
          </pre>
        ))}
      </div>
    </div>
  );
}
