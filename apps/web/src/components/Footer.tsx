export default function Footer() {
  const buildId = import.meta.env.VITE_BUILD_ID;
  const commitSha = import.meta.env.VITE_COMMIT_SHA?.slice(0, 7);

  return (
    <footer className="text-center text-xs text-gray-400 py-10 border-t border-gray-200 mt-16">
      Build #{buildId} ({commitSha})
    </footer>
  );
}
