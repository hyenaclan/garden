import { Button } from "@garden/ui/components/button";
import { useHealthQuery } from "./useHealthQuery";

export function HealthStatus() {
  const { data, isFetching, isError, error, refetch, isSuccess } =
    useHealthQuery(false);

  const apiResponse = data
    ? `API Message: "${data.message}" | Status: ${data.status} | Timestamp: ${data.timestamp} | Gardeners #: ${data.user_count}`
    : "";

  return (
    <section>
      <Button onClick={() => refetch()} disabled={isFetching}>
        Fetch from API
      </Button>
      <div className="mt-4 font-bold">API Output:</div>
      {isError && (
        <p>{error instanceof Error ? error.message : "Error fetching data"}</p>
      )}
      <p>
        {isSuccess && apiResponse
          ? apiResponse
          : isFetching
            ? "Fetching data..."
            : "Click button to fetch data"}
      </p>
    </section>
  );
}
