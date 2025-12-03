import { Button } from "@garden/ui/components/button";
import { useMemo } from "react";
import { useHealthQuery } from "../../hooks/useHealthQuery";

export function HealthStatus() {
  const { data, isFetching, isError, error, refetch, isSuccess } =
    useHealthQuery(false);

  const apiResponse = useMemo(() => {
    if (!data) return "";
    return `API Message: "${data.message}" | Status: ${data.status} | Timestamp: ${data.timestamp} | Gardeners #: ${data.user_count}`;
  }, [data]);

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
