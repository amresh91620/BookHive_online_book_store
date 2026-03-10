import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadAuth, getToken } from "@/utils/storage";

export default function AuthTestPage() {
  const { user, token } = useSelector((state) => state.auth);

  const checkAuth = () => {
    console.log("=== AUTH CHECK ===");
    console.log("Redux State - User:", user);
    console.log("Redux State - Token:", token);
    
    const stored = loadAuth();
    console.log("LocalStorage - User:", stored.user);
    console.log("LocalStorage - Token:", stored.token);
    
    const tokenFromGetter = getToken();
    console.log("getToken() result:", tokenFromGetter);
    
    console.log("=== END CHECK ===");
  };

  const clearStorage = () => {
    localStorage.clear();
    console.log("Storage cleared");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container-shell max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Redux State:</h3>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                {JSON.stringify({ user, token: token ? "EXISTS" : "NULL" }, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">LocalStorage:</h3>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                {localStorage.getItem('bookhive_auth') || "EMPTY"}
              </pre>
            </div>

            <div className="flex gap-2">
              <Button onClick={checkAuth}>
                Check Console
              </Button>
              <Button onClick={clearStorage} variant="destructive">
                Clear Storage
              </Button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Login first</li>
                <li>Come back to this page</li>
                <li>Click "Check Console"</li>
                <li>Open browser console (F12)</li>
                <li>Check if token exists</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
